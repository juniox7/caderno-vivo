'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

function CheckoutLogic() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
          setErrorMsg(data.error || 'Erro desconhecido da API');
        }
      } catch (err: any) {
        setErrorMsg('Erro de conexão ou resposta inválida: ' + err.message);
      }
    };

    startCheckout();
  }, [plan, isLoaded, isSignedIn, router]);

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 text-surface-600 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erro Crítico de Redirecionamento</h2>
        <p className="bg-red-100 text-red-800 p-4 rounded-xl border border-red-200 max-w-lg mb-6">
          {errorMsg}
        </p>
        <button onClick={() => window.location.href = '/dashboard'} className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold">
          Voltar ao Início
        </button>
      </div>
    );
  }

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
