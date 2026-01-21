import { d as defineEventHandler, e as getRouterParam, c as createError } from '../../../../_/nitro.mjs';
import { s as serverSupabaseServiceRole } from '../../../../_/serverSupabaseServiceRole.mjs';
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
  const supabase = serverSupabaseServiceRole(event);
  try {
    const { error } = await supabase.from("holerite_itens_personalizados").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar item personalizado:", error);
    throw createError({
      statusCode: 500,
      message: error.message
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
