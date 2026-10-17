var CACHE='catalog-v8-2';
var ASSETS=['./','./index.html','./data.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(Promise.all(ASSETS.map(function(u){
    return caches.open(CACHE).then(function(c){
      return c.add(new Request(u,{cache:'reload'})).catch(function(){});
    });
  })).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){return k===CACHE?null:caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(function(hit){
      var net=fetch(e.request).then(function(res){
        if(res&&res.status===200&&url.pathname.indexOf('sw')<0){
          var cl=res.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,cl);});
        }
        return res;
      }).catch(function(){return hit||caches.match('./index.html');});
      return hit||net;
    })
  );
});
