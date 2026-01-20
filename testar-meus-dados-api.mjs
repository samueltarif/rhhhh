#!/usr/bin/env node

// Testar APIs usadas na página meus-dados

async function testarAPIs() {
  console.log('🧪 Testando APIs da página Meus Dados...\n')

  try {
    // 1. Testar API de cargos
    console.log('1️⃣ Testando API de cargos...')
    try {
      const cargosResponse = await fetch('http://localhost:3000/api/cargos')
      console.log('Status cargos:', cargosResponse.status)
      
      if (cargosResponse.ok) {
        const cargosData = await cargosResponse.json()
        console.log('✅ API cargos funcionando:')
        console.log('   Success:', cargosData.success)
        console.log('   Dados:', cargosData.data?.length, 'cargos encontrados')
        if (cargosData.data?.length > 0) {
          console.log('   Exemplo:', cargosData.data[0])
        }
      } else {
        console.log('❌ Erro na API cargos')
      }
    } catch (error) {
      console.log('❌ Erro ao testar API cargos:', error.message)
    }

    // 2. Testar API de departamentos
    console.log('\n2️⃣ Testando API de departamentos...')
    try {
      const deptosResponse = await fetch('http://localhost:3000/api/departamentos')
      console.log('Status departamentos:', deptosResponse.status)
      
      if (deptosResponse.ok) {
        const deptosData = await deptosResponse.json()
        console.log('✅ API departamentos funcionando:')
        console.log('   Success:', deptosData.success)
        console.log('   Dados:', deptosData.data?.length, 'departamentos encontrados')
        if (deptosData.data?.length > 0) {
          console.log('   Exemplo:', deptosData.data[0])
        }
      } else {
        console.log('❌ Erro na API departamentos')
      }
    } catch (error) {
      console.log('❌ Erro ao testar API departamentos:', error.message)
    }

    // 3. Testar API de empresas
    console.log('\n3️⃣ Testando API de empresas...')
    try {
      const empresasResponse = await fetch('http://localhost:3000/api/empresas')
      console.log('Status empresas:', empresasResponse.status)
      
      if (empresasResponse.ok) {
        const empresasData = await empresasResponse.json()
        console.log('✅ API empresas funcionando:')
        console.log('   Success:', empresasData.success)
        console.log('   Dados:', empresasData.data?.length, 'empresas encontradas')
        if (empresasData.data?.length > 0) {
          console.log('   Exemplo:', empresasData.data[0])
        }
      } else {
        console.log('❌ Erro na API empresas')
      }
    } catch (error) {
      console.log('❌ Erro ao testar API empresas:', error.message)
    }

    // 4. Testar API meus-dados
    console.log('\n4️⃣ Testando API meus-dados...')
    try {
      const meusResponse = await fetch('http://localhost:3000/api/funcionarios/meus-dados?userId=130')
      console.log('Status meus-dados:', meusResponse.status)
      
      if (meusResponse.ok) {
        const meusData = await meusResponse.json()
        console.log('✅ API meus-dados funcionando:')
        console.log('   Success:', meusData.success)
        
        if (meusData.data) {
          console.log('   Nome:', meusData.data.nome_completo)
          console.log('   Cargo ID:', meusData.data.cargo_id)
          console.log('   Departamento ID:', meusData.data.departamento_id)
          console.log('   Empresa ID:', meusData.data.empresa_id)
          
          if (meusData.data.empresas) {
            console.log('   Empresa (join):', meusData.data.empresas.nome_fantasia || meusData.data.empresas.nome)
          }
        }
      } else {
        console.log('❌ Erro na API meus-dados')
        const errorText = await meusResponse.text()
        console.log('Erro:', errorText)
      }
    } catch (error) {
      console.log('❌ Erro ao testar API meus-dados:', error.message)
    }

    console.log('\n🎯 Diagnóstico:')
    console.log('Se as APIs de cargos, departamentos e empresas não estão funcionando,')
    console.log('os mapas de conversão ID → Nome não são criados,')
    console.log('resultando na exibição de números em vez de nomes.')

  } catch (error) {
    console.error('❌ Erro geral no teste:', error)
  }
}

testarAPIs()