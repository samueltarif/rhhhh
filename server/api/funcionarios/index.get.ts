import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Usar Service Role para bypass RLS
  const supabase = serverSupabaseServiceRole(event)

  try {
    const { data: funcionarios, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        departamentos:departamento_id(nome),
        cargos:cargo_id(nome),
        jornadas:jornada_trabalho_id(nome),
        responsavel_direto:responsavel_id(nome_completo),
        responsavel_cadastro:responsavel_cadastro_id(nome_completo, email_login)
      `)
      .order('nome_completo')

    if (error) {
      console.error('❌ Erro ao buscar funcionários:', error)
      throw error
    }

    // Formatar dados para o frontend
    const funcionariosFormatados = funcionarios?.map(f => ({
      ...f,
      departamento: f.departamentos?.nome || 'Não definido',
      cargo: f.cargos?.nome || 'Não definido',
      jornada: f.jornadas?.nome || 'Não definida',
      responsavel_direto_nome: f.responsavel_direto?.nome_completo || 'Não definido',
      responsavel_cadastro_nome: f.responsavel_cadastro?.nome_completo || 'Sistema',
      responsavel_cadastro_email: f.responsavel_cadastro?.email_login || ''
    })) || []

    return funcionariosFormatados
  } catch (error: any) {
    console.error('❌ Erro:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao buscar funcionários'
    })
  }
})
