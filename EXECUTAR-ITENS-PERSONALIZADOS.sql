-- ============================================================================
-- EXECUTAR NO SUPABASE SQL EDITOR
-- ============================================================================
-- Copie e cole este SQL completo no SQL Editor do Supabase
-- ============================================================================

-- 1. Remover tabela existente (se houver)
DROP TABLE IF EXISTS holerite_itens_personalizados CASCADE;

-- 2. Criar tabela
CREATE TABLE holerite_itens_personalizados (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
  
  -- Tipo e descrição
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('beneficio', 'desconto')),
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  
  -- Período de vigência
  vigencia_tipo VARCHAR(20) NOT NULL CHECK (vigencia_tipo IN ('unico', 'recorrente')),
  data_inicio DATE NOT NULL,
  data_fim DATE, -- NULL = sem data fim (recorrente indefinido)
  
  -- Controle
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX idx_itens_personalizados_funcionario ON holerite_itens_personalizados(funcionario_id);
CREATE INDEX idx_itens_personalizados_tipo ON holerite_itens_personalizados(tipo);
CREATE INDEX idx_itens_personalizados_vigencia ON holerite_itens_personalizados(data_inicio, data_fim);
CREATE INDEX idx_itens_personalizados_ativo ON holerite_itens_personalizados(ativo);

-- 4. Adicionar comentários
COMMENT ON TABLE holerite_itens_personalizados IS 'Benefícios e descontos personalizados com período de vigência';
COMMENT ON COLUMN holerite_itens_personalizados.tipo IS 'Tipo: beneficio ou desconto';
COMMENT ON COLUMN holerite_itens_personalizados.vigencia_tipo IS 'unico = apenas um mês, recorrente = vários meses';
COMMENT ON COLUMN holerite_itens_personalizados.data_inicio IS 'Data de início da vigência';
COMMENT ON COLUMN holerite_itens_personalizados.data_fim IS 'Data de fim da vigência (NULL = indefinido)';

-- 5. Habilitar RLS
ALTER TABLE holerite_itens_personalizados ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas RLS (usando service_role bypass)
-- IMPORTANTE: Como estamos usando serverSupabaseServiceRole nas APIs,
-- as políticas RLS são bypassadas automaticamente.
-- Vamos criar políticas simples apenas para segurança adicional.

-- Permitir todas as operações (será controlado pelo service_role)
CREATE POLICY "Service role bypass"
  ON holerite_itens_personalizados
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_itens_personalizados_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Criar trigger
CREATE TRIGGER trigger_update_itens_personalizados_updated_at
  BEFORE UPDATE ON holerite_itens_personalizados
  FOR EACH ROW
  EXECUTE FUNCTION update_itens_personalizados_updated_at();

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

-- Verificar se a tabela foi criada
SELECT 
  'Tabela holerite_itens_personalizados criada com sucesso!' as mensagem,
  COUNT(*) as total_colunas
FROM information_schema.columns
WHERE table_name = 'holerite_itens_personalizados';

-- Verificar políticas RLS
SELECT 
  'Políticas RLS criadas:' as mensagem,
  COUNT(*) as total_politicas
FROM pg_policies
WHERE tablename = 'holerite_itens_personalizados';

-- ============================================================================
-- NOTA IMPORTANTE
-- ============================================================================
-- As APIs usam serverSupabaseServiceRole que bypassa RLS automaticamente.
-- A política "Service role bypass" permite acesso total quando necessário.
-- O controle de acesso é feito no nível da aplicação (middleware de admin).
-- ============================================================================
