/* SPORT10 service worker — membuat kunjungan ulang langsung terbuka (tanpa menunggu jaringan). */
var V = 'sport10-3.1.0-e50f39be99';
var SHELL = ['./', 'logo.webp', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('sport10-') === 0 && k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function notifyUpdate() {
  self.clients.matchAll({ type: 'window' }).then(function (cs) { cs.forEach(function (c) { c.postMessage({ type: 'update' }); }); });
}
var lastCheck = Promise.resolve(false); // hasil cek versi halaman terakhir (untuk halaman yang baru siap mendengar)
self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'ask' && e.source) lastCheck.then(function (changed) { if (changed) e.source.postMessage({ type: 'update' }); });
});
function tag(r) { return r ? (r.headers.get('etag') || r.headers.get('last-modified') || r.headers.get('content-length') || '') : ''; }

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // API Google & gambar QR: langsung ke jaringan

  // Data snapshot: utamakan jaringan (maks 3 detik), cadangan dari cache
  if (/\/data\.json$/.test(url.pathname)) {
    e.respondWith(new Promise(function (resolve) {
      var done = false, cached = null;
      caches.match('data.json', { ignoreSearch: true }).then(function (c) { cached = c; });
      var t = setTimeout(function () { if (!done && cached) { done = true; resolve(cached); } }, 3000);
      fetch(req).then(function (r) {
        if (r.ok) { var cp = r.clone(); caches.open(V).then(function (c) { c.put('data.json', cp); }); }
        if (!done) { done = true; clearTimeout(t); resolve(r); }
      }).catch(function () {
        if (!done) { done = true; clearTimeout(t); resolve(cached || caches.match('data.json', { ignoreSearch: true }).then(function (c) { return c || Response.error(); })); }
      });
    }));
    return;
  }

  // Halaman & aset: tampilkan dari cache seketika, perbarui di latar (beri tahu bila ada versi baru)
  var isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);
  var key = isPage ? './' : req;
  e.respondWith(caches.open(V).then(function (c) {
    return c.match(key, { ignoreSearch: isPage }).then(function (hit) {
      var changed = false;
      var net = fetch(isPage ? new Request('./', { cache: 'no-cache' }) : req).then(function (r) {
        if (r.ok && r.type === 'basic') {
          var old = tag(hit), cp = r.clone();
          changed = !!(isPage && hit && old && tag(r) && old !== tag(r));
          return c.put(key, cp).then(function () { if (changed) notifyUpdate(); return r; });
        }
        return r;
      }).catch(function () { return hit || Response.error(); });
      if (isPage) lastCheck = net.then(function () { return changed; }, function () { return false; });
      if (hit) { e.waitUntil(net.catch(function () {})); return hit; }
      return net;
    });
  }));
});
