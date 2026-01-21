import { d as defineEventHandler, c as createError } from '../../_/nitro.mjs';
import { s as serverSupabaseServiceRole } from '../../_/serverSupabaseServiceRole.mjs';
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

const index_get = defineEventHandler(async (event) => {
  try {
    console.log("[FUNCIONARIOS] Iniciando busca de funcion\xE1rios...");
    const supabase = serverSupabaseServiceRole(event);
    console.log("[FUNCIONARIOS] Cliente Supabase criado");
    const { data: funcionarios, error } = await supabase.from("funcionarios").select(`
        *,
        empresas!inner (
          id,
          nome,
          nome_fantasia
        ),
        cargos (
          id,
          nome
        ),
        departamentos (
          id,
          nome
        )
      `).eq("status", "ativo").order("nome_completo");
    if (error) {
      console.error("[FUNCIONARIOS] Erro na query:", error);
      throw error;
    }
    console.log("[FUNCIONARIOS] Funcion\xE1rios encontrados:", (funcionarios == null ? void 0 : funcionarios.length) || 0);
    return funcionarios || [];
  } catch (error) {
    console.error("[FUNCIONARIOS] Erro completo:", {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar funcion\xE1rios: ${error.message}`
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
