#!/usr/bin/env node

/**
 * VERIFICAR EMPRESAS EXISTENTES
 * Lista as empresas disponíveis no banco
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🏢 VERIFICANDO EMPRESAS EXISTENTES')
console.log('=' .repeat(50))

async function verificarEmpresas() {
  try {
    // Buscar empresas
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('id, nome, cnpj')
      .order('id')
    
    if (error) {
      console.log('❌ Erro ao buscar empresas:', error.message)
      return
    }
    
    if (!empresas || empresas.length === 0) {
      console.log('⚠️ Nenhuma empresa encontrada no banco')
      return
    }
    
    console.log(`✅ Encontradas ${empresas.length} empresa(s):`)
    console.log('')
    
    empresas.forEach((empresa, index) => {
      console.log(`${index + 1}. ID: ${empresa.id}`)
      console.log(`   Nome: ${empresa.nome}`)
      console.log(`   CNPJ: ${empresa.cnpj}`)
      console.log('')
    })
    
    // Buscar departamentos
    console.log('🏛️ VERIFICANDO DEPARTAMENTOS:')
    const { data: departamentos } = await supabase
      .from('departamentos')
      .select('id, nome')
      .order('id')
      .limit(5)
    
    if (departamentos && departamentos.length > 0) {
      console.log(`✅ Encontrados ${departamentos.length} departamento(s):`)
      departamentos.forEach(dept => {
        console.log(`   ID: ${dept.id} - ${dept.nome}`)
      })
    } else {
      console.log('⚠️ Nenhum departamento encontrado')
    }
    
    // Buscar cargos
    console.log('\n💼 VERIFICANDO CARGOS:')
    const { data: cargos } = await supabase
      .from('cargos')
      .select('id, nome')
      .order('id')
      .limit(5)
    
    if (cargos && cargos.length > 0) {
      console.log(`✅ Encontrados ${cargos.length} cargo(s):`)
      cargos.forEach(cargo => {
        console.log(`   ID: ${cargo.id} - ${cargo.nome}`)
      })
    } else {
      console.log('⚠️ Nenhum cargo encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

verificarEmpresas()
  .then(() => {
    console.log('\n✅ Verificação concluída!')
  })
  .catch((error) => {
    console.error('\n💥 Erro:', error)
  })