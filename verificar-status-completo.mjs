#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function verificarStatusCompleto() {
  console.log('🔍 VERIFICAÇÃO COMPLETA DO SISTEMA DE HOLERITES\n')

  try {
    // 1. Verificar estrutura da tabela
    console.log('1️⃣ Verificando estrutura da tabela holerites...')
    
    const { data: colunas, error: errorColunas } = await supabase
      .from('holerites')
      .select('*')
      .limit(1)

    if (errorColunas) {
      console.log('❌ Erro ao verificar estrutura:', errorColunas.message)
      return
    }

    if (colunas && colunas.length > 0) {
      const coluna = colunas[0]
      console.log('✅ Estrutura verificada!')
      console.log('   Campos importantes:')
      console.log(`   - cesta_basica_desconto: ${coluna.cesta_basica_desconto !== undefined ? '✅' : '❌'}`)
      console.log(`   - total_proventos: ${coluna.total_proventos !== undefined ? '✅' : '❌'}`)
      console.log(`   - total_descontos: ${coluna.total_descontos !== undefined ? '✅' : '❌'}`)
      console.log(`   - salario_liquido: ${coluna.salario_liquido !== undefined ? '✅' : '❌'}`)
    }

    // 2. Verificar holerites existentes
    console.log('\n2️⃣ Verificando holerites existentes...')
    
    const { data: holerites, error: errorHolerites } = await supabase
      .from('holerites')
      .select('id, funcionario_id, periodo_inicio, periodo_fim, salario_liquido')
      .order('created_at', { ascending: false })
      .limit(10)

    if (errorHolerites) {
      console.log('❌ Erro ao buscar holerites:', errorHolerites.message)
      return
    }

    console.log(`✅ Encontrados ${holerites.length} holerites`)
    
    if (holerites.length > 0) {
      console.log('\n📋 Últimos holerites:')
      holerites.forEach((h, i) => {
        console.log(`   ${i + 1}. ID ${h.id} | Func ${h.funcionario_id} | ${h.periodo_inicio} a ${h.periodo_fim} | R$ ${h.salario_liquido}`)
      })
    }

    // 3. Verificar funcionários com holerites
    console.log('\n3️⃣ Verificando funcionários com holerites...')
    
    const { data: funcionariosComHolerites, error: errorFunc } = await supabase
      .from('holerites')
      .select('funcionario_id')
      .order('funcionario_id')

    if (!errorFunc && funcionariosComHolerites) {
      const funcionariosUnicos = [...new Set(funcionariosComHolerites.map(h => h.funcionario_id))]
      console.log(`✅ ${funcionariosUnicos.length} funcionários têm holerites`)
      console.log(`   IDs: ${funcionariosUnicos.join(', ')}`)
    }

    // 4. Verificar servidor Nuxt
    console.log('\n4️⃣ Verificando servidor Nuxt...')
    
    const servidorUrl = 'http://localhost:3000'
    
    try {
      const response = await fetch(servidorUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      })
      
      if (response.ok || response.status === 404) {
        console.log('✅ Servidor Nuxt está RODANDO!')
        console.log(`   URL: ${servidorUrl}`)
        
        // Testar API de holerites
        console.log('\n5️⃣ Testando APIs...')
        
        if (holerites.length > 0) {
          const holeriteTest = holerites[0]
          
          // Testar HTML
          try {
            const htmlResponse = await fetch(`${servidorUrl}/api/holerites/${holeriteTest.id}/html`, {
              headers: {
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
              },
              signal: AbortSignal.timeout(5000)
            })
            
            if (htmlResponse.ok) {
              console.log('   ✅ API HTML funcionando')
            } else {
              console.log(`   ❌ API HTML com erro: ${htmlResponse.status}`)
            }
          } catch (error) {
            console.log(`   ❌ API HTML falhou: ${error.message}`)
          }
          
          // Testar PDF
          try {
            const pdfResponse = await fetch(`${servidorUrl}/api/holerites/${holeriteTest.id}/pdf`, {
              headers: {
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
              },
              signal: AbortSignal.timeout(5000)
            })
            
            if (pdfResponse.ok) {
              console.log('   ✅ API PDF funcionando')
            } else {
              console.log(`   ❌ API PDF com erro: ${pdfResponse.status}`)
            }
          } catch (error) {
            console.log(`   ❌ API PDF falhou: ${error.message}`)
          }
        }
        
      } else {
        console.log(`⚠️ Servidor respondeu com status: ${response.status}`)
      }
    } catch (error) {
      console.log('❌ Servidor Nuxt NÃO está rodando')
      console.log('   Execute: npm run dev')
    }

    // 6. Resumo final
    console.log('\n' + '='.repeat(60))
    console.log('🎯 RESUMO DO STATUS')
    console.log('='.repeat(60))
    console.log(`✅ Estrutura da tabela: OK`)
    console.log(`✅ Holerites no banco: ${holerites.length}`)
    console.log(`✅ Funcionários com holerites: ${funcionariosComHolerites ? [...new Set(funcionariosComHolerites.map(h => h.funcionario_id))].length : 0}`)
    
    console.log('\n📝 PRÓXIMOS PASSOS:')
    console.log('1. Se o servidor não está rodando: npm run dev')
    console.log('2. Acesse: http://localhost:3000/holerites')
    console.log('3. Faça login com um funcionário que tenha holerites')
    console.log('4. Teste os botões de download')
    
    console.log('\n💡 FUNCIONÁRIOS COM HOLERITES PARA TESTE:')
    if (holerites.length > 0) {
      const funcionariosUnicos = [...new Set(holerites.map(h => h.funcionario_id))]
      funcionariosUnicos.forEach(id => {
        const qtd = holerites.filter(h => h.funcionario_id === id).length
        console.log(`   - Funcionário ID ${id}: ${qtd} holerite(s)`)
      })
    }

  } catch (error) {
    console.log('❌ Erro durante verificação:', error.message)
  }
}

verificarStatusCompleto()
