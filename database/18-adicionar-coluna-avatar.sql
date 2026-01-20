-- Adicionar coluna avatar na tabela funcionarios
-- Esta coluna armazenará o ID do avatar personalizado escolhido pelo usuário

-- Adicionar a coluna avatar
ALTER TABLE funcionarios 
ADD COLUMN avatar VARCHAR(50) DEFAULT 'person-1';

-- Comentário da coluna
COMMENT ON COLUMN funcionarios.avatar IS 'ID do avatar personalizado escolhido pelo usuário (ex: person-1, person-2, etc.)';

-- Atualizar avatares padrão baseado no gênero (opcional)
-- Você pode executar isso se quiser dar avatares diferentes por padrão
UPDATE funcionarios 
SET avatar = CASE 
  WHEN nome_completo ILIKE '%ana%' OR nome_completo ILIKE '%maria%' OR nome_completo ILIKE '%silva%' THEN 'person-3'
  WHEN nome_completo ILIKE '%joão%' OR nome_completo ILIKE '%josé%' OR nome_completo ILIKE '%carlos%' THEN 'person-2'
  ELSE 'person-1'
END
WHERE avatar IS NULL OR avatar = '';

-- Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'funcionarios' AND column_name = 'avatar';