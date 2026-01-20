-- ========================================
-- ADICIONAR CAMPO RESPONSÁVEL DE CADASTRO
-- Execute este script ANTES de criar funcionários
-- ========================================

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

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_funcionarios_responsavel_cadastro 
ON funcionarios(responsavel_cadastro_id);

-- Atualizar funcionários existentes para ter a Silvana como responsável pelo cadastro
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

-- Verificar resultado
SELECT 
    f.id,
    f.nome_completo,
    f.email_login,
    r.nome_completo as responsavel_cadastro,
    f.created_at
FROM funcionarios f
LEFT JOIN funcionarios r ON f.responsavel_cadastro_id = r.id
ORDER BY f.created_at DESC
LIMIT 10;

-- Mostrar estatísticas
SELECT 
    'Funcionários com responsável cadastro' as estatistica,
    COUNT(*) as quantidade
FROM funcionarios 
WHERE responsavel_cadastro_id IS NOT NULL
UNION ALL
SELECT 
    'Funcionários sem responsável cadastro',
    COUNT(*)
FROM funcionarios 
WHERE responsavel_cadastro_id IS NULL;

/*
✅ COLUNA RESPONSÁVEL CADASTRO IMPLEMENTADA

Esta coluna permite rastrear quem cadastrou cada funcionário no sistema.

COMO FUNCIONA:
- Quando um funcionário é cadastrado, o sistema salva o ID do usuário logado
- Na listagem, é exibido "Cadastrado por: [Nome do Responsável]"
- Funcionários existentes recebem o admin como responsável padrão

PRÓXIMO PASSO:
Execute o script 27-criar-funcionarios-completo.sql para criar os funcionários
*/