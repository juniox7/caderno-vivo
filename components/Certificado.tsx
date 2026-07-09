"use client";

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
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
      const canvas = await html2canvas(certificadoRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Certificado-${nome.replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.click();
      toast.success('Certificado baixado com sucesso!');
    } catch (err) {
      toast.error('Erro ao gerar certificado');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (shareFile) {
      // Step 2: Share immediately (preserves user gesture)
      try {
        if ('share' in navigator && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
          await navigator.share({
            title: 'Meu Certificado no Caderno Vivo',
            text: `Olha só o certificado que ganhei sobre ${tema}! 🚀`,
            files: [shareFile]
          });
        } else {
          toast.error('Compartilhamento de arquivo não suportado. Baixe a imagem!');
        }
      } catch (err) {
        console.log('Compartilhamento cancelado', err);
      }
      return;
    }

    // Step 1: Generate the file
    if (!certificadoRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificadoRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsExporting(false);
          return;
        }
        const file = new File([blob], 'certificado.png', { type: 'image/png' });
        setShareFile(file);
        setIsExporting(false);
        toast.success('Pronto! Clique em compartilhar novamente.');
      });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao preparar a imagem');
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in-up mt-6">
      {/* O certificado (renderizado em DOM) */}
      <div 
        ref={certificadoRef}
        className="relative w-full max-w-lg aspect-[1.414/1] bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border-8 border-amber-200 p-8 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm"
      >
        <Award className="w-16 h-16 text-amber-500 mb-2 drop-shadow-sm" />
        
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
          <Star className="fill-amber-500 w-5 h-5" />
          <span>+{Math.max(0, sementes)} Sementes Ganhas</span>
          <Star className="fill-amber-500 w-5 h-5" />
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
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all bg-surface-100 text-surface-700 hover:bg-surface-200"
          >
            <Share2 className="w-5 h-5" />
            {isExporting ? 'Preparando...' : shareFile ? 'Compartilhar Agora!' : 'Compartilhar'}
          </button>
        )}
      </div>
    </div>
  );
}
