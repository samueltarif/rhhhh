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
      id: funcionario.id,
      nome_completo: funcionario.nome_completo,
      cpf: funcionario.cpf,
      cargo_nome: (cargo as any)?.nome || 'Não informado', // CORRIGIDO: usar cargo_nome
      departamento_nome: (departamento as any)?.nome || 'Não informado', // CORRIGIDO: usar departamento_nome
      data_admissao: funcionario.data_admissao,
      numero_dependentes: funcionario.numero_dependentes || 0,
      pensao_alimenticia: funcionario.pensao_alimenticia || 0,
      tipo_contrato: funcionario.tipo_contrato || 'CLT' // IMPORTANTE: Incluir tipo de contrato
    }

    const empresaData = {
      nome: (empresa as any).nome || (empresa as any).nome_fantasia || 'Empresa',
      nome_fantasia: (empresa as any).nome_fantasia || (empresa as any).nome || 'Empresa',
      cnpj: (empresa as any).cnpj || '',
      logradouro: (empresa as any).logradouro || '',
      numero: (empresa as any).numero || '',
      complemento: (empresa as any).complemento || '',
      bairro: (empresa as any).bairro || '',
      cidade: (empresa as any).cidade || '',
      estado: (empresa as any).estado || '',
      cep: (empresa as any).cep || '',
      responsavel_nome: (empresa as any).responsavel_nome || 'SILVANA APARECIDA BARDUCHI',
      responsavel_cpf: (empresa as any).responsavel_cpf || '04487488869'
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
