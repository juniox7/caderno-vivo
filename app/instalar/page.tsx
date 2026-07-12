'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Download, Share, PlusSquare, MoreVertical, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function InstalarTutorial() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs('ios');
    } else if (/android/.test(userAgent)) {
      setOs('android');
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a] dark:text-surface-100 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-primary-200">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-surface-800" style={{ fontFamily: 'var(--font-baloo)' }}>
              Instale o CadernoVivo
            </h1>
            <p className="text-surface-500">
              Tenha o aplicativo direto na tela inicial do seu celular para criar atividades muito mais rápido, sem precisar abrir o navegador!
            </p>
          </div>

          {isInstalled ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="font-bold text-emerald-800 text-lg">App já instalado!</h3>
              <p className="text-emerald-600 text-sm">
                Você já tem o CadernoVivo instalado no seu dispositivo. Procure o ícone dele na sua tela inicial!
              </p>
              <Link href="/" className="inline-block mt-2 px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                Voltar para o Início
              </Link>
            </div>
          ) : isInstallable ? (
            <div className="bg-white dark:bg-surface-100 border border-surface-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
              <h3 className="font-bold text-surface-800 text-xl">Instalação Automática Disponível!</h3>
              <p className="text-surface-500 text-sm">
                Seu navegador suporta a instalação rápida com um clique.
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-200 flex items-center justify-center gap-2 transition-all active:scale-95 text-lg"
              >
                <Download className="w-6 h-6" />
                Instalar Aplicativo Agora
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-surface-100 border border-surface-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-surface-800 text-lg mb-6 flex items-center gap-2 border-b border-surface-100 pb-4">
                  <span className="text-2xl">🤖</span> Passo a Passo para Android (Chrome)
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 shrink-0">1</div>
                    <div>
                      <p className="text-surface-700 font-medium">Toque no menu de três pontinhos <MoreVertical className="w-5 h-5 inline text-surface-500" /> no canto superior direito do Chrome.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 shrink-0">2</div>
                    <div>
                      <p className="text-surface-700 font-medium">Procure pela opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong> e toque nela.</p>
                      <div className="mt-2 bg-surface-50 rounded-lg p-3 border border-surface-100 flex items-center gap-3">
                        <Download className="w-5 h-5 text-surface-400" />
                        <span className="text-surface-600">Instalar aplicativo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 shrink-0">3</div>
                    <div>
                      <p className="text-surface-700 font-medium">Confirme tocando em <strong>"Instalar"</strong>. Pronto! O ícone aparecerá no seu celular.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-100 border border-surface-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-surface-800 text-lg mb-6 flex items-center gap-2 border-b border-surface-100 pb-4">
                  <span className="text-2xl">🍎</span> Passo a Passo para iPhone (Safari)
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 shrink-0">1</div>
                    <div>
                      <p className="text-surface-700 font-medium">Toque no botão de compartilhar <Share className="w-5 h-5 inline text-blue-500" /> na barra inferior do Safari.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 shrink-0">2</div>
                    <div>
                      <p className="text-surface-700 font-medium">Role o menu para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</p>
                      <div className="mt-2 bg-surface-50 rounded-lg p-3 border border-surface-100 flex items-center justify-between">
                        <span className="text-surface-600">Adicionar à Tela de Início</span>
                        <PlusSquare className="w-5 h-5 text-surface-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 shrink-0">3</div>
                    <div>
                      <p className="text-surface-700 font-medium">Confirme tocando em <strong>"Adicionar"</strong> no canto superior direito. Pronto!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
