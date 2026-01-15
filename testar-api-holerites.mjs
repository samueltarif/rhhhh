async function testarAPIHolerites() {
  console.log('🔍 TESTANDO API DE HOLERITES')
  console.log('=' .repeat(50))
  
  try {
    // 1. Testar API principal de holerites
    console.log('\n1️⃣ TESTANDO API /api/holerites')
    
    const response = await fetch('http://localhost:3000/api/holerites')
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const holerites = await response.json()
    
    console.log(`📊 Total de holerites: ${holerites.length}`)
    
    // Verificar se os campos beneficios e descontos_personalizados estão presentes
    const holeriteComBeneficios = holerites.find(h => h.beneficios && h.beneficios.length > 0)
    
    if (holeriteComBeneficios) {
      console.log('\n✅ HOLERITE COM BENEFÍCIOS ENCONTRADO:')
      console.log(`   ID: ${holeriteComBeneficios.id}`)
      console.log(`   Funcionário: ${holeriteComBeneficios.funcionario.nome_completo}`)
      console.log(`   Salário Base: R$ ${holeriteComBeneficios.salario_base}`)
      console.log(`   Total Proventos: R$ ${holeriteComBeneficios.total_proventos}`)
      console.log(`   Total Descontos: R$ ${holeriteComBeneficios.total_descontos}`)
      
      console.log('\n   🎁 BENEFÍCIOS:')
      if (holeriteComBeneficios.beneficios && holeriteComBeneficios.beneficios.length > 0) {
        holeriteComBeneficios.beneficios.forEach(beneficio => {
          console.log(`      ${beneficio.tipo}: +R$ ${beneficio.valor} / -R$ ${beneficio.desconto || 0}`)
        })
      } else {
        console.log('      ❌ NENHUM BENEFÍCIO')
      }
      
      console.log('\n   📉 DESCONTOS PERSONALIZADOS:')
      if (holeriteComBeneficios.descontos_personalizados && holeriteComBeneficios.descontos_personalizados.length > 0) {
        holeriteComBeneficios.descontos_personalizados.forEach(desconto => {
          console.log(`      ${desconto.tipo}: -R$ ${desconto.valor}`)
        })
      } else {
        console.log('      ⚠️ NENHUM DESCONTO PERSONALIZADO')
      }
      
      // Verificar se tem desconto de benefício
      const beneficioComDesconto = holeriteComBeneficios.beneficios?.find(b => b.desconto > 0)
      if (beneficioComDesconto) {
        console.log(`\n   ✅ DESCONTO DE BENEFÍCIO ENCONTRADO: ${beneficioComDesconto.tipo} = R$ ${beneficioComDesconto.desconto}`)
      } else {
        console.log(`\n   ❌ NENHUM DESCONTO DE BENEFÍCIO ENCONTRADO`)
      }
      
    } else {
      console.log('\n❌ NENHUM HOLERITE COM BENEFÍCIOS ENCONTRADO')
    }
    
    // 2. Testar API específica do funcionário (VITO)
    console.log('\n\n2️⃣ TESTANDO API /api/holerites/meus-holerites (VITO)')
    
    const responseVito = await fetch('http://localhost:3000/api/holerites/meus-holerites?funcionarioId=133')
    
    if (!responseVito.ok) {
      throw new Error(`Erro HTTP: ${responseVito.status}`)
    }
    
    const holeritesVito = await responseVito.json()
    
    console.log(`📊 Holerites do VITO: ${holeritesVito.length}`)
    
    if (holeritesVito.length > 0) {
      const holeriteVito = holeritesVito[0]
      console.log('\n📄 ÚLTIMO HOLERITE DO VITO:')
      console.log(`   ID: ${holeriteVito.id}`)
      console.log(`   Salário Base: R$ ${holeriteVito.salario_base}`)
      console.log(`   Total Proventos: R$ ${holeriteVito.total_proventos}`)
      console.log(`   Total Descontos: R$ ${holeriteVito.total_descontos}`)
      console.log(`   INSS: R$ ${holeriteVito.inss}`)
      console.log(`   IRRF: R$ ${holeriteVito.irrf}`)
      
      console.log('\n   🎁 BENEFÍCIOS:')
      if (holeriteVito.beneficios && holeriteVito.beneficios.length > 0) {
        holeriteVito.beneficios.forEach(beneficio => {
          console.log(`      ${beneficio.tipo}: +R$ ${beneficio.valor} / -R$ ${beneficio.desconto || 0}`)
        })
      } else {
        console.log('      ❌ CAMPO beneficios NÃO ENCONTRADO OU VAZIO')
        console.log('      📋 Campos disponíveis:', Object.keys(holeriteVito))
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

testarAPIHolerites()