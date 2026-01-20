#!/usr/bin/env node

/**
 * TESTE - CONSULTA CNPJ NA PÁGINA DA EMPRESA
 * Testa a integração da API de consulta CNPJ na página de configurações da empresa
 */

import { chromium } from 'playwright'

console.log('🧪 TESTANDO CONSULTA CNPJ NA PÁGINA DA EMPRESA')
console.log('=' .repeat(60))

async function testarConsultaCNPJEmpresa() {
  let browser
  
  try {
    console.log('\n1️⃣ Iniciando navegador...')
    browser = await chromium.launch({ 
      headless: false, // Mostrar navegador para debug
      slowMo: 1000 // Delay entre ações
    })
    
    const context = await browser.newContext()
    const page = await context.newPage()
    
    console.log('✅ Navegador iniciado')
    
    // 2. Acessar a página de login
    console.log('\n2️⃣ Acessando página de login...')
    await page.goto('http://localhost:3001/login')
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Página de login carregada')
    
    // 3. Fazer login como admin
    console.log('\n3️⃣ Fazendo login como admin...')
    
    await page.fill('input[type="email"]', 'silvana@qualitec.ind.br')
    await page.fill('input[type="password"]', 'silvana123')
    await page.click('button[type="submit"]')
    
    // Aguardar redirecionamento
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    console.log('✅ Login realizado com sucesso')
    
    // 4. Navegar para página da empresa
    console.log('\n4️⃣ Navegando para página da empresa...')
    await page.goto('http://localhost:3001/admin/empresa')
    await page.waitForLoadState('networkidle')
    
    console.log('✅ Página da empresa carregada')
    
    // 5. Testar campo CNPJ
    console.log('\n5️⃣ Testando campo CNPJ...')
    
    // Localizar o campo CNPJ
    const cnpjInput = page.locator('input[placeholder*="00.000.000/0000-00"]').first()
    
    if (await cnpjInput.count() === 0) {
      console.log('❌ Campo CNPJ não encontrado')
      return
    }
    
    console.log('✅ Campo CNPJ encontrado')
    
    // 6. Testar CNPJ válido (exemplo: Magazine Luiza)
    console.log('\n6️⃣ Testando CNPJ válido...')
    
    const cnpjTeste = '47960950000121' // Magazine Luiza
    
    // Limpar campo e digitar CNPJ
    await cnpjInput.clear()
    await cnpjInput.fill(cnpjTeste)
    
    console.log(`📝 CNPJ digitado: ${cnpjTeste}`)
    
    // Aguardar formatação automática
    await page.waitForTimeout(2000)
    
    // Verificar se apareceu o botão de busca
    const botaoBuscar = page.locator('button:has-text("Buscar")')
    
    if (await botaoBuscar.count() > 0) {
      console.log('✅ Botão de busca apareceu')
      
      // Clicar no botão de busca
      await botaoBuscar.click()
      console.log('🔍 Clicou no botão de busca')
      
      // Aguardar resposta da API
      await page.waitForTimeout(5000)
      
      // Verificar se os campos foram preenchidos
      const nomeEmpresa = await page.locator('input[label*="Nome da Empresa"]').first().inputValue()
      
      if (nomeEmpresa && nomeEmpresa.length > 0) {
        console.log('✅ Dados da empresa preenchidos automaticamente!')
        console.log(`   Nome: ${nomeEmpresa}`)
        
        // Verificar outros campos
        const nomeFantasia = await page.locator('input[label*="Nome Fantasia"]').first().inputValue()
        const inscricaoEstadual = await page.locator('input[label*="Inscrição Estadual"]').first().inputValue()
        const logradouro = await page.locator('input[label*="Logradouro"]').first().inputValue()
        
        console.log(`   Nome Fantasia: ${nomeFantasia || 'Não informado'}`)
        console.log(`   Inscrição Estadual: ${inscricaoEstadual || 'Não informado'}`)
        console.log(`   Logradouro: ${logradouro || 'Não informado'}`)
        
      } else {
        console.log('⚠️ Dados não foram preenchidos automaticamente')
      }
      
    } else {
      console.log('⚠️ Botão de busca não apareceu')
    }
    
    // 7. Verificar notificação de sucesso
    console.log('\n7️⃣ Verificando notificações...')
    
    const notificacao = page.locator('.notification, .alert, [class*="success"]')
    
    if (await notificacao.count() > 0) {
      const textoNotificacao = await notificacao.first().textContent()
      console.log(`✅ Notificação encontrada: ${textoNotificacao}`)
    } else {
      console.log('⚠️ Nenhuma notificação encontrada')
    }
    
    // 8. Testar botão de salvar
    console.log('\n8️⃣ Testando botão de salvar...')
    
    const botaoSalvar = page.locator('button:has-text("Salvar")')
    
    if (await botaoSalvar.count() > 0) {
      console.log('✅ Botão de salvar encontrado')
      
      // Não vamos clicar para não salvar dados de teste
      console.log('ℹ️ Não clicando no botão para evitar salvar dados de teste')
    } else {
      console.log('⚠️ Botão de salvar não encontrado')
    }
    
    // 9. Testar CNPJ inválido
    console.log('\n9️⃣ Testando CNPJ inválido...')
    
    await cnpjInput.clear()
    await cnpjInput.fill('12345678000100') // CNPJ inválido
    
    await page.waitForTimeout(2000)
    
    // Verificar se não aparece o botão de busca
    const botaoBuscarInvalido = page.locator('button:has-text("Buscar")')
    
    if (await botaoBuscarInvalido.count() === 0) {
      console.log('✅ Botão de busca não aparece para CNPJ inválido')
    } else {
      console.log('⚠️ Botão de busca apareceu mesmo com CNPJ inválido')
    }
    
    console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!')
    
  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
    
    if (error.message.includes('Target page, context or browser has been closed')) {
      console.log('💡 O navegador foi fechado durante o teste')
    } else if (error.message.includes('Timeout')) {
      console.log('💡 Timeout - verifique se o servidor está rodando em localhost:3001')
    } else {
      console.log('💡 Erro inesperado - verifique os logs acima')
    }
    
  } finally {
    if (browser) {
      await browser.close()
      console.log('\n🔒 Navegador fechado')
    }
  }
}

// Verificar se o servidor está rodando
async function verificarServidor() {
  try {
    const response = await fetch('http://localhost:3001')
    return response.ok
  } catch (error) {
    return false
  }
}

// Executar teste
async function executar() {
  console.log('🔍 Verificando se o servidor está rodando...')
  
  const servidorRodando = await verificarServidor()
  
  if (!servidorRodando) {
    console.log('❌ Servidor não está rodando em localhost:3001')
    console.log('💡 Execute: npm run dev')
    return
  }
  
  console.log('✅ Servidor está rodando')
  
  await testarConsultaCNPJEmpresa()
}

executar()
  .then(() => {
    console.log('\n🎉 Teste finalizado!')
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error)
  })