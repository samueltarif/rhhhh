#!/usr/bin/env node

/**
 * SCRIPT PARA CRIAR USUÁRIOS FUNCIONÁRIOS
 * Cadastra os funcionários fornecidos no banco de dados
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ========================================
// DADOS DOS FUNCIONÁRIOS
// ========================================

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
    cpf: null, // CPF não fornecido
    data_nascimento: null // Data não fornecida
  },
  {
    nome_completo: 'Marcos Paulo Menézes Pires',
    email: 'marcospires4165@gmail.com',
    senha: 'Mp4#S!9xR7@L',
    cpf: '521.464.618-61',
    data_nascimento: null // Data não fornecida
  },
  {
    nome_completo: 'Funcionário Leo', // Nome não fornecido completo
    email: 'leozinhodocs12@gmail.com',
    senha: 'Ld12@!R#8xQ',
    cpf: null, // CPF não fornecido
    data_nascimento: null // Data não fornecida
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

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function formatarCPF(cpf) {
  if (!cpf) return null
  // Remove formatação e adiciona pontos e hífen
  const numeros = cpf.replace(/\D/g, '')
  if (numeros.length !== 11) return null
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function validarCPF(cpf) {
  if (!cpf) return false
  const numeros = cpf.replace(/\D/g, '')
  
  if (numeros.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numeros)) return false // CPFs com todos os dígitos iguais
  
  // Validação do primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i)) * (10 - i)
  }
  let resto = 11 - (soma % 11)
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(numeros.charAt(9))) return false
  
  // Validação do segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i)) * (11 - i)
  }
  resto = 11 - (soma % 11)
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(numeros.charAt(10))) return false
  
  return true
}

function hashSenhaSimples(senha) {
  // Hash simples usando crypto nativo do Node.js
  return crypto.createHash('sha256').update(senha + 'salt_rh_system').digest('hex')
}

// ========================================
// FUNÇÃO PRINCIPAL
// ========================================

async function criarFuncionarios() {
  console.log('👥 CRIANDO FUNCIONÁRIOS NO BANCO DE DADOS')
  console.log('=' .repeat(60))
  
  let sucessos = 0
  let erros = 0
  
  for (const func of funcionarios) {
    try {
      console.log(`\n🔄 Processando: ${func.nome_completo}`)
      console.log(`   Email: ${func.email}`)
      
      // Validar e formatar CPF
      let cpfFormatado = null
      if (func.cpf) {
        cpfFormatado = formatarCPF(func.cpf)
        if (!validarCPF(cpfFormatado)) {
          console.log(`   ⚠️ CPF inválido: ${func.cpf}`)
          cpfFormatado = null
        } else {
          console.log(`   CPF: ${cpfFormatado}`)
        }
      } else {
        console.log(`   ⚠️ CPF não fornecido`)
      }
      
      // Validar data de nascimento
      if (func.data_nascimento) {
        console.log(`   Data Nascimento: ${func.data_nascimento}`)
      } else {
        console.log(`   ⚠️ Data de nascimento não fornecida`)
      }
      
      // Verificar se email já existe
      const { data: existente } = await supabase
        .from('funcionarios')
        .select('id, email')
        .eq('email', func.email)
        .maybeSingle()
      
      if (existente) {
        console.log(`   ⚠️ Email já cadastrado (ID: ${existente.id})`)
        continue
      }
      
      // Hash da senha
      const senhaHash = hashSenhaSimples(func.senha)
      
      // Dados para inserção
      const dadosFuncionario = {
        nome_completo: func.nome_completo,
        email: func.email,
        senha: senhaHash,
        cpf: cpfFormatado,
        data_nascimento: func.data_nascimento,
        status: 'ativo',
        tipo: 'funcionario',
        empresa_id: 1, // Assumindo empresa padrão
        salario_base: 1500.00, // Salário mínimo padrão
        numero_dependentes: 0,
        pensao_alimenticia: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Inserir funcionário
      const { data: novoFuncionario, error } = await supabase
        .from('funcionarios')
        .insert(dadosFuncionario)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      console.log(`   ✅ Funcionário criado com ID: ${novoFuncionario.id}`)
      console.log(`   🔐 Senha criptografada: ${senhaHash.substring(0, 20)}...`)
      
      sucessos++
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`)
      erros++
    }
  }
  
  console.log('\n📊 RESUMO DA OPERAÇÃO')
  console.log('=' .repeat(60))
  console.log(`Total de funcionários: ${funcionarios.length}`)
  console.log(`Sucessos: ${sucessos}`)
  console.log(`Erros: ${erros}`)
  console.log(`Já existentes: ${funcionarios.length - sucessos - erros}`)
  
  if (sucessos > 0) {
    console.log('\n✅ FUNCIONÁRIOS CRIADOS COM SUCESSO!')
    console.log('\n📋 CREDENCIAIS DE ACESSO:')
    console.log('-' .repeat(60))
    
    for (const func of funcionarios) {
      console.log(`👤 ${func.nome_completo}`)
      console.log(`   Email: ${func.email}`)
      console.log(`   Senha: ${func.senha}`)
      console.log(`   CPF: ${func.cpf || 'Não fornecido'}`)
      console.log(`   Nascimento: ${func.data_nascimento || 'Não fornecido'}`)
      console.log('')
    }
    
    console.log('⚠️ IMPORTANTE:')
    console.log('• Salve essas credenciais em local seguro')
    console.log('• Oriente os funcionários a alterarem as senhas no primeiro acesso')
    console.log('• Complete os dados faltantes (CPF, data nascimento) no painel admin')
    console.log('• Configure salários, cargos e departamentos conforme necessário')
  }
  
  if (erros > 0) {
    console.log('\n⚠️ ALGUNS ERROS OCORRERAM')
    console.log('• Verifique se a tabela funcionarios existe')
    console.log('• Verifique se a empresa_id=1 existe')
    console.log('• Verifique as permissões do banco de dados')
  }
}

// ========================================
// VALIDAÇÕES ANTES DA EXECUÇÃO
// ========================================

async function validarPreRequisitos() {
  console.log('🔍 VALIDANDO PRÉ-REQUISITOS')
  console.log('=' .repeat(60))
  
  try {
    // Testar conexão com Supabase
    const { data, error } = await supabase
      .from('funcionarios')
      .select('count')
      .limit(1)
    
    if (error) {
      throw new Error(`Erro na conexão: ${error.message}`)
    }
    
    console.log('✅ Conexão com Supabase OK')
    
    // Verificar se empresa padrão existe
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id, nome')
      .eq('id', 1)
      .maybeSingle()
    
    if (!empresa) {
      console.log('⚠️ Empresa padrão (ID=1) não encontrada')
      console.log('   Os funcionários serão criados sem empresa_id')
    } else {
      console.log(`✅ Empresa padrão encontrada: ${empresa.nome}`)
    }
    
    return true
    
  } catch (error) {
    console.log(`❌ Erro na validação: ${error.message}`)
    console.log('\n📋 VERIFIQUE:')
    console.log('• Arquivo .env configurado corretamente')
    console.log('• SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY definidos')
    console.log('• Tabela funcionarios existe no banco')
    console.log('• Permissões adequadas no Supabase')
    return false
  }
}

// ========================================
// EXECUÇÃO PRINCIPAL
// ========================================

async function main() {
  console.log('🚀 SCRIPT DE CRIAÇÃO DE FUNCIONÁRIOS')
  console.log('Data/Hora:', new Date().toLocaleString('pt-BR'))
  console.log('')
  
  const validacao = await validarPreRequisitos()
  
  if (!validacao) {
    console.log('\n❌ Validação falhou. Abortando execução.')
    process.exit(1)
  }
  
  console.log('\n🎯 Iniciando criação de funcionários...')
  await criarFuncionarios()
  
  console.log('\n🏁 Script concluído!')
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Erro na execução:', error)
    process.exit(1)
  })
}