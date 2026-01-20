#!/usr/bin/env node

/**
 * SCRIPT SIMPLES PARA CRIAR FUNCIONÁRIOS
 * Versão simplificada sem dependências externas
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Configuração do Supabase (substitua pelas suas credenciais)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

console.log('🚀 INICIANDO CRIAÇÃO DE FUNCIONÁRIOS')
console.log('=' .repeat(50))

// Dados dos funcionários
const funcionarios = [
  {
    nome_completo: 'Cloves Alexandre da Silva Junior',
    email: 'clovesalex.11@hotmail.com',
    senha: 'Cx9@Lq7!mR2#A',
    cpf: '398.922.388-77',
    data_nascimento: '1999-11-20'
  },
  {
    nome_completo: 'Lucas Veiga Carneiro',
    email: 'veiga4308@gmail.com',
    senha: 'Vg8$P2!xN#4L',
    cpf: '545.026.218-38',
    data_nascimento: '2003-03-09'
  },
  {
    nome_completo: 'Vitor Gabriel da Silva',
    email: 'contatovitorgabrieldasilva2005@gmail.com',
    senha: 'Ct@9R!5M#xA7',
    cpf: '447.441.128-54',
    data_nascimento: '2005-03-03'
  },
  {
    nome_completo: 'Antonio Barbosa',
    email: 'antoniobarbosasilva59@gmail.com',
    senha: 'AbS59!@Xr8#Q',
    cpf: null,
    data_nascimento: null
  },
  {
    nome_completo: 'Marcos Paulo Menézes Pires',
    email: 'marcospires4165@gmail.com',
    senha: 'Mp4#S!9xR7@L',
    cpf: '521.464.618-61',
    data_nascimento: null
  },
  {
    nome_completo: 'Leonardo Santos',
    email: 'leozinhodocs12@gmail.com',
    senha: 'Ld12@!R#8xQ',
    cpf: null,
    data_nascimento: null
  },
  {
    nome_completo: 'Luccas Augusto de Souza Lomba',
    email: 'luccas.lomba27@gmail.com',
    senha: 'Ll27#@R!9xS',
    cpf: '510.408.998-38',
    data_nascimento: '2001-02-27'
  },
  {
    nome_completo: 'Arthur da Silva Barbosa',
    email: 'arthur.barbosa10.07@hotmail.com',
    senha: 'Ab10.07@!R#x9',
    cpf: '432.690.308-27',
    data_nascimento: '1994-07-10'
  }
]

// Função para hash simples da senha
function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha + 'rh_salt_2024').digest('hex')
}

// Função para formatar CPF
function formatarCPF(cpf) {
  if (!cpf) return null
  const numeros = cpf.replace(/\D/g, '')
  if (numeros.length !== 11) return null
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Função principal
async function criarFuncionarios() {
  let sucessos = 0
  let erros = 0
  
  console.log(`📋 Total de funcionários para criar: ${funcionarios.length}\n`)
  
  for (let i = 0; i < funcionarios.length; i++) {
    const func = funcionarios[i]
    
    try {
      console.log(`${i + 1}. Criando: ${func.nome_completo}`)
      console.log(`   Email: ${func.email}`)
      
      // Verificar se já existe
      const { data: existente } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('email', func.email)
        .single()
      
      if (existente) {
        console.log(`   ⚠️ Já existe (ID: ${existente.id})`)
        continue
      }
      
      // Preparar dados
      const cpfFormatado = formatarCPF(func.cpf)
      const senhaHash = hashSenha(func.senha)
      
      const dados = {
        nome_completo: func.nome_completo,
        email: func.email,
        senha: senhaHash,
        cpf: cpfFormatado,
        data_nascimento: func.data_nascimento,
        status: 'ativo',
        tipo: 'funcionario',
        empresa_id: 1,
        salario_base: 1500.00,
        numero_dependentes: 0,
        pensao_alimenticia: 0
      }
      
      // Inserir no banco
      const { data: novo, error } = await supabase
        .from('funcionarios')
        .insert(dados)
        .select('id')
        .single()
      
      if (error) {
        throw error
      }
      
      console.log(`   ✅ Criado com ID: ${novo.id}`)
      sucessos++
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
      erros++
    }
    
    console.log('')
  }
  
  console.log('📊 RESUMO:')
  console.log(`   Sucessos: ${sucessos}`)
  console.log(`   Erros: ${erros}`)
  console.log(`   Total: ${funcionarios.length}`)
  
  if (sucessos > 0) {
    console.log('\n🔐 CREDENCIAIS CRIADAS:')
    console.log('-' .repeat(50))
    funcionarios.forEach(func => {
      console.log(`👤 ${func.nome_completo}`)
      console.log(`   📧 ${func.email}`)
      console.log(`   🔑 ${func.senha}`)
      console.log('')
    })
  }
}

// Executar
criarFuncionarios()
  .then(() => {
    console.log('✅ Script concluído!')
  })
  .catch((error) => {
    console.error('❌ Erro geral:', error)
  })