#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarColunasDetalhadas() {
  console.log('🔍 Verificando colunas detalhadas das tabelas de holerites...\n')

  try {
    // 1. Verificar colunas da tabela holerites
    console.log('1️⃣ Verificando colunas da tabela HOLERITES...')
    await descobrirColunas('holerites')

    // 2. Verificar colunas da tabela holerite_itens_personalizados
    console.log('\n2️⃣ Verificando colunas da tabela HOLERITE_ITENS_PERSONALIZADOS...')
    await descobrirColunas('holerite_itens_personalizados')

    // 3. Verificar colunas da tabela configuracoes_holerites
    console.log('\n3️⃣ Verificando colunas da tabela CONFIGURACOES_HOLERITES...')
    await descobrirColunas('configuracoes_holerites')

    // 4. Testar inserções com estrutura correta
    console.log('\n4️⃣ Testando inserções com estrutura correta...')
    await testarInsercoesCorretas()

    console.log('\n🎉 Verificação detalhada completa!')

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

async function descobrirColunas(nomeTabela) {
  try {
    // Tentar inserir um objeto vazio para descobrir quais campos são obrigatórios
    console.log(`🔍 Descobrindo estrutura de ${nomeTabela}...`)
    
    const { data, error } = await supabase
      .from(nomeTabela)
      .insert([{}])
      .select()

    if (error) {
      console.log(`❌ Erro esperado ao inserir objeto vazio:`)
      console.log(`   Mensagem: ${error.message}`)
      
      // Analisar a mensagem de erro para descobrir campos obrigatórios
      if (error.message.includes('null value in column')) {
        const match = error.message.match(/null value in column "([^"]+)"/);
        if (match) {
          console.log(`   ⚠️ Campo obrigatório encontrado: ${match[1]}`)
        }
      }
      
      if (error.message.includes('violates not-null constraint')) {
        console.log(`   💡 Existem campos NOT NULL que precisam ser preenchidos`)
      }
    } else {
      console.log(`✅ Inserção vazia bem-sucedida (campos opcionais)`)
      if (data && data.length > 0) {
        console.log(`📋 Estrutura descoberta:`)
        Object.keys(data[0]).forEach(key => {
          console.log(`   - ${key}: ${typeof data[0][key]} (${data[0][key]})`)
        })
        
        // Remover o registro de teste
        await supabase
          .from(nomeTabela)
          .delete()
          .eq('id', data[0].id)
      }
    }

    // Tentar descobrir mais campos fazendo uma query
    console.log(`🔍 Tentando descobrir campos via SELECT...`)
    
    const { data: selectData, error: selectError } = await supabase
      .from(nomeTabela)
      .select('*')
      .limit(1)

    if (selectError) {
      console.log(`❌ Erro no SELECT: ${selectError.message}`)
    } else {
      if (selectData && selectData.length > 0) {
        console.log(`📋 Campos encontrados via SELECT (com dados):`)
        Object.keys(selectData[0]).forEach(key => {
          console.log(`   - ${key}: ${typeof selectData[0][key]}`)
        })
      } else {
        console.log(`📋 Tabela vazia, tentando descobrir via metadata...`)
        
        // Tentar uma inserção com campos comuns para descobrir a estrutura
        await tentarInsercaoComCamposComuns(nomeTabela)
      }
    }

  } catch (error) {
    console.log(`❌ Erro ao descobrir colunas de ${nomeTabela}:`, error.message)
  }
}

async function tentarInsercaoComCamposComuns(nomeTabela) {
  const camposComuns = {
    holerites: {
      funcionario_id: 1,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: 2000.00,
      status: 'gerado'
    },
    holerite_itens_personalizados: {
      funcionario_id: 1,
      tipo: 'desconto',
      descricao: 'Teste',
      valor: 100.00,
      ativo: true,
      vigencia_tipo: 'permanente', // Campo que estava faltando
      vigencia_inicio: '2026-01-01'
    },
    configuracoes_holerites: {
      empresa_id: 1,
      mostrar_logo: true,
      mostrar_assinatura: true
    }
  }

  const campos = camposComuns[nomeTabela]
  if (!campos) {
    console.log(`⚠️ Não há campos comuns definidos para ${nomeTabela}`)
    return
  }

  console.log(`🧪 Tentando inserção com campos comuns para ${nomeTabela}...`)
  
  const { data, error } = await supabase
    .from(nomeTabela)
    .insert([campos])
    .select()

  if (error) {
    console.log(`❌ Erro na inserção com campos comuns:`)
    console.log(`   ${error.message}`)
    
    // Se ainda há erro de campo obrigatório, tentar descobrir qual
    if (error.message.includes('null value in column')) {
      const match = error.message.match(/null value in column "([^"]+)"/);
      if (match) {
        console.log(`   ⚠️ Campo obrigatório adicional: ${match[1]}`)
      }
    }
  } else {
    console.log(`✅ Inserção com campos comuns bem-sucedida!`)
    if (data && data.length > 0) {
      console.log(`📋 Estrutura completa descoberta:`)
      Object.keys(data[0]).forEach(key => {
        const valor = data[0][key]
        const tipo = typeof valor
        console.log(`   - ${key}: ${tipo} = ${valor}`)
      })
      
      // Remover o registro de teste
      await supabase
        .from(nomeTabela)
        .delete()
        .eq('id', data[0].id)
      
      console.log(`🗑️ Registro de teste removido`)
    }
  }
}

async function testarInsercoesCorretas() {
  console.log('🧪 Testando inserções com estrutura correta...')
  
  // Teste para holerites
  console.log('\n📄 Testando holerite completo...')
  const holeriteCompleto = {
    funcionario_id: 1,
    periodo_inicio: '2026-01-01',
    periodo_fim: '2026-01-31',
    salario_base: 2500.00,
    bonus: 300.00,
    horas_extras: 150.00,
    inss: 200.00,
    irrf: 50.00,
    vale_transporte: 120.00,
    cesta_basica_desconto: 0.00, // Usando cesta_basica_desconto ao invés de vale_refeicao_desconto
    status: 'gerado',
    horas_trabalhadas: 176,
    data_pagamento: '2026-01-31'
  }

  const { data: holeriteData, error: holeriteError } = await supabase
    .from('holerites')
    .insert([holeriteCompleto])
    .select()

  if (holeriteError) {
    console.log('❌ Erro ao inserir holerite completo:', holeriteError.message)
  } else {
    console.log('✅ Holerite completo inserido com sucesso!')
    console.log(`📊 Valores calculados:`)
    console.log(`   - Total Proventos: R$ ${holeriteData[0].total_proventos}`)
    console.log(`   - Total Descontos: R$ ${holeriteData[0].total_descontos}`)
    console.log(`   - Salário Líquido: R$ ${holeriteData[0].salario_liquido}`)
    
    // Remover
    await supabase.from('holerites').delete().eq('id', holeriteData[0].id)
    console.log('🗑️ Holerite de teste removido')
  }

  // Teste para item personalizado
  console.log('\n📝 Testando item personalizado completo...')
  const itemCompleto = {
    funcionario_id: 1,
    tipo: 'desconto',
    descricao: 'Empréstimo Consignado',
    valor: 250.00,
    ativo: true,
    vigencia_tipo: 'temporario',
    vigencia_inicio: '2026-01-01',
    vigencia_fim: '2026-12-31',
    parcelas_total: 12,
    parcelas_pagas: 0
  }

  const { data: itemData, error: itemError } = await supabase
    .from('holerite_itens_personalizados')
    .insert([itemCompleto])
    .select()

  if (itemError) {
    console.log('❌ Erro ao inserir item personalizado:', itemError.message)
  } else {
    console.log('✅ Item personalizado inserido com sucesso!')
    console.log(`📋 ID: ${itemData[0].id}`)
    
    // Remover
    await supabase.from('holerite_itens_personalizados').delete().eq('id', itemData[0].id)
    console.log('🗑️ Item de teste removido')
  }

  // Teste para configuração
  console.log('\n⚙️ Testando configuração completa...')
  const configCompleta = {
    empresa_id: 1,
    mostrar_logo: true,
    mostrar_assinatura: true,
    texto_cabecalho: 'HOLERITE - DEMONSTRATIVO DE PAGAMENTO',
    texto_rodape: 'Este documento é válido como comprovante de rendimentos.'
  }

  const { data: configData, error: configError } = await supabase
    .from('configuracoes_holerites')
    .insert([configCompleta])
    .select()

  if (configError) {
    console.log('❌ Erro ao inserir configuração:', configError.message)
  } else {
    console.log('✅ Configuração inserida com sucesso!')
    console.log(`📋 ID: ${configData[0].id}`)
    
    // Remover
    await supabase.from('configuracoes_holerites').delete().eq('id', configData[0].id)
    console.log('🗑️ Configuração de teste removida')
  }
}

// Executar verificação
verificarColunasDetalhadas()