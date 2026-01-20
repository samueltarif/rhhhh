#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarGeracaoInterface() {
  console.log('🧪 TESTANDO GERAÇÃO DE HOLERITES VIA API\n')

  try {
    // 1. Testar geração de adiantamento
    console.log('1️⃣ Testando geração de adiantamento...')
    
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    
    const dadosAdiantamento = {
      periodo_inicio: `${ano}-${mes}-01`,
      periodo_fim: `${ano}-${mes}-15`,
      funcionario_ids: [129],
      tipo: 'adiantamento',
      recriar: true
    }

    try {
      const response = await fetch('http://localhost:3000/api/holerites/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify(dadosAdiantamento)
      })

      if (response.ok) {
        const resultado = await response.json()
        console.log('✅ Adiantamento gerado com sucesso!')
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
        console.log(`❌ Erro na geração de adiantamento: ${response.status}`)
        console.log(`   Detalhes: ${errorText}`)
      }
    } catch (error) {
      console.log('❌ Erro ao chamar API de adiantamento:', error.message)
    }

    // 2. Testar geração de folha mensal
    console.log('\n2️⃣ Testando geração de folha mensal...')
    
    const dadosMensal = {
      periodo_inicio: `${ano}-${mes}-01`,
      periodo_fim: `${ano}-${mes}-28`,
      funcionario_ids: [129],
      tipo: 'mensal',
      recriar: true
    }

    try {
      const response = await fetch('http://localhost:3000/api/holerites/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify(dadosMensal)
      })

      if (response.ok) {
        const resultado = await response.json()
        console.log('✅ Folha mensal gerada com sucesso!')
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
        console.log(`❌ Erro na geração de folha mensal: ${response.status}`)
        console.log(`   Detalhes: ${errorText}`)
      }
    } catch (error) {
      console.log('❌ Erro ao chamar API de folha mensal:', error.message)
    }

    // 3. Verificar holerites criados
    console.log('\n3️⃣ Verificando holerites criados...')
    
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select('id, funcionario_id, periodo_inicio, periodo_fim, salario_base, total_proventos, total_descontos, salario_liquido, observacoes')
      .eq('funcionario_id', 129)
      .order('id', { ascending: false })
      .limit(5)

    if (holeriteError) {
      console.log('❌ Erro ao buscar holerites:', holeriteError.message)
    } else {
      console.log(`✅ Holerites encontrados: ${holerites.length}`)
      holerites.forEach((h, i) => {
        const isAdiantamento = h.observacoes?.includes('Adiantamento') || new Date(h.periodo_fim).getDate() <= 15
        const tipo = isAdiantamento ? '💰 Adiantamento' : '📄 Mensal'
        console.log(`   ${i + 1}. ${tipo} | ID ${h.id} | ${h.periodo_inicio} a ${h.periodo_fim}`)
        console.log(`      Base: R$ ${h.salario_base} | Líquido: R$ ${h.salario_liquido}`)
      })
    }

    console.log('\n🎯 TESTE CONCLUÍDO!')
    console.log('✅ Agora você pode testar na interface web')
    console.log('💡 Acesse: http://localhost:3000/admin/holerites')

  } catch (error) {
    console.log('❌ Erro durante teste:', error.message)
  }
}

testarGeracaoInterface()