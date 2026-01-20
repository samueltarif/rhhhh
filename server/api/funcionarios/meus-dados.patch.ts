// API para atualizar dados do funcionário logado
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey

  // Pegar ID do usuário do body (enviado pelo frontend)
  const userId = body.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Usuário não autenticado'
    })
  }

  console.log('📝 Atualizando dados do funcionário:', userId)
  console.log('📦 Dados recebidos:', JSON.stringify(body, null, 2))

  try {
    // Primeiro, verificar se o usuário é admin
    const userResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}&select=tipo_acesso`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!userResponse.ok) {
      throw new Error('Erro ao verificar permissões do usuário')
    }

    const userData = await userResponse.json()
    const isAdmin = userData[0]?.tipo_acesso === 'admin'

    console.log('👤 Tipo de usuário:', isAdmin ? 'Admin' : 'Funcionário')

    // Campos que o funcionário pode atualizar
    const camposPermitidos: any = {
      telefone: body.telefone,
      email_pessoal: body.email_pessoal,
      pis_pasep: body.pis_pasep,
      banco: body.banco,
      agencia: body.agencia,
      conta: body.conta,
      tipo_conta: body.tipo_conta,
      forma_pagamento: body.forma_pagamento,
      chave_pix: body.chave_pix,
      avatar: body.avatar, // Todos podem alterar avatar
      
      // Campos que podem ser editados apenas uma vez (verificação no frontend)
      data_nascimento: body.data_nascimento,
      sexo: body.sexo,
      rg: body.rg
    }

    // Se for admin, pode atualizar dados profissionais e pensão alimentícia também
    if (isAdmin) {
      if (body.nome_completo !== undefined) camposPermitidos.nome_completo = body.nome_completo
      if (body.cpf !== undefined) camposPermitidos.cpf = body.cpf
      if (body.cargo_id !== undefined) camposPermitidos.cargo_id = body.cargo_id
      if (body.departamento_id !== undefined) camposPermitidos.departamento_id = body.departamento_id
      if (body.data_admissao !== undefined) camposPermitidos.data_admissao = body.data_admissao
      if (body.tipo_contrato !== undefined) camposPermitidos.tipo_contrato = body.tipo_contrato
      if (body.empresa_id !== undefined) camposPermitidos.empresa_id = body.empresa_id
      if (body.pensao_alimenticia !== undefined) camposPermitidos.pensao_alimenticia = body.pensao_alimenticia
    } else {
      // Se não for admin e tentar atualizar pensão alimentícia, ignorar silenciosamente
      if (body.pensao_alimenticia !== undefined) {
        console.log('⚠️ Funcionário tentou atualizar pensão alimentícia - IGNORADO')
      }
    }

    // Remover campos undefined
    const chavesPermitidas = Object.keys(camposPermitidos)
    chavesPermitidas.forEach(key => {
      if (camposPermitidos[key] === undefined) {
        delete camposPermitidos[key]
      }
    })

    console.log('✅ Campos a atualizar:', JSON.stringify(camposPermitidos, null, 2))

    // Atualizar no banco
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(camposPermitidos)
      }
    )

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro ao atualizar:', errorText)
      throw new Error(`Erro ao atualizar dados: ${errorText}`)
    }

    const funcionarioAtualizado = await response.json()
    console.log('✅ Dados atualizados com sucesso!')

    return {
      success: true,
      message: 'Dados atualizados com sucesso!',
      data: funcionarioAtualizado[0]
    }
  } catch (error: any) {
    console.error('💥 Erro ao atualizar dados:', error.message)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao atualizar dados'
    })
  }
})
