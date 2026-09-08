(function(){
'use strict';
const DB='statistique_pool_offline', VER=3, API='https://poolseckibombo.site.je/api/offline_bootstrap.php', SYNC='https://poolseckibombo.site.je/api/sync.php';
let dbPromise;
function db(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VER);r.onupgradeneeded=()=>{const d=r.result;['meta','ecoles','collectes','suivi8','suivi6','queue'].forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n,{keyPath:'key'});});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return dbPromise;}
async function put(store,obj){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(store,'readwrite');tx.objectStore(store).put(obj);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);});}
async function getAll(store){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(store).objectStore(store).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function del(store,key){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(store,'readwrite');tx.objectStore(store).delete(key);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);});}
async function setBootstrap(x){for(const e of x.ecoles||[])await put('ecoles',{key:String(e.id),...e});for(const c of x.collectes||[])await put('collectes',{key:String(c.num),...c});for(const s of x.suivi8||[])await put('suivi8',{key:s.ecole_id+'-'+s.annee,...s,eleves:[]});for(const s of x.suivi6||[])await put('suivi6',{key:s.ecole_id+'-'+s.annee,...s,eleves:[]});for(const e of x.suivi8_eleves||[]){const a=(await getAll('suivi8')).find(s=>Number(s.id)===Number(e.suivi_id));if(a){a.eleves.push(e);await put('suivi8',a);}}for(const e of x.suivi6_eleves||[]){const a=(await getAll('suivi6')).find(s=>Number(s.id)===Number(e.suivi_id));if(a){a.eleves.push(e);await put('suivi6',a);}}await put('meta',{key:'last_bootstrap',value:Date.now()});if(x.user)await put('meta',{key:'server_user',value:x.user});}
async function bootstrap(force=false){if(!navigator.onLine)return false;const m=(await getAll('meta')).find(x=>x.key==='last_bootstrap');if(!force&&m&&Date.now()-m.value<300000)return true;try{const r=await fetch(API,{credentials:'same-origin'});if(!r.ok)return false;const x=await r.json();if(x.ok){await setBootstrap(x);return true;}}catch(e){}return false;}
async function queue(type,data){const id=crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();await put('queue',{key:id,id,type,data,created_at:Date.now()});setStatus();}
async function sync(){if(!navigator.onLine)return {sent:0};let items=await getAll('queue');if(!items.length)return {sent:0};try{const r=await fetch(SYNC,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});if(!r.ok)return {sent:0,error:'Connexion serveur refusée'};const x=await r.json();for(const z of x.results||[]){if(z.ok)await del('queue',z.id);}setStatus();return {sent:(x.results||[]).filter(z=>z.ok).length};}catch(e){return {sent:0,error:e.message};}}
async function saveCollection(data){await put('collectes',{key:String(data.num),...data,local_updated_at:Date.now()});await queue('collection',data);if(navigator.onLine)await sync();}
async function saveSuivi(type,data){await put(type==='suivi8'?'suivi8':'suivi6',{key:data.ecole_id+'-'+data.annee,...data,local_updated_at:Date.now()});await queue(type,data);if(navigator.onLine)await sync();}
async function schools(){return (await getAll('ecoles')).sort((a,b)=>Number(a.num)-Number(b.num));}
function statusEl(){return document.getElementById('offlineStatus');}
async function setStatus(){const el=statusEl();if(!el)return;const q=await getAll('queue');el.textContent=(navigator.onLine?'🟢 En ligne':'🔴 Hors ligne')+' — '+q.length+' donnée(s) en attente';el.className=navigator.onLine?'online':'offline';}
window.PoolOffline={bootstrap,sync,saveCollection,saveSuivi,schools,getAll,setStatus,queue};
window.addEventListener('online',async()=>{await setStatus();await bootstrap(true);await sync();await setStatus();});
window.addEventListener('offline',setStatus);setTimeout(setStatus,100);
})();
