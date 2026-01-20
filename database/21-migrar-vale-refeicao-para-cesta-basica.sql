-- ========================================
-- MIGRAR VALE REFEIÇÃO PARA CESTA BÁSICA
-- ========================================
-- Este script altera a coluna vale_refeicao_desconto para cesta_basica_desconto

-- 1. Renomear coluna na tabela holerites
ALTER TABLE holerites 
RENAME COLUMN vale_refeicao_desconto TO cesta_basica_desconto;

-- 2. Atualizar comentário da coluna
COMMENT ON COLUMN holerites.cesta_basica_desconto IS 'Desconto da cesta básica do funcionário';

-- 3. Recriar campos calculados com o novo nome da coluna
-- Remover colunas calculadas existentes
ALTER TABLE holerites DROP COLUMN IF EXISTS total_descontos;
ALTER TABLE holerites DROP COLUMN IF EXISTS salario_liquido;

-- Recriar total_descontos com cesta_basica_desconto
ALTER TABLE holerites 
ADD COLUMN total_descontos DECIMAL(10,2) 
GENERATED ALWAYS AS (
  COALESCE(inss, 0) + 
  COALESCE(irrf, 0) + 
  COALESCE(vale_transporte, 0) + 
  COALESCE(cesta_basica_desconto, 0) + 
  COALESCE(plano_saude, 0) + 
  COALESCE(plano_odontologico, 0) + 
  COALESCE(adiantamento, 0) + 
  COALESCE(faltas, 0) + 
  COALESCE(outros_descontos, 0)
) STORED;

-- Recriar salario_liquido com cesta_basica_desconto
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
  COALESCE(cesta_basica_desconto, 0) - 
  COALESCE(plano_saude, 0) - 
  COALESCE(plano_odontologico, 0) - 
  COALESCE(adiantamento, 0) - 
  COALESCE(faltas, 0) - 
  COALESCE(outros_descontos, 0)
) STORED;

-- 4. Atualizar dados existentes nos benefícios JSONB (funcionários)
UPDATE funcionarios 
SET beneficios = jsonb_set(
    beneficios - 'vale_refeicao',
    '{cesta_basica}',
    beneficios->'vale_refeicao'
)
WHERE beneficios ? 'vale_refeicao';

-- 5. Atualizar dados existentes nos benefícios JSONB (holerites)
UPDATE holerites 
SET beneficios = jsonb_set(
    beneficios - 'vale_refeicao',
    '{cesta_basica}',
    beneficios->'vale_refeicao'
)
WHERE beneficios ? 'vale_refeicao';

-- 6. Verificar resultado da migração
DO $$
DECLARE
    funcionarios_count INTEGER;
    holerites_count INTEGER;
BEGIN
    -- Contar funcionários com cesta_basica
    SELECT COUNT(*) INTO funcionarios_count
    FROM funcionarios 
    WHERE beneficios ? 'cesta_basica';
    
    -- Contar holerites com cesta_basica
    SELECT COUNT(*) INTO holerites_count
    FROM holerites 
    WHERE beneficios ? 'cesta_basica';
    
    RAISE NOTICE '📊 Resultado da migração:';
    RAISE NOTICE '   - Funcionários com cesta_basica: %', funcionarios_count;
    RAISE NOTICE '   - Holerites com cesta_basica: %', holerites_count;
    RAISE NOTICE '✅ Migração Vale Refeição → Cesta Básica concluída!';
END $$;