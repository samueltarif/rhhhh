import { serverSupabaseServiceRole } from '#supabase/server'

// ========================================
// FUNÇÕES AUXILIARES PARA CÁLCULO DE IRRF
// Lei 15.270/2025 - Tabelas Oficiais 2026
// ========================================

/**
 * Arredonda valor monetário para 2 casas decimais
 */
function round2(valor: number): number {
  return Math.round(valor * 100) / 100
}

/**
 * Aplica tabela progressiva mensal oficial 2026
 * Fonte: Receita Federal - Tabela Progressiva Mensal
 */
function aplicarTabelaProgressivaMensal(baseIRRF: number): number {
  if (baseIRRF <= 2428.80) {
    return 0
  } else if (baseIRRF <= 3051.00) {
    return (baseIRRF * 0.075) - 182.16
  } else if (baseIRRF <= 4052.00) {
    return (baseIRRF * 0.15) - 394.16
  } else if (baseIRRF <= 5050.00) {
    return (baseIRRF * 0.225) - 675.49
  } else {
    return (baseIRRF * 0.275) - 896.00
  }
}

/**
 * Normaliza e valida número de dependentes
 */
function normalizarDependentes(dependentes: any): number {
  if (dependentes === null || dependentes === undefined || dependentes === '') {
    return 0
  }
  
  const num = Number(dependentes)
  if (isNaN(num) || num < 0) {
    console.warn(`⚠️ Número de dependentes inválido: ${dependentes}, usando 0`)
    return 0
  }
  
  return Math.floor(num) // Garantir que seja inteiro
}

/**
 * Normaliza e valida pensão alimentícia
 */
function normalizarPensao(pensao: any): number {
  if (pensao === null || pensao === undefined || pensao === '') {
    return 0
  }
  
  const num = Number(pensao)
  if (isNaN(num) || num < 0) {
    console.warn(`⚠️ Pensão alimentícia inválida: ${pensao}, usando 0`)
    return 0
  }
  
  return round2(num)
}

/**
 * Normaliza e valida gastos com saúde
 */
/**
 * Calcula redutor conforme Lei 15.270/2025
 * Art. 1º - Redução do imposto sobre a renda
 */
function calcularRedutorLei15270(baseIRRF: number): number {
  if (baseIRRF <= 5000.00) {
    // Até R$ 5.000: redutor igual ao imposto calculado pela tabela para zerar
    const impostoTabela = aplicarTabelaProgressivaMensal(baseIRRF)
    return impostoTabela
  } else if (baseIRRF <= 7350.00) {
    // Entre R$ 5.000,01 e R$ 7.350: fórmula linear decrescente
    return 978.62 - (0.133145 * baseIRRF)
  } else {
    // Acima de R$ 7.350: sem redutor
    return 0
  }
}

/**
 * Calcula base IRRF com todas as deduções legais
 */
function calcularBaseIRRF(
  salarioBruto: number, 
  inss: number, 
  dependentes: number, 
  pensao: number, 
  gastosSaude: number
): { baseIRRF: number, deducoesAplicadas: any } {
  
  const deducaoDependentes = dependentes * 189.59
  
  // Base inicial sem saúde
  let base = salarioBruto - inss - deducaoDependentes - pensao
  
  // Aplicar dedução de saúde (sem limite legal em 2026)
  base = base - gastosSaude
  
  // Garantir que a base nunca seja negativa
  const baseIRRF = Math.max(0, base)
  
  const deducoesAplicadas = {
    salarioBruto: round2(salarioBruto),
    inss: round2(inss),
    dependentes: {
      quantidade: dependentes,
      valorUnitario: 189.59,
      totalDeduzido: round2(deducaoDependentes)
    },
    pensaoAlimenticia: round2(pensao),
    gastosSaude: round2(gastosSaude),
    baseCalculada: round2(base),
    baseIRRF: round2(baseIRRF),
    baseNegativaAjustada: base < 0
  }
  
  if (base < 0) {
    console.warn(`⚠️ Base IRRF seria negativa (R$ ${base.toFixed(2)}), ajustada para R$ 0,00`)
  }
  
  return { baseIRRF: round2(baseIRRF), deducoesAplicadas }
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    
    const { 
      periodo_inicio, 
      periodo_fim, 
      funcionario_ids,
      tipo = 'mensal',
      recriar = false
    } = body

    console.log(`🎯 Tipo de geração: ${tipo}`)
    console.log(`📅 Período: ${periodo_inicio} a ${periodo_fim}`)

    // Buscar funcionários ativos
    let query = supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base, numero_dependentes, pensao_alimenticia, tipo_contrato')
      .eq('status', 'ativo')

    if (funcionario_ids && funcionario_ids.length > 0) {
      query = query.in('id', funcionario_ids)
    }

    const { data: funcionarios, error: funcError } = await query

    if (funcError) throw funcError

    if (!funcionarios || funcionarios.length === 0) {
      return {
        success: false,
        message: 'Nenhum funcionário ativo encontrado'
      }
    }

    console.log('👥 Funcionários encontrados:', funcionarios.length)

    const hoje = new Date()
    const inicio = periodo_inicio || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
    const fim = periodo_fim || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-15`

    const holeritesCriados = []
    const erros = []

    for (const func of funcionarios) {
      try {
        console.log(`\n🔄 Processando funcionário: ${(func as any).nome_completo}`)
        
        // Verificar se já existe holerite
        const { data: existente } = await supabase
          .from('holerites')
          .select('id')
          .eq('funcionario_id', (func as any).id)
          .eq('periodo_inicio', inicio)
          .eq('periodo_fim', fim)
          .maybeSingle()

        if (existente && !recriar) {
          console.log(`⚠️ Holerite já existe para ${(func as any).nome_completo}`)
          erros.push({
            funcionario: (func as any).nome_completo,
            erro: 'Holerite já existe para este período'
          })
          continue
        }
        
        if (existente && recriar) {
          console.log(`🔄 Recriando holerite para ${(func as any).nome_completo}`)
          await supabase
            .from('holerites')
            .delete()
            .eq('id', (existente as any).id)
        }

        const salarioBase = (func as any).salario_base || 0
        const isAdiantamento = tipo === 'adiantamento'
        
        if (isAdiantamento) {
          // ========================================
          // ADIANTAMENTO: 40% DO SALÁRIO BRUTO (SEM DESCONTOS)
          // ========================================
          const valorAdiantamento = salarioBase * 0.40
          
          console.log(`💰 ADIANTAMENTO: 40% de R$ ${salarioBase.toFixed(2)} = R$ ${valorAdiantamento.toFixed(2)}`)
          
          const dadosAdiantamento = {
            funcionario_id: (func as any).id,
            periodo_inicio: inicio,
            periodo_fim: fim,
            data_pagamento: fim,
            salario_base: valorAdiantamento,
            
            // Todos os outros campos zerados
            bonus: 0,
            horas_extras: 0,
            adicional_noturno: 0,
            adicional_periculosidade: 0,
            adicional_insalubridade: 0,
            comissoes: 0,
            inss: 0,
            base_inss: 0,
            aliquota_inss: 0,
            irrf: 0,
            base_irrf: 0,
            aliquota_irrf: 0,
            vale_transporte: 0,
            cesta_basica_desconto: 0,
            plano_saude: 0,
            plano_odontologico: 0,
            adiantamento: 0,
            faltas: 0,
            outros_descontos: 0,
            
            beneficios: [],
            descontos_personalizados: [],
            
            status: 'gerado',
            observacoes: `Adiantamento salarial (40%) - Salário base: R$ ${salarioBase.toFixed(2)}`
          }

          const { data: holerite, error: holeriteError } = await supabase
            .from('holerites')
            .insert(dadosAdiantamento)
            .select()
            .single()

          if (holeriteError) throw holeriteError

          // Atualizar campos calculados
          await supabase
            .from('holerites')
            .update({
              total_proventos: valorAdiantamento,
              total_descontos: 0,
              salario_liquido: valorAdiantamento
            })
            .eq('id', (holerite as any).id)

          console.log(`✅ Adiantamento criado: R$ ${valorAdiantamento.toFixed(2)}`)
          
          holeritesCriados.push({
            funcionario: (func as any).nome_completo,
            holerite_id: (holerite as any).id
          })
          
        } else {
          // ========================================
          // FOLHA MENSAL: SALÁRIO BRUTO - TODOS OS DESCONTOS
          // ========================================
          
          // Buscar adiantamentos do mês atual
          const mesAno = inicio.substring(0, 7)
          const { data: adiantamentos } = await supabase
            .from('holerites')
            .select('salario_base, observacoes')
            .eq('funcionario_id', (func as any).id)
            .gte('periodo_inicio', mesAno + '-01')
            .lt('periodo_fim', mesAno + '-16')
          
          let totalAdiantamentos = 0
          if (adiantamentos && adiantamentos.length > 0) {
            totalAdiantamentos = adiantamentos.reduce((sum: number, h: any) => {
              if (h.observacoes?.includes('Adiantamento')) {
                return sum + (h.salario_base || 0)
              }
              return sum
            }, 0)
            console.log(`💸 Adiantamentos do mês: R$ ${totalAdiantamentos.toFixed(2)}`)
          }
          
          // Calcular INSS (apenas para CLT)
          let inss = 0
          let aliquotaEfetiva = 0
          
          const tipoContrato = (func as any).tipo_contrato || 'CLT'
          
          if (tipoContrato === 'PJ') {
            // Funcionários PJ não têm desconto de INSS
            inss = 0
            aliquotaEfetiva = 0
            console.log(`💼 Funcionário PJ - Sem desconto de INSS`)
          } else {
            // Cálculo normal do INSS para CLT e outros contratos
            if (salarioBase <= 1518.00) {
              inss = salarioBase * 0.075
              aliquotaEfetiva = 7.5
            } else if (salarioBase <= 2793.88) {
              inss = 1518.00 * 0.075 + (salarioBase - 1518.00) * 0.09
              aliquotaEfetiva = (inss / salarioBase) * 100
            } else if (salarioBase <= 4190.83) {
              inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (salarioBase - 2793.88) * 0.12
              aliquotaEfetiva = (inss / salarioBase) * 100
            } else if (salarioBase <= 8157.41) {
              inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (salarioBase - 4190.83) * 0.14
              aliquotaEfetiva = (inss / salarioBase) * 100
            } else {
              inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (8157.41 - 4190.83) * 0.14
              aliquotaEfetiva = (inss / salarioBase) * 100
            }
            
            inss = Math.round(inss * 100) / 100
            aliquotaEfetiva = Math.round(aliquotaEfetiva * 100) / 100
          }
          
          // Calcular IRRF conforme Lei 15.270/2025 com todas as deduções (apenas para CLT)
          let irrf = 0
          let baseIRRF = 0
          let aliquotaIRRF = 0
          let deducoesAplicadas = null
          
          if (tipoContrato === 'PJ') {
            // Funcionários PJ não têm desconto de IRRF
            irrf = 0
            baseIRRF = 0
            aliquotaIRRF = 0
            console.log(`💼 Funcionário PJ - Sem desconto de IRRF`)
          } else {
            // Cálculo normal do IRRF para CLT e outros contratos
            const numeroDependentes = normalizarDependentes((func as any).numero_dependentes)
            const pensaoAlimenticia = normalizarPensao((func as any).pensao_alimenticia)
            
            // Buscar gastos com saúde do funcionário (se disponível)
            // Por enquanto, assumimos 0 pois não temos esses dados na consulta inicial
            const gastosSaude = 0 // TODO: Buscar plano_saude + plano_odontologico do funcionário
            
            const calculoIRRF = calcularBaseIRRF(
              salarioBase, 
              inss, 
              numeroDependentes, 
              pensaoAlimenticia, 
              gastosSaude
            )
            
            baseIRRF = calculoIRRF.baseIRRF
            deducoesAplicadas = calculoIRRF.deducoesAplicadas
            
            // Aplicar tabela progressiva mensal 2026 e redutor da Lei 15.270/2025
            const irrfTabelaNormal = aplicarTabelaProgressivaMensal(baseIRRF)
            const redutorLei15270 = calcularRedutorLei15270(baseIRRF)
            irrf = Math.max(0, round2(irrfTabelaNormal - redutorLei15270))
            aliquotaIRRF = baseIRRF > 0 ? round2((irrf / baseIRRF) * 100) : 0
          }
          
          // Determinar faixa para logs
          let faixaIRRF = ''
          if (tipoContrato === 'PJ') {
            faixaIRRF = 'pj_sem_irrf'
          } else if (baseIRRF <= 5000.00) {
            faixaIRRF = 'isencao'
          } else if (baseIRRF <= 7350.00) {
            faixaIRRF = 'reducao_gradual'
          } else {
            faixaIRRF = 'sem_reducao'
          }
          
          console.log(`📊 CÁLCULOS MENSAIS:`)
          console.log(`   Tipo Contrato: ${tipoContrato}`)
          console.log(`   Salário Base: R$ ${salarioBase.toFixed(2)}`)
          console.log(`   INSS: R$ ${inss.toFixed(2)} (${aliquotaEfetiva}%)`)
          
          if (tipoContrato !== 'PJ' && deducoesAplicadas) {
            const numeroDependentes = normalizarDependentes((func as any).numero_dependentes)
            const pensaoAlimenticia = normalizarPensao((func as any).pensao_alimenticia)
            console.log(`   Dependentes: ${numeroDependentes} × R$ 189,59 = R$ ${deducoesAplicadas.dependentes.totalDeduzido.toFixed(2)}`)
            console.log(`   Pensão Alimentícia: R$ ${pensaoAlimenticia.toFixed(2)}`)
            console.log(`   Base IRRF: R$ ${baseIRRF.toFixed(2)}`)
            if (deducoesAplicadas.baseNegativaAjustada) {
              console.log(`   ⚠️ Base ajustada (era negativa): R$ ${deducoesAplicadas.baseCalculada.toFixed(2)} → R$ ${baseIRRF.toFixed(2)}`)
            }
            const irrfTabelaNormal = aplicarTabelaProgressivaMensal(baseIRRF)
            const redutorLei15270 = calcularRedutorLei15270(baseIRRF)
            console.log(`   IRRF Tabela Normal: R$ ${irrfTabelaNormal.toFixed(2)}`)
            console.log(`   Redutor Lei 15.270: R$ ${redutorLei15270.toFixed(2)}`)
          }
          
          console.log(`   IRRF Final: R$ ${irrf.toFixed(2)} (${aliquotaIRRF}%)`)
          console.log(`   Faixa: ${faixaIRRF}`)
          console.log(`   Adiantamentos: R$ ${totalAdiantamentos.toFixed(2)}`)
          
          if (tipoContrato === 'PJ') {
            console.log(`   💼 PJ: Salário integral sem descontos obrigatórios`)
          }
          
          const dadosMensal = {
            funcionario_id: (func as any).id,
            periodo_inicio: inicio,
            periodo_fim: fim,
            data_pagamento: fim,
            salario_base: salarioBase,
            
            bonus: 0,
            horas_extras: 0,
            adicional_noturno: 0,
            adicional_periculosidade: 0,
            adicional_insalubridade: 0,
            comissoes: 0,
            
            inss: inss,
            base_inss: salarioBase,
            aliquota_inss: aliquotaEfetiva,
            irrf: irrf,
            base_irrf: baseIRRF,
            aliquota_irrf: aliquotaIRRF,
            vale_transporte: 0,
            cesta_basica_desconto: 0,
            plano_saude: 0,
            plano_odontologico: 0,
            adiantamento: totalAdiantamentos,
            faltas: 0,
            outros_descontos: 0,
            
            beneficios: [],
            descontos_personalizados: [],
            
            status: 'gerado',
            observacoes: totalAdiantamentos > 0 
              ? `Folha mensal - Desconto de adiantamento: R$ ${totalAdiantamentos.toFixed(2)}`
              : 'Folha mensal'
          }

          const { data: holerite, error: holeriteError } = await supabase
            .from('holerites')
            .insert(dadosMensal)
            .select()
            .single()

          if (holeriteError) throw holeriteError

          // Calcular totais
          const totalProventos = salarioBase
          const totalDescontos = inss + irrf + totalAdiantamentos
          const salarioLiquido = totalProventos - totalDescontos

          // Atualizar campos calculados
          await supabase
            .from('holerites')
            .update({
              total_proventos: totalProventos,
              total_descontos: totalDescontos,
              salario_liquido: salarioLiquido
            })
            .eq('id', (holerite as any).id)

          console.log(`✅ Folha mensal criada:`)
          console.log(`   Proventos: R$ ${totalProventos.toFixed(2)}`)
          console.log(`   Descontos: R$ ${totalDescontos.toFixed(2)}`)
          console.log(`   Líquido: R$ ${salarioLiquido.toFixed(2)}`)
          
          holeritesCriados.push({
            funcionario: (func as any).nome_completo,
            holerite_id: (holerite as any).id
          })
        }

      } catch (error: any) {
        console.error(`❌ Erro ao gerar holerite para ${(func as any).nome_completo}:`, error.message)
        erros.push({
          funcionario: (func as any).nome_completo,
          erro: error.message
        })
      }
    }

    return {
      success: true,
      message: `${holeritesCriados.length} holerite(s) gerado(s) com sucesso`,
      total_gerados: holeritesCriados.length,
      total_erros: erros.length,
      holerites: holeritesCriados,
      erros: erros.length > 0 ? erros : undefined
    }

  } catch (error: any) {
    console.error('Erro ao gerar holerites:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao gerar holerites'
    })
  }
})