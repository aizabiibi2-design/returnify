self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
  });
  
  self.addEventListener('fetch', (event) => {
    // Ye app ko offline load karne mein madad deta hai
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  });