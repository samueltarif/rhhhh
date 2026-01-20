#!/usr/bin/env node

// Testar especificamente a atualização do telefone

async function testarTelefone() {
  console.log('🧪 Testando atualização específica do telefone...\n')

  try {
    // 1. Buscar dados atuais
    console.log('1️⃣ Buscando dados atuais...')
    const dadosResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (!dadosResponse.ok) {
      throw new Error(`Erro ao buscar dados: ${dadosResponse.status}`)
    }
    
    const dadosAtuais = await dadosResponse.json()
    console.log('✅ Dados atuais:')
    console.log('   Nome:', dadosAtuais.data.nome_completo)
    console.log('   Telefone atual:', dadosAtuais.data.telefone || 'Não informado')
    console.log('   Email atual:', dadosAtuais.data.email_pessoal || 'Não informado')

    // 2. Testar atualização APENAS do telefone
    console.log('\n2️⃣ Testando atualização APENAS do telefone...')
    const novoTelefone = '(11) 99999-1234'

    const atualizacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 129,
        telefone: novoTelefone
        // Enviando APENAS o telefone para testar
      })
    })

    console.log('Status da atualização:', atualizacaoResponse.status)

    if (atualizacaoResponse.ok) {
      const resultado = await atualizacaoResponse.json()
      console.log('✅ Resposta da API:')
      console.log('   Success:', resultado.success)
      console.log('   Message:', resultado.message)
      
      if (resultado.data) {
        console.log('   Dados retornados pela API:')
        console.log('      Telefone:', resultado.data.telefone)
        console.log('      Email pessoal:', resultado.data.email_pessoal)
      }
    } else {
      const erro = await atualizacaoResponse.text()
      console.log('❌ Erro na atualização:', erro)
      return
    }

    // 3. Aguardar um pouco e verificar novamente
    console.log('\n3️⃣ Aguardando 2 segundos e verificando novamente...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const verificacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (verificacaoResponse.ok) {
      const dadosVerificacao = await verificacaoResponse.json()
      console.log('✅ Dados após atualização:')
      console.log('   Telefone:', dadosVerificacao.data.telefone)
      console.log('   Email pessoal:', dadosVerificacao.data.email_pessoal)
      
      // Verificar se o telefone foi realmente atualizado
      const telefoneAtualizado = dadosVerificacao.data.telefone === novoTelefone
      
      console.log('\n4️⃣ Verificação:')
      console.log('   Telefone esperado:', novoTelefone)
      console.log('   Telefone atual:', dadosVerificacao.data.telefone)
      console.log('   Telefone atualizado:', telefoneAtualizado ? '✅' : '❌')
      
      if (telefoneAtualizado) {
        console.log('\n🎉 TESTE PASSOU! Telefone foi atualizado corretamente.')
      } else {
        console.log('\n⚠️ TESTE FALHOU! Telefone não foi atualizado.')
        console.log('   Possíveis causas:')
        console.log('   - Campo não está sendo aceito pela API')
        console.log('   - Problema na validação do campo')
        console.log('   - Cache ou problema de sincronização')
        console.log('   - Problema na query SQL')
      }
    }

    // 4. Testar com dados completos
    console.log('\n5️⃣ Testando com dados completos...')
    const telefoneCompleto = '(11) 88888-5555'
    
    const atualizacaoCompletaResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 129,
        telefone: telefoneCompleto,
        data_nascimento: '1990-05-15',
        email_pessoal: 'maciel.completo@email.com'
      })
    })

    if (atualizacaoCompletaResponse.ok) {
      const resultadoCompleto = await atualizacaoCompletaResponse.json()
      console.log('✅ Atualização completa processada')
      
      // Verificar novamente
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const verificacaoFinalResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
      
      if (verificacaoFinalResponse.ok) {
        const dadosFinal = await verificacaoFinalResponse.json()
        console.log('📊 Dados finais:')
        console.log('   Telefone:', dadosFinal.data.telefone)
        console.log('   Email:', dadosFinal.data.email_pessoal)
        console.log('   Data nascimento:', dadosFinal.data.data_nascimento)
        
        const telefoneCompletoAtualizado = dadosFinal.data.telefone === telefoneCompleto
        console.log('   Telefone completo atualizado:', telefoneCompletoAtualizado ? '✅' : '❌')
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarTelefone()