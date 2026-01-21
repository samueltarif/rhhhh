import { enviarEmail } from '../../../utils/email'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID do holerite não fornecido'
      })
    }

    console.log('📧 Buscando holerite ID:', id)

    // Buscar holerite
    const holeriteResponse = await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!holeriteResponse.ok) {
      const errorText = await holeriteResponse.text()
      console.error('❌ Erro ao buscar holerite:', errorText)
      throw new Error('Erro ao buscar holerite')
    }

    const holerites = await holeriteResponse.json()
    
    if (!holerites || holerites.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Holerite não encontrado'
      })
    }

    const holerite = holerites[0]
    console.log('✅ Holerite encontrado:', holerite.id)

    // Buscar funcionário
    const funcionarioResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${holerite.funcionario_id}&select=*`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!funcionarioResponse.ok) {
      throw new Error('Erro ao buscar funcionário')
    }

    const funcionarios = await funcionarioResponse.json()
    
    if (!funcionarios || funcionarios.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Funcionário não encontrado'
      })
    }

    const funcionario = funcionarios[0]
    console.log('✅ Funcionário encontrado:', funcionario.nome_completo)
    
    // Usar email_login se email não estiver disponível
    const emailDestino = funcionario.email || funcionario.email_login
    
    if (!emailDestino) {
      throw createError({
        statusCode: 400,
        message: 'Funcionário não possui email cadastrado'
      })
    }

    // Formatar período
    const periodoInicio = new Date(holerite.periodo_inicio)
    const periodoFim = new Date(holerite.periodo_fim)
    const mesAno = periodoInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    
    // Determinar se é quinzenal
    let tipoHolerite = 'mensal'
    if (periodoInicio.getDate() === 1 && periodoFim.getDate() <= 15) {
      tipoHolerite = '1ª quinzena'
    } else if (periodoInicio.getDate() === 16) {
      tipoHolerite = '2ª quinzena'
    }

    console.log('📨 Enviando email para:', emailDestino)

    // Enviar email
    const emailEnviado = await enviarEmail({
      to: emailDestino,
      subject: `Holerite disponível - ${mesAno}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">📄 Holerite Disponível</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Olá, <strong>${funcionario.nome_completo}</strong>!</p>
            
            <p>Seu holerite referente a <strong>${mesAno} (${tipoHolerite})</strong> está disponível para visualização no Sistema RH.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #1f2937;">📊 Resumo do Holerite</h3>
              <p><strong>Período:</strong> ${periodoInicio.toLocaleDateString('pt-BR')} a ${periodoFim.toLocaleDateString('pt-BR')}</p>
              <p><strong>Salário Base:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holerite.salario_base || 0)}</p>
              <p><strong>Salário Líquido:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holerite.salario_liquido || 0)}</p>
            </div>
            
            <p>Acesse o sistema para visualizar os detalhes completos e fazer o download do PDF:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://rhqualitec.vercel.app/login" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🔐 Acessar Sistema RH
              </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <strong>💡 Dica:</strong> Você pode visualizar e baixar todos os seus holerites na seção "Meus Holerites" do sistema.
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
              <p><strong>Qualitec Instrumentos de Medição</strong></p>
              <p>Este é um email automático. Por favor, não responda.</p>
            </div>
          </div>
        </div>
      `
    })

    if (!emailEnviado || !emailEnviado.success) {
      throw createError({
        statusCode: 500,
        message: 'Erro ao enviar email'
      })
    }

    console.log('✅ Email enviado com sucesso!')

    // Atualizar status do holerite para "enviado"
    await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ status: 'enviado' })
      }
    )

    return {
      success: true,
      message: 'Email enviado com sucesso',
      email: emailDestino
    }

  } catch (error: any) {
    console.error('💥 Erro ao enviar email do holerite:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao enviar email'
    })
  }
})
