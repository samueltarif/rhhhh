export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  // Pegar ID do funcionário do query parameter (enviado pelo frontend)
  const query = getQuery(event)
  const funcionarioId = query.funcionarioId

  console.log('🔍 [MEUS-HOLERITES] Requisição recebida')
  console.log('🔍 [MEUS-HOLERITES] Query params:', query)
  console.log('🔍 [MEUS-HOLERITES] Funcionário ID:', funcionarioId)
  console.log('🔍 [MEUS-HOLERITES] Headers da requisição:', getHeaders(event))

  if (!funcionarioId) {
    console.error('❌ [MEUS-HOLERITES] Funcionário não identificado')
    throw createError({
      statusCode: 401,
      message: 'Funcionário não identificado'
    })
  }

  console.log('🔍 [MEUS-HOLERITES] Buscando holerites para funcionário ID:', funcionarioId)

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

    console.log('📊 [MEUS-HOLERITES] Status da resposta Supabase:', response.status)
    console.log('📊 [MEUS-HOLERITES] Headers da resposta Supabase:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [MEUS-HOLERITES] Erro ao buscar holerites:', errorText)
      throw new Error('Erro ao buscar holerites')
    }

    const holerites = await response.json()
    console.log('📦 [MEUS-HOLERITES] Holerites encontrados:', holerites.length)
    console.log('📦 [MEUS-HOLERITES] Dados dos holerites:', JSON.stringify(holerites, null, 2))
    console.log('   (Holerites com status "gerado" não são exibidos)')

    return holerites || []
  } catch (error: any) {
    console.error('💥 [MEUS-HOLERITES] Erro ao buscar holerites:', error)
    console.error('💥 [MEUS-HOLERITES] Stack trace:', error.stack)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar holerites'
    })
  }
})
