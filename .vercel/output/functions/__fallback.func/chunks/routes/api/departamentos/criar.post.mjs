import { d as defineEventHandler, r as readBody, a as useRuntimeConfig, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const criar_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  console.log("\u{1F4DD} Salvando departamento:", JSON.stringify(body, null, 2));
  try {
    if (body.id) {
      console.log("\u{1F504} Atualizando departamento ID:", body.id);
      const { id, ...dadosDepartamento } = body;
      const response = await fetch(
        `${supabaseUrl}/rest/v1/departamentos?id=eq.${id}`,
        {
          method: "PATCH",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify(dadosDepartamento)
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("\u274C Erro ao atualizar:", errorText);
        throw new Error(`Erro ao atualizar departamento: ${errorText}`);
      }
      const departamentoAtualizado = await response.json();
      console.log("\u2705 Departamento atualizado!");
      return {
        success: true,
        message: "Departamento atualizado com sucesso!",
        data: departamentoAtualizado[0]
      };
    } else {
      console.log("\u2795 Criando novo departamento");
      const response = await fetch(
        `${supabaseUrl}/rest/v1/departamentos`,
        {
          method: "POST",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify({
            nome: body.nome,
            descricao: body.descricao,
            responsavel: body.responsavel
          })
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("\u274C Erro ao criar:", errorText);
        throw new Error(`Erro ao criar departamento: ${errorText}`);
      }
      const departamentoCriado = await response.json();
      console.log("\u2705 Departamento criado!");
      return {
        success: true,
        message: "Departamento criado com sucesso!",
        data: departamentoCriado[0]
      };
    }
  } catch (error) {
    console.error("\u{1F4A5} Erro ao salvar departamento:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao salvar departamento"
    });
  }
});

export { criar_post as default };
//# sourceMappingURL=criar.post.mjs.map
