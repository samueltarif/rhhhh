import { d as defineEventHandler, r as readBody, c as createError, a as useRuntimeConfig } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const login_post = defineEventHandler(async (event) => {
  const { email, senha } = await readBody(event);
  if (!email || !senha) {
    throw createError({
      statusCode: 400,
      message: "Email e senha s\xE3o obrigat\xF3rios"
    });
  }
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  console.log("\u{1F527} Config check:");
  console.log("  - supabaseUrl:", supabaseUrl ? supabaseUrl.substring(0, 30) + "..." : "UNDEFINED");
  console.log("  - serviceRoleKey LENGTH:", serviceRoleKey ? serviceRoleKey.length : 0);
  console.log("  - serviceRoleKey FULL:", serviceRoleKey);
  console.log("  - supabaseKey LENGTH:", config.public.supabaseKey ? config.public.supabaseKey.length : 0);
  try {
    console.log("\u{1F510} Tentando login:", { email, senha: "***" });
    console.log("\u{1F310} Supabase URL:", supabaseUrl);
    const url = `${supabaseUrl}/rest/v1/funcionarios?email_login=eq.${encodeURIComponent(email)}&senha=eq.${encodeURIComponent(senha)}&status=eq.ativo&select=id,nome_completo,email_login,tipo_acesso,status,cargo_id,departamento_id`;
    console.log("\u{1F4E1} URL da requisi\xE7\xE3o:", url);
    const response = await fetch(url, {
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      }
    });
    console.log("\u{1F4CA} Status da resposta:", response.status);
    const funcionarios = await response.json();
    console.log("\u{1F465} Funcion\xE1rios encontrados:", funcionarios.length);
    if (!response.ok) {
      console.error("\u274C Erro na resposta do Supabase:", funcionarios);
      throw createError({
        statusCode: 401,
        message: "Email ou senha incorretos"
      });
    }
    if (!funcionarios || funcionarios.length === 0) {
      console.log("\u26A0\uFE0F Nenhum funcion\xE1rio encontrado com essas credenciais");
      throw createError({
        statusCode: 401,
        message: "Email ou senha incorretos"
      });
    }
    const funcionario = funcionarios[0];
    console.log("\u2705 Login bem-sucedido:", funcionario.nome_completo);
    return {
      success: true,
      user: {
        id: funcionario.id,
        nome: funcionario.nome_completo,
        email: funcionario.email_login,
        tipo: funcionario.tipo_acesso,
        cargo: funcionario.cargo_id,
        departamento: funcionario.departamento_id
      }
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro no login:", error);
    throw createError({
      statusCode: 401,
      message: "Email ou senha incorretos"
    });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
