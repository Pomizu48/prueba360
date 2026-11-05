const C = 'cabina360-v4';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // Solo la propia app: nunca videos ni direcciones blob: (el clip grabado)
  if (e.request.method !== 'GET' || u.protocol !== 'https:' || u.origin !== self.location.origin || e.request.destination === 'video') return;
  e.respondWith(
    fetch(e.request.url, { cache: 'no-cache' })
      .then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; })
      .catch(() => caches.match(e.request))
  );
});
