-- ========================================
-- CORREÇÃO DEFINITIVA DA TABELA HOLERITES
-- ========================================
-- Este script corrige os campos baseado na estrutura REAL da tabela

-- 1. Verificar estrutura atual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
ORDER BY ordinal_position;

-- 2. Remover campos calculados problemáticos (se existirem)
ALTER TABLE holerites 
DROP COLUMN IF EXISTS total_proventos CASCADE;

ALTER TABLE holerites 
DROP COLUMN IF EXISTS total_descontos CASCADE;

ALTER TABLE holerites 
DROP COLUMN IF EXISTS salario_liquido CASCADE;

-- 3. Adicionar campos que podem estar faltando (baseado na estrutura real)
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS ajuda_custo DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS emprestimo_consignado DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS seguro_vida_desconto DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS plano_odonto_desconto DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS pensao_alimenticia DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS beneficios JSONB DEFAULT '[]';

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS descontos_personalizados JSONB DEFAULT '[]';

-- 4. Recriar campos calculados como campos normais (não GENERATED)
ALTER TABLE holerites 
ADD COLUMN total_proventos DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN total_descontos DECIMAL(10,2) DEFAULT 0;

ALTER TABLE holerites 
ADD COLUMN salario_liquido DECIMAL(10,2) DEFAULT 0;

-- 5. Criar função para calcular valores (trigger)
CREATE OR REPLACE FUNCTION calcular_valores_holerite()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular total de proventos (baseado nos campos que REALMENTE existem)
    NEW.total_proventos := COALESCE(NEW.salario_base, 0) + 
                          COALESCE(NEW.horas_extras, 0) + 
                          COALESCE(NEW.adicional_noturno, 0) + 
                          COALESCE(NEW.adicional_periculosidade, 0) + 
                          COALESCE(NEW.adicional_insalubridade, 0) + 
                          COALESCE(NEW.comissoes, 0) + 
                          COALESCE(NEW.bonus, 0) + 
                          COALESCE(NEW.ajuda_custo, 0);

    -- Calcular total de descontos (baseado nos campos que REALMENTE existem)
    NEW.total_descontos := COALESCE(NEW.inss, 0) + 
                          COALESCE(NEW.irrf, 0) + 
                          COALESCE(NEW.vale_transporte, 0) + 
                          COALESCE(NEW.cesta_basica_desconto, 0) + 
                          COALESCE(NEW.plano_saude, 0) + 
                          COALESCE(NEW.plano_odontologico, 0) + 
                          COALESCE(NEW.seguro_vida_desconto, 0) + 
                          COALESCE(NEW.plano_odonto_desconto, 0) + 
                          COALESCE(NEW.pensao_alimenticia, 0) + 
                          COALESCE(NEW.emprestimo_consignado, 0) + 
                          COALESCE(NEW.adiantamento, 0) + 
                          COALESCE(NEW.faltas, 0) + 
                          COALESCE(NEW.outros_descontos, 0);

    -- Calcular salário líquido
    NEW.salario_liquido := NEW.total_proventos - NEW.total_descontos;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar trigger para executar a função
DROP TRIGGER IF EXISTS trigger_calcular_valores_holerite ON holerites;

CREATE TRIGGER trigger_calcular_valores_holerite
    BEFORE INSERT OR UPDATE ON holerites
    FOR EACH ROW
    EXECUTE FUNCTION calcular_valores_holerite();

-- 7. Atualizar holerites existentes (se houver)
UPDATE holerites 
SET updated_at = NOW()
WHERE id IS NOT NULL;

-- 8. Verificar se tudo está funcionando
SELECT 
    'Correção aplicada com sucesso!' as status,
    COUNT(*) as total_holerites
FROM holerites;

-- 9. Mostrar estrutura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name IN ('total_proventos', 'total_descontos', 'salario_liquido', 'beneficios', 'descontos_personalizados')
ORDER BY column_name;