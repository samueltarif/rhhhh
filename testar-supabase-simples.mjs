#!/usr/bin/env node

// Teste simples do Supabase

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function testarSupabase() {
  console.log('🧪 Teste simples do Supabase...\n')

  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão...')
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      console.log('✅ Conexão OK')
    } else {
      console.log('❌ Erro na conexão')
      const text = await response.text()
      console.log('Resposta:', text)
    }

    // 2. Listar tabelas
    console.log('\n2️⃣ Listando tabelas...')
    const tablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Accept': 'application/vnd.pgrst.object+json'
      }
    })
    
    console.log('Status tabelas:', tablesResponse.status)
    
    // 3. Testar tabela específica
    console.log('\n3️⃣ Testando tabela funcionarios...')
    const funcResponse = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Status funcionarios:', funcResponse.status)
    
    if (funcResponse.ok) {
      const data = await funcResponse.json()
      console.log('✅ Tabela funcionarios OK')
      console.log('Dados:', JSON.stringify(data, null, 2))
    } else {
      console.log('❌ Erro na tabela funcionarios')
      const errorText = await funcResponse.text()
      console.log('Erro:', errorText)
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarSupabase()