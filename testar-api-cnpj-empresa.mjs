#!/usr/bin/env node

/**
 * TESTE SIMPLES - API CONSULTA CNPJ
 * Testa a API de consulta CNPJ diretamente
 */

console.log('🧪 TESTANDO API DE CONSULTA CNPJ')
console.log('=' .repeat(50))

async function testarAPICNPJ() {
  try {
    // 1. Testar CNPJ válido
    console.log('\n1️⃣ Testando CNPJ válido...')
    
    const cnpjTeste = '47960950000121' // Magazine Luiza
    console.log(`📋 CNPJ: ${cnpjTeste}`)
    
    const response = await fetch('http://localhost:3001/api/consulta-cnpj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cnpj: cnpjTeste })
    })
    
    console.log(`📡 Status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Erro na resposta:', errorText)
      return
    }
    
    const dados = await response.json()
    
    if (dados.success) {
      console.log('✅ Consulta realizada com sucesso!')
      console.log('\n📊 DADOS RETORNADOS:')
      console.log(`   Nome: ${dados.data.nome}`)
      console.log(`   Nome Fantasia: ${dados.data.nome_fantasia || 'Não informado'}`)
      console.log(`   CNPJ: ${dados.data.cnpj}`)
      console.log(`   Situação: ${dados.data.situacao_cadastral}`)
      console.log(`   Inscrição Estadual: ${dados.data.inscricao_estadual || 'Não informado'}`)
      console.log(`   Logradouro: ${dados.data.logradouro}`)
      console.log(`   Número: ${dados.data.numero}`)
      console.log(`   Bairro: ${dados.data.bairro}`)
      console.log(`   Cidade: ${dados.data.municipio}`)
      console.log(`   UF: ${dados.data.uf}`)
      console.log(`   CEP: ${dados.data.cep}`)
      console.log(`   Telefone: ${dados.data.telefone || 'Não informado'}`)
      console.log(`   Email: ${dados.data.email || 'Não informado'}`)
      console.log(`   Atividade Principal: ${dados.data.atividade_principal}`)
      console.log(`   Natureza Jurídica: ${dados.data.natureza_juridica}`)
      console.log(`   Porte: ${dados.data.porte}`)
      
    } else {
      console.log('❌ Consulta falhou:', dados.message)
    }
    
    // 2. Testar CNPJ inválido
    console.log('\n2️⃣ Testando CNPJ inválido...')
    
    const cnpjInvalido = '12345678000100'
    console.log(`📋 CNPJ: ${cnpjInvalido}`)
    
    const responseInvalido = await fetch('http://localhost:3001/api/consulta-cnpj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cnpj: cnpjInvalido })
    })
    
    console.log(`📡 Status: ${responseInvalido.status}`)
    
    if (responseInvalido.status === 400) {
      console.log('✅ API rejeitou CNPJ inválido corretamente')
    } else {
      console.log('⚠️ API não rejeitou CNPJ inválido como esperado')
    }
    
    // 3. Testar CNPJ sem dados
    console.log('\n3️⃣ Testando CNPJ inexistente...')
    
    const cnpjInexistente = '11111111000111'
    console.log(`📋 CNPJ: ${cnpjInexistente}`)
    
    const responseInexistente = await fetch('http://localhost:3001/api/consulta-cnpj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cnpj: cnpjInexistente })
    })
    
    console.log(`📡 Status: ${responseInexistente.status}`)
    
    if (responseInexistente.status === 404) {
      console.log('✅ API retornou 404 para CNPJ inexistente')
    } else {
      const dadosInexistente = await responseInexistente.json()
      console.log('⚠️ Resposta inesperada:', dadosInexistente)
    }
    
    console.log('\n🎉 TESTE DA API CONCLUÍDO!')
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Servidor não está rodando. Execute: npm run dev')
    } else {
      console.log('💡 Erro de rede ou servidor')
    }
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
  
  await testarAPICNPJ()
}

executar()
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
  })