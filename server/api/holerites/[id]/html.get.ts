import { serverSupabaseServiceRole } from '#supabase/server'
import { gerarHoleriteHTML } from '../../../utils/holeriteHTML'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const supabase = serverSupabaseServiceRole(event)

  try {
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do holerite é obrigatório'
      })
    }

    // Buscar holerite
    const { data: holerite, error: holeriteError }: any = await supabase
      .from('holerites')
      .select('*')
      .eq('id', id)
      .single()

    if (holeriteError || !holerite) {
      throw createError({
        statusCode: 404,
        message: 'Holerite não encontrado'
      })
    }

    // Buscar funcionário
    const { data: funcionario, error: funcError }: any = await supabase
      .from('funcionarios')
      .select('*')
      .eq('id', holerite.funcionario_id)
      .single()

    if (funcError || !funcionario) {
      throw createError({
        statusCode: 404,
        message: 'Funcionário não encontrado'
      })
    }

    // Buscar cargo (se existir)
    let cargo = null
    if (funcionario.cargo_id) {
      const { data: cargoData } = await supabase
        .from('cargos')
        .select('nome')
        .eq('id', funcionario.cargo_id)
        .single()
      cargo = cargoData
    }

    // Buscar departamento (se existir)
    let departamento = null
    if (funcionario.departamento_id) {
      const { data: deptData } = await supabase
        .from('departamentos')
        .select('nome')
        .eq('id', funcionario.departamento_id)
        .single()
      departamento = deptData
    }

    // Buscar empresa
    const { data: empresa, error: empresaError }: any = await supabase
      .from('empresas')
      .select('*')
      .eq('id', funcionario.empresa_id)
      .single()

    if (empresaError || !empresa) {
      throw createError({
        statusCode: 404,
        message: 'Empresa não encontrada'
      })
    }

    // Gerar HTML
    const funcionarioData = {
      nome_completo: funcionario.nome_completo,
      cpf: funcionario.cpf,
      cargo: cargo?.nome || 'Não informado',
      departamento: departamento?.nome || 'Não informado',
      data_admissao: funcionario.data_admissao,
      numero_dependentes: funcionario.numero_dependentes || 0,
      pensao_alimenticia: funcionario.pensao_alimenticia || 0
    }

    const empresaData = {
      nome: empresa.nome || empresa.nome_fantasia || 'Empresa',
      cnpj: empresa.cnpj || '',
      logradouro: empresa.logradouro || '',
      numero: empresa.numero || '',
      complemento: empresa.complemento || '',
      bairro: empresa.bairro || '',
      cidade: empresa.cidade || '',
      estado: empresa.estado || '',
      cep: empresa.cep || ''
    }

    const html = gerarHoleriteHTML(holerite, funcionarioData, empresaData)

    // Retornar HTML como arquivo para download
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="holerite-${funcionario.nome_completo.replace(/\s+/g, '-')}.html"`)
    
    return html
  } catch (error: any) {
    console.error('Erro ao gerar HTML:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Erro ao gerar HTML do holerite'
    })
  }
})
