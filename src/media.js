import {uid} from './document.js';
import {rasterHeader} from './raster.js';
const readData=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Görsel okunamadı.'));r.readAsDataURL(blob);});
export async function importImage(file){
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8388608)throw Error('8 MB altında PNG, JPG veya WebP seç.');
  const header=rasterHeader(new Uint8Array(await file.arrayBuffer()));
  if(!header||header.type!==file.type)throw Error('Görsel içeriği geçersiz veya 20 megapiksel sınırını aşıyor.');
  const bitmap=await createImageBitmap(file);try{if(bitmap.width*bitmap.height>20000000)throw Error('Görsel en fazla 20 megapiksel olabilir.');const factor=Math.min(1,1800/Math.max(bitmap.width,bitmap.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(bitmap.width*factor));c.height=Math.max(1,Math.round(bitmap.height*factor));const ctx=c.getContext('2d');if(!ctx)throw Error('Görsel işlenemedi.');ctx.drawImage(bitmap,0,0,c.width,c.height);let blob=await new Promise(r=>c.toBlob(r,'image/webp',.88));if(!blob)throw Error('Görsel dönüştürülemedi.');if(blob.size>1000000){blob=await new Promise(r=>c.toBlob(r,'image/webp',.65));if(!blob||blob.size>1000000)throw Error('Görsel çok ayrıntılı. Daha küçük bir dosya seç.');}return {id:uid('asset'),name:file.name.replace(/\.[^.]+$/,'').slice(0,60),data:await readData(blob),width:c.width,height:c.height};}finally{bitmap.close();}
}
export async function validateAssets(assets){for(const a of assets){const image=new Image();await new Promise((resolve,reject)=>{image.onload=()=>{if(image.naturalWidth!==a.width||image.naturalHeight!==a.height)reject(Error('Görsel boyutu doğrulanamadı.'));else resolve();};image.onerror=()=>reject(Error('Proje görseli okunamadı.'));image.src=a.data;});}}
