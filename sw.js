const CACHE='catalog-v5';
const ASSETS=['./','./index.html','./data.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(r=>{
      const net=e.request.mode==='navigate'?fetch(e.request).catch(()=>r):Promise.resolve(r);
      return net.then(n=>{
        if(n&&n.ok&&e.request.url.startsWith(self.location.origin)){
          const cp=n.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});
        }
        return n||r;
      }).catch(()=>r);
    })
  );
});