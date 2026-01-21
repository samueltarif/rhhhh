import { d as defineEventHandler, e as getRouterParam, c as createError, i as setHeader } from '../../../../_/nitro.mjs';
import { g as gerarHoleriteHTML } from '../../../../_/holeriteHTML.mjs';
import { s as serverSupabaseServiceRole } from '../../../../_/serverSupabaseServiceRole.mjs';
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

const html_get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const supabase = serverSupabaseServiceRole(event);
  try {
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID do holerite \xE9 obrigat\xF3rio"
      });
    }
    const { data: holerite, error: holeriteError } = await supabase.from("holerites").select("*").eq("id", id).single();
    if (holeriteError || !holerite) {
      throw createError({
        statusCode: 404,
        message: "Holerite n\xE3o encontrado"
      });
    }
    const { data: funcionario, error: funcError } = await supabase.from("funcionarios").select("*").eq("id", holerite.funcionario_id).single();
    if (funcError || !funcionario) {
      throw createError({
        statusCode: 404,
        message: "Funcion\xE1rio n\xE3o encontrado"
      });
    }
    let cargo = null;
    if (funcionario.cargo_id) {
      const { data: cargoData } = await supabase.from("cargos").select("nome").eq("id", funcionario.cargo_id).single();
      cargo = cargoData;
    }
    let departamento = null;
    if (funcionario.departamento_id) {
      const { data: deptData } = await supabase.from("departamentos").select("nome").eq("id", funcionario.departamento_id).single();
      departamento = deptData;
    }
    const { data: empresa, error: empresaError } = await supabase.from("empresas").select("*").eq("id", funcionario.empresa_id).single();
    if (empresaError || !empresa) {
      throw createError({
        statusCode: 404,
        message: "Empresa n\xE3o encontrada"
      });
    }
    const funcionarioData = {
      nome_completo: funcionario.nome_completo,
      cpf: funcionario.cpf,
      cargo: (cargo == null ? void 0 : cargo.nome) || "N\xE3o informado",
      departamento: (departamento == null ? void 0 : departamento.nome) || "N\xE3o informado",
      data_admissao: funcionario.data_admissao,
      numero_dependentes: funcionario.numero_dependentes || 0,
      pensao_alimenticia: funcionario.pensao_alimenticia || 0
    };
    const empresaData = {
      nome: empresa.nome || empresa.nome_fantasia || "Empresa",
      cnpj: empresa.cnpj || "",
      logradouro: empresa.logradouro || "",
      numero: empresa.numero || "",
      complemento: empresa.complemento || "",
      bairro: empresa.bairro || "",
      cidade: empresa.cidade || "",
      estado: empresa.estado || "",
      cep: empresa.cep || ""
    };
    const html = gerarHoleriteHTML(holerite, funcionarioData, empresaData);
    setHeader(event, "Content-Type", "text/html; charset=utf-8");
    setHeader(event, "Content-Disposition", `attachment; filename="holerite-${funcionario.nome_completo.replace(/\s+/g, "-")}.html"`);
    return html;
  } catch (error) {
    console.error("Erro ao gerar HTML:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao gerar HTML do holerite"
    });
  }
});

export { html_get as default };
//# sourceMappingURL=html.get.mjs.map
