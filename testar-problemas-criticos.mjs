import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testarProblemasCriticos() {
  console.log('🔍 TESTANDO PROBLEMAS CRÍTICOS')
  console.log('=' .repeat(50))
  
  try {
    // 1. Verificar funcionários com benefícios
    console.log('\n1️⃣ VERIFICANDO FUNCIONÁRIOS COM BENEFÍCIOS')
    const { data: funcionarios, error: funcError } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base, beneficios, descontos_personalizados, numero_dependentes')
      .eq('status', 'ativo')
    
    if (funcError) throw funcError
    
    console.log(`📊 Total de funcionários ativos: ${funcionarios.length}`)
    
    funcionarios.forEach(func => {
      console.log(`\n👤 ${func.nome_completo}`)
      console.log(`   💰 Salário: R$ ${func.salario_base}`)
      console.log(`   👨‍👩‍👧‍👦 Dependentes: ${func.numero_dependentes || 0}`)
      console.log(`   🎁 Benefícios:`, func.beneficios ? 'SIM' : 'NÃO')
      console.log(`   📉 Descontos:`, func.descontos_personalizados ? 'SIM' : 'NÃO')
      
      if (func.beneficios) {
        console.log(`      Detalhes:`, JSON.stringify(func.beneficios, null, 6))
      }
      
      if (func.descontos_personalizados) {
        console.log(`      Descontos:`, JSON.stringify(func.descontos_personalizados, null, 6))
      }
    })
    
    // 2. Verificar holerites recentes
    console.log('\n\n2️⃣ VERIFICANDO HOLERITES RECENTES')
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
        salario_liquido,
        periodo_inicio,
        periodo_fim
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (holeriteError) throw holeriteError
    
    console.log(`📊 Últimos ${holerites.length} holerites:`)
    
    holerites.forEach(holerite => {
      const func = holerite.funcionarios
      console.log(`\n📄 Holerite ID: ${holerite.id}`)
      console.log(`   👤 Funcionário: ${func.nome_completo}`)
      console.log(`   💰 Salário Base: R$ ${holerite.salario_base}`)
      console.log(`   📊 Base IRRF: R$ ${holerite.base_irrf}`)
      console.log(`   🏛️ IRRF: R$ ${holerite.irrf} (${holerite.faixa_irrf})`)
      console.log(`   🎁 Benefícios no Holerite:`, holerite.beneficios ? 'SIM' : 'NÃO')
      console.log(`   📉 Descontos no Holerite:`, holerite.descontos_personalizados ? 'SIM' : 'NÃO')
      console.log(`   📅 Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
      
      if (holerite.beneficios && holerite.beneficios.length > 0) {
        console.log(`      Benefícios:`, JSON.stringify(holerite.beneficios, null, 6))
      }
      
      if (holerite.descontos_personalizados && holerite.descontos_personalizados.length > 0) {
        console.log(`      Descontos:`, JSON.stringify(holerite.descontos_personalizados, null, 6))
      }
      
      // PROBLEMA 1: IRRF sendo cobrado de quem ganha menos de R$ 5.000
      if (holerite.base_irrf <= 5000 && holerite.irrf > 0) {
        console.log(`   ❌ PROBLEMA CRÍTICO: IRRF sendo cobrado com base ≤ R$ 5.000!`)
      }
      
      // PROBLEMA 2: Funcionário tem benefícios mas não aparecem no holerite
      const funcCompleto = funcionarios.find(f => f.id === holerite.funcionario_id)
      if (funcCompleto && funcCompleto.beneficios && (!holerite.beneficios || holerite.beneficios.length === 0)) {
        console.log(`   ❌ PROBLEMA CRÍTICO: Funcionário tem benefícios mas não aparecem no holerite!`)
      }
      
      if (funcCompleto && funcCompleto.descontos_personalizados && (!holerite.descontos_personalizados || holerite.descontos_personalizados.length === 0)) {
        console.log(`   ❌ PROBLEMA CRÍTICO: Funcionário tem descontos mas não aparecem no holerite!`)
      }
    })
    
    // 3. Simular cálculo IRRF para verificar
    console.log('\n\n3️⃣ SIMULANDO CÁLCULO IRRF')
    
    funcionarios.forEach(func => {
      const salarioBase = func.salario_base || 0
      const numeroDependentes = func.numero_dependentes || 0
      
      // Calcular INSS
      let inss = 0
      if (salarioBase <= 1412.00) {
        inss = salarioBase * 0.075
      } else if (salarioBase <= 2666.68) {
        inss = 1412.00 * 0.075 + (salarioBase - 1412.00) * 0.09
      } else if (salarioBase <= 4000.03) {
        inss = 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (salarioBase - 2666.68) * 0.12
      } else {
        inss = 1412.00 * 0.075 + (2666.68 - 1412.00) * 0.09 + (4000.03 - 2666.68) * 0.12 + (salarioBase - 4000.03) * 0.14
        if (inss > 908.85) inss = 908.85
      }
      
      const deducaoDependentes = numeroDependentes * 189.59
      const baseIRRF = salarioBase - inss - deducaoDependentes
      
      console.log(`\n👤 ${func.nome_completo}`)
      console.log(`   💰 Salário: R$ ${salarioBase.toFixed(2)}`)
      console.log(`   📊 INSS: R$ ${inss.toFixed(2)}`)
      console.log(`   👨‍👩‍👧‍👦 Dedução Dependentes: R$ ${deducaoDependentes.toFixed(2)}`)
      console.log(`   📊 Base IRRF: R$ ${baseIRRF.toFixed(2)}`)
      
      if (baseIRRF <= 5000.00) {
        console.log(`   ✅ DEVE SER ISENTO CLT (Base ≤ R$ 5.000,00)`)
      } else {
        console.log(`   🟡 DEVE TER IRRF (Base > R$ 5.000,00)`)
      }
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarProblemasCriticos()