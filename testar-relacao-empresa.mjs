#!/usr/bin/env node

// Testar relação funcionário-empresa

const SUPABASE_URL = 'https://rqryspxfvfzfghrfqtbm.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcnlzcHhmdmZ6ZmdocmZxdGJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNjc1OSwiZXhwIjoyMDgzNTkyNzU5fQ._AQ67F_-Z9Cvfqv5_ZISgMDbYGRCk2P5wqK1JdFBYA4'

async function testarRelacao() {
  console.log('🧪 Testando relação funcionário-empresa...\n')

  try {
    // 1. Verificar empresa ID 10
    console.log('1️⃣ Verificando empresa ID 10...')
    const empresaResponse = await fetch(`${SUPABASE_URL}/rest/v1/empresas?id=eq.10`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (empresaResponse.ok) {
      const empresas = await empresaResponse.json()
      console.log('✅ Empresa encontrada:')
      console.log(JSON.stringify(empresas, null, 2))
    } else {
      console.log('❌ Empresa não encontrada')
    }

    // 2. Testar join simples
    console.log('\n2️⃣ Testando join funcionário-empresa...')
    const joinResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?id=eq.130&select=id,nome_completo,empresa_id,empresas(nome_fantasia,cnpj)`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('Status join:', joinResponse.status)
    
    if (joinResponse.ok) {
      const joinData = await joinResponse.json()
      console.log('✅ Join funcionou:')
      console.log(JSON.stringify(joinData, null, 2))
    } else {
      console.log('❌ Erro no join')
      const errorText = await joinResponse.text()
      console.log('Erro:', errorText)
    }

    // 3. Testar API meus-dados
    console.log('\n3️⃣ Testando API meus-dados...')
    try {
      const apiResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=130')
      
      console.log('Status API:', apiResponse.status)
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json()
        console.log('✅ API funcionou:')
        console.log(JSON.stringify(apiData, null, 2))
      } else {
        console.log('❌ Erro na API')
        const errorText = await apiResponse.text()
        console.log('Erro:', errorText)
      }
    } catch (apiError) {
      console.log('⚠️ API offline:', apiError.message)
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarRelacao()