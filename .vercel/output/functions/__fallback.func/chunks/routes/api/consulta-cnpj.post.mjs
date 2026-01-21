import { d as defineEventHandler, b as getRequestURL, r as readBody, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const consultaCnpj_post = defineEventHandler(async (event) => {
  var _a, _b;
  console.log("\u{1F680} API consulta-cnpj INICIADA");
  console.log("\u{1F4CD} URL:", getRequestURL(event).pathname);
  console.log("\u{1F527} M\xE9todo:", event.method);
  try {
    console.log("\u{1F4E5} Lendo body da requisi\xE7\xE3o...");
    const body = await readBody(event);
    console.log("\u{1F4E6} Body recebido:", body);
    const { cnpj } = body;
    console.log("\u{1F4CB} CNPJ extra\xEDdo:", cnpj);
    if (!cnpj) {
      console.log("\u274C CNPJ n\xE3o fornecido");
      throw createError({
        statusCode: 400,
        statusMessage: "CNPJ \xE9 obrigat\xF3rio"
      });
    }
    const cnpjLimpo = cnpj.replace(/[^\d]/g, "");
    console.log("\u{1F9F9} CNPJ limpo:", cnpjLimpo);
    if (cnpjLimpo.length !== 14) {
      console.log("\u274C CNPJ com tamanho inv\xE1lido:", cnpjLimpo.length);
      throw createError({
        statusCode: 400,
        statusMessage: "CNPJ deve ter 14 d\xEDgitos"
      });
    }
    console.log("\u{1F310} Consultando ReceitaWS para CNPJ:", cnpjLimpo);
    const response = await $fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
      headers: {
        "User-Agent": "Sistema-RH/1.0",
        "Accept": "application/json"
      },
      timeout: 15e3
      // 15 segundos de timeout
    });
    console.log("\u{1F4E6} Resposta da ReceitaWS recebida");
    console.log("\u{1F4CA} Status da resposta:", response.status);
    console.log("\u{1F3E2} Nome da empresa:", response.nome);
    if (response.status === "ERROR") {
      console.log("\u274C ReceitaWS retornou erro:", response.message);
      throw createError({
        statusCode: 404,
        statusMessage: response.message || "CNPJ n\xE3o encontrado"
      });
    }
    const dadosEmpresa = {
      // Dados principais
      nome: response.nome || "",
      nome_fantasia: response.fantasia || "",
      cnpj: formatarCNPJ(cnpjLimpo),
      // Endereço detalhado
      logradouro: response.logradouro || "",
      numero: response.numero || "",
      complemento: response.complemento || "",
      bairro: response.bairro || "",
      municipio: response.municipio || "",
      uf: response.uf || "",
      cep: response.cep || "",
      endereco_completo: formatarEndereco(response),
      // Contatos
      telefone: response.telefone || "",
      email: response.email || "",
      // Informações cadastrais
      situacao_cadastral: response.situacao || "",
      inscricao_estadual: obterInscricaoEstadual(response),
      atividade_principal: ((_b = (_a = response.atividade_principal) == null ? void 0 : _a[0]) == null ? void 0 : _b.text) || "",
      natureza_juridica: response.natureza_juridica || "",
      porte: response.porte || "",
      capital_social: response.capital_social || "",
      data_abertura: response.abertura || "",
      // Dados legados para compatibilidade
      razao_social: response.nome || "",
      endereco: formatarEndereco(response)
    };
    console.log("\u2705 Dados processados com sucesso");
    console.log("\u{1F3E2} Inscri\xE7\xE3o Estadual encontrada:", dadosEmpresa.inscricao_estadual);
    console.log("\u{1F4E4} Retornando dados para o frontend");
    return {
      success: true,
      data: dadosEmpresa
    };
  } catch (error) {
    console.error("\u274C ERRO na API consulta-cnpj:", error);
    console.error("\u274C Tipo do erro:", typeof error);
    console.error("\u274C Nome do erro:", error.name);
    console.error("\u274C Mensagem:", error.message);
    console.error("\u274C Stack:", error.stack);
    if (error.statusCode) {
      console.log("\u{1F504} Repassando erro da API externa");
      throw error;
    }
    if (error.name === "FetchError" || error.code === "NETWORK_ERROR") {
      console.log("\u{1F310} Erro de rede detectado");
      throw createError({
        statusCode: 503,
        statusMessage: "Servi\xE7o de consulta CNPJ temporariamente indispon\xEDvel. Tente novamente em alguns minutos."
      });
    }
    console.log("\u{1F527} Erro gen\xE9rico, retornando 500");
    throw createError({
      statusCode: 500,
      statusMessage: "Erro interno do servidor ao consultar CNPJ"
    });
  }
});
function obterInscricaoEstadual(dados) {
  var _a;
  const possiveisIE = [
    (_a = dados.extra) == null ? void 0 : _a.inscricao_estadual,
    dados.inscricao_estadual,
    dados.ie,
    dados.inscricao
  ];
  for (const ie of possiveisIE) {
    if (ie && ie.trim() && ie.trim() !== "ISENTO" && ie.trim() !== "N\xC3O INFORMADO") {
      console.log("\u{1F50D} Inscri\xE7\xE3o Estadual encontrada:", ie);
      return ie.trim();
    }
  }
  console.log("\u26A0\uFE0F Inscri\xE7\xE3o Estadual n\xE3o encontrada ou isenta");
  return "";
}
function formatarCNPJ(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}
function formatarEndereco(dados) {
  const partes = [];
  if (dados.logradouro) partes.push(dados.logradouro);
  if (dados.numero) partes.push(dados.numero);
  if (dados.complemento) partes.push(dados.complemento);
  if (dados.bairro) partes.push(dados.bairro);
  if (dados.municipio) partes.push(dados.municipio);
  if (dados.uf) partes.push(dados.uf);
  if (dados.cep) partes.push(`CEP: ${dados.cep}`);
  return partes.join(", ");
}

export { consultaCnpj_post as default };
//# sourceMappingURL=consulta-cnpj.post.mjs.map
