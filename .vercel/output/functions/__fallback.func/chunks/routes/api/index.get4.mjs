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
  const supabase = serverSupabaseServiceRole(event);
  try {
    const { data: funcionarios, error } = await supabase.from("funcionarios").select(`
        *,
        departamentos:departamento_id(nome),
        cargos:cargo_id(nome),
        jornadas:jornada_trabalho_id(nome),
        responsavel_direto:responsavel_id(nome_completo),
        responsavel_cadastro:responsavel_cadastro_id(nome_completo, email_login)
      `).order("nome_completo");
    if (error) {
      console.error("\u274C Erro ao buscar funcion\xE1rios:", error);
      throw error;
    }
    const funcionariosFormatados = (funcionarios == null ? void 0 : funcionarios.map((f) => {
      var _a, _b, _c, _d, _e, _f;
      return {
        ...f,
        departamento: ((_a = f.departamentos) == null ? void 0 : _a.nome) || "N\xE3o definido",
        cargo: ((_b = f.cargos) == null ? void 0 : _b.nome) || "N\xE3o definido",
        jornada: ((_c = f.jornadas) == null ? void 0 : _c.nome) || "N\xE3o definida",
        responsavel_direto_nome: ((_d = f.responsavel_direto) == null ? void 0 : _d.nome_completo) || "N\xE3o definido",
        responsavel_cadastro_nome: ((_e = f.responsavel_cadastro) == null ? void 0 : _e.nome_completo) || "Sistema",
        responsavel_cadastro_email: ((_f = f.responsavel_cadastro) == null ? void 0 : _f.email_login) || ""
      };
    })) || [];
    return funcionariosFormatados;
  } catch (error) {
    console.error("\u274C Erro:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao buscar funcion\xE1rios"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
