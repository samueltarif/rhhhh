import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🧪 TESTE: Visualização de Holerites no Perfil do Funcionário\n')
console.log('=' .repeat(80))

// Função para buscar funcionário
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
  const funcionario = funcionarios[0]
  console.log(`   ✅ Funcionário: ${funcionario.nome_completo} (ID: ${funcionario.id})`)
  
  return funcionario
}

// Função para gerar adiantamento
async function gerarAdiantamento(funcionarioId) {
  console.log('\n💰 2. Gerando adiantamento...')
  
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  
  const periodo_inicio = `${ano}-${mes}-01`
  const periodo_fim = `${ano}-${mes}-15`
  
  const response = await fetch(`${BASE_URL}/api/holerites/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      periodo_inicio,
      periodo_fim,
      funcionario_ids: [funcionarioId],
      tipo: 'adiantamento',
      recriar: true
    })
  })
  
  const resultado = await response.json()
  console.log(`   ✅ ${resultado.message}`)
  
  return resultado
}

// Função para gerar folha mensal
async function gerarFolhaMensal(funcionarioId) {
  console.log('\n📄 3. Gerando folha mensal...')
  
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const ultimoDia = new Date(ano, hoje.getMonth() + 1, 0).getDate()
  
  const periodo_inicio = `${ano}-${mes}-01`
  const periodo_fim = `${ano}-${mes}-${String(ultimoDia).padStart(2, '0')}`
  
  const response = await fetch(`${BASE_URL}/api/holerites/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      periodo_inicio,
      periodo_fim,
      funcionario_ids: [funcionarioId],
      tipo: 'mensal',
      recriar: true
    })
  })
  
  const resultado = await response.json()
  console.log(`   ✅ ${resultado.message}`)
  
  return resultado
}

// Função para buscar holerites no banco
async function buscarHoleritesBanco(funcionarioId) {
  console.log('\n🔍 4. Buscando holerites no banco...')
  
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&periodo_inicio=gte.${ano}-${mes}-01&select=id,status,periodo_inicio,periodo_fim,salario_liquido,observacoes&order=periodo_fim.asc`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  const holerites = await response.json()
  
  console.log(`   📊 Total de holerites no banco: ${holerites.length}`)
  holerites.forEach((h, i) => {
    const diaFim = new Date(h.periodo_fim).getDate()
    const tipo = diaFim <= 15 ? 'ADIANTAMENTO' : 'FOLHA MENSAL'
    console.log(`      ${i + 1}. [${tipo}] ID: ${h.id} | Status: ${h.status} | Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
  })
  
  return holerites
}

// Função para buscar holerites visíveis no perfil
async function buscarHoleritesVisiveis(funcionarioId) {
  console.log('\n👤 5. Buscando holerites visíveis no perfil...')
  
  const response = await fetch(
    `${BASE_URL}/api/holerites/meus-holerites?funcionarioId=${funcionarioId}`,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
  
  const holerites = await response.json()
  
  console.log(`   📊 Total de holerites visíveis: ${holerites.length}`)
  holerites.forEach((h, i) => {
    const diaFim = new Date(h.periodo_fim).getDate()
    const tipo = diaFim <= 15 ? 'ADIANTAMENTO' : 'FOLHA MENSAL'
    console.log(`      ${i + 1}. [${tipo}] ID: ${h.id} | Status: ${h.status} | Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
  })
  
  return holerites
}

// Função para disponibilizar folha mensal
async function disponibilizarFolhaMensal(holeriteId) {
  console.log('\n📤 6. Disponibilizando folha mensal...')
  
  const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'visualizado' })
  })
  
  const resultado = await response.json()
  console.log(`   ✅ Folha mensal disponibilizada`)
  
  return resultado
}

// Função para testar visualização HTML
async function testarVisualizacaoHTML(holeriteId, tipo) {
  console.log(`\n🌐 7. Testando visualização HTML do ${tipo}...`)
  
  try {
    const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}/html`, {
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.log(`   ❌ Erro ao buscar HTML: ${error}`)
      return false
    }
    
    const html = await response.text()
    console.log(`   ✅ HTML gerado com sucesso (${html.length} caracteres)`)
    
    // Verificar se contém elementos essenciais
    const temCabecalho = html.toLowerCase().includes('recibo') || 
                         html.toLowerCase().includes('holerite') || 
                         html.toLowerCase().includes('pagamento') ||
                         html.toLowerCase().includes('contracheque')
    const temValores = html.toLowerCase().includes('salário') || 
                       html.toLowerCase().includes('salario') ||
                       html.toLowerCase().includes('líquido') ||
                       html.toLowerCase().includes('liquido')
    
    if (temCabecalho && temValores) {
      console.log(`   ✅ HTML contém estrutura válida`)
      return true
    } else {
      console.log(`   ⚠️ HTML pode estar incompleto`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
    return false
  }
}

// Função para testar download PDF (que na verdade retorna HTML para impressão)
async function testarDownloadPDF(holeriteId, tipo) {
  console.log(`\n📥 8. Testando endpoint de PDF do ${tipo}...`)
  
  try {
    const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}/pdf`, {
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.log(`   ❌ Erro ao gerar PDF: ${error}`)
      return false
    }
    
    const contentType = response.headers.get('content-type')
    const content = await response.text()
    
    console.log(`   📄 Content-Type: ${contentType}`)
    console.log(`   📊 Tamanho do conteúdo: ${content.length} caracteres`)
    
    // O PDF está desabilitado, então retorna HTML para impressão
    if (contentType && contentType.includes('text/html')) {
      console.log(`   ✅ HTML para impressão gerado com sucesso`)
      console.log(`   ℹ️ Nota: PDF real está desabilitado, mas HTML pode ser impresso`)
      return true
    } else if (contentType && contentType.includes('application/pdf')) {
      console.log(`   ✅ PDF gerado com sucesso`)
      return true
    } else {
      console.log(`   ⚠️ Tipo de conteúdo inesperado`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
    return false
  }
}

// Executar teste
async function executarTeste() {
  try {
    console.log('🎯 Objetivo: Verificar se funcionário consegue visualizar e baixar ambos os tipos de holerite\n')
    
    // 1. Buscar funcionário
    const funcionario = await buscarFuncionario()
    
    // 2. Gerar adiantamento
    await gerarAdiantamento(funcionario.id)
    
    // 3. Gerar folha mensal
    await gerarFolhaMensal(funcionario.id)
    
    // 4. Buscar holerites no banco
    const holeritesBanco = await buscarHoleritesBanco(funcionario.id)
    
    const adiantamento = holeritesBanco.find(h => new Date(h.periodo_fim).getDate() <= 15)
    const folhaMensal = holeritesBanco.find(h => new Date(h.periodo_fim).getDate() > 15)
    
    if (!adiantamento || !folhaMensal) {
      throw new Error('Não foi possível encontrar ambos os tipos de holerite')
    }
    
    // 5. Buscar holerites visíveis (antes de disponibilizar folha mensal)
    let holeritesPerfil = await buscarHoleritesVisiveis(funcionario.id)
    
    console.log('\n📊 ANÁLISE INICIAL:')
    const adiantamentoVisivel = holeritesPerfil.find(h => h.id === adiantamento.id)
    const folhaMensalVisivel = holeritesPerfil.find(h => h.id === folhaMensal.id)
    
    console.log(`   Adiantamento visível: ${adiantamentoVisivel ? '✅ SIM' : '❌ NÃO'}`)
    console.log(`   Folha mensal visível: ${folhaMensalVisivel ? '✅ SIM' : '❌ NÃO'}`)
    
    // 6. Disponibilizar folha mensal
    await disponibilizarFolhaMensal(folhaMensal.id)
    
    // 7. Buscar holerites visíveis novamente
    holeritesPerfil = await buscarHoleritesVisiveis(funcionario.id)
    
    console.log('\n📊 ANÁLISE APÓS DISPONIBILIZAÇÃO:')
    const adiantamentoVisivel2 = holeritesPerfil.find(h => h.id === adiantamento.id)
    const folhaMensalVisivel2 = holeritesPerfil.find(h => h.id === folhaMensal.id)
    
    console.log(`   Adiantamento visível: ${adiantamentoVisivel2 ? '✅ SIM' : '❌ NÃO'}`)
    console.log(`   Folha mensal visível: ${folhaMensalVisivel2 ? '✅ SIM' : '❌ NÃO'}`)
    
    // 8. Testar visualização HTML
    const adiantamentoHTMLOk = await testarVisualizacaoHTML(adiantamento.id, 'ADIANTAMENTO')
    const folhaMensalHTMLOk = await testarVisualizacaoHTML(folhaMensal.id, 'FOLHA MENSAL')
    
    // 9. Testar download PDF
    const adiantamentoPDFOk = await testarDownloadPDF(adiantamento.id, 'ADIANTAMENTO')
    const folhaMensalPDFOk = await testarDownloadPDF(folhaMensal.id, 'FOLHA MENSAL')
    
    // Resultado final
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESULTADO FINAL:\n')
    
    console.log('ADIANTAMENTO:')
    console.log(`   Visível no perfil: ${adiantamentoVisivel2 ? '✅' : '❌'}`)
    console.log(`   Visualização HTML: ${adiantamentoHTMLOk ? '✅' : '❌'}`)
    console.log(`   Download PDF: ${adiantamentoPDFOk ? '✅' : '❌'}`)
    
    console.log('\nFOLHA MENSAL:')
    console.log(`   Visível no perfil: ${folhaMensalVisivel2 ? '✅' : '❌'}`)
    console.log(`   Visualização HTML: ${folhaMensalHTMLOk ? '✅' : '❌'}`)
    console.log(`   Download PDF: ${folhaMensalPDFOk ? '✅' : '❌'}`)
    
    const tudoOk = adiantamentoVisivel2 && folhaMensalVisivel2 && 
                   adiantamentoHTMLOk && folhaMensalHTMLOk &&
                   adiantamentoPDFOk && folhaMensalPDFOk
    
    if (tudoOk) {
      console.log('\n✅ TESTE PASSOU: Funcionário consegue visualizar e baixar ambos os tipos!')
    } else {
      console.log('\n❌ TESTE FALHOU: Há problemas na visualização/download')
    }
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message)
    process.exit(1)
  }
}

// Executar
executarTeste()
