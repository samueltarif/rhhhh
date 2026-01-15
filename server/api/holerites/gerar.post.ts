import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    
    // Parâmetros opcionais
    const { 
      periodo_inicio, 
      periodo_fim, 
      funcionario_ids, // Se vazio, gera para todos
      recriar = false // Se true, recria holerites mesmo que já existam
    } = body

    // Buscar funcionários ativos
    let query = supabase
      .from('funcionarios')
      .select('id, nome_completo, salario_base, empresa_id, cargo_id, departamento_id, numero_dependentes, beneficios, descontos_personalizados')
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
    console.log('💰 Salários:', funcionarios.map((f: any) => ({ nome: f.nome_completo, salario: f.salario_base })))

    // Definir período se não foi fornecido
    const hoje = new Date()
    const inicio = periodo_inicio || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
    const fim = periodo_fim || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-15`

    console.log('📅 Período:', { inicio, fim })

    // Gerar holerites para cada funcionário
    const holeritesCriados = []
    const erros = []

    for (const func of funcionarios) {
      try {
        console.log(`\n🔄 Processando funcionário: ${(func as any).nome_completo}`)
        
        // Verificar se já existe holerite para este período
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
        
        // Se recriar = true e existe, excluir o antigo
        if (existente && recriar) {
          console.log(`🔄 Recriando holerite para ${(func as any).nome_completo}`)
          await supabase
            .from('holerites')
            .delete()
            .eq('id', (existente as any).id)
        }

        // Calcular valores
        const salarioBase = (func as any).salario_base || 0
        
        // Cálculo CORRETO do INSS 2024 (tabela progressiva)
        const baseINSS = salarioBase
        let inss = 0
        let aliquotaEfetiva = 0
        
        if (baseINSS <= 1412.00) {
          inss = baseINSS * 0.075
          aliquotaEfetiva = 7.5
        } else if (baseINSS <= 2666.68) {
          inss = 1412.00 * 0.075
          inss += (baseINSS - 1412.00) * 0.09
          aliquotaEfetiva = (inss / baseINSS) * 100
        } else if (baseINSS <= 4000.03) {
          inss = 1412.00 * 0.075
          inss += (2666.68 - 1412.00) * 0.09
          inss += (baseINSS - 2666.68) * 0.12
          aliquotaEfetiva = (inss / baseINSS) * 100
        } else {
          inss = 1412.00 * 0.075
          inss += (2666.68 - 1412.00) * 0.09
          inss += (4000.03 - 2666.68) * 0.12
          inss += (baseINSS - 4000.03) * 0.14
          aliquotaEfetiva = (inss / baseINSS) * 100
          
          if (inss > 908.85) {
            inss = 908.85
            aliquotaEfetiva = (inss / baseINSS) * 100
          }
        }
        
        inss = Math.round(inss * 100) / 100
        aliquotaEfetiva = Math.round(aliquotaEfetiva * 100) / 100
        
        // ========================================
        // CÁLCULO OFICIAL DE IRRF - BRASIL 2026
        // ========================================
        const numeroDependentes = (func as any).numero_dependentes || 0
        const deducaoDependentes = numeroDependentes * 189.59
        const baseIRRF = salarioBase - inss - deducaoDependentes
        
        console.log(`   💰 Base IRRF: R$ ${baseIRRF.toFixed(2)} (Bruto: ${salarioBase} - INSS: ${inss} - Dep: ${deducaoDependentes})`)
        console.log(`   👨‍👩‍👧‍👦 Dependentes: ${numeroDependentes}`)
        
        let irrf = 0
        let aliquotaIRRF = 0
        let faixaIRRF = 'Isento'
        
        // ========================================
        // REGRA 1: ISENÇÃO CLT até R$ 5.000,00 (Base IRRF)
        // ========================================
        if (baseIRRF <= 5000.00) {
          irrf = 0
          aliquotaIRRF = 0
          faixaIRRF = 'Isento CLT (até R$ 5.000,00)'
          console.log(`   ✅ ISENTO CLT - Base IRRF: R$ ${baseIRRF.toFixed(2)} ≤ R$ 5.000,00`)
        }
        // ========================================
        // REGRA 2: FAIXA DE TRANSIÇÃO COM REDUTOR (R$ 5.000,01 a R$ 7.350,00)
        // ========================================
        else if (baseIRRF <= 7350.00) {
          // Calcular IR pela tabela progressiva normal
          let irrfTabela = 0
          let aliquotaTabelaNominal = 0
          
          if (baseIRRF <= 2259.20) {
            irrfTabela = 0
            aliquotaTabelaNominal = 0
          } else if (baseIRRF <= 2826.65) {
            irrfTabela = (baseIRRF * 0.075) - 169.44
            aliquotaTabelaNominal = 7.5
          } else if (baseIRRF <= 3751.05) {
            irrfTabela = (baseIRRF * 0.15) - 381.44
            aliquotaTabelaNominal = 15
          } else if (baseIRRF <= 4664.68) {
            irrfTabela = (baseIRRF * 0.225) - 662.77
            aliquotaTabelaNominal = 22.5
          } else {
            irrfTabela = (baseIRRF * 0.275) - 896.00
            aliquotaTabelaNominal = 27.5
          }
          
          // Aplicar redutor progressivo baseado na isenção CLT
          const fatorReducao = (baseIRRF - 5000.00) / (7350.00 - 5000.00)
          irrf = irrfTabela * fatorReducao
          aliquotaIRRF = baseIRRF > 0 ? (irrf / baseIRRF) * 100 : 0
          faixaIRRF = `Transição c/ Redutor (${(fatorReducao * 100).toFixed(1)}% do IR ${aliquotaTabelaNominal}%)`
          
          console.log(`   🟡 TRANSIÇÃO COM REDUTOR`)
          console.log(`      Base IRRF: R$ ${baseIRRF.toFixed(2)}`)
          console.log(`      IR Tabela (${aliquotaTabelaNominal}%): R$ ${irrfTabela.toFixed(2)}`)
          console.log(`      Fator Redução: ${(fatorReducao * 100).toFixed(1)}%`)
          console.log(`      IR Final: R$ ${irrf.toFixed(2)}`)
        }
        // ========================================
        // REGRA 3: ACIMA DE R$ 7.350,00 - Tabela Progressiva Normal
        // ========================================
        else {
          if (baseIRRF <= 2259.20) {
            irrf = 0
            aliquotaIRRF = 0
            faixaIRRF = 'Isento'
          } else if (baseIRRF <= 2826.65) {
            irrf = (baseIRRF * 0.075) - 169.44
            aliquotaIRRF = 7.5
            faixaIRRF = '7,5%'
          } else if (baseIRRF <= 3751.05) {
            irrf = (baseIRRF * 0.15) - 381.44
            aliquotaIRRF = 15
            faixaIRRF = '15%'
          } else if (baseIRRF <= 4664.68) {
            irrf = (baseIRRF * 0.225) - 662.77
            aliquotaIRRF = 22.5
            faixaIRRF = '22,5%'
          } else {
            irrf = (baseIRRF * 0.275) - 896.00
            aliquotaIRRF = 27.5
            faixaIRRF = '27,5%'
          }
          
          console.log(`   🔴 TABELA NORMAL - Faixa: ${faixaIRRF} | IRRF: R$ ${irrf.toFixed(2)}`)
        }
        
        // Arredondar e garantir que não seja negativo
        irrf = Math.max(0, Math.round(irrf * 100) / 100)
        aliquotaIRRF = Math.round(aliquotaIRRF * 100) / 100
        
        // ========================================
        // CÁLCULO DE BENEFÍCIOS E DESCONTOS
        // ========================================
        let totalBeneficios = 0
        let totalDescontosPersonalizados = 0
        let detalheBeneficios = []
        let detalheDescontos = []
        
        const funcionario = func as any
        
        // Processar benefícios
        if (funcionario.beneficios) {
          console.log(`   🎁 Processando benefícios para ${funcionario.nome_completo}`)
          console.log(`   📋 Benefícios recebidos:`, JSON.stringify(funcionario.beneficios, null, 2))
          
          // Vale Transporte
          if (funcionario.beneficios.vale_transporte?.ativo) {
            const vt = funcionario.beneficios.vale_transporte
            console.log(`   🚌 Vale Transporte ativo:`, vt)
            
            // Calcular valor mensal
            let valorMensal = 0
            if (vt.valor_total) {
              // Formato antigo (Silvana)
              valorMensal = vt.valor_total
            } else if (vt.valor) {
              // Formato novo - valor diário * 22 dias
              valorMensal = parseFloat(vt.valor) * 22
            }
            
            if (valorMensal > 0) {
              totalBeneficios += valorMensal
              
              // Calcular desconto
              let desconto = 0
              if (vt.tipo_desconto === 'percentual') {
                const percentual = parseFloat(vt.percentual_desconto) || 0
                desconto = salarioBase * (percentual / 100)
              } else if (vt.tipo_desconto === 'valor_fixo') {
                desconto = parseFloat(vt.valor_desconto) || 0
              }
              
              detalheBeneficios.push({
                tipo: 'Vale Transporte',
                valor: valorMensal,
                desconto: desconto
              })
              
              totalDescontosPersonalizados += desconto
              console.log(`      🚌 Vale Transporte: +R$ ${valorMensal.toFixed(2)} / -R$ ${desconto.toFixed(2)}`)
            }
          }
          
          // Vale Refeição
          if (funcionario.beneficios.vale_refeicao?.ativo) {
            const vr = funcionario.beneficios.vale_refeicao
            console.log(`   🍽️ Vale Refeição ativo:`, vr)
            
            // Calcular valor mensal
            let valorMensal = 0
            if (vr.valor_mensal) {
              valorMensal = parseFloat(vr.valor_mensal)
            } else if (vr.valor) {
              // Valor diário * 22 dias
              valorMensal = parseFloat(vr.valor) * 22
            }
            
            if (valorMensal > 0) {
              totalBeneficios += valorMensal
              
              // Calcular desconto
              let desconto = 0
              if (vr.tipo_desconto === 'percentual') {
                const percentual = parseFloat(vr.percentual_desconto) || 0
                desconto = salarioBase * (percentual / 100)
              } else if (vr.tipo_desconto === 'valor_fixo') {
                desconto = parseFloat(vr.valor_desconto) || 0
              }
              // Se tipo_desconto for 'sem_desconto', desconto fica 0
              
              detalheBeneficios.push({
                tipo: 'Vale Refeição',
                valor: valorMensal,
                desconto: desconto
              })
              
              totalDescontosPersonalizados += desconto
              console.log(`      🍽️ Vale Refeição: +R$ ${valorMensal.toFixed(2)} / -R$ ${desconto.toFixed(2)}`)
            }
          }
          
          // Plano de Saúde
          if (funcionario.beneficios.plano_saude?.ativo) {
            const ps = funcionario.beneficios.plano_saude
            console.log(`   🏥 Plano de Saúde ativo:`, ps)
            
            const valorEmpresa = parseFloat(ps.valor_empresa) || 0
            const descontoFuncionario = parseFloat(ps.valor_funcionario) || 0
            
            if (valorEmpresa > 0 || descontoFuncionario > 0) {
              totalBeneficios += valorEmpresa
              totalDescontosPersonalizados += descontoFuncionario
              
              detalheBeneficios.push({
                tipo: 'Plano de Saúde',
                valor: valorEmpresa,
                desconto: descontoFuncionario
              })
              
              console.log(`      🏥 Plano de Saúde: +R$ ${valorEmpresa.toFixed(2)} / -R$ ${descontoFuncionario.toFixed(2)}`)
            }
          }
          
          // Plano Odontológico
          if (funcionario.beneficios.plano_odonto?.ativo) {
            const po = funcionario.beneficios.plano_odonto
            console.log(`   🦷 Plano Odontológico ativo:`, po)
            
            const descontoFuncionario = parseFloat(po.valor_funcionario) || 0
            
            if (descontoFuncionario > 0) {
              totalDescontosPersonalizados += descontoFuncionario
              
              detalheDescontos.push({
                tipo: 'Plano Odontológico',
                valor: descontoFuncionario
              })
              
              console.log(`      🦷 Plano Odontológico: -R$ ${descontoFuncionario.toFixed(2)}`)
            }
          }
        }
        
        // Processar descontos personalizados
        if (funcionario.descontos_personalizados && Array.isArray(funcionario.descontos_personalizados)) {
          console.log(`   📉 Processando descontos personalizados`)
          
          funcionario.descontos_personalizados.forEach((desconto: any) => {
            let valorDesconto = 0
            
            if (desconto.tipo === 'percentual') {
              valorDesconto = salarioBase * (parseFloat(desconto.percentual) || 0) / 100
            } else if (desconto.tipo === 'valor_fixo') {
              valorDesconto = parseFloat(desconto.valor) || 0
            }
            
            if (valorDesconto > 0) {
              totalDescontosPersonalizados += valorDesconto
              
              detalheDescontos.push({
                tipo: desconto.descricao || 'Desconto',
                valor: valorDesconto
              })
              
              console.log(`      📉 ${desconto.descricao}: -R$ ${valorDesconto.toFixed(2)}`)
            }
          })
        }
        
        console.log(`   💰 Total Benefícios: R$ ${totalBeneficios.toFixed(2)}`)
        console.log(`   📉 Total Descontos Personalizados: R$ ${totalDescontosPersonalizados.toFixed(2)}`)
        console.log(`   🎁 Detalhe Benefícios:`, detalheBeneficios)
        console.log(`   📉 Detalhe Descontos:`, detalheDescontos)
        
        // Calcular totais finais
        const totalProventos = salarioBase + totalBeneficios
        const totalDescontos = inss + irrf + totalDescontosPersonalizados
        const salarioLiquido = totalProventos - totalDescontos

        // Criar holerite
        const { data: holerite, error: holeriteError } = await supabase
          .from('holerites')
          .insert({
            funcionario_id: (func as any).id,
            periodo_inicio: inicio,
            periodo_fim: fim,
            data_pagamento: fim,
            salario_base: salarioBase,
            inss: inss,
            base_inss: baseINSS,
            aliquota_inss: aliquotaEfetiva,
            irrf: irrf,
            base_irrf: baseIRRF,
            aliquota_irrf: aliquotaIRRF,
            faixa_irrf: faixaIRRF,
            total_proventos: totalProventos,
            total_descontos: totalDescontos,
            salario_liquido: salarioLiquido,
            beneficios: detalheBeneficios,
            descontos_personalizados: detalheDescontos,
            status: 'gerado',
            observacoes: 'Holerite gerado automaticamente pelo sistema'
          } as any)
          .select()
          .single()

        if (holeriteError) throw holeriteError

        console.log(`✅ Holerite criado com sucesso para ${(func as any).nome_completo}`)
        console.log(`   💰 Salário Base: R$ ${salarioBase.toFixed(2)}`)
        console.log(`   🎁 Benefícios: R$ ${totalBeneficios.toFixed(2)}`)
        console.log(`   📊 Total Proventos: R$ ${totalProventos.toFixed(2)}`)
        console.log(`   📉 INSS: R$ ${inss.toFixed(2)} | IRRF: R$ ${irrf.toFixed(2)} | Outros: R$ ${totalDescontosPersonalizados.toFixed(2)}`)
        console.log(`   📊 Total Descontos: R$ ${totalDescontos.toFixed(2)}`)
        console.log(`   💵 Salário Líquido: R$ ${salarioLiquido.toFixed(2)}`)

        holeritesCriados.push({
          funcionario: (func as any).nome_completo,
          holerite_id: (holerite as any).id
        })

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