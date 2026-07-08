import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-surface-200 py-8 px-4 bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-surface-400 text-sm">
        <p className="flex items-center gap-1.5">
          Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> por{' '}
          <span className="font-semibold text-surface-600">CadernoVivo</span>
        </p>
        <p>© {new Date().getFullYear()} CadernoVivo. Menos tela. Mais diversão impressa.</p>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/termos" className="hover:text-surface-600 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-surface-600 transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
