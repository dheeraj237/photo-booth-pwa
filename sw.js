var CACHE_STATIC = 'static-v3';
var CACHE_DYNAMIC = 'dynamic-v3'
self.addEventListener('install', function (event) {
  console.log('[ServiceWorker] Installing ...', event)
  event.waitUntil(
    caches.open(CACHE_STATIC) // caching all static content.
      .then(function (cache) {
        console.log('[Servie Worker] Precaching App Shell...');
        cache.addAll([
          '/index.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/fetch.js',
          '/src/js/promise.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ])
        // cache.add('/');
        // cache.add('/index.html');
        // cache.add('/src/js/app.js');
      })
  )
})
// comment
self.addEventListener('activate', function (event) {
  console.log('[ServiceWorker] Activating ...', event);
  event.waitUntil( //removing cache of specific keyword..
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
            console.log('[Service Worker] removing old caches...', key);
            return caches.delete(key);
          }
        }));
      })
  )
  return self.clients.claim();
})
self.addEventListener('fetch', function (event) {
  // console.log('[ServiceWorker] Fetching ...', event);
  // return self.clients.claim();
  event.respondWith(
    caches.match(event.request)
      .then(function (res) {
        if (res) {
          return res;
        } else {
          return fetch(event.request)
            .then(function (res1) {
              return caches.open(CACHE_DYNAMIC) //re caching the dynammic contents
                .then(function (cache) {
                  cache.put(event.request.url, res1.clone());
                  return res1;
                })
            })
            .catch(function (err) {
              console.log('%cFetch Error', 'color:white;background-color:red', err)
            })
        }
      })
  )
})