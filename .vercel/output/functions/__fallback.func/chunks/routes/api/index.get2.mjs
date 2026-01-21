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
  const supabaseKey = config.public.supabaseKey;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/departamentos?select=*&order=nome.asc`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar departamentos");
    }
    const departamentos = await response.json();
    return {
      success: true,
      data: departamentos
    };
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar departamentos"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
