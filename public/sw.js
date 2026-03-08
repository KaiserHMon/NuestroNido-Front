self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/nuestro-nido-logo.png', // Fallback to logo
      badge: '/nuestro-nido-favicon.png', // Fallback to favicon
      data: {
        url: data.data?.url || 'https://nuestronido.vercel.app/'
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
