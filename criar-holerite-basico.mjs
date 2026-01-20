#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function criarHoleriteBasico() {
  console.log('🧪 CRIANDO HOLERITE COM ABORDAGEM BÁSICA\n')

  try {
    // 1. Verificar funcionário
    console.log('1️⃣ Verificando funcionário ID 129...')
    
    const { data: funcionario, error: funcError } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base')
      .eq('id', 129)
      .single()

    if (funcError || !funcionario) {
      console.log('❌ Funcionário não encontrado:', funcError?.message)
      return
    }

    console.log(`✅ Funcionário: ${funcionario.nome_completo}`)
    console.log(`   Salário: R$ ${funcionario.salario_base}`)

    // 2. Tentar inserção com apenas campos essenciais
    console.log('\n2️⃣ Tentando inserção com campos essenciais...')
    
    const dadosEssenciais = {
      funcionario_id: funcionario.id,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31'
    }

    const { data: holerite1, error: error1 } = await supabase
      .from('holerites')
      .insert(dadosEssenciais)
      .select()
      .single()

    if (error1) {
      console.log('❌ Erro com campos essenciais:', error1.message)
      
      // 3. Se falhou, tentar descobrir qual campo está causando problema
      console.log('\n3️⃣ Analisando erro...')
      
      if (error1.message.includes('dsr_horas_extras')) {
        console.log('🔍 O problema é um trigger/função que referencia "dsr_horas_extras"')
        console.log('💡 Vamos tentar uma abordagem diferente...')
        
        // Tentar usar upsert para contornar triggers
        console.log('\n4️⃣ Tentando com upsert...')
        
        const { data: holerite2, error: error2 } = await supabase
          .from('holerites')
          .upsert(dadosEssenciais, { onConflict: 'id' })
          .select()
          .single()

        if (error2) {
          console.log('❌ Upsert também falhou:', error2.message)
          
          // Última tentativa: usar update em um registro inexistente
          console.log('\n5️⃣ Tentando com update...')
          
          const { data: holerite3, error: error3 } = await supabase
            .from('holerites')
            .update(dadosEssenciais)
            .eq('id', 999999) // ID que não existe
            .select()

          if (error3) {
            console.log('❌ Update também falhou:', error3.message)
            console.log('\n🚨 DIAGNÓSTICO FINAL:')
            console.log('   O problema é definitivamente um trigger/função na tabela')
            console.log('   que está referenciando campos inexistentes.')
            console.log('\n💡 SOLUÇÕES POSSÍVEIS:')
            console.log('   1. Acessar o Supabase Dashboard diretamente')
            console.log('   2. Executar SQL manualmente no SQL Editor')
            console.log('   3. Recriar a tabela via interface web')
            return
          }
        } else {
          console.log('✅ Upsert funcionou!')
          console.log(`   ID: ${holerite2.id}`)
        }
      }
    } else {
      console.log('✅ Inserção com campos essenciais funcionou!')
      console.log(`   ID: ${holerite1.id}`)
      console.log('📋 Campos preenchidos automaticamente:')
      
      Object.keys(holerite1).forEach(campo => {
        console.log(`   - ${campo}: ${holerite1[campo]}`)
      })
      
      // 6. Tentar atualizar com mais campos
      console.log('\n6️⃣ Atualizando com mais campos...')
      
      const dadosCompletos = {
        salario_base: funcionario.salario_base,
        inss: 600.00,
        irrf: 200.00,
        status: 'gerado',
        observacoes: 'Holerite criado com abordagem básica'
      }

      const { data: holeriteAtualizado, error: errorUpdate } = await supabase
        .from('holerites')
        .update(dadosCompletos)
        .eq('id', holerite1.id)
        .select()
        .single()

      if (errorUpdate) {
        console.log('❌ Erro ao atualizar:', errorUpdate.message)
      } else {
        console.log('✅ Holerite atualizado com sucesso!')
        console.log(`   Salário Base: R$ ${holeriteAtualizado.salario_base}`)
        console.log(`   INSS: R$ ${holeriteAtualizado.inss}`)
        console.log(`   IRRF: R$ ${holeriteAtualizado.irrf}`)
        
        if (holeriteAtualizado.total_proventos !== null) {
          console.log(`   Total Proventos: R$ ${holeriteAtualizado.total_proventos}`)
        }
        if (holeriteAtualizado.total_descontos !== null) {
          console.log(`   Total Descontos: R$ ${holeriteAtualizado.total_descontos}`)
        }
        if (holeriteAtualizado.salario_liquido !== null) {
          console.log(`   Salário Líquido: R$ ${holeriteAtualizado.salario_liquido}`)
        }
      }
      
      console.log('\n🎯 SUCESSO!')
      console.log('✅ Holerite criado com abordagem básica')
      console.log('✅ Agora você pode testar as APIs de download')
    }

  } catch (error) {
    console.log('❌ Erro durante criação:', error.message)
  }
}

criarHoleriteBasico()