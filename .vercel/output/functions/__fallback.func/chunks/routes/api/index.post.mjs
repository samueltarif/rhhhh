import { d as defineEventHandler, r as readBody, a as useRuntimeConfig, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  console.log("\u{1F4BC} Salvando cargo:", body);
  try {
    let response;
    let url;
    if (body.id) {
      url = `${supabaseUrl}/rest/v1/cargos?id=eq.${body.id}`;
      console.log("\u{1F504} ATUALIZANDO cargo ID:", body.id);
      const { id, ...dadosSemId } = body;
      response = await fetch(url, {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(dadosSemId)
      });
    } else {
      url = `${supabaseUrl}/rest/v1/cargos`;
      console.log("\u2795 CRIANDO novo cargo");
      response = await fetch(url, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(body)
      });
    }
    console.log("\u{1F4CA} Status da resposta:", response.status);
    const responseText = await response.text();
    console.log("\u{1F4E6} Resposta do Supabase:", responseText);
    if (!response.ok) {
      console.error("\u274C Erro HTTP:", response.status, responseText);
      throw new Error(`Erro ao salvar cargo: ${response.status} - ${responseText}`);
    }
    const cargo = responseText ? JSON.parse(responseText) : null;
    console.log("\u2705 Cargo salvo com sucesso!");
    return {
      success: true,
      message: body.id ? "Cargo atualizado com sucesso!" : "Cargo criado com sucesso!",
      data: Array.isArray(cargo) ? cargo[0] : cargo
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro ao salvar cargo:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao salvar cargo"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
