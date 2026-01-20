#!/usr/bin/env node

// Simular o comportamento do usuário: carregar dados, editar, salvar, recarregar

async function simularComportamentoUsuario() {
  console.log('🧪 Simulando comportamento do usuário...\n')

  try {
    // 1. Simular carregamento inicial da página (como onMounted)
    console.log('1️⃣ Simulando carregamento inicial da página...')
    const carregamentoInicial = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (!carregamentoInicial.ok) {
      throw new Error(`Erro no carregamento inicial: ${carregamentoInicial.status}`)
    }
    
    const dadosIniciais = await carregamentoInicial.json()
    console.log('✅ Dados carregados inicialmente:')
    console.log('   Telefone:', dadosIniciais.data.telefone)
    console.log('   Email:', dadosIniciais.data.email_pessoal)

    // 2. Simular edição do usuário
    console.log('\n2️⃣ Usuário edita o telefone...')
    const telefoneEditado = '(11) 55555-9999'
    console.log('   Novo telefone:', telefoneEditado)

    // 3. Simular salvamento (como salvarDadosPessoais)
    console.log('\n3️⃣ Simulando salvamento...')
    const salvamentoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 129,
        telefone: telefoneEditado,
        data_nascimento: dadosIniciais.data.data_nascimento,
        email_pessoal: dadosIniciais.data.email_pessoal
      })
    })

    if (salvamentoResponse.ok) {
      const resultadoSalvamento = await salvamentoResponse.json()
      console.log('✅ Salvamento bem-sucedido!')
      console.log('   Telefone retornado pela API:', resultadoSalvamento.data?.telefone)
    } else {
      console.log('❌ Erro no salvamento')
      return
    }

    // 4. Simular recarregamento (como carregarDados após salvar)
    console.log('\n4️⃣ Simulando recarregamento após salvar...')
    await new Promise(resolve => setTimeout(resolve, 500)) // Pequena pausa
    
    const recarregamentoResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (recarregamentoResponse.ok) {
      const dadosRecarregados = await recarregamentoResponse.json()
      console.log('✅ Dados recarregados:')
      console.log('   Telefone:', dadosRecarregados.data.telefone)
      console.log('   Email:', dadosRecarregados.data.email_pessoal)
      
      // Verificar se o telefone foi preservado
      const telefonePreservado = dadosRecarregados.data.telefone === telefoneEditado
      
      console.log('\n5️⃣ Verificação final:')
      console.log('   Telefone editado:', telefoneEditado)
      console.log('   Telefone após recarregar:', dadosRecarregados.data.telefone)
      console.log('   Telefone preservado:', telefonePreservado ? '✅' : '❌')
      
      if (telefonePreservado) {
        console.log('\n🎉 COMPORTAMENTO CORRETO! Telefone foi preservado após recarregar.')
      } else {
        console.log('\n⚠️ PROBLEMA IDENTIFICADO! Telefone voltou ao valor anterior após recarregar.')
        console.log('   Isso explica por que o usuário vê o telefone "voltar" ao valor antigo.')
        
        // Investigar mais
        console.log('\n🔍 Investigação adicional:')
        
        // Verificar se há cache ou delay
        console.log('   Aguardando 3 segundos e verificando novamente...')
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const verificacaoFinal = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
        if (verificacaoFinal.ok) {
          const dadosFinais = await verificacaoFinal.json()
          console.log('   Telefone após 3 segundos:', dadosFinais.data.telefone)
          
          const telefoneCorrigido = dadosFinais.data.telefone === telefoneEditado
          console.log('   Telefone corrigido após delay:', telefoneCorrigido ? '✅' : '❌')
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro na simulação:', error)
  }
}

simularComportamentoUsuario()