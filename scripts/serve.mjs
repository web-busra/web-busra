import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PHOTO_CATALOG} from '../src/photos.js';
const root=resolve(import.meta.dirname,'..'),files={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/favicon.svg':'favicon.svg','/src/app.js':'src/app.js','/src/design.js':'src/design.js','/src/templates.js':'src/templates.js','/src/art.js':'src/art.js','/LICENSE.txt':'LICENSE.txt'};
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',svg:'image/svg+xml',js:'text/javascript; charset=utf-8',txt:'text/plain; charset=utf-8',jpg:'image/jpeg'};
for(const name of ['library','document','storage','media','raster','export','icons','commercial','industries','photos','stock'])files['/src/'+name+'.js']='src/'+name+'.js';
files['/studio.css']='studio.css';
files['/business.css']='business.css';for(const photo of PHOTO_CATALOG)files['/'+photo.path]=photo.path;
for(const name of ['workspace','workspace-model','boot'])files['/src/'+name+'.js']='src/'+name+'.js';
files['/editor.html']='editor.html';files['/workspace.css']='workspace.css';files['/editor.css']='editor.css';
export function createStudioServer(){return createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Cross-Origin-Resource-Policy','same-origin');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; frame-ancestors 'none'");
  const host=req.headers.host||'';
  if(!/^(?:127\.0\.0\.1|localhost)(?::\d{1,5})?$/.test(host)||(req.headers.origin&&req.headers.origin!=='http://'+host)){res.writeHead(403);res.end();return;}
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  try{const path=new URL(req.url,'http://localhost').pathname;if(!Object.hasOwn(files,path)){res.writeHead(404);res.end();return;}const file=files[path],data=await readFile(resolve(root,file));res.writeHead(200,{'Content-Type':types[file.split('.').at(-1)],'Content-Length':data.length,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(500);res.end('The file could not be served.');}
});}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const server=createStudioServer(),port=Number(process.env.PORT||4173);
  server.requestTimeout=10000;server.headersTimeout=10000;
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port '+port+' kullanımda. PORT ortam değişkeniyle başka bir port seç.':error.message);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log('Forma Studio: http://127.0.0.1:'+server.address().port+'/'));
}
