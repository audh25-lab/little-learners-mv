const CACHE_NAME = 'llmv-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/assets/banner.png',
  '/assets/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(resp => resp || fetch(req).then(fetchResp => {
      return caches.open(CACHE_NAME).then(cache => { cache.put(req, fetchResp.clone()); return fetchResp; });
    })).catch(()=> caches.match('/index.html'))
  );
});