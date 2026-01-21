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

const aniversariantes_get = defineEventHandler(async (event) => {
  try {
    console.log("[ANIVERSARIANTES] Iniciando busca...");
    const supabase = serverSupabaseServiceRole(event);
    console.log("[ANIVERSARIANTES] Cliente Supabase criado");
    const hoje = /* @__PURE__ */ new Date();
    const mesAtual = hoje.getMonth() + 1;
    console.log("[ANIVERSARIANTES] Buscando aniversariantes do m\xEAs:", mesAtual);
    const { data: aniversariantes, error } = await supabase.from("funcionarios").select(`
        id,
        nome_completo,
        data_nascimento,
        avatar
      `).eq("status", "ativo").not("data_nascimento", "is", null);
    if (error) {
      console.error("[ANIVERSARIANTES] Erro na query:", error);
      throw error;
    }
    console.log("[ANIVERSARIANTES] Funcion\xE1rios encontrados:", (aniversariantes == null ? void 0 : aniversariantes.length) || 0);
    const aniversariantesMes = (aniversariantes == null ? void 0 : aniversariantes.filter((funcionario) => {
      if (!funcionario.data_nascimento) return false;
      const dataNascimento = new Date(funcionario.data_nascimento);
      const mesNascimento = dataNascimento.getMonth() + 1;
      return mesNascimento === mesAtual;
    })) || [];
    console.log("[ANIVERSARIANTES] Aniversariantes do m\xEAs:", aniversariantesMes.length);
    aniversariantesMes.sort((a, b) => {
      const diaA = new Date(a.data_nascimento).getDate();
      const diaB = new Date(b.data_nascimento).getDate();
      return diaA - diaB;
    });
    return aniversariantesMes;
  } catch (error) {
    console.error("[ANIVERSARIANTES] Erro completo:", {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar aniversariantes: ${error.message}`
    });
  }
});

export { aniversariantes_get as default };
//# sourceMappingURL=aniversariantes.get.mjs.map
