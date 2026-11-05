import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_DESIGN,TEMPLATES,PALETTES,FORMATS,MAX_LAYERS,normalizeDesign,templateDesign,buildSVG,encodeDesign,decodeDesign,createHistory,readableInk,dimensions,parseProject,projectJSON,cleanText} from '../src/design.js';

test('72 business compositions span nine categories and render without external resources',()=>{
  assert.equal(TEMPLATES.length,72);assert.equal(new Set(TEMPLATES.map(t=>t.id)).size,72);assert.equal(new Set(TEMPLATES.map(t=>t.category)).size,9);
  const output=new Set();
  for(const template of TEMPLATES){const state=templateDesign(template.id),svg=buildSVG(state);output.add(svg);assert.ok(svg.startsWith('<svg'));assert.ok(svg.endsWith('</svg>'));assert.ok(!/<(?:script|foreignObject|image)\b|<[^>]*\s(?:href|onload)=|https?:\/\/(?!www.w3.org\/2000\/svg)/i.test(svg));assert.ok(state.layers.length>=3);assert.match(svg,/clip-path="url\(#forma-clip\)"/);}
  assert.equal(output.size,72);
});
test('Every canvas format exports proportional dimensions; selected UI never enters downloads',()=>{
  for(const format of Object.keys(FORMATS))for(const size of [512,1024,2048,4096]){const s=normalizeDesign({...DEFAULT_DESIGN,format,size}),d=dimensions(s),svg=buildSVG(s);assert.equal(Math.max(d.exportWidth,d.exportHeight),size);assert.ok(Math.abs(d.exportWidth/d.exportHeight-d.width/d.height)<.004);assert.ok(svg.includes(`width="${d.exportWidth}" height="${d.exportHeight}"`));assert.ok(svg.includes(`viewBox="0 0 ${d.width} ${d.height}"`));assert.ok(!svg.includes('data-layer'));assert.ok(!svg.includes('class="selection"'));}
  assert.ok(buildSVG(DEFAULT_DESIGN,{editor:true,selected:'title'}).includes('class="selection"'));
});
test('User text, colors, IDs, fonts, names and shape values cannot inject SVG',()=>{
  const text='"><image href="https://bad.test" onload="alert(1)"/>\nİŞÇ & < >';
  const s=normalizeDesign({...DEFAULT_DESIGN,name:text,background:'url(https://bad.test)',primary:'red" onload="alert(1)',layers:[{id:'"><script>',type:'text',text,font:'" onload="alert(1)',fill:'url(https://bad.test)',align:'start" onclick="alert(1)',fontSize:Infinity,x:NaN,name:'<img src=x>'}]});
  const svg=buildSVG(s,{prefix:'"><script>alert(1)</script>',editor:true,selected:s.layers[0].id});assert.ok(!/<(?:script|image|foreignObject)\b|<[^>]*\s(?:onload|href|onclick)=/i.test(svg));assert.ok(svg.includes('&lt;image'));assert.ok(svg.includes('İŞÇ &amp; &lt; &gt;'));assert.ok(svg.includes('id="forma-title"'));assert.equal(s.layers[0].font,'sans');assert.equal(s.layers[0].x,50);
});
test('Layer count, identities, numeric limits and safe properties are normalized',()=>{
  const hostile=JSON.parse('{"__proto__":{"polluted":true},"format":"__proto__","size":90000,"layers":[]}');hostile.layers=Array.from({length:40},(_,i)=>({id:'same',type:i===0?'script':'text',text:'A',x:999,y:-999,scale:-5,opacity:200,rotation:999,tracking:-100,__proto__:{polluted:true},href:'https://bad.test'}));
  const s=normalizeDesign(hostile);assert.ok(s.layers.length<=MAX_LAYERS);assert.equal(new Set(s.layers.map(l=>l.id)).size,s.layers.length);assert.equal(s.layers[0].x,150);assert.equal(s.layers[0].y,-50);assert.equal(s.layers[0].rotation,180);assert.equal(s.layers[0].scale,5);assert.equal(s.layers[0].opacity,100);assert.equal(s.layers[0].tracking,-8);assert.equal(s.size,1024);assert.equal({}.polluted,undefined);assert.ok(!JSON.stringify(s).includes('href'));assert.ok(!Object.hasOwn(s,'__proto__'));
});
test('Visibility, stacking order, transforms and text line breaks survive export',()=>{
  const s=normalizeDesign({...DEFAULT_DESIGN,layers:[{id:'bottom',type:'text',text:'BOTTOM',x:25,y:30,rotation:45,scale:120,opacity:50},{id:'hidden',type:'text',text:'HIDDEN',visible:false},{id:'top',type:'text',text:'TOP\nSECOND',locked:true}]});
  const svg=buildSVG(s);assert.ok(svg.indexOf('BOTTOM')<svg.indexOf('TOP'));assert.ok(!svg.includes('HIDDEN'));assert.ok(svg.includes('translate(128.00 192.00) rotate(45) scale(1.2 1.2)'));assert.ok(svg.includes('opacity="0.5"'));assert.equal((svg.match(/<tspan/g)||[]).length,3);assert.ok(svg.includes('SECOND'));
});
test('Unicode project files and v2 links round trip without losing editable layers',()=>{
  const s=normalizeDesign({...DEFAULT_DESIGN,name:'Büşra’nın çalışması ✳',layers:DEFAULT_DESIGN.layers.map(l=>l.type==='text'?{...l,text:'İŞÇ / Çakıl 🐈'}:l)});
  assert.deepEqual(parseProject(projectJSON(s)),s);assert.deepEqual(decodeDesign(encodeDesign(s)),s);assert.ok(encodeDesign(s).startsWith('v2.'));
  for(const bad of ['','{}','null','[]','{"app":"other","version":2,"design":{}}','x'.repeat(140000)])assert.throws(()=>parseProject(bad));
  for(const bad of ['','v3.abc','v2.!!!','v2.'+'a'.repeat(262145),'v1.e30=','v2.bnVsbA','v2.W10'])assert.throws(()=>decodeDesign(bad));
});
test('Maximum-layer Unicode and combining sequences stay inside portable file and sharing limits',()=>{
  const s=normalizeDesign({...DEFAULT_DESIGN,name:'🧑🏾‍🎨'.repeat(60),layers:Array.from({length:24},(_,i)=>({id:'layer-'+i,type:'text',name:'🧑🏾‍🎨'.repeat(32),text:'🧑🏾‍🎨'.repeat(160)}))}),link=encodeDesign(s),file=projectJSON(s);assert.ok(link.length<=262144);assert.ok(new TextEncoder().encode(file).length<=131072);assert.deepEqual(decodeDesign(link),s);assert.deepEqual(parseProject(file),s);assert.ok(cleanText('a'+'\u0301'.repeat(4000),160).length<2048);
});
test('Version 1 collections and shared designs migrate into independently editable layers',()=>{
  const old={template:'orbit',text:'İŞÇ',caption:'Büşra’nın tasarımı',font:'sans',rotation:-45,scale:85,background:'#262D80',primary:'#B7BCF8',accent:'#D8F275',size:512};
  const link='v1.'+Buffer.from(JSON.stringify(old)).toString('base64url'),s=decodeDesign(link);assert.equal(s.version,3);assert.equal(s.template,'orbit');assert.equal(s.layers.find(l=>l.id==='title').text,'İŞÇ');assert.equal(s.layers.find(l=>l.id==='subtitle').text,old.caption);assert.equal(s.layers[0].rotation,-45);assert.equal(s.layers[0].scale,100);assert.equal(s.size,512);assert.equal(s.background,old.background);
});
test('History is a deep snapshot, supports branching and stays bounded to 60 states',()=>{
  const history=createHistory(DEFAULT_DESIGN),copy=history.current;copy.layers[0].x=100;assert.notEqual(history.current.layers[0].x,100);
  history.commit({...history.current,name:'A'});history.commit({...history.current,name:'B'});assert.equal(history.undo().name,'A');assert.equal(history.redo().name,'B');history.undo();history.commit({...history.current,name:'C'});assert.equal(history.canRedo,false);assert.equal(history.undo().name,'A');
  for(let i=0;i<100;i++)history.commit({...history.current,name:String(i)});let count=0;while(history.canUndo){history.undo();count++;}assert.equal(count,59);
});
test('Transparency omits only the canvas background, and graphemes and controls are safe',()=>{
  const s=normalizeDesign({...DEFAULT_DESIGN,transparent:true,pattern:'none'}),svg=buildSVG(s);assert.ok(!svg.includes('<rect width="512" height="640" fill="'+s.background+'"/>'));assert.equal(readableInk('#FFFFFF'),'#171B26');assert.equal(readableInk('#000000'),'#FFFCF4');assert.equal(cleanText('İŞÇÖ',3),'İŞÇ');assert.equal(cleanText('a\u202E\u0000b'),'ab');assert.equal(cleanText('a\nb\nc\nd\ne'),'a\nb\nc\nd\ne');
});
test('All palette, template and texture combinations produce deterministic safe vector output',()=>{
  assert.equal(PALETTES.length,20);
  for(const t of TEMPLATES)for(const p of PALETTES)for(const pattern of ['none','dots','grid','diagonal']){const s=normalizeDesign({...templateDesign(t.id),...p,pattern}),svg=buildSVG(s);assert.equal(svg,buildSVG(s));assert.ok(!svg.includes('NaN'));assert.ok(!svg.includes('undefined'));assert.ok(!/<script|<foreignObject|<image|<[^>]+\son\w+=/i.test(svg));}
});
