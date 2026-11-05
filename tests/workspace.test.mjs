import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TEMPLATES,dimensions} from '../src/design.js';
import {normalizeFavorites,searchTemplates,blankDesign,fold} from '../src/workspace-model.js';

test('Turkish discovery supports accents, unaccented input and multiple search words',()=>{
  assert.equal(fold('IŞIK İSTANBUL Güzellik'),'isik istanbul guzellik');
  assert.ok(searchTemplates({query:'guzellik'}).length>=8);
  const found=searchTemplates({query:'tas ev emlak'});
  assert.ok(found.some(t=>t.id==='estate-signature'));
  assert.equal(searchTemplates({query:'olmayan-şablon-123'}).length,0);
});
test('Category, format and favorites intersect, with stable curated and Turkish alphabetical ordering',()=>{
  const favorites=normalizeFavorites(['estate-signature','estate-signature','unknown',null,'hair-story']);
  assert.deepEqual(favorites,['estate-signature','hair-story']);
  assert.deepEqual(normalizeFavorites({length:2}),[]);
  assert.deepEqual(searchTemplates({favorites,category:'realestate',format:'portrait'}).map(t=>t.id),['estate-signature']);
  assert.equal(searchTemplates({favorites:[]}).length,0);
  assert.equal(searchTemplates().length,TEMPLATES.length);
  assert.equal(searchTemplates()[0].id,'hotel-signature');
  const names=searchTemplates({sort:'name'}).map(t=>t.name);
  assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b,'tr')));
});
test('Blank social canvases have actual advertised export dimensions and no hidden template layers',()=>{
  for(const [format,width,height]of [['square',1080,1080],['portrait',1080,1350],['story',1080,1920],['wide',1920,1080]]){
    const design=blankDesign({format,name:'Yeni kampanya'}),size=dimensions(design);
    assert.equal(size.exportWidth,width);assert.equal(size.exportHeight,height);
    assert.equal(design.name,'Yeni kampanya');assert.deepEqual(design.layers,[]);assert.equal(design.background,'#FFFFFF');
  }
  const custom=blankDesign({format:'custom',width:1500,height:800,name:'  Benim projem  '});
  assert.equal(custom.canvasWidth,1500);assert.equal(custom.canvasHeight,800);assert.equal(custom.name,'Benim projem');
  for(const width of [0,127,2049,Infinity,NaN,128.5])assert.throws(()=>blankDesign({format:'custom',width,height:512}));
  assert.throws(()=>blankDesign({format:'__proto__'}));assert.equal(blankDesign({name:'   '}).name,'Adsız tasarım');
});
test('All module DOM bindings exist on their intended entry page, with unique static IDs',async()=>{
  for(const [page,module]of [['index.html','src/workspace.js'],['editor.html','src/app.js']]){
    const html=await readFile(new URL('../'+page,import.meta.url),'utf8'),js=await readFile(new URL('../'+module,import.meta.url),'utf8');
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,page+' repeats an ID');
    const dynamic=page==='editor.html'?new Set(['campaign-']):new Set();
    for(const [,id]of js.matchAll(/\$\('([^']+)'\)/g))if(!dynamic.has(id))assert.ok(ids.includes(id),page+' is missing #'+id);
    assert.match(html,/<html lang="tr">/);assert.match(html,/Content-Security-Policy/);
    assert.doesNotMatch(html,/\son(?:click|load|error)\s*=/i);
    for(const [,path]of html.matchAll(/(?:src|href)="((?:src\/|[a-z-]+\.css|favicon\.svg)[^"]*)"/g))await readFile(new URL('../'+path.split('?')[0],import.meta.url));
  }
});
