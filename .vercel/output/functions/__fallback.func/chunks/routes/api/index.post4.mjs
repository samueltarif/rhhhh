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
  console.log("\u23F0 Salvando jornada:", JSON.stringify(body, null, 2));
  try {
    let jornadaId = body.id;
    if (jornadaId) {
      console.log("\u{1F504} ATUALIZANDO jornada ID:", jornadaId);
      const { id, horarios, ...dadosJornada } = body;
      console.log("\u{1F4DD} Dados da jornada:", JSON.stringify(dadosJornada, null, 2));
      const response = await fetch(
        `${supabaseUrl}/rest/v1/jornadas_trabalho?id=eq.${jornadaId}`,
        {
          method: "PATCH",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify(dadosJornada)
        }
      );
      console.log("\u{1F4CA} Status PATCH:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("\u274C Erro ao atualizar:", errorText);
        throw new Error(`Erro ao atualizar jornada: ${errorText}`);
      }
    } else {
      console.log("\u2795 CRIANDO nova jornada");
      const { horarios, ...dadosJornada } = body;
      console.log("\u{1F4DD} Dados da jornada:", JSON.stringify(dadosJornada, null, 2));
      const response = await fetch(
        `${supabaseUrl}/rest/v1/jornadas_trabalho`,
        {
          method: "POST",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify(dadosJornada)
        }
      );
      console.log("\u{1F4CA} Status POST:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("\u274C Erro ao criar:", errorText);
        throw new Error(`Erro ao criar jornada: ${errorText}`);
      }
      const jornadas = await response.json();
      console.log("\u{1F4E6} Jornada criada:", jornadas);
      jornadaId = jornadas[0].id;
      console.log("\u{1F194} ID da jornada criada:", jornadaId);
    }
    if (body.horarios && Array.isArray(body.horarios)) {
      await fetch(
        `${supabaseUrl}/rest/v1/jornada_horarios?jornada_id=eq.${jornadaId}`,
        {
          method: "DELETE",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`
          }
        }
      );
      const horariosParaSalvar = body.horarios.map((h) => ({
        jornada_id: jornadaId,
        dia_semana: h.dia_semana,
        entrada: h.entrada,
        saida: h.saida,
        intervalo_inicio: h.intervalo_inicio,
        intervalo_fim: h.intervalo_fim,
        horas_brutas: h.horas_brutas,
        horas_intervalo: h.horas_intervalo,
        horas_liquidas: h.horas_liquidas,
        trabalha: h.trabalha
      }));
      await fetch(
        `${supabaseUrl}/rest/v1/jornada_horarios`,
        {
          method: "POST",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(horariosParaSalvar)
        }
      );
    }
    console.log("\u2705 Jornada salva com sucesso!");
    return {
      success: true,
      message: body.id ? "Jornada atualizada com sucesso!" : "Jornada criada com sucesso!",
      data: { id: jornadaId }
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro ao salvar jornada:", error.message);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao salvar jornada"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post4.mjs.map
