// H4 ERP Service Worker
// Supports app installation, offline loading and asset caching.
// Does not modify LocalStorage or IndexedDB.

const VER = 'h4erp-v2-iconfix';

const BASE = self.registration.scope;
const APP_URL = new URL('./', BASE).href;
const INDEX_URL = new URL('index.html', BASE).href;
const MANIFEST_URL = new URL('manifest.webmanifest', BASE).href;

// Assumes these files are in the same folder as index.html.
const SHELL = [
  APP_URL,
  INDEX_URL,
  MANIFEST_URL,
  new URL('icon-192.png', BASE).href,
  new URL('icon-512.png', BASE).href,
  new URL('maskable-192.png', BASE).href,
  new URL('maskable-512.png', BASE).href,
  new URL('favicon-32.png', BASE).href,
  new URL('apple-touch-icon.png', BASE).href
];

const LIBS = [
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VER)
      .then(cache =>
        Promise.all(
          SHELL.map(url =>
            cache.add(url).catch(error => {
              console.warn('H4 ERP asset not cached:', url, error);
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== VER)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const inScope = url.href.startsWith(BASE);
  const isLibrary = LIBS.includes(url.hostname);

  if (inScope &&
      (request.mode === 'navigate' ||
       url.pathname.endsWith('/index.html') ||
       url.href === APP_URL)) {

    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(VER)
              .then(cache => cache.put(INDEX_URL, copy));
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(INDEX_URL)) ||
                 (await caches.match(APP_URL)) ||
                 Response.error();
        })
    );

    return;
  }

  if (inScope || isLibrary) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(response => {
          if (response.ok || response.type === 'opaque') {
            const copy = response.clone();
            caches.open(VER)
              .then(cache => cache.put(request, copy));
          }
          return response;
        });

        return cached || network.catch(() => Response.error());
      })
    );
  }
});