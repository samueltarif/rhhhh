import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function buscarHolerite() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?select=id,funcionario_id,periodo_inicio,periodo_fim&order=created_at.desc&limit=3`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const holerites = await response.json()
    
    console.log('📋 Holerites recentes:')
    holerites.forEach((h, i) => {
      console.log(`   ${i + 1}. ID: ${h.id} | Funcionário: ${h.funcionario_id} | Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

buscarHolerite()