#!/usr/bin/env node

// Testar atualização da data de nascimento

async function testarDataNascimento() {
  console.log('🧪 Testando atualização da data de nascimento...\n')

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
    console.log('   Data nascimento atual:', dadosAtuais.data.data_nascimento || 'Não informado')
    console.log('   Telefone:', dadosAtuais.data.telefone || 'Não informado')

    // 2. Testar atualização com nova data de nascimento
    console.log('\n2️⃣ Testando atualização da data de nascimento...')
    const novaDataNascimento = '1990-05-15'
    const novoTelefone = '(11) 88888-8888'

    const atualizacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 129,
        data_nascimento: novaDataNascimento,
        telefone: novoTelefone,
        email_pessoal: 'maciel.novo@email.com',
        pensao_alimenticia: 700
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
        console.log('      Data nascimento:', resultado.data.data_nascimento)
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
      console.log('   Data nascimento:', dadosVerificacao.data.data_nascimento)
      console.log('   Telefone:', dadosVerificacao.data.telefone)
      console.log('   Email pessoal:', dadosVerificacao.data.email_pessoal)
      console.log('   Pensão alimentícia:', dadosVerificacao.data.pensao_alimenticia)
      
      // Verificar se as mudanças foram aplicadas
      const dataAtualizada = dadosVerificacao.data.data_nascimento === novaDataNascimento
      const telefoneAtualizado = dadosVerificacao.data.telefone === novoTelefone
      
      console.log('\n4️⃣ Verificação das mudanças:')
      console.log('   Data nascimento atualizada:', dataAtualizada ? '✅' : '❌')
      console.log('   Telefone atualizado:', telefoneAtualizado ? '✅' : '❌')
      
      if (dataAtualizada && telefoneAtualizado) {
        console.log('\n🎉 TESTE PASSOU! Data de nascimento foi atualizada corretamente.')
      } else {
        console.log('\n⚠️ TESTE FALHOU! Data de nascimento não foi atualizada.')
        console.log('   Esperado:', novaDataNascimento)
        console.log('   Recebido:', dadosVerificacao.data.data_nascimento)
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarDataNascimento()