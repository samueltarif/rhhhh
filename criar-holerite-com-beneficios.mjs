#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function criarHoleriteComBeneficios() {
  console.log('🧪 CRIANDO HOLERITE COM BENEFÍCIOS PARA TESTE\n')

  try {
    // 1. Criar holerite com benefícios
    console.log('1️⃣ Criando holerite com benefícios...')
    
    const dadosHolerite = {
      funcionario_id: 129,
      periodo_inicio: '2026-03-01',
      periodo_fim: '2026-03-31',
      data_pagamento: '2026-03-31',
      
      // Proventos
      salario_base: 6000.00,
      bonus: 500.00,
      
      // Descontos
      inss: 600.00,
      irrf: 200.00,
      vale_transporte: 150.00,
      cesta_basica_desconto: 25.00,
      plano_saude: 100.00,
      
      // Benefícios JSONB
      beneficios: [
        {
          tipo: 'Vale Transporte',
          valor: 300.00,
          desconto: 150.00
        },
        {
          tipo: 'Cesta Básica',
          valor: 550.00,
          desconto: 25.00
        },
        {
          tipo: 'Plano de Saúde',
          valor: 200.00,
          desconto: 100.00
        }
      ],
      
      // Descontos personalizados JSONB
      descontos_personalizados: [
        {
          tipo: 'Empréstimo Consignado',
          valor: 300.00
        }
      ],
      
      status: 'gerado',
      observacoes: 'Holerite de teste com benefícios completos'
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

    // 2. Atualizar campos calculados
    console.log('\n2️⃣ Calculando totais...')
    
    const totalProventos = 
      (holerite.salario_base || 0) +
      (holerite.bonus || 0) +
      550.00 + 300.00 + 200.00 // Benefícios

    const totalDescontos = 
      (holerite.inss || 0) +
      (holerite.irrf || 0) +
      (holerite.vale_transporte || 0) +
      (holerite.cesta_basica_desconto || 0) +
      (holerite.plano_saude || 0) +
      300.00 // Empréstimo consignado

    const salarioLiquido = totalProventos - totalDescontos

    const { error: updateError } = await supabase
      .from('holerites')
      .update({
        total_proventos: totalProventos,
        total_descontos: totalDescontos,
        salario_liquido: salarioLiquido
      })
      .eq('id', holerite.id)

    if (updateError) {
      console.log('❌ Erro ao atualizar totais:', updateError.message)
    } else {
      console.log('✅ Totais calculados:')
      console.log(`   💚 Total Proventos: R$ ${totalProventos.toFixed(2)}`)
      console.log(`   🔴 Total Descontos: R$ ${totalDescontos.toFixed(2)}`)
      console.log(`   💙 Salário Líquido: R$ ${salarioLiquido.toFixed(2)}`)
    }

    // 3. Testar download HTML
    console.log('\n3️⃣ Testando download HTML...')
    
    try {
      const response = await fetch(`http://localhost:3000/api/holerites/${holerite.id}/html`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })

      if (response.ok) {
        const htmlContent = await response.text()
        console.log(`✅ HTML gerado com sucesso! (${htmlContent.length} caracteres)`)
        
        // Verificar conteúdo
        const temCestaBasica = htmlContent.includes('CESTA BÁSICA')
        const temValeTransporte = htmlContent.includes('VALE TRANSPORTE')
        const temPlanoSaude = htmlContent.includes('PLANO DE SAÚDE')
        const temEmprestimo = htmlContent.includes('EMPRÉSTIMO CONSIGNADO')
        
        console.log('\n📋 Verificação de conteúdo:')
        console.log(`   ${temCestaBasica ? '✅' : '❌'} Cesta Básica`)
        console.log(`   ${temValeTransporte ? '✅' : '❌'} Vale Transporte`)
        console.log(`   ${temPlanoSaude ? '✅' : '❌'} Plano de Saúde`)
        console.log(`   ${temEmprestimo ? '✅' : '❌'} Empréstimo Consignado`)
        
        // Salvar HTML
        const fs = await import('fs')
        fs.writeFileSync(`holerite-${holerite.id}-completo.html`, htmlContent)
        console.log(`   💾 HTML salvo: holerite-${holerite.id}-completo.html`)
        
        if (temCestaBasica && temValeTransporte && temPlanoSaude) {
          console.log('\n🎉 SUCESSO TOTAL!')
          console.log('✅ Todos os benefícios estão aparecendo no HTML!')
          console.log('✅ Sistema de Cesta Básica funcionando perfeitamente!')
        }
      } else {
        console.log(`❌ Erro no download HTML: ${response.status}`)
      }
    } catch (error) {
      console.log('❌ Erro ao testar HTML:', error.message)
    }

    // 4. Testar download PDF
    console.log('\n4️⃣ Testando download PDF...')
    
    try {
      const response = await fetch(`http://localhost:3000/api/holerites/${holerite.id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })

      if (response.ok) {
        const pdfBuffer = await response.arrayBuffer()
        console.log(`✅ PDF gerado com sucesso! (${pdfBuffer.byteLength} bytes)`)
      } else {
        console.log(`❌ Erro no download PDF: ${response.status}`)
      }
    } catch (error) {
      console.log('❌ Erro ao testar PDF:', error.message)
    }

    console.log('\n🎯 TESTE COMPLETO!')
    console.log(`✅ Holerite ID ${holerite.id} criado com benefícios`)
    console.log('✅ Agora você pode testar na interface web')
    console.log(`💡 Acesse: http://localhost:3000/holerites`)

  } catch (error) {
    console.log('❌ Erro durante teste:', error.message)
  }
}

criarHoleriteComBeneficios()