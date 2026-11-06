/* Cache limité à l'application. Jamais de profils ni d'API tierce en cache. */
const VERSION = 'trajectoire-v2-2026-11-06-6';
const FILES = ['./', './index.html', './styles.css', './engine.js', './sources.js', './workspace.js', './diagnostic.js', './app.js', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('trajectoire-v2-') && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.includes('/trajectoire-v2/')) return;
  // Network-first : prend la dernière version quand elle est disponible, garde un secours hors connexion.
  event.respondWith(fetch(req).then(response => {
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil(caches.open(VERSION).then(cache => cache.put(req, copy)));
    }
    return response;
  }).catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});