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
