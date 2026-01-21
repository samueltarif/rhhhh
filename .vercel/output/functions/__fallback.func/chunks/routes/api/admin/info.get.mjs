import { d as defineEventHandler, a as useRuntimeConfig } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const info_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseKey;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?tipo_acesso=eq.admin&select=id,nome_completo,email_login,cargo_id,departamento_id&limit=1`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar admin");
    }
    const admins = await response.json();
    if (admins && admins.length > 0) {
      return {
        success: true,
        data: {
          id: admins[0].id,
          nome: admins[0].nome_completo,
          email: admins[0].email_login,
          cargo_id: admins[0].cargo_id,
          departamento_id: admins[0].departamento_id
        }
      };
    }
    return {
      success: true,
      data: {
        id: null,
        nome: "Silvana Qualitec",
        email: "silvana@qualitec.com.br"
      }
    };
  } catch (error) {
    console.error("Erro ao buscar admin:", error);
    return {
      success: true,
      data: {
        id: null,
        nome: "Silvana Qualitec",
        email: "silvana@qualitec.com.br"
      }
    };
  }
});

export { info_get as default };
//# sourceMappingURL=info.get.mjs.map
