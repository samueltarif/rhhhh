#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function atualizarCamposCalculados() {
  console.log('🔧 ATUALIZANDO CAMPOS CALCULADOS DOS HOLERITES\n')

  try {
    // 1. Buscar todos os holerites
    console.log('1️⃣ Buscando holerites...')
    
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')

    if (holeriteError) {
      console.log('❌ Erro ao buscar holerites:', holeriteError.message)
      return
    }

    console.log(`✅ Encontrados ${holerites.length} holerites`)

    // 2. Atualizar cada holerite
    console.log('\n2️⃣ Atualizando campos calculados...')
    
    for (let i = 0; i < holerites.length; i++) {
      const holerite = holerites[i]
      
      console.log(`   ${i + 1}. Holerite ID ${holerite.id}...`)
      
      // Calcular proventos
      const totalProventos = 
        (holerite.salario_base || 0) +
        (holerite.bonus || 0) +
        (holerite.horas_extras || 0) +
        (holerite.adicional_noturno || 0) +
        (holerite.adicional_periculosidade || 0) +
        (holerite.adicional_insalubridade || 0) +
        (holerite.comissoes || 0)

      // Calcular descontos
      const totalDescontos = 
        (holerite.inss || 0) +
        (holerite.irrf || 0) +
        (holerite.vale_transporte || 0) +
        (holerite.cesta_basica_desconto || 0) +
        (holerite.plano_saude || 0) +
        (holerite.plano_odontologico || 0) +
        (holerite.adiantamento || 0) +
        (holerite.faltas || 0) +
        (holerite.outros_descontos || 0)

      // Calcular líquido
      const salarioLiquido = totalProventos - totalDescontos

      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('holerites')
        .update({
          total_proventos: totalProventos,
          total_descontos: totalDescontos,
          salario_liquido: salarioLiquido
        })
        .eq('id', holerite.id)

      if (updateError) {
        console.log(`      ❌ Erro: ${updateError.message}`)
      } else {
        console.log(`      ✅ Proventos: R$ ${totalProventos} | Descontos: R$ ${totalDescontos} | Líquido: R$ ${salarioLiquido}`)
      }
    }

    // 3. Verificar resultado
    console.log('\n3️⃣ Verificando resultado...')
    
    const { data: holeritesFinal, error: finalError } = await supabase
      .from('holerites')
      .select('id, funcionario_id, periodo_inicio, periodo_fim, salario_base, total_proventos, total_descontos, salario_liquido')
      .order('id', { ascending: false })
      .limit(5)

    if (finalError) {
      console.log('❌ Erro ao verificar resultado:', finalError.message)
    } else {
      console.log('✅ Últimos holerites atualizados:')
      holeritesFinal.forEach(h => {
        console.log(`   ID ${h.id}: Base R$ ${h.salario_base} | Proventos R$ ${h.total_proventos} | Descontos R$ ${h.total_descontos} | Líquido R$ ${h.salario_liquido}`)
      })
    }

    console.log('\n🎯 ATUALIZAÇÃO CONCLUÍDA!')
    console.log('✅ Campos calculados atualizados')
    console.log('✅ Agora você pode testar as APIs de download')

  } catch (error) {
    console.log('❌ Erro durante atualização:', error.message)
  }
}

atualizarCamposCalculados()