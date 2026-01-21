import { d as defineEventHandler, a as useRuntimeConfig } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const testSupabase_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseKey;
  const serviceRoleKey = config.supabaseServiceRoleKey;
  const results = {
    config: {
      supabaseUrl: supabaseUrl ? "\u2705 Configurado" : "\u274C N\xE3o configurado",
      supabaseUrlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + "..." : "undefined",
      supabaseKey: supabaseKey ? "\u2705 Configurado" : "\u274C N\xE3o configurado",
      supabaseKeyValue: supabaseKey ? supabaseKey.substring(0, 30) + "..." : "undefined",
      serviceRoleKey: serviceRoleKey ? "\u2705 Configurado" : "\u274C N\xE3o configurado",
      serviceRoleKeyValue: serviceRoleKey ? serviceRoleKey.substring(0, 30) + "..." : "undefined",
      // Mostrar variáveis de ambiente diretas
      envCheck: {
        NUXT_PUBLIC_SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL ? "Existe" : "N\xE3o existe",
        NUXT_PUBLIC_SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY ? "Existe" : "N\xE3o existe",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Existe" : "N\xE3o existe"
      }
    },
    tests: []
  };
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/`,
      {
        headers: {
          "apikey": serviceRoleKey || supabaseKey,
          "Authorization": `Bearer ${serviceRoleKey || supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    results.tests.push({
      test: "Conex\xE3o com Supabase",
      status: response.ok ? "\u2705 OK" : "\u274C Falhou",
      statusCode: response.status
    });
  } catch (error) {
    results.tests.push({
      test: "Conex\xE3o com Supabase",
      status: "\u274C Erro",
      error: error.message
    });
  }
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?select=count`,
      {
        headers: {
          "apikey": serviceRoleKey || supabaseKey,
          "Authorization": `Bearer ${serviceRoleKey || supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "count=exact"
        }
      }
    );
    const data = await response.json();
    results.tests.push({
      test: "Tabela funcionarios",
      status: response.ok ? "\u2705 Existe" : "\u274C N\xE3o existe",
      statusCode: response.status,
      data
    });
  } catch (error) {
    results.tests.push({
      test: "Tabela funcionarios",
      status: "\u274C Erro",
      error: error.message
    });
  }
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?email_login=eq.silvana@qualitec.ind.br&select=id,nome_completo,email_login,tipo_acesso,status`,
      {
        headers: {
          "apikey": serviceRoleKey || supabaseKey,
          "Authorization": `Bearer ${serviceRoleKey || supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    const funcionarios = await response.json();
    results.tests.push({
      test: "Buscar Silvana",
      status: funcionarios.length > 0 ? "\u2705 Encontrada" : "\u26A0\uFE0F N\xE3o encontrada",
      statusCode: response.status,
      count: funcionarios.length,
      data: funcionarios
    });
  } catch (error) {
    results.tests.push({
      test: "Buscar Silvana",
      status: "\u274C Erro",
      error: error.message
    });
  }
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?email_login=eq.silvana@qualitec.ind.br&senha=eq.Qualitec2025Silvana&select=id,nome_completo,email_login,tipo_acesso,status`,
      {
        headers: {
          "apikey": serviceRoleKey || supabaseKey,
          "Authorization": `Bearer ${serviceRoleKey || supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    const funcionarios = await response.json();
    results.tests.push({
      test: "Buscar Silvana com senha",
      status: funcionarios.length > 0 ? "\u2705 Credenciais corretas" : "\u26A0\uFE0F Senha incorreta",
      statusCode: response.status,
      count: funcionarios.length,
      data: funcionarios
    });
  } catch (error) {
    results.tests.push({
      test: "Buscar Silvana com senha",
      status: "\u274C Erro",
      error: error.message
    });
  }
  const tabelas = [
    "empresas",
    "departamentos",
    "cargos",
    "jornadas_trabalho",
    "funcionarios",
    "holerites",
    "funcionario_beneficios",
    "feriados"
  ];
  for (const tabela of tabelas) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/${tabela}?select=count&limit=1`,
        {
          headers: {
            "apikey": serviceRoleKey || supabaseKey,
            "Authorization": `Bearer ${serviceRoleKey || supabaseKey}`,
            "Content-Type": "application/json",
            "Prefer": "count=exact"
          }
        }
      );
      results.tests.push({
        test: `Tabela ${tabela}`,
        status: response.ok ? "\u2705 Existe" : "\u274C N\xE3o existe",
        statusCode: response.status
      });
    } catch (error) {
      results.tests.push({
        test: `Tabela ${tabela}`,
        status: "\u274C Erro",
        error: error.message
      });
    }
  }
  return results;
});

export { testSupabase_get as default };
//# sourceMappingURL=test-supabase.get.mjs.map
