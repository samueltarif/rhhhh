#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

async function testarAPIsDownloadCorrigidas() {
  console.log('🧪 Testando APIs de download corrigidas...\n')

  try {
    // 1. Criar funcionário e empresa de teste
    console.log('1️⃣ Criando dados de teste...')
    
    // Criar empresa primeiro
    const empresa = {
      nome: 'Empresa Teste Download',
      nome_fantasia: 'Teste Download Ltda',
      cnpj: '12345678000199'
    }

    const { data: empresaCriada, error: errorEmpresa } = await supabase
      .from('empresas')
      .insert([empresa])
      .select()

    if (errorEmpresa) {
      console.log('❌ Erro ao criar empresa:', errorEmpresa.message)
      return
    }

    console.log('✅ Empresa criada!')
    const emp = empresaCriada[0]

    // Criar funcionário
    const funcionario = {
      nome_completo: 'João Silva Teste Download',
      cpf: `${Date.now()}`.slice(-11),
      email_login: `joao.download.${Date.now()}@empresa.com`,
      senha: 'senha123',
      tipo_acesso: 'funcionario',
      status: 'ativo',
      salario_base: 2500.00,
      empresa_id: emp.id,
      data_admissao: '2025-01-01'
    }

    const { data: funcionarioCriado, error: errorFunc } = await supabase
      .from('funcionarios')
      .insert([funcionario])
      .select()

    if (errorFunc) {
      console.log('❌ Erro ao criar funcionário:', errorFunc.message)
      return
    }

    console.log('✅ Funcionário criado!')
    const func = funcionarioCriado[0]

    // 2. Criar holerite completo
    console.log('\n2️⃣ Criando holerite completo...')
    
    const holerite = {
      funcionario_id: func.id,
      periodo_inicio: '2026-01-01',
      periodo_fim: '2026-01-31',
      salario_base: 2500.00,
      bonus: 300.00,
      horas_extras: 150.00,
      inss: 200.00,
      irrf: 50.00,
      vale_transporte: 150.00,
      cesta_basica_desconto: 0.00,
      plano_saude: 80.00,
      status: 'gerado',
      horas_trabalhadas: 176,
      data_pagamento: '2026-01-31'
    }

    const { data: holeriteInserido, error: errorHolerite } = await supabase
      .from('holerites')
      .insert([holerite])
      .select()

    if (errorHolerite) {
      console.log('❌ Erro ao criar holerite:', errorHolerite.message)
      return
    }

    console.log('✅ Holerite criado!')
    const hol = holeriteInserido[0]
    
    console.log(`📋 Holerite ID: ${hol.id}`)
    console.log(`💰 Salário Base: R$ ${hol.salario_base}`)
    console.log(`💚 Total Proventos: R$ ${hol.total_proventos}`)
    console.log(`🔴 Total Descontos: R$ ${hol.total_descontos}`)
    console.log(`💙 Salário Líquido: R$ ${hol.salario_liquido}`)

    // 3. Testar diferentes URLs para as APIs
    console.log('\n3️⃣ Testando diferentes URLs para APIs...')
    
    const baseUrl = process.env.SUPABASE_URL.replace('/rest/v1', '')
    const urls = [
      `${baseUrl}/api/holerites/${hol.id}/html`,
      `http://localhost:3000/api/holerites/${hol.id}/html`,
      `${process.env.SUPABASE_URL}/functions/v1/holerites/${hol.id}/html`
    ]

    console.log('📄 Testando URLs para HTML...')
    for (const url of urls) {
      try {
        console.log(`🔍 Tentando: ${url}`)
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        console.log(`   Status: ${response.status} - ${response.statusText}`)
        
        if (response.ok) {
          const content = await response.text()
          console.log(`   ✅ Sucesso! Tamanho: ${content.length} caracteres`)
          
          // Verificar se contém cesta básica
          if (content.includes('CESTA BÁSICA')) {
            console.log('   ✅ Contém "CESTA BÁSICA"!')
          }
          break
        } else {
          const errorText = await response.text()
          console.log(`   ❌ Erro: ${errorText.substring(0, 100)}...`)
        }
      } catch (error) {
        console.log(`   ❌ Erro de conexão: ${error.message}`)
      }
    }

    // 4. Verificar se o servidor Nuxt está rodando
    console.log('\n4️⃣ Verificando servidor Nuxt...')
    
    try {
      const nuxtResponse = await fetch('http://localhost:3000/', {
        method: 'HEAD'
      })
      
      if (nuxtResponse.ok) {
        console.log('✅ Servidor Nuxt está rodando na porta 3000')
        
        // Testar API local
        console.log('🔍 Testando API local...')
        const localResponse = await fetch(`http://localhost:3000/api/holerites/${hol.id}/html`)
        
        if (localResponse.ok) {
          console.log('✅ API local funcionando!')
        } else {
          console.log(`❌ API local com erro: ${localResponse.status}`)
        }
      } else {
        console.log('❌ Servidor Nuxt não está respondendo')
      }
    } catch (error) {
      console.log('❌ Servidor Nuxt não está rodando ou não acessível')
      console.log('💡 Para testar as APIs, execute: npm run dev')
    }

    // 5. Testar geração HTML diretamente
    console.log('\n5️⃣ Testando geração HTML diretamente...')
    
    try {
      // Importar e testar a função diretamente
      const { gerarHoleriteHTML } = await import('./server/utils/holeriteHTML.ts')
      
      const funcionarioData = {
        nome_completo: func.nome_completo,
        cpf: func.cpf,
        cargo: 'Desenvolvedor',
        departamento: 'TI',
        data_admissao: func.data_admissao,
        numero_dependentes: 0,
        pensao_alimenticia: 0
      }

      const empresaData = {
        nome: emp.nome,
        cnpj: emp.cnpj,
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }

      const html = gerarHoleriteHTML(hol, funcionarioData, empresaData)
      
      console.log('✅ HTML gerado diretamente!')
      console.log(`📄 Tamanho: ${html.length} caracteres`)
      
      if (html.includes('CESTA BÁSICA')) {
        console.log('✅ HTML contém "CESTA BÁSICA"!')
      } else if (html.includes('VALE REFEIÇÃO')) {
        console.log('⚠️ HTML ainda contém "VALE REFEIÇÃO"')
      }
      
    } catch (error) {
      console.log('❌ Erro ao gerar HTML diretamente:', error.message)
    }

    // 6. Limpeza
    console.log('\n6️⃣ Limpeza...')
    
    await supabase.from('holerites').delete().eq('id', hol.id)
    await supabase.from('funcionarios').delete().eq('id', func.id)
    await supabase.from('empresas').delete().eq('id', emp.id)
    
    console.log('✅ Dados de teste removidos!')

    // 7. Instruções para correção
    console.log('\n🔧 INSTRUÇÕES PARA CORREÇÃO:')
    console.log('1. Para testar as APIs localmente: npm run dev')
    console.log('2. As APIs estão em: server/api/holerites/[id]/html.get.ts')
    console.log('3. As APIs estão em: server/api/holerites/[id]/pdf.get.ts')
    console.log('4. URL correta: http://localhost:3000/api/holerites/[id]/html')
    console.log('5. Verificar se o campo cesta_basica_desconto está sendo usado')

    console.log('\n🎉 TESTE DE APIs CONCLUÍDO!')

  } catch (error) {
    console.log('❌ Erro durante o teste:', error.message)
  }
}

// Executar teste
testarAPIsDownloadCorrigidas()