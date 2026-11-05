// A recoverable startup state instead of an indefinitely spinning workspace.
try{
  if(document.body.dataset.app==='editor')await import('./app.js');
  else await import('./workspace.js');
}catch(error){
  console.error('Forma could not start:',error);
  document.getElementById('workspace-loading')?.remove();
  const panel=document.createElement('div');panel.className='boot-error';panel.setAttribute('role','alert');
  const title=document.createElement('h1');title.textContent='Stüdyo şu anda açılamadı.';
  const message=document.createElement('p');message.textContent='Dosyaların tamamının yüklendiğini ve sayfanın HTTP üzerinden açıldığını kontrol et. Sonra yeniden dene.';
  const retry=document.createElement('button');retry.textContent='Yeniden dene';retry.addEventListener('click',()=>location.reload());
  const link=document.createElement('a');link.href=new URL(document.body.dataset.app==='editor'?'index.html':'editor.html',location.href).href;link.textContent=document.body.dataset.app==='editor'?'Çalışma alanına dön':'Editörü aç';
  panel.append(title,message,retry,link);document.body.append(panel);
}
