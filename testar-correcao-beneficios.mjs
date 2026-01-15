import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testarCorrecaoBeneficios() {
  console.log('🔧 TESTANDO CORREÇÃO DE BENEFÍCIOS')
  console.log('=' .repeat(50))
  
  try {
    // 1. Excluir holerites antigos para recriar
    console.log('\n1️⃣ EXCLUINDO HOLERITES ANTIGOS')
    const { error: deleteError } = await supabase
      .from('holerites')
      .delete()
      .gte('id', 1)
    
    if (deleteError) {
      console.log('⚠️ Erro ao excluir (pode ser normal):', deleteError.message)
    } else {
      console.log('✅ Holerites antigos excluídos')
    }
    
    // 2. Gerar novos holerites
    console.log('\n2️⃣ GERANDO NOVOS HOLERITES')
    
    const response = await fetch('http://localhost:3000/api/holerites/gerar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        periodo_inicio: '2026-01-01',
        periodo_fim: '2026-01-15',
        recriar: true
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Erro na API')
    }
    
    console.log('✅ Resultado da geração:', result)
    
    // 3. Verificar holerites gerados
    console.log('\n3️⃣ VERIFICANDO HOLERITES GERADOS')
    
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select(`
        id, 
        funcionario_id,
        funcionarios(nome_completo, salario_base),
        salario_base,
        base_irrf,
        irrf,
        faixa_irrf,
        beneficios,
        descontos_personalizados,
        total_proventos,
        total_descontos,
        salario_liquido
      `)
      .order('created_at', { ascending: false })
    
    if (holeriteError) throw holeriteError
    
    console.log(`📊 Total de holerites: ${holerites.length}`)
    
    holerites.forEach(holerite => {
      const func = holerite.funcionarios
      console.log(`\n📄 Holerite ID: ${holerite.id}`)
      console.log(`   👤 Funcionário: ${func.nome_completo}`)
      console.log(`   💰 Salário Base: R$ ${holerite.salario_base}`)
      console.log(`   📊 Base IRRF: R$ ${holerite.base_irrf}`)
      console.log(`   🏛️ IRRF: R$ ${holerite.irrf} (${holerite.faixa_irrf})`)
      console.log(`   📊 Total Proventos: R$ ${holerite.total_proventos}`)
      console.log(`   📊 Total Descontos: R$ ${holerite.total_descontos}`)
      console.log(`   💵 Salário Líquido: R$ ${holerite.salario_liquido}`)
      
      // Verificar benefícios
      if (holerite.beneficios && holerite.beneficios.length > 0) {
        console.log(`   ✅ Benefícios encontrados:`)
        holerite.beneficios.forEach(beneficio => {
          console.log(`      🎁 ${beneficio.tipo}: +R$ ${beneficio.valor} / -R$ ${beneficio.desconto || 0}`)
        })
      } else {
        console.log(`   ❌ NENHUM BENEFÍCIO ENCONTRADO`)
      }
      
      // Verificar descontos
      if (holerite.descontos_personalizados && holerite.descontos_personalizados.length > 0) {
        console.log(`   ✅ Descontos encontrados:`)
        holerite.descontos_personalizados.forEach(desconto => {
          console.log(`      📉 ${desconto.tipo}: -R$ ${desconto.valor}`)
        })
      } else {
        console.log(`   ⚠️ Nenhum desconto personalizado`)
      }
      
      // Verificar problemas
      if (holerite.base_irrf <= 5000 && holerite.irrf > 0) {
        console.log(`   ❌ PROBLEMA: IRRF sendo cobrado com base ≤ R$ 5.000!`)
      } else if (holerite.base_irrf <= 5000) {
        console.log(`   ✅ IRRF correto: isento com base ≤ R$ 5.000`)
      }
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarCorrecaoBeneficios()