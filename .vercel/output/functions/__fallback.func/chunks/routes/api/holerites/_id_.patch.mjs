import { d as defineEventHandler, e as getRouterParam, r as readBody, c as createError } from '../../../_/nitro.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID do holerite n\xE3o fornecido"
      });
    }
    const dadosParaAtualizar = {};
    if (body.salario_base !== void 0) dadosParaAtualizar.salario_base = body.salario_base;
    if (body.bonus !== void 0) dadosParaAtualizar.bonus = body.bonus;
    if (body.horas_extras !== void 0) dadosParaAtualizar.horas_extras = body.horas_extras;
    if (body.adicional_noturno !== void 0) dadosParaAtualizar.adicional_noturno = body.adicional_noturno;
    if (body.adicional_periculosidade !== void 0) dadosParaAtualizar.adicional_periculosidade = body.adicional_periculosidade;
    if (body.adicional_insalubridade !== void 0) dadosParaAtualizar.adicional_insalubridade = body.adicional_insalubridade;
    if (body.comissoes !== void 0) dadosParaAtualizar.comissoes = body.comissoes;
    if (body.inss !== void 0) dadosParaAtualizar.inss = body.inss;
    if (body.irrf !== void 0) dadosParaAtualizar.irrf = body.irrf;
    if (body.vale_transporte !== void 0) dadosParaAtualizar.vale_transporte = body.vale_transporte;
    if (body.cesta_basica_desconto !== void 0) dadosParaAtualizar.cesta_basica_desconto = body.cesta_basica_desconto;
    if (body.plano_saude !== void 0) dadosParaAtualizar.plano_saude = body.plano_saude;
    if (body.plano_odontologico !== void 0) dadosParaAtualizar.plano_odontologico = body.plano_odontologico;
    if (body.adiantamento !== void 0) dadosParaAtualizar.adiantamento = body.adiantamento;
    if (body.faltas !== void 0) dadosParaAtualizar.faltas = body.faltas;
    if (body.horas_trabalhadas !== void 0) dadosParaAtualizar.horas_trabalhadas = body.horas_trabalhadas;
    if (body.observacoes !== void 0) dadosParaAtualizar.observacoes = body.observacoes;
    if (body.data_pagamento !== void 0) dadosParaAtualizar.data_pagamento = body.data_pagamento;
    if (body.status !== void 0) dadosParaAtualizar.status = body.status;
    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw createError({
        statusCode: 400,
        message: "Nenhum campo para atualizar"
      });
    }
    const { data, error } = await supabase.from("holerites").update(dadosParaAtualizar).eq("id", id).select(`
        *,
        funcionario:funcionarios (
          nome_completo,
          cargo:cargos (nome),
          empresa:empresas (nome_fantasia)
        )
      `).single();
    if (error) {
      console.error("Erro ao atualizar holerite:", error);
      throw error;
    }
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Erro ao atualizar holerite:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao atualizar holerite"
    });
  }
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
