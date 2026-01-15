-- ========================================
-- ⚠️ EXECUTE ESTE SQL NO SUPABASE SQL EDITOR
-- ========================================
-- Acesse: https://supabase.com/dashboard/project/[seu-projeto]/sql/new
-- Cole este código e clique em "Run"

-- 1. Adicionar coluna faixa_irrf na tabela holerites
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS faixa_irrf TEXT;

-- 2. Adicionar colunas de benefícios e descontos
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS beneficios JSONB DEFAULT '[]'::jsonb;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS descontos_personalizados JSONB DEFAULT '[]'::jsonb;

-- 3. Adicionar comentários explicativos
COMMENT ON COLUMN holerites.faixa_irrf IS 'Faixa de IRRF aplicada (ex: Isento CLT, 27,5%, etc.)';
COMMENT ON COLUMN holerites.beneficios IS 'Array JSON com benefícios do funcionário (vale transporte, refeição, planos, etc.)';
COMMENT ON COLUMN holerites.descontos_personalizados IS 'Array JSON com descontos personalizados do funcionário';

-- 4. Verificar se foram adicionadas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'holerites'
AND column_name IN ('faixa_irrf', 'beneficios', 'descontos_personalizados')
ORDER BY column_name;

-- ✅ Você deve ver as 3 colunas listadas
