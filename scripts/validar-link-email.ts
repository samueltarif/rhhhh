#!/usr/bin/env node

/**
 * Script para validar se o link de login está correto nos emails
 * 
 * Execução: npx tsx scripts/validar-link-email.ts
 */

import { templateBoasVindas } from '../server/utils/email'

console.log('🔍 Validando link de login nos emails...\n')

// Mock de dados para teste
const dadosTeste = {
  nome: 'João Silva',
  email: 'joao.silva@qualitec.com.br',
  senha: 'senha123',
  empresa: 'Qualitec Instrumentos de Medição'
}

console.log('📧 Gerando template de email de teste...')

try {
  // Gerar template
  const htmlTemplate = templateBoasVindas(dadosTeste)
  
  // Verificações
  const linkCorreto = 'https://rhqualitec.vercel.app/login'
  const temLinkCorreto = htmlTemplate.includes(linkCorreto)
  const temBotaoAcesso = htmlTemplate.includes('Acessar Sistema RH')
  const temCredenciais = htmlTemplate.includes(dadosTeste.email) && htmlTemplate.includes(dadosTeste.senha)
  const temNome = htmlTemplate.includes(dadosTeste.nome)
  const temEmpresa = htmlTemplate.includes(dadosTeste.empresa)
  
  console.log('\n📋 RESULTADOS DA VALIDAÇÃO:')
  console.log('='.repeat(50))
  
  console.log(`✅ Link correto presente: ${temLinkCorreto}`)
  if (temLinkCorreto) {
    console.log(`   🔗 Link: ${linkCorreto}`)
  } else {
    console.log(`   ❌ Link esperado não encontrado: ${linkCorreto}`)
  }
  
  console.log(`✅ Botão "Acessar Sistema RH": ${temBotaoAcesso}`)
  console.log(`✅ Credenciais presentes: ${temCredenciais}`)
  console.log(`✅ Nome do funcionário: ${temNome}`)
  console.log(`✅ Nome da empresa: ${temEmpresa}`)
  
  // Verificar se não há links antigos ou incorretos
  const linksAntigos = [
    'localhost:3000',
    'http://localhost',
    'process.env.NUXT_PUBLIC_BASE_URL',
    'http://rhqualitec.vercel.app' // sem https (mas não o correto)
  ]
  
  let temLinksAntigos = false
  linksAntigos.forEach(linkAntigo => {
    if (htmlTemplate.includes(linkAntigo)) {
      console.log(`❌ Link antigo encontrado: ${linkAntigo}`)
      temLinksAntigos = true
    }
  })
  
  if (!temLinksAntigos) {
    console.log('✅ Nenhum link antigo encontrado')
  }
  
  // Estatísticas do template
  console.log('\n📊 ESTATÍSTICAS DO TEMPLATE:')
  console.log('='.repeat(50))
  console.log(`📏 Tamanho do HTML: ${htmlTemplate.length} caracteres`)
  console.log(`🔗 Ocorrências do link correto: ${(htmlTemplate.match(new RegExp(linkCorreto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length}`)
  
  // Resultado final
  console.log('\n🎯 RESULTADO FINAL:')
  console.log('='.repeat(50))
  
  if (temLinkCorreto && temBotaoAcesso && temCredenciais && temNome && temEmpresa && !temLinksAntigos) {
    console.log('✅ TESTE PASSOU: Email está configurado corretamente!')
    console.log('   - Link de produção correto')
    console.log('   - Todas as informações presentes')
    console.log('   - Nenhum link antigo encontrado')
  } else {
    console.log('❌ TESTE FALHOU: Há problemas no template de email')
    if (!temLinkCorreto) console.log('   - Link de produção incorreto')
    if (!temBotaoAcesso) console.log('   - Botão de acesso ausente')
    if (!temCredenciais) console.log('   - Credenciais ausentes')
    if (!temNome) console.log('   - Nome do funcionário ausente')
    if (!temEmpresa) console.log('   - Nome da empresa ausente')
    if (temLinksAntigos) console.log('   - Links antigos encontrados')
  }
  
} catch (error) {
  console.error('❌ ERRO ao gerar template:', error)
}

console.log('\n' + '='.repeat(50))
console.log('🎯 RESUMO: Validação do link de login nos emails')
console.log('   Link esperado: https://rhqualitec.vercel.app/login')
console.log('   Arquivo: server/utils/email.ts')
console.log('='.repeat(50))