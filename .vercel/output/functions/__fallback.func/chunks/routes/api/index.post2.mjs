import { d as defineEventHandler, r as readBody, a as useRuntimeConfig, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  console.log("\u{1F3E2} Salvando empresa...");
  console.log("\u{1F4DD} Dados recebidos:", JSON.stringify(body, null, 2));
  const dadosFiltrados = {};
  if (body.id) dadosFiltrados.id = body.id;
  if (body.nome) dadosFiltrados.nome = body.nome;
  if (body.nome_fantasia) dadosFiltrados.nome_fantasia = body.nome_fantasia;
  if (body.cnpj) {
    dadosFiltrados.cnpj = body.cnpj.substring(0, 20);
  }
  if (body.inscricao_estadual) {
    dadosFiltrados.inscricao_estadual = body.inscricao_estadual.substring(0, 20);
  }
  if (body.situacao_cadastral) dadosFiltrados.situacao_cadastral = body.situacao_cadastral;
  if (body.telefone) {
    dadosFiltrados.telefone = body.telefone.substring(0, 20);
  }
  if (body.email_holerites) dadosFiltrados.email = body.email_holerites;
  else if (body.email) dadosFiltrados.email = body.email;
  if (body.logradouro || body.numero || body.bairro || body.municipio || body.uf || body.cep) {
    const partes = [];
    if (body.logradouro) partes.push(body.logradouro);
    if (body.numero) partes.push(body.numero);
    if (body.complemento) partes.push(body.complemento);
    if (body.bairro) partes.push(`- ${body.bairro}`);
    if (body.municipio && body.uf) partes.push(`- ${body.municipio}/${body.uf}`);
    if (body.cep) partes.push(`- CEP: ${body.cep}`);
    dadosFiltrados.endereco = partes.join(" ");
  } else if (body.endereco) {
    dadosFiltrados.endereco = body.endereco;
  }
  console.log("\u2705 Dados filtrados (apenas campos v\xE1lidos):", JSON.stringify(dadosFiltrados, null, 2));
  console.log("\u{1F4CF} Tamanhos dos campos:");
  Object.keys(dadosFiltrados).forEach((key) => {
    const value = dadosFiltrados[key];
    if (typeof value === "string") {
      console.log(`   - ${key}: ${value.length} caracteres - "${value}"`);
      if (["cnpj", "inscricao_estadual", "situacao_cadastral", "telefone"].includes(key) && value.length > 20) {
        console.log(`   \u26A0\uFE0F TRUNCANDO ${key} de ${value.length} para 20 caracteres`);
        dadosFiltrados[key] = value.substring(0, 20);
      }
    }
  });
  console.log("\u{1F4E6} Dados finais a serem enviados:", JSON.stringify(dadosFiltrados, null, 2));
  try {
    let response;
    let url;
    if (dadosFiltrados.id) {
      url = `${supabaseUrl}/rest/v1/empresas?id=eq.${dadosFiltrados.id}`;
      console.log("\u{1F504} ATUALIZANDO empresa ID:", dadosFiltrados.id);
      const { id, ...dadosSemId } = dadosFiltrados;
      response = await fetch(url, {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(dadosSemId)
      });
    } else {
      url = `${supabaseUrl}/rest/v1/empresas`;
      console.log("\u2795 CRIANDO nova empresa");
      response = await fetch(url, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(dadosFiltrados)
      });
    }
    console.log("\u{1F4CA} Status da resposta:", response.status);
    const responseText = await response.text();
    console.log("\u{1F4E6} Resposta do Supabase:", responseText);
    if (!response.ok) {
      console.error("\u274C Erro HTTP:", response.status, responseText);
      throw new Error(`Erro ao salvar empresa: ${response.status} - ${responseText}`);
    }
    const empresa = responseText ? JSON.parse(responseText) : null;
    console.log("\u2705 Empresa salva com sucesso!");
    return {
      success: true,
      message: dadosFiltrados.id ? "Empresa atualizada com sucesso!" : "Empresa criada com sucesso!",
      data: Array.isArray(empresa) ? empresa[0] : empresa
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro ao salvar empresa:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao salvar empresa"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
