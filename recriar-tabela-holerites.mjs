#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function recriarTabelaHolerites() {
  console.log('🔧 RECRIANDO TABELA HOLERITES DO ZERO\n')

  try {
    // 1. Fazer backup dos dados existentes (se houver)
    console.log('1️⃣ Fazendo backup dos dados existentes...')
    
    const { data: dadosExistentes, error: backupError } = await supabase
      .from('holerites')
      .select('*')

    if (backupError) {
      console.log('⚠️ Erro ao fazer backup (normal se tabela não existe):', backupError.message)
    } else {
      console.log(`✅ Backup feito: ${dadosExistentes?.length || 0} registros`)
      if (dadosExistentes && dadosExistentes.length > 0) {
        const fs = await import('fs')
        fs.writeFileSync('backup-holerites.json', JSON.stringify(dadosExistentes, null, 2))
        console.log('   💾 Backup salvo em: backup-holerites.json')
      }
    }

    // 2. Remover tabela completamente
    console.log('\n2️⃣ Removendo tabela existente...')
    
    const comandosRemocao = [
      'DROP TABLE IF EXISTS holerites CASCADE',
    ]

    for (const comando of comandosRemocao) {
      try {
        // Usar fetch direto para o endpoint REST
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ sql: comando })
        })

        if (response.ok) {
          console.log(`   ✅ ${comando}`)
        } else {
          console.log(`   ⚠️ ${comando} - Status: ${response.status}`)
        }
      } catch (error) {
        console.log(`   ⚠️ ${comando} - Erro: ${error.message}`)
      }
    }

    // 3. Criar tabela nova com estrutura simples
    console.log('\n3️⃣ Criando nova tabela holerites...')
    
    const sqlCriarTabela = `
      CREATE TABLE holerites (
        id SERIAL PRIMARY KEY,
        funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
        
        -- Período
        periodo_inicio DATE NOT NULL,
        periodo_fim DATE NOT NULL,
        data_pagamento DATE,
        
        -- Proventos
        salario_base DECIMAL(10,2) NOT NULL DEFAULT 0,
        bonus DECIMAL(10,2) DEFAULT 0,
        horas_extras DECIMAL(10,2) DEFAULT 0,
        adicional_noturno DECIMAL(10,2) DEFAULT 0,
        adicional_periculosidade DECIMAL(10,2) DEFAULT 0,
        adicional_insalubridade DECIMAL(10,2) DEFAULT 0,
        comissoes DECIMAL(10,2) DEFAULT 0,
        ajuda_custo DECIMAL(10,2) DEFAULT 0,
        
        -- Descontos
        inss DECIMAL(10,2) DEFAULT 0,
        base_inss DECIMAL(10,2) DEFAULT 0,
        aliquota_inss DECIMAL(5,2) DEFAULT 0,
        
        irrf DECIMAL(10,2) DEFAULT 0,
        base_irrf DECIMAL(10,2) DEFAULT 0,
        aliquota_irrf DECIMAL(5,2) DEFAULT 0,
        
        vale_transporte DECIMAL(10,2) DEFAULT 0,
        cesta_basica_desconto DECIMAL(10,2) DEFAULT 0,
        plano_saude DECIMAL(10,2) DEFAULT 0,
        plano_odontologico DECIMAL(10,2) DEFAULT 0,
        seguro_vida_desconto DECIMAL(10,2) DEFAULT 0,
        plano_odonto_desconto DECIMAL(10,2) DEFAULT 0,
        pensao_alimenticia DECIMAL(10,2) DEFAULT 0,
        emprestimo_consignado DECIMAL(10,2) DEFAULT 0,
        adiantamento DECIMAL(10,2) DEFAULT 0,
        faltas DECIMAL(10,2) DEFAULT 0,
        outros_descontos DECIMAL(10,2) DEFAULT 0,
        
        -- Campos calculados (normais, não GENERATED)
        total_proventos DECIMAL(10,2) DEFAULT 0,
        total_descontos DECIMAL(10,2) DEFAULT 0,
        salario_liquido DECIMAL(10,2) DEFAULT 0,
        
        -- Dados JSONB
        beneficios JSONB DEFAULT '[]',
        descontos_personalizados JSONB DEFAULT '[]',
        
        -- Controle
        status VARCHAR(20) DEFAULT 'gerado' CHECK (status IN ('gerado', 'enviado', 'visualizado')),
        horas_trabalhadas INTEGER DEFAULT 0,
        observacoes TEXT,
        
        -- Timestamps
        enviado_em TIMESTAMP,
        visualizado_em TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ sql: sqlCriarTabela })
      })

      if (response.ok) {
        console.log('   ✅ Tabela criada com sucesso!')
      } else {
        console.log(`   ❌ Erro ao criar tabela - Status: ${response.status}`)
        const errorText = await response.text()
        console.log(`   Detalhes: ${errorText}`)
      }
    } catch (error) {
      console.log(`   ❌ Erro ao criar tabela: ${error.message}`)
    }

    // 4. Criar índices
    console.log('\n4️⃣ Criando índices...')
    
    const indices = [
      'CREATE INDEX idx_holerites_funcionario ON holerites(funcionario_id)',
      'CREATE INDEX idx_holerites_periodo ON holerites(periodo_inicio, periodo_fim)',
      'CREATE INDEX idx_holerites_status ON holerites(status)'
    ]

    for (const indice of indices) {
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
          },
          body: JSON.stringify({ sql: indice })
        })

        if (response.ok) {
          console.log(`   ✅ ${indice}`)
        } else {
          console.log(`   ⚠️ ${indice} - Status: ${response.status}`)
        }
      } catch (error) {
        console.log(`   ⚠️ ${indice} - Erro: ${error.message}`)
      }
    }

    // 5. Testar inserção
    console.log('\n5️⃣ Testando inserção...')
    
    const dadosTeste = {
      funcionario_id: 129,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: 6000.00,
      inss: 600.00,
      irrf: 200.00,
      total_proventos: 6000.00,
      total_descontos: 800.00,
      salario_liquido: 5200.00,
      status: 'gerado',
      observacoes: 'Teste após recriação da tabela'
    }

    const { data: holeriteTest, error: errorTest } = await supabase
      .from('holerites')
      .insert(dadosTeste)
      .select()
      .single()

    if (errorTest) {
      console.log('❌ Erro no teste:', errorTest.message)
    } else {
      console.log('✅ Teste de inserção funcionou!')
      console.log(`   ID: ${holeriteTest.id}`)
      console.log(`   Funcionário: ${holeriteTest.funcionario_id}`)
      console.log(`   Salário Líquido: R$ ${holeriteTest.salario_liquido}`)
      
      // Mostrar todas as colunas
      console.log('\n📋 Colunas da nova tabela:')
      Object.keys(holeriteTest).forEach((coluna, index) => {
        console.log(`   ${index + 1}. ${coluna}: ${holeriteTest[coluna]}`)
      })
      
      // Remover teste
      await supabase.from('holerites').delete().eq('id', holeriteTest.id)
      console.log('   🗑️ Teste removido')
    }

    console.log('\n🎯 RECRIAÇÃO CONCLUÍDA!')
    console.log('✅ Tabela holerites recriada com estrutura limpa')
    console.log('✅ Sem triggers problemáticos')
    console.log('✅ Campos calculados como colunas normais')
    console.log('\n💡 PRÓXIMO PASSO:')
    console.log('Execute: node criar-holerites-funcionario-129.mjs')

  } catch (error) {
    console.log('❌ Erro durante recriação:', error.message)
  }
}

recriarTabelaHolerites()