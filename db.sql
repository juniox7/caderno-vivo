-- Criação das tabelas para o CadernoVivo

-- 1. Tabela de Gamificação (Fazendinha e Moedas)
CREATE TABLE IF NOT EXISTS public.gamificacao (
  user_id text PRIMARY KEY,
  moedas integer DEFAULT 0 NOT NULL,
  sementes integer DEFAULT 0 NOT NULL,
  ultimo_checkin timestamp with time zone,
  ofensiva_atual integer DEFAULT 0 NOT NULL,
  maior_ofensiva integer DEFAULT 0 NOT NULL,
  historico_geral_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Tabela de Histórico de Atividades
CREATE TABLE IF NOT EXISTS public.historico (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  data timestamp with time zone NOT NULL,
  titulo text NOT NULL,
  subtitulo text,
  foco text,
  modo text,
  imagens_json jsonb DEFAULT '[]'::jsonb,
  is_favorite boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_historico_user_id ON public.historico(user_id);
CREATE INDEX IF NOT EXISTS idx_historico_data ON public.historico(data DESC);

-- 3. Tabela de Prospecção de Clínicas (Automação)
CREATE TABLE IF NOT EXISTS public.prospeccoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nicho text NOT NULL,
  cidade text NOT NULL,
  nome_clinica text NOT NULL,
  telefone text,
  email text,
  site_atual text,
  status_envio text DEFAULT 'pendente', -- pendente, enviado, falha
  mensagem_erro text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  -- Fase 2: Colunas Inteligentes
  foto_url text,
  cor_primaria text DEFAULT 'blue',
  copy_vendas text,
  pontos_fracos text
);

CREATE INDEX IF NOT EXISTS idx_prospeccoes_status ON public.prospeccoes(status_envio);
