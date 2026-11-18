/* Service worker: rangkaian dahulu, simpanan (cache) jika tiada internet */
const C="menu-v2",F=["./","index.html","css/style.css","js/data.js","js/store.js","js/auth.js","js/admin.js","js/core.js","js/ui.js","js/charts.js","js/search.js","js/app.js","icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
