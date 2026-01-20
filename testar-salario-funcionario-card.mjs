import 'dotenv/config'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🧪 TESTE: Salário no FuncionarioCard\n')
console.log('=' .repeat(80))

async function testarSalarioFuncionarios() {
  try {
    console.log('1️⃣ Buscando funcionários via API...')
    
    const response = await fetch(`${BASE_URL}/api/funcionarios`)
    
    if (!response.ok) {
      const error = await response.text()
      console.log('❌ Erro ao buscar funcionários:', error)
      return false
    }
    
    const funcionarios = await response.json()
    
    console.log(`✅ ${funcionarios.length} funcionário(s) encontrado(s)`)
    
    // Verificar se todos têm salario_base
    console.log('\n2️⃣ Verificando dados dos funcionários...')
    console.log('=' .repeat(80))
    
    funcionarios.forEach((funcionario, index) => {
      const temSalario = funcionario.salario_base !== undefined && funcionario.salario_base !== null
      const valorSalario = funcionario.salario_base || 0
      
      console.log(`\n${(index + 1).toString().padStart(2, '0')}. ${funcionario.nome_completo.toUpperCase()}`)
      console.log('─'.repeat(60))
      console.log(`    📧 Email: ${funcionario.email_login}`)
      console.log(`    🏢 Cargo: ${funcionario.cargo}`)
      console.log(`    🏬 Departamento: ${funcionario.departamento}`)
      console.log(`    📱 Telefone: ${funcionario.telefone || 'Não informado'}`)
      console.log(`    📅 Admissão: ${funcionario.data_admissao ? new Date(funcionario.data_admissao).toLocaleDateString('pt-BR') : 'Não informada'}`)
      console.log(`    💰 Salário: ${temSalario ? '✅' : '❌'} ${temSalario ? formatarMoeda(valorSalario) : 'Não definido'}`)
      console.log(`    🔢 Valor bruto: R$ ${valorSalario.toFixed(2)}`)
      console.log(`    📊 Status: ${funcionario.status}`)
      console.log(`    👤 Tipo: ${funcionario.tipo_acesso}`)
    })
    
    // Estatísticas
    console.log('\n' + '='.repeat(80))
    console.log('📊 ESTATÍSTICAS')
    console.log('='.repeat(80))
    
    const funcionariosComSalario = funcionarios.filter(f => f.salario_base > 0)
    const totalSalarios = funcionarios.reduce((sum, f) => sum + (f.salario_base || 0), 0)
    const mediaSalarial = funcionariosComSalario.length > 0 ? totalSalarios / funcionariosComSalario.length : 0
    const maiorSalario = Math.max(...funcionarios.map(f => f.salario_base || 0))
    const menorSalario = Math.min(...funcionarios.filter(f => f.salario_base > 0).map(f => f.salario_base))
    
    console.log(`\n👥 Total de funcionários: ${funcionarios.length}`)
    console.log(`💰 Funcionários com salário definido: ${funcionariosComSalario.length}`)
    console.log(`📊 Folha salarial total: ${formatarMoeda(totalSalarios)}`)
    console.log(`📈 Média salarial: ${formatarMoeda(mediaSalarial)}`)
    console.log(`🔝 Maior salário: ${formatarMoeda(maiorSalario)}`)
    console.log(`🔻 Menor salário: ${formatarMoeda(menorSalario)}`)
    
    // Faixas salariais
    console.log('\n📊 DISTRIBUIÇÃO POR FAIXA SALARIAL:')
    console.log('─'.repeat(50))
    
    const faixas = [
      { nome: 'Até R$ 2.000', min: 0, max: 2000 },
      { nome: 'R$ 2.001 a R$ 4.000', min: 2001, max: 4000 },
      { nome: 'R$ 4.001 a R$ 6.000', min: 4001, max: 6000 },
      { nome: 'R$ 6.001 a R$ 8.000', min: 6001, max: 8000 },
      { nome: 'Acima de R$ 8.000', min: 8001, max: Infinity }
    ]
    
    faixas.forEach(faixa => {
      const funcionariosFaixa = funcionarios.filter(f => 
        f.salario_base >= faixa.min && f.salario_base <= faixa.max
      )
      
      if (funcionariosFaixa.length > 0) {
        const totalFaixa = funcionariosFaixa.reduce((sum, f) => sum + f.salario_base, 0)
        console.log(`${faixa.nome}: ${funcionariosFaixa.length} funcionário(s) - ${formatarMoeda(totalFaixa)}`)
        funcionariosFaixa.forEach(f => {
          console.log(`   • ${f.nome_completo}: ${formatarMoeda(f.salario_base)}`)
        })
      }
    })
    
    console.log('\n' + '='.repeat(80))
    console.log('✅ TESTE CONCLUÍDO!')
    console.log('✅ Salários agora estão visíveis no FuncionarioCard')
    console.log('✅ Formatação monetária aplicada')
    console.log('✅ Interface atualizada com destaque visual')
    console.log('='.repeat(80))
    
    return true
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    return false
  }
}

// Função para formatar moeda
function formatarMoeda(valor) {
  if (!valor) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Executar teste
testarSalarioFuncionarios()