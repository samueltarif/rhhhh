import { d as defineEventHandler, a as useRuntimeConfig, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const index_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/cargos?select=*&order=nome.asc`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar cargos");
    }
    const cargos = await response.json();
    return { success: true, data: cargos };
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar cargos"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
