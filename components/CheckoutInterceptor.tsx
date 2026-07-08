'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutInterceptor() {
  const router = useRouter();

  useEffect(() => {
    const plan = localStorage.getItem('pendingCheckoutPlan');
    if (plan) {
      localStorage.removeItem('pendingCheckoutPlan');
      // Redireciona o usuário para o checkout após o login
      router.push(`/redirect-checkout?plan=${plan}`);
    }
  }, [router]);

  return null;
}
