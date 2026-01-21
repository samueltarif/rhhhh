import { d as defineEventHandler, a as useRuntimeConfig, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const index_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseKey;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/jornadas_trabalho?select=*&order=nome.asc`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar jornadas");
    }
    const jornadas = await response.json();
    const jornadasComHorarios = await Promise.all(
      jornadas.map(async (jornada) => {
        const horariosResponse = await fetch(
          `${supabaseUrl}/rest/v1/jornada_horarios?jornada_id=eq.${jornada.id}&select=*&order=dia_semana.asc`,
          {
            headers: {
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`,
              "Content-Type": "application/json"
            }
          }
        );
        const horarios = horariosResponse.ok ? await horariosResponse.json() : [];
        return {
          ...jornada,
          horarios
        };
      })
    );
    return { success: true, data: jornadasComHorarios };
  } catch (error) {
    console.error("Erro ao buscar jornadas:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar jornadas"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get6.mjs.map
