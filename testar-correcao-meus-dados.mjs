import 'dotenv/config'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🧪 TESTE: Correção do Campo carga_horaria\n')
console.log('=' .repeat(80))

async function testarAtualizacaoDados() {
  console.log('\n1️⃣ Testando atualização de dados profissionais...')
  
  try {
    // Simular dados que o admin enviaria
    const dadosParaAtualizar = {
      userId: 1, // ID da Silvana
      cargo_id: 2,
      departamento_id: 7,
      data_admissao: "2010-01-14",
      tipo_contrato: "PJ",
      empresa_id: "8"
      // ✅ Sem carga_horaria - campo removido
    }
    
    console.log('📦 Dados a enviar:')
    console.log(JSON.stringify(dadosParaAtualizar, null, 2))
    
    const response = await fetch(`${BASE_URL}/api/funcionarios/meus-dados`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaAtualizar)
    })
    
    console.log(`\n📊 Status da resposta: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ ERRO:')
      try {
        const errorJson = JSON.parse(errorText)
        console.log(`   Status: ${errorJson.statusCode}`)
        console.log(`   Mensagem: ${errorJson.message}`)
        if (errorJson.stack) {
          console.log('   Stack:')
          errorJson.stack.slice(0, 3).forEach(line => console.log(`     ${line}`))
        }
      } catch {
        console.log(`   ${errorText}`)
      }
      return false
    }
    
    const resultado = await response.json()
    console.log('✅ SUCESSO!')
    console.log('📋 Resposta:')
    console.log(`   Success: ${resultado.success}`)
    console.log(`   Message: ${resultado.message}`)
    
    if (resultado.data) {
      console.log('📊 Dados atualizados:')
      console.log(`   Cargo ID: ${resultado.data.cargo_id}`)
      console.log(`   Departamento ID: ${resultado.data.departamento_id}`)
      console.log(`   Data Admissão: ${resultado.data.data_admissao}`)
      console.log(`   Tipo Contrato: ${resultado.data.tipo_contrato}`)
      console.log(`   Empresa ID: ${resultado.data.empresa_id}`)
    }
    
    return true
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message)
    return false
  }
}

async function executar() {
  try {
    console.log('🎯 Objetivo: Verificar se a atualização funciona sem o campo carga_horaria\n')
    
    const sucesso = await testarAtualizacaoDados()
    
    console.log('\n' + '='.repeat(80))
    if (sucesso) {
      console.log('✅ TESTE PASSOU!')
      console.log('✅ Campo carga_horaria foi removido com sucesso')
      console.log('✅ API funciona normalmente sem o campo inexistente')
    } else {
      console.log('❌ TESTE FALHOU!')
      console.log('❌ Ainda há problemas com a atualização de dados')
    }
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message)
  }
}

executar()