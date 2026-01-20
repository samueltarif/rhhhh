import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🧪 TESTE: Pensão Alimentícia\n')
console.log('=' .repeat(80))

async function testarPensaoAlimenticia() {
  try {
    console.log('1️⃣ Verificando se a coluna pensao_alimenticia existe...')
    
    // Tentar buscar funcionários com pensao_alimenticia
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/funcionarios?select=id,nome_completo,salario_base,pensao_alimenticia,numero_dependentes&status=eq.ativo&limit=3`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.log('❌ Erro ao buscar funcionários:', error)
      
      if (error.includes('pensao_alimenticia')) {
        console.log('\n💡 A coluna pensao_alimenticia não existe no banco de dados')
        console.log('📋 Execute o SQL manualmente no Supabase:')
        console.log('   ALTER TABLE funcionarios ADD COLUMN pensao_alimenticia DECIMAL(10,2) DEFAULT 0.00;')
        return false
      }
      return false
    }
    
    const funcionarios = await response.json()
    console.log(`✅ Coluna existe! ${funcionarios.length} funcionário(s) encontrado(s)`)
    
    // 2. Testar atualização de pensão alimentícia
    console.log('\n2️⃣ Testando atualização de pensão alimentícia...')
    
    const funcionario = funcionarios[0]
    const valorPensao = 500.00
    
    console.log(`📝 Atualizando ${funcionario.nome_completo} com pensão de R$ ${valorPensao.toFixed(2)}`)
    
    const updateResponse = await fetch(`${BASE_URL}/api/funcionarios/meus-dados`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: funcionario.id,
        pensao_alimenticia: valorPensao
      })
    })
    
    if (!updateResponse.ok) {
      const error = await updateResponse.text()
      console.log('❌ Erro ao atualizar:', error)
      return false
    }
    
    const updateResult = await updateResponse.json()
    console.log('✅ Pensão alimentícia atualizada com sucesso!')
    
    // 3. Gerar holerite para testar cálculos
    console.log('\n3️⃣ Gerando holerite para testar cálculos...')
    
    const gerarResponse = await fetch(`${BASE_URL}/api/holerites/gerar`, {
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
    
    if (!gerarResponse.ok) {
      const error = await gerarResponse.text()
      console.log('❌ Erro ao gerar holerite:', error)
      return false
    }
    
    const gerarResult = await gerarResponse.json()
    console.log('✅ Holerite gerado com sucesso!')
    
    // 4. Buscar o holerite gerado
    console.log('\n4️⃣ Verificando holerite gerado...')
    
    const holeriteResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/holerites?funcionario_id=eq.${funcionario.id}&periodo_inicio=gte.2026-01-01&periodo_fim=lte.2026-01-31&select=*&order=created_at.desc&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const holerites = await holeriteResponse.json()
    const holerite = holerites[0]
    
    if (!holerite) {
      console.log('❌ Holerite não encontrado')
      return false
    }
    
    console.log('📊 Dados do holerite:')
    console.log(`   Salário Base: R$ ${holerite.salario_base.toFixed(2)}`)
    console.log(`   INSS: R$ ${holerite.inss.toFixed(2)}`)
    console.log(`   IRRF: R$ ${holerite.irrf.toFixed(2)}`)
    console.log(`   Base IRRF: R$ ${holerite.base_irrf.toFixed(2)}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos.toFixed(2)}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido.toFixed(2)}`)
    
    // 5. Calcular manualmente para verificar
    console.log('\n5️⃣ Verificando cálculos...')
    
    const salarioBruto = holerite.salario_base
    const inss = holerite.inss
    const dependentes = funcionario.numero_dependentes || 0
    const deducaoDependentes = dependentes * 189.59
    const baseIRRFEsperada = salarioBruto - inss - deducaoDependentes - valorPensao
    
    console.log(`📋 Cálculo manual da base IRRF:`)
    console.log(`   Salário Bruto: R$ ${salarioBruto.toFixed(2)}`)
    console.log(`   (-) INSS: R$ ${inss.toFixed(2)}`)
    console.log(`   (-) Dependentes (${dependentes}): R$ ${deducaoDependentes.toFixed(2)}`)
    console.log(`   (-) Pensão Alimentícia: R$ ${valorPensao.toFixed(2)}`)
    console.log(`   (=) Base IRRF Esperada: R$ ${baseIRRFEsperada.toFixed(2)}`)
    console.log(`   (=) Base IRRF Sistema: R$ ${holerite.base_irrf.toFixed(2)}`)
    
    const baseCorreta = Math.abs(baseIRRFEsperada - holerite.base_irrf) < 0.01
    console.log(`   ${baseCorreta ? '✅' : '❌'} Base IRRF ${baseCorreta ? 'correta' : 'incorreta'}`)
    
    // 6. Testar HTML do holerite
    console.log('\n6️⃣ Testando HTML do holerite...')
    
    const htmlResponse = await fetch(`${BASE_URL}/api/holerites/${holerite.id}/html`)
    
    if (!htmlResponse.ok) {
      console.log('❌ Erro ao gerar HTML')
      return false
    }
    
    const html = await htmlResponse.text()
    const temPensao = html.includes('PENSÃO ALIMENTÍCIA') && html.includes(valorPensao.toFixed(2).replace('.', ','))
    
    console.log(`   ${temPensao ? '✅' : '❌'} Pensão alimentícia ${temPensao ? 'aparece' : 'não aparece'} no HTML`)
    
    if (temPensao) {
      const match = html.match(/PENSÃO ALIMENTÍCIA.*?(\d+,\d{2})/s)
      if (match) {
        console.log(`   💰 Valor no HTML: R$ ${match[1]}`)
      }
    }
    
    // 7. Resultado final
    console.log('\n' + '='.repeat(80))
    console.log('📊 RESULTADO FINAL')
    console.log('='.repeat(80))
    
    const tudoOk = baseCorreta && temPensao
    
    if (tudoOk) {
      console.log('✅ PENSÃO ALIMENTÍCIA FUNCIONANDO PERFEITAMENTE!')
      console.log('✅ Dedução do IRRF aplicada corretamente')
      console.log('✅ Valor aparece no holerite HTML')
      console.log('✅ Cálculos estão corretos')
    } else {
      console.log('❌ HÁ PROBLEMAS COM A PENSÃO ALIMENTÍCIA!')
      if (!baseCorreta) console.log('❌ Base IRRF não está sendo calculada corretamente')
      if (!temPensao) console.log('❌ Pensão não aparece no HTML do holerite')
    }
    
    console.log('\n💡 BENEFÍCIOS DA PENSÃO ALIMENTÍCIA:')
    console.log('   • Dedução integral do IRRF (reduz imposto)')
    console.log('   • Aparece discriminada no holerite')
    console.log('   • Funcionário pode editar no perfil')
    console.log('   • Admin pode editar na gestão de funcionários')
    
    console.log('\n='.repeat(80))
    
    return tudoOk
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
    return false
  }
}

// Executar teste
testarPensaoAlimenticia()