import FormularioImagem from '@/components/FormularioImagem';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estúdio de Arte IA | Caderno Vivo',
  description: 'Gere desenhos para colorir e ilustrações com Inteligência Artificial.',
};

export default function CriarImagensPage() {
  return (
    <FormularioImagem />
  );
}
