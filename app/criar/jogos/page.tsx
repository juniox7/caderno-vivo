import FormularioJogos from '@/components/FormularioJogos';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JogosPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface-50 dark:bg-[#0f172a]">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Area */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-extrabold text-surface-900 mb-2" style={{ fontFamily: 'var(--font-baloo)' }}>
              Modo Jogos Rápidos 🎮
            </h1>
            <p className="text-surface-500 text-lg">
              Gere diversão em segundos! Escolha um tema e o seu jogo favorito.
            </p>
          </div>
          
          <FormularioJogos />
        </main>
      </div>
      <Footer />
    </>
  );
}
