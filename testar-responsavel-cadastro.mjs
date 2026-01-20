#!/usr/bin/env node

/**
 * TESTE - RESPONSÁVEL PELO CADASTRO
 * Verifica se o campo responsável_cadastro_id está funcionando
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🧪 TESTANDO RESPONSÁVEL PELO CADASTRO')
console.log('=' .repeat(50))

async function testarResponsavelCadastro() {
  try {
    // 1. Verificar se a coluna existe
    console.log('\n1️⃣ Verificando estrutura da tabela...')
    
    const { data: colunas, error: erroEstrutura } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'funcionarios' 
          AND column_name IN ('responsavel_cadastro_id', 'responsavel_id')
          ORDER BY column_name;
        `
      })
    
    if (erroEstrutura) {
      console.log('⚠️ Não foi possível verificar estrutura:', erroEstrutura.message)
    } else if (colunas && colunas.length > 0) {
      console.log('✅ Colunas encontradas:')
      colunas.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
      })
    }
    
    // 2. Buscar funcionários com responsável pelo cadastro
    console.log('\n2️⃣ Buscando funcionários com responsável...')
    
    const { data: funcionarios, error: erroFuncionarios } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        email_login,
        responsavel_cadastro_id,
        responsavel_id,
        created_at,
        responsavel_cadastro:responsavel_cadastro_id(nome_completo, email_login),
        responsavel_direto:responsavel_id(nome_completo, email_login)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (erroFuncionarios) {
      console.log('❌ Erro ao buscar funcionários:', erroFuncionarios.message)
      return
    }
    
    if (!funcionarios || funcionarios.length === 0) {
      console.log('⚠️ Nenhum funcionário encontrado')
      return
    }
    
    console.log(`✅ Encontrados ${funcionarios.length} funcionários:`)
    console.log('')
    
    funcionarios.forEach((func, index) => {
      console.log(`${index + 1}. ${func.nome_completo}`)
      console.log(`   📧 Email: ${func.email_login}`)
      console.log(`   📅 Criado em: ${new Date(func.created_at).toLocaleString('pt-BR')}`)
      
      if (func.responsavel_cadastro) {
        console.log(`   👤 Cadastrado por: ${func.responsavel_cadastro.nome_completo} (${func.responsavel_cadastro.email_login})`)
      } else if (func.responsavel_cadastro_id) {
        console.log(`   👤 Cadastrado por: ID ${func.responsavel_cadastro_id} (nome não encontrado)`)
      } else {
        console.log(`   ⚠️ Responsável pelo cadastro: Não definido`)
      }
      
      if (func.responsavel_direto) {
        console.log(`   👥 Responsável direto: ${func.responsavel_direto.nome_completo}`)
      } else if (func.responsavel_id) {
        console.log(`   👥 Responsável direto: ID ${func.responsavel_id} (nome não encontrado)`)
      } else {
        console.log(`   👥 Responsável direto: Não definido`)
      }
      
      console.log('')
    })
    
    // 3. Estatísticas
    console.log('📊 ESTATÍSTICAS:')
    
    const comResponsavelCadastro = funcionarios.filter(f => f.responsavel_cadastro_id).length
    const comResponsavelDireto = funcionarios.filter(f => f.responsavel_id).length
    
    console.log(`   Funcionários com responsável pelo cadastro: ${comResponsavelCadastro}/${funcionarios.length}`)
    console.log(`   Funcionários com responsável direto: ${comResponsavelDireto}/${funcionarios.length}`)
    
    // 4. Testar API de listagem
    console.log('\n3️⃣ Testando API de listagem...')
    
    try {
      const response = await fetch('http://localhost:3000/api/funcionarios')
      
      if (!response.ok) {
        console.log('❌ Erro na API:', response.status, response.statusText)
        return
      }
      
      const funcionariosAPI = await response.json()
      
      if (funcionariosAPI && funcionariosAPI.length > 0) {
        console.log(`✅ API retornou ${funcionariosAPI.length} funcionários`)
        
        const primeiroFunc = funcionariosAPI[0]
        console.log('\n📋 Exemplo do primeiro funcionário:')
        console.log(`   Nome: ${primeiroFunc.nome_completo}`)
        console.log(`   Responsável cadastro: ${primeiroFunc.responsavel_cadastro_nome || 'Não definido'}`)
        console.log(`   Responsável direto: ${primeiroFunc.responsavel_direto_nome || 'Não definido'}`)
        
        // Verificar se os campos estão sendo retornados
        const camposEsperados = ['responsavel_cadastro_nome', 'responsavel_direto_nome']
        const camposPresentes = camposEsperados.filter(campo => primeiroFunc.hasOwnProperty(campo))
        
        console.log(`\n✅ Campos presentes na API: ${camposPresentes.join(', ')}`)
        
        if (camposPresentes.length === camposEsperados.length) {
          console.log('🎉 Todos os campos de responsável estão sendo retornados!')
        } else {
          console.log('⚠️ Alguns campos de responsável estão faltando')
        }
      } else {
        console.log('⚠️ API não retornou funcionários')
      }
      
    } catch (error) {
      console.log('❌ Erro ao testar API:', error.message)
      console.log('💡 Certifique-se de que o servidor está rodando em localhost:3000')
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar teste
testarResponsavelCadastro()
  .then(() => {
    console.log('\n✅ Teste concluído!')
  })
  .catch((error) => {
    console.error('\n❌ Erro no teste:', error)
  })