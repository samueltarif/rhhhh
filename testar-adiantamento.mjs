import dotenv from 'dotenv'
dotenv.config()

const BASE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function testarAdiantamento() {
  console.log('🧪 Testando Sistema de Adiantamento\n')
  
  try {
    // 1. Gerar adiantamento
    console.log('1️⃣ Gerando adiantamento (40%)...')
    const resAdiantamento = await fetch(`${BASE_URL}/api/holerites/gerar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'adiantamento',
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-15',
        recriar: true
      })
    })
    
    const dataAdiantamento = await resAdiantamento.json()
    console.log('✅ Adiantamento gerado:', dataAdiantamento.message)
    console.log('')
    
    // 2. Buscar holerites de adiantamento
    console.log('2️⃣ Buscando holerites de adiantamento...')
    const resListaAdiantamento = await fetch(`${BASE_URL}/api/holerites`)
    const listaAdiantamento = await resListaAdiantamento.json()
    
    const adiantamentos = listaAdiantamento.filter(h => 
      h.periodo_fim === '2026-01-15' && h.observacoes?.includes('Adiantamento')
    )
    
    console.log(`📋 ${adiantamentos.length} adiantamento(s) encontrado(s)`)
    adiantamentos.forEach(h => {
      console.log(`   - ${h.funcionario.nome_completo}: R$ ${h.salario_base.toFixed(2)}`)
    })
    console.log('')
    
    // 3. Gerar folha mensal
    console.log('3️⃣ Gerando folha mensal...')
    const resMensal = await fetch(`${BASE_URL}/api/holerites/gerar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'mensal',
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-31',
        recriar: true
      })
    })
    
    const dataMensal = await resMensal.json()
    console.log('✅ Folha mensal gerada:', dataMensal.message)
    console.log('')
    
    // 4. Buscar holerites mensais e verificar desconto
    console.log('4️⃣ Verificando desconto de adiantamento...')
    const resListaMensal = await fetch(`${BASE_URL}/api/holerites`)
    const listaMensal = await resListaMensal.json()
    
    const mensais = listaMensal.filter(h => 
      h.periodo_fim === '2026-01-31'
    )
    
    console.log(`📋 ${mensais.length} holerite(s) mensal(is) encontrado(s)\n`)
    
    mensais.forEach(h => {
      console.log(`👤 ${h.funcionario.nome_completo}`)
      console.log(`   Salário Base: R$ ${h.salario_base.toFixed(2)}`)
      console.log(`   INSS: R$ ${(h.inss || 0).toFixed(2)}`)
      console.log(`   IRRF: R$ ${(h.irrf || 0).toFixed(2)}`)
      console.log(`   💰 Adiantamento: R$ ${(h.adiantamento || 0).toFixed(2)}`)
      console.log(`   Total Descontos: R$ ${h.total_descontos.toFixed(2)}`)
      console.log(`   💵 Líquido: R$ ${h.salario_liquido.toFixed(2)}`)
      
      if (h.adiantamento && h.adiantamento > 0) {
        console.log(`   ✅ Adiantamento foi descontado!`)
      } else {
        console.log(`   ❌ Adiantamento NÃO foi descontado!`)
      }
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testarAdiantamento()
