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
    const supabase = serverSupabaseServiceRole(event);
    const { data: funcionarios, error } = await supabase.from("funcionarios").select(`
        id,
        nome_completo,
        data_nascimento,
        cargo:cargos(nome),
        departamento:departamentos(nome)
      `).not("data_nascimento", "is", null);
    if (error) throw error;
    const mesAtual = (/* @__PURE__ */ new Date()).getMonth() + 1;
    const aniversariantes = (funcionarios == null ? void 0 : funcionarios.filter((f) => {
      const mesNascimento = new Date(f.data_nascimento).getMonth() + 1;
      return mesNascimento === mesAtual;
    }).map((f) => {
      var _a, _b;
      return {
        id: f.id,
        nome_completo: f.nome_completo,
        data_nascimento: f.data_nascimento,
        cargo: ((_a = f.cargo) == null ? void 0 : _a.nome) || "N\xE3o definido",
        departamento: ((_b = f.departamento) == null ? void 0 : _b.nome) || "N\xE3o definido",
        dia: new Date(f.data_nascimento).getDate()
      };
    }).sort((a, b) => a.dia - b.dia)) || [];
    return aniversariantes;
  } catch (error) {
    console.error("Erro ao buscar aniversariantes:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar aniversariantes"
    });
  }
});

export { aniversariantes_get as default };
//# sourceMappingURL=aniversariantes.get.mjs.map
