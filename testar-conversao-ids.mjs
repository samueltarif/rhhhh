#!/usr/bin/env node

// Testar conversão de IDs para nomes

async function testarConversao() {
  console.log('🧪 Testando conversão de IDs para nomes...\n')

  try {
    // 1. Carregar dados das APIs
    console.log('1️⃣ Carregando dados das APIs...')
    
    const [cargosRes, deptosRes, empresasRes, meusRes] = await Promise.all([
      fetch('http://localhost:3000/api/cargos').then(r => r.json()),
      fetch('http://localhost:3000/api/departamentos').then(r => r.json()),
      fetch('http://localhost:3000/api/empresas').then(r => r.json()),
      fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=130').then(r => r.json())
    ])

    // 2. Criar mapas
    console.log('2️⃣ Criando mapas de conversão...')
    
    const cargosMap = {}
    if (cargosRes.success && cargosRes.data) {
      cargosRes.data.forEach(c => {
        cargosMap[c.id.toString()] = c.nome
      })
    }
    
    const departamentosMap = {}
    if (deptosRes.success && deptosRes.data) {
      deptosRes.data.forEach(d => {
        departamentosMap[d.id.toString()] = d.nome
      })
    }
    
    const empresasMap = {}
    if (empresasRes.success && empresasRes.data) {
      empresasRes.data.forEach(e => {
        empresasMap[e.id.toString()] = e.nome_fantasia || e.nome
      })
    }

    console.log('📋 Mapas criados:')
    console.log('   Cargos:', Object.keys(cargosMap).length, 'itens')
    console.log('   Departamentos:', Object.keys(departamentosMap).length, 'itens')
    console.log('   Empresas:', Object.keys(empresasMap).length, 'itens')

    // 3. Testar conversão com dados reais
    if (meusRes.success && meusRes.data) {
      console.log('\n3️⃣ Testando conversão com dados reais:')
      console.log('   Funcionário:', meusRes.data.nome_completo)
      
      const cargoId = meusRes.data.cargo_id?.toString()
      const departamentoId = meusRes.data.departamento_id?.toString()
      const empresaId = meusRes.data.empresa_id?.toString()
      
      console.log('\n   🔍 IDs recebidos:')
      console.log('      Cargo ID:', cargoId, '(tipo:', typeof meusRes.data.cargo_id, ')')
      console.log('      Departamento ID:', departamentoId, '(tipo:', typeof meusRes.data.departamento_id, ')')
      console.log('      Empresa ID:', empresaId, '(tipo:', typeof meusRes.data.empresa_id, ')')
      
      console.log('\n   ✨ Conversões:')
      console.log('      Cargo:', cargoId, '→', cargosMap[cargoId] || 'NÃO ENCONTRADO')
      console.log('      Departamento:', departamentoId, '→', departamentosMap[departamentoId] || 'NÃO ENCONTRADO')
      console.log('      Empresa:', empresaId, '→', empresasMap[empresaId] || 'NÃO ENCONTRADO')
      
      // 4. Verificar se os IDs existem nos mapas
      console.log('\n4️⃣ Verificação de existência:')
      console.log('   Cargo ID', cargoId, 'existe no mapa?', cargoId in cargosMap)
      console.log('   Departamento ID', departamentoId, 'existe no mapa?', departamentoId in departamentosMap)
      console.log('   Empresa ID', empresaId, 'existe no mapa?', empresaId in empresasMap)
      
      // 5. Mostrar conteúdo dos mapas para debug
      console.log('\n5️⃣ Conteúdo dos mapas:')
      console.log('   Cargos disponíveis:', Object.keys(cargosMap))
      console.log('   Departamentos disponíveis:', Object.keys(departamentosMap))
      console.log('   Empresas disponíveis:', Object.keys(empresasMap))
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testarConversao()