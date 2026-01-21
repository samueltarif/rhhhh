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

const _funcionarioId__get = defineEventHandler(async (event) => {
  const funcionarioId = getRouterParam(event, "funcionarioId");
  const supabase = serverSupabaseServiceRole(event);
  try {
    const { data, error } = await supabase.from("holerite_itens_personalizados").select("*").eq("funcionario_id", funcionarioId).order("created_at", { ascending: false });
    if (error) {
      console.error("Erro ao buscar itens personalizados:", error);
      if (error.code === "PGRST205" || error.code === "42P01") {
        return {
          success: true,
          data: [],
          warning: "Tabela holerite_itens_personalizados n\xE3o existe. Execute o SQL de cria\xE7\xE3o."
        };
      }
      throw error;
    }
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Erro ao buscar itens personalizados:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao buscar itens personalizados"
    });
  }
});

export { _funcionarioId__get as default };
//# sourceMappingURL=_funcionarioId_.get.mjs.map
