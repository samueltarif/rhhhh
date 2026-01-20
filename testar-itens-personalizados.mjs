import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testar() {
  console.log('🔍 Testando tabela holerite_itens_personalizados...\n')
  
  // 1. Verificar se a tabela existe
  console.log('1️⃣ Verificando se a tabela existe...')
  const { data: tabelas, error: erroTabelas } = await supabase
    .from('holerite_itens_personalizados')
    .select('*')
    .limit(1)
  
  if (erroTabelas) {
    console.error('❌ Erro ao acessar tabela:', erroTabelas)
    console.error('\n📋 A tabela NÃO existe ou há erro de permissão')
    console.error('💡 Execute o SQL: EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor')
    return
  }
  
  console.log('✅ Tabela existe e está acessível!\n')
  
  // 2. Tentar inserir um item de teste
  console.log('2️⃣ Tentando inserir item de teste...')
  const { data: itemTeste, error: erroInsert } = await supabase
    .from('holerite_itens_personalizados')
    .insert([{
      funcionario_id: 93,
      tipo: 'beneficio',
      descricao: 'Teste de Bônus',
      valor: 100.00,
      vigencia_tipo: 'unico',
      data_inicio: '2026-01-01',
      data_fim: '2026-01-01',
      ativo: true,
      observacoes: 'Item de teste'
    }])
    .select()
  
  if (erroInsert) {
    console.error('❌ Erro ao inserir:', erroInsert)
    console.error('\n🔐 Possível problema de RLS (Row Level Security)')
    console.error('💡 Verifique se você está autenticado como admin')
    return
  }
  
  console.log('✅ Item inserido com sucesso!')
  console.log('📊 Dados:', itemTeste)
  
  // 3. Buscar itens do funcionário 93
  console.log('\n3️⃣ Buscando itens do funcionário 93...')
  const { data: itens, error: erroBusca } = await supabase
    .from('holerite_itens_personalizados')
    .select('*')
    .eq('funcionario_id', 93)
  
  if (erroBusca) {
    console.error('❌ Erro ao buscar:', erroBusca)
    return
  }
  
  console.log('✅ Itens encontrados:', itens?.length || 0)
  console.log('📋 Lista:', itens)
  
  // 4. Limpar item de teste
  if (itemTeste && itemTeste[0]) {
    console.log('\n4️⃣ Limpando item de teste...')
    const { error: erroDelete } = await supabase
      .from('holerite_itens_personalizados')
      .delete()
      .eq('id', itemTeste[0].id)
    
    if (erroDelete) {
      console.error('❌ Erro ao deletar:', erroDelete)
    } else {
      console.log('✅ Item de teste removido')
    }
  }
  
  console.log('\n✅ Teste concluído com sucesso!')
  console.log('🎉 A funcionalidade está pronta para uso!')
}

testar()
