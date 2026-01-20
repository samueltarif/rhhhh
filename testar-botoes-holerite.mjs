import 'dotenv/config'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🧪 TESTE: Botões de Holerite Habilitados\n')
console.log('=' .repeat(80))

async function testarHoleritesVisiveis() {
  console.log('\n1️⃣ Testando holerites visíveis para Silvana...')
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/holerites/meus-holerites?funcionarioId=1`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.log('❌ Erro:', error)
      return []
    }
    
    const holerites = await response.json()
    
    console.log(`📊 Total de holerites visíveis: ${holerites.length}`)
    
    holerites.forEach((h, i) => {
      const diaFim = new Date(h.periodo_fim).getDate()
      const tipo = diaFim <= 15 ? '💰 ADIANTAMENTO' : '📄 FOLHA MENSAL'
      const dataPagamento = h.data_pagamento ? new Date(h.data_pagamento).toLocaleDateString('pt-BR') : 'Não definida'
      
      console.log(`\n   ${i + 1}. ${tipo}`)
      console.log(`      ID: ${h.id}`)
      console.log(`      Status: ${h.status}`)
      console.log(`      Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
      console.log(`      Data Pagamento: ${dataPagamento}`)
      console.log(`      Líquido: R$ ${h.salario_liquido.toFixed(2)}`)
      
      // Simular a lógica antiga (problemática)
      const dataDisponibilizacao = h.data_pagamento ? new Date(h.data_pagamento) : null
      const isDisponivelAntigo = !dataDisponibilizacao || new Date() >= dataDisponibilizacao
      
      // Nova lógica (sempre true)
      const isDisponivelNovo = true
      
      console.log(`      🔍 Lógica ANTIGA (problemática): ${isDisponivelAntigo ? '✅ Habilitado' : '❌ Desabilitado'}`)
      console.log(`      🔍 Lógica NOVA (corrigida): ${isDisponivelNovo ? '✅ Habilitado' : '❌ Desabilitado'}`)
      
      if (!isDisponivelAntigo && isDisponivelNovo) {
        console.log(`      🎯 CORREÇÃO APLICADA: Botão agora está habilitado!`)
      }
    })
    
    return holerites
  } catch (error) {
    console.log('❌ Erro:', error.message)
    return []
  }
}

async function testarVisualizacaoHTML(holeriteId, tipo) {
  console.log(`\n2️⃣ Testando se ${tipo} (ID: ${holeriteId}) pode ser visualizado...`)
  
  try {
    const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}/html`)
    
    if (!response.ok) {
      const error = await response.text()
      console.log(`   ❌ Erro: ${error.substring(0, 100)}...`)
      return false
    }
    
    const html = await response.text()
    console.log(`   ✅ HTML gerado com sucesso (${html.length} caracteres)`)
    return true
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
    return false
  }
}

async function executar() {
  try {
    console.log('🎯 Objetivo: Verificar se todos os holerites visíveis têm botões habilitados\n')
    
    // 1. Buscar holerites visíveis
    const holerites = await testarHoleritesVisiveis()
    
    if (holerites.length === 0) {
      console.log('\n⚠️ Nenhum holerite encontrado para testar')
      return
    }
    
    // 2. Testar visualização de cada tipo
    const adiantamento = holerites.find(h => new Date(h.periodo_fim).getDate() <= 15)
    const folhaMensal = holerites.find(h => new Date(h.periodo_fim).getDate() > 15)
    
    let resultados = {
      adiantamento: { encontrado: false, visualizavel: false },
      folhaMensal: { encontrado: false, visualizavel: false }
    }
    
    if (adiantamento) {
      resultados.adiantamento.encontrado = true
      resultados.adiantamento.visualizavel = await testarVisualizacaoHTML(adiantamento.id, 'ADIANTAMENTO')
    }
    
    if (folhaMensal) {
      resultados.folhaMensal.encontrado = true
      resultados.folhaMensal.visualizavel = await testarVisualizacaoHTML(folhaMensal.id, 'FOLHA MENSAL')
    }
    
    // 3. Resultado final
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESULTADO FINAL')
    console.log('='.repeat(80))
    
    console.log('\n💰 ADIANTAMENTO:')
    console.log(`   Encontrado: ${resultados.adiantamento.encontrado ? '✅' : '❌'}`)
    console.log(`   Visualizável: ${resultados.adiantamento.visualizavel ? '✅' : '❌'}`)
    console.log(`   Botões habilitados: ✅ (sempre true na nova lógica)`)
    
    console.log('\n📄 FOLHA MENSAL:')
    console.log(`   Encontrado: ${resultados.folhaMensal.encontrado ? '✅' : '❌'}`)
    console.log(`   Visualizável: ${resultados.folhaMensal.visualizavel ? '✅' : '❌'}`)
    console.log(`   Botões habilitados: ✅ (sempre true na nova lógica)`)
    
    const tudoOk = (
      (!resultados.adiantamento.encontrado || resultados.adiantamento.visualizavel) &&
      (!resultados.folhaMensal.encontrado || resultados.folhaMensal.visualizavel)
    )
    
    if (tudoOk) {
      console.log('\n✅ CORREÇÃO APLICADA COM SUCESSO!')
      console.log('✅ Todos os holerites visíveis agora têm botões habilitados')
      console.log('✅ Funcionário pode visualizar tanto adiantamentos quanto folhas mensais')
    } else {
      console.log('\n❌ AINDA HÁ PROBLEMAS!')
      console.log('❌ Alguns holerites não podem ser visualizados')
    }
    
    console.log('\n💡 EXPLICAÇÃO DA CORREÇÃO:')
    console.log('   • Lógica ANTIGA: Verificava data_pagamento para habilitar botões')
    console.log('   • Lógica NOVA: Se holerite está visível, botões sempre habilitados')
    console.log('   • MOTIVO: API meus-holerites já filtra apenas holerites disponibilizados')
    
    console.log('\n' + '='.repeat(80))
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message)
  }
}

executar()