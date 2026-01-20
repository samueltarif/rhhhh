import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('💰 CALCULADORA DE DESCONTOS - INSS E IRRF\n')
console.log('=' .repeat(100))

// Função para calcular INSS 2025
function calcularINSS2025(salario) {
  let inss = 0
  let aliquotaEfetiva = 0
  
  if (salario <= 1518.00) {
    inss = salario * 0.075
    aliquotaEfetiva = 7.5
  } else if (salario <= 2793.88) {
    inss = 1518.00 * 0.075
    inss += (salario - 1518.00) * 0.09
    aliquotaEfetiva = (inss / salario) * 100
  } else if (salario <= 4190.83) {
    inss = 1518.00 * 0.075
    inss += (2793.88 - 1518.00) * 0.09
    inss += (salario - 2793.88) * 0.12
    aliquotaEfetiva = (inss / salario) * 100
  } else if (salario <= 8157.41) {
    inss = 1518.00 * 0.075
    inss += (2793.88 - 1518.00) * 0.09
    inss += (4190.83 - 2793.88) * 0.12
    inss += (salario - 4190.83) * 0.14
    aliquotaEfetiva = (inss / salario) * 100
  } else {
    // Acima do teto
    inss = 1518.00 * 0.075
    inss += (2793.88 - 1518.00) * 0.09
    inss += (4190.83 - 2793.88) * 0.12
    inss += (8157.41 - 4190.83) * 0.14
    aliquotaEfetiva = (inss / salario) * 100
  }
  
  return {
    valor: Math.round(inss * 100) / 100,
    aliquota: Math.round(aliquotaEfetiva * 100) / 100
  }
}

// Função para calcular IRRF 2026 com isenção CLT
function calcularIRRF2026(salarioBruto, inss, numeroDependentes = 0) {
  const deducaoDependentes = numeroDependentes * 189.59
  const baseIRRF = salarioBruto - inss - deducaoDependentes
  
  let irrf = 0
  let aliquotaIRRF = 0
  let faixaIRRF = 'Isento'
  
  // REGRA 1: ISENÇÃO CLT até R$ 5.000,00 (Base IRRF)
  if (baseIRRF <= 5000.00) {
    irrf = 0
    aliquotaIRRF = 0
    faixaIRRF = 'Isento CLT (≤ R$ 5.000,00)'
  }
  // REGRA 2: FAIXA DE TRANSIÇÃO COM REDUTOR (R$ 5.000,01 a R$ 7.350,00)
  else if (baseIRRF <= 7350.00) {
    // Calcular IR pela tabela progressiva normal
    let irrfTabela = 0
    let aliquotaTabelaNominal = 0
    
    if (baseIRRF <= 2259.20) {
      irrfTabela = 0
      aliquotaTabelaNominal = 0
    } else if (baseIRRF <= 2826.65) {
      irrfTabela = (baseIRRF * 0.075) - 169.44
      aliquotaTabelaNominal = 7.5
    } else if (baseIRRF <= 3751.05) {
      irrfTabela = (baseIRRF * 0.15) - 381.44
      aliquotaTabelaNominal = 15
    } else if (baseIRRF <= 4664.68) {
      irrfTabela = (baseIRRF * 0.225) - 662.77
      aliquotaTabelaNominal = 22.5
    } else {
      irrfTabela = (baseIRRF * 0.275) - 896.00
      aliquotaTabelaNominal = 27.5
    }
    
    // Aplicar redutor progressivo baseado na isenção CLT
    const fatorReducao = (baseIRRF - 5000.00) / (7350.00 - 5000.00)
    irrf = irrfTabela * fatorReducao
    aliquotaIRRF = baseIRRF > 0 ? (irrf / baseIRRF) * 100 : 0
    faixaIRRF = `Transição c/ Redutor (${(fatorReducao * 100).toFixed(1)}% do IR ${aliquotaTabelaNominal}%)`
  }
  // REGRA 3: ACIMA DE R$ 7.350,00 - Tabela Progressiva Normal
  else {
    if (baseIRRF <= 2259.20) {
      irrf = 0
      aliquotaIRRF = 0
      faixaIRRF = 'Isento'
    } else if (baseIRRF <= 2826.65) {
      irrf = (baseIRRF * 0.075) - 169.44
      aliquotaIRRF = 7.5
      faixaIRRF = '7,5%'
    } else if (baseIRRF <= 3751.05) {
      irrf = (baseIRRF * 0.15) - 381.44
      aliquotaIRRF = 15
      faixaIRRF = '15%'
    } else if (baseIRRF <= 4664.68) {
      irrf = (baseIRRF * 0.225) - 662.77
      aliquotaIRRF = 22.5
      faixaIRRF = '22,5%'
    } else {
      irrf = (baseIRRF * 0.275) - 896.00
      aliquotaIRRF = 27.5
      faixaIRRF = '27,5%'
    }
  }
  
  // Arredondar e garantir que não seja negativo
  irrf = Math.max(0, Math.round(irrf * 100) / 100)
  aliquotaIRRF = Math.round(aliquotaIRRF * 100) / 100
  
  return {
    baseIRRF: Math.round(baseIRRF * 100) / 100,
    valor: irrf,
    aliquota: aliquotaIRRF,
    faixa: faixaIRRF,
    deducaoDependentes
  }
}

// Função para buscar funcionários ativos
async function buscarFuncionarios() {
  console.log('👥 Buscando funcionários ativos...\n')
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?status=eq.ativo&select=id,nome_completo,salario_base,numero_dependentes,tipo_contrato&order=salario_base.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar funcionários')
    }
    
    const funcionarios = await response.json()
    console.log(`✅ ${funcionarios.length} funcionário(s) ativo(s) encontrado(s)\n`)
    
    return funcionarios
  } catch (error) {
    console.error('❌ Erro:', error.message)
    return []
  }
}

// Função para formatar moeda
function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

// Função para calcular descontos de um funcionário
function calcularDescontosFuncionario(funcionario) {
  const salario = funcionario.salario_base || 0
  const dependentes = funcionario.numero_dependentes || 0
  
  // Calcular INSS
  const inss = calcularINSS2025(salario)
  
  // Calcular IRRF
  const irrf = calcularIRRF2026(salario, inss.valor, dependentes)
  
  // Calcular líquido
  const totalDescontos = inss.valor + irrf.valor
  const salarioLiquido = salario - totalDescontos
  
  return {
    salarioBruto: salario,
    inss,
    irrf,
    totalDescontos,
    salarioLiquido,
    dependentes
  }
}

// Função principal
async function executar() {
  try {
    // 1. Buscar funcionários
    const funcionarios = await buscarFuncionarios()
    
    if (funcionarios.length === 0) {
      console.log('⚠️ Nenhum funcionário encontrado')
      return
    }
    
    // 2. Calcular descontos para cada funcionário
    console.log('📊 CÁLCULO DE DESCONTOS POR FUNCIONÁRIO')
    console.log('=' .repeat(100))
    
    let totalSalarioBruto = 0
    let totalINSS = 0
    let totalIRRF = 0
    let totalLiquido = 0
    
    funcionarios.forEach((funcionario, index) => {
      const calculo = calcularDescontosFuncionario(funcionario)
      
      // Acumular totais
      totalSalarioBruto += calculo.salarioBruto
      totalINSS += calculo.inss.valor
      totalIRRF += calculo.irrf.valor
      totalLiquido += calculo.salarioLiquido
      
      // Exibir dados do funcionário
      console.log(`\n${(index + 1).toString().padStart(2, '0')}. ${funcionario.nome_completo.toUpperCase()}`)
      console.log('─'.repeat(80))
      console.log(`    💰 Salário Bruto: ${formatarMoeda(calculo.salarioBruto)}`)
      console.log(`    👨‍👩‍👧‍👦 Dependentes: ${calculo.dependentes}`)
      console.log(`    📋 Tipo Contrato: ${funcionario.tipo_contrato || 'CLT'}`)
      
      // INSS
      console.log(`\n    📊 INSS (Tabela 2025):`)
      console.log(`       Valor: ${formatarMoeda(calculo.inss.valor)} (${calculo.inss.aliquota}%)`)
      
      // IRRF
      console.log(`\n    📊 IRRF (Tabela 2026 c/ Isenção CLT):`)
      console.log(`       Base IRRF: ${formatarMoeda(calculo.irrf.baseIRRF)} (Bruto - INSS - Dependentes)`)
      console.log(`       Dedução Dependentes: ${formatarMoeda(calculo.irrf.deducaoDependentes)}`)
      console.log(`       Valor: ${formatarMoeda(calculo.irrf.valor)} (${calculo.irrf.aliquota}%)`)
      console.log(`       Faixa: ${calculo.irrf.faixa}`)
      
      // Resumo
      console.log(`\n    💸 RESUMO:`)
      console.log(`       Total Descontos: ${formatarMoeda(calculo.totalDescontos)}`)
      console.log(`       Salário Líquido: ${formatarMoeda(calculo.salarioLiquido)}`)
      console.log(`       % Desconto Total: ${((calculo.totalDescontos / calculo.salarioBruto) * 100).toFixed(2)}%`)
    })
    
    // 3. Resumo geral
    console.log('\n' + '='.repeat(100))
    console.log('📈 RESUMO GERAL DA FOLHA DE PAGAMENTO')
    console.log('='.repeat(100))
    
    console.log(`\n👥 Total de Funcionários: ${funcionarios.length}`)
    console.log(`💰 Total Salário Bruto: ${formatarMoeda(totalSalarioBruto)}`)
    console.log(`📊 Total INSS: ${formatarMoeda(totalINSS)} (${((totalINSS / totalSalarioBruto) * 100).toFixed(2)}%)`)
    console.log(`📊 Total IRRF: ${formatarMoeda(totalIRRF)} (${((totalIRRF / totalSalarioBruto) * 100).toFixed(2)}%)`)
    console.log(`💸 Total Descontos: ${formatarMoeda(totalINSS + totalIRRF)} (${(((totalINSS + totalIRRF) / totalSalarioBruto) * 100).toFixed(2)}%)`)
    console.log(`💵 Total Líquido: ${formatarMoeda(totalLiquido)} (${((totalLiquido / totalSalarioBruto) * 100).toFixed(2)}%)`)
    
    // 4. Estatísticas por faixa salarial
    console.log('\n📊 ESTATÍSTICAS POR FAIXA SALARIAL')
    console.log('─'.repeat(100))
    
    const faixas = [
      { nome: 'Até R$ 2.000', min: 0, max: 2000 },
      { nome: 'R$ 2.001 a R$ 4.000', min: 2001, max: 4000 },
      { nome: 'R$ 4.001 a R$ 6.000', min: 4001, max: 6000 },
      { nome: 'R$ 6.001 a R$ 10.000', min: 6001, max: 10000 },
      { nome: 'Acima de R$ 10.000', min: 10001, max: Infinity }
    ]
    
    faixas.forEach(faixa => {
      const funcionariosFaixa = funcionarios.filter(f => 
        f.salario_base >= faixa.min && f.salario_base <= faixa.max
      )
      
      if (funcionariosFaixa.length > 0) {
        const calculosFaixa = funcionariosFaixa.map(f => calcularDescontosFuncionario(f))
        const totalBrutoFaixa = calculosFaixa.reduce((sum, c) => sum + c.salarioBruto, 0)
        const totalINSSFaixa = calculosFaixa.reduce((sum, c) => sum + c.inss.valor, 0)
        const totalIRRFFaixa = calculosFaixa.reduce((sum, c) => sum + c.irrf.valor, 0)
        const mediaAliquotaINSS = calculosFaixa.reduce((sum, c) => sum + c.inss.aliquota, 0) / calculosFaixa.length
        const mediaAliquotaIRRF = calculosFaixa.reduce((sum, c) => sum + c.irrf.aliquota, 0) / calculosFaixa.length
        
        console.log(`\n${faixa.nome}: ${funcionariosFaixa.length} funcionário(s)`)
        console.log(`   Salário Bruto Total: ${formatarMoeda(totalBrutoFaixa)}`)
        console.log(`   INSS Total: ${formatarMoeda(totalINSSFaixa)} (média ${mediaAliquotaINSS.toFixed(2)}%)`)
        console.log(`   IRRF Total: ${formatarMoeda(totalIRRFFaixa)} (média ${mediaAliquotaIRRF.toFixed(2)}%)`)
      }
    })
    
    console.log('\n' + '='.repeat(100))
    console.log('✅ CÁLCULO CONCLUÍDO!')
    console.log('📋 Tabelas utilizadas: INSS 2025 + IRRF 2026 com Isenção CLT')
    console.log('='.repeat(100))
    
  } catch (error) {
    console.error('\n❌ Erro no cálculo:', error.message)
  }
}

// Executar
executar()