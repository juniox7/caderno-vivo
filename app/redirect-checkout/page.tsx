'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

function CheckoutLogic() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!plan) {
      window.location.href = '/dashboard';
      return;
    }

    if (!isSignedIn) {
      // Memoriza a intenção de compra no navegador
      localStorage.setItem('pendingCheckoutPlan', plan);
      // Envia para o login limpo (sem parâmetros que quebram)
      window.location.href = '/sign-up';
      return;
    }

    const startCheckout = async () => {
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: plan.toUpperCase() }),
        });
        const data = await res.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error(data.error || 'Erro ao gerar checkout');
          setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
        }
      } catch (err) {
        toast.error('Erro de conexão ao checkout.');
        setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
      }
    };

    startCheckout();
  }, [plan, isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-[#0f172a] text-surface-600">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-baloo)' }}>Redirecionando para o Pagamento...</h2>
      <p className="text-sm text-surface-400 mt-2">Aguarde um momento enquanto preparamos seu link seguro.</p>
    </div>
  );
}

export default function RedirectCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-[#0f172a] text-surface-600">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-baloo)' }}>Carregando...</h2>
      </div>
    }>
      <CheckoutLogic />
    </Suspense>
  );
}
