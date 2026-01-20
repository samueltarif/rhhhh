import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🧪 TESTE: Visibilidade de Folha Mensal no Perfil do Funcionário\n')
console.log('=' .repeat(80))

// Função para buscar um funcionário ativo
async function buscarFuncionario() {
  console.log('\n📋 1. Buscando funcionário ativo...')
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/funcionarios?status=eq.ativo&select=id,nome_completo,email_login&limit=1`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  const funcionarios = await response.json()
  
  if (!funcionarios || funcionarios.length === 0) {
    throw new Error('Nenhum funcionário ativo encontrado')
  }
  
  const funcionario = funcionarios[0]
  console.log(`   ✅ Funcionário: ${funcionario.nome_completo} (ID: ${funcionario.id})`)
  console.log(`   📧 Email: ${funcionario.email_login}`)
  
  return funcionario
}

// Função para gerar folha mensal
async function gerarFolhaMensal(funcionarioId) {
  console.log('\n📄 2. Gerando folha mensal...')
  
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const ultimoDia = new Date(ano, hoje.getMonth() + 1, 0).getDate()
  
  const periodo_inicio = `${ano}-${mes}-01`
  const periodo_fim = `${ano}-${mes}-${String(ultimoDia).padStart(2, '0')}`
  
  console.log(`   📅 Período: ${periodo_inicio} a ${periodo_fim}`)
  
  const response = await fetch(`${BASE_URL}/api/holerites/gerar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      periodo_inicio,
      periodo_fim,
      funcionario_ids: [funcionarioId],
      tipo: 'mensal',
      recriar: true // Recriar se já existir
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erro ao gerar folha: ${error}`)
  }
  
  const resultado = await response.json()
  console.log(`   ✅ ${resultado.message}`)
  
  return resultado
}

// Função para buscar holerite gerado diretamente no banco
async function buscarHoleriteBanco(funcionarioId) {
  console.log('\n🔍 3. Verificando holerite no banco de dados...')
  
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&periodo_inicio=gte.${ano}-${mes}-01&periodo_fim=gt.${ano}-${mes}-15&select=id,status,periodo_inicio,periodo_fim,salario_liquido&order=created_at.desc&limit=1`,
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
    throw new Error('Holerite não encontrado no banco')
  }
  
  const holerite = holerites[0]
  console.log(`   ✅ Holerite encontrado no banco:`)
  console.log(`      ID: ${holerite.id}`)
  console.log(`      Status: ${holerite.status}`)
  console.log(`      Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
  console.log(`      Salário Líquido: R$ ${holerite.salario_liquido.toFixed(2)}`)
  
  return holerite
}

// Função para buscar holerites visíveis no perfil
async function buscarHoleritesVisiveis(funcionarioId) {
  console.log('\n👤 4. Verificando holerites visíveis no perfil do funcionário...')
  
  const response = await fetch(
    `${BASE_URL}/api/holerites/meus-holerites?funcionarioId=${funcionarioId}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erro ao buscar holerites visíveis: ${error}`)
  }
  
  const holerites = await response.json()
  
  console.log(`   📊 Total de holerites visíveis: ${holerites.length}`)
  
  if (holerites.length > 0) {
    console.log(`   📋 Holerites visíveis:`)
    holerites.forEach((h, i) => {
      console.log(`      ${i + 1}. ID: ${h.id} | Status: ${h.status} | Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
    })
  }
  
  return holerites
}

// Função para verificar se o holerite gerado está visível
function verificarVisibilidade(holeriteBanco, holeritesPerfil) {
  console.log('\n🔍 5. Verificando visibilidade...')
  
  const holeriteVisivel = holeritesPerfil.find(h => h.id === holeriteBanco.id)
  
  if (holeriteVisivel) {
    console.log(`   ❌ ERRO: Holerite com status "${holeriteBanco.status}" está VISÍVEL no perfil!`)
    console.log(`   ⚠️ Holerites com status "gerado" NÃO deveriam aparecer no perfil`)
    return false
  } else {
    console.log(`   ✅ CORRETO: Holerite com status "${holeriteBanco.status}" NÃO está visível no perfil`)
    console.log(`   ✅ Apenas holerites com status "enviado" ou "visualizado" aparecem`)
    return true
  }
}

// Função para disponibilizar holerite
async function disponibilizarHolerite(holeriteId) {
  console.log('\n📤 6. Disponibilizando holerite no perfil...')
  
  const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'visualizado'
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erro ao disponibilizar: ${error}`)
  }
  
  const resultado = await response.json()
  console.log(`   ✅ Holerite disponibilizado com sucesso`)
  console.log(`   📊 Novo status: ${resultado.status}`)
  
  return resultado
}

// Função para verificar visibilidade após disponibilização
async function verificarAposDisponibilizar(funcionarioId, holeriteId) {
  console.log('\n👤 7. Verificando visibilidade após disponibilização...')
  
  const holerites = await buscarHoleritesVisiveis(funcionarioId)
  const holeriteVisivel = holerites.find(h => h.id === holeriteId)
  
  if (holeriteVisivel) {
    console.log(`   ✅ CORRETO: Holerite agora está VISÍVEL no perfil`)
    console.log(`   ✅ Status: ${holeriteVisivel.status}`)
    return true
  } else {
    console.log(`   ❌ ERRO: Holerite ainda NÃO está visível no perfil`)
    return false
  }
}

// Executar teste
async function executarTeste() {
  try {
    console.log('🎯 Objetivo: Verificar se folhas mensais geradas ficam ocultas até serem disponibilizadas\n')
    
    // 1. Buscar funcionário
    const funcionario = await buscarFuncionario()
    
    // 2. Gerar folha mensal
    await gerarFolhaMensal(funcionario.id)
    
    // 3. Buscar holerite no banco
    const holeriteBanco = await buscarHoleriteBanco(funcionario.id)
    
    // 4. Buscar holerites visíveis no perfil
    const holeritesPerfil = await buscarHoleritesVisiveis(funcionario.id)
    
    // 5. Verificar se está oculto
    const estaOculto = verificarVisibilidade(holeriteBanco, holeritesPerfil)
    
    if (!estaOculto) {
      console.log('\n' + '='.repeat(80))
      console.log('❌ TESTE FALHOU: Holerite gerado está visível no perfil')
      console.log('🔧 AÇÃO NECESSÁRIA: Corrigir a API de geração para não disponibilizar automaticamente')
      console.log('='.repeat(80))
      process.exit(1)
    }
    
    // 6. Disponibilizar holerite
    await disponibilizarHolerite(holeriteBanco.id)
    
    // 7. Verificar se agora está visível
    const agoraVisivel = await verificarAposDisponibilizar(funcionario.id, holeriteBanco.id)
    
    if (!agoraVisivel) {
      console.log('\n' + '='.repeat(80))
      console.log('❌ TESTE FALHOU: Holerite não ficou visível após disponibilização')
      console.log('='.repeat(80))
      process.exit(1)
    }
    
    // Teste passou!
    console.log('\n' + '='.repeat(80))
    console.log('✅ TESTE PASSOU COM SUCESSO!')
    console.log('✅ Folhas mensais são geradas com status "gerado" (ocultas)')
    console.log('✅ Apenas após disponibilização manual ficam visíveis no perfil')
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message)
    process.exit(1)
  }
}

// Executar
executarTeste()
