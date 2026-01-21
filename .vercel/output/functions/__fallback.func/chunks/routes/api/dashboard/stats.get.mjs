import { d as defineEventHandler, c as createError } from '../../../_/nitro.mjs';
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

const stats_get = defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const [
      { count: totalFuncionarios },
      { count: totalDepartamentos },
      { data: funcionarios }
    ] = await Promise.all([
      supabase.from("funcionarios").select("*", { count: "exact", head: true }),
      supabase.from("departamentos").select("*", { count: "exact", head: true }),
      supabase.from("funcionarios").select("salario_base, data_nascimento")
    ]);
    const folhaMensal = (funcionarios == null ? void 0 : funcionarios.reduce((total, f) => total + (f.salario_base || 0), 0)) || 0;
    const mesAtual = (/* @__PURE__ */ new Date()).getMonth() + 1;
    const aniversariantes = (funcionarios == null ? void 0 : funcionarios.filter((f) => {
      if (!f.data_nascimento) return false;
      const mesNascimento = new Date(f.data_nascimento).getMonth() + 1;
      return mesNascimento === mesAtual;
    })) || [];
    return {
      totalFuncionarios: totalFuncionarios || 0,
      totalDepartamentos: totalDepartamentos || 0,
      folhaMensal,
      totalAniversariantes: aniversariantes.length,
      aniversariantes: aniversariantes.slice(0, 5)
      // Primeiros 5
    };
  } catch (error) {
    console.error("Erro ao buscar estat\xEDsticas:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar estat\xEDsticas do dashboard"
    });
  }
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
