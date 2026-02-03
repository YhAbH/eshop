const CACHE_NAME = "eshop-cache-v1"; // 🔥 nombre del cache

const FILES_TO_CACHE = ["/index.css", "/manifest.json", "/imgs/logo.png"];

/* ================= INSTALL ================= */
self.addEventListener("install", (event) => {
  self.skipWaiting(); // fuerza actualización
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)),
  );
});

/* ================= ACTIVATE (BORRA CACHES VIEJOS) ================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🧨 borra snake y otros viejos
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // 🔥 Páginas HTML → siempre intenta red primero
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/login.html")),
    );
  } else {
    // Archivos estáticos → cache first
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request)),
    );
  }
});
