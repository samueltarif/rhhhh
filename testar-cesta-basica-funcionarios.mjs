#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function testarCestaBasicaFuncionarios() {
  console.log('🧪 Testando sistema de Cesta Básica para funcionários...\n')

  try {
    // 1. Verificar estrutura da tabela funcionarios
    console.log('1️⃣ Verificando estrutura da tabela funcionarios...')
    const { data: funcionarios, error: errorFuncionarios } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, beneficios')
      .limit(5)

    if (errorFuncionarios) {
      console.log('❌ Erro ao buscar funcionários:', errorFuncionarios.message)
      return
    }

    console.log(`✅ Encontrados ${funcionarios.length} funcionários`)
    
    // 2. Verificar se algum funcionário tem benefícios configurados
    const funcionariosComBeneficios = funcionarios.filter(f => f.beneficios && Object.keys(f.beneficios).length > 0)
    console.log(`📋 Funcionários com benefícios: ${funcionariosComBeneficios.length}`)

    if (funcionariosComBeneficios.length > 0) {
      console.log('\n📊 Detalhes dos benefícios:')
      funcionariosComBeneficios.forEach(func => {
        console.log(`\n👤 ${func.nome_completo}:`)
        console.log('   Benefícios:', JSON.stringify(func.beneficios, null, 2))
      })
    }

    // 3. Testar criação de funcionário com cesta básica
    console.log('\n2️⃣ Testando criação de funcionário com cesta básica...')
    
    const novoFuncionario = {
      nome_completo: 'Teste Cesta Básica',
      cpf: '12345678901',
      email_login: 'teste.cesta@empresa.com',
      senha: 'senha123',
      tipo_acesso: 'funcionario',
      status: 'ativo',
      salario_base: 2000.00,
      beneficios: {
        cesta_basica: {
          ativo: true,
          valor: 25.00,
          valor_mensal: 550.00,
          tipo_desconto: 'sem_desconto',
          percentual_desconto: 0,
          valor_desconto: 0
        },
        vale_transporte: {
          ativo: true,
          valor: 8.50,
          valor_mensal: 187.00,
          tipo_desconto: 'percentual',
          percentual_desconto: 6,
          valor_desconto: 0
        }
      }
    }

    const { data: funcionarioCriado, error: errorCriar } = await supabase
      .from('funcionarios')
      .insert([novoFuncionario])
      .select()

    if (errorCriar) {
      console.log('❌ Erro ao criar funcionário:', errorCriar.message)
    } else {
      console.log('✅ Funcionário criado com sucesso!')
      console.log('📋 Dados:', JSON.stringify(funcionarioCriado[0], null, 2))

      // 4. Testar atualização dos benefícios
      console.log('\n3️⃣ Testando atualização dos benefícios...')
      
      const beneficiosAtualizados = {
        ...funcionarioCriado[0].beneficios,
        cesta_basica: {
          ...funcionarioCriado[0].beneficios.cesta_basica,
          valor: 30.00,
          valor_mensal: 660.00,
          tipo_desconto: 'percentual',
          percentual_desconto: 10
        }
      }

      const { data: funcionarioAtualizado, error: errorAtualizar } = await supabase
        .from('funcionarios')
        .update({ beneficios: beneficiosAtualizados })
        .eq('id', funcionarioCriado[0].id)
        .select()

      if (errorAtualizar) {
        console.log('❌ Erro ao atualizar funcionário:', errorAtualizar.message)
      } else {
        console.log('✅ Funcionário atualizado com sucesso!')
        console.log('📋 Novos benefícios:', JSON.stringify(funcionarioAtualizado[0].beneficios, null, 2))
      }

      // 5. Limpar dados de teste
      console.log('\n4️⃣ Limpando dados de teste...')
      const { error: errorDeletar } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', funcionarioCriado[0].id)

      if (errorDeletar) {
        console.log('❌ Erro ao deletar funcionário de teste:', errorDeletar.message)
      } else {
        console.log('✅ Funcionário de teste removido com sucesso!')
      }
    }

    // 6. Verificar se existem dados antigos com vale_refeicao
    console.log('\n5️⃣ Verificando dados antigos com vale_refeicao...')
    const { data: funcionariosAntigos, error: errorAntigos } = await supabase
      .from('funcionarios')
      .select('id, nome_completo, beneficios')
      .not('beneficios', 'is', null)

    if (errorAntigos) {
      console.log('❌ Erro ao buscar funcionários antigos:', errorAntigos.message)
    } else {
      const comValeRefeicao = funcionariosAntigos.filter(f => 
        f.beneficios && f.beneficios.vale_refeicao
      )
      const comCestaBasica = funcionariosAntigos.filter(f => 
        f.beneficios && f.beneficios.cesta_basica
      )

      console.log(`📊 Funcionários com vale_refeicao: ${comValeRefeicao.length}`)
      console.log(`📊 Funcionários com cesta_basica: ${comCestaBasica.length}`)

      if (comValeRefeicao.length > 0) {
        console.log('\n⚠️ Ainda existem funcionários com vale_refeicao:')
        comValeRefeicao.forEach(f => {
          console.log(`   - ${f.nome_completo} (ID: ${f.id})`)
        })
      }
    }

    console.log('\n🎉 Teste concluído!')

  } catch (error) {
    console.log('❌ Erro durante o teste:', error.message)
  }
}

// Executar teste
testarCestaBasicaFuncionarios()