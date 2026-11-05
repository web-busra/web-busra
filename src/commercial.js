// Editable fictional business campaigns. Photos are original generated assets; no live offers.
import {INDUSTRY_SECTORS,INDUSTRY_PALETTES,INDUSTRY_TEMPLATES} from './industries.js';
export const BUSINESS_SECTORS=[...INDUSTRY_SECTORS,{id:'realestate',name:'Emlak',palette:'estate'},{id:'hair',name:'Kuaför',palette:'salon'},{id:'beauty',name:'Güzellik',palette:'spa'},{id:'automotive',name:'Otomotiv',palette:'motor'},{id:'campaign',name:'İşletme kampanyaları',palette:'salon'}];
export const BUSINESS_PALETTES=[
  ...INDUSTRY_PALETTES,
  {id:'estate',name:'Mimari · Zeytin',background:'#F3F0E8',primary:'#19392E',accent:'#B79A68'},
  {id:'salon',name:'Salon · Şampanya',background:'#F3EAE1',primary:'#30272A',accent:'#BE9372'},
  {id:'spa',name:'Bakım · Gül',background:'#F6EDE8',primary:'#60434C',accent:'#CAA38A'},
  {id:'motor',name:'Otomotiv · Grafit',background:'#111A28',primary:'#23364C',accent:'#ED9D57'}
];
const base={brand:'',contact:'0 (5XX) XXX XX XX',terms:'Örnek tasarım · Bilgileri ve koşulları güncelleyin.',period:'Bu aya özel',details:'',price:'',cta:'Bilgi alın',address:'İstanbul · Örnek adres'};
function campaign(id,name,category,layout,format,photo,copy){return {...base,id,name,category,layout:'commercial',composition:layout,format,photo,palette:BUSINESS_SECTORS.find(s=>s.id===category)?.palette||'salon',commercial:true,purpose:'campaign',...copy};}
export const COMMERCIAL_TEMPLATES=[
  ...INDUSTRY_TEMPLATES,
  campaign('estate-signature','Taş ev · Satılık','realestate','listing','portrait','estate-villa',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'SEÇKİN PORTFÖY / SATILIK',title:'Doğayla iç içe,\nsize özel yaşam.',price:'12.750.000 TL',details:'4+1  ·  240 m²  ·  Özel havuz',cta:'Evi keşfedin',address:'Urla · İzmir',purpose:'listing'}),
  campaign('estate-city','Şehirde yeni adres','realestate','editorial','portrait','estate-interior',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'YENİ PORTFÖY',title:'Şehrin içinde,\nhuzurun yanında.',price:'8.950.000 TL',details:'3+1 · 165 m² · Geniş teras',cta:'Randevu oluşturun',address:'Kadıköy · İstanbul',purpose:'listing'}),
  campaign('estate-rental','Kiralık yaşam alanı','realestate','listing','square','estate-interior',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'KİRALIK / YENİ İLAN',title:'Yeni hayatınıza\nyer açın.',price:'42.500 TL / ay',details:'2+1  ·  110 m²  ·  Eşyalı',cta:'Detayları alın',address:'Ataşehir · İstanbul',purpose:'listing'}),
  campaign('estate-openhouse','Açık ev daveti','realestate','duo','portrait','estate-villa',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'AÇIK EV / DAVETLİSİNİZ',title:'Hayalinizdeki evi\nyakından görün.',price:'Cumartesi 14.00',details:'Özel tanıtım · Yerinde inceleme',cta:'Katılım için arayın',secondary:'estate-interior',address:'Urla · İzmir',purpose:'appointment'}),
  campaign('estate-story','Villa · Hikâye','realestate','spotlight','story','estate-villa',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'YAŞAMIN YENİ ADRESİ',title:'Bir evden\ndaha fazlası.',price:'Özel portföy',details:'Bahçe · Havuz · Doğayla iç içe',cta:'Danışmanınızla görüşün',purpose:'listing'}),
  campaign('estate-consultant','Danışman tanıtımı','realestate','split','portrait','estate-interior',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'BİRLİKTE DOĞRU ADRESE',title:'Evinizin\nhikâyesini\nbirlikte yazalım.',price:'Sizin için.',details:'Satış · Kiralama\nPortföy danışmanlığı',cta:'Görüşme planlayın',purpose:'service'}),
  campaign('estate-banner','Emlak · Yatay reklam','realestate','wide','wide','estate-villa',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'SEÇKİN YAŞAM ALANLARI',title:'Evinize\nhoş geldiniz.',price:'Yeni portföy',details:'Konfor · Mimari · Doğru lokasyon',cta:'Portföyü inceleyin',purpose:'listing'}),
  campaign('estate-sold','Satıldı duyurusu','realestate','editorial','portrait','estate-interior',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'MUTLU BİR YENİ BAŞLANGIÇ',title:'SATILDI.\nYeni hikâyelere.',price:'Sırada sizin eviniz.',details:'Portföyünüz için bizimle görüşün.',cta:'Danışmanınıza ulaşın',purpose:'announcement'}),
  campaign('hair-signature','İmza saç tasarımı','hair','split','portrait','hair-brunette',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'KİŞİYE ÖZEL SAÇ TASARIMI',title:'Yeni bir\nrenk.\nYeni bir sen.',price:'Size özel.',details:'Kesim · Renk · Bakım\nStilinize birlikte karar verelim.',cta:'Randevu oluşturun',purpose:'appointment'}),
  campaign('hair-balayage','Balayage kampanyası','hair','spotlight','portrait','hair-blonde',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'BOYUTLU RENK / DOĞAL IŞILTI',title:'Işığını\nsaçlarına taşı.',price:'3.250 TL’den',details:'Balayage · Tonlama · Bakım',cta:'Randevunuzu ayıralım',terms:'Fiyat saç uzunluğuna göre değişir. Örnek kampanya.',purpose:'campaign'}),
  campaign('hair-care','Bakım paketi','hair','service','portrait','hair-brunette',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'SAÇINA İYİ GELEN BİR MOLA',title:'Bakım,\nözen ister.',price:'1.250 TL',details:'Yoğun bakım\nKesim & fön\nStil danışmanlığı',cta:'Paket için bilgi alın',purpose:'service'}),
  campaign('hair-cut','Kesim & fön fırsatı','hair','offer','square','hair-blonde',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'HAFTANIN STİL RANDEVUSU',title:'Küçük bir dokunuş,\nyepyeni bir his.',price:'750 TL',details:'Kesim + profesyonel fön',cta:'Hemen randevu alın',purpose:'campaign'}),
  campaign('hair-opening','Kuaför · Açılış','hair','editorial','portrait','hair-brunette',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'YENİ ATÖLYEMİZE BEKLİYORUZ',title:'Stilinizin\nyeni adresi.',price:'Açılışa özel %20',details:'İlk ziyaretinizde seçili hizmetlerde.',cta:'Tanışmak için arayın',purpose:'opening'}),
  campaign('hair-story','Kuaför · Randevu hikâyesi','hair','spotlight','story','hair-brunette',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'BU HAFTA KENDİNE ZAMAN AYIR',title:'Güzel bir gün,\ngüzel saçlarla.',price:'Randevular açıldı.',details:'Kesim · Renk · Profesyonel bakım',cta:'Uygun saatinizi seçin',purpose:'appointment'}),
  campaign('hair-menu','Salon hizmet menüsü','hair','service','a4','hair-blonde',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'SAÇINIZ İÇİN ÖZENLE',title:'İyi hissettiren\ndokunuşlar.',price:'Paketleri keşfedin.',details:'Kesim & fön\nKişiye özel renklendirme\nYoğun saç bakımı',cta:'Hizmetler için bilgi alın',purpose:'service'}),
  campaign('hair-banner','Kuaför · Yatay reklam','hair','wide','wide','hair-blonde',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'KİŞİYE ÖZEL BİR STİL',title:'Kendi\nışığını bul.',price:'Yeni sezon.',details:'Kesim · Renk · Bakım',cta:'Randevu alın',purpose:'campaign'}),
  campaign('beauty-signature','Güzellik · Editoryal','beauty','editorial','portrait','beauty-facial',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'KENDİNE AYIRDIĞIN ZAMAN',title:'Doğal ışıltına\nyer aç.',price:'Bakım ritüeliniz.',details:'Kişiye özel bakım · Özenli dokunuşlar',cta:'Randevu oluşturun',purpose:'appointment'}),
  campaign('beauty-ritual','Bakım ritüeli','beauty','split','portrait','beauty-products',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'GÜNLÜK KOŞUŞTURMAYA BİR ARA',title:'Özenle.\nSizin için.',price:'1.450 TL',details:'Yüz bakım ritüeli\nRahatlatıcı bakım deneyimi',cta:'Paketleri inceleyin',purpose:'service'}),
  campaign('beauty-offer','Bakım · İlk ziyaret','beauty','offer','square','beauty-facial',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'İLK ZİYARETİNİZE ÖZEL',title:'Kendinize\ngüzel bir başlangıç.',price:'%20',details:'Seçili bakım paketlerinde indirim.',cta:'Detaylar için arayın',purpose:'campaign'}),
  campaign('beauty-story','Bakım · Randevu hikâyesi','beauty','spotlight','story','beauty-facial',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'BUGÜN KENDİNİ SEÇ',title:'Biraz yavaşla.\nIşıltını hatırla.',price:'Sana ayrılan saat.',details:'Bakım ritüelleri · Rahatlatıcı deneyim',cta:'Randevunuzu planlayalım',purpose:'appointment'}),
  campaign('beauty-products','Ürün & bakım tanıtımı','beauty','editorial','portrait','beauty-products',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'BAKIMIN KÜÇÜK AYRINTILARI',title:'Özen,\ndetaylarda saklı.',price:'Ritüelinizi keşfedin.',details:'Bakım seçenekleri hakkında bilgi alın.',cta:'Stüdyomuza bekliyoruz',purpose:'service'}),
  campaign('beauty-opening','Güzellik · Açılış daveti','beauty','duo','portrait','beauty-facial',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'YENİ STÜDYOMUZ AÇILIYOR',title:'Güzelliğe\nyeni bir alan.',price:'Tanışmaya bekleriz.',details:'Açılış gününe özel bakım paketleri.',cta:'Bilgi ve randevu',secondary:'beauty-products',purpose:'opening'}),
  campaign('beauty-menu','Güzellik hizmet kartı','beauty','service','a4','beauty-products',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'KENDİNİZE AYIRDIĞINIZ VAKİT',title:'Bakım menünüz,\nsize özel.',price:'Paketler & ritüeller',details:'Yüz bakım ritüeli\nKaş & kirpik tasarımı\nEl & tırnak bakımı',cta:'Hizmetler için iletişime geçin',purpose:'service'}),
  campaign('beauty-banner','Güzellik · Yatay reklam','beauty','wide','wide','beauty-facial',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'KENDİNE GÜZEL BİR MOLA VER',title:'Işıltına\nzaman ayır.',price:'Size özel bakım.',details:'Özenli bir bakım deneyimi',cta:'Randevu alın',purpose:'appointment'}),
  campaign('auto-signature','Araç · Vitrin ilanı','automotive','listing','portrait','auto-sedan',{brand:'OTOMOTİV İŞLETMENİZ',eyebrow:'SEÇKİN ARAÇLAR / YENİ İLAN',title:'Yeni bir yolculuk\nsizi bekliyor.',price:'1.950.000 TL',details:'2022  ·  Otomatik  ·  48.000 km',cta:'Aracı inceleyin',purpose:'listing'}),
  campaign('auto-duo','Araç · Detaylı ilan','automotive','duo','portrait','auto-sedan',{brand:'OTOMOTİV İŞLETMENİZ',eyebrow:'TASARIM / KONFOR / SÜRÜŞ',title:'Her detayında\nayrı bir karakter.',price:'1.950.000 TL',details:'Sedan · Otomatik · Randevuyla inceleme',cta:'Detaylı bilgi alın',secondary:'auto-detail',purpose:'listing'}),
  campaign('auto-square','Araç · Kare ilan','automotive','listing','square','auto-sedan',{brand:'OTOMOTİV İŞLETMENİZ',eyebrow:'YENİ GELEN ARAÇ',title:'Bir sonraki\nyol arkadaşınız.',price:'1.950.000 TL',details:'2022  ·  48.000 km  ·  Otomatik',cta:'İlanı keşfedin',purpose:'listing'}),
  campaign('auto-detailing','Oto bakım paketi','automotive','service','portrait','auto-detail',{brand:'OTO BAKIM İŞLETMENİZ',eyebrow:'ARACINIZA ÖZENLE',title:'İlk günkü\nözenle.',price:'3.500 TL’den',details:'Detaylı iç temizlik\nBoya yüzeyi bakımı\nProfesyonel uygulama',cta:'Paket için bilgi alın',purpose:'service'}),
  campaign('auto-campaign','Oto bakım kampanyası','automotive','editorial','portrait','auto-detail',{brand:'OTO BAKIM İŞLETMENİZ',eyebrow:'BU AYA ÖZEL BAKIM PAKETİ',title:'Yola çıkmadan\nönce, özen.',price:'Seçili paketlerde %15',details:'Kapsam ve araç tipine göre fiyatlandırılır.',cta:'Randevunuzu ayıralım',purpose:'campaign'}),
  campaign('auto-banner','Otomotiv · Yatay reklam','automotive','wide','wide','auto-sedan',{brand:'OTOMOTİV İŞLETMENİZ',eyebrow:'YENİ BİR SÜRÜŞ HİKÂYESİ',title:'Sıradaki\nrotanız.',price:'Portföyü keşfedin.',details:'Araç inceleme · Randevu · Bilgi',cta:'Bizimle görüşün',purpose:'listing'}),
  campaign('auto-story','Otomotiv · Hikâye','automotive','editorial','story','auto-sedan',{brand:'OTOMOTİV İŞLETMENİZ',eyebrow:'VİTRİNDEKİ YENİ YOL ARKADAŞINIZ',title:'Yolunuzu\nyeniden çizin.',price:'1.950.000 TL',details:'2022 · Otomatik · 48.000 km',cta:'İlan detayları için arayın',purpose:'listing'}),
  campaign('auto-appointment','Oto bakım · Randevu','automotive','spotlight','portrait','auto-detail',{brand:'OTO BAKIM İŞLETMENİZ',eyebrow:'DETAYLARDA GİZLİ BİR ÖZEN',title:'Aracınız için\nbiraz zaman.',price:'Randevunuzu ayırın.',details:'Bakım paketlerini birlikte planlayalım.',cta:'Uygun gününüzü seçin',purpose:'appointment'}),
  campaign('promo-salon','Salon · Sezon fırsatı','campaign','offer','portrait','hair-blonde',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'YENİ SEZONA ÖZEL',title:'Yeni sezon,\nyeni bir dokunuş.',price:'%25',details:'Seçili kesim ve bakım paketlerinde.',cta:'Kampanyayı keşfedin',palette:'salon',sector:'hair'}),
  campaign('promo-beauty','Bakım · Paket fırsatı','campaign','offer','portrait','beauty-products',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'KENDİNE BİR GÜZELLİK YAP',title:'Bakımına\nyer aç.',price:'1.250 TL',details:'Tanışma bakım paketi · Bu aya özel.',cta:'Randevunuzu oluşturalım',palette:'spa',sector:'beauty'}),
  campaign('promo-detail','Oto bakım · İndirim','campaign','listing','portrait','auto-detail',{brand:'OTO BAKIM İŞLETMENİZ',eyebrow:'BAKIM KAMPANYASI',title:'Daha fazla özen.\nDaha iyi his.',price:'%15 indirim',details:'Seçili detaylı bakım paketlerinde.',cta:'Paketler için arayın',palette:'motor',sector:'automotive'}),
  campaign('promo-estate','Emlak · Portföy daveti','campaign','duo','portrait','estate-interior',{brand:'GAYRİMENKUL OFİSİNİZ',eyebrow:'YENİ SEÇKİN PORTFÖY',title:'Yeni adresinize\nbir adım daha.',price:'Tanışma randevusu',details:'Satış ve kiralama seçeneklerini keşfedin.',cta:'Danışmanınıza ulaşın',secondary:'estate-villa',palette:'estate',sector:'realestate'}),
  campaign('promo-opening','Açılış · Davet kampanyası','campaign','split','portrait','beauty-products',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'BİRLİKTE GÜZEL BAŞLANGIÇLARA',title:'Yeni bir\nalan.\nYeni bir his.',price:'Hoş geldiniz.',details:'Açılışa özel seçili paketler.\nSizi tanımayı çok isteriz.',cta:'Açılış için bilgi alın',palette:'spa',sector:'beauty',purpose:'opening'}),
  campaign('promo-weekend','Hafta sonu · Randevu','campaign','editorial','square','hair-brunette',{brand:'SAÇ TASARIM STÜDYONUZ',eyebrow:'HAFTA SONUNA GÜZEL BİR BAŞLANGIÇ',title:'Kendinize\nzaman ayırın.',price:'Bu hafta sonu.',details:'Kesim · Fön · Özel bakım paketleri',cta:'Uygun saatinizi seçin',palette:'salon',sector:'hair',purpose:'appointment'}),
  campaign('promo-gift','Hediye bakım kartı','campaign','service','portrait','beauty-products',{brand:'GÜZELLİK STÜDYONUZ',eyebrow:'SEVDİKLERİNİZE ÖZENLİ BİR HEDİYE',title:'Küçük bir hediye.\nGüzel bir his.',price:'Hediye bakım kartı',details:'Kişiye özel seçenekler\nDüzenlenebilir hediye notu\nSize özel bakım ritüeli',cta:'Seçenekleri öğrenin',palette:'spa',sector:'beauty'}),
  campaign('promo-service','Kurumsal · Hizmet reklamı','campaign','wide','wide','auto-detail',{brand:'OTO BAKIM İŞLETMENİZ',eyebrow:'PROFESYONEL BAKIM / ÖZENLİ HİZMET',title:'Detaylarda\nfark yaratın.',price:'Size özel paket.',details:'Aracınızın ihtiyacına göre bakım',cta:'Teklif için arayın',palette:'motor',sector:'automotive',purpose:'service'})
];

export function campaignLayers(t,f){
  const W=f.width,H=f.height,layers=[],font=t.category==='automotive'||t.sector==='automotive'?'sans':'serif',white='#FFFFFF',dark='#111820';
  const add=(id,type,name,props)=>layers.push({id,type,name,x:50,y:50,opacity:100,visible:true,locked:false,rotation:0,scale:100,fill:'ink',...props});
  const rect=(id,x,y,w,h,fill,props={})=>add(id,'shape','Zemin / dekor',{shape:'rect',x:(x+w/2)/W*100,y:(y+h/2)/H*100,width:w,height:h,fill,...props});
  const text=(id,value,x,y,size,fill='ink',width=W-64,props={})=>add(id,'text',({brand:'İşletme adı',title:'Kampanya başlığı',price:'Fiyat / teklif',details:'Özellikler / hizmetler',cta:'Çağrı metni',contact:'Telefon',terms:'Koşullar',eyebrow:'Üst başlık',address:'Konum'})[id]||id,{text:value,x:x/W*100,y:y/H*100,font:font,fontSize:size,weight:400,tracking:0,leading:105,align:'start',fill,maxWidth:width,...props});
  const photo=(id,key,x,y,w,h,props={})=>add(id,'image',id==='hero'?'Ana kampanya fotoğrafı':'Detay fotoğrafı',{asset:'stock-'+key,x:(x+w/2)/W*100,y:(y+h/2)/H*100,width:w,height:h,mask:'rect',fit:'cover',...props});
  const brand=(fill='ink',width=W-64,x=32,y=38)=>text('brand',t.brand,x,y,11,fill,width,{font:'sans',weight:600,tracking:1.7});
  const eyebrow=(fill='primary',x=32,y=72,width=W-64)=>text('eyebrow',t.eyebrow,x,y,8.5,t.palette==='motor'&&fill==='primary'?'accent':fill,width,{font:'sans',weight:600,tracking:1.1});
  const button=(x,y,w,h,fill='primary',ink='primary-ink')=>{rect('cta-bg',x,y,w,h,fill,{corner:3});text('cta',t.cta,x+w/2,y+h*.64,10,ink,w-20,{align:'middle',font:'sans',weight:600,tracking:.2});};
  const footer=(fill='ink',y=H-16)=>{text('contact',t.contact,32,y,9,fill,W*.43,{font:'sans'});text('terms',t.terms,W-32,y,6.1,fill,W*.49,{align:'end',font:'sans',tracking:0});};
  const title=(x,y,size,width=W-64,fill='ink')=>text('title',t.title,x,y,size,fill,width,{font,leading:103});
  const price=(x,y,size=31,width=W-64,fill='ink')=>text('price',t.price,x,y,size,fill,width,{font:'sans',weight:600,tracking:-1});
  const details=(x,y,width=W-64,fill='ink',size=11)=>text('details',t.details,x,y,size,fill,width,{font:'sans',leading:150,tracking:.1});
  const professionalFooter=(fill='ink')=>{
    text('address',t.address,32,H-43,8,fill,W-64,{font:'sans'});
    text('contact',t.contact,32,H-26,9,fill,W*.43,{font:'sans'});
    text('website',t.website||'www.isletmeniz.example',W-32,H-26,8,fill,W*.48,{font:'sans',align:'end'});
    text('terms',t.terms,32,H-10,6.2,fill,W-64,{font:'sans'});
  };
  if(t.composition==='resort'){
    photo('hero',t.photo,0,0,W,H*.52);rect('top-shade',0,0,W,H*.22,dark,{gradient:'fade-down',opacity:80});brand(white);eyebrow(white,32,66);
    rect('period-background',32,H*.439,W*.67,27,'primary',{opacity:94,corner:2});text('period',t.period,44,H*.467,8,'primary-ink',W*.62,{font:'sans',tracking:.5});
    rect('signature-rule',32,H*.565,35,2,'accent');title(32,H*.635,W*.076);details(32,H*.79,W-64,'ink',10.5);
    price(32,H*.90,W*.052,W*.56);button(W*.64,H*.86,W*.295,33,'primary','primary-ink');professionalFooter();
  }else if(t.composition==='room'){
    brand();eyebrow('primary',32,H*.115);title(32,H*.205,W*.073);photo('hero',t.photo,32,H*.335,W-64,H*.33,{corner:2});
    price(32,H*.737,W*.052);details(32,H*.79,W-64,'ink',10.5);button(32,H*.864,W-64,33);professionalFooter();
  }else if(t.composition==='editorial-frame'){
    photo('hero',t.photo,0,0,W,H*.60);rect('top-shade',0,0,W,H*.21,dark,{gradient:'fade-down',opacity:85});brand(white);eyebrow(white,32,66);
    rect('editorial-paper',22,H*.50,W-44,H*.38,'background');rect('editorial-rule',42,H*.545,30,2,'accent');
    title(42,H*.605,W*.069,W-84);details(42,H*.75,W-84,'ink',10);price(42,H*.84,W*.046,W*.54);button(W*.65,H*.798,W*.225,29);professionalFooter();
  }else if(t.composition==='membership'){
    brand();eyebrow('primary',32,H*.115);photo('hero',t.photo,W*.51,H*.175,W*.43,H*.43,{mask:'arch'});
    title(32,H*.245,W*.068,W*.41);details(32,H*.47,W*.405,'ink',10);
    rect('membership-band',32,H*.65,W-64,H*.145,'primary');price(48,H*.712,W*.062,W-96,'primary-ink');text('period',t.period,48,H*.763,8,'primary-ink',W-96,{font:'sans'});
    button(32,H*.855,W-64,33,'accent','accent-ink');professionalFooter();
  }else if(t.composition==='schedule'){
    brand();eyebrow('primary',32,H*.105);title(32,H*.20,W*.067,W*.48);photo('hero',t.photo,W*.57,H*.16,W*.365,H*.22,{corner:2});
    price(32,H*.435,W*.041);rect('program-rule',32,H*.468,W-64,1,'accent');
    text('details',t.details,32,H*.515,11,'ink',W-64,{font:'sans',leading:210,tracking:.1});
    text('period',t.period,32,H*.77,8,'primary',W-64,{font:'sans'});button(32,H*.845,W-64,34);professionalFooter();
  }else if(t.composition==='itinerary'){
    photo('hero',t.photo,0,0,W,H*.38);rect('top-shade',0,0,W,H*.20,dark,{gradient:'fade-down',opacity:85});brand(white);eyebrow(white,32,66);
    title(32,H*.47,W*.073);price(32,H*.625,W*.054);
    text('details',t.details,32,H*.69,10.5,'ink',W-64,{font:'sans',leading:175,tracking:.1});
    text('period',t.period,32,H*.808,8,'primary',W-64,{font:'sans'});button(32,H*.86,W-64,33);professionalFooter();
  }else if(t.composition==='agenda'){
    photo('hero',t.photo,0,0,W,H*.26);rect('top-shade',0,0,W,H*.26,dark,{gradient:'fade-down',opacity:85});brand(white);eyebrow(white,32,66);
    title(32,H*.335,W*.067);price(32,H*.445,W*.041);rect('agenda-rule',32,H*.48,W-64,1,'accent');
    text('details',t.details,32,H*.53,11.5,'ink',W-64,{font:'sans',leading:210,tracking:.1});
    text('period',t.period,32,H*.785,8,'primary',W-64,{font:'sans'});button(32,H*.845,W-64,34);professionalFooter();
  }else if(t.composition==='conference'){
    photo('hero',t.photo,0,0,W,H*.565);rect('conference-shade',0,0,W,H*.565,dark,{opacity:60});brand(white);eyebrow(white,32,72);
    title(32,H*.31,W*.081,W-64,white);text('period',t.period,32,H*.505,8.5,white,W-64,{font:'sans',tracking:.7});
    price(32,H*.655,W*.058);details(32,H*.735,W-64,'ink',11);button(32,H*.855,W-64,34,'primary','primary-ink');professionalFooter();
  }else if(t.composition==='invite'){
    rect('invite-background',0,0,W,H,'primary');brand('primary-ink');eyebrow('accent',32,H*.14,W*.45);
    photo('hero',t.photo,W*.54,H*.12,W*.395,H*.295,{mask:'arch'});rect('invite-rule',32,H*.30,40,2,'accent');
    title(32,H*.485,W*.081,W-64,'primary-ink');price(32,H*.67,W*.054,W-64,'accent');details(32,H*.747,W-64,'primary-ink',10.5);
    button(32,H*.855,W-64,34,'accent','accent-ink');professionalFooter('primary-ink');
  }else if(t.composition==='listing'){
    photo('hero',t.photo,0,0,W,H*.565);rect('top-shade',0,0,W,100,dark,{gradient:'fade-down',opacity:85});brand(white);eyebrow(white,32,62);
    title(32,H*.645,W*.068);details(32,H*.79);price(32,H*.88,W*.060,W*.58);button(W*.67,H*.835,W*.267,34,'accent','accent-ink');text('address',t.address,32,H*.945,9,'ink',W*.7,{font:'sans',tracking:.2});footer('ink',H-10);
  }else if(t.composition==='split'){
    photo('hero',t.photo,W*.49,0,W*.51,H);rect('paper',0,0,W*.51,H,'background');brand('ink',W*.43,28,38);eyebrow('primary',28,75,W*.40);title(28,H*.255,W*.071,W*.42);details(28,H*.54,W*.40,'ink',10.5);price(28,H*.71,W*.065,W*.40);button(28,H*.80,W*.405,35);text('contact',t.contact,28,H-.075*H,8.5,'ink',W*.40,{font:'sans'});text('terms',t.terms,28,H-16,6.1,'ink',W*.40,{font:'sans'});
  }else if(t.composition==='spotlight'){
    photo('hero',t.photo,0,0,W,H,{cropY:t.category==='hair'?-35:0});rect('top-shade',0,0,W,H*.23,dark,{gradient:'fade-down',opacity:87});rect('bottom-shade',0,H*.35,W,H*.65,dark,{gradient:'fade-up',opacity:94});brand(white);eyebrow(white,32,67);title(32,H*.64,W*.09,W-64,white);price(32,H*.81,W*.068,W-64,'accent');details(32,H*.87,W-64,white,10.5);button(32,H*.91,W-64,32,'accent','accent-ink');footer(white,H-12);
  }else if(t.composition==='offer'){
    rect('offer-paper',0,0,W,H,'primary');photo('hero',t.photo,W*.51,H*.13,W*.43,H*.405,{mask:'arch',cropY:-25});brand('primary-ink');eyebrow('accent',32,H*.14,W*.42);price(32,H*.40,t.price.length>7?W*.08:W*.14,W*.43,'accent');text('period',t.period,32,H*.465,9,'primary-ink',W*.40,{font:'sans',tracking:.5});title(32,H*.635,W*.074,W-64,'primary-ink');details(32,H*.79,W-64,'primary-ink');button(32,H*.855,W-64,35,'accent','accent-ink');footer('primary-ink',H-14);
  }else if(t.composition==='service'){
    brand();eyebrow('primary',32,H*.115);title(32,H*.225,W*.079);photo('hero',t.photo,W*.53,H*.32,W*.405,H*.42,{mask:'arch',cropY:-15});rect('small-rule',32,H*.35,38,2,'accent');details(32,H*.425,W*.43,'ink',12);price(32,H*.70,W*.058,W*.44);button(32,H*.82,W-64,36);footer('ink',H-18);
  }else if(t.composition==='duo'){
    brand();eyebrow('primary',32,H*.105);title(32,H*.182,W*.065);photo('hero',t.photo,32,H*.29,W*.77,H*.33,{corner:3});photo('secondary',t.secondary||t.photo,W*.64,H*.46,W*.29,H*.22,{corner:2,effect:'soft',rotation:3});rect('photo-accent',32,H*.64,42,2,'accent');price(32,H*.75,W*.057);details(32,H*.815);button(32,H*.875,W-64,35);footer('ink',H-14);
  }else if(t.composition==='wide'){
    photo('hero',t.photo,W*.49,0,W*.51,H,{cropY:-10});rect('left-paper',0,0,W*.51,H,'background');brand('ink',W*.42,28,31);eyebrow('primary',28,61,W*.42);title(28,H*.34,W*.057,W*.42);details(28,H*.61,W*.42,'ink',9);price(28,H*.745,W*.040,W*.42);button(28,H*.82,W*.42,31);text('contact',t.contact,28,H-12,8,'ink',W*.42,{font:'sans'});
  }else{
    brand();eyebrow('primary',32,H*.11);photo('hero',t.photo,32,H*.16,W-64,H*.455,{corner:2,cropY:-15});title(32,H*(H/W<1.1?.675:.70),W*.073);price(32,H*.835,W*.055,W*.77);details(32,H*.88,W-64,'ink',9);button(32,H*.915,W*.50,29);text('contact',t.contact,W-32,H*.947,8.5,'ink',W*.36,{align:'end',font:'sans'});text('terms',t.terms,32,H-9,6,'ink',W-64,{font:'sans'});
  }
  return layers;
}
