/* ============================================
   MEND LEARN - Service Worker
   Offline support via runtime caching. No build step: this file is served
   from the site root and registered by js/layout.js on every page.

   Strategy:
   - Navigation & same-origin GET requests use stale-while-revalidate:
     serve the cached copy immediately (fast, offline-capable) while
     refreshing it in the background.
   - The cache is versioned; bumping CACHE_VERSION evicts old entries.
   ============================================ */

const CACHE_VERSION = 'mend-learn-v1';

self.addEventListener('install', (event) => {
    // Activate the new worker as soon as it finishes installing.
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_VERSION));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)),
            ),
        ).then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle same-origin GET requests; let everything else hit the network.
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(staleWhileRevalidate(request));
});

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request);

    const network = fetch(request)
        .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => cached);

    return cached || network;
}
