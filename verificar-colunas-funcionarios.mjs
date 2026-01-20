import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Verificando estrutura da tabela funcionarios\n')

async function verificarColunas() {
  try {
    // Buscar informações das colunas da tabela funcionarios
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/?select=*`,
      {
        method: 'OPTIONS',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    )
    
    // Alternativa: usar query direta para ver as colunas
    const response2 = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?select=*&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response2.ok) {
      const error = await response2.text()
      console.log('❌ Erro:', error)
      return
    }
    
    const funcionarios = await response2.json()
    
    if (funcionarios && funcionarios.length > 0) {
      const funcionario = funcionarios[0]
      console.log('📋 Colunas disponíveis na tabela funcionarios:')
      console.log('=' .repeat(50))
      
      Object.keys(funcionario).sort().forEach((coluna, i) => {
        const valor = funcionario[coluna]
        const tipo = typeof valor
        console.log(`${String(i + 1).padStart(2, ' ')}. ${coluna.padEnd(25, ' ')} | ${tipo.padEnd(8, ' ')} | ${valor}`)
      })
      
      console.log('\n🔍 Verificando se carga_horaria existe:')
      if ('carga_horaria' in funcionario) {
        console.log('✅ Campo carga_horaria EXISTE')
      } else {
        console.log('❌ Campo carga_horaria NÃO EXISTE')
        console.log('\n💡 Campos relacionados encontrados:')
        Object.keys(funcionario).filter(k => k.includes('hora') || k.includes('carga')).forEach(k => {
          console.log(`   - ${k}: ${funcionario[k]}`)
        })
      }
    } else {
      console.log('⚠️ Nenhum funcionário encontrado na tabela')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificarColunas()