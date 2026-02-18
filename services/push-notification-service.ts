import { fetchClient } from '@/lib/api-client';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/**
 * Utility to convert the base64 VAPID public key to a Uint8Array
 * as required by the PushManager.
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Request permission for push notifications and subscribe the user.
 * Sends the subscription details to the backend.
 */
export async function subscribeToPushNotifications() {
  try {
    // 1. Verify browser support
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported by this browser.');
      return;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined.');
      return;
    }

    // 2. Register Service Worker if it's not already registered
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration.scope);

    // 3. Request permission from the user
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permission for notifications was denied.');
      return;
    }

    // 4. Get the subscription from the browser's push manager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // 5. Send the subscription to the Backend (using your API client)
    const subJSON = subscription.toJSON();
    
    await fetchClient('/api/v1/push/subscribe', {
      method: 'POST',
      body: {
        endpoint: subJSON.endpoint,
        p256dh: subJSON.keys?.p256dh,
        auth: subJSON.keys?.auth
      },
      requiresAuth: true // Assuming the user must be authenticated to subscribe
    });

    console.log('Push subscription completed successfully');
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
  }
}
