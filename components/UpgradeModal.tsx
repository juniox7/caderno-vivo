import { useState } from 'react';
import { X, Sparkles, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlanTier = 'BASIC' | 'PREMIUM' | 'TURBO';

const PLANS = [
  {
    tier: 'BASIC' as PlanTier,
    nome: 'Plano Basic',
    descricao: 'Ideal para o dia a dia',
    icon: Star,
    features: ['30 Atividades/mês', 'Imagens c/ IA', 'Acesso à Loja'],
    buttonText: 'Assinar Basic',
    styles: {
      card: 'border-surface-200 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100',
      cardHover: 'hover:border-indigo-400',
      iconColor: 'text-indigo-600',
      button: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    },
  },
  {
    tier: 'PREMIUM' as PlanTier,
    nome: 'Plano Premium',
    descricao: 'Para criadores frenéticos',
    icon: Sparkles,
    features: ['100 Atividades/mês', 'Sem Limites de Imagem', 'Suporte Prioritário'],
    buttonText: 'Assinar Premium',
    badge: 'MAIS POPULAR',
    styles: {
      card: 'border-amber-300 bg-amber-50 shadow-md',
      cardHover: 'hover:border-amber-400',
      iconColor: 'text-amber-600',
      button: 'bg-amber-400 text-amber-900 hover:bg-amber-300 shadow-sm',
      badge: 'bg-amber-400 text-amber-900',
    },
  },
  {
    tier: 'TURBO' as PlanTier,
    nome: 'Plano Turbo',
    descricao: 'Uso ilimitado e sem limites',
    icon: Zap,
    features: ['Atividades Ilimitadas', 'Tudo do Premium', 'Acesso Antecipado'],
    buttonText: 'Assinar Turbo',
    badge: 'ILIMITADO',
    styles: {
      card: 'border-violet-400 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-lg',
      cardHover: 'hover:border-violet-500',
      iconColor: 'text-violet-600',
      button: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-md',
      badge: 'bg-violet-500 text-white',
    },
  },
];

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (plan: PlanTier) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        toast.error(data.error);
        setLoadingPlan(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Erro ao iniciar o checkout. Tente novamente.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/40 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-white dark:bg-surface-100 dark:text-surface-800 rounded-3xl p-6 shadow-2xl max-w-3xl w-full relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-surface-400 hover:bg-surface-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
            🌱
          </div>
          <h2 className="text-2xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
            Limite Atingido!
          </h2>
          <p className="text-surface-500 mt-2 text-sm leading-relaxed">
            Você atingiu o limite de gerações do seu plano atual. Faça o upgrade para continuar criando atividades fantásticas!
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.tier}
                className={`border-2 rounded-2xl p-5 ${plan.styles.cardHover} transition-colors flex flex-col justify-between relative overflow-hidden ${plan.styles.card}`}
              >
                {plan.badge && (
                  <div className={`absolute top-0 right-0 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg ${plan.styles.badge}`}>
                    {plan.badge}
                  </div>
                )}
                <div>
                  <h3 className={`font-bold flex items-center gap-1.5 ${plan.styles.iconColor}`}>
                    <Icon className="w-4 h-4" /> {plan.nome}
                  </h3>
                  <p className="text-xs text-surface-500 mt-1 mb-4">{plan.descricao}</p>
                  <ul className="text-sm space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleCheckout(plan.tier)}
                  disabled={loadingPlan !== null}
                  className={`w-full py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 ${plan.styles.button}`}
                >
                  {loadingPlan === plan.tier ? 'Processando...' : plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
