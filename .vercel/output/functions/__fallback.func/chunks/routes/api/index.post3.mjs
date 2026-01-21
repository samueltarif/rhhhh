import { s as setCookie, a as useRuntimeConfig, f as getHeader, c as createError, d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { f as fetchWithRetry, s as serverSupabaseServiceRole } from '../../_/serverSupabaseServiceRole.mjs';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@supabase/functions-js';
import '@supabase/postgrest-js';
import '@supabase/realtime-js';
import '@supabase/storage-js';
import '@supabase/auth-js';

function setCookies(event, cookies) {
  const response = event.node.res;
  const headersWritable = () => !response.headersSent && !response.writableEnded;
  if (!headersWritable()) {
    return;
  }
  for (const { name, value, options } of cookies) {
    if (!headersWritable()) {
      break;
    }
    setCookie(event, name, value, options);
  }
}

const serverSupabaseClient = async (event) => {
  if (!event.context._supabaseClient) {
    const { url, key, cookiePrefix, cookieOptions, clientOptions: { auth = {}, global = {} } } = useRuntimeConfig(event).public.supabase;
    event.context._supabaseClient = createServerClient(url, key, {
      auth,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies) => setCookies(event, cookies)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...global
      }
    });
  }
  return event.context._supabaseClient;
};

const serverSupabaseUser = async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.auth.getClaims();
  if (error) {
    throw createError({ statusMessage: error?.message });
  }
  return data?.claims ?? null;
};

const index_post = defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  const body = await readBody(event);
  try {
    console.log("\u{1F4DD} Criando funcion\xE1rio:", body.nome_completo);
    console.log("\u{1F4E7} Email fornecido:", body.email_login);
    console.log("\u{1F464} Usu\xE1rio logado:", user == null ? void 0 : user.email);
    let responsavelCadastroId = null;
    if (user == null ? void 0 : user.email) {
      const { data: usuarioLogado } = await supabase.from("funcionarios").select("id, nome_completo").eq("email_login", user.email).single();
      if (usuarioLogado) {
        responsavelCadastroId = usuarioLogado.id;
        console.log("\u2705 Respons\xE1vel pelo cadastro:", usuarioLogado.nome_completo, "(ID:", usuarioLogado.id, ")");
      }
    }
    const cleanValue = (value) => {
      if (value === "" || value === void 0) return null;
      return value;
    };
    const processResponsavelId = (value) => {
      if (!value || value === "" || value === void 0) return null;
      if (typeof value === "string" && isNaN(Number(value))) {
        console.log("\u26A0\uFE0F responsavel_id \xE9 string:", value, "- convertendo para null");
        return null;
      }
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        return numericValue;
      }
      return null;
    };
    const emailLogin = cleanValue(body.email_login);
    if (!emailLogin) {
      throw new Error("Email de login \xE9 obrigat\xF3rio");
    }
    const senha = cleanValue(body.senha);
    if (!senha) {
      throw new Error("Senha \xE9 obrigat\xF3ria");
    }
    console.log("\u{1F4E7} Email a ser usado:", emailLogin);
    const dadosParaInserir = {
      nome_completo: body.nome_completo,
      cpf: body.cpf,
      rg: cleanValue(body.rg),
      data_nascimento: cleanValue(body.data_nascimento),
      sexo: cleanValue(body.sexo),
      telefone: cleanValue(body.telefone),
      email_pessoal: cleanValue(body.email_pessoal),
      empresa_id: cleanValue(body.empresa_id),
      departamento_id: cleanValue(body.departamento_id),
      cargo_id: cleanValue(body.cargo_id),
      jornada_trabalho_id: cleanValue(body.jornada_trabalho_id),
      responsavel_id: processResponsavelId(body.responsavel_id),
      responsavel_cadastro_id: responsavelCadastroId,
      // NOVO CAMPO
      tipo_contrato: cleanValue(body.tipo_contrato),
      data_admissao: cleanValue(body.data_admissao),
      matricula: cleanValue(body.matricula),
      email_login: emailLogin,
      senha,
      tipo_acesso: body.tipo_acesso || "funcionario",
      status: body.status || "ativo",
      salario_base: cleanValue(body.salario_base) || 0,
      numero_dependentes: cleanValue(body.numero_dependentes) || 0,
      tipo_salario: body.tipo_salario || "mensal",
      banco: cleanValue(body.banco),
      agencia: cleanValue(body.agencia),
      conta: cleanValue(body.conta),
      tipo_conta: cleanValue(body.tipo_conta),
      forma_pagamento: cleanValue(body.forma_pagamento),
      beneficios: body.beneficios || {},
      descontos_personalizados: body.descontos_personalizados || []
    };
    console.log("\u{1F4E6} Dados a inserir:", JSON.stringify(dadosParaInserir, null, 2));
    const { data: funcionario, error } = await supabase.from("funcionarios").insert(dadosParaInserir).select().single();
    if (error) {
      console.error("\u274C Erro ao criar funcion\xE1rio:", error);
      throw error;
    }
    console.log("\u2705 Funcion\xE1rio criado:", funcionario.id);
    console.log("\u{1F464} Cadastrado por:", responsavelCadastroId ? `ID ${responsavelCadastroId}` : "Sistema");
    return {
      success: true,
      data: funcionario
    };
  } catch (error) {
    console.error("\u274C Erro completo:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao criar funcion\xE1rio"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
