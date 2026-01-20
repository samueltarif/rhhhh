import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Verificando coluna de pensão alimentícia\n')

async function verificarColuna() {
  try {
    // Buscar um funcionário para ver as colunas disponíveis
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?select=*&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const funcionarios = await response.json()
    
    if (funcionarios && funcionarios.length > 0) {
      const funcionario = funcionarios[0]
      console.log('📋 Colunas disponíveis na tabela funcionarios:')
      console.log('=' .repeat(60))
      
      const colunas = Object.keys(funcionario).sort()
      colunas.forEach((coluna, i) => {
        const valor = funcionario[coluna]
        const tipo = typeof valor
        console.log(`${String(i + 1).padStart(2, ' ')}. ${coluna.padEnd(30, ' ')} | ${tipo}`)
      })
      
      console.log('\n🔍 Verificando campos relacionados a pensão:')
      const camposPensao = colunas.filter(c => 
        c.includes('pensao') || 
        c.includes('alimenticia') || 
        c.includes('pension') ||
        c.includes('desconto')
      )
      
      if (camposPensao.length > 0) {
        console.log('✅ Campos relacionados encontrados:')
        camposPensao.forEach(campo => {
          console.log(`   - ${campo}: ${funcionario[campo]}`)
        })
      } else {
        console.log('❌ Nenhum campo de pensão alimentícia encontrado')
        console.log('\n💡 Será necessário adicionar a coluna ao banco de dados')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificarColuna()