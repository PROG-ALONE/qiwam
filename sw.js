// Service Worker أولي (المرحلة A1): يكاش القشرة ويخدم الملفات من الكاش عند انقطاع الإنترنت.
// المرحلة A3 تكمّله: كاش المحتوى عند الطلب، وإشعار التحديث، والـ PDF.

const VERSION = 'qiwam-a1-1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(c => c.addAll([
    './', 'index.html', 'manifest.webmanifest',
    'styles/tokens.css', 'styles/base.css', 'styles/layout.css', 'styles/journey.css', 'styles/map.css',
    'core/app.js', 'core/router.js', 'core/store.js', 'core/theme.js',
  ])));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// الشبكة أولاً (حتى التحديثات توصل فوراً)، والكاش احتياط
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
