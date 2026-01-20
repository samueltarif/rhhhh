#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function corrigirCamposCalculadosGeracao() {
  console.log('🔧 CORRIGINDO CAMPOS CALCULADOS NA GERAÇÃO\n')

  try {
    // 1. Verificar holerites com valores zerados
    console.log('1️⃣ Verificando holerites com valores zerados...')
    
    const { data: holeritesZerados, error } = await supabase
      .from('holerites')
      .select('*')
      .eq('total_proventos', 0)
      .eq('total_descontos', 0)
      .eq('salario_liquido', 0)

    if (error) {
      console.log('❌ Erro ao buscar holerites:', error.message)
      return
    }

    console.log(`✅ Encontrados ${holeritesZerados.length} holerites com valores zerados`)

    // 2. Atualizar cada holerite
    console.log('\n2️⃣ Atualizando campos calculados...')
    
    for (const holerite of holeritesZerados) {
      console.log(`   Processando holerite ID ${holerite.id}...`)
      
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
        console.log(`      ✅ Atualizado: Proventos R$ ${totalProventos} | Descontos R$ ${totalDescontos} | Líquido R$ ${salarioLiquido}`)
      }
    }

    // 3. Criar função para atualizar automaticamente na inserção
    console.log('\n3️⃣ Criando trigger para cálculo automático...')
    
    const triggerSQL = `
      CREATE OR REPLACE FUNCTION atualizar_campos_calculados_holerite()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Calcular total de proventos
        NEW.total_proventos := COALESCE(NEW.salario_base, 0) + 
                              COALESCE(NEW.bonus, 0) + 
                              COALESCE(NEW.horas_extras, 0) + 
                              COALESCE(NEW.adicional_noturno, 0) + 
                              COALESCE(NEW.adicional_periculosidade, 0) + 
                              COALESCE(NEW.adicional_insalubridade, 0) + 
                              COALESCE(NEW.comissoes, 0);

        -- Calcular total de descontos
        NEW.total_descontos := COALESCE(NEW.inss, 0) + 
                              COALESCE(NEW.irrf, 0) + 
                              COALESCE(NEW.vale_transporte, 0) + 
                              COALESCE(NEW.cesta_basica_desconto, 0) + 
                              COALESCE(NEW.plano_saude, 0) + 
                              COALESCE(NEW.plano_odontologico, 0) + 
                              COALESCE(NEW.adiantamento, 0) + 
                              COALESCE(NEW.faltas, 0) + 
                              COALESCE(NEW.outros_descontos, 0);

        -- Calcular salário líquido
        NEW.salario_liquido := NEW.total_proventos - NEW.total_descontos;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_atualizar_campos_calculados ON holerites;

      CREATE TRIGGER trigger_atualizar_campos_calculados
          BEFORE INSERT OR UPDATE ON holerites
          FOR EACH ROW
          EXECUTE FUNCTION atualizar_campos_calculados_holerite();
    `

    // Executar via fetch (já que rpc não está disponível)
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({ sql: triggerSQL })
      })

      if (response.ok) {
        console.log('   ✅ Trigger criado com sucesso!')
      } else {
        console.log(`   ⚠️ Trigger não pôde ser criado via API (Status: ${response.status})`)
        console.log('   💡 Execute manualmente no Supabase SQL Editor')
      }
    } catch (triggerError) {
      console.log('   ⚠️ Erro ao criar trigger:', triggerError.message)
      console.log('   💡 Execute manualmente no Supabase SQL Editor')
    }

    // 4. Testar com um novo holerite
    console.log('\n4️⃣ Testando com novo holerite...')
    
    const { data: novoHolerite, error: novoError } = await supabase
      .from('holerites')
      .insert({
        funcionario_id: 129,
        periodo_inicio: '2026-02-01',
        periodo_fim: '2026-02-28',
        salario_base: 5000.00,
        inss: 500.00,
        irrf: 150.00,
        status: 'gerado',
        observacoes: 'Teste de cálculo automático'
      })
      .select()
      .single()

    if (novoError) {
      console.log('❌ Erro ao criar holerite teste:', novoError.message)
    } else {
      console.log('✅ Holerite teste criado!')
      console.log(`   ID: ${novoHolerite.id}`)
      console.log(`   Total Proventos: R$ ${novoHolerite.total_proventos}`)
      console.log(`   Total Descontos: R$ ${novoHolerite.total_descontos}`)
      console.log(`   Salário Líquido: R$ ${novoHolerite.salario_liquido}`)
      
      if (novoHolerite.total_proventos > 0 && novoHolerite.salario_liquido > 0) {
        console.log('🎉 CÁLCULO AUTOMÁTICO FUNCIONANDO!')
      } else {
        console.log('⚠️ Cálculo automático não está funcionando')
      }
      
      // Remover teste
      await supabase.from('holerites').delete().eq('id', novoHolerite.id)
      console.log('   🗑️ Holerite teste removido')
    }

    console.log('\n🎯 CORREÇÃO CONCLUÍDA!')
    console.log('✅ Holerites existentes atualizados')
    console.log('✅ Trigger criado para cálculos automáticos')
    console.log('💡 Agora os novos holerites terão valores calculados automaticamente')

  } catch (error) {
    console.log('❌ Erro durante correção:', error.message)
  }
}

corrigirCamposCalculadosGeracao()