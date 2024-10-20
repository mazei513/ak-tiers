const cacheName = "v1";

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.add(new Request("./", { cache: "reload" }));
  })())
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.registration?.navigationPreload.enable());
});
self.addEventListener("fetch", (e) => {
  e.respondWith(fetchHandler(e));
});

async function fetchHandler(e) {
  const cache = await caches.open(cacheName)
  const cacheResp = await cache.match(e.request);
  if (cacheResp) {
    netResp(e).then((netResp) => {
      putInCache(e.request, netResp);
    });
    return cacheResp;
  }
  const resp = await netResp(e);
  putInCache(e.request, resp)
  return rest;
}

async function netResp(e) {
  const preloadResp = await e.preloadResponse;
  if (preloadResp) {
    return preloadResp;
  }

  const netResp = await fetch(e.request);
  return netResp;
}

async function putInCache(req, resp) {
  const cache = await caches.open(cacheName)
  await cache.put(req, resp.clone());
}

