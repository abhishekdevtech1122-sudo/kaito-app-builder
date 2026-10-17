const CACHE_NAME = 'star-merchant-v3';
const OFFLINE_URL = '/kaito-app-builder/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/kaito-app-builder/',
        OFFLINE_URL,
        '/kaito-app-builder/manifest.json'
      ]);
    })
  );
  self.skipWaiting(); // तुरंत कंट्रोल छीनने के लिए
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // पुराना कचरा साफ
          }
        })
      );
    })
  );
  self.clients.claim(); // सभी टैब्स पर तुरंत कब्जा
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
