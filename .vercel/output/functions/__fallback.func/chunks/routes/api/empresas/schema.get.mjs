import { d as defineEventHandler, a as useRuntimeConfig } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const schema_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/empresas?select=*&limit=1`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    const empresas = await response.json();
    if (Array.isArray(empresas) && empresas.length > 0) {
      const colunas = Object.keys(empresas[0]);
      return {
        success: true,
        message: "Colunas da tabela empresas",
        colunas: colunas.sort(),
        exemplo: empresas[0]
      };
    }
    const testResponse = await fetch(
      `${supabaseUrl}/rest/v1/empresas`,
      {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          nome: "TESTE",
          cnpj: "00.000.000/0000-00"
        })
      }
    );
    const testResult = await testResponse.json();
    return {
      success: false,
      message: "Nenhuma empresa encontrada. Tentativa de criar teste:",
      status: testResponse.status,
      resultado: testResult
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

export { schema_get as default };
//# sourceMappingURL=schema.get.mjs.map
