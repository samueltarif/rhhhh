/**
 * Script de Validação: Competência de Holerites
 * 
 * Este script valida que os holerites mensais estão sendo gerados
 * com a competência correta (mês vigente).
 * 
 * Uso:
 *   npx tsx scripts/validar-competencia-holerite.ts
 */

import { calcularDatasHolerite } from '../server/utils/dateUtils'

console.log('🔍 Validando Competência de Holerites\n')
console.log('=' .repeat(60))

// Teste 1: Folha Mensal
console.log('\n📄 TESTE 1: Folha Mensal')
console.log('-'.repeat(60))

const resultadoMensal = calcularDatasHolerite('mensal')
const hoje = new Date()
const mesAtual = hoje.getMonth() + 1
const anoAtual = hoje.getFullYear()
const mesEsperado = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`

console.log(`Data Atual: ${hoje.toISOString().split('T')[0]}`)
console.log(`Mês Esperado: ${mesEsperado}`)
console.log(`Mês Gerado: ${resultadoMensal.mes_referencia}`)
console.log(`Período: ${resultadoMensal.periodo_inicio} a ${resultadoMensal.periodo_fim}`)
console.log(`Data Pagamento: ${resultadoMensal.data_pagamento}`)

if (resultadoMensal.mes_referencia === mesEsperado) {
  console.log('✅ PASSOU: Competência está correta!')
} else {
  console.log('❌ FALHOU: Competência está incorreta!')
  console.log(`   Esperado: ${mesEsperado}`)
  console.log(`   Recebido: ${resultadoMensal.mes_referencia}`)
  process.exit(1)
}

// Teste 2: Adiantamento
console.log('\n💰 TESTE 2: Adiantamento Salarial')
console.log('-'.repeat(60))

const resultadoAdiantamento = calcularDatasHolerite('adiantamento')

console.log(`Período: ${resultadoAdiantamento.periodo_inicio} a ${resultadoAdiantamento.periodo_fim}`)
console.log(`Data Pagamento: ${resultadoAdiantamento.data_pagamento}`)
console.log(`Mês Referência: ${resultadoAdiantamento.mes_referencia}`)

// Validar que adiantamento começa no dia 15
const diaInicio = resultadoAdiantamento.periodo_inicio.split('-')[2]
if (diaInicio === '15') {
  console.log('✅ PASSOU: Adiantamento começa no dia 15')
} else {
  console.log('❌ FALHOU: Adiantamento deveria começar no dia 15')
  process.exit(1)
}

// Validar que pagamento é no dia 20
const diaPagamento = resultadoAdiantamento.data_pagamento.split('-')[2]
if (diaPagamento === '20') {
  console.log('✅ PASSOU: Pagamento no dia 20')
} else {
  console.log('❌ FALHOU: Pagamento deveria ser no dia 20')
  process.exit(1)
}

// Teste 3: Consistência entre campos
console.log('\n🔄 TESTE 3: Consistência entre Campos')
console.log('-'.repeat(60))

const [anoInicio, mesInicio] = resultadoMensal.periodo_inicio.split('-')
const mesReferenciaCalculado = `${anoInicio}-${mesInicio}`

if (resultadoMensal.mes_referencia === mesReferenciaCalculado) {
  console.log('✅ PASSOU: mes_referencia consistente com periodo_inicio')
} else {
  console.log('❌ FALHOU: Inconsistência entre campos')
  console.log(`   mes_referencia: ${resultadoMensal.mes_referencia}`)
  console.log(`   periodo_inicio: ${resultadoMensal.periodo_inicio}`)
  process.exit(1)
}

// Teste 4: Validar que periodo_inicio é sempre dia 1 para mensal
const diaInicioMensal = resultadoMensal.periodo_inicio.split('-')[2]
if (diaInicioMensal === '01') {
  console.log('✅ PASSOU: Folha mensal começa no dia 1')
} else {
  console.log('❌ FALHOU: Folha mensal deveria começar no dia 1')
  process.exit(1)
}

// Teste 5: Validar que data de pagamento é no mês seguinte
const [anoPagamento, mesPagamento] = resultadoMensal.data_pagamento.split('-')
const mesPagamentoNum = parseInt(mesPagamento, 10)
const mesInicioNum = parseInt(mesInicio, 10)

let mesEsperadoPagamento = mesInicioNum + 1
let anoEsperadoPagamento = parseInt(anoInicio, 10)

if (mesEsperadoPagamento > 12) {
  mesEsperadoPagamento = 1
  anoEsperadoPagamento += 1
}

if (mesPagamentoNum === mesEsperadoPagamento && parseInt(anoPagamento, 10) === anoEsperadoPagamento) {
  console.log('✅ PASSOU: Data de pagamento no mês seguinte')
} else {
  console.log('❌ FALHOU: Data de pagamento deveria ser no mês seguinte')
  console.log(`   Esperado: ${anoEsperadoPagamento}-${String(mesEsperadoPagamento).padStart(2, '0')}`)
  console.log(`   Recebido: ${anoPagamento}-${mesPagamento}`)
  process.exit(1)
}

// Resumo Final
console.log('\n' + '='.repeat(60))
console.log('✅ TODOS OS TESTES PASSARAM!')
console.log('='.repeat(60))
console.log('\n📊 Resumo:')
console.log(`   • Folha Mensal: Competência ${resultadoMensal.mes_referencia}`)
console.log(`   • Período: ${resultadoMensal.periodo_inicio} a ${resultadoMensal.periodo_fim}`)
console.log(`   • Pagamento: ${resultadoMensal.data_pagamento}`)
console.log(`   • Adiantamento: ${resultadoAdiantamento.periodo_inicio} a ${resultadoAdiantamento.periodo_fim}`)
console.log('\n✅ Sistema está gerando holerites com competência correta!\n')

process.exit(0)
