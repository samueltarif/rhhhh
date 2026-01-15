import dotenv from 'dotenv'

dotenv.config()

console.log('🔄 Adicionando colunas de benefícios na tabela holerites...\n')

console.log('⚠️ O Supabase não permite ALTER TABLE via API REST.')
console.log('📋 Você precisa executar o SQL manualmente no Supabase Dashboard.\n')

console.log('═'.repeat(80))
console.log('INSTRUÇÕES:')
console.log('═'.repeat(80))
console.log('1. Acesse: https://supabase.com/dashboard')
console.log('2. Selecione seu projeto: rqryspxfvfzfghrfqtbm')
console.log('3. Vá em: SQL Editor (menu lateral)')
console.log('4. Clique em: "New query"')
console.log('5. Cole o SQL abaixo:')
console.log('─'.repeat(80))
console.log(`
-- Adicionar colunas de benefícios e descontos
ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS beneficios JSONB DEFAULT '[]'::jsonb;

ALTER TABLE holerites 
ADD COLUMN IF NOT EXISTS descontos_personalizados JSONB DEFAULT '[]'::jsonb;

-- Adicionar comentários
COMMENT ON COLUMN holerites.beneficios IS 'Array JSON com benefícios do funcionário';
COMMENT ON COLUMN holerites.descontos_personalizados IS 'Array JSON com descontos personalizados';
`)
console.log('─'.repeat(80))
console.log('6. Clique em "Run" (ou pressione Ctrl+Enter)')
console.log('7. Você deve ver: "Success. No rows returned"')
console.log('═'.repeat(80))

console.log('\n✅ Após executar, os holerites poderão ser gerados com benefícios!')
console.log('📖 Arquivo SQL completo: database/15-adicionar-colunas-beneficios.sql')