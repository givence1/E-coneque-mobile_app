// TypeScript Service Worker for Econneq PWA

self.addEventListener("install", (event: ExtendableEvent) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open("econneq-cache-v1").then((cache) => {
      return cache.addAll(["/", "/index.html"]);
    })
  );
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  console.log("[Service Worker] Activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== "econneq-cache-v1" && caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open("econneq-cache-v1").then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
