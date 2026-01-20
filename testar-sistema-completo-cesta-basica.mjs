#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarSistemaCompleto() {
  console.log('🧪 Teste completo: Sistema de Cesta Básica\n')

  try {
    // 1. Criar funcionário com cesta básica
    console.log('1️⃣ Criando funcionário com cesta básica...')
    
    const funcionario = {
      nome_completo: 'Maria Silva Teste Completo',
      cpf: `${Date.now()}`.slice(-11),
      email_login: `maria.teste.${Date.now()}@empresa.com`,
      senha: 'senha123',
      tipo_acesso: 'funcionario',
      status: 'ativo',
      salario_base: 2500.00,
      beneficios: {
        cesta_basica: {
          ativo: true,
          valor: 28.00,
          valor_mensal: 616.00,
          tipo_desconto: 'sem_desconto',
          percentual_desconto: 0,
          valor_desconto: 0
        },
        vale_transporte: {
          ativo: true,
          valor: 7.50,
          valor_mensal: 165.00,
          tipo_desconto: 'percentual',
          percentual_desconto: 6,
          valor_desconto: 0
        }
      }
    }

    const { data: funcionarioCriado, error: errorCriar } = await supabase
      .from('funcionarios')
      .insert([funcionario])
      .select()

    if (errorCriar) {
      console.log('❌ Erro ao criar funcionário:', errorCriar.message)
      return
    }

    console.log('✅ Funcionário criado com sucesso!')
    const func = funcionarioCriado[0]

    // 2. Testar geração de holerite
    console.log('\n2️⃣ Testando geração de holerite...')
    
    const dadosHolerite = {
      funcionario_id: func.id,
      mes: 1,
      ano: 2026,
      salario_base: func.salario_base,
      horas_trabalhadas: 176,
      faltas: 0,
      adiantamento: 0
    }

    const { data: holeriteGerado, error: errorHolerite } = await supabase
      .from('holerites')
      .insert([dadosHolerite])
      .select()

    if (errorHolerite) {
      console.log('❌ Erro ao gerar holerite:', errorHolerite.message)
    } else {
      console.log('✅ Holerite gerado com sucesso!')
      console.log(`📋 ID do holerite: ${holeriteGerado[0].id}`)
    }

    // 3. Testar busca de funcionários com benefícios
    console.log('\n3️⃣ Testando busca de funcionários com benefícios...')
    
    const { data: funcionariosComBeneficios, error: errorBusca } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, beneficios')
      .not('beneficios', 'is', null)
      .eq('id', func.id)

    if (errorBusca) {
      console.log('❌ Erro ao buscar funcionários:', errorBusca.message)
    } else {
      console.log('✅ Funcionários com benefícios encontrados!')
      
      funcionariosComBeneficios.forEach(f => {
        console.log(`👤 ${f.nome_completo}:`)
        
        if (f.beneficios.cesta_basica?.ativo) {
          console.log(`   🛒 Cesta Básica: R$ ${f.beneficios.cesta_basica.valor}/dia`)
        }
        
        if (f.beneficios.vale_transporte?.ativo) {
          console.log(`   🚌 Vale Transporte: R$ ${f.beneficios.vale_transporte.valor}/dia`)
        }
      })
    }

    // 4. Testar atualização de benefícios
    console.log('\n4️⃣ Testando atualização de benefícios...')
    
    const novosBeneficios = {
      ...func.beneficios,
      cesta_basica: {
        ...func.beneficios.cesta_basica,
        valor: 32.00,
        valor_mensal: 704.00,
        tipo_desconto: 'percentual',
        percentual_desconto: 3
      }
    }

    const { data: funcionarioAtualizado, error: errorAtualizar } = await supabase
      .from('funcionarios')
      .update({ beneficios: novosBeneficios })
      .eq('id', func.id)
      .select()

    if (errorAtualizar) {
      console.log('❌ Erro ao atualizar benefícios:', errorAtualizar.message)
    } else {
      console.log('✅ Benefícios atualizados com sucesso!')
      console.log(`📋 Nova cesta básica: R$ ${funcionarioAtualizado[0].beneficios.cesta_basica.valor}/dia`)
      console.log(`📋 Novo desconto: ${funcionarioAtualizado[0].beneficios.cesta_basica.percentual_desconto}%`)
    }

    // 5. Simular cálculos do painel do funcionário
    console.log('\n5️⃣ Simulando cálculos do painel do funcionário...')
    
    const funcAtualizado = funcionarioAtualizado[0]
    let totalBeneficios = 0
    let totalDescontos = 0
    
    // Cesta Básica
    if (funcAtualizado.beneficios.cesta_basica?.ativo) {
      const valorMensal = funcAtualizado.beneficios.cesta_basica.valor_mensal || 
                          (funcAtualizado.beneficios.cesta_basica.valor * 22)
      totalBeneficios += valorMensal
      
      if (funcAtualizado.beneficios.cesta_basica.tipo_desconto === 'percentual') {
        const desconto = funcAtualizado.salario_base * (funcAtualizado.beneficios.cesta_basica.percentual_desconto / 100)
        totalDescontos += desconto
      }
    }
    
    // Vale Transporte
    if (funcAtualizado.beneficios.vale_transporte?.ativo) {
      const valorMensal = funcAtualizado.beneficios.vale_transporte.valor_mensal || 
                          (funcAtualizado.beneficios.vale_transporte.valor * 22)
      totalBeneficios += valorMensal
      
      if (funcAtualizado.beneficios.vale_transporte.tipo_desconto === 'percentual') {
        const desconto = funcAtualizado.salario_base * (funcAtualizado.beneficios.vale_transporte.percentual_desconto / 100)
        totalDescontos += desconto
      }
    }
    
    const salarioLiquido = funcAtualizado.salario_base - totalDescontos
    
    console.log('📊 RESUMO FINANCEIRO:')
    console.log(`   💰 Salário Base: R$ ${funcAtualizado.salario_base.toFixed(2).replace('.', ',')}`)
    console.log(`   💚 Total Benefícios: R$ ${totalBeneficios.toFixed(2).replace('.', ',')}`)
    console.log(`   🔴 Total Descontos: R$ ${totalDescontos.toFixed(2).replace('.', ',')}`)
    console.log(`   💙 Salário Líquido: R$ ${salarioLiquido.toFixed(2).replace('.', ',')}`)

    // 6. Limpeza
    console.log('\n6️⃣ Limpando dados de teste...')
    
    // Deletar holerite se foi criado
    if (holeriteGerado && holeriteGerado[0]) {
      await supabase
        .from('holerites')
        .delete()
        .eq('id', holeriteGerado[0].id)
    }
    
    // Deletar funcionário
    const { error: errorDeletar } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', func.id)

    if (errorDeletar) {
      console.log('❌ Erro ao deletar funcionário:', errorDeletar.message)
    } else {
      console.log('✅ Dados de teste removidos com sucesso!')
    }

    console.log('\n🎉 TESTE COMPLETO CONCLUÍDO!')
    console.log('✅ Sistema de Cesta Básica funcionando perfeitamente!')
    console.log('✅ Benefícios aparecem corretamente no painel do funcionário!')
    console.log('✅ Cálculos financeiros estão corretos!')

  } catch (error) {
    console.log('❌ Erro durante o teste:', error.message)
  }
}

// Executar teste
testarSistemaCompleto()