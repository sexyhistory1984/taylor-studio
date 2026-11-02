/* Taylor Caldwell Studio service worker. CACHE is stamped from the content hash of the studio assets by tools/stamp.py,
   so every deploy that changes the site gets a new cache and old ones are deleted on activate. */
const VERSION = '751e23852a';
const CACHE = 'tc-studio-' + VERSION;
const SHELL = ['/', '/index.html', '/assets/studio.css?v=' + VERSION, '/assets/studio.js?v=' + VERSION, '/manifest.webmanifest', '/assets/taylor.jpg', '/assets/favicon.svg', '/404.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const accept = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    // Pages: network first, cached copy when offline, 404 page as a last resort.
    e.respondWith(fetch(req).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('/404.html'))));
    return;
  }
  // Assets: stale-while-revalidate. Versioned URLs change when content changes, so a cached hit is always current.
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
