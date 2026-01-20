#!/usr/bin/env node

// Testar atualização de dados pessoais

async function testarAtualizacao() {
  console.log('🧪 Testando atualização de dados pessoais...\n')

  try {
    // 1. Buscar dados atuais do funcionário
    console.log('1️⃣ Buscando dados atuais...')
    const dadosResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (!dadosResponse.ok) {
      throw new Error(`Erro ao buscar dados: ${dadosResponse.status}`)
    }
    
    const dadosAtuais = await dadosResponse.json()
    console.log('✅ Dados atuais:')
    console.log('   Nome:', dadosAtuais.data.nome_completo)
    console.log('   Telefone:', dadosAtuais.data.telefone || 'Não informado')
    console.log('   Email pessoal:', dadosAtuais.data.email_pessoal || 'Não informado')
    console.log('   Pensão alimentícia:', dadosAtuais.data.pensao_alimenticia || 0)

    // 2. Testar atualização
    console.log('\n2️⃣ Testando atualização...')
    const novoTelefone = '(11) 99999-9999'
    const novoEmail = 'maciel.teste@email.com'
    const novaPensao = 600

    const atualizacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 129,
        telefone: novoTelefone,
        email_pessoal: novoEmail,
        pensao_alimenticia: novaPensao
      })
    })

    console.log('Status da atualização:', atualizacaoResponse.status)

    if (atualizacaoResponse.ok) {
      const resultado = await atualizacaoResponse.json()
      console.log('✅ Atualização bem-sucedida!')
      console.log('   Success:', resultado.success)
      console.log('   Message:', resultado.message)
      
      if (resultado.data) {
        console.log('   Dados atualizados:')
        console.log('      Telefone:', resultado.data.telefone)
        console.log('      Email pessoal:', resultado.data.email_pessoal)
        console.log('      Pensão alimentícia:', resultado.data.pensao_alimenticia)
      }
    } else {
      const erro = await atualizacaoResponse.text()
      console.log('❌ Erro na atualização:', erro)
    }

    // 3. Verificar se os dados foram realmente atualizados
    console.log('\n3️⃣ Verificando dados após atualização...')
    const verificacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (verificacaoResponse.ok) {
      const dadosVerificacao = await verificacaoResponse.json()
      console.log('✅ Dados após atualização:')
      console.log('   Telefone:', dadosVerificacao.data.telefone)
      console.log('   Email pessoal:', dadosVerificacao.data.email_pessoal)
      console.log('   Pensão alimentícia:', dadosVerificacao.data.pensao_alimenticia)
      
      // Verificar se as mudanças foram aplicadas
      const telefoneAtualizado = dadosVerificacao.data.telefone === novoTelefone
      const emailAtualizado = dadosVerificacao.data.email_pessoal === novoEmail
      const pensaoAtualizada = dadosVerificacao.data.pensao_alimenticia === novaPensao
      
      console.log('\n4️⃣ Verificação das mudanças:')
      console.log('   Telefone atualizado:', telefoneAtualizado ? '✅' : '❌')
      console.log('   Email atualizado:', emailAtualizado ? '✅' : '❌')
      console.log('   Pensão atualizada:', pensaoAtualizada ? '✅' : '❌')
      
      if (telefoneAtualizado && emailAtualizado && pensaoAtualizada) {
        console.log('\n🎉 TESTE PASSOU! Todos os dados foram atualizados corretamente.')
      } else {
        console.log('\n⚠️ TESTE FALHOU! Alguns dados não foram atualizados.')
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarAtualizacao()