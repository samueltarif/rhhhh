import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  try {
    const { data, error } = await supabase
      .from('holerite_itens_personalizados')
      .insert([{
        funcionario_id: body.funcionario_id,
        tipo: body.tipo,
        descricao: body.descricao,
        valor: body.valor,
        vigencia_tipo: body.vigencia_tipo,
        data_inicio: body.data_inicio,
        data_fim: body.data_fim || null,
        observacoes: body.observacoes || null,
        ativo: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar item personalizado:', error)
      
      // Se a tabela não existe, retornar mensagem clara
      if (error.code === 'PGRST205' || error.code === '42P01') {
        throw createError({
          statusCode: 500,
          message: 'Tabela holerite_itens_personalizados não existe. Execute o SQL: EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor.'
        })
      }
      
      throw error
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Erro ao criar item personalizado:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao criar item personalizado'
    })
  }
})
