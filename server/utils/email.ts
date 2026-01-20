import nodemailer from 'nodemailer'

// Configurar transporter do Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function enviarEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Sistema RH Qualitec" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html
    })

    console.log('✅ Email enviado:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    throw error
  }
}

// Função para enviar credenciais de acesso
export async function enviarEmailCredenciais(dados: {
  para: string
  nome: string
  login: string
  senha: string
  empresa: string
}) {
  const html = templateBoasVindas({
    nome: dados.nome,
    email: dados.login,
    senha: dados.senha,
    empresa: dados.empresa
  })

  return await enviarEmail({
    to: dados.para,
    subject: `🔐 Suas Credenciais de Acesso - ${dados.empresa}`,
    html
  })
}

// Template de email de boas-vindas
export function templateBoasVindas(dados: {
  nome: string
  email: string
  senha: string
  empresa: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .credentials {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .credential-item {
          margin: 10px 0;
        }
        .credential-label {
          font-weight: bold;
          color: #667eea;
        }
        .credential-value {
          font-size: 18px;
          color: #333;
          font-family: monospace;
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 5px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Bem-vindo(a) à ${dados.empresa}!</h1>
      </div>
      
      <div class="content">
        <p>Olá <strong>${dados.nome}</strong>,</p>
        
        <p>É com grande satisfação que damos as boas-vindas à nossa equipe! Seu cadastro foi realizado com sucesso no Sistema RH.</p>
        
        <div class="credentials">
          <h3>🔐 Seus Dados de Acesso</h3>
          
          <div class="credential-item">
            <div class="credential-label">📧 Email de Login:</div>
            <div class="credential-value">${dados.email}</div>
          </div>
          
          <div class="credential-item">
            <div class="credential-label">🔑 Senha Temporária:</div>
            <div class="credential-value">${dados.senha}</div>
          </div>
        </div>
        
        <div class="warning">
          <strong>⚠️ Importante:</strong> Por segurança, recomendamos que você altere sua senha no primeiro acesso.
        </div>
        
        <p>Com o Sistema RH você poderá:</p>
        <ul>
          <li>✅ Visualizar seus holerites</li>
          <li>✅ Acompanhar seus benefícios</li>
          <li>✅ Atualizar seus dados pessoais</li>
          <li>✅ Consultar sua jornada de trabalho</li>
        </ul>
        
        <center>
          <a href="https://rhqualitec.vercel.app/login" class="button">
            Acessar Sistema RH
          </a>
        </center>
        
        <p>Se tiver alguma dúvida, entre em contato com o departamento de Recursos Humanos.</p>
        
        <p>Seja bem-vindo(a) e sucesso em sua jornada conosco!</p>
        
        <div class="footer">
          <p><strong>Qualitec Instrumentos de Medição</strong></p>
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
