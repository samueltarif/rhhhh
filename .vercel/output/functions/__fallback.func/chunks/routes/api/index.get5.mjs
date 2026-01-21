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
    console.log("[HOLERITES] Iniciando busca de holerites...");
    const supabase = serverSupabaseServiceRole(event);
    console.log("[HOLERITES] Cliente Supabase criado");
    const { data: holerites, error } = await supabase.from("holerites").select(`
        *,
        funcionarios!inner (
          id,
          nome_completo,
          cpf,
          cargos (
            id,
            nome
          ),
          departamentos (
            id,
            nome
          ),
          empresas (
            id,
            nome,
            nome_fantasia
          )
        )
      `).order("created_at", { ascending: false }).limit(50);
    if (error) {
      console.error("[HOLERITES] Erro na query:", error);
      throw error;
    }
    console.log("[HOLERITES] Holerites encontrados:", (holerites == null ? void 0 : holerites.length) || 0);
    const holeritesTratados = (holerites == null ? void 0 : holerites.map((h) => {
      var _a, _b, _c;
      return {
        ...h,
        funcionario: {
          id: h.funcionarios.id,
          nome_completo: h.funcionarios.nome_completo,
          cpf: h.funcionarios.cpf,
          cargo: ((_a = h.funcionarios.cargos) == null ? void 0 : _a.nome) || "Cargo n\xE3o definido",
          empresa: ((_b = h.funcionarios.empresas) == null ? void 0 : _b.nome_fantasia) || ((_c = h.funcionarios.empresas) == null ? void 0 : _c.nome) || "Empresa n\xE3o definida"
        }
      };
    })) || [];
    console.log("[HOLERITES] Holerites tratados:", holeritesTratados.length);
    return holeritesTratados;
  } catch (error) {
    console.error("[HOLERITES] Erro completo:", {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar holerites: ${error.message}`
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
