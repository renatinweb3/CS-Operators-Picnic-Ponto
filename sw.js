// Picnic·Ponto Service Worker
// Minimal SW to satisfy PWA installability criteria on Chrome/Android
// Safari does not require a SW for Add to Home Screen

const CACHE = 'picnic-ponto-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['./index.html']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Cache-first for the main page, network-first for everything else
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
