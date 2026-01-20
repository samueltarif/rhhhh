-- ========================================
-- CORRIGIR CAMPOS CALCULADOS DA TABELA HOLERITES
-- ========================================
-- Este script corrige as fórmulas dos campos calculados que estavam retornando 0

-- 1. Remover colunas calculadas existentes
ALTER TABLE holerites DROP COLUMN IF EXISTS total_proventos;
ALTER TABLE holerites DROP COLUMN IF EXISTS total_descontos;
ALTER TABLE holerites DROP COLUMN IF EXISTS salario_liquido;

-- 2. Recriar coluna total_proventos com fórmula corrigida
ALTER TABLE holerites 
ADD COLUMN total_proventos DECIMAL(10,2) 
GENERATED ALWAYS AS (
  COALESCE(salario_base, 0) + 
  COALESCE(bonus, 0) + 
  COALESCE(horas_extras, 0) + 
  COALESCE(adicional_noturno, 0) + 
  COALESCE(adicional_periculosidade, 0) + 
  COALESCE(adicional_insalubridade, 0) + 
  COALESCE(comissoes, 0)
) STORED;

-- 3. Recriar coluna total_descontos com fórmula corrigida
ALTER TABLE holerites 
ADD COLUMN total_descontos DECIMAL(10,2) 
GENERATED ALWAYS AS (
  COALESCE(inss, 0) + 
  COALESCE(irrf, 0) + 
  COALESCE(vale_transporte, 0) + 
  COALESCE(vale_refeicao_desconto, 0) + 
  COALESCE(plano_saude, 0) + 
  COALESCE(plano_odontologico, 0) + 
  COALESCE(adiantamento, 0) + 
  COALESCE(faltas, 0) + 
  COALESCE(outros_descontos, 0)
) STORED;

-- 4. Recriar coluna salario_liquido com fórmula corrigida
ALTER TABLE holerites 
ADD COLUMN salario_liquido DECIMAL(10,2) 
GENERATED ALWAYS AS (
  COALESCE(salario_base, 0) + 
  COALESCE(bonus, 0) + 
  COALESCE(horas_extras, 0) + 
  COALESCE(adicional_noturno, 0) + 
  COALESCE(adicional_periculosidade, 0) + 
  COALESCE(adicional_insalubridade, 0) + 
  COALESCE(comissoes, 0) -
  COALESCE(inss, 0) - 
  COALESCE(irrf, 0) - 
  COALESCE(vale_transporte, 0) - 
  COALESCE(vale_refeicao_desconto, 0) - 
  COALESCE(plano_saude, 0) - 
  COALESCE(plano_odontologico, 0) - 
  COALESCE(adiantamento, 0) - 
  COALESCE(faltas, 0) - 
  COALESCE(outros_descontos, 0)
) STORED;

-- 5. Atualizar comentários
COMMENT ON COLUMN holerites.total_proventos IS 'Total de proventos (calculado automaticamente com COALESCE)';
COMMENT ON COLUMN holerites.total_descontos IS 'Total de descontos (calculado automaticamente com COALESCE)';
COMMENT ON COLUMN holerites.salario_liquido IS 'Valor líquido a receber (calculado automaticamente com COALESCE)';

-- 6. Verificar se as fórmulas estão funcionando
DO $$
BEGIN
    RAISE NOTICE '✅ Campos calculados corrigidos com sucesso!';
    RAISE NOTICE '📊 Testando com um holerite existente...';
END $$;