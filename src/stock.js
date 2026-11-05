import {PHOTO_CATALOG} from './photos.js';
import {rasterDataInfo} from './raster.js';
import {mergeAssetLibrary} from './document.js';
const cache=new Map();
const asData=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Fotoğraf okunamadı.'));r.readAsDataURL(blob);});
export function stockPhoto(id){
  const photo=PHOTO_CATALOG.find(p=>p.asset===id||p.id===id);if(!photo)return Promise.reject(Error('Fotoğraf bulunamadı.'));
  if(!cache.has(photo.asset))cache.set(photo.asset,(async()=>{const url=new URL('../'+photo.path,import.meta.url);if(url.origin!==location.origin)throw Error('Fotoğraf kaynağı geçersiz.');const response=await fetch(url,{redirect:'error',credentials:'same-origin',cache:'force-cache'});if(!response.ok)throw Error('Şablon fotoğrafı yüklenemedi.');const buffer=await response.arrayBuffer();if(buffer.byteLength>1000000)throw Error('Şablon fotoğrafı boyutu geçersiz.');const data=await asData(new Blob([buffer],{type:'image/jpeg'})),info=rasterDataInfo(data);if(!info||info.width!==photo.width||info.height!==photo.height)throw Error('Şablon fotoğrafı doğrulanamadı.');return Object.freeze({id:photo.asset,name:photo.name,data,width:info.width,height:info.height});})().catch(error=>{cache.delete(photo.asset);throw error;}));
  return cache.get(photo.asset);
}
export async function pageAssets(design,current=[]){const ids=[...new Set(design.layers.filter(l=>l.type==='image'&&PHOTO_CATALOG.some(p=>p.asset===l.asset)&&!current.some(a=>a.id===l.asset)).map(l=>l.asset))],photos=await Promise.all(ids.map(stockPhoto));return mergeAssetLibrary(current,photos).assets;}
export async function hydrateStockDocument(document){let assets=document.assets;for(const p of document.pages)assets=await pageAssets(p.design,assets);return {...document,assets};}
