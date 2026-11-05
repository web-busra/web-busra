// A template contact sheet generated from the same SVG model used by the editor.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {TEMPLATES,templateDesign,buildSVG,escapeXML} from '../src/design.js';
import {PHOTO_CATALOG} from '../src/photos.js';
const root=resolve(import.meta.dirname,'..');
await mkdir(resolve(root,'tmp/generated'),{recursive:true});
const assets=await Promise.all(PHOTO_CATALOG.map(async p=>({id:p.asset,name:p.name,width:p.width,height:p.height,data:'data:image/jpeg;base64,'+(await readFile(resolve(root,p.path))).toString('base64')})));
const ids=['hotel-signature','tour-coast','pilates-signature','meeting-conference','hotel-suite','tour-valley','pilates-schedule','meeting-agenda'];
const tiles=ids.map((id,index)=>{
  const x=42+(index%4)*350,y=155+Math.floor(index/4)*465,t=TEMPLATES.find(t=>t.id===id);
  const svg=buildSVG({...templateDesign(id),size:512},{prefix:'catalog-'+id,assets}).replace(/width="\d+" height="\d+"/,'width="280" height="350"');
  return `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="306" height="376" rx="7" fill="#E6E5DF"/><g transform="translate(13 13)">${svg}</g><text x="0" y="411" fill="#31423D" font-size="18" font-weight="600">${escapeXML(t.name)}</text><text x="0" y="439" fill="#7B847E" font-size="12" letter-spacing="1">DÜZENLENEBİLİR İŞLETME TASARIMI / ${String(index+1).padStart(2,'0')}</text></g>`;
}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1440" height="1140" viewBox="0 0 1440 1140" role="img" aria-labelledby="title desc"><title id="title">Forma 6 — İşletme koleksiyonları</title><desc id="desc">Otel, turizm, pilates ve kurumsal toplantı şablonlarından sekiz düzenlenebilir örnek.</desc><rect width="1440" height="1140" fill="#F4F3ED"/><g font-family="Arial, Helvetica, sans-serif"><text x="43" y="55" fill="#7E8980" font-size="12" letter-spacing="3">FORMA BUSINESS COLLECTION / 6.0</text><text x="40" y="110" fill="#253A37" font-size="40" letter-spacing="-1">İşletmenize özel. Her detayı düşünülmüş.</text>${tiles}<path d="M43 1100h1348" stroke="#D8DCD4"/><text x="43" y="1125" fill="#8D958D" font-size="11" letter-spacing="1">72 İŞLETME ŞABLONU / 9 KOLEKSİYON / 16 ÖRNEK FOTOĞRAF</text><text x="1390" y="1125" fill="#8D958D" font-size="11" text-anchor="end">Örnek bilgiler ve AI fotoğraflar · Yayından önce işletmenize uyarlayın.</text></g></svg>`;
await writeFile(resolve(root,'tmp/generated/catalog.svg'),svg.replaceAll('<image href=','<image xlink:href='));
console.log('tmp/generated/catalog.svg oluşturuldu — sekiz sektör tasarımı, gerçek SVG üreticisi.');
