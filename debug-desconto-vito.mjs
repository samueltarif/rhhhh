import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function debugDescontoVito() {
  console.log('🔍 DEBUG DESCONTO VITO')
  console.log('=' .repeat(50))
  
  try {
    // 1. Buscar dados do VITO
    const { data: vito, error: vitoError } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('nome_completo', 'VITO')
      .single()
    
    if (vitoError) throw vitoError
    
    console.log('\n1️⃣ DADOS DO FUNCIONÁRIO VITO:')
    console.log(`   ID: ${vito.id}`)
    console.log(`   Nome: ${vito.nome_completo}`)
    console.log(`   Salário: R$ ${vito.salario_base}`)
    console.log(`   Benefícios:`, JSON.stringify(vito.beneficios, null, 2))
    
    // Calcular desconto esperado
    if (vito.beneficios?.vale_transporte?.ativo && vito.beneficios.vale_transporte.tipo_desconto === 'percentual') {
      const percentual = parseFloat(vito.beneficios.vale_transporte.percentual_desconto)
      const descontoEsperado = vito.salario_base * (percentual / 100)
      console.log(`   🚌 Desconto VT Esperado: ${percentual}% = R$ ${descontoEsperado.toFixed(2)}`)
    }
    
    // 2. Buscar holerite do VITO
    const { data: holerite, error: holeriteError } = await supabase
      .from('holerites')
      .select('*')
      .eq('funcionario_id', vito.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (holeriteError) throw holeriteError
    
    console.log('\n2️⃣ HOLERITE DO VITO:')
    console.log(`   ID: ${holerite.id}`)
    console.log(`   Salário Base: R$ ${holerite.salario_base}`)
    console.log(`   Total Proventos: R$ ${holerite.total_proventos}`)
    console.log(`   Total Descontos: R$ ${holerite.total_descontos}`)
    console.log(`   Salário Líquido: R$ ${holerite.salario_liquido}`)
    console.log(`   INSS: R$ ${holerite.inss}`)
    console.log(`   IRRF: R$ ${holerite.irrf}`)
    
    console.log('\n   🎁 BENEFÍCIOS NO HOLERITE:')
    if (holerite.beneficios && holerite.beneficios.length > 0) {
      holerite.beneficios.forEach(beneficio => {
        console.log(`      ${beneficio.tipo}: +R$ ${beneficio.valor} / -R$ ${beneficio.desconto || 0}`)
      })
    } else {
      console.log('      ❌ NENHUM BENEFÍCIO ENCONTRADO')
    }
    
    console.log('\n   📉 DESCONTOS PERSONALIZADOS:')
    if (holerite.descontos_personalizados && holerite.descontos_personalizados.length > 0) {
      holerite.descontos_personalizados.forEach(desconto => {
        console.log(`      ${desconto.tipo}: -R$ ${desconto.valor}`)
      })
    } else {
      console.log('      ⚠️ NENHUM DESCONTO PERSONALIZADO')
    }
    
    // 3. Verificar cálculo manual
    console.log('\n3️⃣ VERIFICAÇÃO MANUAL DOS CÁLCULOS:')
    
    let totalProventosCalculado = holerite.salario_base
    let totalDescontosCalculado = holerite.inss + holerite.irrf
    
    if (holerite.beneficios) {
      holerite.beneficios.forEach(beneficio => {
        totalProventosCalculado += beneficio.valor
        if (beneficio.desconto > 0) {
          totalDescontosCalculado += beneficio.desconto
        }
      })
    }
    
    if (holerite.descontos_personalizados) {
      holerite.descontos_personalizados.forEach(desconto => {
        totalDescontosCalculado += desconto.valor
      })
    }
    
    const salarioLiquidoCalculado = totalProventosCalculado - totalDescontosCalculado
    
    console.log(`   💰 Proventos Calculados: R$ ${totalProventosCalculado.toFixed(2)}`)
    console.log(`   📉 Descontos Calculados: R$ ${totalDescontosCalculado.toFixed(2)}`)
    console.log(`   💵 Líquido Calculado: R$ ${salarioLiquidoCalculado.toFixed(2)}`)
    
    console.log('\n4️⃣ COMPARAÇÃO:')
    console.log(`   Proventos: Salvo=${holerite.total_proventos} | Calculado=${totalProventosCalculado.toFixed(2)} | ${Math.abs(holerite.total_proventos - totalProventosCalculado) < 0.01 ? '✅' : '❌'}`)
    console.log(`   Descontos: Salvo=${holerite.total_descontos} | Calculado=${totalDescontosCalculado.toFixed(2)} | ${Math.abs(holerite.total_descontos - totalDescontosCalculado) < 0.01 ? '✅' : '❌'}`)
    console.log(`   Líquido: Salvo=${holerite.salario_liquido} | Calculado=${salarioLiquidoCalculado.toFixed(2)} | ${Math.abs(holerite.salario_liquido - salarioLiquidoCalculado) < 0.01 ? '✅' : '❌'}`)
    
    // 4. Verificar se o desconto está sendo aplicado
    console.log('\n5️⃣ ANÁLISE DO DESCONTO:')
    
    const beneficioVT = holerite.beneficios?.find(b => b.tipo === 'Vale Transporte')
    if (beneficioVT) {
      console.log(`   🚌 Vale Transporte encontrado:`)
      console.log(`      Valor: +R$ ${beneficioVT.valor}`)
      console.log(`      Desconto: -R$ ${beneficioVT.desconto || 0}`)
      
      if (beneficioVT.desconto > 0) {
        console.log(`   ✅ DESCONTO ESTÁ SENDO APLICADO!`)
      } else {
        console.log(`   ❌ DESCONTO NÃO ESTÁ SENDO APLICADO!`)
      }
    } else {
      console.log(`   ❌ VALE TRANSPORTE NÃO ENCONTRADO NO HOLERITE`)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

debugDescontoVito()