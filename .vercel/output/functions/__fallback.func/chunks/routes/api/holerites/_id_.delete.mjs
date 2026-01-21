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

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID do holerite n\xE3o fornecido"
    });
  }
  const supabase = await serverSupabaseServiceRole(event);
  const { error } = await supabase.from("holerites").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir holerite:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao excluir holerite"
    });
  }
  return {
    success: true,
    message: "Holerite exclu\xEDdo com sucesso"
  };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
