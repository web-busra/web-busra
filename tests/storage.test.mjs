import test from 'node:test';
import assert from 'node:assert/strict';

test('Local storage keeps the newest fallback after a database write fails, then recovers without stale reads',async()=>{
  const originalIDB=globalThis.indexedDB,originalLocal=globalThis.localStorage;
  const rows=new Map(),fallback=new Map();let failWrites=false,failReads=false;
  const db={close(){},transaction(){
    const tx={error:new Error('Simulated quota failure'),objectStore(){return {
      get(key){const request={};queueMicrotask(()=>{if(failReads){request.error=new Error('Simulated read failure');request.onerror?.();}else{request.result=rows.get(key);request.onsuccess?.();}});return request;},
      put(value,key){queueMicrotask(()=>{if(failWrites)tx.onerror?.();else{rows.set(key,structuredClone(value));tx.oncomplete?.();}});}
    };}};return tx;
  }};
  globalThis.indexedDB={open(){const request={};queueMicrotask(()=>{request.result=db;request.onsuccess?.();});return request;}};
  globalThis.localStorage={getItem:key=>fallback.get(key)??null,setItem:(key,value)=>fallback.set(key,String(value)),removeItem:key=>fallback.delete(key)};
  try{
    const {readLocal,writeLocal}=await import('../src/storage.js?isolated-storage-test');
    assert.equal(await readLocal('draft'),null);
    rows.set('draft','legacy document');assert.equal(await readLocal('draft'),'legacy document');
    await writeLocal('draft','database version');assert.equal(await readLocal('draft'),'database version');
    failWrites=true;await writeLocal('draft','newest fallback');
    assert.equal(await readLocal('draft'),'newest fallback');
    failReads=true;assert.equal(await readLocal('draft'),'newest fallback');failReads=false;
    failWrites=false;await writeLocal('draft','recovered database');
    assert.equal(await readLocal('draft'),'recovered database');assert.equal(fallback.has('forma.v3.draft'),false);
    fallback.set('forma.v3.legacy','raw legacy fallback');assert.equal(await readLocal('legacy'),'raw legacy fallback');
    await writeLocal('draft-project',null);assert.equal(await readLocal('draft-project'),null);
    failWrites=true;globalThis.localStorage.setItem=()=>{throw Error('Both stores unavailable');};
    await assert.rejects(writeLocal('draft','unsaved'),/Both stores unavailable/);
    assert.equal(await readLocal('draft'),'recovered database');
  }finally{if(originalIDB===undefined)delete globalThis.indexedDB;else globalThis.indexedDB=originalIDB;if(originalLocal===undefined)delete globalThis.localStorage;else globalThis.localStorage=originalLocal;}
});
