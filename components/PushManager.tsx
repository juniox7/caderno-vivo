'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { toast } from 'sonner';

export default function PushManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsSupported(false);
      return;
    }

    setPermission(Notification.permission);

    // Register service worker if not already registered
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    }).catch(err => {
      console.error('SW Registration failed', err);
    });

    // Notify backend that user opened the app to reset consecutive ignores
    fetch('/api/push/opened', { method: 'POST' }).catch(() => {});

  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      
      if (permissionResult !== 'granted') {
         toast.error('Você precisa permitir nas configurações do navegador.');
         return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
         console.error('VAPID public key is missing');
         return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription, timezone }),
      });

      setIsSubscribed(true);
      toast.success('Notificações ativadas com sucesso!');
    } catch (e) {
      console.error('Falha ao se inscrever:', e);
      toast.error('Ocorreu um erro ao tentar ativar as notificações.');
    }
  };

  if (!isSupported) return null;

  if (isSubscribed || permission === 'granted') {
    return (
      <div className="hidden">
         {/* Silently active */}
      </div>
    );
  }

  return (
    <button
      onClick={subscribe}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors text-sm font-bold shadow-sm mb-4 mx-auto"
    >
      <BellRing className="w-4 h-4" />
      Ativar Notificações da Fazendinha
    </button>
  );
}
