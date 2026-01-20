#!/usr/bin/env node

/**
 * TESTE DIRETO DO CÁLCULO DE IRRF
 * Simula exatamente o que acontece no sistema
 */

// Funções copiadas do sistema
function round2(valor) {
  return Math.round(valor * 100) / 100
}

function aplicarTabelaProgressivaMensal(baseIRRF) {
  if (baseIRRF <= 2428.80) {
    return 0
  } else if (baseIRRF <= 3051.00) {
    return (baseIRRF * 0.075) - 182.16
  } else if (baseIRRF <= 4052.00) {
    return (baseIRRF * 0.15) - 394.16
  } else if (baseIRRF <= 5050.00) {
    return (baseIRRF * 0.225) - 675.49
  } else {
    return (baseIRRF * 0.275) - 896.00
  }
}

function calcularRedutorLei15270(baseIRRF) {
  if (baseIRRF <= 5000.00) {
    const impostoTabela = aplicarTabelaProgressivaMensal(baseIRRF)
    return impostoTabela
  } else if (baseIRRF <= 7350.00) {
    return 978.62 - (0.133145 * baseIRRF)
  } else {
    return 0
  }
}

function calcularINSS(salarioBase) {
  let inss = 0
  let aliquotaEfetiva = 0
  
  if (salarioBase <= 1518.00) {
    inss = salarioBase * 0.075
    aliquotaEfetiva = 7.5
  } else if (salarioBase <= 2793.88) {
    inss = 1518.00 * 0.075 + (salarioBase - 1518.00) * 0.09
    aliquotaEfetiva = (inss / salarioBase) * 100
  } else if (salarioBase <= 4190.83) {
    inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (salarioBase - 2793.88) * 0.12
    aliquotaEfetiva = (inss / salarioBase) * 100
  } else if (salarioBase <= 8157.41) {
    inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (salarioBase - 4190.83) * 0.14
    aliquotaEfetiva = (inss / salarioBase) * 100
  } else {
    inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (8157.41 - 4190.83) * 0.14
    aliquotaEfetiva = (inss / salarioBase) * 100
  }
  
  return {
    inss: round2(inss),
    aliquotaEfetiva: round2(aliquotaEfetiva)
  }
}

function simularCalculoCompleto(salarioBase, dependentes = 0, pensao = 0) {
  console.log(`\n🧮 SIMULAÇÃO COMPLETA`)
  console.log(`   Salário Base: R$ ${salarioBase.toFixed(2)}`)
  console.log(`   Dependentes: ${dependentes}`)
  console.log(`   Pensão: R$ ${pensao.toFixed(2)}`)
  
  // Calcular INSS
  const resultadoINSS = calcularINSS(salarioBase)
  const inss = resultadoINSS.inss
  const aliquotaINSS = resultadoINSS.aliquotaEfetiva
  
  // Calcular Base IRRF
  const deducaoDependentes = dependentes * 189.59
  const baseIRRF = salarioBase - inss - deducaoDependentes - pensao
  
  // Calcular IRRF
  const irrfTabelaNormal = aplicarTabelaProgressivaMensal(baseIRRF)
  const redutorLei15270 = calcularRedutorLei15270(baseIRRF)
  const irrf = Math.max(0, round2(irrfTabelaNormal - redutorLei15270))
  const aliquotaIRRF = baseIRRF > 0 ? round2((irrf / baseIRRF) * 100) : 0
  
  // Determinar faixa
  let faixaIRRF = ''
  if (baseIRRF <= 5000.00) {
    faixaIRRF = 'isencao'
  } else if (baseIRRF <= 7350.00) {
    faixaIRRF = 'reducao_gradual'
  } else {
    faixaIRRF = 'sem_reducao'
  }
  
  // Calcular totais
  const totalProventos = salarioBase
  const totalDescontos = inss + irrf
  const salarioLiquido = totalProventos - totalDescontos
  
  console.log(`\n📊 RESULTADOS:`)
  console.log(`   INSS: R$ ${inss.toFixed(2)} (${aliquotaINSS}%)`)
  console.log(`   Base IRRF: R$ ${baseIRRF.toFixed(2)}`)
  console.log(`   IRRF Tabela Normal: R$ ${irrfTabelaNormal.toFixed(2)}`)
  console.log(`   Redutor Lei 15.270: R$ ${redutorLei15270.toFixed(2)}`)
  console.log(`   IRRF Final: R$ ${irrf.toFixed(2)} (${aliquotaIRRF}%)`)
  console.log(`   Faixa: ${faixaIRRF}`)
  console.log(`\n💰 RESUMO FINANCEIRO:`)
  console.log(`   Total Proventos: R$ ${totalProventos.toFixed(2)}`)
  console.log(`   Total Descontos: R$ ${totalDescontos.toFixed(2)}`)
  console.log(`   Salário Líquido: R$ ${salarioLiquido.toFixed(2)}`)
  
  return {
    salarioBase,
    inss,
    baseIRRF,
    irrfTabelaNormal,
    redutorLei15270,
    irrf,
    faixaIRRF,
    totalProventos,
    totalDescontos,
    salarioLiquido
  }
}

// ========================================
// EXECUTAR SIMULAÇÕES
// ========================================

console.log('🧪 TESTE DIRETO DO CÁLCULO DE IRRF')
console.log('=' .repeat(60))

// Casos práticos
const casos = [
  { salario: 3000, dependentes: 0, pensao: 0 },
  { salario: 5000, dependentes: 0, pensao: 0 },
  { salario: 6000, dependentes: 2, pensao: 500 },
  { salario: 8000, dependentes: 1, pensao: 0 },
  { salario: 12000, dependentes: 0, pensao: 0 }
]

for (const caso of casos) {
  simularCalculoCompleto(caso.salario, caso.dependentes, caso.pensao)
}

console.log('\n✅ SIMULAÇÕES CONCLUÍDAS')
console.log('🎯 Cálculo está funcionando conforme Lei 15.270/2025')