import { notFound } from 'next/navigation';

export default async function PropostaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { supabase } = await import('@/lib/supabase');
  
  let dbData = null;
  // Tentar buscar se o ID for válido (uuid)
  if (id && id.length > 20) {
    const { data } = await supabase
      .from('prospeccoes')
      .select('*')
      .eq('id', id)
      .single();
    dbData = data;
  }

  const clinica = {
    nome: dbData?.nome_clinica || "Sua Empresa (Prévia)",
    nicho: dbData?.nicho || "Especializada",
    cor: dbData?.cor_primaria || "blue",
    copy: dbData?.copy_vendas || "Um novo padrão de atendimento para você. Tecnologia de ponta, profissionais renomados e um ambiente preparado para o seu bem-estar.",
    foto: dbData?.foto_url || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
  };

  const colorMap: any = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-600', hover: 'hover:bg-blue-700', lightBg: 'bg-blue-50', gradient: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-600/30' },
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', lightBg: 'bg-emerald-50', gradient: 'from-emerald-600 to-teal-500', shadow: 'shadow-emerald-600/30' },
    rose: { text: 'text-rose-600', bg: 'bg-rose-600', hover: 'hover:bg-rose-700', lightBg: 'bg-rose-50', gradient: 'from-rose-600 to-pink-500', shadow: 'shadow-rose-600/30' },
    violet: { text: 'text-violet-600', bg: 'bg-violet-600', hover: 'hover:bg-violet-700', lightBg: 'bg-violet-50', gradient: 'from-violet-600 to-fuchsia-500', shadow: 'shadow-violet-600/30' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-600', hover: 'hover:bg-amber-700', lightBg: 'bg-amber-50', gradient: 'from-amber-600 to-orange-500', shadow: 'shadow-amber-600/30' },
    slate: { text: 'text-slate-800', bg: 'bg-slate-800', hover: 'hover:bg-slate-900', lightBg: 'bg-slate-100', gradient: 'from-slate-700 to-slate-500', shadow: 'shadow-slate-800/30' },
  };

  const theme = colorMap[clinica.cor] || colorMap.blue;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className={`font-bold text-2xl tracking-tighter ${theme.text}`}>
            {clinica.nome}
          </div>
          <button className={`${theme.bg} ${theme.hover} text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg ${theme.shadow} hidden sm:block`}>
            Agendar Consulta
          </button>
        </div>
      </nav>

      {/* Hero Section Premium */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 relative z-10">
          <div className={`inline-block px-4 py-1.5 rounded-full ${theme.lightBg} ${theme.text} font-semibold text-sm`}>
            Referência em {clinica.nicho}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Qualidade com <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>Excelência</span> e Confiança.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
            {clinica.copy}
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-medium text-lg transition-all">
              Conheça nossos Serviços
            </button>
          </div>
        </div>
        <div className="flex-1 relative w-full mt-10 md:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-[3rem] transform md:rotate-3 scale-105 -z-10"></div>
          <img 
            src={clinica.foto} 
            alt={clinica.nome}
            className="rounded-[3rem] object-cover h-[400px] md:h-[600px] w-full shadow-2xl"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Por que nos escolher?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { t: 'Tecnologia Avançada', d: 'Equipamentos de última geração para diagnósticos precisos.' },
              { t: 'Atendimento Humanizado', d: 'Focamos no seu conforto e bem-estar em todas as etapas.' },
              { t: 'Resultados Duradouros', d: 'Tratamentos modernos para garantir a sua satisfação a longo prazo.' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className={`w-12 h-12 ${theme.lightBg} rounded-xl mb-6`}></div>
                <h3 className="text-xl font-bold mb-3">{f.t}</h3>
                <p className="text-slate-500">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposta de Vendas (Painel Fixo na base para o dono da clínica) */}
      <div className="fixed bottom-0 w-full bg-slate-900 text-white py-4 px-6 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className={`font-semibold text-lg ${theme.text} brightness-125`}>👋 Olá, equipe {clinica.nome}!</p>
            <p className="text-slate-300 text-sm mt-1">
              Gostou dessa prévia exclusiva? Podemos colocar este site no ar com sua logo, fotos e WhatsApp por <strong>R$ 300,00</strong>.
            </p>
          </div>
          <a 
            href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá, sou da equipe ${clinica.nome}. Gostei do site de amostra! Quero fechar por 300`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all whitespace-nowrap shadow-lg shadow-green-500/20 text-center w-full sm:w-auto"
          >
            Quero esse site (R$ 300)
          </a>
        </div>
      </div>
    </div>
  );
}
