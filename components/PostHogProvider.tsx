"use client";

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (key && host && typeof window !== 'undefined') {
      posthog.init(key, {
        api_host: host,
        person_profiles: 'identified_only', // Capture profiles só quando identificar usuários
        capture_pageview: false, // Vamos usar a própria captura automática de rota do Next.js se quiser
      });
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <Provider client={posthog}>{children}</Provider>;
}
