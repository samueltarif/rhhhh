import { d as defineEventHandler, e as getRouterParam, a as useRuntimeConfig, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  console.log("\u{1F5D1}\uFE0F Deletando empresa ID:", id);
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?id=eq.${id}`,
      {
        method: "DELETE",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("\u{1F4CA} Status da resposta:", response.status);
    if (!response.ok) {
      const error = await response.text();
      console.error("\u274C Erro ao deletar:", error);
      throw createError({
        statusCode: response.status,
        message: "Erro ao deletar empresa"
      });
    }
    console.log("\u2705 Empresa deletada com sucesso!");
    return {
      success: true,
      message: "Empresa deletada com sucesso!"
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro ao deletar empresa:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao deletar empresa"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
