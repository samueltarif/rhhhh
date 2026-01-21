import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('[STATS] Iniciando busca de estatísticas...')
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[STATS] Cliente Supabase criado')
    
    // Buscar total de funcionários
    const { data: funcionarios, error: errorFuncionarios } = await supabase
      .from('funcionarios')
      .select('id', { count: 'exact' })
      .eq('status', 'ativo')
    
    if (errorFuncionarios) {
      console.error('[STATS] Erro ao buscar funcionários:', errorFuncionarios)
      throw errorFuncionarios
    }
    
    console.log('[STATS] Funcionários encontrados:', funcionarios?.length || 0)
    
    // Buscar total de holerites do mês atual
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
    
    const { data: holerites, error: errorHolerites } = await supabase
      .from('holerites')
      .select('id', { count: 'exact' })
      .gte('created_at', inicioMes.toISOString())
      .lte('created_at', fimMes.toISOString())
    
    if (errorHolerites) {
      console.error('[STATS] Erro ao buscar holerites:', errorHolerites)
      throw errorHolerites
    }
    
    console.log('[STATS] Holerites encontrados:', holerites?.length || 0)
    
    // Buscar total de empresas
    const { data: empresas, error: errorEmpresas } = await supabase
      .from('empresas')
      .select('id', { count: 'exact' })
    
    if (errorEmpresas) {
      console.error('[STATS] Erro ao buscar empresas:', errorEmpresas)
      throw errorEmpresas
    }
    
    console.log('[STATS] Empresas encontradas:', empresas?.length || 0)
    
    // Buscar total de departamentos
    const { data: departamentos, error: errorDepartamentos } = await supabase
      .from('departamentos')
      .select('id', { count: 'exact' })
    
    if (errorDepartamentos) {
      console.error('[STATS] Erro ao buscar departamentos:', errorDepartamentos)
      throw errorDepartamentos
    }
    
    console.log('[STATS] Departamentos encontrados:', departamentos?.length || 0)
    
    // Buscar aniversariantes do mês
    const mesAtual = hoje.getMonth() + 1
    const { data: aniversariantes, error: errorAniversariantes } = await supabase
      .from('funcionarios')
      .select('id')
      .eq('status', 'ativo')
      .not('data_nascimento', 'is', null)
      .filter('data_nascimento', 'like', `%-${mesAtual.toString().padStart(2, '0')}-%`)
    
    if (errorAniversariantes) {
      console.error('[STATS] Erro ao buscar aniversariantes:', errorAniversariantes)
    }
    
    console.log('[STATS] Aniversariantes encontrados:', aniversariantes?.length || 0)
    
    const stats = {
      totalFuncionarios: funcionarios?.length || 0,
      holeritesMes: holerites?.length || 0,
      totalEmpresas: empresas?.length || 0,
      totalDepartamentos: departamentos?.length || 0,
      totalAniversariantes: aniversariantes?.length || 0,
      folhaMensal: 0, // Será calculado se necessário
      mesAtual: hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }
    
    console.log('[STATS] Estatísticas finais:', stats)
    
    return stats
    
  } catch (error: any) {
    console.error('[STATS] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar estatísticas: ${error.message}`
    })
  }
})
