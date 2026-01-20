#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarEstruturaTabelasHolerites() {
  console.log('🔍 Verificando estrutura das tabelas relacionadas aos holerites...\n')

  try {
    // 1. Verificar tabela holerites
    console.log('1️⃣ Verificando tabela HOLERITES...')
    await verificarTabela('holerites')

    // 2. Verificar tabela holerite_itens_personalizados
    console.log('\n2️⃣ Verificando tabela HOLERITE_ITENS_PERSONALIZADOS...')
    await verificarTabela('holerite_itens_personalizados')

    // 3. Verificar tabela configuracoes_holerites
    console.log('\n3️⃣ Verificando tabela CONFIGURACOES_HOLERITES...')
    await verificarTabela('configuracoes_holerites')

    // 4. Verificar dados existentes
    console.log('\n4️⃣ Verificando dados existentes...')
    await verificarDadosExistentes()

    // 5. Testar inserção simples
    console.log('\n5️⃣ Testando inserção simples...')
    await testarInsercaoSimples()

    console.log('\n🎉 Verificação completa!')

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

async function verificarTabela(nomeTabela) {
  try {
    // Verificar se a tabela existe
    const { data: tabelas, error: errorTabelas } = await supabase
      .rpc('exec_sql', { 
        sql_query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${nomeTabela}';
        `
      })

    if (errorTabelas) {
      console.log(`❌ Erro ao verificar existência da tabela ${nomeTabela}:`, errorTabelas.message)
      
      // Tentar abordagem alternativa - fazer uma query simples
      console.log(`🔄 Tentando abordagem alternativa para ${nomeTabela}...`)
      
      const { data: teste, error: errorTeste } = await supabase
        .from(nomeTabela)
        .select('*')
        .limit(1)

      if (errorTeste) {
        if (errorTeste.message.includes('does not exist')) {
          console.log(`❌ Tabela ${nomeTabela} NÃO EXISTE`)
        } else if (errorTeste.message.includes('schema cache')) {
          console.log(`⚠️ Tabela ${nomeTabela} existe mas não está no cache do schema`)
        } else {
          console.log(`❌ Erro ao acessar ${nomeTabela}:`, errorTeste.message)
        }
      } else {
        console.log(`✅ Tabela ${nomeTabela} EXISTE e é acessível`)
        console.log(`📊 Registros encontrados: ${teste?.length || 0}`)
      }
      return
    }

    if (tabelas && tabelas.length > 0) {
      console.log(`✅ Tabela ${nomeTabela} EXISTE`)
      
      // Verificar colunas
      await verificarColunas(nomeTabela)
      
    } else {
      console.log(`❌ Tabela ${nomeTabela} NÃO EXISTE`)
    }

  } catch (error) {
    console.log(`❌ Erro ao verificar tabela ${nomeTabela}:`, error.message)
  }
}

async function verificarColunas(nomeTabela) {
  try {
    const { data: colunas, error: errorColunas } = await supabase
      .rpc('exec_sql', { 
        sql_query: `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
          FROM information_schema.columns 
          WHERE table_name = '${nomeTabela}' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      })

    if (errorColunas) {
      console.log(`⚠️ Não foi possível obter colunas de ${nomeTabela}:`, errorColunas.message)
    } else if (colunas && colunas.length > 0) {
      console.log(`📋 Colunas da tabela ${nomeTabela}:`)
      colunas.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : ''
        console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`)
      })
    } else {
      console.log(`⚠️ Nenhuma coluna encontrada para ${nomeTabela}`)
    }
  } catch (error) {
    console.log(`❌ Erro ao verificar colunas de ${nomeTabela}:`, error.message)
  }
}

async function verificarDadosExistentes() {
  const tabelas = ['holerites', 'holerite_itens_personalizados', 'configuracoes_holerites']
  
  for (const tabela of tabelas) {
    try {
      const { data, error } = await supabase
        .from(tabela)
        .select('*', { count: 'exact' })
        .limit(0)

      if (error) {
        console.log(`❌ Erro ao contar registros de ${tabela}:`, error.message)
      } else {
        console.log(`📊 ${tabela}: ${data?.length || 0} registros`)
      }
    } catch (error) {
      console.log(`❌ Erro ao verificar dados de ${tabela}:`, error.message)
    }
  }
}

async function testarInsercaoSimples() {
  try {
    // Testar inserção na tabela holerites
    console.log('🧪 Testando inserção na tabela holerites...')
    
    const holeriteTest = {
      funcionario_id: 1, // Assumindo que existe funcionário com ID 1
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: 2000.00
    }

    const { data: holeriteInserido, error: errorHolerite } = await supabase
      .from('holerites')
      .insert([holeriteTest])
      .select()

    if (errorHolerite) {
      console.log('❌ Erro ao inserir holerite:', errorHolerite.message)
      console.log('💡 Detalhes:', errorHolerite.details)
      console.log('💡 Hint:', errorHolerite.hint)
    } else {
      console.log('✅ Holerite inserido com sucesso!')
      console.log('📋 ID gerado:', holeriteInserido[0].id)
      
      // Verificar campos calculados
      console.log('📊 Campos calculados:')
      console.log(`   - Total Proventos: R$ ${holeriteInserido[0].total_proventos || 0}`)
      console.log(`   - Total Descontos: R$ ${holeriteInserido[0].total_descontos || 0}`)
      console.log(`   - Salário Líquido: R$ ${holeriteInserido[0].salario_liquido || 0}`)
      
      // Remover o teste
      await supabase
        .from('holerites')
        .delete()
        .eq('id', holeriteInserido[0].id)
      
      console.log('🗑️ Holerite de teste removido')
    }

    // Testar inserção na tabela holerite_itens_personalizados (se existir)
    console.log('\n🧪 Testando inserção na tabela holerite_itens_personalizados...')
    
    const itemTest = {
      funcionario_id: 1,
      tipo: 'desconto',
      descricao: 'Teste Item',
      valor: 100.00,
      ativo: true
    }

    const { data: itemInserido, error: errorItem } = await supabase
      .from('holerite_itens_personalizados')
      .insert([itemTest])
      .select()

    if (errorItem) {
      console.log('❌ Erro ao inserir item personalizado:', errorItem.message)
    } else {
      console.log('✅ Item personalizado inserido com sucesso!')
      console.log('📋 ID gerado:', itemInserido[0].id)
      
      // Remover o teste
      await supabase
        .from('holerite_itens_personalizados')
        .delete()
        .eq('id', itemInserido[0].id)
      
      console.log('🗑️ Item de teste removido')
    }

    // Testar inserção na tabela configuracoes_holerites (se existir)
    console.log('\n🧪 Testando inserção na tabela configuracoes_holerites...')
    
    const configTest = {
      empresa_id: 1,
      mostrar_logo: true,
      assinatura_digital: 'Teste Assinatura'
    }

    const { data: configInserida, error: errorConfig } = await supabase
      .from('configuracoes_holerites')
      .insert([configTest])
      .select()

    if (errorConfig) {
      console.log('❌ Erro ao inserir configuração:', errorConfig.message)
    } else {
      console.log('✅ Configuração inserida com sucesso!')
      console.log('📋 ID gerado:', configInserida[0].id)
      
      // Remover o teste
      await supabase
        .from('configuracoes_holerites')
        .delete()
        .eq('id', configInserida[0].id)
      
      console.log('🗑️ Configuração de teste removida')
    }

  } catch (error) {
    console.log('❌ Erro durante teste de inserção:', error.message)
  }
}

// Executar verificação
verificarEstruturaTabelasHolerites()