// H4 ERP service worker: makes the app installable and lets it open offline.
// Your data stays in the phone (localStorage / IndexedDB) – this file never touches it.
const VER='h4erp-v2',SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png'];
const LIBS=['cdnjs.cloudflare.com','cdn.jsdelivr.net','unpkg.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VER).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const same=u.origin===location.origin;
 if(same&&(r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html'))){ // page: network first so updates arrive, cache fallback offline
  e.respondWith(fetch(r).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(VER).then(k=>k.put('index.html',c))}return x}).catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));return}
 if(same||LIBS.includes(u.hostname)){ // assets and CDN libraries: cache first, refresh in background
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(VER).then(k=>k.put(r,c))}return x}).catch(()=>hit);return hit||net}))}});
