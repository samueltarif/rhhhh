import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 DEBUG: API de HTML do Holerite\n')
console.log('=' .repeat(80))

async function testarQuery(holeriteId) {
  console.log(`\n📋 Testando query para holerite ID: ${holeriteId}`)
  
  // Query exata que a API usa
  const query = `
    *,
    funcionario:funcionario_id (
      nome_completo,
      cpf,
      cargo_id (nome),
      departamento_id (nome),
      empresa_id (
        nome,
        cnpj,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      )
    )
  `.replace(/\s+/g, ' ').trim()
  
  console.log('\n📝 Query SQL:')
  console.log(query)
  
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?id=eq.${holeriteId}&select=${encodeURIComponent(query)}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.log('\n❌ Erro na query:')
      console.log(error)
      return null
    }
    
    const data = await response.json()
    
    if (!data || data.length === 0) {
      console.log('\n❌ Nenhum resultado encontrado')
      return null
    }
    
    console.log('\n✅ Query executada com sucesso!')
    console.log('\n📦 Dados retornados:')
    console.log(JSON.stringify(data[0], null, 2))
    
    return data[0]
  } catch (error) {
    console.log('\n❌ Erro ao executar query:', error.message)
    return null
  }
}

async function testarQuerySimplificada(holeriteId) {
  console.log(`\n\n📋 Testando query SIMPLIFICADA para holerite ID: ${holeriteId}`)
  
  try {
    // Primeiro, buscar o holerite
    const response1 = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?id=eq.${holeriteId}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const holerites = await response1.json()
    
    if (!holerites || holerites.length === 0) {
      console.log('❌ Holerite não encontrado')
      return
    }
    
    const holerite = holerites[0]
    console.log('\n✅ Holerite encontrado:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Funcionário ID: ${holerite.funcionario_id}`)
    console.log(`   Status: ${holerite.status}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    
    // Buscar funcionário
    const response2 = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?id=eq.${holerite.funcionario_id}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const funcionarios = await response2.json()
    
    if (!funcionarios || funcionarios.length === 0) {
      console.log('❌ Funcionário não encontrado')
      return
    }
    
    const funcionario = funcionarios[0]
    console.log('\n✅ Funcionário encontrado:')
    console.log(`   Nome: ${funcionario.nome_completo}`)
    console.log(`   CPF: ${funcionario.cpf}`)
    console.log(`   Cargo ID: ${funcionario.cargo_id}`)
    console.log(`   Departamento ID: ${funcionario.departamento_id}`)
    console.log(`   Empresa ID: ${funcionario.empresa_id}`)
    
    // Buscar cargo
    if (funcionario.cargo_id) {
      const response3 = await fetch(
        `${SUPABASE_URL}/rest/v1/cargos?id=eq.${funcionario.cargo_id}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      const cargos = await response3.json()
      console.log(`\n✅ Cargo: ${cargos[0]?.nome || 'Não encontrado'}`)
    }
    
    // Buscar departamento
    if (funcionario.departamento_id) {
      const response4 = await fetch(
        `${SUPABASE_URL}/rest/v1/departamentos?id=eq.${funcionario.departamento_id}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      const departamentos = await response4.json()
      console.log(`✅ Departamento: ${departamentos[0]?.nome || 'Não encontrado'}`)
    }
    
    // Buscar empresa
    if (funcionario.empresa_id) {
      const response5 = await fetch(
        `${SUPABASE_URL}/rest/v1/empresas?id=eq.${funcionario.empresa_id}&select=*`,
        {
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      const empresas = await response5.json()
      console.log(`✅ Empresa: ${empresas[0]?.nome || 'Não encontrado'}`)
    }
    
  } catch (error) {
    console.log('\n❌ Erro:', error.message)
  }
}

async function executar() {
  // Buscar um holerite recente
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/holerites?select=id&order=created_at.desc&limit=1`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  const holerites = await response.json()
  
  if (!holerites || holerites.length === 0) {
    console.log('❌ Nenhum holerite encontrado no banco')
    return
  }
  
  const holeriteId = holerites[0].id
  
  // Testar query complexa
  await testarQuery(holeriteId)
  
  // Testar query simplificada
  await testarQuerySimplificada(holeriteId)
  
  console.log('\n' + '='.repeat(80))
  console.log('✅ Debug concluído')
  console.log('='.repeat(80))
}

executar()
