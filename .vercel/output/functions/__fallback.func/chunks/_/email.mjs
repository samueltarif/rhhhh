import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
async function enviarEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Sistema RH Qualitec" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html
    });
    console.log("\u2705 Email enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("\u274C Erro ao enviar email:", error);
    throw error;
  }
}
async function enviarEmailCredenciais(dados) {
  const html = templateBoasVindas({
    nome: dados.nome,
    email: dados.login,
    senha: dados.senha,
    empresa: dados.empresa
  });
  return await enviarEmail({
    to: dados.para,
    subject: `\u{1F510} Suas Credenciais de Acesso - ${dados.empresa}`,
    html
  });
}
function templateBoasVindas(dados) {
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
        <h1>\u{1F389} Bem-vindo(a) \xE0 ${dados.empresa}!</h1>
      </div>
      
      <div class="content">
        <p>Ol\xE1 <strong>${dados.nome}</strong>,</p>
        
        <p>\xC9 com grande satisfa\xE7\xE3o que damos as boas-vindas \xE0 nossa equipe! Seu cadastro foi realizado com sucesso no Sistema RH.</p>
        
        <div class="credentials">
          <h3>\u{1F510} Seus Dados de Acesso</h3>
          
          <div class="credential-item">
            <div class="credential-label">\u{1F4E7} Email de Login:</div>
            <div class="credential-value">${dados.email}</div>
          </div>
          
          <div class="credential-item">
            <div class="credential-label">\u{1F511} Senha Tempor\xE1ria:</div>
            <div class="credential-value">${dados.senha}</div>
          </div>
        </div>
        
        <div class="warning">
          <strong>\u26A0\uFE0F Importante:</strong> Por seguran\xE7a, recomendamos que voc\xEA altere sua senha no primeiro acesso.
        </div>
        
        <p>Com o Sistema RH voc\xEA poder\xE1:</p>
        <ul>
          <li>\u2705 Visualizar seus holerites</li>
          <li>\u2705 Acompanhar seus benef\xEDcios</li>
          <li>\u2705 Atualizar seus dados pessoais</li>
          <li>\u2705 Consultar sua jornada de trabalho</li>
        </ul>
        
        <center>
          <a href="https://rhqualitec.vercel.app/login" class="button">
            Acessar Sistema RH
          </a>
        </center>
        
        <p>Se tiver alguma d\xFAvida, entre em contato com o departamento de Recursos Humanos.</p>
        
        <p>Seja bem-vindo(a) e sucesso em sua jornada conosco!</p>
        
        <div class="footer">
          <p><strong>Qualitec Instrumentos de Medi\xE7\xE3o</strong></p>
          <p>Este \xE9 um email autom\xE1tico, por favor n\xE3o responda.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export { enviarEmail as a, enviarEmailCredenciais as e };
//# sourceMappingURL=email.mjs.map
