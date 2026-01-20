import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = serverSupabaseServiceRole(event)

  try {
    const { error } = await supabase
      .from('holerite_itens_personalizados')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao deletar item personalizado:', error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
