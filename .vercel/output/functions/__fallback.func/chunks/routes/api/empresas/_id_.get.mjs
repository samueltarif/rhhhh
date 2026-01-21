import { d as defineEventHandler, e as getRouterParam, a as useRuntimeConfig, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseKey;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?id=eq.${id}&select=*`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar empresa");
    }
    const empresas = await response.json();
    if (!empresas || empresas.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Empresa n\xE3o encontrada"
      });
    }
    return { success: true, data: empresas[0] };
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao buscar empresa"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
