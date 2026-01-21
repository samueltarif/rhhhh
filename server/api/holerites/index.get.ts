import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('[HOLERITES] Iniciando busca de holerites...')
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[HOLERITES] Cliente Supabase criado')
    
    const { data: holerites, error } = await supabase
      .from('holerites')
      .select(`
        *,
        funcionarios!inner (
          id,
          nome_completo,
          cpf,
          cargos (
            id,
            nome
          ),
          departamentos (
            id,
            nome
          ),
          empresas (
            id,
            nome,
            nome_fantasia
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('[HOLERITES] Erro na query:', error)
      throw error
    }
    
    console.log('[HOLERITES] Holerites encontrados:', holerites?.length || 0)
    
    // Transformar dados para o formato esperado pelo frontend
    const holeritesTratados = holerites?.map(h => ({
      ...h,
      funcionario: {
        id: h.funcionarios.id,
        nome_completo: h.funcionarios.nome_completo,
        cpf: h.funcionarios.cpf,
        cargo: h.funcionarios.cargos?.nome || 'Cargo não definido',
        empresa: h.funcionarios.empresas?.nome_fantasia || h.funcionarios.empresas?.nome || 'Empresa não definida'
      }
    })) || []
    
    console.log('[HOLERITES] Holerites tratados:', holeritesTratados.length)
    
    return holeritesTratados
    
  } catch (error: any) {
    console.error('[HOLERITES] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar holerites: ${error.message}`
    })
  }
})
