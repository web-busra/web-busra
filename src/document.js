import {normalizeDesign,templateDesign,cleanText,FONTS,validMediaData,decodeDesign,MAX_LAYERS} from './design.js';
import {rasterDataInfo} from './raster.js';
export const MAX_PAGES=12,MAX_ASSETS=24,MAX_PROJECT_BYTES=20971520,MAX_ASSET_TOTAL=12000000;
const idOK=v=>typeof v==='string'&&/^[a-z][a-z0-9_-]{0,47}$/i.test(v);
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
function importedShape(value){
  if(!record(value)||!Array.isArray(value.pages)||value.pages.length<1||value.pages.length>MAX_PAGES)throw Error('Proje 1–12 geçerli sayfa içermeli.');
  if(value.assets!==undefined&&!Array.isArray(value.assets))throw Error('Projenin görsel listesi geçersiz.');
  if(value.assets?.length>MAX_ASSETS)throw Error('Projede en fazla 24 görsel olabilir.');
  for(const page of value.pages)if(!record(page)||!record(page.design)||!Array.isArray(page.design.layers)||page.design.layers.length>MAX_LAYERS||page.design.layers.some(layer=>!record(layer)||!['motif','text','shape','image','symbol','chart','drawing'].includes(layer.type)))throw Error('Projedeki bir sayfa veya katman geçersiz.');
}
export const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
export function normalizeDocument(input={}){
  const s=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  const rawPages=Array.isArray(s.pages)&&s.pages.length?s.pages:[{id:'page-1',design:s.design||('layers'in s?s:templateDesign('blank'))}],ids=new Set();
  const pages=rawPages.slice(0,MAX_PAGES).map((page,i)=>{let id=idOK(page?.id)?page.id:'page-'+(i+1);const base=id;let duplicate=2;while(ids.has(id)){const suffix='-'+duplicate++;id=base.slice(0,48-suffix.length)+suffix;}ids.add(id);return {id,design:normalizeDesign(page?.design)};});
  let budget=0;const assetIDs=new Set(),assets=[];
  for(const a of (Array.isArray(s.assets)?s.assets:[]).slice(0,MAX_ASSETS)){if(!a||!idOK(a.id)||assetIDs.has(a.id)||!validMediaData(a.data)||!Number.isFinite(a.width)||!Number.isFinite(a.height)||a.width<1||a.height<1||a.width>4096||a.height>4096||budget+a.data.length>MAX_ASSET_TOTAL)continue;const header=rasterDataInfo(a.data);if(!header||header.width!==a.width||header.height!==a.height)continue;assetIDs.add(a.id);budget+=a.data.length;assets.push({id:a.id,name:cleanText(a.name,60,'Görsel',1),data:a.data,width:a.width,height:a.height});}
  const brand=s.brand&&typeof s.brand==='object'?s.brand:{};
  return {version:3,name:cleanText(s.name,60,pages[0].design.name,1),activePage:ids.has(s.activePage)?s.activePage:pages[0].id,pages,assets,brand:{name:cleanText(brand.name,40,'Kişisel marka',1),colors:[0,1,2].map((i)=>typeof brand.colors?.[i]==='string'&&/^#[0-9a-f]{6}$/i.test(brand.colors[i])?brand.colors[i].toUpperCase():['#242B72','#B5B9F0','#DDF592'][i]),font:Object.hasOwn(FONTS,brand.font)?brand.font:'sans'}};
}
export const activeDesign=doc=>doc.pages.find(p=>p.id===doc.activePage)?.design||doc.pages[0].design;
export function mergeAssetLibrary(current,incoming){
  // Both lists come from validated documents. Preserve images across clipboard/project ID collisions.
  const assets=[...current],ids=new Map();for(const a of incoming){const same=assets.find(b=>b.data===a.data&&b.width===a.width&&b.height===a.height);if(same){ids.set(a.id,same.id);continue;}const id=assets.some(b=>b.id===a.id)?uid('asset'):a.id;assets.push({...a,id});ids.set(a.id,id);}if(assets.length>MAX_ASSETS||assets.reduce((n,a)=>n+a.data.length,0)>MAX_ASSET_TOTAL)throw Error('Bu seçim belgenin görsel sınırını aşıyor.');return {assets,ids};
}
export function documentJSON(input){return JSON.stringify({app:'forma-svg-studio',version:3,document:normalizeDocument(input)});}
export function parseDocument(value){if(typeof value!=='string'||value.length>MAX_PROJECT_BYTES||new TextEncoder().encode(value).length>MAX_PROJECT_BYTES)throw Error('Proje dosyası 20 MB sınırını aşıyor.');const p=JSON.parse(value);if(!record(p)||p.app!=='forma-svg-studio')throw Error('Geçerli bir Forma projesi seç.');if(p.version===2&&record(p.design)&&Array.isArray(p.design.layers)){importedShape({pages:[{design:p.design}]});return normalizeDocument({design:p.design});}if(p.version!==3)throw Error('Proje sürümü okunamadı.');importedShape(p.document);const doc=normalizeDocument(p.document);if((p.document.assets||[]).length!==doc.assets.length)throw Error('Projedeki bir görsel geçersiz veya görsel sınırı aşıldı.');return doc;}
export function encodeDocument(input){const doc=normalizeDocument(input);if(doc.assets.length)throw Error('Görselli çalışmaları FORMA dosyası olarak paylaş.');const data=new TextEncoder().encode(JSON.stringify(doc));let bytes='';for(const b of data)bytes+=String.fromCharCode(b);const result='v3.'+btoa(bytes).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');if(result.length>65536)throw Error('Bu belge bağlantı için büyük. FORMA dosyası olarak paylaş.');return result;}
export function decodeDocument(value){if(typeof value!=='string')throw Error('Geçersiz bağlantı.');if(/^v[12]\./.test(value))return normalizeDocument({design:decodeDesign(value)});if(value.length>65536||!/^v3\.[a-zA-Z0-9_-]+$/.test(value))throw Error('Geçersiz bağlantı.');const bytes=Uint8Array.from(atob(value.slice(3).replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)),doc=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));importedShape(doc);if(doc.assets?.length)throw Error('Geçersiz bağlantı.');return normalizeDocument(doc);}
export function createDocumentHistory(initial){
  // Image strings are immutable and shared; history snapshots only clone editable metadata.
  const vault=new Map(),lookup=new Map();let entries=[],index=-1,assetSequence=0;
  const pack=value=>{const doc=normalizeDocument(value),keys=doc.assets.map(a=>{const candidates=lookup.get(a.id)||[];let key=candidates.find(k=>{const v=vault.get(k);return v&&v.data===a.data&&v.name===a.name&&v.width===a.width&&v.height===a.height;});if(!key){key='asset-version-'+(++assetSequence);vault.set(key,Object.freeze({...a}));lookup.set(a.id,[...candidates,key]);}return key;});return {...doc,assets:keys};};
  const unpack=value=>structuredClone({...value,assets:[]});
  const current=()=>{const value=entries[index],copy=unpack(value);copy.assets=value.assets.map(id=>vault.get(id));return copy;};
  const prune=()=>{const used=new Set(entries.flatMap(e=>e.assets));for(const id of vault.keys())if(!used.has(id))vault.delete(id);for(const [id,keys]of lookup){const remaining=keys.filter(k=>vault.has(k));if(remaining.length)lookup.set(id,remaining);else lookup.delete(id);}};
  const api={get current(){return current();},get canUndo(){return index>0;},get canRedo(){return index<entries.length-1;},setActivePage(id){if(entries[index].pages.some(p=>p.id===id))entries[index].activePage=id;},commit(value){const next=pack(value);if(index>=0&&JSON.stringify(next)===JSON.stringify(entries[index]))return;entries=entries.slice(0,index+1);entries.push(next);if(entries.length>60)entries.shift();index=entries.length-1;prune();},undo(){if(index>0)index--;return current();},redo(){if(index<entries.length-1)index++;return current();}};api.commit(initial);return api;
}
export function alignLayers(design,ids,mode,bounds){
  const s=normalizeDesign(design),chosen=s.layers.filter(l=>ids.includes(l.id)&&!l.locked),f=s.format==='custom'?{width:s.canvasWidth,height:s.canvasHeight}:null;
  if(!chosen.length)return s;
  const entries=chosen.map(l=>({l,b:bounds[l.id]})).filter(e=>e.b);if(!entries.length)return s;
  const left=Math.min(...entries.map(e=>e.b.x)),right=Math.max(...entries.map(e=>e.b.x+e.b.width)),top=Math.min(...entries.map(e=>e.b.y)),bottom=Math.max(...entries.map(e=>e.b.y+e.b.height));
  const patches=new Map();
  if(mode==='distribute-x'||mode==='distribute-y'){
    if(entries.length<3)return s;const axis=mode==='distribute-x'?'x':'y',dim=axis==='x'?'width':'height';entries.sort((a,b)=>a.b[axis]-b.b[axis]);const first=entries[0].b[axis],last=entries.at(-1).b[axis]+entries.at(-1).b[dim],total=entries.reduce((a,e)=>a+e.b[dim],0),gap=(last-first-total)/(entries.length-1);let cursor=first;for(const e of entries){patches.set(e.l.id,{dx:axis==='x'?cursor-e.b[axis]:0,dy:axis==='y'?cursor-e.b[axis]:0});cursor+=e.b[dim]+gap;}
  }else for(const {l,b}of entries)patches.set(l.id,{dx:mode==='left'?left-b.x:mode==='right'?right-b.x-b.width:mode==='center-x'?(left+right)/2-b.x-b.width/2:0,dy:mode==='top'?top-b.y:mode==='bottom'?bottom-b.y-b.height:mode==='center-y'?(top+bottom)/2-b.y-b.height/2:0});
  return { ...s,layers:s.layers.map(l=>{const p=patches.get(l.id),size=bounds.canvas||f;return p&&size?{...l,x:l.x+p.dx/size.width*100,y:l.y+p.dy/size.height*100}:l;})};
}
