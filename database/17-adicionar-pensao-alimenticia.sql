-- =====================================================
-- ADICIONAR COLUNA PENSÃO ALIMENTÍCIA
-- =====================================================

-- Adicionar coluna pensao_alimenticia na tabela funcionarios
ALTER TABLE funcionarios 
ADD COLUMN pensao_alimenticia DECIMAL(10,2) DEFAULT 0.00;

-- Comentário explicativo
COMMENT ON COLUMN funcionarios.pensao_alimenticia IS 'Valor da pensão alimentícia descontada mensalmente (dedutível do IRRF)';

-- Atualizar timestamp
UPDATE funcionarios SET updated_at = NOW() WHERE pensao_alimenticia IS NULL;

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'funcionarios' 
AND column_name = 'pensao_alimenticia';