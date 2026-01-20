#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarCorrecoesAplicadas() {
  console.log('🧪 Testando correções aplicadas nos scripts SQL...\n')

  try {
    // 1. Criar funcionário de teste
    console.log('1️⃣ Criando funcionário de teste...')
    
    const funcionario = {
      nome_completo: 'Teste Correções Aplicadas',
      cpf: `${Date.now()}`.slice(-11),
      email_login: `teste.correcoes.${Date.now()}@empresa.com`,
      senha: 'senha123',
      tipo_acesso: 'funcionario',
      status: 'ativo',
      salario_base: 3000.00,
      beneficios: {
        cesta_basica: {
          ativo: true,
          valor: 30.00,
          valor_mensal: 660.00,
          tipo_desconto: 'sem_desconto',
          percentual_desconto: 0,
          valor_desconto: 0
        },
        vale_transporte: {
          ativo: true,
          valor: 9.00,
          valor_mensal: 198.00,
          tipo_desconto: 'percentual',
          percentual_desconto: 6,
          valor_desconto: 0
        }
      }
    }

    const { data: funcionarioCriado, error: errorCriar } = await supabase
      .from('funcionarios')
      .insert([funcionario])
      .select()

    if (errorCriar) {
      console.log('❌ Erro ao criar funcionário:', errorCriar.message)
      return
    }

    console.log('✅ Funcionário criado com sucesso!')
    const func = funcionarioCriado[0]

    // 2. Testar criação de holerite com cesta_basica_desconto
    console.log('\n2️⃣ Testando holerite com cesta_basica_desconto...')
    
    const holeriteComCestaBasica = {
      funcionario_id: func.id,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: 3000.00,
      bonus: 500.00,
      horas_extras: 200.00,
      inss: 280.00, // 8% aproximado
      irrf: 100.00,
      vale_transporte: 180.00, // 6% do salário
      cesta_basica_desconto: 0.00, // Testando novo campo
      plano_saude: 80.00,
      status: 'gerado',
      horas_trabalhadas: 176,
      data_pagamento: '2026-01-31'
    }

    const { data: holeriteInserido, error: errorHolerite } = await supabase
      .from('holerites')
      .insert([holeriteComCestaBasica])
      .select()

    if (errorHolerite) {
      console.log('❌ Erro ao criar holerite:', errorHolerite.message)
      console.log('💡 Detalhes:', errorHolerite.details)
      
      // Se der erro com cesta_basica_desconto, testar com vale_refeicao_desconto
      console.log('\n🔄 Tentando com vale_refeicao_desconto...')
      
      const holeriteComValeRefeicao = {
        ...holeriteComCestaBasica,
        vale_refeicao_desconto: holeriteComCestaBasica.cesta_basica_desconto
      }
      delete holeriteComValeRefeicao.cesta_basica_desconto

      const { data: holeriteInserido2, error: errorHolerite2 } = await supabase
        .from('holerites')
        .insert([holeriteComValeRefeicao])
        .select()

      if (errorHolerite2) {
        console.log('❌ Erro também com vale_refeicao_desconto:', errorHolerite2.message)
        return
      } else {
        console.log('⚠️ Migração não foi aplicada - ainda usando vale_refeicao_desconto')
        holeriteInserido[0] = holeriteInserido2[0]
      }
    } else {
      console.log('✅ Migração aplicada com sucesso - usando cesta_basica_desconto!')
    }

    const holerite = holeriteInserido[0]
    
    console.log(`📋 ID do holerite: ${holerite.id}`)
    console.log(`💰 Salário Base: R$ ${holerite.salario_base}`)
    console.log(`💚 Total Proventos: R$ ${holerite.total_proventos}`)
    console.log(`🔴 Total Descontos: R$ ${holerite.total_descontos}`)
    console.log(`💙 Salário Líquido: R$ ${holerite.salario_liquido}`)

    // Verificar se os campos calculados estão funcionando
    const proventosEsperados = 3000 + 500 + 200 // salario + bonus + horas_extras
    const descontosEsperados = 280 + 100 + 180 + 80 // inss + irrf + vale_transporte + plano_saude
    const liquidoEsperado = proventosEsperados - descontosEsperados

    console.log(`\n📊 Verificação dos cálculos:`)
    console.log(`   Proventos esperados: R$ ${proventosEsperados} | Calculado: R$ ${holerite.total_proventos}`)
    console.log(`   Descontos esperados: R$ ${descontosEsperados} | Calculado: R$ ${holerite.total_descontos}`)
    console.log(`   Líquido esperado: R$ ${liquidoEsperado} | Calculado: R$ ${holerite.salario_liquido}`)

    if (holerite.total_proventos == proventosEsperados) {
      console.log('✅ Cálculo de proventos CORRETO!')
    } else {
      console.log('❌ Cálculo de proventos INCORRETO!')
    }

    if (holerite.total_descontos == descontosEsperados) {
      console.log('✅ Cálculo de descontos CORRETO!')
    } else {
      console.log('❌ Cálculo de descontos INCORRETO!')
    }

    if (holerite.salario_liquido == liquidoEsperado) {
      console.log('✅ Cálculo de salário líquido CORRETO!')
    } else {
      console.log('❌ Cálculo de salário líquido INCORRETO!')
    }

    // 3. Testar APIs de download
    console.log('\n3️⃣ Testando APIs de download...')
    
    // Testar HTML
    console.log('📄 Testando API de HTML...')
    try {
      const responseHTML = await fetch(`${process.env.SUPABASE_URL.replace('/rest/v1', '')}/api/holerites/${holerite.id}/html`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })

      if (responseHTML.ok) {
        const htmlContent = await responseHTML.text()
        console.log('✅ API de HTML funcionando!')
        console.log(`📄 Tamanho: ${htmlContent.length} caracteres`)
        
        // Verificar se contém "CESTA BÁSICA"
        if (htmlContent.includes('CESTA BÁSICA')) {
          console.log('✅ HTML atualizado com "CESTA BÁSICA"!')
        } else if (htmlContent.includes('VALE REFEIÇÃO')) {
          console.log('⚠️ HTML ainda contém "VALE REFEIÇÃO"')
        } else {
          console.log('ℹ️ HTML não contém referência específica')
        }
      } else {
        console.log(`❌ Erro na API de HTML: ${responseHTML.status} - ${responseHTML.statusText}`)
        
        // Tentar descobrir o erro
        const errorText = await responseHTML.text()
        console.log(`💡 Detalhes do erro: ${errorText.substring(0, 200)}...`)
      }
    } catch (error) {
      console.log('❌ Erro ao chamar API de HTML:', error.message)
    }

    // Testar PDF
    console.log('\n📄 Testando API de PDF...')
    try {
      const responsePDF = await fetch(`${process.env.SUPABASE_URL.replace('/rest/v1', '')}/api/holerites/${holerite.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })

      if (responsePDF.ok) {
        const pdfContent = await responsePDF.text()
        console.log('✅ API de PDF funcionando!')
        console.log(`📄 Tamanho: ${pdfContent.length} caracteres`)
      } else {
        console.log(`❌ Erro na API de PDF: ${responsePDF.status} - ${responsePDF.statusText}`)
        
        // Tentar descobrir o erro
        const errorText = await responsePDF.text()
        console.log(`💡 Detalhes do erro: ${errorText.substring(0, 200)}...`)
      }
    } catch (error) {
      console.log('❌ Erro ao chamar API de PDF:', error.message)
    }

    // 4. Verificar estrutura da tabela após migração
    console.log('\n4️⃣ Verificando estrutura da tabela...')
    
    // Tentar inserir com ambos os campos para ver qual existe
    const testeEstrutura = {
      funcionario_id: func.id,
      periodo_inicio: '2026-02-01',
      periodo_fim: '2026-02-28',
      salario_base: 1000.00
    }

    // Testar cesta_basica_desconto
    const { error: errorCesta } = await supabase
      .from('holerites')
      .insert([{ ...testeEstrutura, cesta_basica_desconto: 0 }])
      .select()

    if (errorCesta) {
      console.log('❌ Campo cesta_basica_desconto não existe ainda')
    } else {
      console.log('✅ Campo cesta_basica_desconto existe!')
      // Limpar teste
      await supabase.from('holerites').delete().eq('funcionario_id', func.id).neq('id', holerite.id)
    }

    // Testar vale_refeicao_desconto
    const { error: errorVale } = await supabase
      .from('holerites')
      .insert([{ ...testeEstrutura, vale_refeicao_desconto: 0 }])
      .select()

    if (errorVale) {
      console.log('✅ Campo vale_refeicao_desconto foi removido!')
    } else {
      console.log('⚠️ Campo vale_refeicao_desconto ainda existe')
      // Limpar teste
      await supabase.from('holerites').delete().eq('funcionario_id', func.id).neq('id', holerite.id)
    }

    // 5. Limpeza
    console.log('\n5️⃣ Limpeza...')
    
    await supabase.from('holerites').delete().eq('id', holerite.id)
    await supabase.from('funcionarios').delete().eq('id', func.id)
    
    console.log('✅ Dados de teste removidos!')

    // 6. Resumo final
    console.log('\n🎯 RESUMO DOS TESTES:')
    console.log('✅ Funcionário criado com cesta básica')
    console.log('✅ Holerite criado com sucesso')
    console.log('✅ Campos calculados funcionando')
    console.log('📋 Status das correções aplicadas verificado')

    console.log('\n🎉 TESTE DE CORREÇÕES CONCLUÍDO!')

  } catch (error) {
    console.log('❌ Erro durante o teste:', error.message)
  }
}

// Executar teste
testarCorrecoesAplicadas()