import 'dotenv/config'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

console.log('🔍 DEBUG: HTML Pensão Alimentícia\n')

async function debugHTML() {
  try {
    // Buscar um holerite recente
    const response = await fetch(`${BASE_URL}/api/holerites/317/html`)
    
    if (!response.ok) {
      console.log('❌ Erro ao buscar HTML')
      return
    }
    
    const html = await response.text()
    
    console.log('📄 Tamanho do HTML:', html.length)
    
    // Procurar por pensão
    const temPensao = html.includes('PENSÃO')
    const temAlimenticia = html.includes('ALIMENTÍCIA')
    const temPensaoCompleta = html.includes('PENSÃO ALIMENTÍCIA')
    
    console.log('🔍 Buscas no HTML:')
    console.log(`   PENSÃO: ${temPensao ? '✅' : '❌'}`)
    console.log(`   ALIMENTÍCIA: ${temAlimenticia ? '✅' : '❌'}`)
    console.log(`   PENSÃO ALIMENTÍCIA: ${temPensaoCompleta ? '✅' : '❌'}`)
    
    // Procurar por valores monetários
    const valores = html.match(/\d+,\d{2}/g) || []
    console.log(`\n💰 Valores encontrados: ${valores.length}`)
    valores.slice(0, 10).forEach((valor, i) => {
      console.log(`   ${i + 1}. R$ ${valor}`)
    })
    
    // Procurar por código 960 (pensão alimentícia)
    const tem960 = html.includes('960')
    console.log(`\n🔢 Código 960: ${tem960 ? '✅' : '❌'}`)
    
    if (tem960) {
      const match960 = html.match(/960.*?PENSÃO.*?(\d+,\d{2})/s)
      if (match960) {
        console.log(`   Valor: R$ ${match960[1]}`)
      }
    }
    
    // Salvar HTML para inspeção
    const fs = await import('fs')
    fs.writeFileSync('debug-holerite.html', html)
    console.log('\n📁 HTML salvo em debug-holerite.html para inspeção')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

debugHTML()