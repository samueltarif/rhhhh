-- ========================================
-- CORREÇÕES FINAIS SIMPLES - SEM SUBQUERIES
-- ========================================
-- Este script aplica as correções sem usar subqueries em GENERATED COLUMNS

-- 1. REMOVER COLUNAS CALCULADAS EXISTENTES
ALTER TABLE holerites DROP COLUMN IF EXISTS total_proventos;
ALTER TABLE holerites DROP COLUMN IF EXISTS total_descontos;
ALTER TABLE holerites DROP COLUMN IF EXISTS salario_liquido;

-- 2. VERIFICAR SE PRECISA MIGRAR COLUNA
DO $$
BEGIN
    -- Se vale_refeicao_desconto existe, renomear para cesta_basica_desconto
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'vale_refeicao_desconto'
    ) THEN
        ALTER TABLE holerites 
        RENAME COLUMN vale_refeicao_desconto TO cesta_basica_desconto;
        
        COMMENT ON COLUMN holerites.cesta_basica_desconto IS 'Desconto da cesta básica do funcionário';
        
        RAISE NOTICE '✅ Coluna renomeada: vale_refeicao_desconto → cesta_basica_desconto';
    ELSE
        RAISE NOTICE 'ℹ️ Coluna cesta_basica_desconto já existe ou vale_refeicao_desconto não existe';
    END IF;
END $$;

-- 3. RECRIAR COLUNAS CALCULADAS COM CESTA_BASICA_DESCONTO
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

-- 4. ATUALIZAR COMENTÁRIOS
COMMENT ON COLUMN holerites.total_proventos IS 'Total de proventos (calculado automaticamente)';
COMMENT ON COLUMN holerites.total_descontos IS 'Total de descontos (calculado automaticamente)';
COMMENT ON COLUMN holerites.salario_liquido IS 'Valor líquido a receber (calculado automaticamente)';

-- 5. MIGRAR DADOS JSONB DOS FUNCIONÁRIOS
UPDATE funcionarios 
SET beneficios = jsonb_set(
    beneficios - 'vale_refeicao',
    '{cesta_basica}',
    beneficios->'vale_refeicao'
)
WHERE beneficios ? 'vale_refeicao';

-- 6. MIGRAR DADOS JSONB DOS HOLERITES
UPDATE holerites 
SET beneficios = jsonb_set(
    beneficios - 'vale_refeicao',
    '{cesta_basica}',
    beneficios->'vale_refeicao'
)
WHERE beneficios ? 'vale_refeicao';

-- 7. VERIFICAR RESULTADO FINAL
DO $$
DECLARE
    funcionarios_count INTEGER;
    holerites_count INTEGER;
    colunas_calculadas INTEGER;
    tem_cesta_basica BOOLEAN;
BEGIN
    -- Contar funcionários com cesta_basica
    SELECT COUNT(*) INTO funcionarios_count
    FROM funcionarios 
    WHERE beneficios ? 'cesta_basica';
    
    -- Contar holerites com cesta_basica no JSONB
    SELECT COUNT(*) INTO holerites_count
    FROM holerites 
    WHERE beneficios ? 'cesta_basica';
    
    -- Verificar colunas calculadas
    SELECT COUNT(*) INTO colunas_calculadas
    FROM information_schema.columns 
    WHERE table_name = 'holerites' 
    AND column_name IN ('total_proventos', 'total_descontos', 'salario_liquido');
    
    -- Verificar se coluna cesta_basica_desconto existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'holerites' AND column_name = 'cesta_basica_desconto'
    ) INTO tem_cesta_basica;
    
    RAISE NOTICE '📊 RESULTADO FINAL DAS CORREÇÕES:';
    RAISE NOTICE '   ✅ Funcionários com cesta_basica (JSONB): %', funcionarios_count;
    RAISE NOTICE '   ✅ Holerites com cesta_basica (JSONB): %', holerites_count;
    RAISE NOTICE '   ✅ Colunas calculadas criadas: %/3', colunas_calculadas;
    RAISE NOTICE '   ✅ Coluna cesta_basica_desconto existe: %', tem_cesta_basica;
    
    IF colunas_calculadas = 3 AND tem_cesta_basica THEN
        RAISE NOTICE '🎉 TODAS AS CORREÇÕES APLICADAS COM SUCESSO!';
        RAISE NOTICE '📋 Sistema pronto para usar cesta básica ao invés de vale refeição';
    ELSE
        RAISE NOTICE '⚠️ Algumas correções podem não ter sido aplicadas completamente';
    END IF;
END $$;