// Minimal service worker so browsers treat BonAppi as installable.
// It deliberately caches nothing: every request goes to the network, so a
// new deploy is never hidden behind a stale cache. Offline support comes later.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
