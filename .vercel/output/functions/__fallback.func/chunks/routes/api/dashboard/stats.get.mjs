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
    console.log("[STATS] Iniciando busca de estat\xEDsticas...");
    const supabase = serverSupabaseServiceRole(event);
    console.log("[STATS] Cliente Supabase criado");
    const { data: funcionarios, error: errorFuncionarios } = await supabase.from("funcionarios").select("id", { count: "exact" }).eq("status", "ativo");
    if (errorFuncionarios) {
      console.error("[STATS] Erro ao buscar funcion\xE1rios:", errorFuncionarios);
      throw errorFuncionarios;
    }
    console.log("[STATS] Funcion\xE1rios encontrados:", (funcionarios == null ? void 0 : funcionarios.length) || 0);
    const hoje = /* @__PURE__ */ new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const { data: holerites, error: errorHolerites } = await supabase.from("holerites").select("id", { count: "exact" }).gte("created_at", inicioMes.toISOString()).lte("created_at", fimMes.toISOString());
    if (errorHolerites) {
      console.error("[STATS] Erro ao buscar holerites:", errorHolerites);
      throw errorHolerites;
    }
    console.log("[STATS] Holerites encontrados:", (holerites == null ? void 0 : holerites.length) || 0);
    const { data: empresas, error: errorEmpresas } = await supabase.from("empresas").select("id", { count: "exact" });
    if (errorEmpresas) {
      console.error("[STATS] Erro ao buscar empresas:", errorEmpresas);
      throw errorEmpresas;
    }
    console.log("[STATS] Empresas encontradas:", (empresas == null ? void 0 : empresas.length) || 0);
    const { data: departamentos, error: errorDepartamentos } = await supabase.from("departamentos").select("id", { count: "exact" });
    if (errorDepartamentos) {
      console.error("[STATS] Erro ao buscar departamentos:", errorDepartamentos);
      throw errorDepartamentos;
    }
    console.log("[STATS] Departamentos encontrados:", (departamentos == null ? void 0 : departamentos.length) || 0);
    const mesAtual = hoje.getMonth() + 1;
    const { data: aniversariantes, error: errorAniversariantes } = await supabase.from("funcionarios").select("id").eq("status", "ativo").not("data_nascimento", "is", null).filter("data_nascimento", "like", `%-${mesAtual.toString().padStart(2, "0")}-%`);
    if (errorAniversariantes) {
      console.error("[STATS] Erro ao buscar aniversariantes:", errorAniversariantes);
    }
    console.log("[STATS] Aniversariantes encontrados:", (aniversariantes == null ? void 0 : aniversariantes.length) || 0);
    const stats = {
      totalFuncionarios: (funcionarios == null ? void 0 : funcionarios.length) || 0,
      holeritesMes: (holerites == null ? void 0 : holerites.length) || 0,
      totalEmpresas: (empresas == null ? void 0 : empresas.length) || 0,
      totalDepartamentos: (departamentos == null ? void 0 : departamentos.length) || 0,
      totalAniversariantes: (aniversariantes == null ? void 0 : aniversariantes.length) || 0,
      folhaMensal: 0,
      // Será calculado se necessário
      mesAtual: hoje.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    };
    console.log("[STATS] Estat\xEDsticas finais:", stats);
    return stats;
  } catch (error) {
    console.error("[STATS] Erro completo:", {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar estat\xEDsticas: ${error.message}`
    });
  }
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
