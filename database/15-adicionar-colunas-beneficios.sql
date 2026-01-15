-- ========================================
-- ADICIONAR COLUNAS DE BENEFÍCIOS E DESCONTOS NA TABELA HOLERITES
-- ========================================
-- Estas colunas armazenam os benefícios e descontos personalizados do funcionário

-- Adicionar coluna beneficios (JSON)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'holerites' 
        AND column_name = 'beneficios'
    ) THEN
        ALTER TABLE holerites 
        ADD COLUMN beneficios JSONB DEFAULT '[]'::jsonb;
        
        RAISE NOTICE '✅ Coluna beneficios adicionada com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Coluna beneficios já existe.';
    END IF;
END $$;

-- Adicionar coluna descontos_personalizados (JSON)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'holerites' 
        AND column_name = 'descontos_personalizados'
    ) THEN
        ALTER TABLE holerites 
        ADD COLUMN descontos_personalizados JSONB DEFAULT '[]'::jsonb;
        
        RAISE NOTICE '✅ Coluna descontos_personalizados adicionada com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Coluna descontos_personalizados já existe.';
    END IF;
END $$;

-- Adicionar comentários explicativos
COMMENT ON COLUMN holerites.beneficios IS 'Array JSON com benefícios do funcionário (vale transporte, refeição, planos, etc.)';
COMMENT ON COLUMN holerites.descontos_personalizados IS 'Array JSON com descontos personalizados do funcionário';

-- Verificar resultado
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'holerites'
AND column_name IN ('beneficios', 'descontos_personalizados')
ORDER BY column_name;