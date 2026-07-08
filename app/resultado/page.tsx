'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PreviewAtividade from '@/components/PreviewAtividade';
import { AtividadeGerada } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ResultadoPage() {
  const router = useRouter();
  const [atividade, setAtividade] = useState<AtividadeGerada | null>(null);
  const [modo, setModo] = useState('livre');

  useEffect(() => {
    const stored = sessionStorage.getItem('atividade-resultado');
    const storedModo = sessionStorage.getItem('atividade-modo');

    if (!stored) {
      router.push('/');
      return;
    }

    try {
      setAtividade(JSON.parse(stored));
      setModo(storedModo || 'livre');
    } catch {
      router.push('/');
    }
  }, [router]);

  if (!atividade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return <PreviewAtividade atividade={atividade} modo={modo} />;
}
