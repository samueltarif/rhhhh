#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarCriacaoSimples() {
  console.log('🧪 TESTE SIMPLES DE CRIAÇÃO DE HOLERITE\n')

  try {
    // 1. Buscar funcionário 129
    console.log('1️⃣ Buscando funcionário ID 129...')
    
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base')
      .eq('id', 129)
      .single()

    if (funcError || !funcionario) {
      console.log('❌ Funcionário 129 não encontrado:', funcError?.message)
      return
    }

    console.log(`✅ Funcionário: ${funcionario.nome_completo}`)
    console.log(`   Salário: R$ ${funcionario.salario_base}`)

    // 2. Criar holerite simples (sem campos calculados)
    console.log('\n2️⃣ Criando holerite simples...')
    
    const dadosHolerite = {
      funcionario_id: funcionario.id,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      data_pagamento: '2026-01-31',
      salario_base: funcionario.salario_base,
      inss: 600.00,
      irrf: 200.00,
      status: 'gerado',
      observacoes: 'Teste de criação simples'
    }

    const { data: holerite, error: holeriteError } = await supabase
      .from('holerites')
      .insert(dadosHolerite)
      .select()
      .single()

    if (holeriteError) {
      console.log('❌ Erro ao criar holerite:', holeriteError.message)
      return
    }

    console.log('✅ Holerite criado com sucesso!')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Funcionário: ${holerite.funcionario_id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base}`)
    console.log(`   INSS: R$ ${holerite.inss}`)
    console.log(`   IRRF: R$ ${holerite.irrf}`)
    
    // Verificar se os campos calculados foram preenchidos
    if (holerite.total_proventos !== null) {
      console.log(`   ✅ Total Proventos: R$ ${holerite.total_proventos}`)
    } else {
      console.log(`   ⚠️ Total Proventos: NULL (campo não calculado)`)
    }
    
    if (holerite.total_descontos !== null) {
      console.log(`   ✅ Total Descontos: R$ ${holerite.total_descontos}`)
    } else {
      console.log(`   ⚠️ Total Descontos: NULL (campo não calculado)`)
    }
    
    if (holerite.salario_liquido !== null) {
      console.log(`   ✅ Salário Líquido: R$ ${holerite.salario_liquido}`)
    } else {
      console.log(`   ⚠️ Salário Líquido: NULL (campo não calculado)`)
    }

    // 3. Testar API de geração
    console.log('\n3️⃣ Testando API de geração...')
    
    try {
      const response = await fetch('http://localhost:3000/api/holerites/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          periodo_inicio: '2026-02-01',
          periodo_fim: '2026-02-28',
          funcionario_ids: [129],
          tipo: 'mensal'
        })
      })

      if (response.ok) {
        const resultado = await response.json()
        console.log('✅ API de geração funcionando!')
        console.log(`   Holerites gerados: ${resultado.total_gerados}`)
        console.log(`   Erros: ${resultado.total_erros}`)
        
        if (resultado.erros && resultado.erros.length > 0) {
          console.log('   ❌ Detalhes dos erros:')
          resultado.erros.forEach(erro => {
            console.log(`      - ${erro.funcionario}: ${erro.erro}`)
          })
        }
      } else {
        const errorText = await response.text()
        console.log(`❌ API com erro: ${response.status}`)
        console.log(`   Detalhes: ${errorText.substring(0, 200)}`)
      }
    } catch (error) {
      console.log('❌ Erro ao testar API:', error.message)
      console.log('💡 Certifique-se de que o servidor está rodando: npm run dev')
    }

    // 4. Verificar holerites criados
    console.log('\n4️⃣ Verificando holerites do funcionário 129...')
    
    const { data: holerites, error: holeriteListError } = await supabase
      .from('holerites')
      .select('id, periodo_inicio, periodo_fim, salario_base, total_proventos, total_descontos, salario_liquido')
      .eq('funcionario_id', 129)
      .order('periodo_inicio', { ascending: false })

    if (holeriteListError) {
      console.log('❌ Erro ao buscar holerites:', holeriteListError.message)
    } else {
      console.log(`✅ Total de holerites: ${holerites.length}`)
      holerites.forEach((h, i) => {
        console.log(`   ${i + 1}. ID ${h.id} | ${h.periodo_inicio} a ${h.periodo_fim}`)
        console.log(`      Base: R$ ${h.salario_base} | Proventos: R$ ${h.total_proventos || 'NULL'} | Descontos: R$ ${h.total_descontos || 'NULL'} | Líquido: R$ ${h.salario_liquido || 'NULL'}`)
      })
    }

    console.log('\n🎯 TESTE CONCLUÍDO!')

  } catch (error) {
    console.log('❌ Erro durante teste:', error.message)
  }
}

testarCriacaoSimples()