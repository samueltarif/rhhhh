#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarCalculosCorretos() {
  console.log('🧪 TESTANDO CÁLCULOS CORRETOS DE HOLERITES\n')

  try {
    // 1. Limpar holerites existentes do funcionário 129
    console.log('1️⃣ Limpando holerites existentes...')
    
    await supabase
      .from('holerites')
      .delete()
      .eq('funcionario_id', 129)

    console.log('✅ Holerites limpos')

    // 2. Testar geração de ADIANTAMENTO
    console.log('\n2️⃣ Testando ADIANTAMENTO (40% do salário)...')
    
    const responseAdiantamento = await fetch('http://localhost:3000/api/holerites/gerar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-15',
        funcionario_ids: [129],
        tipo: 'adiantamento',
        recriar: true
      })
    })

    if (responseAdiantamento.ok) {
      const resultadoAdiantamento = await responseAdiantamento.json()
      console.log('✅ Adiantamento gerado com sucesso!')
      console.log(`   Holerites: ${resultadoAdiantamento.total_gerados}`)
      console.log(`   Erros: ${resultadoAdiantamento.total_erros}`)
    } else {
      console.log(`❌ Erro na geração de adiantamento: ${responseAdiantamento.status}`)
    }

    // 3. Verificar adiantamento no banco
    console.log('\n3️⃣ Verificando adiantamento no banco...')
    
    const { data: adiantamento, error: adiantamentoError } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', 129)
      .like('observacoes', '%Adiantamento%')
      .single()

    if (adiantamentoError) {
      console.log('❌ Erro ao buscar adiantamento:', adiantamentoError.message)
    } else {
      console.log('✅ Adiantamento encontrado:')
      console.log(`   ID: ${adiantamento.id}`)
      console.log(`   Salário Base (40%): R$ ${adiantamento.salario_base}`)
      console.log(`   Total Proventos: R$ ${adiantamento.total_proventos}`)
      console.log(`   Total Descontos: R$ ${adiantamento.total_descontos}`)
      console.log(`   Salário Líquido: R$ ${adiantamento.salario_liquido}`)
      console.log(`   INSS: R$ ${adiantamento.inss}`)
      console.log(`   IRRF: R$ ${adiantamento.irrf}`)
      
      // Verificar se está correto (40% de R$ 6.000 = R$ 2.400)
      const salarioOriginal = 6000
      const valorEsperado = salarioOriginal * 0.40
      
      if (Math.abs(adiantamento.salario_base - valorEsperado) < 0.01) {
        console.log('✅ ADIANTAMENTO CORRETO: 40% do salário sem descontos')
      } else {
        console.log(`❌ ADIANTAMENTO INCORRETO: Esperado R$ ${valorEsperado}, recebido R$ ${adiantamento.salario_base}`)
      }
    }

    // 4. Testar geração de FOLHA MENSAL
    console.log('\n4️⃣ Testando FOLHA MENSAL (com desconto do adiantamento)...')
    
    const responseMensal = await fetch('http://localhost:3000/api/holerites/gerar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        periodo_inicio: '2026-01-16',
        periodo_fim: '2026-01-31',
        funcionario_ids: [129],
        tipo: 'mensal',
        recriar: true
      })
    })

    if (responseMensal.ok) {
      const resultadoMensal = await responseMensal.json()
      console.log('✅ Folha mensal gerada com sucesso!')
      console.log(`   Holerites: ${resultadoMensal.total_gerados}`)
      console.log(`   Erros: ${resultadoMensal.total_erros}`)
    } else {
      console.log(`❌ Erro na geração de folha mensal: ${responseMensal.status}`)
    }

    // 5. Verificar folha mensal no banco
    console.log('\n5️⃣ Verificando folha mensal no banco...')
    
    const { data: folhaMensal, error: mensalError } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', 129)
      .like('observacoes', '%Folha mensal%')
      .single()

    if (mensalError) {
      console.log('❌ Erro ao buscar folha mensal:', mensalError.message)
    } else {
      console.log('✅ Folha mensal encontrada:')
      console.log(`   ID: ${folhaMensal.id}`)
      console.log(`   Salário Base: R$ ${folhaMensal.salario_base}`)
      console.log(`   Total Proventos: R$ ${folhaMensal.total_proventos}`)
      console.log(`   Total Descontos: R$ ${folhaMensal.total_descontos}`)
      console.log(`   Salário Líquido: R$ ${folhaMensal.salario_liquido}`)
      console.log(`   INSS: R$ ${folhaMensal.inss}`)
      console.log(`   IRRF: R$ ${folhaMensal.irrf}`)
      console.log(`   Adiantamento: R$ ${folhaMensal.adiantamento}`)
      
      // Verificar se o adiantamento foi descontado
      if (folhaMensal.adiantamento > 0) {
        console.log('✅ FOLHA MENSAL CORRETA: Adiantamento foi descontado')
      } else {
        console.log('❌ FOLHA MENSAL INCORRETA: Adiantamento não foi descontado')
      }
    }

    // 6. Resumo final
    console.log('\n' + '='.repeat(60))
    console.log('🎯 RESUMO DOS CÁLCULOS')
    console.log('='.repeat(60))
    
    if (adiantamento && folhaMensal) {
      console.log('💰 ADIANTAMENTO:')
      console.log(`   Valor: R$ ${adiantamento.salario_base} (40% de R$ 6.000)`)
      console.log(`   Descontos: R$ ${adiantamento.total_descontos} (deve ser 0)`)
      console.log(`   Líquido: R$ ${adiantamento.salario_liquido}`)
      
      console.log('\n📄 FOLHA MENSAL:')
      console.log(`   Salário Base: R$ ${folhaMensal.salario_base}`)
      console.log(`   INSS: R$ ${folhaMensal.inss}`)
      console.log(`   IRRF: R$ ${folhaMensal.irrf}`)
      console.log(`   Adiantamento descontado: R$ ${folhaMensal.adiantamento}`)
      console.log(`   Total Descontos: R$ ${folhaMensal.total_descontos}`)
      console.log(`   Líquido: R$ ${folhaMensal.salario_liquido}`)
      
      // Verificação final
      const adiantamentoCorreto = Math.abs(adiantamento.salario_base - 2400) < 0.01 && adiantamento.total_descontos === 0
      const folhaCorreta = folhaMensal.adiantamento > 0 && folhaMensal.salario_base === 6000
      
      if (adiantamentoCorreto && folhaCorreta) {
        console.log('\n🎉 CÁLCULOS TOTALMENTE CORRETOS!')
        console.log('✅ Adiantamento: 40% sem descontos')
        console.log('✅ Folha mensal: Salário bruto - descontos - adiantamento')
      } else {
        console.log('\n⚠️ AINDA HÁ PROBLEMAS NOS CÁLCULOS')
        if (!adiantamentoCorreto) console.log('❌ Adiantamento incorreto')
        if (!folhaCorreta) console.log('❌ Folha mensal incorreta')
      }
    }

    console.log('\n🌐 TESTE NA INTERFACE:')
    console.log('   Acesse: http://localhost:3000/admin/holerites')
    console.log('   Teste os botões de geração')

  } catch (error) {
    console.log('❌ Erro durante teste:', error.message)
  }
}

testarCalculosCorretos()