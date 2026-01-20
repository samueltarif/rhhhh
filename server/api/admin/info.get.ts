// API para buscar informações da admin
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  try {
    // Buscar admin (Silvana) - usuário com tipo_acesso 'admin'
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?tipo_acesso=eq.admin&select=id,nome_completo,email_login,cargo_id,departamento_id&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar admin')
    }

    const admins = await response.json()

    if (admins && admins.length > 0) {
      return {
        success: true,
        data: {
          id: admins[0].id,
          nome: admins[0].nome_completo,
          email: admins[0].email_login,
          cargo_id: admins[0].cargo_id,
          departamento_id: admins[0].departamento_id
        }
      }
    }

    // Se não encontrou, retornar dados padrão da Silvana
    return {
      success: true,
      data: {
        id: null,
        nome: 'Silvana Qualitec',
        email: 'silvana@qualitec.com.br'
      }
    }
  } catch (error: any) {
    console.error('Erro ao buscar admin:', error)
    
    // Retornar dados padrão em caso de erro
    return {
      success: true,
      data: {
        id: null,
        nome: 'Silvana Qualitec',
        email: 'silvana@qualitec.com.br'
      }
    }
  }
})
