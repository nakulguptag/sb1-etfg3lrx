self.addEventListener('install', (event: any) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
      caches.open('grm-cache-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json'
          // You can add more static assets here if needed
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event: any) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });