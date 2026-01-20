export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  // Pegar ID do funcionário do query parameter (enviado pelo frontend)
  const query = getQuery(event)
  const funcionarioId = query.funcionarioId

  if (!funcionarioId) {
    throw createError({
      statusCode: 401,
      message: 'Funcionário não identificado'
    })
  }

  console.log('🔍 Buscando holerites do funcionário ID:', funcionarioId)

  try {
    // Buscar holerites usando SERVICE ROLE KEY para bypassar RLS
    // IMPORTANTE: Apenas holerites com status "enviado" ou "visualizado" são retornados
    // Holerites com status "gerado" NÃO aparecem no perfil do funcionário
    const response = await fetch(
      `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&status=neq.gerado&select=*&order=periodo_inicio.desc`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao buscar holerites:', errorText)
      throw new Error('Erro ao buscar holerites')
    }

    const holerites = await response.json()
    console.log('📦 Holerites disponíveis para o funcionário:', holerites.length)
    console.log('   (Holerites com status "gerado" não são exibidos)')

    return holerites || []
  } catch (error: any) {
    console.error('💥 Erro ao buscar holerites:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar holerites'
    })
  }
})
