// Browser-local storage. Timestamped envelopes reconcile an IndexedDB failure
// followed by recovery, so a newer fallback never loses to an older database row.
const DB='forma-studio-v3',STORE='projects',PREFIX='forma.v3.';
let connection,clock=0;
const envelope=value=>({formaStorage:1,updatedAt:clock=Math.max(Date.now(),clock+1),value});
const unpack=value=>value&&typeof value==='object'&&value.formaStorage===1&&Number.isFinite(value.updatedAt)?value:{updatedAt:0,value:value??null};

async function open(){
  if(connection)return connection;
  connection=new Promise((resolve,reject)=>{
    let settled=false;
    const finish=(error,db)=>{if(settled){db?.close();return;}settled=true;clearTimeout(timer);error?reject(error):resolve(db);};
    const timer=setTimeout(()=>finish(Error('Yerel depolama zaman aşımına uğradı.')),3500);
    try{
      const request=indexedDB.open(DB,1);
      request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE);};
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();connection=undefined;};finish(null,db);};
      request.onerror=()=>finish(request.error||Error('Yerel veritabanı açılamadı.'));
      request.onblocked=()=>finish(Error('Yerel veritabanı başka bir sekmede engellendi.'));
    }catch(error){finish(error);}
  });
  try{return await connection;}catch(error){connection=undefined;throw error;}
}

export async function readLocal(key){
  let primary=null,fallback=null,read=false,lastError;
  try{
    const db=await open();
    primary=await new Promise((resolve,reject)=>{const tx=db.transaction(STORE),request=tx.objectStore(STORE).get(key);request.onsuccess=()=>resolve(request.result??null);request.onerror=()=>reject(request.error);tx.onabort=()=>reject(tx.error);});
    read=true;
  }catch(error){lastError=error;}
  try{const value=localStorage.getItem(PREFIX+key);if(value!==null){try{const parsed=JSON.parse(value);fallback=parsed?.formaStorage===1?parsed:value;}catch{fallback=value;}}read=true;}catch(error){lastError=error;}
  if(!read)throw lastError||Error('Yerel kayıtlar okunamadı.');
  const a=unpack(primary),b=unpack(fallback);
  clock=Math.max(clock,a.updatedAt,b.updatedAt);
  return fallback!==null&&b.updatedAt>=a.updatedAt?b.value:a.value;
}

export async function writeLocal(key,value){
  if(key==='collection'&&typeof value==='string'&&value.length>=80000000)throw Error('Koleksiyonun toplam kayıt sınırı doldu. Bir kaydı FORMA olarak indirip kaldır.');
  const entry=envelope(value);
  try{
    const db=await open();
    await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(entry,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  }catch{
    localStorage.setItem(PREFIX+key,JSON.stringify(entry));
    return;
  }
  try{localStorage.removeItem(PREFIX+key);}catch{/* The database transaction already completed. */}
}
