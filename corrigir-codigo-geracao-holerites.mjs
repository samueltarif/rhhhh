#!/usr/bin/env node

import fs from 'fs'

async function corrigirCodigoGeracao() {
  console.log('🔧 CORRIGINDO CÓDIGO DE GERAÇÃO DE HOLERITES\n')

  try {
    // Ler o arquivo atual
    const caminhoArquivo = 'server/api/holerites/gerar.post.ts'
    let conteudo = fs.readFileSync(caminhoArquivo, 'utf8')

    console.log('1️⃣ Lendo arquivo atual...')

    // Encontrar a seção de inserção do holerite
    const inicioInsert = conteudo.indexOf('// Criar holerite (SEM os campos calculados')
    const fimInsert = conteudo.indexOf('.single()', inicioInsert) + '.single()'.length

    if (inicioInsert === -1 || fimInsert === -1) {
      console.log('❌ Não foi possível encontrar a seção de inserção')
      return
    }

    console.log('2️⃣ Encontrada seção de inserção...')

    // Criar nova seção de inserção com apenas campos que existem
    const novaInsercao = `        // Criar holerite com apenas campos que REALMENTE existem na tabela
        const dadosHolerite = {
          funcionario_id: (func as any).id,
          periodo_inicio: inicio,
          periodo_fim: fim,
          data_pagamento: fim,
          salario_base: isAdiantamento ? valorPagamento : salarioBase,
          
          // Proventos básicos
          bonus: isAdiantamento ? 0 : 0,
          horas_extras: isAdiantamento ? 0 : 0,
          adicional_noturno: isAdiantamento ? 0 : 0,
          adicional_periculosidade: isAdiantamento ? 0 : 0,
          adicional_insalubridade: isAdiantamento ? 0 : 0,
          comissoes: isAdiantamento ? 0 : 0,
          
          // Descontos básicos
          inss: inss,
          base_inss: isAdiantamento ? 0 : salarioBase,
          aliquota_inss: aliquotaEfetiva,
          irrf: irrf,
          base_irrf: isAdiantamento ? 0 : (salarioBase - inss - ((func as any).numero_dependentes || 0) * 189.59 - (Number((func as any).pensao_alimenticia) || 0)),
          aliquota_irrf: aliquotaIRRF,
          
          // Descontos específicos (usar 0 se não aplicável)
          vale_transporte: 0,
          cesta_basica_desconto: 0,
          plano_saude: 0,
          plano_odontologico: 0,
          adiantamento: isAdiantamento ? 0 : adiantamentoValor,
          faltas: 0,
          outros_descontos: 0,
          
          // Campos adicionais (se existirem)
          ajuda_custo: 0,
          emprestimo_consignado: 0,
          seguro_vida_desconto: 0,
          plano_odonto_desconto: 0,
          pensao_alimenticia: Number((func as any).pensao_alimenticia) || 0,
          
          // Dados JSONB
          beneficios: isAdiantamento ? [] : detalheBeneficios,
          descontos_personalizados: isAdiantamento ? [] : detalheDescontos,
          
          // Controle
          status: 'gerado',
          observacoes: isAdiantamento 
            ? 'Adiantamento salarial (40%) - Será descontado na folha mensal'
            : (adiantamentoValor > 0 
                ? \`Holerite mensal - Desconto de adiantamento: R$ \${adiantamentoValor.toFixed(2)}\`
                : 'Holerite gerado automaticamente pelo sistema')
        }

        const { data: holerite, error: holeriteError } = await supabase
          .from('holerites')
          .insert(dadosHolerite)
          .select()`

    // Substituir a seção
    const antes = conteudo.substring(0, inicioInsert)
    const depois = conteudo.substring(fimInsert)
    const novoConteudo = antes + novaInsercao + depois

    console.log('3️⃣ Substituindo seção de inserção...')

    // Salvar arquivo
    fs.writeFileSync(caminhoArquivo, novoConteudo)

    console.log('✅ Arquivo corrigido com sucesso!')
    console.log('📝 Alterações feitas:')
    console.log('   - Removidos campos que não existem na tabela')
    console.log('   - Adicionados campos que podem existir')
    console.log('   - Estrutura de inserção simplificada')
    console.log('   - Campos calculados removidos da inserção')

    console.log('\n🎯 PRÓXIMO PASSO:')
    console.log('Execute: node criar-holerites-funcionario-129.mjs')

  } catch (error) {
    console.log('❌ Erro durante correção:', error.message)
  }
}

corrigirCodigoGeracao()