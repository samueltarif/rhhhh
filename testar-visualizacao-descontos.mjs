import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testarVisualizacaoDescontos() {
  console.log('🔍 TESTANDO VISUALIZAÇÃO DE DESCONTOS')
  console.log('=' .repeat(50))
  
  try {
    // Buscar holerites com benefícios e descontos
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select(`
        id,
        funcionario_id,
        funcionarios(nome_completo),
        salario_base,
        inss,
        irrf,
        beneficios,
        descontos_personalizados,
        total_proventos,
        total_descontos,
        salario_liquido
      `)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (error) throw error
    
    console.log(`📊 Holerites encontrados: ${holerites.length}`)
    
    holerites.forEach(holerite => {
      console.log(`\n📄 HOLERITE ID: ${holerite.id}`)
      console.log(`👤 Funcionário: ${holerite.funcionarios.nome_completo}`)
      console.log(`💰 Salário Base: R$ ${holerite.salario_base}`)
      
      // PROVENTOS
      console.log(`\n🟢 PROVENTOS:`)
      console.log(`   💰 Salário Base: R$ ${holerite.salario_base}`)
      
      if (holerite.beneficios && holerite.beneficios.length > 0) {
        holerite.beneficios.forEach(beneficio => {
          console.log(`   🎁 ${beneficio.tipo}: +R$ ${beneficio.valor}`)
        })
      }
      
      console.log(`   📊 TOTAL PROVENTOS: R$ ${holerite.total_proventos}`)
      
      // DESCONTOS
      console.log(`\n🔴 DESCONTOS:`)
      console.log(`   🏛️ INSS: -R$ ${holerite.inss}`)
      console.log(`   🏛️ IRRF: -R$ ${holerite.irrf}`)
      
      // Descontos de benefícios
      if (holerite.beneficios && holerite.beneficios.length > 0) {
        holerite.beneficios.forEach(beneficio => {
          if (beneficio.desconto > 0) {
            console.log(`   📉 ${beneficio.tipo} (Desconto): -R$ ${beneficio.desconto}`)
          }
        })
      }
      
      // Descontos personalizados
      if (holerite.descontos_personalizados && holerite.descontos_personalizados.length > 0) {
        holerite.descontos_personalizados.forEach(desconto => {
          console.log(`   📉 ${desconto.tipo}: -R$ ${desconto.valor}`)
        })
      }
      
      console.log(`   📊 TOTAL DESCONTOS: R$ ${holerite.total_descontos}`)
      console.log(`   💵 SALÁRIO LÍQUIDO: R$ ${holerite.salario_liquido}`)
      
      // Verificar se os descontos estão sendo exibidos corretamente
      let descontosCalculados = holerite.inss + holerite.irrf
      
      if (holerite.beneficios) {
        holerite.beneficios.forEach(beneficio => {
          if (beneficio.desconto > 0) {
            descontosCalculados += beneficio.desconto
          }
        })
      }
      
      if (holerite.descontos_personalizados) {
        holerite.descontos_personalizados.forEach(desconto => {
          descontosCalculados += desconto.valor
        })
      }
      
      if (Math.abs(descontosCalculados - holerite.total_descontos) > 0.01) {
        console.log(`   ❌ ERRO: Descontos não batem! Calculado: ${descontosCalculados}, Salvo: ${holerite.total_descontos}`)
      } else {
        console.log(`   ✅ Descontos corretos!`)
      }
    })
    
    // Testar estrutura para o frontend
    console.log('\n\n📱 ESTRUTURA PARA O FRONTEND:')
    
    const holeriteExemplo = holerites[0]
    if (holeriteExemplo) {
      console.log('```json')
      console.log(JSON.stringify({
        id: holeriteExemplo.id,
        funcionario: holeriteExemplo.funcionarios,
        salario_base: holeriteExemplo.salario_base,
        inss: holeriteExemplo.inss,
        irrf: holeriteExemplo.irrf,
        beneficios: holeriteExemplo.beneficios,
        descontos_personalizados: holeriteExemplo.descontos_personalizados,
        total_proventos: holeriteExemplo.total_proventos,
        total_descontos: holeriteExemplo.total_descontos,
        salario_liquido: holeriteExemplo.salario_liquido
      }, null, 2))
      console.log('```')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarVisualizacaoDescontos()