// Inspect dimensions before allocating decoded pixel buffers. No markup is parsed.
const tag=(b,i,n)=>String.fromCharCode(...b.subarray(i,i+n));
export function rasterHeader(bytes){
  if(!(bytes instanceof Uint8Array)||bytes.length<24)return null;
  const b=bytes,v=new DataView(b.buffer,b.byteOffset,b.byteLength);
  const output=(type,width,height)=>width>0&&height>0&&width*height<=20000000?{type,width,height}:null;
  if(b[0]===137&&tag(b,1,3)==='PNG'&&b[4]===13&&b[5]===10&&b[6]===26&&b[7]===10&&tag(b,12,4)==='IHDR')return output('image/png',v.getUint32(16),v.getUint32(20));
  if(b[0]===255&&b[1]===216){let p=2;while(p+4<b.length){if(b[p++]!==255)return null;while(b[p]===255)p++;const marker=b[p++];if(marker===217||marker===218)return null;if(marker===1||marker>=208&&marker<=215)continue;if(p+2>b.length)return null;const length=v.getUint16(p);if(length<2||p+length>b.length)return null;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){if(length<8)return null;return output('image/jpeg',v.getUint16(p+5),v.getUint16(p+3));}p+=length;}return null;}
  if(tag(b,0,4)==='RIFF'&&tag(b,8,4)==='WEBP'){let p=12;while(p+8<=b.length){const chunk=tag(b,p,4),length=v.getUint32(p+4,true),start=p+8;if(length>b.length-start)return null;
    if(chunk==='VP8X'&&length>=10)return output('image/webp',1+b[start+4]+(b[start+5]<<8)+(b[start+6]<<16),1+b[start+7]+(b[start+8]<<8)+(b[start+9]<<16));
    if(chunk==='VP8 '&&length>=10&&b[start+3]===157&&b[start+4]===1&&b[start+5]===42)return output('image/webp',v.getUint16(start+6,true)&16383,v.getUint16(start+8,true)&16383);
    if(chunk==='VP8L'&&length>=5&&b[start]===47){const packed=v.getUint32(start+1,true);return output('image/webp',(packed&16383)+1,((packed>>>14)&16383)+1);}p=start+length+(length%2);
  }}return null;
}
const cache=new Map();
export function rasterDataInfo(data){if(cache.has(data))return cache.get(data);if(typeof data!=='string'||data.length>1500000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(data))return null;let result=null;try{const i=data.indexOf(','),raw=atob(data.slice(i+1));result=rasterHeader(Uint8Array.from(raw,c=>c.charCodeAt(0)));if(result?.type!==data.slice(5,data.indexOf(';')))result=null;}catch{return null;}if(cache.size>=24)cache.delete(cache.keys().next().value);cache.set(data,result);return result;}
