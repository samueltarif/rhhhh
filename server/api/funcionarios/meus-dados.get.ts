// API para buscar dados do funcionário logado
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  // Pegar ID do usuário do query parameter (enviado pelo frontend)
  const query = getQuery(event)
  const userId = query.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Usuário não autenticado'
    })
  }

  console.log('🔍 Buscando dados do funcionário ID:', userId)

  try {
    // Buscar dados do funcionário com informações da empresa usando SERVICE ROLE KEY para bypassar RLS
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}&select=*,empresas(id,nome_fantasia,nome,cnpj)`,
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
      console.error('❌ Erro ao buscar funcionário:', errorText)
      throw new Error('Erro ao buscar dados do funcionário')
    }

    const funcionarios = await response.json()
    console.log('📦 Funcionários encontrados:', funcionarios.length)

    if (funcionarios && funcionarios.length > 0) {
      console.log('✅ Dados do funcionário:', funcionarios[0].nome_completo)
      return {
        success: true,
        data: funcionarios[0]
      }
    }

    console.error('❌ Funcionário não encontrado com ID:', userId)
    throw new Error('Funcionário não encontrado')
  } catch (error: any) {
    console.error('💥 Erro ao buscar dados:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar dados do funcionário'
    })
  }
})
