const cacheName = "v1";
self.addEventListener("install", (e) => {
  e.waitUntil(async () => {
    const cache = await caches.open(cacheName);
    await cache.add("./");
  });
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.registration?.navigationPreload.enable());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(async () => {
    const cacheResp = await caches.match(e.request);
    if (cacheResp) return cacheResp;

    const preloadResp = await e.preloadResponse;
    if (preloadResp) {
      putInCache(e.request, preloadResp);
      return preloadResp;
    }


    const netResp = fetch(e.request);
    putInCache(e.request, netResp);
    return netResp;
  });
});

async function newFunction(req, resp) {
  const cache = await caches.open(cacheName)
  await cache.put(req, resp.clone());
}

