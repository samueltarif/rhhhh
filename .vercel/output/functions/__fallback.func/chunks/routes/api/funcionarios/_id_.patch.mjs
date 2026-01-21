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
  const supabase = serverSupabaseServiceRole(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  try {
    console.log("\u270F\uFE0F Atualizando funcion\xE1rio ID:", id);
    const cleanValue = (value) => {
      if (value === "" || value === void 0) return null;
      return value;
    };
    const dadosParaAtualizar = {};
    if (body.nome_completo && body.nome_completo.trim()) {
      dadosParaAtualizar.nome_completo = body.nome_completo.trim();
    }
    if (body.cpf) {
      dadosParaAtualizar.cpf = body.cpf;
    }
    if (body.email_login) {
      dadosParaAtualizar.email_login = body.email_login;
    }
    if (body.rg !== void 0) dadosParaAtualizar.rg = cleanValue(body.rg);
    if (body.data_nascimento !== void 0) dadosParaAtualizar.data_nascimento = cleanValue(body.data_nascimento);
    if (body.sexo !== void 0) dadosParaAtualizar.sexo = cleanValue(body.sexo);
    if (body.telefone !== void 0) dadosParaAtualizar.telefone = cleanValue(body.telefone);
    if (body.email_pessoal !== void 0) dadosParaAtualizar.email_pessoal = cleanValue(body.email_pessoal);
    if (body.empresa_id !== void 0) dadosParaAtualizar.empresa_id = cleanValue(body.empresa_id);
    if (body.departamento_id !== void 0) dadosParaAtualizar.departamento_id = cleanValue(body.departamento_id);
    if (body.cargo_id !== void 0) dadosParaAtualizar.cargo_id = cleanValue(body.cargo_id);
    if (body.jornada_trabalho_id !== void 0) dadosParaAtualizar.jornada_trabalho_id = cleanValue(body.jornada_trabalho_id);
    if (body.responsavel_id !== void 0) dadosParaAtualizar.responsavel_id = cleanValue(body.responsavel_id);
    if (body.tipo_contrato !== void 0) dadosParaAtualizar.tipo_contrato = cleanValue(body.tipo_contrato);
    if (body.data_admissao !== void 0) dadosParaAtualizar.data_admissao = cleanValue(body.data_admissao);
    if (body.matricula !== void 0) dadosParaAtualizar.matricula = cleanValue(body.matricula);
    if (body.senha !== void 0) dadosParaAtualizar.senha = body.senha;
    if (body.tipo_acesso !== void 0) dadosParaAtualizar.tipo_acesso = body.tipo_acesso || "funcionario";
    if (body.status !== void 0) dadosParaAtualizar.status = body.status || "ativo";
    if (body.salario_base !== void 0) dadosParaAtualizar.salario_base = cleanValue(body.salario_base) || 0;
    if (body.numero_dependentes !== void 0) dadosParaAtualizar.numero_dependentes = cleanValue(body.numero_dependentes) || 0;
    if (body.tipo_salario !== void 0) dadosParaAtualizar.tipo_salario = body.tipo_salario || "mensal";
    if (body.banco !== void 0) dadosParaAtualizar.banco = cleanValue(body.banco);
    if (body.agencia !== void 0) dadosParaAtualizar.agencia = cleanValue(body.agencia);
    if (body.conta !== void 0) dadosParaAtualizar.conta = cleanValue(body.conta);
    if (body.tipo_conta !== void 0) dadosParaAtualizar.tipo_conta = cleanValue(body.tipo_conta);
    if (body.forma_pagamento !== void 0) dadosParaAtualizar.forma_pagamento = cleanValue(body.forma_pagamento);
    if (body.beneficios !== void 0) dadosParaAtualizar.beneficios = body.beneficios || null;
    if (body.descontos_personalizados !== void 0) dadosParaAtualizar.descontos_personalizados = body.descontos_personalizados || null;
    if (body.pis_pasep !== void 0) dadosParaAtualizar.pis_pasep = cleanValue(body.pis_pasep);
    console.log("\u{1F4DD} Campos a atualizar:", Object.keys(dadosParaAtualizar));
    const { data, error } = await supabase.from("funcionarios").update(dadosParaAtualizar).eq("id", id).select().single();
    if (error) {
      console.error("\u274C Erro ao atualizar funcion\xE1rio:", error);
      throw error;
    }
    const funcionario = data;
    console.log("\u2705 Funcion\xE1rio atualizado:", funcionario == null ? void 0 : funcionario.id);
    return {
      success: true,
      data: funcionario
    };
  } catch (error) {
    console.error("\u274C Erro:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao atualizar funcion\xE1rio"
    });
  }
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
