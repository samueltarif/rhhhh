import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function verificarPensao() {
  try {
    // Buscar funcionário Silvana
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?id=eq.1&select=id,nome_completo,pensao_alimenticia`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const funcionarios = await response.json()
    const funcionario = funcionarios[0]
    
    console.log('👤 Funcionário:', funcionario.nome_completo)
    console.log('💰 Pensão Alimentícia no banco:', funcionario.pensao_alimenticia)
    console.log('🔢 Tipo:', typeof funcionario.pensao_alimenticia)
    console.log('✅ Valor > 0?', funcionario.pensao_alimenticia > 0)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificarPensao()