#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarCampos() {
  console.log('🔍 VERIFICANDO CAMPOS DA TABELA HOLERITES\n')

  try {
    // Tentar inserir um registro vazio para ver quais campos são obrigatórios
    console.log('1️⃣ Testando inserção vazia para descobrir campos...')
    
    const { data, error } = await supabase
      .from('holerites')
      .insert({})
      .select()

    if (error) {
      console.log('❌ Erro esperado:', error.message)
      
      // Analisar a mensagem de erro para descobrir campos obrigatórios
      if (error.message.includes('null value in column')) {
        const match = error.message.match(/null value in column "([^"]+)"/);
        if (match) {
          console.log(`   Campo obrigatório encontrado: ${match[1]}`)
        }
      }
    }

    // Tentar com campos básicos
    console.log('\n2️⃣ Testando com campos básicos...')
    
    const dadosBasicos = {
      funcionario_id: 129,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31'
    }

    const { data: teste1, error: error1 } = await supabase
      .from('holerites')
      .insert(dadosBasicos)
      .select()

    if (error1) {
      console.log('❌ Erro com campos básicos:', error1.message)
    } else {
      console.log('✅ Inserção com campos básicos funcionou!')
      console.log('   Campos preenchidos automaticamente:')
      Object.keys(teste1[0]).forEach(campo => {
        console.log(`   - ${campo}: ${teste1[0][campo]}`)
      })
      
      // Remover o teste
      await supabase.from('holerites').delete().eq('id', teste1[0].id)
      console.log('   🗑️ Registro de teste removido')
    }

    // Tentar descobrir estrutura via schema
    console.log('\n3️⃣ Tentando descobrir estrutura via schema...')
    
    // Método alternativo: tentar inserir com todos os campos possíveis
    const camposPossiveis = {
      funcionario_id: 129,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      data_pagamento: '2026-01-31',
      salario_base: 6000.00,
      horas_extras: 0,
      adicional_noturno: 0,
      adicional_periculosidade: 0,
      adicional_insalubridade: 0,
      comissoes: 0,
      bonus: 0,
      ajuda_custo: 0,
      outros_proventos: 0,
      inss: 600.00,
      base_inss: 6000.00,
      aliquota_inss: 10.0,
      irrf: 200.00,
      base_irrf: 5400.00,
      aliquota_irrf: 3.7,
      fgts: 480.00,
      vale_transporte_desconto: 0,
      cesta_basica_desconto: 0,
      plano_saude_desconto: 0,
      plano_odonto_desconto: 0,
      seguro_vida_desconto: 0,
      pensao_alimenticia: 0,
      emprestimo_consignado: 0,
      adiantamento_salarial: 0,
      outros_descontos: 0,
      status: 'gerado',
      observacoes: 'Teste de estrutura'
    }

    const { data: teste2, error: error2 } = await supabase
      .from('holerites')
      .insert(camposPossiveis)
      .select()

    if (error2) {
      console.log('❌ Erro com campos completos:', error2.message)
      
      // Tentar identificar campo problemático
      if (error2.message.includes('column') && error2.message.includes('does not exist')) {
        const match = error2.message.match(/column "([^"]+)" of relation/);
        if (match) {
          console.log(`   ❌ Campo inexistente: ${match[1]}`)
        }
      }
    } else {
      console.log('✅ Inserção com campos completos funcionou!')
      console.log(`   ID criado: ${teste2[0].id}`)
      console.log('   Campos calculados:')
      console.log(`   - total_proventos: ${teste2[0].total_proventos}`)
      console.log(`   - total_descontos: ${teste2[0].total_descontos}`)
      console.log(`   - salario_liquido: ${teste2[0].salario_liquido}`)
      
      // Remover o teste
      await supabase.from('holerites').delete().eq('id', teste2[0].id)
      console.log('   🗑️ Registro de teste removido')
    }

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

verificarCampos()