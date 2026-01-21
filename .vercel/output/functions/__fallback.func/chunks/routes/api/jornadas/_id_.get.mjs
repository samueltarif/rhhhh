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
        message: "ID da jornada n\xE3o fornecido"
      });
    }
    const { data: jornada, error } = await supabase.from("jornadas_trabalho").select("*").eq("id", id).single();
    if (error) {
      console.error("Erro ao buscar jornada:", error);
      throw error;
    }
    if (!jornada) {
      throw createError({
        statusCode: 404,
        message: "Jornada n\xE3o encontrada"
      });
    }
    return jornada;
  } catch (error) {
    console.error("Erro ao buscar jornada:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao buscar jornada"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
