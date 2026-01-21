import { d as defineEventHandler, a as useRuntimeConfig, h as getQuery, k as getHeaders, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const meusHolerites_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  const query = getQuery(event);
  const funcionarioId = query.funcionarioId;
  console.log("\u{1F50D} [MEUS-HOLERITES] Requisi\xE7\xE3o recebida");
  console.log("\u{1F50D} [MEUS-HOLERITES] Query params:", query);
  console.log("\u{1F50D} [MEUS-HOLERITES] Funcion\xE1rio ID:", funcionarioId);
  console.log("\u{1F50D} [MEUS-HOLERITES] Headers da requisi\xE7\xE3o:", getHeaders(event));
  if (!funcionarioId) {
    console.error("\u274C [MEUS-HOLERITES] Funcion\xE1rio n\xE3o identificado");
    throw createError({
      statusCode: 401,
      message: "Funcion\xE1rio n\xE3o identificado"
    });
  }
  console.log("\u{1F50D} [MEUS-HOLERITES] Buscando holerites para funcion\xE1rio ID:", funcionarioId);
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/holerites?funcionario_id=eq.${funcionarioId}&status=neq.gerado&select=*&order=periodo_inicio.desc`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("\u{1F4CA} [MEUS-HOLERITES] Status da resposta Supabase:", response.status);
    console.log("\u{1F4CA} [MEUS-HOLERITES] Headers da resposta Supabase:", Object.fromEntries(response.headers.entries()));
    if (!response.ok) {
      const errorText = await response.text();
      console.error("\u274C [MEUS-HOLERITES] Erro ao buscar holerites:", errorText);
      throw new Error("Erro ao buscar holerites");
    }
    const holerites = await response.json();
    console.log("\u{1F4E6} [MEUS-HOLERITES] Holerites encontrados:", holerites.length);
    console.log("\u{1F4E6} [MEUS-HOLERITES] Dados dos holerites:", JSON.stringify(holerites, null, 2));
    console.log('   (Holerites com status "gerado" n\xE3o s\xE3o exibidos)');
    return holerites || [];
  } catch (error) {
    console.error("\u{1F4A5} [MEUS-HOLERITES] Erro ao buscar holerites:", error);
    console.error("\u{1F4A5} [MEUS-HOLERITES] Stack trace:", error.stack);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao buscar holerites"
    });
  }
});

export { meusHolerites_get as default };
//# sourceMappingURL=meus-holerites.get.mjs.map
