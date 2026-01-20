#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarCestaBasicaHTML() {
  console.log('🧪 TESTE: CESTA BÁSICA NO HTML DO HOLERITE\n')

  try {
    // 1. Buscar um holerite
    console.log('1️⃣ Buscando holerite...')
    
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select('id, funcionario_id, periodo_inicio, periodo_fim, cesta_basica_desconto')
      .limit(1)

    if (error || !holerites || holerites.length === 0) {
      console.log('❌ Nenhum holerite encontrado')
      return
    }

    const holerite = holerites[0]
    console.log(`✅ Holerite ID ${holerite.id} encontrado`)
    console.log(`   Funcionário: ${holerite.funcionario_id}`)
    console.log(`   Período: ${holerite.periodo_inicio} a ${holerite.periodo_fim}`)
    console.log(`   Desconto Cesta Básica: R$ ${holerite.cesta_basica_desconto || 0}`)

    // 2. Baixar HTML
    console.log('\n2️⃣ Baixando HTML do holerite...')
    
    const servidorUrl = 'http://localhost:3000'
    
    try {
      const response = await fetch(`${servidorUrl}/api/holerites/${holerite.id}/html`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      })

      if (!response.ok) {
        console.log(`❌ Erro ao baixar HTML: ${response.status}`)
        const errorText = await response.text()
        console.log(`   Detalhes: ${errorText.substring(0, 200)}`)
        return
      }

      const htmlContent = await response.text()
      console.log(`✅ HTML baixado com sucesso! (${htmlContent.length} caracteres)`)

      // 3. Verificar conteúdo
      console.log('\n3️⃣ Verificando conteúdo do HTML...')
      
      const verificacoes = [
        { termo: 'CESTA BÁSICA', nome: 'Cesta Básica' },
        { termo: 'VALE REFEIÇÃO', nome: 'Vale Refeição (ANTIGO)' },
        { termo: 'Vale Refeição', nome: 'Vale Refeição (case)' },
        { termo: 'vale_refeicao', nome: 'vale_refeicao (campo)' },
        { termo: 'cesta_basica', nome: 'cesta_basica (campo)' },
        { termo: 'VALE TRANSPORTE', nome: 'Vale Transporte' },
        { termo: 'INSS', nome: 'INSS' },
        { termo: 'IRRF', nome: 'IRRF' },
        { termo: 'SALÁRIO LÍQUIDO', nome: 'Salário Líquido' }
      ]

      verificacoes.forEach(({ termo, nome }) => {
        const encontrado = htmlContent.includes(termo)
        const icone = encontrado ? '✅' : '❌'
        console.log(`   ${icone} ${nome}: ${encontrado ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`)
      })

      // 4. Salvar HTML para inspeção
      console.log('\n4️⃣ Salvando HTML para inspeção...')
      
      const nomeArquivo = `holerite-${holerite.id}-teste.html`
      fs.writeFileSync(nomeArquivo, htmlContent)
      console.log(`✅ HTML salvo em: ${nomeArquivo}`)

      // 5. Extrair seção de descontos
      console.log('\n5️⃣ Extraindo seção de descontos...')
      
      const regexDescontos = /<h3[^>]*>DESCONTOS<\/h3>([\s\S]*?)<\/table>/i
      const matchDescontos = htmlContent.match(regexDescontos)
      
      if (matchDescontos) {
        console.log('✅ Seção de descontos encontrada:')
        const descontosHTML = matchDescontos[1]
        
        // Extrair linhas de desconto
        const regexLinhas = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
        const linhas = [...descontosHTML.matchAll(regexLinhas)]
        
        console.log(`   Total de linhas: ${linhas.length}`)
        
        linhas.forEach((linha, i) => {
          const texto = linha[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
          if (texto && !texto.includes('Descrição')) {
            console.log(`   ${i + 1}. ${texto}`)
          }
        })
      } else {
        console.log('❌ Seção de descontos não encontrada')
      }

      // 6. Resumo final
      console.log('\n' + '='.repeat(60))
      console.log('🎯 RESUMO DO TESTE')
      console.log('='.repeat(60))
      
      const temCestaBasica = htmlContent.includes('CESTA BÁSICA')
      const temValeRefeicao = htmlContent.includes('VALE REFEIÇÃO')
      
      if (temCestaBasica && !temValeRefeicao) {
        console.log('✅ SUCESSO! HTML contém "CESTA BÁSICA" e não contém "VALE REFEIÇÃO"')
        console.log('✅ Migração completa e funcionando!')
      } else if (temCestaBasica && temValeRefeicao) {
        console.log('⚠️ ATENÇÃO! HTML contém ambos "CESTA BÁSICA" e "VALE REFEIÇÃO"')
        console.log('   Pode haver código legado ainda presente')
      } else if (!temCestaBasica && temValeRefeicao) {
        console.log('❌ PROBLEMA! HTML ainda usa "VALE REFEIÇÃO" ao invés de "CESTA BÁSICA"')
        console.log('   A migração não foi aplicada corretamente')
      } else {
        console.log('⚠️ HTML não contém nem "CESTA BÁSICA" nem "VALE REFEIÇÃO"')
        console.log('   Pode não haver desconto deste tipo neste holerite')
      }
      
      console.log(`\n📄 Arquivo salvo: ${nomeArquivo}`)
      console.log('💡 Abra o arquivo no navegador para visualizar')

    } catch (error) {
      console.log('❌ Erro ao acessar API:', error.message)
      console.log('💡 Certifique-se de que o servidor está rodando: npm run dev')
    }

  } catch (error) {
    console.log('❌ Erro durante teste:', error.message)
  }
}

testarCestaBasicaHTML()
