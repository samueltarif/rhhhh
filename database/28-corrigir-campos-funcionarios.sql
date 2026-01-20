-- ========================================
-- CORRIGIR CAMPOS FALTANTES - FUNCIONÁRIOS
-- Adiciona campos que estão sendo usados mas não existem
-- ========================================

-- Adicionar coluna chave_pix se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'chave_pix'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN chave_pix VARCHAR(255);
        
        COMMENT ON COLUMN funcionarios.chave_pix IS 'Chave PIX do funcionário para pagamentos';
        
        RAISE NOTICE '✅ Coluna chave_pix adicionada com sucesso';
    ELSE
        RAISE NOTICE '⚠️ Coluna chave_pix já existe';
    END IF;
END $$;

-- Adicionar coluna responsavel_cadastro_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'responsavel_cadastro_id'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN responsavel_cadastro_id INTEGER REFERENCES funcionarios(id);
        
        COMMENT ON COLUMN funcionarios.responsavel_cadastro_id IS 'ID do funcionário/admin que cadastrou este funcionário';
        
        RAISE NOTICE '✅ Coluna responsavel_cadastro_id adicionada com sucesso';
    ELSE
        RAISE NOTICE '⚠️ Coluna responsavel_cadastro_id já existe';
    END IF;
END $$;

-- Adicionar outros campos que podem estar faltando
DO $$ 
BEGIN
    -- Verificar e adicionar endereco se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'endereco'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN endereco TEXT;
        
        RAISE NOTICE '✅ Coluna endereco adicionada';
    END IF;
    
    -- Verificar e adicionar cep se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'cep'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN cep VARCHAR(10);
        
        RAISE NOTICE '✅ Coluna cep adicionada';
    END IF;
    
    -- Verificar e adicionar cidade se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'cidade'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN cidade VARCHAR(100);
        
        RAISE NOTICE '✅ Coluna cidade adicionada';
    END IF;
    
    -- Verificar e adicionar estado se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'estado'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN estado VARCHAR(2);
        
        RAISE NOTICE '✅ Coluna estado adicionada';
    END IF;
END $$;

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_funcionarios_responsavel_cadastro 
ON funcionarios(responsavel_cadastro_id);

CREATE INDEX IF NOT EXISTS idx_funcionarios_chave_pix 
ON funcionarios(chave_pix);

-- Atualizar funcionários existentes para ter responsável pelo cadastro
UPDATE funcionarios 
SET responsavel_cadastro_id = (
    SELECT id FROM funcionarios 
    WHERE tipo_acesso = 'admin' 
    OR email_login ILIKE '%silvana%'
    ORDER BY 
        CASE WHEN email_login ILIKE '%silvana%' THEN 1 ELSE 2 END,
        id 
    LIMIT 1
),
updated_at = NOW()
WHERE responsavel_cadastro_id IS NULL;

-- Verificar estrutura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'funcionarios' 
AND column_name IN (
    'chave_pix', 
    'responsavel_cadastro_id', 
    'endereco', 
    'cep', 
    'cidade', 
    'estado'
)
ORDER BY column_name;

-- Mostrar funcionários com responsável
SELECT 
    f.id,
    f.nome_completo,
    f.email_login,
    r.nome_completo as responsavel_cadastro,
    f.chave_pix,
    f.created_at
FROM funcionarios f
LEFT JOIN funcionarios r ON f.responsavel_cadastro_id = r.id
ORDER BY f.created_at DESC
LIMIT 10;

/*
✅ CAMPOS CORRIGIDOS NA TABELA FUNCIONÁRIOS

CAMPOS ADICIONADOS:
- chave_pix: Para pagamentos via PIX
- responsavel_cadastro_id: Para rastrear quem cadastrou
- endereco: Endereço completo
- cep: Código postal
- cidade: Cidade
- estado: Estado (UF)

PRÓXIMOS PASSOS:
1. Execute este script no Supabase SQL Editor
2. Reinicie o servidor de desenvolvimento
3. Teste o salvamento de dados financeiros
4. Verifique se o responsável aparece no painel
*/