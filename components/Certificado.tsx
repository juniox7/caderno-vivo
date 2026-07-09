"use client";

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Award, Star } from 'lucide-react';
import { toast } from 'sonner';

interface CertificadoProps {
  nome: string;
  tema: string;
  sementes: number;
}

export default function Certificado({ nome, tema, sementes }: CertificadoProps) {
  const certificadoRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [shareFile, setShareFile] = useState<File | null>(null);

  const handleDownload = async () => {
    if (!certificadoRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(certificadoRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Certificado-${nome.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Certificado baixado com sucesso!');
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao baixar certificado');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      if ('share' in navigator) {
        await navigator.share({
          title: 'Meu Certificado no Caderno Vivo',
          text: `Olha só o certificado que ganhei sobre ${tema} no Caderno Vivo! 🚀 Venha brincar também!`,
          url: window.location.origin
        });
      } else {
        toast.error('Compartilhamento não suportado neste navegador. Use o botão de baixar!');
      }
    } catch (err) {
      console.log('Compartilhamento cancelado', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in-up mt-6">
      {/* O certificado (renderizado em DOM) */}
      <div 
        ref={certificadoRef}
        className="relative w-full max-w-lg aspect-[1.414/1] bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border-8 border-amber-200 p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm"
      >
        <Award width={64} height={64} className="w-16 h-16 text-amber-500 mb-2" />
        
        <h2 className="text-3xl font-extrabold text-amber-700 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-baloo)' }}>
          Certificado de Conclusão
        </h2>
        <p className="text-sm font-semibold text-amber-600/80 mb-6 uppercase tracking-wider">Caderno Vivo</p>
        
        <p className="text-surface-600 mb-2">Certificamos com muito orgulho que</p>
        <h3 className="text-4xl font-black text-primary-600 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>
          {nome}
        </h3>
        <p className="text-surface-600 px-4">
          concluiu brilhantemente as atividades do caderno especial sobre <strong className="text-amber-600">{tema}</strong>!
        </p>

        <div className="mt-6 flex items-center gap-2 text-amber-500 font-bold bg-white/60 px-4 py-2 rounded-full shadow-inner border border-amber-100">
          <Star width={20} height={20} className="fill-amber-500 w-5 h-5" />
          <span>+{Math.max(0, sementes)} Sementes Ganhas</span>
          <Star width={20} height={20} className="fill-amber-500 w-5 h-5" />
        </div>
        
        <div className="absolute bottom-4 left-6 text-xs font-bold text-amber-800/40">
          Data: {new Date().toLocaleDateString('pt-BR')}
        </div>
        <div className="absolute bottom-4 right-6 text-xs font-bold text-amber-800/40 text-right">
          Assinatura<br/>
          <span className="font-serif italic text-sm">A.I. Caderno Vivo</span>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 w-full max-w-lg">
        <button 
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 py-3 rounded-xl bg-amber-100 text-amber-700 font-bold hover:bg-amber-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Baixar Certificado
        </button>
        
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all bg-surface-100 text-surface-700 hover:bg-surface-200"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </button>
        )}
      </div>
    </div>
  );
}
