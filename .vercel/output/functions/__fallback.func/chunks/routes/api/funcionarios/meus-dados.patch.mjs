import { d as defineEventHandler, r as readBody, a as useRuntimeConfig, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const meusDados_patch = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  const userId = body.userId;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Usu\xE1rio n\xE3o autenticado"
    });
  }
  console.log("\u{1F4DD} Atualizando dados do funcion\xE1rio:", userId);
  console.log("\u{1F4E6} Dados recebidos:", JSON.stringify(body, null, 2));
  try {
    const userResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}&select=tipo_acesso`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!userResponse.ok) {
      throw new Error("Erro ao verificar permiss\xF5es do usu\xE1rio");
    }
    const userData = await userResponse.json();
    const isAdmin = ((_a = userData[0]) == null ? void 0 : _a.tipo_acesso) === "admin";
    console.log("\u{1F464} Tipo de usu\xE1rio:", isAdmin ? "Admin" : "Funcion\xE1rio");
    const camposPermitidos = {
      telefone: body.telefone,
      email_pessoal: body.email_pessoal,
      pis_pasep: body.pis_pasep,
      banco: body.banco,
      agencia: body.agencia,
      conta: body.conta,
      tipo_conta: body.tipo_conta,
      forma_pagamento: body.forma_pagamento,
      chave_pix: body.chave_pix,
      avatar: body.avatar,
      // Todos podem alterar avatar
      // Campos que podem ser editados apenas uma vez (verificação no frontend)
      data_nascimento: body.data_nascimento,
      sexo: body.sexo,
      rg: body.rg
    };
    if (isAdmin) {
      if (body.nome_completo !== void 0) camposPermitidos.nome_completo = body.nome_completo;
      if (body.cpf !== void 0) camposPermitidos.cpf = body.cpf;
      if (body.cargo_id !== void 0) camposPermitidos.cargo_id = body.cargo_id;
      if (body.departamento_id !== void 0) camposPermitidos.departamento_id = body.departamento_id;
      if (body.data_admissao !== void 0) camposPermitidos.data_admissao = body.data_admissao;
      if (body.tipo_contrato !== void 0) camposPermitidos.tipo_contrato = body.tipo_contrato;
      if (body.empresa_id !== void 0) camposPermitidos.empresa_id = body.empresa_id;
      if (body.pensao_alimenticia !== void 0) camposPermitidos.pensao_alimenticia = body.pensao_alimenticia;
    } else {
      if (body.pensao_alimenticia !== void 0) {
        console.log("\u26A0\uFE0F Funcion\xE1rio tentou atualizar pens\xE3o aliment\xEDcia - IGNORADO");
      }
    }
    const chavesPermitidas = Object.keys(camposPermitidos);
    chavesPermitidas.forEach((key) => {
      if (camposPermitidos[key] === void 0) {
        delete camposPermitidos[key];
      }
    });
    console.log("\u2705 Campos a atualizar:", JSON.stringify(camposPermitidos, null, 2));
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(camposPermitidos)
      }
    );
    console.log("\u{1F4CA} Status da resposta:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("\u274C Erro ao atualizar:", errorText);
      throw new Error(`Erro ao atualizar dados: ${errorText}`);
    }
    const funcionarioAtualizado = await response.json();
    console.log("\u2705 Dados atualizados com sucesso!");
    return {
      success: true,
      message: "Dados atualizados com sucesso!",
      data: funcionarioAtualizado[0]
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro ao atualizar dados:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao atualizar dados"
    });
  }
});

export { meusDados_patch as default };
//# sourceMappingURL=meus-dados.patch.mjs.map
