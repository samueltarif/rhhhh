import { d as defineEventHandler, h as getQuery, c as createError } from '../../_/nitro.mjs';
import { s as serverSupabaseServiceRole } from '../../_/serverSupabaseServiceRole.mjs';
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

const index_get = defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const query = getQuery(event);
    const { empresa, mes, status } = query;
    let queryBuilder = supabase.from("holerites").select(`
        *,
        funcionario:funcionarios!inner (
          id,
          nome_completo,
          cargo:cargos (nome),
          empresa:empresas (nome_fantasia)
        )
      `).order("created_at", { ascending: false });
    if (empresa) {
      queryBuilder = queryBuilder.eq("funcionario.empresa_id", empresa);
    }
    if (mes) {
      const [ano, mesNum] = mes.split("-");
      const dataInicio = `${ano}-${mesNum}-01`;
      const ultimoDia = new Date(parseInt(ano), parseInt(mesNum), 0).getDate();
      const dataFim = `${ano}-${mesNum}-${ultimoDia}`;
      queryBuilder = queryBuilder.gte("periodo_inicio", dataInicio).lte("periodo_fim", dataFim);
    }
    if (status) {
      queryBuilder = queryBuilder.eq("status", status);
    }
    const { data: holerites, error } = await queryBuilder;
    if (error) {
      console.error("Erro ao buscar holerites:", error);
      throw error;
    }
    const holeriteFormatados = (holerites == null ? void 0 : holerites.map((h) => {
      var _a, _b;
      return {
        id: h.id,
        funcionario_id: h.funcionario_id,
        // Adicionar ID do funcionário
        funcionario: {
          nome_completo: h.funcionario.nome_completo,
          cargo: ((_a = h.funcionario.cargo) == null ? void 0 : _a.nome) || "N\xE3o definido",
          empresa: ((_b = h.funcionario.empresa) == null ? void 0 : _b.nome_fantasia) || "N\xE3o definida"
        },
        periodo_inicio: h.periodo_inicio,
        periodo_fim: h.periodo_fim,
        salario_base: h.salario_base,
        salario_liquido: h.salario_liquido,
        total_proventos: h.total_proventos,
        total_descontos: h.total_descontos,
        status: h.status,
        bonus: h.bonus,
        horas_extras: h.horas_extras,
        adicional_noturno: h.adicional_noturno,
        adicional_periculosidade: h.adicional_periculosidade,
        adicional_insalubridade: h.adicional_insalubridade,
        comissoes: h.comissoes,
        inss: h.inss,
        irrf: h.irrf,
        vale_transporte: h.vale_transporte,
        vale_refeicao_desconto: h.cesta_basica_desconto,
        plano_saude: h.plano_saude,
        plano_odontologico: h.plano_odontologico,
        adiantamento: h.adiantamento,
        faltas: h.faltas,
        horas_trabalhadas: h.horas_trabalhadas,
        data_pagamento: h.data_pagamento,
        observacoes: h.observacoes,
        // ✅ CAMPOS CRÍTICOS PARA EXIBIR BENEFÍCIOS E DESCONTOS
        beneficios: h.beneficios || [],
        descontos_personalizados: h.descontos_personalizados || [],
        // Campos adicionais para cálculos
        base_inss: h.base_inss,
        aliquota_inss: h.aliquota_inss,
        base_irrf: h.base_irrf,
        aliquota_irrf: h.aliquota_irrf,
        faixa_irrf: h.faixa_irrf
      };
    })) || [];
    return holeriteFormatados;
  } catch (error) {
    console.error("Erro ao buscar holerites:", error);
    throw createError({
      statusCode: 500,
      message: "Erro ao buscar holerites"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
