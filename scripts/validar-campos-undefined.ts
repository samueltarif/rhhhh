#!/usr/bin/env node

/**
 * Script para validar se os campos "undefined" foram corrigidos nos holerites
 * 
 * Execução: npx tsx scripts/validar-campos-undefined.ts
 */

import { gerarHoleriteHTML } from '../server/utils/holeriteHTML'

console.log('🔍 Validando correção dos campos "undefined" nos holerites...\n')

// Mock de dados para teste
const mockHolerite = {
  id: 1,
  funcionario_id: 1,
  periodo_inicio: '2026-01-01',
  periodo_fim: '2026-01-31',
  salario_base: 3000,
  inss: 276.90,
  irrf: 0,
  valor_liquido: 2723.10,
  tipo_folha: 'MENSAL'
}

const mockFuncionarioCLT = {
  id: 1,
  nome_completo: 'João Silva',
  cpf: '123.456.789-00',
  cargo_nome: undefined, // Simular campo undefined
  departamento_nome: undefined, // Simular campo undefined
  data_admissao: '2025-01-15',
  numero_dependentes: 0,
  pensao_alimenticia: 0,
  tipo_contrato: 'CLT'
}

const mockFuncionarioPJ = {
  id: 2,
  nome_completo: 'Maria Santos',
  cpf: '987.654.321-00',
  cargo_nome: 'Consultora',
  departamento_nome: 'TI',
  data_admissao: '2025-01-15',
  numero_dependentes: 1,
  pensao_alimenticia: 0,
  tipo_contrato: 'PJ'
}

const mockEmpresa = {
  nome: 'Qualitec Ltda',
  nome_fantasia: 'Qualitec',
  cnpj: '12345678000199',
  responsavel_nome: 'SILVANA APARECIDA BARDUCHI',
  responsavel_cpf: '04487488869'
}

// Teste 1: Funcionário CLT com campos undefined
console.log('📋 Teste 1: Funcionário CLT com campos undefined')
try {
  const htmlCLT = gerarHoleriteHTML(mockHolerite, mockFuncionarioCLT, mockEmpresa)
  
  // Verificar se não há "undefined" no HTML
  const hasUndefined = htmlCLT.includes('undefined')
  const hasCargoNaoDefinido = htmlCLT.includes('CARGO NÃO DEFINIDO')
  const hasMatUndefined = htmlCLT.includes('Matundefined')
  const hasCodigoUndefined = htmlCLT.includes('Códigoundefined')
  
  console.log(`   ❌ Contém "undefined": ${hasUndefined}`)
  console.log(`   ❌ Contém "CARGO NÃO DEFINIDO": ${hasCargoNaoDefinido}`)
  console.log(`   ❌ Contém "Matundefined": ${hasMatUndefined}`)
  console.log(`   ❌ Contém "Códigoundefined": ${hasCodigoUndefined}`)
  
  // Verificar se contém as mensagens corretas
  const hasCargoNaoInformado = htmlCLT.includes('Cargo não informado')
  const hasNaoInformado = htmlCLT.includes('Não informado')
  const hasBasesCalculo = htmlCLT.includes('Bases de Cálculo')
  
  console.log(`   ✅ Contém "Cargo não informado": ${hasCargoNaoInformado}`)
  console.log(`   ✅ Contém "Não informado": ${hasNaoInformado}`)
  console.log(`   ✅ Mostra Bases de Cálculo (CLT): ${hasBasesCalculo}`)
  
  if (!hasUndefined && !hasCargoNaoDefinido && !hasMatUndefined && !hasCodigoUndefined) {
    console.log('   ✅ TESTE 1 PASSOU: Nenhum campo "undefined" encontrado!')
  } else {
    console.log('   ❌ TESTE 1 FALHOU: Ainda há campos "undefined"')
  }
} catch (error) {
  console.log(`   ❌ ERRO no Teste 1: ${error}`)
}

console.log('\n' + '='.repeat(60) + '\n')

// Teste 2: Funcionário PJ (não deve mostrar bases de cálculo)
console.log('📋 Teste 2: Funcionário PJ (sem bases de cálculo)')
try {
  const htmlPJ = gerarHoleriteHTML(mockHolerite, mockFuncionarioPJ, mockEmpresa)
  
  // Verificar se não há "undefined" no HTML
  const hasUndefined = htmlPJ.includes('undefined')
  const hasBasesCalculo = htmlPJ.includes('Bases de Cálculo')
  
  console.log(`   ❌ Contém "undefined": ${hasUndefined}`)
  console.log(`   ❌ Mostra Bases de Cálculo (PJ): ${hasBasesCalculo}`)
  
  if (!hasUndefined && !hasBasesCalculo) {
    console.log('   ✅ TESTE 2 PASSOU: PJ sem "undefined" e sem bases de cálculo!')
  } else {
    console.log('   ❌ TESTE 2 FALHOU: PJ ainda tem problemas')
  }
} catch (error) {
  console.log(`   ❌ ERRO no Teste 2: ${error}`)
}

console.log('\n' + '='.repeat(60) + '\n')

// Teste 3: Adiantamento (não deve mostrar bases de cálculo)
console.log('📋 Teste 3: Adiantamento (sem bases de cálculo)')
const mockAdiantamento = {
  ...mockHolerite,
  periodo_inicio: '2026-01-15', // Dia 15 = adiantamento
  periodo_fim: '2026-01-31',
  salario_base: 1500, // Metade do salário
  inss: 0, // Sem descontos no adiantamento
  irrf: 0
}

try {
  const htmlAdiantamento = gerarHoleriteHTML(mockAdiantamento, mockFuncionarioCLT, mockEmpresa)
  
  const hasUndefined = htmlAdiantamento.includes('undefined')
  const hasBasesCalculo = htmlAdiantamento.includes('Bases de Cálculo')
  const isAdiantamento = htmlAdiantamento.includes('Adiantamento Salarial')
  
  console.log(`   ❌ Contém "undefined": ${hasUndefined}`)
  console.log(`   ❌ Mostra Bases de Cálculo (Adiantamento): ${hasBasesCalculo}`)
  console.log(`   ✅ É identificado como Adiantamento: ${isAdiantamento}`)
  
  if (!hasUndefined && !hasBasesCalculo && isAdiantamento) {
    console.log('   ✅ TESTE 3 PASSOU: Adiantamento sem "undefined" e sem bases!')
  } else {
    console.log('   ❌ TESTE 3 FALHOU: Adiantamento ainda tem problemas')
  }
} catch (error) {
  console.log(`   ❌ ERRO no Teste 3: ${error}`)
}

console.log('\n' + '='.repeat(60))
console.log('🎯 RESUMO DOS TESTES:')
console.log('   - Teste 1: Campos undefined corrigidos')
console.log('   - Teste 2: PJ sem bases de cálculo')
console.log('   - Teste 3: Adiantamento sem bases de cálculo')
console.log('='.repeat(60))