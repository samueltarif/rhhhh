import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const body = await readBody(event);
  try {
    const { data, error } = await supabase.from("holerite_itens_personalizados").insert([{
      funcionario_id: body.funcionario_id,
      tipo: body.tipo,
      descricao: body.descricao,
      valor: body.valor,
      vigencia_tipo: body.vigencia_tipo,
      data_inicio: body.data_inicio,
      data_fim: body.data_fim || null,
      observacoes: body.observacoes || null,
      ativo: true
    }]).select().single();
    if (error) {
      console.error("Erro ao criar item personalizado:", error);
      if (error.code === "PGRST205" || error.code === "42P01") {
        throw createError({
          statusCode: 500,
          message: "Tabela holerite_itens_personalizados n\xE3o existe. Execute o SQL: EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor."
        });
      }
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao criar item personalizado:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao criar item personalizado"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
