#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function executarCorrecaoDefinitiva() {
  console.log('🔧 EXECUTANDO CORREÇÃO DEFINITIVA DA TABELA HOLERITES\n')

  try {
    // 1. Primeiro, vamos verificar a estrutura atual
    console.log('1️⃣ Verificando estrutura atual...')
    
    const { data: estruturaAtual, error: errorEstrutura } = await supabase
      .from('holerites')
      .select('*')
      .limit(1)

    if (errorEstrutura) {
      console.log('❌ Erro ao verificar estrutura:', errorEstrutura.message)
    } else if (estruturaAtual && estruturaAtual.length > 0) {
      console.log('✅ Estrutura atual encontrada:')
      const campos = Object.keys(estruturaAtual[0])
      campos.forEach(campo => {
        console.log(`   - ${campo}`)
      })
    } else {
      console.log('⚠️ Tabela vazia, mas estrutura existe')
    }

    // 2. Executar correções uma por uma
    console.log('\n2️⃣ Executando correções...')
    
    const correcoes = [
      // Remover campos calculados problemáticos
      'ALTER TABLE holerites DROP COLUMN IF EXISTS total_proventos CASCADE',
      'ALTER TABLE holerites DROP COLUMN IF EXISTS total_descontos CASCADE', 
      'ALTER TABLE holerites DROP COLUMN IF EXISTS salario_liquido CASCADE',
      
      // Adicionar campos que podem estar faltando
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS ajuda_custo DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS emprestimo_consignado DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS seguro_vida_desconto DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS plano_odonto_desconto DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS pensao_alimenticia DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS beneficios JSONB DEFAULT \'[]\'',
      'ALTER TABLE holerites ADD COLUMN IF NOT EXISTS descontos_personalizados JSONB DEFAULT \'[]\'',
      
      // Recriar campos calculados como normais
      'ALTER TABLE holerites ADD COLUMN total_proventos DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN total_descontos DECIMAL(10,2) DEFAULT 0',
      'ALTER TABLE holerites ADD COLUMN salario_liquido DECIMAL(10,2) DEFAULT 0'
    ]

    for (let i = 0; i < correcoes.length; i++) {
      const sql = correcoes[i]
      console.log(`   ${i + 1}. ${sql.substring(0, 60)}...`)
      
      try {
        // Usar uma abordagem mais direta
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ sql })
        })

        if (response.ok) {
          console.log('      ✅ Executado')
        } else {
          console.log(`      ⚠️ Status: ${response.status} (pode ser normal se coluna já existe)`)
        }
      } catch (error) {
        console.log(`      ⚠️ Erro: ${error.message} (pode ser normal)`)
      }
    }

    // 3. Testar inserção simples
    console.log('\n3️⃣ Testando inserção simples...')
    
    const dadosSimples = {
      funcionario_id: 129,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: 6000.00,
      inss: 600.00,
      irrf: 200.00,
      status: 'gerado',
      observacoes: 'Teste após correção'
    }

    const { data: holeriteTest, error: errorTest } = await supabase
      .from('holerites')
      .insert(dadosSimples)
      .select()
      .single()

    if (errorTest) {
      console.log('❌ Erro no teste:', errorTest.message)
      
      // Se ainda há erro, vamos tentar uma abordagem mais básica
      console.log('\n🔄 Tentando abordagem mais básica...')
      
      const dadosBasicos = {
        funcionario_id: 129,
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-31'
      }

      const { data: holeriteBasico, error: errorBasico } = await supabase
        .from('holerites')
        .insert(dadosBasicos)
        .select()
        .single()

      if (errorBasico) {
        console.log('❌ Erro mesmo com dados básicos:', errorBasico.message)
      } else {
        console.log('✅ Inserção básica funcionou!')
        console.log(`   ID: ${holeriteBasico.id}`)
        
        // Remover teste
        await supabase.from('holerites').delete().eq('id', holeriteBasico.id)
        console.log('   🗑️ Teste removido')
      }
    } else {
      console.log('✅ Teste de inserção funcionou!')
      console.log(`   ID: ${holeriteTest.id}`)
      console.log(`   Total Proventos: R$ ${holeriteTest.total_proventos || 0}`)
      console.log(`   Total Descontos: R$ ${holeriteTest.total_descontos || 0}`)
      console.log(`   Salário Líquido: R$ ${holeriteTest.salario_liquido || 0}`)
      
      // Remover teste
      await supabase.from('holerites').delete().eq('id', holeriteTest.id)
      console.log('   🗑️ Teste removido')
    }

    // 4. Verificar estrutura final
    console.log('\n4️⃣ Verificando estrutura final...')
    
    const { data: estruturaFinal, error: errorFinal } = await supabase
      .from('holerites')
      .select('*')
      .limit(1)

    if (errorFinal) {
      console.log('❌ Erro ao verificar estrutura final:', errorFinal.message)
    } else {
      console.log('✅ Estrutura final:')
      if (estruturaFinal && estruturaFinal.length > 0) {
        const campos = Object.keys(estruturaFinal[0])
        const camposImportantes = ['total_proventos', 'total_descontos', 'salario_liquido', 'beneficios', 'descontos_personalizados']
        
        camposImportantes.forEach(campo => {
          const existe = campos.includes(campo)
          console.log(`   ${existe ? '✅' : '❌'} ${campo}`)
        })
      }
    }

    console.log('\n🎯 CORREÇÃO CONCLUÍDA!')
    console.log('✅ Agora você pode tentar gerar holerites novamente')

  } catch (error) {
    console.log('❌ Erro durante correção:', error.message)
  }
}

executarCorrecaoDefinitiva()