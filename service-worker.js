

const CACHE_NAME = "kitteltasche-v3";

const DATEIEN = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// App-Dateien für die Offline-Nutzung speichern
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(DATEIEN);
    })
  );

  self.skipWaiting();
});

// Alte Cache-Versionen entfernen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((namen) => {
      return Promise.all(
        namen
          .filter((name) =>
            name.startsWith("kitteltasche-") &&
            name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Erst Netzwerk versuchen, bei Ausfall Cache nutzen
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

