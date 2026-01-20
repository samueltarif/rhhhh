#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarEstrutura() {
  console.log('🔍 VERIFICANDO ESTRUTURA ATUAL DA TABELA HOLERITES\n')

  try {
    // Verificar estrutura via query SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          is_generated,
          generation_expression
        FROM information_schema.columns 
        WHERE table_name = 'holerites' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    })

    if (error) {
      console.log('❌ Erro ao verificar estrutura:', error.message)
      
      // Tentar método alternativo
      console.log('\n🔄 Tentando método alternativo...')
      
      const { data: sample, error: sampleError } = await supabase
        .from('holerites')
        .select('*')
        .limit(1)

      if (sampleError) {
        console.log('❌ Erro no método alternativo:', sampleError.message)
        return
      }

      if (sample && sample.length > 0) {
        console.log('✅ Estrutura obtida via amostra:')
        const campos = Object.keys(sample[0])
        campos.forEach(campo => {
          console.log(`   - ${campo}`)
        })
      } else {
        console.log('⚠️ Tabela vazia, não é possível determinar estrutura')
      }
      return
    }

    console.log('✅ Estrutura da tabela holerites:')
    console.log('=' .repeat(80))
    
    data.forEach(col => {
      const generated = col.is_generated === 'ALWAYS' ? ' (GENERATED)' : ''
      const nullable = col.is_nullable === 'YES' ? ' NULL' : ' NOT NULL'
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
      
      console.log(`${col.column_name.padEnd(25)} | ${col.data_type.padEnd(15)} | ${nullable}${defaultVal}${generated}`)
      
      if (col.generation_expression) {
        console.log(`${' '.repeat(25)} | Expressão: ${col.generation_expression}`)
      }
    })

    // Verificar especificamente os campos problemáticos
    console.log('\n🎯 CAMPOS CALCULADOS:')
    const camposCalculados = data.filter(col => 
      ['total_proventos', 'total_descontos', 'salario_liquido'].includes(col.column_name)
    )

    if (camposCalculados.length > 0) {
      camposCalculados.forEach(col => {
        console.log(`✅ ${col.column_name}:`)
        console.log(`   - Tipo: ${col.data_type}`)
        console.log(`   - Gerado: ${col.is_generated}`)
        console.log(`   - Expressão: ${col.generation_expression || 'N/A'}`)
      })
    } else {
      console.log('❌ Campos calculados não encontrados!')
    }

    // Verificar se há holerites existentes
    console.log('\n📊 HOLERITES EXISTENTES:')
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select('id, funcionario_id, periodo_inicio, periodo_fim')
      .limit(5)

    if (holeriteError) {
      console.log('❌ Erro ao buscar holerites:', holeriteError.message)
    } else {
      console.log(`✅ Total de holerites: ${holerites.length}`)
      if (holerites.length > 0) {
        holerites.forEach(h => {
          console.log(`   - ID ${h.id}: Func ${h.funcionario_id} (${h.periodo_inicio} a ${h.periodo_fim})`)
        })
      }
    }

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

verificarEstrutura()