-- ========================================
-- ALTERAR VALE REFEIÇÃO PARA CESTA BÁSICA
-- ========================================
-- Este script atualiza todas as referências de "Vale Refeição" para "Cesta Básica"

-- 1. Atualizar dados existentes na tabela funcionarios (se houver coluna beneficios)
DO $$
BEGIN
    -- Verificar se a coluna beneficios existe na tabela funcionarios
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'beneficios'
    ) THEN
        -- Atualizar referências de vale_refeicao para cesta_basica
        UPDATE funcionarios 
        SET beneficios = jsonb_set(
            beneficios - 'vale_refeicao',
            '{cesta_basica}',
            beneficios->'vale_refeicao'
        )
        WHERE beneficios ? 'vale_refeicao';
        
        RAISE NOTICE '✅ Dados de funcionarios atualizados: vale_refeicao → cesta_basica';
    ELSE
        RAISE NOTICE '⚠️ Coluna beneficios não encontrada na tabela funcionarios';
    END IF;
END $$;

-- 2. Atualizar dados existentes na tabela holerites
DO $$
BEGIN
    -- Verificar se a coluna beneficios existe na tabela holerites
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'holerites' 
        AND column_name = 'beneficios'
    ) THEN
        -- Atualizar referências de vale_refeicao para cesta_basica nos holerites
        UPDATE holerites 
        SET beneficios = jsonb_set(
            beneficios - 'vale_refeicao',
            '{cesta_basica}',
            beneficios->'vale_refeicao'
        )
        WHERE beneficios ? 'vale_refeicao';
        
        RAISE NOTICE '✅ Dados de holerites atualizados: vale_refeicao → cesta_basica';
    ELSE
        RAISE NOTICE '⚠️ Coluna beneficios não encontrada na tabela holerites';
    END IF;
END $$;

-- 3. Verificar resultado da atualização
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
END $$;

-- 4. Verificação final
DO $$
BEGIN
    RAISE NOTICE '🎉 Migração concluída: Vale Refeição → Cesta Básica';
    RAISE NOTICE '📅 Data da migração: %', CURRENT_DATE;
END $$;