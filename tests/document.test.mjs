import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDocument,documentJSON,parseDocument,encodeDocument,decodeDocument,createDocumentHistory,MAX_PAGES,alignLayers,mergeAssetLibrary} from '../src/document.js';
import {templateDesign,normalizeDesign,buildSVG,dimensions,SYMBOLS} from '../src/design.js';
import {pdfBytes,zipFiles,crc32} from '../src/export.js';
import {rasterHeader,rasterDataInfo} from '../src/raster.js';
const pixel='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+afoYAAAAASUVORK5CYII=';
const asset={id:'asset-test',name:'Original',data:pixel,width:1,height:1};

test('Documents preserve page ordering, active page, brand kit and editable content',()=>{
  const doc=normalizeDocument({name:'Büşra’nın stüdyosu',activePage:'second',pages:[{id:'first',design:templateDesign('social-story')},{id:'second',design:templateDesign('slide-data')}],brand:{name:'Web Büşra',colors:['#123456','#ABCDEF','#FEDCBA'],font:'humanist'}});
  assert.deepEqual(parseDocument(documentJSON(doc)),doc);assert.deepEqual(decodeDocument(encodeDocument(doc)),doc);assert.equal(doc.activePage,'second');assert.equal(doc.pages[1].design.layers.find(l=>l.type==='chart').chart,'bar');
});
test('Import boundaries reject malformed documents, scripts as images, duplicate assets and overlong files',()=>{
  for(const bad of ['','null','[]','{}','{"app":"other","version":3}','x'.repeat(10485761),'replaced'])assert.throws(()=>parseDocument(bad));
  for(const data of ['https://evil.test/image.png','data:image/svg+xml;base64,PHN2Zy8+','data:text/html;base64,PHNjcmlwdD4=','javascript:alert(1)']){const raw={app:'forma-svg-studio',version:3,document:{pages:[{id:'page-1',design:templateDesign('orbit')}],assets:[{...asset,data}]}};assert.throws(()=>parseDocument(JSON.stringify(raw)));}
  const bounded=normalizeDocument({pages:Array.from({length:30},()=>({id:'same',design:templateDesign('orbit')})),activePage:'missing',assets:[asset,asset],brand:{font:'__proto__',colors:['url(evil)']}});assert.equal(bounded.pages.length,MAX_PAGES);assert.equal(new Set(bounded.pages.map(p=>p.id)).size,MAX_PAGES);assert.equal(bounded.activePage,bounded.pages[0].id);assert.equal(bounded.assets.length,1);assert.equal(bounded.brand.font,'sans');assert.equal(bounded.brand.colors[0],'#242B72');
});
test('Version 2 projects and earlier shared links migrate into a single editable page',()=>{
  const design=templateDesign('orbit'),doc=parseDocument(JSON.stringify({app:'forma-svg-studio',version:2,design}));assert.equal(doc.version,3);assert.equal(doc.pages.length,1);assert.equal(doc.pages[0].design.template,'orbit');const old='v1.'+Buffer.from(JSON.stringify({template:'orbit',text:'İŞ',caption:'Büşra'})).toString('base64url');assert.equal(decodeDocument(old).pages[0].design.layers.find(l=>l.id==='title').text,'İŞ');
});

test('Malformed imported pages, excessive structures and non-array assets are rejected instead of silently discarded',()=>{
  const page={id:'page-1',design:templateDesign('blank')};
  const malformed=[{pages:[null]},{pages:[{}]},{pages:[{design:[]}]},{pages:[page],assets:{}},{pages:Array.from({length:13},()=>page)},{pages:[{design:{layers:Array.from({length:41},()=>({type:'text'}))}}]},{pages:[{design:{layers:[null]}}]},{pages:[{design:{layers:[{type:'script'}]}}]}];
  for(const document of malformed){assert.throws(()=>parseDocument(JSON.stringify({app:'forma-svg-studio',version:3,document})));assert.throws(()=>decodeDocument('v3.'+Buffer.from(JSON.stringify(document)).toString('base64url')));}
  assert.throws(()=>parseDocument(JSON.stringify({app:'forma-svg-studio',version:2,design:{layers:[null]}})));
});

test('Duplicate maximum-length page IDs stay bounded and survive project and sharing round trips',()=>{
  const id='p'.repeat(48),doc=normalizeDocument({pages:Array.from({length:12},()=>({id,design:templateDesign('blank')}))});
  assert.equal(new Set(doc.pages.map(p=>p.id)).size,12);
  for(const page of doc.pages)assert.match(page.id,/^[a-z][a-z0-9_-]{0,47}$/i);
  assert.deepEqual(parseDocument(documentJSON(doc)),doc);assert.deepEqual(decodeDocument(encodeDocument(doc)),doc);
});
test('Portable projects include bounded raster assets, while image-based links require a file',()=>{
  const doc=normalizeDocument({design:{...templateDesign('orbit'),layers:[{id:'photo',type:'image',asset:asset.id,width:200,height:100,mask:'ellipse',cropZoom:150,saturation:0}]},assets:[asset]});assert.deepEqual(parseDocument(documentJSON(doc)),doc);assert.throws(()=>encodeDocument(doc),/FORMA/);const svg=buildSVG(doc.pages[0].design,{assets:doc.assets});assert.ok(svg.includes('href="'+pixel+'"'));assert.ok(svg.includes('clipPath'));assert.ok(svg.includes('feColorMatrix'));assert.ok(!/<script|foreignObject|https?:\/\/(?!www.w3.org)/.test(svg));
  const incoming={...asset,data:pixel.replace('AAAAASUVORK5CYII=','AAAAASUVORK5CYIA=')},merged=mergeAssetLibrary([asset],[incoming]);assert.equal(merged.assets.length,2);assert.notEqual(merged.ids.get(asset.id),asset.id);assert.equal(merged.assets.find(a=>a.id===merged.ids.get(asset.id)).data,incoming.data);assert.equal(mergeAssetLibrary([asset],[asset]).assets.length,1);
});
test('Undo restores independent asset versions even when an imported file reuses the same asset ID',()=>{
  const initial=normalizeDocument({design:templateDesign('orbit'),assets:[asset]}),history=createDocumentHistory(initial),changed=normalizeDocument({...initial,name:'Second document',assets:[{...asset,name:'Changed',data:pixel.replace('AAAAASUVORK5CYII=','AAAAASUVORK5CYIA=')}]});history.commit(changed);assert.equal(history.current.assets[0].name,'Changed');const restored=history.undo();assert.equal(restored.assets[0].name,'Original');assert.equal(restored.assets[0].data,pixel);assert.throws(()=>{restored.assets[0].name='Mutation';});restored.pages[0].design.layers[0].x=100;assert.notEqual(history.current.pages[0].design.layers[0].x,100);assert.equal(history.redo().name,'Second document');
});
test('Page navigation updates the active view without adding a content undo step',()=>{
  const doc=normalizeDocument({pages:[{id:'a',design:templateDesign('orbit')},{id:'b',design:templateDesign('bloom')}]}),history=createDocumentHistory(doc);history.setActivePage('b');assert.equal(history.canUndo,false);assert.equal(history.current.activePage,'b');history.commit({...history.current,name:'Edit'});assert.equal(history.undo().activePage,'b');
});
test('Multi-object alignment and spacing use actual canvas coordinates and leave locked objects intact',()=>{
  const design=normalizeDesign({format:'square',layers:[{id:'a',type:'shape',x:20,y:20},{id:'b',type:'shape',x:40,y:40},{id:'c',type:'shape',x:80,y:80},{id:'locked',type:'shape',x:90,y:90,locked:true}]}),bounds={canvas:{width:512,height:512},a:{x:50,y:50,width:40,height:40},b:{x:120,y:100,width:60,height:60},c:{x:300,y:200,width:40,height:40}};
  const aligned=alignLayers(design,['a','b','c','locked'],'left',bounds);assert.equal(aligned.layers[0].x,20);assert.ok(aligned.layers[1].x<40);assert.equal(aligned.layers[3].x,90);const spaced=alignLayers(design,['a','b','c'],'distribute-x',bounds);assert.ok(spaced.layers[1].x>40);assert.equal(spaced.layers[0].x,20);assert.equal(spaced.layers[2].x,80);
});
test('Custom canvas dimensions, effects, rich text, charts and all symbols export safe standalone SVG',()=>{
  const s=normalizeDesign({format:'custom',canvasWidth:700,canvasHeight:300,backgroundStyle:'linear',layers:[{id:'text',type:'text',text:'İyi fikirler',italic:true,decoration:'underline',effect:'outline'},{id:'chart',type:'chart',chart:'donut',values:[10,20,30],labels:['A','B','C'],width:200,height:180},{id:'icon',type:'symbol',symbol:'heart',width:70,height:70,effect:'soft'}]});const d=dimensions(s);assert.equal(d.width,700);assert.equal(d.exportWidth,1024);assert.equal(d.exportHeight,439);const svg=buildSVG(s);assert.ok(svg.includes('<linearGradient'));assert.ok(svg.includes('text-decoration="underline"'));assert.ok(svg.includes('font-style="italic"'));assert.ok(svg.includes('feDropShadow'));assert.ok(svg.includes('pathLength="100"'));for(const symbol of Object.keys(SYMBOLS))assert.ok(!buildSVG({...s,layers:[{id:'symbol',type:'symbol',symbol}]}).includes('undefined'));
});
test('Freehand vector strokes have bounded numeric points and survive a project round trip',()=>{
  const d=normalizeDesign({layers:[{id:'pen',type:'drawing',points:[[0,0],[10,20],[30,15],['" onclick="x',0],[Infinity,2]],strokeWidth:99,fill:'primary'}]}),layer=d.layers[0];assert.equal(layer.points.length,3);assert.equal(layer.strokeWidth,30);assert.ok(buildSVG(d).includes('points="0,0 10,20 30,15"'));assert.deepEqual(parseDocument(documentJSON({design:d})).pages[0].design,d);
});
test('Raster signatures, declared dimensions and pixel budgets are checked before browser decoding',()=>{
  assert.deepEqual(rasterDataInfo(pixel),{type:'image/png',width:1,height:1});assert.equal(rasterDataInfo(pixel.replace('image/png','image/jpeg')),null);assert.equal(rasterHeader(new Uint8Array(80)),null);const large=Uint8Array.from(atob(pixel.split(',')[1]),c=>c.charCodeAt(0));new DataView(large.buffer).setUint32(16,100000);new DataView(large.buffer).setUint32(20,100000);assert.equal(rasterHeader(large),null);const doc=normalizeDocument({assets:[{...asset,width:200,height:200}]});assert.equal(doc.assets.length,0);
});
test('PDF output has valid object offsets, page references, image bytes and a complete xref table',()=>{
  const bytes=pdfBytes([{jpeg:new Uint8Array([255,216,255,217]),pixelWidth:1,pixelHeight:1,width:300,height:200},{jpeg:new Uint8Array([255,216,255,217]),pixelWidth:1,pixelHeight:1,width:400,height:300}]),text=new TextDecoder('latin1').decode(bytes);assert.ok(text.startsWith('%PDF-1.4'));assert.ok(text.includes('/Count 2'));assert.ok(text.endsWith('%%EOF'));const xref=Number(/startxref\n(\d+)/.exec(text)[1]);assert.equal(new TextDecoder().decode(bytes.slice(xref,xref+4)),'xref');for(const [offset]of text.matchAll(/(\d{10}) 00000 n /g)){const position=Number(offset.slice(0,10));assert.match(new TextDecoder().decode(bytes.slice(position,position+15)),/^\d+ 0 obj/);}
});
test('Multi-page ZIP contains correctly sized UTF-8 entries, CRC32 values and central directory offsets',async()=>{
  assert.equal(crc32(new TextEncoder().encode('123456789')),0xCBF43926);const blob=await zipFiles([{name:'sayfa-01.svg',data:'<svg/>'},{name:'sayfa-02.svg',data:'<svg>İŞÇ</svg>'}]),bytes=new Uint8Array(await blob.arrayBuffer()),view=new DataView(bytes.buffer),end=bytes.length-22;assert.equal(view.getUint32(0,true),0x04034B50);assert.equal(view.getUint32(end,true),0x06054B50);assert.equal(view.getUint16(end+10,true),2);const central=view.getUint32(end+16,true);assert.equal(view.getUint32(central,true),0x02014B50);assert.equal(view.getUint32(central+16,true),crc32(new TextEncoder().encode('<svg/>')));assert.equal(view.getUint32(central+24,true),6);
});
