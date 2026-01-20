#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarEstruturaReal() {
  console.log('🔍 VERIFICANDO ESTRUTURA REAL DA TABELA HOLERITES\n')

  try {
    // Criar um holerite de teste com campos mínimos para descobrir a estrutura
    console.log('1️⃣ Criando holerite de teste para descobrir estrutura...')
    
    const { data: holerite, error } = await supabase
      .from('holerites')
      .insert({
        funcionario_id: 129,
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-31'
      })
      .select()
      .single()

    if (error) {
      console.log('❌ Erro ao criar holerite teste:', error.message)
      return
    }

    console.log('✅ Holerite teste criado com sucesso!')
    console.log(`   ID: ${holerite.id}`)

    // Listar todos os campos
    console.log('\n2️⃣ Campos disponíveis na tabela holerites:')
    const campos = Object.keys(holerite)
    campos.forEach((campo, index) => {
      const valor = holerite[campo]
      const tipo = typeof valor
      console.log(`   ${index + 1}. ${campo}: ${valor} (${tipo})`)
    })

    // Verificar campos específicos que podem estar causando problema
    console.log('\n3️⃣ Verificando campos específicos:')
    const camposProblematicos = [
      'ajuda_custo',
      'emprestimo_consignado', 
      'seguro_vida_desconto',
      'plano_odonto_desconto',
      'pensao_alimenticia'
    ]

    camposProblematicos.forEach(campo => {
      const existe = campos.includes(campo)
      console.log(`   ${existe ? '✅' : '❌'} ${campo}`)
    })

    // Salvar estrutura em arquivo
    const fs = await import('fs')
    const estrutura = {
      campos: campos,
      exemplo: holerite,
      timestamp: new Date().toISOString()
    }
    fs.writeFileSync('estrutura-real-holerites.json', JSON.stringify(estrutura, null, 2))
    console.log('\n💾 Estrutura salva em: estrutura-real-holerites.json')

    // Remover holerite teste
    await supabase.from('holerites').delete().eq('id', holerite.id)
    console.log('🗑️ Holerite teste removido')

    // Criar lista de campos seguros para inserção
    console.log('\n4️⃣ Campos seguros para inserção:')
    const camposEssenciais = [
      'funcionario_id', 'periodo_inicio', 'periodo_fim', 'data_pagamento',
      'salario_base', 'bonus', 'horas_extras', 'adicional_noturno',
      'adicional_periculosidade', 'adicional_insalubridade', 'comissoes',
      'inss', 'base_inss', 'aliquota_inss', 'irrf', 'base_irrf', 'aliquota_irrf',
      'vale_transporte', 'cesta_basica_desconto', 'plano_saude', 'plano_odontologico',
      'adiantamento', 'faltas', 'outros_descontos', 'status', 'observacoes'
    ]

    const camposSegurosFinal = camposEssenciais.filter(campo => campos.includes(campo))
    console.log('✅ Campos que existem e são seguros:')
    camposSegurosFinal.forEach(campo => {
      console.log(`   - ${campo}`)
    })

    console.log('\n❌ Campos que NÃO existem (remover do código):')
    camposEssenciais.filter(campo => !campos.includes(campo)).forEach(campo => {
      console.log(`   - ${campo}`)
    })

    console.log('\n🎯 RESUMO:')
    console.log(`✅ Total de campos na tabela: ${campos.length}`)
    console.log(`✅ Campos seguros para inserção: ${camposSegurosFinal.length}`)
    console.log('📄 Estrutura completa salva no arquivo JSON')

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

verificarEstruturaReal()