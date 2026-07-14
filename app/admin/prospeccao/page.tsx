"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, QrCode, Play, CheckCircle2, XCircle } from "lucide-react";

export default function ProspeccaoDashboard() {
  const [nicho, setNicho] = useState("Clinica Odontologica");
  const [cidade, setCidade] = useState("");
  const [quantidade, setQuantidade] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState("disconnected");

  const [resultados, setResultados] = useState<any[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/whatsapp/status');
        const data = await res.json();
        setWhatsappStatus(data.status);
        if (data.qr) {
          setQrCode(data.qr);
        }
      } catch (err) {
        console.error("Erro ao buscar status do whatsapp", err);
      }
    };

    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 3000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Polling para atualizar o status das clínicas que estão processando em segundo plano
  useEffect(() => {
    const hasProcessando = resultados.some(r => r.status && r.status.includes('processando'));
    let interval: any;

    if (hasProcessando) {
      interval = setInterval(async () => {
        try {
          const nomes = resultados.map(r => r.nome);
          const res = await fetch('/api/prospect/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomes })
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setResultados(prev => prev.map(item => {
                const dbItem = data.find((d: any) => d.nome_clinica === item.nome);
                if (dbItem) {
                  return { ...item, status: dbItem.mensagem_erro ? `Erro: ${dbItem.mensagem_erro}` : dbItem.status_envio };
                }
                return item;
              }));
            }
          }
        } catch (e) {
          console.error("Erro no polling de status", e);
        }
      }, 5000); // Atualiza a cada 5 segundos
    }
    return () => clearInterval(interval);
  }, [resultados]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidade) return alert("Preencha a cidade");
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/prospect/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicho, cidade, quantidade })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Erro ao buscar");
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      setResultados(data.results || []);
      
    } catch (err) {
      console.error(err);
      alert("Erro na requisição");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatch = async () => {
    if (resultados.length === 0) return;
    if (whatsappStatus !== 'ready') {
      const confirmar = confirm("O WhatsApp não parece estar pronto. Deseja tentar enviar os e-mails mesmo assim?");
      if (!confirmar) return;
    }

    setIsDispatching(true);
    try {
      const res = await fetch('/api/prospect/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicas: resultados, nicho, cidade })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no disparo");

      // Atualiza visualmente para o usuário saber que começou
      setResultados(prev => prev.map(item => ({ ...item, status: 'processando (veja logs)' })));
      alert("Automação iniciada em 2º plano! Você já pode ir fazer outra coisa ou buscar mais clínicas.");
    } catch (err: any) {
      console.error(err);
      alert("Erro no disparo: " + err.message);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-bold">Máquina de Prospecção</h1>
          <p className="text-neutral-400 mt-1">Busque clínicas, analise sites e envie amostras no piloto automático.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda: Controles */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status WhatsApp */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5" />
                WhatsApp Conexão
              </h2>
              
              {(whatsappStatus === "disconnected" || whatsappStatus === "qr") && (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  {qrCode ? (
                    <div className="p-4 bg-white rounded-lg">
                      <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-neutral-800 animate-pulse rounded-lg flex items-center justify-center">
                      <span className="text-neutral-500 text-sm text-center">Aguardando QR Code...<br/>(Inicie o Backend)</span>
                    </div>
                  )}
                  <p className="text-sm text-neutral-400 text-center">Escaneie com seu WhatsApp para conectar a automação.</p>
                </div>
              )}

              {whatsappStatus === "error" && (
                <div className="flex flex-col items-center justify-center py-6 text-red-500">
                  <XCircle className="w-12 h-12 mb-2" />
                  <span className="font-medium text-center">Erro no WhatsApp.<br/>Reinicie o servidor.</span>
                </div>
              )}

              {(whatsappStatus === "ready" || whatsappStatus === "authenticated") && (
                <div className="flex flex-col items-center justify-center py-6 text-green-500">
                  <CheckCircle2 className="w-12 h-12 mb-2" />
                  <span className="font-medium">Conectado e Pronto!</span>
                </div>
              )}
            </div>

            {/* Formulário */}
            <form onSubmit={handleStart} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Nicho</label>
                <input 
                  type="text" 
                  value={nicho}
                  onChange={e => setNicho(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ex: Clínica Odontológica"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Cidade e Estado</label>
                <input 
                  type="text" 
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ex: São Paulo, SP"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Quantidade Máxima</label>
                <input 
                  type="number" 
                  value={quantidade}
                  onChange={e => setQuantidade(parseInt(e.target.value))}
                  min={1}
                  max={50}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-neutral-500 mt-1">Sugerido max 20 por vez para não bloquear o WhatsApp.</p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                {isLoading ? "Buscando..." : "Iniciar Prospecção"}
              </button>
            </form>

          </div>

          {/* Coluna Direita: Resultados */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Resultados em Tempo Real
                </h2>
                {resultados.length > 0 && (
                  <button 
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
                  >
                    {isDispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Disparar Automação
                  </button>
                )}
              </div>

              {resultados.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-neutral-500">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p>Preencha os dados e inicie a prospecção.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resultados.map((item, idx) => (
                    <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{item.nome}</h3>
                        <p className="text-sm text-neutral-400">{item.site || "Sem site"} • {item.fone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
