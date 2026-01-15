import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testarDescontosEspecifico() {
  console.log('🔍 TESTANDO DESCONTOS ESPECÍFICOS')
  console.log('=' .repeat(50))
  
  try {
    // 1. Verificar funcionários com descontos configurados
    console.log('\n1️⃣ FUNCIONÁRIOS COM DESCONTOS CONFIGURADOS')
    const { data: funcionarios, error: funcError } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base, beneficios')
      .eq('status', 'ativo')
    
    if (funcError) throw funcError
    
    const funcionariosComDescontos = funcionarios.filter(func => {
      if (!func.beneficios) return false
      
      // Verificar se tem vale transporte com desconto
      if (func.beneficios.vale_transporte?.ativo && func.beneficios.vale_transporte.tipo_desconto === 'percentual') {
        return true
      }
      
      // Verificar se tem vale refeição com desconto
      if (func.beneficios.vale_refeicao?.ativo && func.beneficios.vale_refeicao.tipo_desconto === 'percentual') {
        return true
      }
      
      // Verificar se tem plano de saúde com desconto
      if (func.beneficios.plano_saude?.ativo && func.beneficios.plano_saude.valor_funcionario > 0) {
        return true
      }
      
      return false
    })
    
    console.log(`📊 Funcionários com descontos: ${funcionariosComDescontos.length}`)
    
    funcionariosComDescontos.forEach(func => {
      console.log(`\n👤 ${func.nome_completo} (Salário: R$ ${func.salario_base})`)
      
      if (func.beneficios.vale_transporte?.ativo && func.beneficios.vale_transporte.tipo_desconto === 'percentual') {
        const percentual = func.beneficios.vale_transporte.percentual_desconto
        const desconto = func.salario_base * (parseFloat(percentual) / 100)
        console.log(`   🚌 Vale Transporte: ${percentual}% = R$ ${desconto.toFixed(2)}`)
      }
      
      if (func.beneficios.vale_refeicao?.ativo && func.beneficios.vale_refeicao.tipo_desconto === 'percentual') {
        const percentual = func.beneficios.vale_refeicao.percentual_desconto
        const desconto = func.salario_base * (parseFloat(percentual) / 100)
        console.log(`   🍽️ Vale Refeição: ${percentual}% = R$ ${desconto.toFixed(2)}`)
      }
      
      if (func.beneficios.plano_saude?.ativo && func.beneficios.plano_saude.valor_funcionario > 0) {
        console.log(`   🏥 Plano de Saúde: R$ ${func.beneficios.plano_saude.valor_funcionario}`)
      }
    })
    
    // 2. Verificar holerites desses funcionários
    console.log('\n\n2️⃣ VERIFICANDO HOLERITES DOS FUNCIONÁRIOS COM DESCONTOS')
    
    const funcionarioIds = funcionariosComDescontos.map(f => f.id)
    
    const { data: holerites, error: holeriteError } = await supabase
      .from('holerites')
      .select(`
        id, 
        funcionario_id,
        funcionarios(nome_completo),
        salario_base,
        beneficios,
        descontos_personalizados,
        total_proventos,
        total_descontos,
        salario_liquido
      `)
      .in('funcionario_id', funcionarioIds)
      .order('created_at', { ascending: false })
    
    if (holeriteError) throw holeriteError
    
    console.log(`📊 Holerites encontrados: ${holerites.length}`)
    
    holerites.forEach(holerite => {
      const func = funcionariosComDescontos.find(f => f.id === holerite.funcionario_id)
      console.log(`\n📄 Holerite ID: ${holerite.id} - ${holerite.funcionarios.nome_completo}`)
      console.log(`   💰 Salário Base: R$ ${holerite.salario_base}`)
      console.log(`   📊 Total Proventos: R$ ${holerite.total_proventos}`)
      console.log(`   📊 Total Descontos: R$ ${holerite.total_descontos}`)
      
      // Verificar benefícios no holerite
      if (holerite.beneficios && holerite.beneficios.length > 0) {
        console.log(`   ✅ Benefícios no holerite:`)
        holerite.beneficios.forEach(beneficio => {
          console.log(`      🎁 ${beneficio.tipo}: +R$ ${beneficio.valor} / -R$ ${beneficio.desconto || 0}`)
          
          // Verificar se o desconto está correto
          if (beneficio.desconto > 0) {
            console.log(`      ✅ DESCONTO ENCONTRADO: R$ ${beneficio.desconto}`)
          } else if (beneficio.tipo === 'Vale Transporte' && func?.beneficios.vale_transporte?.tipo_desconto === 'percentual') {
            console.log(`      ❌ DESCONTO ESPERADO MAS NÃO ENCONTRADO`)
          }
        })
      } else {
        console.log(`   ❌ NENHUM BENEFÍCIO NO HOLERITE`)
      }
      
      // Verificar descontos personalizados
      if (holerite.descontos_personalizados && holerite.descontos_personalizados.length > 0) {
        console.log(`   ✅ Descontos personalizados:`)
        holerite.descontos_personalizados.forEach(desconto => {
          console.log(`      📉 ${desconto.tipo}: -R$ ${desconto.valor}`)
        })
      } else {
        console.log(`   ⚠️ Nenhum desconto personalizado`)
      }
    })
    
    // 3. Gerar novo holerite para um funcionário específico com desconto
    console.log('\n\n3️⃣ GERANDO NOVO HOLERITE PARA TESTE')
    
    if (funcionariosComDescontos.length > 0) {
      const funcionarioTeste = funcionariosComDescontos[0]
      console.log(`🎯 Testando com: ${funcionarioTeste.nome_completo}`)
      
      // Excluir holerite existente
      await supabase
        .from('holerites')
        .delete()
        .eq('funcionario_id', funcionarioTeste.id)
      
      // Gerar novo
      const response = await fetch('http://localhost:3000/api/holerites/gerar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          funcionario_ids: [funcionarioTeste.id],
          periodo_inicio: '2026-01-01',
          periodo_fim: '2026-01-15',
          recriar: true
        })
      })
      
      const result = await response.json()
      console.log('📊 Resultado da geração:', result)
      
      // Verificar o holerite gerado
      const { data: novoHolerite } = await supabase
        .from('holerites')
        .select('*')
        .eq('funcionario_id', funcionarioTeste.id)
        .single()
      
      if (novoHolerite) {
        console.log('\n📄 NOVO HOLERITE GERADO:')
        console.log(`   💰 Salário Base: R$ ${novoHolerite.salario_base}`)
        console.log(`   📊 Total Proventos: R$ ${novoHolerite.total_proventos}`)
        console.log(`   📊 Total Descontos: R$ ${novoHolerite.total_descontos}`)
        console.log(`   🎁 Benefícios:`, JSON.stringify(novoHolerite.beneficios, null, 2))
        console.log(`   📉 Descontos:`, JSON.stringify(novoHolerite.descontos_personalizados, null, 2))
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarDescontosEspecifico()