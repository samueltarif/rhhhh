import { d as defineEventHandler, a as useRuntimeConfig, h as getQuery, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const meusDados_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  const query = getQuery(event);
  const userId = query.userId;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Usu\xE1rio n\xE3o autenticado"
    });
  }
  console.log("\u{1F50D} Buscando dados do funcion\xE1rio ID:", userId);
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}&select=*,empresas(id,nome_fantasia,nome,cnpj)`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("\u274C Erro ao buscar funcion\xE1rio:", errorText);
      throw new Error("Erro ao buscar dados do funcion\xE1rio");
    }
    const funcionarios = await response.json();
    console.log("\u{1F4E6} Funcion\xE1rios encontrados:", funcionarios.length);
    if (funcionarios && funcionarios.length > 0) {
      console.log("\u2705 Dados do funcion\xE1rio:", funcionarios[0].nome_completo);
      return {
        success: true,
        data: funcionarios[0]
      };
    }
    console.error("\u274C Funcion\xE1rio n\xE3o encontrado com ID:", userId);
    throw new Error("Funcion\xE1rio n\xE3o encontrado");
  } catch (error) {
    console.error("\u{1F4A5} Erro ao buscar dados:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao buscar dados do funcion\xE1rio"
    });
  }
});

export { meusDados_get as default };
//# sourceMappingURL=meus-dados.get.mjs.map
