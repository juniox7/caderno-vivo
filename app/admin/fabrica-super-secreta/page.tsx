'use client';

import { useState } from 'react';
import { generateMaze } from '@/lib/maze';
import { generateWordSearch } from '@/lib/wordSearch';
import { EbookData, EbookPageData } from '@/lib/ebook-pdf-generator';
import dynamic from 'next/dynamic';
import { Sparkles, Download, Settings, Loader2 } from 'lucide-react';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);
import { EbookPDF } from '@/lib/ebook-pdf-generator';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function FabricaDeEbooks() {
  const [tema, setTema] = useState('');
  const [idade, setIdade] = useState('6');
  const [quantidade, setQuantidade] = useState(5);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [ebookData, setEbookData] = useState<EbookData | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema) return;

    setIsGenerating(true);
    setProgress(0);
    setEbookData(null);
    const paginas: EbookPageData[] = [];

    try {
      // 1. Gerar Capa
      setStatusText('Gerando Capa Mágica (Fal.ai)...');
      let capaUrl = '';
      try {
        const capaRes = await fetch('/api/generate-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: tema, style: 'capa' })
        });
        const capaData = await capaRes.json();
        if (capaData.url) capaUrl = capaData.url;
      } catch (e) {
        console.error('Erro na capa', e);
      }
      
      paginas.push({
        tipo: 'capa',
        titulo: `Apostila: ${tema}`,
        subtitulo: `Atividades Divertidas - ${idade} Anos`,
        imagemUrl: capaUrl
      });
      setProgress(10);

      // Loop de Páginas
      const pagesToGenerate = quantidade;
      const progStep = 90 / pagesToGenerate;

      for (let i = 0; i < pagesToGenerate; i++) {
        // Pausa de 5 segundos para evitar Rate Limit da Vercel/Gemini
        setStatusText(`Aguardando 5s para não sobrecarregar... (Página ${i+1}/${pagesToGenerate})`);
        await sleep(5000);

        // Decide o tipo de página rotativamente: 0=Atividade, 1=Labirinto, 2=CacaPalavras, 3=Colorir
        const tipo = i % 4;

        if (tipo === 0) {
          setStatusText(`Gerando Histórias e Questões pelo Gemini... (Página ${i+1}/${pagesToGenerate})`);
          try {
            const actRes = await fetch('/api/generate-story', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                idade: parseInt(idade),
                interesse1: tema,
                interesse2: 'desafios',
                focosSelecionados: [
                  { id: 'portugues', label: 'Português', qtd: 2 },
                  { id: 'matematica', label: 'Matemática', qtd: 2 }
                ],
                formatoResposta: 'multipla_escolha',
                promptLivre: `Esta é a parte ${i+1} de um livro sobre ${tema}. Seja bem criativo.`
              })
            });
            const actData = await actRes.json();
            if (actData.atividade) {
              paginas.push({ tipo: 'atividade', conteudo: actData.atividade });
            }
          } catch(e) {
             console.error('Erro atividade', e);
          }
        } 
        else if (tipo === 1) {
          setStatusText(`Gerando Labirinto Desafiador... (Página ${i+1}/${pagesToGenerate})`);
          const grid = generateMaze(15, 20); // 15 colunas, 20 linhas
          paginas.push({
            tipo: 'labirinto',
            titulo: 'Labirinto do ' + tema,
            enunciado: 'Encontre o caminho até a saída!',
            grid
          });
        }
        else if (tipo === 2) {
          setStatusText(`Gerando Caça-Palavras... (Página ${i+1}/${pagesToGenerate})`);
          const palavrasTema = [tema.substring(0,8).toUpperCase(), 'BRINCAR', 'APRENDER', 'ESCOLA', 'LIVRO', 'AMIGO'];
          const res = generateWordSearch(palavrasTema, 12);
          paginas.push({
            tipo: 'caca_palavras',
            titulo: 'Caça-Palavras',
            enunciado: 'Encontre as palavras escondidas abaixo:',
            grid: res.grid,
            palavras: palavrasTema
          });
        }
        else if (tipo === 3) {
          setStatusText(`Gerando Página de Colorir (Fal.ai)... (Página ${i+1}/${pagesToGenerate})`);
          let colorirUrl = '';
          try {
            const colRes = await fetch('/api/generate-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: tema, style: 'colorir' })
            });
            const colData = await colRes.json();
            if (colData.url) colorirUrl = colData.url;
          } catch(e) {}

          if (colorirUrl) {
            paginas.push({
              tipo: 'colorir',
              titulo: 'Hora de Colorir!',
              enunciado: 'Pinte o desenho bem bonito.',
              imagemUrl: colorirUrl
            });
          }
        }

        setProgress(10 + ((i + 1) * progStep));
      }

      setStatusText('Apostila Finalizada! Montando PDF...');
      setEbookData({ paginas });

    } catch (error) {
      console.error(error);
      setStatusText('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
          <div className="flex items-center gap-4 mb-6 border-b pb-4 border-slate-100">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Fábrica de Ebooks</h1>
              <p className="text-slate-500">Gerador em Lote (Low Ticket Tripwire)</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Tema do Ebook</label>
                <input 
                  type="text" 
                  value={tema}
                  onChange={e => setTema(e.target.value)}
                  placeholder="Ex: Dinossauros Espaciais"
                  className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                  disabled={isGenerating}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Idade Alvo</label>
                <select 
                  value={idade}
                  onChange={e => setIdade(e.target.value)}
                  className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none"
                  disabled={isGenerating}
                >
                  <option value="4">4 Anos</option>
                  <option value="6">6 Anos</option>
                  <option value="8">8 Anos</option>
                  <option value="10">10 Anos</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Quantidade de Páginas (Recomendado 5 para testes)</label>
              <input 
                type="number" 
                min="1" max="50"
                value={quantidade}
                onChange={e => setQuantidade(parseInt(e.target.value))}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none"
                required
                disabled={isGenerating}
              />
            </div>

            <button 
              type="submit" 
              disabled={isGenerating}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</>
              ) : (
                <><Settings className="w-5 h-5" /> Iniciar Fábrica (Pode levar minutos)</>
              )}
            </button>
          </form>

          {isGenerating && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <p className="text-center text-sm text-slate-500 mt-4 animate-pulse">
                {statusText}
              </p>
            </div>
          )}

          {ebookData && !isGenerating && (
            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 text-center">
              <h3 className="text-lg font-bold text-green-800 mb-4">✨ Ebook Gerado com Sucesso! ✨</h3>
              
              <PDFDownloadLink
                document={<EbookPDF ebook={ebookData} />}
                fileName={`Ebook_${tema.replace(/\\s+/g, '_')}.pdf`}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all"
              >
                {({ loading }) => (
                  loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Renderizando PDF...</>
                  ) : (
                    <><Download className="w-5 h-5" /> Baixar Ebook em PDF</>
                  )
                )}
              </PDFDownloadLink>
              
              <p className="text-green-700 text-sm mt-4">
                São {ebookData.paginas.length} páginas incríveis prontas para vender.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
