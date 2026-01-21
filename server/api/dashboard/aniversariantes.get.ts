import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('[ANIVERSARIANTES] Iniciando busca...')
    
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('[ANIVERSARIANTES] Cliente Supabase criado')
    
    const hoje = new Date()
    const mesAtual = hoje.getMonth() + 1 // getMonth() retorna 0-11
    
    console.log('[ANIVERSARIANTES] Buscando aniversariantes do mês:', mesAtual)
    
    const { data: aniversariantes, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome_completo,
        data_nascimento,
        avatar
      `)
      .eq('status', 'ativo')
      .not('data_nascimento', 'is', null)
    
    if (error) {
      console.error('[ANIVERSARIANTES] Erro na query:', error)
      throw error
    }
    
    console.log('[ANIVERSARIANTES] Funcionários encontrados:', aniversariantes?.length || 0)
    
    // Filtrar aniversariantes do mês atual
    const aniversariantesMes = aniversariantes?.filter(funcionario => {
      if (!funcionario.data_nascimento) return false
      
      const dataNascimento = new Date(funcionario.data_nascimento)
      const mesNascimento = dataNascimento.getMonth() + 1
      
      return mesNascimento === mesAtual
    }) || []
    
    console.log('[ANIVERSARIANTES] Aniversariantes do mês:', aniversariantesMes.length)
    
    // Ordenar por dia do aniversário
    aniversariantesMes.sort((a, b) => {
      const diaA = new Date(a.data_nascimento).getDate()
      const diaB = new Date(b.data_nascimento).getDate()
      return diaA - diaB
    })
    
    return aniversariantesMes
    
  } catch (error: any) {
    console.error('[ANIVERSARIANTES] Erro completo:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar aniversariantes: ${error.message}`
    })
  }
})
