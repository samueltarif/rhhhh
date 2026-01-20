import 'dotenv/config'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🏗️ Adicionando coluna pensão alimentícia\n')

async function executarMigration() {
  try {
    // Ler o arquivo SQL
    const sql = readFileSync('database/17-adicionar-pensao-alimenticia.sql', 'utf8')
    
    console.log('📄 Executando migration...')
    console.log('SQL:', sql.substring(0, 200) + '...')
    
    // Executar no Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.log('❌ Erro ao executar SQL:', error)
      
      // Tentar método alternativo - executar comando por comando
      console.log('\n🔄 Tentando método alternativo...')
      
      const commands = sql.split(';').filter(cmd => cmd.trim() && !cmd.trim().startsWith('--'))
      
      for (const command of commands) {
        if (command.trim()) {
          console.log(`Executando: ${command.trim().substring(0, 50)}...`)
          
          const cmdResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: command.trim() })
          })
          
          if (!cmdResponse.ok) {
            const cmdError = await cmdResponse.text()
            console.log(`❌ Erro no comando: ${cmdError}`)
          } else {
            console.log('✅ Comando executado')
          }
        }
      }
    } else {
      console.log('✅ Migration executada com sucesso!')
    }
    
    // Verificar se a coluna foi criada
    console.log('\n🔍 Verificando se a coluna foi criada...')
    
    const verifyResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?select=pensao_alimenticia&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (verifyResponse.ok) {
      const data = await verifyResponse.json()
      console.log('✅ Coluna pensao_alimenticia criada com sucesso!')
      console.log('📊 Exemplo de dados:', data[0])
    } else {
      console.log('❌ Erro ao verificar coluna')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

executarMigration()