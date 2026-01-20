#!/usr/bin/env node

// Testar se a pensão alimentícia não pode ser editada pelo funcionário

async function testarPensaoRestrita() {
  console.log('🧪 Testando restrição da pensão alimentícia...\n')

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
    console.log('   Pensão alimentícia atual:', dadosAtuais.data.pensao_alimenticia || 'Não informado')
    console.log('   Telefone:', dadosAtuais.data.telefone || 'Não informado')

    // 2. Tentar atualizar pensão alimentícia como funcionário (deve ser ignorado)
    console.log('\n2️⃣ Tentando atualizar pensão alimentícia como funcionário...')
    const pensaoOriginal = dadosAtuais.data.pensao_alimenticia
    const novaPensao = 999 // Valor que não deve ser aceito
    const novoTelefone = '(11) 77777-7777'

    const atualizacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 129,
        telefone: novoTelefone,
        data_nascimento: '1990-05-15',
        email_pessoal: 'maciel.teste@email.com',
        pensao_alimenticia: novaPensao // Este campo deve ser ignorado
      })
    })

    console.log('Status da atualização:', atualizacaoResponse.status)

    if (atualizacaoResponse.ok) {
      const resultado = await atualizacaoResponse.json()
      console.log('✅ Atualização processada!')
      console.log('   Success:', resultado.success)
      console.log('   Message:', resultado.message)
    } else {
      const erro = await atualizacaoResponse.text()
      console.log('❌ Erro na atualização:', erro)
    }

    // 3. Verificar se a pensão alimentícia NÃO foi alterada
    console.log('\n3️⃣ Verificando se pensão alimentícia foi preservada...')
    const verificacaoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (verificacaoResponse.ok) {
      const dadosVerificacao = await verificacaoResponse.json()
      console.log('✅ Dados após tentativa de atualização:')
      console.log('   Pensão alimentícia:', dadosVerificacao.data.pensao_alimenticia)
      console.log('   Telefone:', dadosVerificacao.data.telefone)
      console.log('   Email pessoal:', dadosVerificacao.data.email_pessoal)
      
      // Verificar se a pensão NÃO foi alterada
      const pensaoNaoAlterada = dadosVerificacao.data.pensao_alimenticia === pensaoOriginal
      const telefoneAtualizado = dadosVerificacao.data.telefone === novoTelefone
      
      console.log('\n4️⃣ Verificação de segurança:')
      console.log('   Pensão alimentícia preservada:', pensaoNaoAlterada ? '✅' : '❌')
      console.log('   Telefone atualizado:', telefoneAtualizado ? '✅' : '❌')
      
      if (pensaoNaoAlterada && telefoneAtualizado) {
        console.log('\n🎉 TESTE PASSOU! Pensão alimentícia está protegida contra edição pelo funcionário.')
        console.log('   Valor original:', pensaoOriginal)
        console.log('   Valor após tentativa:', dadosVerificacao.data.pensao_alimenticia)
        console.log('   Status: INALTERADO ✅')
      } else {
        console.log('\n⚠️ TESTE FALHOU! Pensão alimentícia foi alterada pelo funcionário.')
        console.log('   Valor original:', pensaoOriginal)
        console.log('   Valor após tentativa:', dadosVerificacao.data.pensao_alimenticia)
        console.log('   Status: ALTERADO ❌')
      }
    }

    // 4. Verificar campos que o funcionário PODE editar
    console.log('\n5️⃣ Campos que o funcionário PODE editar:')
    console.log('   ✅ Telefone')
    console.log('   ✅ Data de nascimento')
    console.log('   ✅ Email pessoal')
    console.log('   ✅ Dados bancários')
    
    console.log('\n6️⃣ Campos RESTRITOS (apenas admin):')
    console.log('   🔒 Pensão alimentícia')
    console.log('   🔒 Cargo')
    console.log('   🔒 Departamento')
    console.log('   🔒 Empresa')
    console.log('   🔒 Data de admissão')

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarPensaoRestrita()