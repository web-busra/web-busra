// Original procedural compositions. No stock artwork, remote fonts or assets.
import {EXTRA_TEMPLATES,extraLayers} from './library.js';
import {COMMERCIAL_TEMPLATES,BUSINESS_PALETTES,BUSINESS_SECTORS,campaignLayers} from './commercial.js';
export const PALETTES = Object.freeze([
  ...BUSINESS_PALETTES,
  {id:'iris',name:'İris',background:'#242B72',primary:'#B5B9F0',accent:'#DDF592'},
  {id:'clay',name:'Terrakota',background:'#EEE8DE',primary:'#A34D35',accent:'#D6A984'},
  {id:'sage',name:'Adaçayı',background:'#E5E9DE',primary:'#304E43',accent:'#B5C79B'},
  {id:'rose',name:'Gül kurusu',background:'#F1DEDE',primary:'#823D58',accent:'#C797B6'},
  {id:'noir',name:'Mürekkep',background:'#22252B',primary:'#EEEFE5',accent:'#BCD48C'},
  {id:'cobalt',name:'Kobalt',background:'#F1F0E8',primary:'#294BC4',accent:'#F1B853'},
  {id:'citrus',name:'Narenciye',background:'#F6EDDC',primary:'#EB5A32',accent:'#C9D34F'},
  {id:'lilac',name:'Leylak',background:'#E6E0F0',primary:'#55458D',accent:'#EFBFA9'},
  {id:'pool',name:'Kıyı',background:'#DDEBE9',primary:'#125B68',accent:'#EFAC80'},
  {id:'cherry',name:'Vişne',background:'#702B42',primary:'#F1A4AB',accent:'#EEE1BA'},
  {id:'butter',name:'Tereyağı',background:'#F4EBC8',primary:'#393C78',accent:'#EAA18C'},
  {id:'electric',name:'Elektrik',background:'#DDF592',primary:'#292F50',accent:'#AAA1E0'}
]);
export const CATEGORIES = Object.freeze([{id:'all',name:'Tümü'},...BUSINESS_SECTORS]);
export const FORMATS = Object.freeze({square:{name:'Kare',width:512,height:512,label:'1:1'},portrait:{name:'Afiş',width:512,height:640,label:'4:5'},landscape:{name:'Yatay',width:640,height:400,label:'16:10'},story:{name:'Hikâye',width:432,height:768,label:'9:16'},wide:{name:'Sunum',width:640,height:360,label:'16:9'},a4:{name:'A4',width:496,height:702,label:'210:297'},card:{name:'Kart',width:576,height:320,label:'9:5'},cover:{name:'Kapak',width:640,height:240,label:'8:3'},pin:{name:'Dikey pin',width:400,height:600,label:'2:3'},banner:{name:'Banner',width:640,height:200,label:'16:5'},custom:{name:'Özel',width:512,height:512,label:'Özel'}});
export const LEGACY_TEMPLATES = Object.freeze([
  {id:'atelier',name:'Atölye',category:'poster',palette:'iris',format:'portrait',title:'MAKE\nYOUR\nMARK.',caption:'A SPACE FOR ORIGINAL IDEAS',edition:'01 / CREATIVE SERIES'},
  {id:'exhibit',name:'Sergi',category:'poster',palette:'clay',format:'portrait',title:'FORM\n& FEEL.',caption:'EXPLORATIONS IN SHAPE',edition:'DESIGN EXHIBITION / 2026'},
  {id:'solstice',name:'Gündönümü',category:'poster',palette:'citrus',format:'portrait',title:'SLOW\nDAYS.',caption:'FIND YOUR OWN PACE',edition:'SUMMER STUDIES / VOL. 03'},
  {id:'editorial',name:'Perspektif',category:'poster',palette:'noir',format:'portrait',title:'A NEW\nPOINT\nOF VIEW.',caption:'INDEPENDENT THOUGHTS',edition:'THE EDITORIAL COLLECTION'},
  {id:'kinetic',name:'Hareket',category:'poster',palette:'electric',format:'portrait',title:'STAY\nIN PLAY.',caption:'GOOD THINGS TAKE SHAPE',edition:'MOVEMENT STUDIES / 05'},
  {id:'botanical',name:'Herbaryum',category:'poster',palette:'sage',format:'portrait',title:'NATURAL\nBY DESIGN.',caption:'ROOM TO GROW',edition:'BOTANICAL ARCHIVE / 06'},
  {id:'orbit',name:'Yörünge',category:'brand',palette:'iris',format:'square',title:'BS',caption:'IDEAS IN MOTION'},
  {id:'bloom',name:'Çiçek',category:'brand',palette:'rose',format:'square',title:'FL',caption:'GROW YOUR OWN WAY'},
  {id:'seal',name:'Mühür',category:'brand',palette:'sage',format:'square',title:'ST',caption:'MADE WITH INTENTION'},
  {id:'crest',name:'Arma',category:'brand',palette:'clay',format:'square',title:'AC',caption:'CRAFTED TO LAST'},
  {id:'spark',name:'Kıvılcım',category:'brand',palette:'butter',format:'square',title:'MA',caption:'SMALL IDEAS. BIG ENERGY.'},
  {id:'halo',name:'Hale',category:'brand',palette:'pool',format:'square',title:'SO',caption:'A DIFFERENT KIND OF STUDIO'},
  {id:'tiles',name:'Ritim',category:'geometric',palette:'cobalt',format:'square',title:'01',caption:'FIND YOUR RHYTHM'},
  {id:'arch',name:'Kemer',category:'geometric',palette:'clay',format:'square',title:'AR',caption:'A LITTLE DIFFERENT'},
  {id:'gridwave',name:'Dalga',category:'geometric',palette:'pool',format:'square',title:'WAVE',caption:'ORDER MEETS MOVEMENT'},
  {id:'prism',name:'Prizma',category:'geometric',palette:'lilac',format:'square',title:'PR',caption:'ANOTHER DIMENSION'},
  {id:'bauhaus',name:'Yapı',category:'geometric',palette:'citrus',format:'square',title:'BAU',caption:'FUNCTION FOLLOWS CURIOSITY'},
  {id:'stacks',name:'Katman',category:'geometric',palette:'cherry',format:'square',title:'LAY',caption:'ONE IDEA ON TOP OF ANOTHER'},
  {id:'ribbon',name:'Akış',category:'abstract',palette:'noir',format:'square',title:'FL',caption:'MAKE SPACE FOR IDEAS'},
  {id:'dune',name:'Kum',category:'abstract',palette:'clay',format:'square',title:'DUNE',caption:'SHAPED BY TIME'},
  {id:'petal',name:'Taç yaprak',category:'abstract',palette:'rose',format:'square',title:'PETAL',caption:'SOFT SHAPES. STRONG IDEAS.'},
  {id:'contour',name:'Kontur',category:'abstract',palette:'iris',format:'square',title:'CON',caption:'BEYOND THE SURFACE'},
  {id:'eclipse',name:'Tutulma',category:'abstract',palette:'butter',format:'square',title:'ECL',caption:'A MOMENT IN BETWEEN'},
  {id:'mobius',name:'Sonsuz',category:'abstract',palette:'cobalt',format:'square',title:'∞',caption:'POSSIBILITIES WITHOUT END'},
  ...EXTRA_TEMPLATES
]);
export const TEMPLATES=Object.freeze([...COMMERCIAL_TEMPLATES]);
const BLANK={id:'blank',name:'Adsız tasarım',format:'square',palette:'hospitality'};
export const hasTemplate=id=>id==='blank'||TEMPLATES.some(t=>t.id===id)||LEGACY_TEMPLATES.some(t=>t.id===id);
export function presetLayers(template) {
  if(template.id==='blank')return [];
  if(template.commercial)return campaignLayers(template,FORMATS[template.format]);
  if(template.layout)return extraLayers(template);
  const poster=template.category==='poster';
  const layer=(id,type,name,props)=>({id,type,name,visible:true,locked:false,x:50,y:50,rotation:0,scale:100,opacity:100,...props});
  if(poster)return [
    layer('art','motif','Ana kompozisyon',{motif:template.id,x:64,y:31,scale:100,fill:'primary'}),
    layer('rule','shape','Editoryal çizgi',{shape:'rect',x:12,y:76,width:9,height:103,fill:'accent'}),
    layer('title','text','Ana başlık',{text:template.title,x:18,y:62,font:template.id==='exhibit'?'serif':'display',fontSize:template.id==='editorial'?62:template.id==='botanical'?53:68,weight:template.id==='exhibit'?400:800,tracking:-3,leading:94,align:'start',fill:'ink'}),
    layer('subtitle','text','Alt başlık',{text:template.caption,x:12,y:92,font:'mono',fontSize:9,weight:400,tracking:1.1,leading:120,align:'start',fill:'ink'}),
    layer('edition','text','Seri bilgisi',{text:template.edition,x:12,y:7,font:'mono',fontSize:8,weight:400,tracking:1,leading:120,align:'start',fill:'ink'})
  ];
  const ink=['bloom','spark'].includes(template.id)?'accent-ink':['seal','crest','halo','prism'].includes(template.id)?'primary-ink':'ink';
  return [layer('art','motif','Ana motif',{motif:template.id,x:50,y:44,scale:100,fill:'primary'}),
    layer('title','text','Monogram / başlık',{text:template.title,x:50,y:44,font:template.category==='brand'?'serif':'sans',fontSize:template.title.length>3?52:86,weight:template.category==='brand'?400:600,tracking:-3,leading:100,align:'middle',fill:ink}),
    layer('subtitle','text','Alt başlık',{text:template.caption,x:50,y:87,font:'mono',fontSize:9,weight:400,tracking:1.2,leading:120,align:'middle',fill:'ink'})];
}
export function rawPreset(id='hotel-signature') {
  const t=(id==='blank'?BLANK:TEMPLATES.find(t=>t.id===id)||LEGACY_TEMPLATES.find(t=>t.id===id))||TEMPLATES[0],p=PALETTES.find(p=>p.id===t.palette);
  return {version:2,template:t.id,name:t.name,format:t.format,background:p.background,primary:p.primary,accent:p.accent,pattern:'none',radius:0,transparent:false,size:t.commercial?({portrait:1350,square:1080,story:1920,wide:1920,a4:2048}[t.format]||1350):1024,layers:presetLayers(t)};
}
