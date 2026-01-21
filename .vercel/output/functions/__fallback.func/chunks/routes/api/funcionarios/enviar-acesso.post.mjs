import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { e as enviarEmailCredenciais } from '../../../_/email.mjs';
import { s as serverSupabaseServiceRole } from '../../../_/serverSupabaseServiceRole.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'nodemailer';
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/auth-js';

const enviarAcesso_post = defineEventHandler(async (event) => {
  var _a;
  const supabase = serverSupabaseServiceRole(event);
  const body = await readBody(event);
  try {
    const { funcionario_id } = body;
    if (!funcionario_id) {
      throw new Error("ID do funcion\xE1rio \xE9 obrigat\xF3rio");
    }
    console.log("\u{1F50D} Buscando funcion\xE1rio ID:", funcionario_id);
    const { data: funcionario, error } = await supabase.from("funcionarios").select(`
        id,
        nome_completo,
        email_login,
        email_pessoal,
        senha,
        empresa_id,
        empresas:empresa_id(nome)
      `).eq("id", funcionario_id).single();
    if (error || !funcionario) {
      console.error("\u274C Erro ao buscar funcion\xE1rio:", error);
      throw new Error(`Funcion\xE1rio n\xE3o encontrado. ID: ${funcionario_id}`);
    }
    console.log("\u2705 Funcion\xE1rio encontrado:", funcionario.nome_completo);
    if (!funcionario.email_login && !funcionario.email_pessoal || !funcionario.senha) {
      throw new Error("Funcion\xE1rio n\xE3o possui email ou senha cadastrados");
    }
    const emails = [];
    if (funcionario.email_login) emails.push(funcionario.email_login);
    if (funcionario.email_pessoal && funcionario.email_pessoal !== funcionario.email_login) {
      emails.push(funcionario.email_pessoal);
    }
    const emailsEnviados = [];
    const emailsFalhos = [];
    for (const email of emails) {
      try {
        await enviarEmailCredenciais({
          para: email,
          nome: funcionario.nome_completo,
          login: funcionario.email_login,
          senha: funcionario.senha,
          empresa: ((_a = funcionario.empresas) == null ? void 0 : _a.nome) || "Sistema"
        });
        emailsEnviados.push(email);
        console.log("\u2705 Email enviado para:", email);
      } catch (err) {
        console.error("\u274C Erro ao enviar para:", email, err);
        emailsFalhos.push(email);
      }
    }
    if (emailsEnviados.length === 0) {
      throw new Error("N\xE3o foi poss\xEDvel enviar o email para nenhum endere\xE7o");
    }
    return {
      success: true,
      message: `Credenciais enviadas para: ${emailsEnviados.join(", ")}`,
      emails_enviados: emailsEnviados,
      emails_falhos: emailsFalhos.length > 0 ? emailsFalhos : void 0
    };
  } catch (error) {
    console.error("\u274C Erro ao enviar email:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao enviar email"
    });
  }
});

export { enviarAcesso_post as default };
//# sourceMappingURL=enviar-acesso.post.mjs.map
