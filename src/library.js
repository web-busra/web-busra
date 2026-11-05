// Additional, original editorial layouts reuse the studio's procedural motif vocabulary.
export const EXTRA_TEMPLATES=[
  {id:'social-launch',name:'Yeni başlangıç',category:'social',palette:'lilac',format:'square',title:'Something\ngood is\ncoming.',caption:'STAY CURIOUS / 2026',motif:'atelier',layout:'social'},
  {id:'social-quote',name:'Bir düşünce',category:'social',palette:'sage',format:'square',title:'Good design\nmakes room\nfor people.',caption:'A NOTE TO REMEMBER',motif:'botanical',layout:'quote'},
  {id:'social-sale',name:'Küçük duyuru',category:'social',palette:'citrus',format:'square',title:'A LITTLE\nSOMETHING\nFOR YOU.',caption:'NEW COLLECTION / DISCOVER MORE',motif:'spark',layout:'social'},
  {id:'social-story',name:'Günün notu',category:'social',palette:'rose',format:'story',title:'A softer\nkind of\nMonday.',caption:'TAKE A MOMENT FOR YOURSELF',motif:'petal',layout:'story'},
  {id:'social-tips',name:'Üç küçük fikir',category:'social',palette:'pool',format:'portrait',title:'01. Explore\n02. Create\n03. Repeat',caption:'YOUR DAILY DOSE OF INSPIRATION',motif:'orbit',layout:'list'},
  {id:'social-cover',name:'Yaratıcı kapak',category:'social',palette:'iris',format:'cover',title:'Ideas live here.',caption:'DESIGN / CODE / CREATE',motif:'halo',layout:'cover'},
  {id:'slide-intro',name:'İlk slayt',category:'screen',palette:'iris',format:'wide',title:'A different\nway to think.',caption:'CREATIVE STRATEGY / 01',motif:'atelier',layout:'slide'},
  {id:'slide-agenda',name:'Yol haritası',category:'screen',palette:'clay',format:'wide',title:'The big picture.',caption:'01 / CONTEXT     02 / IDEAS     03 / NEXT STEPS',motif:'arch',layout:'slide'},
  {id:'slide-data',name:'Sayıların hikâyesi',category:'screen',palette:'pool',format:'wide',title:'Progress,\nmade visible.',caption:'A CLEARER PICTURE / 03',motif:'gridwave',layout:'data'},
  {id:'slide-quote',name:'Bir bakış açısı',category:'screen',palette:'butter',format:'wide',title:'“Start where you are.\nMake what you can.”',caption:'IDEAS WORTH SHARING / 04',motif:'contour',layout:'slide'},
  {id:'slide-about',name:'Kendini anlat',category:'screen',palette:'sage',format:'wide',title:'Hello,\nI’m Büşra.',caption:'DEVELOPER / CREATIVE THINKER',motif:'botanical',layout:'slide'},
  {id:'slide-end',name:'Son söz',category:'screen',palette:'noir',format:'wide',title:'Let’s make\nsomething great.',caption:'THANK YOU / LET’S CONNECT',motif:'mobius',layout:'slide'},
  {id:'event-workshop',name:'Yaratıcı atölye',category:'event',palette:'cobalt',format:'portrait',title:'MAKE\nTOGETHER.',caption:'CREATIVE WORKSHOP / 24 MAY / 14:00',motif:'bauhaus',layout:'event'},
  {id:'event-music',name:'Akustik akşam',category:'event',palette:'cherry',format:'portrait',title:'An evening\nof strings.',caption:'LIVE MUSIC / FRIDAY / 20:00',motif:'ribbon',layout:'event'},
  {id:'event-exhibit',name:'Açık stüdyo',category:'event',palette:'lilac',format:'a4',title:'OPEN\nSTUDIO\nDAYS.',caption:'ART / DESIGN / CONVERSATIONS',motif:'prism',layout:'event'},
  {id:'event-invite',name:'Bir davet',category:'event',palette:'rose',format:'portrait',title:'You’re\ninvited.',caption:'LET’S CELEBRATE THE LITTLE THINGS',motif:'bloom',layout:'invite'},
  {id:'event-festival',name:'Şehir buluşması',category:'event',palette:'electric',format:'portrait',title:'OFF\nSCREEN.\nON LIFE.',caption:'A CREATIVE MEETUP / ISTANBUL',motif:'kinetic',layout:'event'},
  {id:'event-book',name:'Okuma kulübü',category:'event',palette:'clay',format:'pin',title:'One more\nchapter.',caption:'THE READING CLUB / SUNDAY 11:00',motif:'stacks',layout:'invite'},
  {id:'brand-card',name:'Kişisel kart',category:'business',palette:'noir',format:'card',title:'Büşra Seçkin',caption:'COMPUTER PROGRAMMER / WEB DEVELOPER',motif:'orbit',layout:'card'},
  {id:'brand-studio',name:'Stüdyo kartı',category:'business',palette:'sage',format:'card',title:'Studio\nForma.',caption:'INDEPENDENT DESIGN STUDIO',motif:'seal',layout:'card'},
  {id:'brand-thanks',name:'Teşekkür kartı',category:'business',palette:'butter',format:'card',title:'Made with care.\nSent with love.',caption:'THANK YOU FOR BEING HERE',motif:'petal',layout:'card'},
  {id:'brand-note',name:'Antetli kâğıt',category:'business',palette:'clay',format:'a4',title:'A little\nintroduction.',caption:'HELLO FROM BÜŞRA / WEB & CREATIVE WORK',motif:'crest',layout:'letter'},
  {id:'brand-banner',name:'Portfolyo bandı',category:'business',palette:'pool',format:'banner',title:'Thoughtfully built.',caption:'WEB DEVELOPMENT / CREATIVE PROJECTS',motif:'prism',layout:'cover'},
  {id:'brand-menu',name:'Küçük menü',category:'business',palette:'rose',format:'portrait',title:'Coffee\n& good ideas.',caption:'ESPRESSO  /  FILTER  /  SLOW MOMENTS',motif:'solstice',layout:'invite'}
];
export function extraLayers(t){
  const layer=(id,type,name,p)=>({id,type,name,visible:true,locked:false,x:50,y:50,rotation:0,scale:100,opacity:100,...p});
  const text=(id,name,value,x,y,size,fill='ink',align='start',font='sans')=>layer(id,'text',name,{text:value,x,y,font,fontSize:size,weight:font==='serif'?400:600,tracking:size<16?.8:-1,leading:108,align,fill});
  const wide=['slide','data','cover','card'].includes(t.layout),quote=t.layout==='quote',invite=t.layout==='invite',letter=t.layout==='letter';
  const layers=[layer('art','motif','Vektör kompozisyon',{motif:t.motif,x:wide?79:quote?85:65,y:wide?48:quote?77:invite?29:26,scale:wide?60:quote?45:letter?40:80,fill:'primary'})];
  if(t.layout==='data')layers.push(layer('chart','chart','Veri grafiği',{x:74,y:52,width:245,height:180,chart:'bar',fill:'primary',values:[38,64,51,88],labels:['Q1','Q2','Q3','Q4']}));
  const titleX=quote?12:invite?50:11,titleY=wide?40:quote?32:invite?65:letter?25:58;
  layers.push(text('title','Ana başlık',t.title,titleX,titleY,wide?32:quote?43:invite?54:letter?44:51,'ink',invite?'middle':'start',quote||invite?'serif':'sans'));
  layers.push(text('subtitle','Alt başlık',t.caption,wide?11:invite?50:11,wide?82:91,wide?7.5:8,'ink',invite?'middle':'start','mono'));
  layers.push(layer('rule','shape','İnce çizgi',{shape:'rect',x:wide?29:50,y:wide?72:82,width:wide?220:390,height:1.2,fill:'primary'}));
  if(letter)layers.push(text('body','Açıklama','A space for thoughtful work.\nA place for fresh perspectives.\n\nLet’s create something meaningful.',11,45,15,'ink','start','serif'));
  return layers;
}
export const SYMBOLS=Object.freeze({
  sparkle:{name:'Işıltı',path:'M0-50 12-12 50 0 12 12 0 50-12 12-50 0-12-12Z'},
  star:{name:'Yıldız',path:'M0-48 13-15 47-15 21 8 29 42 0 23-29 42-21 8-47-15-13-15Z'},
  heart:{name:'Kalp',path:'M0 40C-85-7-39-73 0-32 39-73 85-7 0 40Z'},
  bolt:{name:'Şimşek',path:'M8-50-29 7H-3L-8 50 32-9H4Z'},
  arrow:{name:'Ok',path:'M-48-8H17L-5-30 7-42 50 0 7 42-5 30 17 8H-48Z'},
  sun:{name:'Güneş',path:'M0-50 9-30 25-43 24-22 43-25 31-9 50 0 31 9 43 25 24 22 25 43 9 30 0 50-9 30-25 43-24 22-43 25-31 9-50 0-31-9-43-25-24-22-25-43-9-30Z'},
  moon:{name:'Ay',path:'M24-44A49 49 0 1 0 44 24 42 42 0 0 1 24-44Z'},
  cloud:{name:'Bulut',path:'M-29 30a22 22 0 0 1-4-44 29 29 0 0 1 56-4 24 24 0 0 1 7 48Z'},
  leaf:{name:'Yaprak',path:'M-42 42Q-65-53 42-42 53 65-42 42ZM-36 36 25-25'},
  flower:{name:'Papatya',path:'M0-14C-50-82-80-10-14 0-82 50-10 80 0 14 50 82 80 10 14 0 82-50 10-80 0-14Z'},
  check:{name:'Onay',path:'M-42 0-28-14-8 7 31-34 45-20-8 36Z'},
  diamond:{name:'Elmas',path:'M0-50 40 0 0 50-40 0Z'},
  bookmark:{name:'Ayraç',path:'M-29-47H29V47L0 25-29 47Z'},
  flag:{name:'Bayrak',path:'M-34 49V-49H-26V-41H40L22-17 40 7H-26V49Z'},
  pin:{name:'Konum',path:'M0 50S-36 5-36-13a36 36 0 1 1 72 0C36 5 0 50 0 50ZM0-29a15 15 0 1 0 .01 0Z'},
  quote:{name:'Alıntı',path:'M-42 7V-25H-7V10L-23 39H-41L-26 10H-42ZM8 7V-25H43V10L27 39H9L24 10H8Z'},
  arch:{name:'Kemer',path:'M-40 45V-5a40 40 0 0 1 80 0V45Z'},
  cross:{name:'Artı',path:'M-10-45H10V-10H45V10H10V45H-10V10H-45V-10H-10Z'},
  triangle:{name:'Üçgen',path:'M0-48 48 40H-48Z'},
  hexagon:{name:'Altıgen',path:'M0-49 43-25V25L0 49-43 25V-25Z'},
  frame:{name:'Çerçeve',path:'M-47-47H47V47H-47ZM-33-33V33H33V-33Z'},
  smile:{name:'Gülümseme',path:'M0-48a48 48 0 1 0 .01 0ZM-28 7Q0 43 28 7L22 4Q0 30-22 4ZM-22-20v10h8v-10ZM14-20v10h8v-10Z'},
  music:{name:'Nota',path:'M-6-37 40-48V21a15 11 0 1 1-8-10V-25L2-18V33a15 11 0 1 1-8-10Z'},
  crown:{name:'Taç',path:'M-46-27-18-5 0-40 18-5 46-27 35 31H-35ZM-34 38H34V49H-34Z'}
});
