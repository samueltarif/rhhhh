#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function criarHoleriteFuncionario129() {
  console.log('🧪 Criando holerite para funcionário ID 129...\n')

  try {
    // 1. Verificar se funcionário 129 existe
    console.log('1️⃣ Verificando funcionário ID 129...')
    
    const { data: funcionario, error: errorFunc } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', 129)
      .single()

    if (errorFunc || !funcionario) {
      console.log('❌ Funcionário 129 não encontrado:', errorFunc?.message)
      return
    }

    console.log(`✅ Funcionário encontrado: ${funcionario.nome_completo}`)
    console.log(`   Salário: R$ ${funcionario.salario_base || 0}`)

    // 2. Criar holerite para janeiro 2026
    console.log('\n2️⃣ Criando holerite para janeiro 2026...')
    
    const salarioBase = funcionario.salario_base || 2500.00
    
    const holerite = {
      funcionario_id: 129,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: salarioBase,
      bonus: 200.00,
      horas_extras: 150.00,
      inss: Math.round(salarioBase * 0.08),
      irrf: salarioBase > 2000 ? Math.round(salarioBase * 0.075) : 0,
      vale_transporte: Math.round(salarioBase * 0.06),
      cesta_basica_desconto: 0.00,
      plano_saude: 80.00,
      status: 'gerado',
      horas_trabalhadas: 176,
      data_pagamento: '2026-01-31'
    }

    const { data: holeriteInserido, error: errorHolerite } = await supabase
      .from('holerites')
      .insert([holerite])
      .select()

    if (errorHolerite) {
      console.log('❌ Erro ao criar holerite:', errorHolerite.message)
      return
    }

    console.log('✅ Holerite criado com sucesso!')
    console.log(`   ID: ${holeriteInserido[0].id}`)
    console.log(`   💚 Proventos: R$ ${holeriteInserido[0].total_proventos}`)
    console.log(`   🔴 Descontos: R$ ${holeriteInserido[0].total_descontos}`)
    console.log(`   💙 Líquido: R$ ${holeriteInserido[0].salario_liquido}`)

    // 3. Criar mais holerites (dezembro 2025 e fevereiro 2026)
    console.log('\n3️⃣ Criando holerites adicionais...')
    
    const holerites = [
      {
        funcionario_id: 129,
        periodo_inicio: '2025-12-01',
        periodo_fim: '2025-12-31',
        salario_base: salarioBase,
        bonus: 500.00,
        inss: Math.round(salarioBase * 0.08),
        irrf: salarioBase > 2000 ? Math.round(salarioBase * 0.075) : 0,
        vale_transporte: Math.round(salarioBase * 0.06),
        cesta_basica_desconto: 0.00,
        status: 'gerado',
        horas_trabalhadas: 184,
        data_pagamento: '2025-12-31'
      },
      {
        funcionario_id: 129,
        periodo_inicio: '2026-02-01',
        periodo_fim: '2026-02-28',
        salario_base: salarioBase,
        inss: Math.round(salarioBase * 0.08),
        irrf: salarioBase > 2000 ? Math.round(salarioBase * 0.075) : 0,
        vale_transporte: Math.round(salarioBase * 0.06),
        cesta_basica_desconto: 0.00,
        status: 'gerado',
        horas_trabalhadas: 160,
        data_pagamento: '2026-02-28'
      }
    ]

    const { data: holeritesInseridos, error: errorMultiplos } = await supabase
      .from('holerites')
      .insert(holerites)
      .select()

    if (errorMultiplos) {
      console.log('❌ Erro ao criar holerites adicionais:', errorMultiplos.message)
    } else {
      console.log(`✅ ${holeritesInseridos.length} holerites adicionais criados!`)
    }

    // 4. Verificar total de holerites do funcionário
    console.log('\n4️⃣ Verificando holerites do funcionário 129...')
    
    const { data: todosHolerites, error: errorTodos } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', 129)
      .order('periodo_inicio', { ascending: false })

    if (errorTodos) {
      console.log('❌ Erro ao buscar holerites:', errorTodos.message)
    } else {
      console.log(`✅ Total de holerites: ${todosHolerites.length}`)
      
      todosHolerites.forEach(h => {
        console.log(`   - ${h.periodo_inicio} a ${h.periodo_fim} | Líquido: R$ ${h.salario_liquido}`)
      })
    }

    console.log('\n🎉 HOLERITES CRIADOS COM SUCESSO!')
    console.log('💡 Agora o funcionário 129 deve ver seus holerites na página /holerites')

  } catch (error) {
    console.log('❌ Erro:', error.message)
  }
}

criarHoleriteFuncionario129()
