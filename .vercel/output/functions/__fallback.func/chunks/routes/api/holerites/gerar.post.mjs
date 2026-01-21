import { d as defineEventHandler, r as readBody, c as createError } from '../../../_/nitro.mjs';
import { s as serverSupabaseServiceRole } from '../../../_/serverSupabaseServiceRole.mjs';
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

function round2(valor) {
  return Math.round(valor * 100) / 100;
}
function aplicarTabelaProgressivaMensal(baseIRRF) {
  if (baseIRRF <= 2428.8) {
    return 0;
  } else if (baseIRRF <= 3051) {
    return baseIRRF * 0.075 - 182.16;
  } else if (baseIRRF <= 4052) {
    return baseIRRF * 0.15 - 394.16;
  } else if (baseIRRF <= 5050) {
    return baseIRRF * 0.225 - 675.49;
  } else {
    return baseIRRF * 0.275 - 896;
  }
}
function normalizarDependentes(dependentes) {
  if (dependentes === null || dependentes === void 0 || dependentes === "") {
    return 0;
  }
  const num = Number(dependentes);
  if (isNaN(num) || num < 0) {
    console.warn(`\u26A0\uFE0F N\xFAmero de dependentes inv\xE1lido: ${dependentes}, usando 0`);
    return 0;
  }
  return Math.floor(num);
}
function normalizarPensao(pensao) {
  if (pensao === null || pensao === void 0 || pensao === "") {
    return 0;
  }
  const num = Number(pensao);
  if (isNaN(num) || num < 0) {
    console.warn(`\u26A0\uFE0F Pens\xE3o aliment\xEDcia inv\xE1lida: ${pensao}, usando 0`);
    return 0;
  }
  return round2(num);
}
function calcularRedutorLei15270(baseIRRF) {
  if (baseIRRF <= 5e3) {
    const impostoTabela = aplicarTabelaProgressivaMensal(baseIRRF);
    return impostoTabela;
  } else if (baseIRRF <= 7350) {
    return 978.62 - 0.133145 * baseIRRF;
  } else {
    return 0;
  }
}
function calcularBaseIRRF(salarioBruto, inss, dependentes, pensao, gastosSaude) {
  const deducaoDependentes = dependentes * 189.59;
  let base = salarioBruto - inss - deducaoDependentes - pensao;
  base = base - gastosSaude;
  const baseIRRF = Math.max(0, base);
  const deducoesAplicadas = {
    salarioBruto: round2(salarioBruto),
    inss: round2(inss),
    dependentes: {
      quantidade: dependentes,
      valorUnitario: 189.59,
      totalDeduzido: round2(deducaoDependentes)
    },
    pensaoAlimenticia: round2(pensao),
    gastosSaude: round2(gastosSaude),
    baseCalculada: round2(base),
    baseIRRF: round2(baseIRRF),
    baseNegativaAjustada: base < 0
  };
  if (base < 0) {
    console.warn(`\u26A0\uFE0F Base IRRF seria negativa (R$ ${base.toFixed(2)}), ajustada para R$ 0,00`);
  }
  return { baseIRRF: round2(baseIRRF), deducoesAplicadas };
}
const gerar_post = defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const body = await readBody(event);
    const {
      periodo_inicio,
      periodo_fim,
      funcionario_ids,
      tipo = "mensal",
      recriar = false
    } = body;
    console.log(`\u{1F3AF} Tipo de gera\xE7\xE3o: ${tipo}`);
    console.log(`\u{1F4C5} Per\xEDodo: ${periodo_inicio} a ${periodo_fim}`);
    let query = supabase.from("funcionarios").select("id, nome_completo, salario_base, numero_dependentes, pensao_alimenticia, tipo_contrato").eq("status", "ativo");
    if (funcionario_ids && funcionario_ids.length > 0) {
      query = query.in("id", funcionario_ids);
    }
    const { data: funcionarios, error: funcError } = await query;
    if (funcError) throw funcError;
    if (!funcionarios || funcionarios.length === 0) {
      return {
        success: false,
        message: "Nenhum funcion\xE1rio ativo encontrado"
      };
    }
    console.log("\u{1F465} Funcion\xE1rios encontrados:", funcionarios.length);
    const hoje = /* @__PURE__ */ new Date();
    const inicio = periodo_inicio || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
    const fim = periodo_fim || `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-15`;
    const holeritesCriados = [];
    const erros = [];
    for (const func of funcionarios) {
      try {
        console.log(`
\u{1F504} Processando funcion\xE1rio: ${func.nome_completo}`);
        const { data: existente } = await supabase.from("holerites").select("id").eq("funcionario_id", func.id).eq("periodo_inicio", inicio).eq("periodo_fim", fim).maybeSingle();
        if (existente && !recriar) {
          console.log(`\u26A0\uFE0F Holerite j\xE1 existe para ${func.nome_completo}`);
          erros.push({
            funcionario: func.nome_completo,
            erro: "Holerite j\xE1 existe para este per\xEDodo"
          });
          continue;
        }
        if (existente && recriar) {
          console.log(`\u{1F504} Recriando holerite para ${func.nome_completo}`);
          await supabase.from("holerites").delete().eq("id", existente.id);
        }
        const salarioBase = func.salario_base || 0;
        const isAdiantamento = tipo === "adiantamento";
        if (isAdiantamento) {
          const valorAdiantamento = salarioBase * 0.4;
          console.log(`\u{1F4B0} ADIANTAMENTO: 40% de R$ ${salarioBase.toFixed(2)} = R$ ${valorAdiantamento.toFixed(2)}`);
          const dadosAdiantamento = {
            funcionario_id: func.id,
            periodo_inicio: inicio,
            periodo_fim: fim,
            data_pagamento: fim,
            salario_base: valorAdiantamento,
            // Todos os outros campos zerados
            bonus: 0,
            horas_extras: 0,
            adicional_noturno: 0,
            adicional_periculosidade: 0,
            adicional_insalubridade: 0,
            comissoes: 0,
            inss: 0,
            base_inss: 0,
            aliquota_inss: 0,
            irrf: 0,
            base_irrf: 0,
            aliquota_irrf: 0,
            vale_transporte: 0,
            cesta_basica_desconto: 0,
            plano_saude: 0,
            plano_odontologico: 0,
            adiantamento: 0,
            faltas: 0,
            outros_descontos: 0,
            beneficios: [],
            descontos_personalizados: [],
            status: "gerado",
            observacoes: `Adiantamento salarial (40%) - Sal\xE1rio base: R$ ${salarioBase.toFixed(2)}`
          };
          const { data: holerite, error: holeriteError } = await supabase.from("holerites").insert(dadosAdiantamento).select().single();
          if (holeriteError) throw holeriteError;
          await supabase.from("holerites").update({
            total_proventos: valorAdiantamento,
            total_descontos: 0,
            salario_liquido: valorAdiantamento
          }).eq("id", holerite.id);
          console.log(`\u2705 Adiantamento criado: R$ ${valorAdiantamento.toFixed(2)}`);
          holeritesCriados.push({
            funcionario: func.nome_completo,
            holerite_id: holerite.id
          });
        } else {
          const mesAno = inicio.substring(0, 7);
          const { data: adiantamentos } = await supabase.from("holerites").select("salario_base, observacoes").eq("funcionario_id", func.id).gte("periodo_inicio", mesAno + "-01").lt("periodo_fim", mesAno + "-16");
          let totalAdiantamentos = 0;
          if (adiantamentos && adiantamentos.length > 0) {
            totalAdiantamentos = adiantamentos.reduce((sum, h) => {
              var _a;
              if ((_a = h.observacoes) == null ? void 0 : _a.includes("Adiantamento")) {
                return sum + (h.salario_base || 0);
              }
              return sum;
            }, 0);
            console.log(`\u{1F4B8} Adiantamentos do m\xEAs: R$ ${totalAdiantamentos.toFixed(2)}`);
          }
          let inss = 0;
          let aliquotaEfetiva = 0;
          const tipoContrato = func.tipo_contrato || "CLT";
          if (tipoContrato === "PJ") {
            inss = 0;
            aliquotaEfetiva = 0;
            console.log(`\u{1F4BC} Funcion\xE1rio PJ - Sem desconto de INSS`);
          } else {
            if (salarioBase <= 1518) {
              inss = salarioBase * 0.075;
              aliquotaEfetiva = 7.5;
            } else if (salarioBase <= 2793.88) {
              inss = 1518 * 0.075 + (salarioBase - 1518) * 0.09;
              aliquotaEfetiva = inss / salarioBase * 100;
            } else if (salarioBase <= 4190.83) {
              inss = 1518 * 0.075 + (2793.88 - 1518) * 0.09 + (salarioBase - 2793.88) * 0.12;
              aliquotaEfetiva = inss / salarioBase * 100;
            } else if (salarioBase <= 8157.41) {
              inss = 1518 * 0.075 + (2793.88 - 1518) * 0.09 + (4190.83 - 2793.88) * 0.12 + (salarioBase - 4190.83) * 0.14;
              aliquotaEfetiva = inss / salarioBase * 100;
            } else {
              inss = 1518 * 0.075 + (2793.88 - 1518) * 0.09 + (4190.83 - 2793.88) * 0.12 + (8157.41 - 4190.83) * 0.14;
              aliquotaEfetiva = inss / salarioBase * 100;
            }
            inss = Math.round(inss * 100) / 100;
            aliquotaEfetiva = Math.round(aliquotaEfetiva * 100) / 100;
          }
          let irrf = 0;
          let baseIRRF = 0;
          let aliquotaIRRF = 0;
          let deducoesAplicadas = null;
          if (tipoContrato === "PJ") {
            irrf = 0;
            baseIRRF = 0;
            aliquotaIRRF = 0;
            console.log(`\u{1F4BC} Funcion\xE1rio PJ - Sem desconto de IRRF`);
          } else {
            const numeroDependentes = normalizarDependentes(func.numero_dependentes);
            const pensaoAlimenticia = normalizarPensao(func.pensao_alimenticia);
            const gastosSaude = 0;
            const calculoIRRF = calcularBaseIRRF(
              salarioBase,
              inss,
              numeroDependentes,
              pensaoAlimenticia,
              gastosSaude
            );
            baseIRRF = calculoIRRF.baseIRRF;
            deducoesAplicadas = calculoIRRF.deducoesAplicadas;
            const irrfTabelaNormal = aplicarTabelaProgressivaMensal(baseIRRF);
            const redutorLei15270 = calcularRedutorLei15270(baseIRRF);
            irrf = Math.max(0, round2(irrfTabelaNormal - redutorLei15270));
            aliquotaIRRF = baseIRRF > 0 ? round2(irrf / baseIRRF * 100) : 0;
          }
          let faixaIRRF = "";
          if (tipoContrato === "PJ") {
            faixaIRRF = "pj_sem_irrf";
          } else if (baseIRRF <= 5e3) {
            faixaIRRF = "isencao";
          } else if (baseIRRF <= 7350) {
            faixaIRRF = "reducao_gradual";
          } else {
            faixaIRRF = "sem_reducao";
          }
          console.log(`\u{1F4CA} C\xC1LCULOS MENSAIS:`);
          console.log(`   Tipo Contrato: ${tipoContrato}`);
          console.log(`   Sal\xE1rio Base: R$ ${salarioBase.toFixed(2)}`);
          console.log(`   INSS: R$ ${inss.toFixed(2)} (${aliquotaEfetiva}%)`);
          if (tipoContrato !== "PJ" && deducoesAplicadas) {
            const numeroDependentes = normalizarDependentes(func.numero_dependentes);
            const pensaoAlimenticia = normalizarPensao(func.pensao_alimenticia);
            console.log(`   Dependentes: ${numeroDependentes} \xD7 R$ 189,59 = R$ ${deducoesAplicadas.dependentes.totalDeduzido.toFixed(2)}`);
            console.log(`   Pens\xE3o Aliment\xEDcia: R$ ${pensaoAlimenticia.toFixed(2)}`);
            console.log(`   Base IRRF: R$ ${baseIRRF.toFixed(2)}`);
            if (deducoesAplicadas.baseNegativaAjustada) {
              console.log(`   \u26A0\uFE0F Base ajustada (era negativa): R$ ${deducoesAplicadas.baseCalculada.toFixed(2)} \u2192 R$ ${baseIRRF.toFixed(2)}`);
            }
            const irrfTabelaNormal = aplicarTabelaProgressivaMensal(baseIRRF);
            const redutorLei15270 = calcularRedutorLei15270(baseIRRF);
            console.log(`   IRRF Tabela Normal: R$ ${irrfTabelaNormal.toFixed(2)}`);
            console.log(`   Redutor Lei 15.270: R$ ${redutorLei15270.toFixed(2)}`);
          }
          console.log(`   IRRF Final: R$ ${irrf.toFixed(2)} (${aliquotaIRRF}%)`);
          console.log(`   Faixa: ${faixaIRRF}`);
          console.log(`   Adiantamentos: R$ ${totalAdiantamentos.toFixed(2)}`);
          if (tipoContrato === "PJ") {
            console.log(`   \u{1F4BC} PJ: Sal\xE1rio integral sem descontos obrigat\xF3rios`);
          }
          const dadosMensal = {
            funcionario_id: func.id,
            periodo_inicio: inicio,
            periodo_fim: fim,
            data_pagamento: fim,
            salario_base: salarioBase,
            bonus: 0,
            horas_extras: 0,
            adicional_noturno: 0,
            adicional_periculosidade: 0,
            adicional_insalubridade: 0,
            comissoes: 0,
            inss,
            base_inss: salarioBase,
            aliquota_inss: aliquotaEfetiva,
            irrf,
            base_irrf: baseIRRF,
            aliquota_irrf: aliquotaIRRF,
            vale_transporte: 0,
            cesta_basica_desconto: 0,
            plano_saude: 0,
            plano_odontologico: 0,
            adiantamento: totalAdiantamentos,
            faltas: 0,
            outros_descontos: 0,
            beneficios: [],
            descontos_personalizados: [],
            status: "gerado",
            observacoes: totalAdiantamentos > 0 ? `Folha mensal - Desconto de adiantamento: R$ ${totalAdiantamentos.toFixed(2)}` : "Folha mensal"
          };
          const { data: holerite, error: holeriteError } = await supabase.from("holerites").insert(dadosMensal).select().single();
          if (holeriteError) throw holeriteError;
          const totalProventos = salarioBase;
          const totalDescontos = inss + irrf + totalAdiantamentos;
          const salarioLiquido = totalProventos - totalDescontos;
          await supabase.from("holerites").update({
            total_proventos: totalProventos,
            total_descontos: totalDescontos,
            salario_liquido: salarioLiquido
          }).eq("id", holerite.id);
          console.log(`\u2705 Folha mensal criada:`);
          console.log(`   Proventos: R$ ${totalProventos.toFixed(2)}`);
          console.log(`   Descontos: R$ ${totalDescontos.toFixed(2)}`);
          console.log(`   L\xEDquido: R$ ${salarioLiquido.toFixed(2)}`);
          holeritesCriados.push({
            funcionario: func.nome_completo,
            holerite_id: holerite.id
          });
        }
      } catch (error) {
        console.error(`\u274C Erro ao gerar holerite para ${func.nome_completo}:`, error.message);
        erros.push({
          funcionario: func.nome_completo,
          erro: error.message
        });
      }
    }
    return {
      success: true,
      message: `${holeritesCriados.length} holerite(s) gerado(s) com sucesso`,
      total_gerados: holeritesCriados.length,
      total_erros: erros.length,
      holerites: holeritesCriados,
      erros: erros.length > 0 ? erros : void 0
    };
  } catch (error) {
    console.error("Erro ao gerar holerites:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Erro ao gerar holerites"
    });
  }
});

export { gerar_post as default };
//# sourceMappingURL=gerar.post.mjs.map
