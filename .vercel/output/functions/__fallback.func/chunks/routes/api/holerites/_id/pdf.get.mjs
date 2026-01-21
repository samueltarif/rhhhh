import { d as defineEventHandler, a as useRuntimeConfig, e as getRouterParam, c as createError, j as setResponseHeader } from '../../../../_/nitro.mjs';
import { g as gerarHoleriteHTML } from '../../../../_/holeriteHTML.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const pdf_get = defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl;
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID do holerite n\xE3o fornecido"
      });
    }
    console.log("\u{1F4C4} Gerando holerite HTML para ID:", id);
    const holeriteResponse = await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}&select=*`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!holeriteResponse.ok) {
      throw new Error("Erro ao buscar holerite");
    }
    const holerites = await holeriteResponse.json();
    if (!holerites || holerites.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Holerite n\xE3o encontrado"
      });
    }
    const holerite = holerites[0];
    const funcionarioResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${holerite.funcionario_id}&select=*`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!funcionarioResponse.ok) {
      throw new Error("Erro ao buscar funcion\xE1rio");
    }
    const funcionarios = await funcionarioResponse.json();
    if (!funcionarios || funcionarios.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Funcion\xE1rio n\xE3o encontrado"
      });
    }
    const funcionario = funcionarios[0];
    let cargoNome = "N\xE3o definido";
    if (funcionario.cargo_id) {
      const cargoResponse = await fetch(
        `${supabaseUrl}/rest/v1/cargos?id=eq.${funcionario.cargo_id}&select=nome`,
        {
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (cargoResponse.ok) {
        const cargos = await cargoResponse.json();
        if (cargos && cargos.length > 0) {
          cargoNome = cargos[0].nome;
        }
      }
    }
    let departamentoNome = "N\xE3o definido";
    if (funcionario.departamento_id) {
      const deptResponse = await fetch(
        `${supabaseUrl}/rest/v1/departamentos?id=eq.${funcionario.departamento_id}&select=nome`,
        {
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (deptResponse.ok) {
        const departamentos = await deptResponse.json();
        if (departamentos && departamentos.length > 0) {
          departamentoNome = departamentos[0].nome;
        }
      }
    }
    funcionario.cargo_nome = cargoNome;
    funcionario.departamento_nome = departamentoNome;
    funcionario.numero_dependentes = funcionario.numero_dependentes || 0;
    const empresaResponse = await fetch(
      `${supabaseUrl}/rest/v1/empresas?id=eq.${funcionario.empresa_id}&select=*`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!empresaResponse.ok) {
      throw new Error("Erro ao buscar empresa");
    }
    const empresas = await empresaResponse.json();
    if (!empresas || empresas.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Empresa n\xE3o encontrada"
      });
    }
    const empresa = empresas[0];
    const html = gerarHoleriteHTML(holerite, funcionario, empresa);
    setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
    return html;
  } catch (error) {
    console.error("Erro ao gerar holerite:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao gerar holerite"
    });
  }
});

export { pdf_get as default };
//# sourceMappingURL=pdf.get.mjs.map
