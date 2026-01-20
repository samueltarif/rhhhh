-- ============================================================================
-- CORREÇÃO: Remover políticas RLS com recursão infinita
-- ============================================================================
-- Execute este SQL no Supabase SQL Editor para corrigir o erro de recursão
-- ============================================================================

-- 1. Remover TODAS as políticas antigas
DROP POLICY IF EXISTS "Admins podem ver todos os itens personalizados" ON holerite_itens_personalizados;
DROP POLICY IF EXISTS "Admins podem inserir itens personalizados" ON holerite_itens_personalizados;
DROP POLICY IF EXISTS "Admins podem atualizar itens personalizados" ON holerite_itens_personalizados;
DROP POLICY IF EXISTS "Admins podem deletar itens personalizados" ON holerite_itens_personalizados;
DROP POLICY IF EXISTS "Service role bypass" ON holerite_itens_personalizados;

-- 2. Criar política simples que permite tudo
-- (O controle de acesso é feito no nível da aplicação usando service_role)
CREATE POLICY "Service role bypass"
  ON holerite_itens_personalizados
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Verificar
SELECT 
  'Políticas RLS corrigidas!' as mensagem,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'holerite_itens_personalizados';

-- ============================================================================
-- EXPLICAÇÃO
-- ============================================================================
-- As APIs usam serverSupabaseServiceRole que bypassa RLS automaticamente.
-- A política "Service role bypass" é apenas um fallback.
-- O controle de acesso real é feito no middleware da aplicação.
-- ============================================================================
