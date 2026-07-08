'use client';

import { useEffect } from 'react';

export default function CheckoutInterceptor() {

  useEffect(() => {
    const plan = localStorage.getItem('pendingCheckoutPlan');
    if (plan) {
      localStorage.removeItem('pendingCheckoutPlan');
      // Redireciona via hard-navigation
      window.location.href = `/redirect-checkout?plan=${plan}`;
    }
  }, []);

  return null;
}
