import {TEMPLATES,CATEGORIES,FORMATS,normalizeDesign,cleanText} from './design.js';

export const FEATURED_IDS=['hotel-signature','tour-coast','pilates-signature','meeting-conference','hotel-suite','tour-valley','pilates-schedule','meeting-agenda','estate-signature','hair-signature','beauty-ritual','auto-signature'];
export const fold=value=>String(value??'').toLocaleLowerCase('tr').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/ı/g,'i');
export function normalizeFavorites(value){return Array.isArray(value)?[...new Set(value.filter(id=>TEMPLATES.some(t=>t.id===id)))]:[];}
export function searchTemplates({query='',category='all',format='all',favorites=null,sort='curated'}={}){
  const words=fold(query).trim().split(/\s+/).filter(Boolean);
  const matches=TEMPLATES.filter(t=>(category==='all'||t.category===category)&&(format==='all'||t.format===format)&&(!favorites||favorites.includes(t.id))&&words.every(word=>fold([t.name,t.title,t.brand,t.purpose,CATEGORIES.find(c=>c.id===t.category)?.name,FORMATS[t.format]?.name].join(' ')).includes(word)));
  if(sort==='name')return matches.sort((a,b)=>a.name.localeCompare(b.name,'tr'));
  return matches.sort((a,b)=>{const x=FEATURED_IDS.indexOf(a.id),y=FEATURED_IDS.indexOf(b.id);return (x<0?100:x)-(y<0?100:y);});
}
export function blankDesign({format='square',width=1080,height=1080,name='Adsız tasarım'}={}){
  if(!Object.hasOwn(FORMATS,format))throw Error('Geçerli bir tuval biçimi seçin.');
  if(format==='custom'&&(!Number.isInteger(Number(width))||!Number.isInteger(Number(height))||Number(width)<128||Number(width)>2048||Number(height)<128||Number(height)>2048))throw Error('Boyutlar 128–2048 arasında tam sayı olmalı.');
  const longEdge=format==='custom'?Math.max(Number(width),Number(height)):({square:1080,portrait:1350,story:1920,wide:1920,a4:2048}[format]||1080);
  const size=[512,1024,1080,1200,1350,1920,2048,2160,4096].find(n=>n>=longEdge)||2048;
  return normalizeDesign({template:'blank',name:cleanText(String(name).trim(),60,'Adsız tasarım',1)||'Adsız tasarım',format,canvasWidth:Number(width),canvasHeight:Number(height),background:'#FFFFFF',primary:'#5552DD',accent:'#E5EDB6',size,layers:[]});
}
export function editorURL(params={}){const url=new URL('editor.html',location.href);for(const [key,value]of Object.entries(params))url.searchParams.set(key,String(value));return url.href;}
