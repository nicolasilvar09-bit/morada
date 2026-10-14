/* Heartville: funciona offline. Página: rede primeiro (pega atualizações), cache se estiver sem internet.
   Imagens e fontes: cache primeiro, atualiza em segundo plano. */
const C='heartville-v1';
const CORE=['./','index.html','manifest.json','icone.png','apple-touch-icon.png','favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.cache==='no-store')return;const u=new URL(r.url);
  const same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(!same&&!font)return;if(same&&u.searchParams.has('vc'))return;
  if(r.mode==='navigate'||(same&&/\.html$|\/$/.test(u.pathname))){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));}return res;}).catch(()=>caches.match('index.html').then(m=>m||caches.match('./'))));return;}
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;}).catch(()=>m);return m||net;}));});
