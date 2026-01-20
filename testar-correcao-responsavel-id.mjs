#!/usr/bin/env node

/**
 * TESTE - CORREÇÃO DO RESPONSÁVEL ID
 * Testa se o campo responsavel_id está sendo enviado corretamente
 */

console.log('🧪 TESTANDO CORREÇÃO DO RESPONSÁVEL ID')
console.log('=' .repeat(50))

async function testarCorrecaoResponsavel() {
  try {
    // 1. Testar API admin/info
    console.log('\n1️⃣ Testando API admin/info...')
    
    const responseAdmin = await fetch('http://localhost:3001/api/admin/info')
    
    if (!responseAdmin.ok) {
      console.log('❌ Erro na API admin/info:', responseAdmin.status)
      return
    }
    
    const adminData = await responseAdmin.json()
    console.log('✅ API admin/info funcionando')
    console.log('📋 Dados do admin:', JSON.stringify(adminData, null, 2))
    
    // 2. Testar criação de funcionário com dados corretos
    console.log('\n2️⃣ Testando criação de funcionário...')
    
    const funcionarioTeste = {
      nome_completo: 'TESTE RESPONSAVEL ID',
      cpf: '123.456.789-00',
      email_login: 'teste.responsavel@teste.com',
      senha: 'Teste123@',
      empresa_id: '8', // ID válido da Qualitec
      departamento_id: '7', // ID válido do Administrativo
      cargo_id: '6', // ID válido do Auxiliar Administrativo
      jornada_trabalho_id: '2', // Assumindo que existe
      responsavel_id: adminData.data?.id || null, // Usar ID correto ou null
      tipo_contrato: 'CLT',
      tipo_acesso: 'funcionario',
      status: 'ativo',
      salario_base: '1000',
      tipo_salario: 'mensal',
      forma_pagamento: 'deposito',
      beneficios: {},
      descontos_personalizados: []
    }
    
    console.log('📦 Dados do funcionário teste:')
    console.log(`   Nome: ${funcionarioTeste.nome_completo}`)
    console.log(`   Email: ${funcionarioTeste.email_login}`)
    console.log(`   Responsável ID: ${funcionarioTeste.responsavel_id}`)
    
    const responseFuncionario = await fetch('http://localhost:3001/api/funcionarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(funcionarioTeste)
    })
    
    console.log(`📡 Status da criação: ${responseFuncionario.status}`)
    
    if (responseFuncionario.ok) {
      const resultado = await responseFuncionario.json()
      console.log('✅ Funcionário criado com sucesso!')
      console.log(`   ID: ${resultado.data?.id}`)
      console.log(`   Nome: ${resultado.data?.nome_completo}`)
    } else {
      const erro = await responseFuncionario.text()
      console.log('❌ Erro na criação:', erro)
    }
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
  }
}

// Verificar se o servidor está rodando
async function verificarServidor() {
  try {
    const response = await fetch('http://localhost:3001')
    return true
  } catch (error) {
    return false
  }
}

// Executar teste
async function executar() {
  console.log('🔍 Verificando servidor...')
  
  const servidorRodando = await verificarServidor()
  
  if (!servidorRodando) {
    console.log('❌ Servidor não está rodando em localhost:3001')
    console.log('💡 Execute: npm run dev')
    return
  }
  
  console.log('✅ Servidor está rodando')
  
  await testarCorrecaoResponsavel()
}

executar()
  .then(() => {
    console.log('\n✅ Teste concluído!')
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error)
  })