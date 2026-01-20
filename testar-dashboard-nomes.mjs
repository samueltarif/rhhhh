#!/usr/bin/env node

// Testar conversão de nomes no dashboard

async function testarDashboard() {
  console.log('🧪 Testando conversão de nomes no dashboard...\n')

  try {
    // 1. Buscar dados do funcionário MACIEL CARVALHO (ID: 129)
    console.log('1️⃣ Buscando dados do funcionário...')
    const meusResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=129')
    
    if (!meusResponse.ok) {
      throw new Error(`Erro na API: ${meusResponse.status}`)
    }
    
    const meusData = await meusResponse.json()
    console.log('✅ Dados do funcionário:')
    console.log('   Nome:', meusData.data.nome_completo)
    console.log('   Cargo ID:', meusData.data.cargo_id)
    console.log('   Departamento ID:', meusData.data.departamento_id)
    console.log('   Empresa ID:', meusData.data.empresa_id)

    // 2. Buscar dados das tabelas de referência
    console.log('\n2️⃣ Buscando dados de referência...')
    const [cargosRes, deptosRes] = await Promise.all([
      fetch('http://localhost:3000/api/cargos').then(r => r.json()),
      fetch('http://localhost:3000/api/departamentos').then(r => r.json())
    ])

    // 3. Criar mapas de conversão (simulando o dashboard)
    console.log('3️⃣ Criando mapas de conversão...')
    const cargosMap = {}
    const departamentosMap = {}

    if (cargosRes.success && cargosRes.data) {
      cargosRes.data.forEach(c => {
        cargosMap[c.id.toString()] = c.nome
      })
    }

    if (deptosRes.success && deptosRes.data) {
      deptosRes.data.forEach(d => {
        departamentosMap[d.id.toString()] = d.nome
      })
    }

    // 4. Simular as funções do dashboard
    const obterNomeCargo = (id) => {
      const idStr = id?.toString()
      return cargosMap[idStr] || idStr || 'Não informado'
    }

    const obterNomeDepartamento = (id) => {
      const idStr = id?.toString()
      return departamentosMap[idStr] || idStr || 'Não informado'
    }

    // 5. Testar conversões
    console.log('\n4️⃣ Testando conversões no dashboard...')
    const cargoNome = obterNomeCargo(meusData.data.cargo_id)
    const departamentoNome = obterNomeDepartamento(meusData.data.departamento_id)

    console.log('   Cargo:', meusData.data.cargo_id, '→', cargoNome)
    console.log('   Departamento:', meusData.data.departamento_id, '→', departamentoNome)

    // 6. Simular o que deve aparecer no dashboard
    console.log('\n5️⃣ Dashboard esperado:')
    console.log('   Seção "Suas Informações":')
    console.log('      Nome Completo:', meusData.data.nome_completo)
    console.log('      Cargo:', cargoNome, '(em vez de', meusData.data.cargo_id + ')')
    console.log('      Departamento:', departamentoNome, '(em vez de', meusData.data.departamento_id + ')')
    
    if (meusData.data.empresas) {
      console.log('      Empresa:', meusData.data.empresas.nome_fantasia || meusData.data.empresas.nome)
      console.log('      CNPJ:', meusData.data.empresas.cnpj)
    }

    // 7. Verificação
    console.log('\n6️⃣ Verificação:')
    console.log('   ✅ Cargo convertido corretamente:', cargoNome === 'ASSISTENTE DE PRODUÇÃO')
    console.log('   ✅ Departamento convertido corretamente:', departamentoNome === 'MONTAGEM')
    console.log('   ✅ Não mostra mais IDs numéricos:', cargoNome !== '9' && departamentoNome !== '12')

    console.log('\n🎯 Resultado esperado:')
    console.log('   ❌ ANTES: Cargo: 9, Departamento: 12')
    console.log('   ✅ DEPOIS: Cargo: ASSISTENTE DE PRODUÇÃO, Departamento: MONTAGEM')

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarDashboard()