import {TEMPLATES,CATEGORIES,FORMATS,templateDesign,buildSVG,dimensions,cleanText} from './design.js';
import {normalizeDocument,parseDocument,documentJSON,activeDesign,uid,MAX_PROJECT_BYTES} from './document.js';
import {readLocal,writeLocal} from './storage.js';
import {validateAssets} from './media.js';
import {icon,hydrate} from './icons.js';
import {fold,normalizeFavorites,searchTemplates,blankDesign,editorURL} from './workspace-model.js';

const $=id=>document.getElementById(id);
const views={home:'Genel bakış',templates:'Şablonları keşfet',projects:'Projelerim',favorites:'Favorilerim'};
let view='home',category='all',query='',format='all',sort='curated',limit=4,favorites=[],collection=[],draft=null,recovery=null,previewID=null,newFormat='square',renameID=null,toastTimer,undoAction=null,commandIndex=0,mutation=Promise.resolve();
hydrate();
// Preserve root-level share links created by earlier releases.
if(/^#v[123]\./.test(location.hash))location.replace(new URL('editor.html'+location.hash,location.href));

function toast(message,undo=null){clearTimeout(toastTimer);$('toast-message').textContent=message;undoAction=undo;$('toast-undo').hidden=!undo;$('workspace-toast').classList.add('visible');toastTimer=setTimeout(()=>{$('workspace-toast').classList.remove('visible');undoAction=null;},undo?12000:4500);}
$('toast-undo').addEventListener('click',()=>{const action=undoAction;if(!action)return;undoAction=null;guarded(async()=>{await action();toast('Proje geri getirildi.');});});
function guarded(task){mutation=mutation.then(task).catch(error=>toast(error.message||'İşlem kaydedilemedi. Yerel depolama alanını kontrol et.'));return mutation;}
async function load(){
  const keys=['favorites','collection','draft','recovery'];
  const results=await Promise.allSettled(keys.map(key=>readLocal(key)));
  for(let i=0;i<results.length;i++){
    const result=results[i];if(result.status!=='fulfilled'){toast('Yerel kayıtlar okunamadı. FORMA dosyalarını editörden açabilirsin.');continue;}
    try{let data=result.value;if(!data&&keys[i]==='draft')data=localStorage.getItem('forma.draft.v2');if(!data&&keys[i]==='collection')data=localStorage.getItem('forma.collection.v2')||localStorage.getItem('forma.collection.v1');if(!data)continue;
      if(keys[i]==='favorites')favorites=normalizeFavorites(JSON.parse(data));
      if(keys[i]==='collection'){if(data.length>80000000)throw Error();const items=JSON.parse(data);if(!Array.isArray(items))throw Error();collection=items.slice(0,12).filter(item=>item&&/^[a-z0-9-]{1,80}$/i.test(item.id)).map(item=>({id:item.id,document:normalizeDocument(item.document||{design:item.design}),updatedAt:typeof item.updatedAt==='string'?item.updatedAt:''}));}
      if(keys[i]==='draft')draft=parseDocument(data);
      if(keys[i]==='recovery')recovery=parseDocument(data);
    }catch{toast('Bir yerel kayıt okunamadı. Diğer çalışmaların kullanılabilir.');}
  }
  if(draft&&recovery&&documentJSON(draft)===documentJSON(recovery))recovery=null;
}

function setView(next,{push=true}={}){
  view=Object.hasOwn(views,next)?next:'home';limit=view==='home'?4:16;category='all';query='';format='all';sort='curated';
  $('catalog-search').value='';$('catalog-format').value='all';$('catalog-sort').value='curated';
  $('breadcrumb').textContent=views[view];document.title=views[view]+' — Forma Studio';
  document.querySelectorAll('.main-nav [data-view]').forEach(button=>{if(button.dataset.view===view)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('home-intro').hidden=view!=='home';$('view-heading').hidden=view==='home';$('view-title').textContent=views[view];$('projects-section').hidden=!['home','projects'].includes(view);$('catalog-section').hidden=view==='projects';$('bottom-banner').hidden=view!=='home';
  $('all-projects').hidden=view==='projects';$('all-templates').hidden=view!=='home';
  $('projects-title').textContent=view==='projects'?'Projelerin, bir arada.':'Kaldığın yerden devam et.';
  $('projects-description').textContent=view==='projects'?'Taslaklarına dön. Kaydettiğin fikirleri yeniden şekillendir.':'Fikirlerini yarım bırakma.';
  $('catalog-title').textContent=view==='favorites'?'İlhamını biriktir.':view==='templates'?'Bir başlangıç seç. Kendin yap.':'Senin için seçtik.';
  $('catalog-overline').textContent=view==='favorites'?'FAVORİ KOLEKSİYONUN':view==='templates'?'72 TASARIM. HER BİRİ BİR BAŞLANGIÇ.':'İYİ BİR BAŞLANGIÇ İÇİN';
  $('catalog-description').textContent=view==='favorites'?'Sevdiğin şablonlar burada seni bekliyor.':'İşine ve fikrine yakışan, her detayı düzenlenebilir tasarımlar.';
  $('advanced-filters').hidden=view==='home';$('filters-button').setAttribute('aria-expanded',String(view!=='home'));
  if(push){const url=new URL(location.href);url.searchParams.delete('view');if(view!=='home')url.searchParams.set('view',view);history.pushState({view},'',url);}
  renderCategories();renderCatalog();renderProjects();window.scrollTo({top:0,behavior:'instant'});
}
function renderCategories(){
  $('home-categories').replaceChildren();
  const shown=view==='home'?CATEGORIES:CATEGORIES;
  for(const c of shown){const button=document.createElement('button');button.dataset.homeCategory=c.id;button.setAttribute('aria-pressed',String(c.id===category));button.textContent=c.id==='all'?'Tümü':c.name;$('home-categories').append(button);}
}
function art(design,prefix,assets=[],stock=false){return buildSVG({...design,size:512},{prefix,assets,previewStock:stock});}
function renderCatalog(){
  const matches=searchTemplates({query,category,format,sort,favorites:view==='favorites'?favorites:null});
  $('catalog-grid').replaceChildren();
  for(const t of matches.slice(0,limit)){
    const card=document.createElement('article');card.className='catalog-card';
    const open=document.createElement('button');open.className='catalog-open';open.dataset.preview=t.id;open.setAttribute('aria-label',t.name+' şablonunu önizle');
    const image=document.createElement('span');image.className='catalog-art';image.innerHTML=art(templateDesign(t.id),'home-'+t.id,[],true);image.setAttribute('aria-hidden','true');
    const hover=document.createElement('span');hover.className='catalog-hover';hover.textContent='Şablonu keşfet ↗';image.append(hover);
    const title=document.createElement('span');title.className='catalog-name';const label=document.createElement('span');label.textContent=t.name;const arrow=document.createElement('span');arrow.textContent='↗';title.append(label,arrow);
    const meta=document.createElement('span');meta.className='catalog-meta';meta.append(CATEGORIES.find(c=>c.id===t.category).name,document.createElement('span'),FORMATS[t.format].name+' · '+FORMATS[t.format].label);
    open.append(image,title,meta);
    const favorite=document.createElement('button');favorite.className='favorite-button';favorite.dataset.favorite=t.id;favorite.innerHTML=icon('bookmark');favorite.setAttribute('aria-pressed',String(favorites.includes(t.id)));favorite.setAttribute('aria-label',t.name+(favorites.includes(t.id)?' favorilerden çıkar':' favorilere ekle'));
    card.append(open,favorite);$('catalog-grid').append(card);
  }
  $('catalog-empty').hidden=matches.length>0;
  const emptyFavorites=view==='favorites'&&favorites.length===0;
  $('empty-title').textContent=emptyFavorites?'İlhamına burada yer aç.':'Bu aramaya biraz alan açalım.';
  $('empty-description').textContent=emptyFavorites?'Şablonların köşesindeki yer imine dokun. Sevdiklerin burada biriksin.':'Farklı bir kelime dene veya filtreleri temizle.';
  $('empty-action').textContent=emptyFavorites?'Şablonları keşfet':'Filtreleri temizle';
  $('catalog-count').textContent=matches.length?Math.min(matches.length,limit)+' / '+matches.length+' tasarım':'';
  $('show-more').hidden=matches.length<=limit;$('favorite-total').textContent=favorites.length;
}
function clearFilters(){category='all';query='';format='all';sort='curated';limit=view==='home'?4:16;$('catalog-search').value='';$('catalog-format').value='all';$('catalog-sort').value='curated';renderCategories();renderCatalog();}
function projectEntries(){return [...(draft?[{id:'draft',document:draft,draft:true}]:[]),...collection,...(recovery?[{id:'recovery',document:recovery,recovery:true}]:[])];}
function renderProjects(){
  const entries=projectEntries();$('projects-section').hidden=view!=='projects'&&(view!=='home'||entries.length===0);$('project-total').textContent=entries.length;$('projects-empty').hidden=entries.length>0;$('project-grid').replaceChildren();
  for(const item of entries.slice(0,view==='home'?3:20)){
    const card=document.createElement('article');card.className='project-card';
    const open=document.createElement('a');open.className='project-open';open.href=editorURL(item.draft?{}:item.recovery?{recover:1}:{project:item.id});open.setAttribute('aria-label',item.document.name+' projesine devam et');
    const image=document.createElement('span');image.className='project-thumbnail';image.innerHTML=art(activeDesign(item.document),'project-'+item.id,item.document.assets);image.setAttribute('aria-hidden','true');
    if(item.draft||item.recovery){const badge=document.createElement('span');badge.className='draft-tag';badge.textContent=item.draft?'SON TASLAK':'ÖNCEKİ TASLAK';image.append(badge);}
    const info=document.createElement('span');info.className='project-info';const name=document.createElement('strong');name.textContent=item.document.name;const details=document.createElement('small');details.textContent=item.document.pages.length+' sayfa · '+(item.draft?'Otomatik kaydedildi':item.recovery?'Yeni tasarım öncesi yedek':'Bu cihazda kayıtlı');info.append(name,details);open.append(image,info);card.append(open);
    const actions=document.createElement('div');actions.className='project-actions';
    for(const [action,glyph,label]of [['rename','pen','Yeniden adlandır'],['duplicate','duplicate','Kopyasını kaydet'],...(!item.draft&&!item.recovery?[['delete','trash','Kaydı kaldır']]:[])]){const button=document.createElement('button');button.dataset.projectAction=action;button.dataset.projectId=item.id;button.innerHTML=icon(glyph);button.setAttribute('aria-label',item.document.name+': '+label);button.title=label;actions.append(button);}
    card.append(actions);$('project-grid').append(card);
  }
}
async function toggleFavorite(id){
  if(!TEMPLATES.some(t=>t.id===id))return;
  await guarded(async()=>{const next=favorites.includes(id)?favorites.filter(key=>key!==id):[...favorites,id];await writeLocal('favorites',JSON.stringify(next));favorites=next;const active=document.activeElement?.dataset.favorite;renderCatalog();if(active)$('catalog-grid').querySelector(`[data-favorite="${active}"]`)?.focus({preventScroll:true});updatePreviewFavorite();toast(favorites.includes(id)?'İlham koleksiyonuna eklendi.':'Favorilerden çıkarıldı.');});
}
function updatePreviewFavorite(){if(!previewID)return;const button=$('preview-favorite');button.setAttribute('aria-pressed',String(favorites.includes(previewID)));button.lastElementChild.textContent=favorites.includes(previewID)?'Favorilerinde · Kaldır':'Favorilere ekle';}
function preview(id){const t=TEMPLATES.find(t=>t.id===id);if(!t)return;previewID=id;const design=templateDesign(id),size=dimensions(design);$('preview-art').innerHTML=art(design,'preview-'+id,[],true);$('preview-title').textContent=t.name;$('preview-category').textContent=CATEGORIES.find(c=>c.id===t.category).name.toLocaleUpperCase('tr')+' / FORMA KOLEKSİYONU';$('preview-size').textContent=size.exportWidth+' × '+size.exportHeight+' px · '+size.label;$('use-template').href=editorURL({template:id});updatePreviewFavorite();if(!$('preview-dialog').open)$('preview-dialog').showModal();}
function setNewFormat(value){newFormat=value;$('new-custom').hidden=value!=='custom';for(const id of ['new-width','new-height'])$(id).disabled=value!=='custom';$('new-hint').textContent=value==='custom'?'128–2048 px arasında ölçüler seç. Çıktı çözünürlüğünü editörden ayarlayabilirsin.':'Tuval biçimini editörden de değiştirebilirsin.';document.querySelectorAll('[data-new-format]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.newFormat===value)));}
function create(value='square'){setNewFormat(value);$('new-dialog').showModal();$('new-name').focus();}
const actions=[{label:'Yeni tasarım oluştur',glyph:'plus',run:()=>create()},{label:'Şablonları keşfet',glyph:'shapes',run:()=>setView('templates')},{label:'Projelerim',glyph:'folder',run:()=>setView('projects')},{label:'Favorilerim',glyph:'bookmark',run:()=>setView('favorites')},{label:'Son taslağa devam et',glyph:'right',run:()=>location.assign(editorURL())},{label:'Kullanım rehberi',glyph:'help',run:()=>$('guide-dialog').showModal()}];
let commandItems=[];
function renderCommands(){
  const value=$('command-search').value;
  commandItems=[...actions.filter(a=>!value||fold(a.label).includes(fold(value))),...searchTemplates({query:value}).slice(0,value?7:3).map(t=>({label:t.name,glyph:'shapes',detail:CATEGORIES.find(c=>c.id===t.category).name,run:()=>preview(t.id)}))];
  commandIndex=0;$('command-results').replaceChildren();
  commandItems.forEach((action,i)=>{
    const button=document.createElement('button');button.dataset.commandIndex=String(i);button.id='command-option-'+i;button.setAttribute('role','option');button.tabIndex=-1;button.innerHTML=icon(action.glyph);
    const label=document.createElement('span');label.textContent=action.label;button.append(label);
    if(action.detail){const small=document.createElement('small');small.textContent=action.detail;button.append(small);}
    button.setAttribute('aria-selected',String(i===0));$('command-results').append(button);
  });
  if(commandItems.length)$('command-search').setAttribute('aria-activedescendant','command-option-0');
  else{$('command-search').removeAttribute('aria-activedescendant');const p=document.createElement('p');p.className='command-empty';p.textContent='Biraz farklı bir kelime deneyelim.';$('command-results').append(p);}
}
function commands(){renderCommands();$('command-dialog').showModal();$('command-search').focus();}
function runCommand(index){const item=commandItems[index];if(!item)return;$('command-dialog').close();item.run();}
function selectCommand(index){if(!commandItems.length)return;commandIndex=(index+commandItems.length)%commandItems.length;[...$('command-results').children].forEach((button,i)=>button.setAttribute('aria-selected',String(i===commandIndex)));$('command-search').setAttribute('aria-activedescendant','command-option-'+commandIndex);$('command-results').children[commandIndex]?.scrollIntoView({block:'nearest'});}

document.addEventListener('click',event=>{
  const control=event.target.closest('button');if(!control)return;
  if(control.dataset.view){setView(control.dataset.view);return;}
  if(control.dataset.close){$(control.dataset.close).close();return;}
  if(control.dataset.preview){preview(control.dataset.preview);return;}
  if(control.dataset.favorite){toggleFavorite(control.dataset.favorite);return;}
  if(control.dataset.blank){create(control.dataset.blank);return;}
  if(control.dataset.newFormat){setNewFormat(control.dataset.newFormat);return;}
  if(control.dataset.homeCategory){category=control.dataset.homeCategory;limit=view==='home'?4:16;renderCategories();renderCatalog();return;}
  if(control.dataset.commandIndex!==undefined){runCommand(Number(control.dataset.commandIndex));return;}
  if(control.dataset.action){({create:()=>create(),commands,guide:()=>$('guide-dialog').showModal(),storage:()=>toast('Kişisel alanın bu tarayıcıda saklanır. Önemli projelerini FORMA dosyası olarak indir.')}[control.dataset.action])?.();return;}
  if(control.dataset.projectAction){const id=control.dataset.projectId,item=projectEntries().find(p=>p.id===id);if(!item)return;
    if(control.dataset.projectAction==='rename'){renameID=id;$('rename-input').value=item.document.name;$('rename-dialog').showModal();$('rename-input').select();return;}
    guarded(async()=>{
      if(control.dataset.projectAction==='duplicate'){if(collection.length>=12)throw Error('12 proje sınırına ulaştın. Bir kaydı kaldır veya FORMA dosyası indir.');const next=[{id:uid('saved'),document:normalizeDocument({...item.document,name:cleanText(item.document.name+' kopya',60)}),updatedAt:new Date().toISOString()},...collection];await writeLocal('collection',JSON.stringify(next));collection=next;renderProjects();toast('Tüm sayfalarıyla bir kopya kaydedildi.');}
      if(control.dataset.projectAction==='delete'){const removed=collection.find(p=>p.id===id),index=collection.findIndex(p=>p.id===id);if(!removed)return;const next=collection.filter(p=>p.id!==id);await writeLocal('collection',JSON.stringify(next));collection=next;renderProjects();toast('Proje kaydı kaldırıldı.',async()=>{if(collection.some(p=>p.id===removed.id))return;if(collection.length>=12)throw Error();const restored=[...collection];restored.splice(Math.min(index,restored.length),0,removed);await writeLocal('collection',JSON.stringify(restored));collection=restored;renderProjects();});}
    });
  }
});
$('new-form').addEventListener('submit',event=>{event.preventDefault();try{blankDesign({format:newFormat,width:$('new-width').value,height:$('new-height').value,name:$('new-name').value||'Adsız tasarım'});location.assign(editorURL({new:newFormat,name:$('new-name').value||'Adsız tasarım',...(newFormat==='custom'?{w:$('new-width').value,h:$('new-height').value}:{})}));}catch(error){$('new-hint').textContent=error.message;}});
$('rename-form').addEventListener('submit',event=>{event.preventDefault();guarded(async()=>{const name=cleanText($('rename-input').value.trim(),60,'',1);if(!name)throw Error('Projene bir isim yaz.');if(renameID==='draft'||renameID==='recovery'){const key=renameID,next=normalizeDocument({...(key==='draft'?draft:recovery),name});await writeLocal(key,documentJSON(next));if(key==='draft')draft=next;else recovery=next;}else{const next=collection.map(item=>item.id===renameID?{...item,document:normalizeDocument({...item.document,name}),updatedAt:new Date().toISOString()}:item);await writeLocal('collection',JSON.stringify(next));collection=next;}$('rename-dialog').close();renderProjects();toast('Projenin adı güncellendi.');});});
$('preview-favorite').addEventListener('click',()=>toggleFavorite(previewID));
$('preview-dialog').addEventListener('close',()=>document.querySelector(`[data-preview="${previewID}"]`)?.focus({preventScroll:true}));
$('filters-button').addEventListener('click',()=>{const open=$('advanced-filters').hidden;$('advanced-filters').hidden=!open;$('filters-button').setAttribute('aria-expanded',String(open));if(open)$('catalog-search').focus();});
for(const [id,key]of [['catalog-search','query'],['catalog-format','format'],['catalog-sort','sort']])$(id).addEventListener(id==='catalog-search'?'input':'change',event=>{if(key==='query')query=event.target.value;if(key==='format')format=event.target.value;if(key==='sort')sort=event.target.value;limit=view==='home'?4:16;renderCatalog();});
$('clear-filters').addEventListener('click',clearFilters);$('empty-action').addEventListener('click',()=>{if(view==='favorites'&&!favorites.length)setView('templates');else clearFilters();});$('show-more').addEventListener('click',()=>{limit+=12;renderCatalog();});
$('brand-shortcut').addEventListener('click',()=>location.assign(editorURL({panel:'brand'})));
$('command-search').addEventListener('input',renderCommands);
$('command-dialog').addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','Enter'].includes(event.key)){event.preventDefault();if(event.key==='Enter')runCommand(commandIndex);else selectCommand(commandIndex+(event.key==='ArrowUp'?-1:1));}});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if($('command-dialog').open)$('command-dialog').close();else if(!document.querySelector('dialog[open]'))commands();}});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
$('home-import').addEventListener('click',()=>$('home-project-file').click());
$('home-project-file').addEventListener('change',event=>{const file=event.target.files[0];event.target.value='';if(!file)return;guarded(async()=>{if(file.size>MAX_PROJECT_BYTES)throw Error('Proje dosyası en fazla 20 MB olabilir.');const document=parseDocument(await file.text());await validateAssets(document.assets);await writeLocal('pending-import',documentJSON(document));location.assign(editorURL({open:'import'}));});});
for(const [value,label,note,glyph]of [['square','Sosyal medya','1080 × 1080','grid'],['portrait','Dikey gönderi','1080 × 1350','image'],['story','Hikâye','1080 × 1920','image'],['wide','Sunum','1920 × 1080','play'],['a4','Afiş & belge','A4 · Dikey','folder'],['custom','Özel boyut','Ölçüleri sen belirle','plus']]){const button=document.createElement('button');button.type='button';button.dataset.newFormat=value;button.innerHTML=icon(glyph);const name=document.createElement('strong');name.textContent=label;const small=document.createElement('small');small.textContent=note;button.append(name,small);$('new-formats').append(button);}
for(const [i,id]of ['hotel-signature','pilates-signature','meeting-conference'].entries())$('hero-art-'+(i+1)).innerHTML=art(templateDesign(id),'hero-'+i,[],true);
await load();
setView(new URLSearchParams(location.search).get('view')||'home',{push:false});
addEventListener('popstate',()=>setView(new URLSearchParams(location.search).get('view')||'home',{push:false}));
addEventListener('pageshow',event=>{if(event.persisted)load().then(()=>{renderProjects();renderCatalog();});});
