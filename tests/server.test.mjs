import test from 'node:test';
import assert from 'node:assert/strict';
import {createStudioServer} from '../scripts/serve.mjs';
import {request} from 'node:http';

test('Both entry pages, their styles, module graph and local images are served; private files and writes are rejected',async()=>{
  const server=createStudioServer();
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const origin='http://127.0.0.1:'+server.address().port,visited=new Set();
  async function visit(path){
    path=path.split('?')[0];if(visited.has(path))return;visited.add(path);
    const response=await fetch(origin+path);assert.equal(response.status,200,path);assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    const body=await response.text();
    if(path.endsWith('.html'))for(const [,dependency]of body.matchAll(/(?:href|src)="((?:src\/|[a-z-]+\.css|favicon\.svg)[^"]*)"/g))await visit('/'+dependency);
    if(path.endsWith('.js'))for(const [,dependency]of body.matchAll(/(?:from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g))if(dependency.startsWith('.'))await visit(new URL(dependency,origin+path).pathname);
  }
  try{
    await visit('/index.html');await visit('/editor.html');assert.ok(visited.size>=22);
    for(const path of ['/assets/photos/estate-villa.jpg','/assets/photos/beauty-products.jpg']){const response=await fetch(origin+path);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/jpeg');assert.ok((await response.arrayBuffer()).byteLength>1000);}
    const root=await fetch(origin+'/');assert.match(await root.text(),/İşletmeniz için ne tasarlıyoruz/);
    const head=await fetch(origin+'/editor.html',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.ok(Number(head.headers.get('content-length'))>1000);
    assert.match(head.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(head.headers.get('cross-origin-resource-policy'),'same-origin');assert.match(head.headers.get('permissions-policy'),/camera=\(\)/);
    assert.equal((await fetch(origin+'/index.html',{headers:{Origin:'https://untrusted.example'}})).status,403);
    const hostStatus=await new Promise((resolve,reject)=>{const req=request(origin+'/index.html',{headers:{Host:'rebinding.example'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});assert.equal(hostStatus,403);
    for(const path of ['/package.json','/.git/config','/tests/storage.test.mjs','/%2e%2e/package.json','/missing.html'])assert.equal((await fetch(origin+path)).status,404,path);
    assert.equal((await fetch(origin+'/index.html',{method:'POST'})).status,405);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
