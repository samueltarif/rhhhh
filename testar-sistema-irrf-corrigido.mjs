#!/usr/bin/env node

/**
 * TESTE PRÁTICO - SISTEMA IRRF CORRIGIDO
 * Valida a integração completa com casos reais
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ========================================
// CASOS DE TESTE PRÁTICOS
// ========================================

const casosTestePraticos = [
  {
    nome: 'Funcionário Isento',
    salario: 4000.00,
    dependentes: 2,
    pensao: 0,
    esperado: { irrf: 0.00, faixa: 'isencao' }
  },
  {
    nome: 'Funcionário Transição Inicial',
    salario: 6000.00,
    dependentes: 0,
    pensao: 0,
    esperado: { faixa: 'reducao_gradual' }
  },
  {
    nome: 'Funcionário Transição Final',
    salario: 8000.00,
    dependentes: 0,
    pensao: 0,
    esperado: { faixa: 'reducao_gradual' }
  },
  {
    nome: 'Funcionário Sem Redução',
    salario: 12000.00,
    dependentes: 0,
    pensao: 0,
    esperado: { faixa: 'sem_reducao' }
  }
]

// ========================================
// FUNÇÃO PARA TESTAR GERAÇÃO
// ========================================

async function testarGeracao(caso) {
  try {
    console.log(`\n🧪 Testando: ${caso.nome}`)
    console.log(`   Salário: R$ ${caso.salario.toFixed(2)}`)
    console.log(`   Dependentes: ${caso.dependentes}`)
    console.log(`   Pensão: R$ ${caso.pensao.toFixed(2)}`)
    
    // Criar funcionário temporário
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .insert({
        nome_completo: `Teste ${caso.nome}`,
        email: `teste${Date.now()}@teste.com`,
        cpf: `000.000.000-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        salario_base: caso.salario,
        numero_dependentes: caso.dependentes,
        pensao_alimenticia: caso.pensao,
        status: 'ativo',
        empresa_id: 1 // Assumindo empresa padrão
      })
      .select()
      .single()
    
    if (funcError) {
      console.log(`   ❌ Erro ao criar funcionário: ${funcError.message}`)
      return false
    }
    
    console.log(`   ✅ Funcionário criado: ID ${funcionario.id}`)
    
    // Gerar holerite
    const response = await fetch('http://localhost:3000/api/holerites/gerar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        funcionario_ids: [funcionario.id],
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-31',
        tipo: 'mensal',
        recriar: true
      })
    })
    
    if (!response.ok) {
      console.log(`   ❌ Erro na API: ${response.status}`)
      return false
    }
    
    const resultado = await response.json()
    
    if (!resultado.success) {
      console.log(`   ❌ Falha na geração: ${resultado.message}`)
      return false
    }
    
    // Buscar holerite gerado
    const { data: holerite, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', funcionario.id)
      .eq('periodo_inicio', '2026-01-01')
      .single()
    
    if (holeriteError) {
      console.log(`   ❌ Erro ao buscar holerite: ${holeriteError.message}`)
      return false
    }
    
    // Validar resultados
    console.log(`   📊 Resultados:`)
    console.log(`      Base IRRF: R$ ${holerite.base_irrf.toFixed(2)}`)
    console.log(`      IRRF: R$ ${holerite.irrf.toFixed(2)}`)
    console.log(`      Alíquota: ${holerite.aliquota_irrf}%`)
    
    // Determinar faixa
    let faixaCalculada = ''
    if (holerite.base_irrf <= 5000.00) {
      faixaCalculada = 'isencao'
    } else if (holerite.base_irrf <= 7350.00) {
      faixaCalculada = 'reducao_gradual'
    } else {
      faixaCalculada = 'sem_reducao'
    }
    
    console.log(`      Faixa: ${faixaCalculada}`)
    
    // Validar expectativas
    let passou = true
    
    if (caso.esperado.irrf !== undefined) {
      if (Math.abs(holerite.irrf - caso.esperado.irrf) > 0.01) {
        console.log(`   ❌ IRRF incorreto: esperado R$ ${caso.esperado.irrf.toFixed(2)}, obtido R$ ${holerite.irrf.toFixed(2)}`)
        passou = false
      }
    }
    
    if (caso.esperado.faixa !== faixaCalculada) {
      console.log(`   ❌ Faixa incorreta: esperado ${caso.esperado.faixa}, obtido ${faixaCalculada}`)
      passou = false
    }
    
    if (passou) {
      console.log(`   ✅ TESTE PASSOU`)
    }
    
    // Limpar funcionário temporário
    await supabase
      .from('funcionarios')
      .delete()
      .eq('id', funcionario.id)
    
    return passou
    
  } catch (error) {
    console.log(`   ❌ Erro no teste: ${error.message}`)
    return false
  }
}

// ========================================
// EXECUTAR TODOS OS TESTES
// ========================================

async function executarTestes() {
  console.log('🧪 TESTE PRÁTICO - SISTEMA IRRF CORRIGIDO')
  console.log('=' .repeat(60))
  
  let testesPassaram = 0
  let testesTotais = casosTestePraticos.length
  
  for (const caso of casosTestePraticos) {
    const passou = await testarGeracao(caso)
    if (passou) testesPassaram++
  }
  
  console.log('\n📊 RESUMO DOS TESTES PRÁTICOS')
  console.log('=' .repeat(60))
  console.log(`Testes executados: ${testesTotais}`)
  console.log(`Testes passaram: ${testesPassaram}`)
  console.log(`Taxa de sucesso: ${((testesPassaram / testesTotais) * 100).toFixed(1)}%`)
  
  if (testesPassaram === testesTotais) {
    console.log('\n🎉 TODOS OS TESTES PRÁTICOS PASSARAM!')
    console.log('✅ Sistema IRRF está funcionando corretamente')
  } else {
    console.log('\n⚠️  ALGUNS TESTES PRÁTICOS FALHARAM!')
    console.log('❌ Revisar integração do sistema')
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  executarTestes().catch(console.error)
}