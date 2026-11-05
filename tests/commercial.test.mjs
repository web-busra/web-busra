import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {COMMERCIAL_TEMPLATES} from '../src/commercial.js';
import {PHOTO_CATALOG} from '../src/photos.js';
import {templateDesign,buildSVG,normalizeDesign,fittedFontSize,dimensions} from '../src/design.js';
import {normalizeDocument,documentJSON,parseDocument,MAX_ASSETS,MAX_PROJECT_BYTES} from '../src/document.js';
import {rasterDataInfo} from '../src/raster.js';

test('Seventy-two business compositions have sector-specific content and eight templates per sector/use group',()=>{
  assert.equal(COMMERCIAL_TEMPLATES.length,72);for(const category of ['hotel','tourism','pilates','meeting','realestate','hair','beauty','automotive','campaign'])assert.equal(COMMERCIAL_TEMPLATES.filter(t=>t.category===category).length,8);assert.ok(new Set(COMMERCIAL_TEMPLATES.map(t=>t.composition)).size>=7);
  for(const t of COMMERCIAL_TEMPLATES){const s=templateDesign(t.id);assert.ok(s.layers.some(l=>l.id==='hero'&&l.type==='image'));for(const id of ['brand','title','price','details','cta','contact'])assert.ok(s.layers.some(l=>l.id===id&&l.type==='text'),t.id+' has editable '+id);assert.ok(PHOTO_CATALOG.some(p=>p.id===t.photo));assert.ok(s.layers.length<=40);for(const l of s.layers.filter(l=>l.type==='text')){assert.ok(l.maxWidth>0);assert.ok(Number.isFinite(fittedFontSize(l)));assert.ok(fittedFontSize(l)>=6);}}
});
test('All sixteen bundled local JPEGs match their declared dimensions and have bounded encoded data',async()=>{
  assert.equal(PHOTO_CATALOG.length,16);assert.equal(new Set(PHOTO_CATALOG.map(p=>p.path)).size,16);for(const p of PHOTO_CATALOG){assert.match(p.path,/^assets\/photos\/[a-z-]+\.jpg$/);const bytes=await readFile(new URL('../'+p.path,import.meta.url)),data='data:image/jpeg;base64,'+bytes.toString('base64');assert.ok(bytes.length<1000000);assert.deepEqual(rasterDataInfo(data),{type:'image/jpeg',width:p.width,height:p.height});}
});
test('Business SVG exports embed raster bytes and remain portable without relative or remote image URLs',async()=>{
  const assets=await Promise.all(PHOTO_CATALOG.map(async p=>({id:p.asset,name:p.name,width:p.width,height:p.height,data:'data:image/jpeg;base64,'+(await readFile(new URL('../'+p.path,import.meta.url))).toString('base64')})));
  for(const t of COMMERCIAL_TEMPLATES){const s=templateDesign(t.id),svg=buildSVG(s,{assets});assert.ok(svg.includes('<image href="data:image/jpeg;base64,'));assert.ok(!/href="(?:https?:|assets\/)/.test(svg));assert.ok(!/<script|foreignObject|<[^>]*\son\w+=/i.test(svg));}
  const doc=normalizeDocument({design:templateDesign('estate-openhouse'),assets});assert.equal(doc.assets.length,16);assert.deepEqual(parseDocument(documentJSON(doc)),doc);
});
test('Native social dimensions match square, portrait and story business templates',()=>{
  for(const [template,width,height]of [['estate-signature',1080,1350],['estate-rental',1080,1080],['hair-story',1080,1920],['auto-banner',1920,1080]]){const f=dimensions(templateDesign(template));assert.equal(f.exportWidth,width);assert.equal(f.exportHeight,height);}
});
test('Automatic text fitting bounds business text while malicious fitting and gradient values are ignored',()=>{
  const normal=normalizeDesign({layers:[{id:'fit',type:'text',text:'Çok uzun işletme ve kampanya başlığı',fontSize:80,maxWidth:220},{id:'safe',type:'shape',gradient:'url(https://evil.test)',fill:'" onload="alert(1)'}]});assert.ok(fittedFontSize(normal.layers[0])<80);const svg=buildSVG(normal);assert.ok(!svg.includes('https://evil.test'));assert.ok(!/<[^>]*onload=/.test(svg));const wide=normalizeDesign({...normal,layers:[{...normal.layers[0],maxWidth:Infinity}]});assert.equal(wide.layers[0].maxWidth,0);
});
test('Commercial project budgets allow the bundled library and reject oversized valid JSON before parsing',()=>{
  assert.equal(MAX_ASSETS,24);assert.equal(MAX_PROJECT_BYTES,20971520);assert.throws(()=>parseDocument(' '.repeat(MAX_PROJECT_BYTES)+'{}'),/20 MB/);
});
