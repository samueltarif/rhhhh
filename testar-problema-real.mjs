import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🔍 INVESTIGAÇÃO: Problema Real de Visualização\n')
console.log('=' .repeat(80))

async function buscarFuncionario() {
  console.log('\n1️⃣ Usando funcionário Silvana...')
  
  // Usar ID conhecido da Silvana
  const funcionario = {
    id: 1,
    nome_completo: 'Silvana',
    email_login: 'silvana@qualitec.ind.br'
  }
  
  console.log(`   ✅ ${funcionario.nome_completo} (ID: ${funcionario.id})`)
  
  return funcionario
}

async function buscarHoleritesMes(funcionarioId) {
  console.log('\n2️⃣ Buscando holerites de janeiro/2026...')
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&periodo_inicio=gte.2026-01-01&periodo_fim=lte.2026-01-31&select=id,status,periodo_inicio,periodo_fim,salario_liquido&order=periodo_fim.asc`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  const holerites = await response.json()
  
  console.log(`   📊 Total: ${holerites.length} holerite(s)`)
  
  holerites.forEach((h, i) => {
    const diaFim = new Date(h.periodo_fim).getDate()
    const tipo = diaFim <= 15 ? '💰 ADIANTAMENTO' : '📄 FOLHA MENSAL'
    console.log(`   ${i + 1}. ${tipo}`)
    console.log(`      ID: ${h.id}`)
    console.log(`      Status: ${h.status}`)
    console.log(`      Período: ${h.periodo_inicio} a ${h.periodo_fim}`)
    console.log(`      Líquido: R$ ${h.salario_liquido.toFixed(2)}`)
  })
  
  return holerites
}

async function testarAPIVisibilidade(funcionarioId) {
  console.log('\n3️⃣ Testando API de visibilidade (meus-holerites)...')
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/holerites/meus-holerites?funcionarioId=${funcionarioId}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.log(`   ❌ Erro: ${error}`)
      return []
    }
    
    const holerites = await response.json()
    
    console.log(`   📊 Holerites visíveis: ${holerites.length}`)
    
    holerites.forEach((h, i) => {
      const diaFim = new Date(h.periodo_fim).getDate()
      const tipo = diaFim <= 15 ? '💰 ADIANTAMENTO' : '📄 FOLHA MENSAL'
      console.log(`   ${i + 1}. ${tipo} - ID: ${h.id} - Status: ${h.status}`)
    })
    
    return holerites
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
    return []
  }
}

async function testarVisualizacaoHTML(holeriteId, tipo) {
  console.log(`\n4️⃣ Testando visualização HTML do ${tipo} (ID: ${holeriteId})...`)
  
  try {
    const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}/html`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log(`   ❌ ERRO:`)
      try {
        const errorJson = JSON.parse(errorText)
        console.log(`      Status: ${errorJson.statusCode}`)
        console.log(`      Mensagem: ${errorJson.message}`)
        if (errorJson.stack) {
          console.log(`      Stack:`)
          errorJson.stack.slice(0, 3).forEach(line => console.log(`        ${line}`))
        }
      } catch {
        console.log(`      ${errorText.substring(0, 200)}`)
      }
      return false
    }
    
    const html = await response.text()
    console.log(`   ✅ HTML gerado (${html.length} caracteres)`)
    
    // Verificar conteúdo
    const temNome = html.toLowerCase().includes('silvana')
    const temValor = html.includes(',') && (html.match(/\d+,\d{2}/g) || []).length > 0 // Valores formatados como 1.234,56
    const temPeriodo = html.includes('2026')
    
    console.log(`      Nome presente: ${temNome ? '✅' : '❌'}`)
    console.log(`      Valores presente: ${temValor ? '✅' : '❌'}`)
    console.log(`      Período presente: ${temPeriodo ? '✅' : '❌'}`)
    
    return temNome && temValor && temPeriodo
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
    return false
  }
}

async function testarDownloadPDF(holeriteId, tipo) {
  console.log(`\n5️⃣ Testando download PDF do ${tipo} (ID: ${holeriteId})...`)
  
  try {
    const response = await fetch(`${BASE_URL}/api/holerites/${holeriteId}/pdf`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log(`   ❌ ERRO:`)
      try {
        const errorJson = JSON.parse(errorText)
        console.log(`      Status: ${errorJson.statusCode}`)
        console.log(`      Mensagem: ${errorJson.message}`)
      } catch {
        console.log(`      ${errorText.substring(0, 200)}`)
      }
      return false
    }
    
    const contentType = response.headers.get('content-type')
    const content = await response.text()
    
    console.log(`   📄 Content-Type: ${contentType}`)
    console.log(`   📊 Tamanho: ${content.length} caracteres`)
    
    if (contentType.includes('text/html')) {
      console.log(`   ✅ HTML para impressão gerado`)
      return true
    } else if (contentType.includes('application/pdf')) {
      console.log(`   ✅ PDF gerado`)
      return true
    } else {
      console.log(`   ⚠️ Tipo inesperado`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
    return false
  }
}

async function executar() {
  try {
    // 1. Buscar Silvana
    const funcionario = await buscarFuncionario()
    
    // 2. Buscar holerites do mês
    const holerites = await buscarHoleritesMes(funcionario.id)
    
    if (holerites.length === 0) {
      console.log('\n⚠️ Nenhum holerite encontrado. Gerando...')
      
      // Gerar adiantamento
      await fetch(`${BASE_URL}/api/holerites/gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo_inicio: '2026-01-01',
          periodo_fim: '2026-01-15',
          funcionario_ids: [funcionario.id],
          tipo: 'adiantamento',
          recriar: true
        })
      })
      
      // Gerar folha mensal
      await fetch(`${BASE_URL}/api/holerites/gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo_inicio: '2026-01-01',
          periodo_fim: '2026-01-31',
          funcionario_ids: [funcionario.id],
          tipo: 'mensal',
          recriar: true
        })
      })
      
      console.log('   ✅ Holerites gerados')
      
      // Buscar novamente
      const novosHolerites = await buscarHoleritesMes(funcionario.id)
      holerites.push(...novosHolerites)
    }
    
    // 3. Testar API de visibilidade
    const holeritesPerfil = await testarAPIVisibilidade(funcionario.id)
    
    // Identificar tipos
    const adiantamento = holerites.find(h => new Date(h.periodo_fim).getDate() <= 15)
    const folhaMensal = holerites.find(h => new Date(h.periodo_fim).getDate() > 15)
    
    // 4. Verificar se folha mensal está disponibilizada
    if (folhaMensal && folhaMensal.status === 'gerado') {
      console.log('\n⚠️ Folha mensal não está disponibilizada. Disponibilizando...')
      
      await fetch(`${BASE_URL}/api/holerites/${folhaMensal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'visualizado' })
      })
      
      console.log('   ✅ Folha mensal disponibilizada')
      
      // Atualizar status local
      folhaMensal.status = 'visualizado'
    }
    
    // 5. Testar visualização e download
    console.log('\n' + '='.repeat(80))
    console.log('📊 TESTES DE VISUALIZAÇÃO E DOWNLOAD')
    console.log('='.repeat(80))
    
    let resultados = {
      adiantamento: { visivel: false, html: false, pdf: false },
      folhaMensal: { visivel: false, html: false, pdf: false }
    }
    
    if (adiantamento) {
      resultados.adiantamento.visivel = holeritesPerfil.some(h => h.id === adiantamento.id)
      resultados.adiantamento.html = await testarVisualizacaoHTML(adiantamento.id, 'ADIANTAMENTO')
      resultados.adiantamento.pdf = await testarDownloadPDF(adiantamento.id, 'ADIANTAMENTO')
    }
    
    if (folhaMensal) {
      // Buscar novamente após disponibilizar
      const holeritesPerfil2 = await testarAPIVisibilidade(funcionario.id)
      resultados.folhaMensal.visivel = holeritesPerfil2.some(h => h.id === folhaMensal.id)
      resultados.folhaMensal.html = await testarVisualizacaoHTML(folhaMensal.id, 'FOLHA MENSAL')
      resultados.folhaMensal.pdf = await testarDownloadPDF(folhaMensal.id, 'FOLHA MENSAL')
    }
    
    // Resultado final
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESULTADO FINAL')
    console.log('='.repeat(80))
    
    console.log('\n💰 ADIANTAMENTO:')
    console.log(`   Visível no perfil: ${resultados.adiantamento.visivel ? '✅' : '❌'}`)
    console.log(`   Visualização HTML: ${resultados.adiantamento.html ? '✅' : '❌'}`)
    console.log(`   Download/Impressão: ${resultados.adiantamento.pdf ? '✅' : '❌'}`)
    
    console.log('\n📄 FOLHA MENSAL:')
    console.log(`   Visível no perfil: ${resultados.folhaMensal.visivel ? '✅' : '❌'}`)
    console.log(`   Visualização HTML: ${resultados.folhaMensal.html ? '✅' : '❌'}`)
    console.log(`   Download/Impressão: ${resultados.folhaMensal.pdf ? '✅' : '❌'}`)
    
    const tudoOk = Object.values(resultados).every(r => r.visivel && r.html && r.pdf)
    
    if (tudoOk) {
      console.log('\n✅ TUDO FUNCIONANDO!')
    } else {
      console.log('\n❌ HÁ PROBLEMAS!')
      
      if (!resultados.folhaMensal.visivel) {
        console.log('\n🔧 PROBLEMA: Folha mensal não está visível')
        console.log('   Verifique se foi disponibilizada pelo admin')
      }
      if (!resultados.folhaMensal.html) {
        console.log('\n🔧 PROBLEMA: Erro ao gerar HTML da folha mensal')
        console.log('   Verifique os logs acima para detalhes do erro')
      }
      if (!resultados.folhaMensal.pdf) {
        console.log('\n🔧 PROBLEMA: Erro ao gerar PDF da folha mensal')
        console.log('   Verifique os logs acima para detalhes do erro')
      }
    }
    
    console.log('\n' + '='.repeat(80))
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    console.error(error.stack)
  }
}

executar()
