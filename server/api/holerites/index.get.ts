import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    
    // Buscar query params para filtros
    const query = getQuery(event)
    const { empresa, mes, status } = query

    // Construir query
    let queryBuilder = supabase
      .from('holerites')
      .select(`
        *,
        funcionario:funcionarios!inner (
          id,
          nome_completo,
          cargo:cargos (nome),
          empresa:empresas (nome_fantasia)
        )
      `)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (empresa) {
      queryBuilder = queryBuilder.eq('funcionario.empresa_id', empresa)
    }

    if (mes) {
      // Filtrar por mês/ano (formato: YYYY-MM)
      const [ano, mesNum] = (mes as string).split('-')
      const dataInicio = `${ano}-${mesNum}-01`
      const ultimoDia = new Date(parseInt(ano), parseInt(mesNum), 0).getDate()
      const dataFim = `${ano}-${mesNum}-${ultimoDia}`
      
      queryBuilder = queryBuilder
        .gte('periodo_inicio', dataInicio)
        .lte('periodo_fim', dataFim)
    }

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    const { data: holerites, error } = await queryBuilder

    if (error) {
      console.error('Erro ao buscar holerites:', error)
      throw error
    }

    // Formatar dados para o frontend
    const holeriteFormatados = holerites?.map((h: any) => ({
      id: h.id,
      funcionario_id: h.funcionario_id, // Adicionar ID do funcionário
      funcionario: {
        nome_completo: h.funcionario.nome_completo,
        cargo: h.funcionario.cargo?.nome || 'Não definido',
        empresa: h.funcionario.empresa?.nome_fantasia || 'Não definida'
      },
      periodo_inicio: h.periodo_inicio,
      periodo_fim: h.periodo_fim,
      salario_base: h.salario_base,
      salario_liquido: h.salario_liquido,
      total_proventos: h.total_proventos,
      total_descontos: h.total_descontos,
      status: h.status,
      bonus: h.bonus,
      horas_extras: h.horas_extras,
      adicional_noturno: h.adicional_noturno,
      adicional_periculosidade: h.adicional_periculosidade,
      adicional_insalubridade: h.adicional_insalubridade,
      comissoes: h.comissoes,
      inss: h.inss,
      irrf: h.irrf,
      vale_transporte: h.vale_transporte,
      vale_refeicao_desconto: h.vale_refeicao_desconto,
      plano_saude: h.plano_saude,
      plano_odontologico: h.plano_odontologico,
      adiantamento: h.adiantamento,
      faltas: h.faltas,
      horas_trabalhadas: h.horas_trabalhadas,
      data_pagamento: h.data_pagamento,
      observacoes: h.observacoes,
      // ✅ CAMPOS CRÍTICOS PARA EXIBIR BENEFÍCIOS E DESCONTOS
      beneficios: h.beneficios || [],
      descontos_personalizados: h.descontos_personalizados || [],
      // Campos adicionais para cálculos
      base_inss: h.base_inss,
      aliquota_inss: h.aliquota_inss,
      base_irrf: h.base_irrf,
      aliquota_irrf: h.aliquota_irrf,
      faixa_irrf: h.faixa_irrf
    })) || []

    return holeriteFormatados
  } catch (error: any) {
    console.error('Erro ao buscar holerites:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar holerites'
    })
  }
})
