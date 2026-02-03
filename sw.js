const CACHE_NAME = "eshop-cache-v1"; // 🔥 nombre del cache

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/login.html",
  "/index.css",
  "/manifest.json",
  "/imgs/logo.png",
];

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

/* ================= FETCH ================= */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
