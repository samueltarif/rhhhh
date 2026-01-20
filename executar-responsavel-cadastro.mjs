#!/usr/bin/env node

/**
 * EXECUTAR MIGRAÇÃO - RESPONSÁVEL CADASTRO
 * Adiciona coluna responsavel_cadastro_id na tabela funcionarios
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🔧 EXECUTANDO MIGRAÇÃO - RESPONSÁVEL CADASTRO')
console.log('=' .repeat(50))

async function executarMigracao() {
  try {
    console.log('\n1️⃣ Adicionando coluna responsavel_cadastro_id...')
    
    // Tentar adicionar a coluna
    const { error: erroColuna } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'funcionarios' 
                AND column_name = 'responsavel_cadastro_id'
            ) THEN
                ALTER TABLE funcionarios 
                ADD COLUMN responsavel_cadastro_id INTEGER REFERENCES funcionarios(id);
                
                RAISE NOTICE 'Coluna responsavel_cadastro_id adicionada com sucesso';
            ELSE
                RAISE NOTICE 'Coluna responsavel_cadastro_id já existe';
            END IF;
        END $$;
      `
    })
    
    if (erroColuna) {
      console.log('⚠️ Erro ao adicionar coluna (pode já existir):', erroColuna.message)
    } else {
      console.log('✅ Coluna adicionada/verificada com sucesso')
    }
    
    console.log('\n2️⃣ Criando índice para performance...')
    
    const { error: erroIndice } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_funcionarios_responsavel_cadastro 
        ON funcionarios(responsavel_cadastro_id);
      `
    })
    
    if (erroIndice) {
      console.log('⚠️ Erro ao criar índice:', erroIndice.message)
    } else {
      console.log('✅ Índice criado com sucesso')
    }
    
    console.log('\n3️⃣ Atualizando funcionários existentes...')
    
    // Buscar admin padrão
    const { data: admin } = await supabase
      .from('funcionarios')
      .select('id, nome_completo')
      .eq('tipo_acesso', 'admin')
      .limit(1)
      .single()
    
    if (admin) {
      console.log(`👤 Admin encontrado: ${admin.nome_completo} (ID: ${admin.id})`)
      
      // Atualizar funcionários sem responsável
      const { error: erroUpdate } = await supabase
        .from('funcionarios')
        .update({ responsavel_cadastro_id: admin.id })
        .is('responsavel_cadastro_id', null)
      
      if (erroUpdate) {
        console.log('⚠️ Erro ao atualizar funcionários:', erroUpdate.message)
      } else {
        console.log('✅ Funcionários existentes atualizados')
      }
    } else {
      console.log('⚠️ Admin não encontrado, funcionários não atualizados')
    }
    
    console.log('\n4️⃣ Verificando resultado...')
    
    // Verificar funcionários
    const { data: funcionarios, error: erroVerificacao } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, responsavel_cadastro_id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (erroVerificacao) {
      console.log('❌ Erro ao verificar:', erroVerificacao.message)
    } else if (funcionarios) {
      console.log(`✅ Verificação concluída - ${funcionarios.length} funcionários encontrados:`)
      
      funcionarios.forEach((func, index) => {
        console.log(`   ${index + 1}. ${func.nome_completo}`)
        console.log(`      Responsável ID: ${func.responsavel_cadastro_id || 'Não definido'}`)
        console.log(`      Criado em: ${new Date(func.created_at).toLocaleString('pt-BR')}`)
        console.log('')
      })
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar migração
executarMigracao()
  .then(() => {
    console.log('🎉 MIGRAÇÃO CONCLUÍDA!')
    console.log('')
    console.log('📋 PRÓXIMOS PASSOS:')
    console.log('1. Reiniciar o servidor de desenvolvimento')
    console.log('2. Testar cadastro de novo funcionário')
    console.log('3. Verificar se aparece "Cadastrado por" no painel')
  })
  .catch((error) => {
    console.error('❌ Erro na migração:', error)
  })