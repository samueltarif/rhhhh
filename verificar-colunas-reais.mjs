#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarColunasReais() {
  console.log('🔍 VERIFICANDO COLUNAS REAIS DA TABELA HOLERITES\n')

  try {
    // Método 1: Tentar inserir um registro vazio para descobrir campos obrigatórios
    console.log('1️⃣ Testando inserção vazia para descobrir estrutura...')
    
    const { data, error } = await supabase
      .from('holerites')
      .insert({})
      .select()

    if (error) {
      console.log('❌ Erro esperado:', error.message)
      
      // Analisar mensagem de erro para descobrir campos
      if (error.message.includes('null value in column')) {
        const match = error.message.match(/null value in column "([^"]+)"/);
        if (match) {
          console.log(`   📋 Campo obrigatório: ${match[1]}`)
        }
      }
      
      if (error.message.includes('no field')) {
        const match = error.message.match(/record "new" has no field "([^"]+)"/);
        if (match) {
          console.log(`   ❌ Campo inexistente sendo referenciado: ${match[1]}`)
        }
      }
    }

    // Método 2: Tentar com campos mínimos
    console.log('\n2️⃣ Testando com campos mínimos...')
    
    const camposMinimos = {
      funcionario_id: 129,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31'
    }

    const { data: teste1, error: error1 } = await supabase
      .from('holerites')
      .insert(camposMinimos)
      .select()

    if (error1) {
      console.log('❌ Erro com campos mínimos:', error1.message)
    } else {
      console.log('✅ Inserção com campos mínimos funcionou!')
      console.log('📋 Colunas descobertas:')
      
      const colunas = Object.keys(teste1[0])
      colunas.forEach((coluna, index) => {
        const valor = teste1[0][coluna]
        const tipo = typeof valor
        console.log(`   ${index + 1}. ${coluna}: ${valor} (${tipo})`)
      })
      
      // Remover o teste
      await supabase.from('holerites').delete().eq('id', teste1[0].id)
      console.log('   🗑️ Registro de teste removido')
      
      // Salvar estrutura em arquivo
      const estrutura = {
        colunas: colunas,
        exemplo: teste1[0],
        timestamp: new Date().toISOString()
      }
      
      const fs = await import('fs')
      fs.writeFileSync('estrutura-holerites-real.json', JSON.stringify(estrutura, null, 2))
      console.log('   💾 Estrutura salva em: estrutura-holerites-real.json')
    }

    // Método 3: Verificar triggers e funções
    console.log('\n3️⃣ Verificando triggers e funções...')
    
    try {
      // Tentar uma query direta para ver triggers
      const { data: triggers, error: triggerError } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT 
              trigger_name,
              event_manipulation,
              action_statement
            FROM information_schema.triggers 
            WHERE event_object_table = 'holerites'
          `
        })

      if (triggerError) {
        console.log('⚠️ Não foi possível verificar triggers:', triggerError.message)
      } else if (triggers && triggers.length > 0) {
        console.log('📋 Triggers encontrados:')
        triggers.forEach(trigger => {
          console.log(`   - ${trigger.trigger_name}: ${trigger.event_manipulation}`)
          if (trigger.action_statement.includes('dsr_horas_extras')) {
            console.log(`     ❌ Este trigger referencia campo inexistente!`)
          }
        })
      } else {
        console.log('✅ Nenhum trigger encontrado')
      }
    } catch (triggerError) {
      console.log('⚠️ Erro ao verificar triggers:', triggerError.message)
    }

    // Método 4: Listar todas as colunas via information_schema
    console.log('\n4️⃣ Tentando listar colunas via information_schema...')
    
    try {
      const { data: colunas, error: colunaError } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT 
              column_name,
              data_type,
              is_nullable,
              column_default,
              character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'holerites' 
            AND table_schema = 'public'
            ORDER BY ordinal_position
          `
        })

      if (colunaError) {
        console.log('⚠️ Não foi possível listar colunas:', colunaError.message)
      } else if (colunas && colunas.length > 0) {
        console.log('📋 Colunas da tabela holerites:')
        colunas.forEach((col, index) => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
          console.log(`   ${index + 1}. ${col.column_name} (${col.data_type}) ${nullable}${defaultVal}`)
        })
        
        // Salvar lista de colunas
        const fs = await import('fs')
        fs.writeFileSync('colunas-holerites-real.json', JSON.stringify(colunas, null, 2))
        console.log('   💾 Lista de colunas salva em: colunas-holerites-real.json')
      }
    } catch (schemaError) {
      console.log('⚠️ Erro ao acessar information_schema:', schemaError.message)
    }

    console.log('\n🎯 RESUMO:')
    console.log('✅ Verificação concluída')
    console.log('📄 Arquivos gerados:')
    console.log('   - estrutura-holerites-real.json (se inserção funcionou)')
    console.log('   - colunas-holerites-real.json (se schema funcionou)')

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

verificarColunasReais()