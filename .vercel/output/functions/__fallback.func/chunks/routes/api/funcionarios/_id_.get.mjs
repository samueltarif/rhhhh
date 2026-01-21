import { d as defineEventHandler, e as getRouterParam, c as createError } from '../../../_/nitro.mjs';
import { s as serverSupabaseServiceRole } from '../../../_/serverSupabaseServiceRole.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID do funcion\xE1rio n\xE3o fornecido"
      });
    }
    const { data: funcionario, error } = await supabase.from("funcionarios").select("*").eq("id", id).single();
    if (error) {
      console.error("Erro ao buscar funcion\xE1rio:", error);
      throw error;
    }
    if (!funcionario) {
      throw createError({
        statusCode: 404,
        message: "Funcion\xE1rio n\xE3o encontrado"
      });
    }
    return funcionario;
  } catch (error) {
    console.error("Erro ao buscar funcion\xE1rio:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao buscar funcion\xE1rio"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
