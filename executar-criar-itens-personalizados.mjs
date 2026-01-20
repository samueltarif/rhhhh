import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executarSQL() {
  try {
    console.log('📋 Lendo arquivo SQL...')
    const sql = readFileSync('./database/16-criar-tabela-itens-personalizados-holerite.sql', 'utf-8')
    
    console.log('🚀 Executando SQL no Supabase...')
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error)
      process.exit(1)
    }
    
    console.log('✅ Tabela criada com sucesso!')
    console.log('📊 Resultado:', data)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

executarSQL()
