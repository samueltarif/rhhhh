import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2, H as HoleriteModal } from './HoleriteModal-Cx6Az-Fb.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { a as useAuth } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@supabase/ssr';

const useHolerites = () => {
  const isFeriado = (data) => {
    const feriados = [
      // Feriados fixos
      "01-01",
      // Ano Novo
      "04-21",
      // Tiradentes
      "05-01",
      // Dia do Trabalhador
      "09-07",
      // Independência do Brasil
      "10-12",
      // Nossa Senhora Aparecida
      "11-02",
      // Finados
      "11-15",
      // Proclamação da República
      "12-25"
      // Natal
      // Adicione outros feriados fixos conforme necessário
    ];
    const meseDia = data.toISOString().slice(5, 10);
    return feriados.includes(meseDia);
  };
  const isFimDeSemana = (data) => {
    const diaSemana = data.getDay();
    return diaSemana === 0 || diaSemana === 6;
  };
  const isDiaUtil = (data) => {
    return !isFimDeSemana(data) && !isFeriado(data);
  };
  const obterUltimoDiaUtil = (data) => {
    const novaData = new Date(data);
    while (!isDiaUtil(novaData)) {
      novaData.setDate(novaData.getDate() - 1);
    }
    return novaData;
  };
  const calcularDataDisponibilizacaoHolerite20 = (ano, mes) => {
    const dia20 = new Date(ano, mes - 1, 20);
    if (isDiaUtil(dia20)) {
      const dataDisponibilizacao = new Date(dia20);
      dataDisponibilizacao.setDate(dataDisponibilizacao.getDate() - 2);
      if (!isDiaUtil(dataDisponibilizacao)) {
        return obterUltimoDiaUtil(dataDisponibilizacao);
      }
      return dataDisponibilizacao;
    } else {
      const ultimoDiaUtil = obterUltimoDiaUtil(dia20);
      const dataDisponibilizacao = new Date(ultimoDiaUtil);
      dataDisponibilizacao.setDate(dataDisponibilizacao.getDate() - 2);
      if (!isDiaUtil(dataDisponibilizacao)) {
        return obterUltimoDiaUtil(dataDisponibilizacao);
      }
      return dataDisponibilizacao;
    }
  };
  const deveEstarDisponivelHolerite20 = (ano, mes) => {
    const hoje = /* @__PURE__ */ new Date();
    const dataDisponibilizacao = calcularDataDisponibilizacaoHolerite20(ano, mes);
    return hoje >= dataDisponibilizacao;
  };
  const calcularProximasDisponibilizacoes = () => {
    const hoje = /* @__PURE__ */ new Date();
    const proximasDisponibilizacoes = [];
    for (let i = 0; i < 6; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;
      proximasDisponibilizacoes.push({
        tipo: "inicio_mes",
        mes,
        ano,
        dataDisponibilizacao: new Date(ano, mes - 1, 1),
        // Placeholder - será manual
        descricao: `Holerite ${mes.toString().padStart(2, "0")}/${ano} - 1ª Quinzena (Manual)`
      });
      const dataHolerite20 = calcularDataDisponibilizacaoHolerite20(ano, mes);
      proximasDisponibilizacoes.push({
        tipo: "dia_20",
        mes,
        ano,
        dataDisponibilizacao: dataHolerite20,
        descricao: `Holerite ${mes.toString().padStart(2, "0")}/${ano} - 2ª Quinzena (Automático)`
      });
    }
    return proximasDisponibilizacoes.sort(
      (a, b) => a.dataDisponibilizacao.getTime() - b.dataDisponibilizacao.getTime()
    );
  };
  const formatarData = (data) => {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const formatarDataHora = (data) => {
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const calcularPeriodoQuinzenal = (ano, mes, quinzena) => {
    if (quinzena === 1) {
      return {
        inicio: new Date(ano, mes - 1, 1),
        fim: new Date(ano, mes - 1, 15),
        descricao: `1ª Quinzena - 01 a 15/${mes.toString().padStart(2, "0")}/${ano}`
      };
    } else {
      const ultimoDia = new Date(ano, mes, 0).getDate();
      return {
        inicio: new Date(ano, mes - 1, 16),
        fim: new Date(ano, mes - 1, ultimoDia),
        descricao: `2ª Quinzena - 16 a ${ultimoDia}/${mes.toString().padStart(2, "0")}/${ano}`
      };
    }
  };
  const isSalarioQuinzenal = (funcionario) => {
    return funcionario?.tipo_salario === "quinzenal";
  };
  const calcularValorQuinzenal = (salarioMensal) => {
    return salarioMensal / 2;
  };
  return {
    isFeriado,
    isFimDeSemana,
    isDiaUtil,
    obterUltimoDiaUtil,
    calcularDataDisponibilizacaoHolerite20,
    deveEstarDisponivelHolerite20,
    calcularProximasDisponibilizacoes,
    formatarData,
    formatarDataHora,
    calcularPeriodoQuinzenal,
    isSalarioQuinzenal,
    calcularValorQuinzenal
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HoleriteCard",
  __ssrInlineRender: true,
  props: {
    holerite: {}
  },
  emits: ["view", "download"],
  setup(__props) {
    const props = __props;
    const { formatarData } = useHolerites();
    const isDisponivel = computed(() => {
      return true;
    });
    const formatarMoeda = (valor) => {
      return valor?.toFixed(2).replace(".", ",") || "0,00";
    };
    const getStatusColor = (status) => {
      const colors = {
        "Pago": {
          bg: "bg-green-100",
          badge: "bg-green-100 text-green-800"
        },
        "Pendente": {
          bg: "bg-yellow-100",
          badge: "bg-yellow-100 text-yellow-800"
        },
        "Programado": {
          bg: "bg-blue-100",
          badge: "bg-blue-100 text-blue-800"
        },
        "Cancelado": {
          bg: "bg-red-100",
          badge: "bg-red-100 text-red-800"
        }
      };
      return colors[status || "Pendente"] || colors["Pendente"];
    };
    const isAdiantamento = computed(() => {
      return props.holerite?.quinzena === 1 || props.holerite?.tipo?.toLowerCase().includes("adiantamento") || props.holerite?.referencia?.toLowerCase().includes("adiantamento");
    });
    const getTipoHoleriteStyle = () => {
      if (isAdiantamento.value) {
        return {
          card: "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200",
          icon: "bg-gradient-to-br from-orange-400 to-yellow-500 text-white shadow-lg",
          badge: "bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-sm"
        };
      } else {
        return {
          card: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
          icon: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg",
          badge: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm"
        };
      }
    };
    const getTipoHoleriteIcon = () => {
      return isAdiantamento.value ? "💰" : "📊";
    };
    const getTipoHoleriteLabel = () => {
      return isAdiantamento.value ? "Adiantamento" : "Folha Mensal";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiButton = __nuxt_component_1;
      if (__props.holerite) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: [
            "border rounded-xl p-6 hover:shadow-lg transition-shadow",
            getTipoHoleriteStyle().card
          ]
        }, _attrs))}><div class="flex items-start justify-between"><div class="flex-1"><div class="flex items-center gap-3 mb-3"><div class="${ssrRenderClass([
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
          getTipoHoleriteStyle().icon
        ])}">${ssrInterpolate(getTipoHoleriteIcon())}</div><div><div class="flex items-center gap-2 mb-1"><h3 class="text-lg font-bold text-gray-800">${ssrInterpolate(__props.holerite.referencia)}</h3><span class="${ssrRenderClass([
          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
          getTipoHoleriteStyle().badge
        ])}">${ssrInterpolate(getTipoHoleriteLabel())}</span></div><div class="flex items-center gap-2 text-sm text-gray-500"><span>${ssrInterpolate(__props.holerite.competencia)}</span>`);
        if (__props.holerite.quinzena) {
          _push(`<span class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">${ssrInterpolate(__props.holerite.quinzena)}ª Quinzena </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass([
          "px-2 py-0.5 rounded-full text-xs font-medium",
          getStatusColor(__props.holerite.status).badge
        ])}">${ssrInterpolate(__props.holerite.status)}</span></div></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"><div><div class="text-xs text-gray-500 mb-1">Proventos</div><div class="text-sm font-semibold text-green-600"> R$ ${ssrInterpolate(formatarMoeda(__props.holerite.totalProventos))}</div></div><div><div class="text-xs text-gray-500 mb-1">Descontos</div><div class="text-sm font-semibold text-red-600"> R$ ${ssrInterpolate(formatarMoeda(__props.holerite.totalDescontos))}</div></div><div><div class="text-xs text-gray-500 mb-1">Líquido</div><div class="text-lg font-bold text-blue-600"> R$ ${ssrInterpolate(formatarMoeda(__props.holerite.liquido))}</div></div>`);
        if (__props.holerite.dataDisponibilizacao) {
          _push(`<div><div class="text-xs text-gray-500 mb-1">Disponível em</div><div class="text-sm font-medium text-gray-700">${ssrInterpolate(__props.holerite.dataDisponibilizacao ? unref(formatarData)(__props.holerite.dataDisponibilizacao) : "N/A")}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (__props.holerite.periodoInicio && __props.holerite.periodoFim) {
          _push(`<div class="mt-3 p-3 bg-blue-50 rounded-lg"><div class="text-xs text-blue-700 font-medium mb-1">📅 Período de Referência</div><div class="text-sm text-blue-800">${ssrInterpolate(__props.holerite.periodoInicio ? unref(formatarData)(__props.holerite.periodoInicio) : "N/A")} até ${ssrInterpolate(__props.holerite.periodoFim ? unref(formatarData)(__props.holerite.periodoFim) : "N/A")}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-2 ml-4">`);
        _push(ssrRenderComponent(_component_UiButton, {
          variant: "primary",
          size: "sm",
          onClick: ($event) => _ctx.$emit("view", __props.holerite),
          disabled: !unref(isDisponivel)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 👁️ Visualizar `);
            } else {
              return [
                createTextVNode(" 👁️ Visualizar ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiButton, {
          variant: "secondary",
          size: "sm",
          onClick: ($event) => _ctx.$emit("download", __props.holerite),
          disabled: !unref(isDisponivel)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 📥 Baixar PDF `);
            } else {
              return [
                createTextVNode(" 📥 Baixar PDF ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/holerites/HoleriteCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HoleriteCard = Object.assign(_sfc_main$1, { __name: "HoleritesHoleriteCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "holerites",
  __ssrInlineRender: true,
  async setup(__props) {
    const { user } = useAuth();
    const {
      getTipoHolerite
    } = useHolerites();
    const filtroMes = ref("");
    const filtroAno = ref("");
    const filtroTipo = ref("");
    const holeriteVisualizado = ref(null);
    const holerites = ref([]);
    const carregando = ref(true);
    const temSalarioQuinzenal = computed(() => {
      return user.value?.tipo_salario === "quinzenal";
    });
    const mesesOptions = [
      { value: "01", label: "Janeiro" },
      { value: "02", label: "Fevereiro" },
      { value: "03", label: "Março" },
      { value: "04", label: "Abril" },
      { value: "05", label: "Maio" },
      { value: "06", label: "Junho" },
      { value: "07", label: "Julho" },
      { value: "08", label: "Agosto" },
      { value: "09", label: "Setembro" },
      { value: "10", label: "Outubro" },
      { value: "11", label: "Novembro" },
      { value: "12", label: "Dezembro" }
    ];
    const anosOptions = [
      { value: "2026", label: "2026" },
      { value: "2025", label: "2025" },
      { value: "2024", label: "2024" }
    ];
    const holeritesFiltrados = computed(() => {
      console.log("🔍 Filtrando holerites. Total:", holerites.value.length);
      console.log("🔍 Filtros ativos:", { mes: filtroMes.value, ano: filtroAno.value, tipo: filtroTipo.value });
      const filtrados = holerites.value.filter((h) => {
        if (filtroMes.value && h.mes !== filtroMes.value) return false;
        if (filtroAno.value && h.ano !== filtroAno.value) return false;
        if (filtroTipo.value) {
          const tipoHolerite = getTipoHolerite(h);
          if (filtroTipo.value === "adiantamento" && tipoHolerite !== "adiantamento") return false;
          if (filtroTipo.value === "folha_mensal" && tipoHolerite !== "folha_mensal") return false;
        }
        return true;
      });
      console.log("✅ Holerites filtrados:", filtrados.length);
      return filtrados;
    });
    const limparFiltros = () => {
      filtroMes.value = "";
      filtroAno.value = "";
      filtroTipo.value = "";
    };
    const visualizarHolerite = async (holerite) => {
      let nomeEmpresa = "Empresa";
      try {
        if (user.value) {
          const funcionarioCompleto = await $fetch(`/api/funcionarios/${user.value.id}`);
          if (funcionarioCompleto.empresa_id) {
            const empresaResponse = await $fetch(`/api/empresas/${funcionarioCompleto.empresa_id}`);
            const empresa = empresaResponse.data || empresaResponse;
            nomeEmpresa = empresa.nome_fantasia || empresa.nome || "Empresa";
          }
        }
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      }
      holeriteVisualizado.value = {
        ...holerite,
        funcionario: {
          nome_completo: user.value?.nome || "",
          cargo: user.value?.cargo || "Não definido",
          empresa: nomeEmpresa
        },
        // Garantir que as datas e valores estejam no formato correto
        periodo_inicio: holerite.periodoInicio,
        periodo_fim: holerite.periodoFim,
        salario_base: holerite.salarioBase,
        salario_liquido: holerite.liquido,
        // Corrigir o campo
        total_proventos: holerite.totalProventos,
        total_descontos: holerite.totalDescontos
      };
    };
    const baixarPDF = (holerite) => {
      (void 0).open(`/api/holerites/${holerite.id}/pdf`, "_blank");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiButton = __nuxt_component_1;
      const _component_UiEmptyState = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="bg-white rounded-xl border border-gray-200 p-6 mb-6"><h3 class="text-lg font-semibold text-gray-900 mb-4">🔍 Filtrar Holerites</h3><div class="flex flex-col sm:flex-row gap-4"><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1">Mês</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filtroMes)) ? ssrLooseContain(unref(filtroMes), "") : ssrLooseEqual(unref(filtroMes), "")) ? " selected" : ""}>Todos os meses</option><!--[-->`);
      ssrRenderList(mesesOptions, (mes) => {
        _push(`<option${ssrRenderAttr("value", mes.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(filtroMes)) ? ssrLooseContain(unref(filtroMes), mes.value) : ssrLooseEqual(unref(filtroMes), mes.value)) ? " selected" : ""}>${ssrInterpolate(mes.label)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1">Ano</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filtroAno)) ? ssrLooseContain(unref(filtroAno), "") : ssrLooseEqual(unref(filtroAno), "")) ? " selected" : ""}>Todos os anos</option><!--[-->`);
      ssrRenderList(anosOptions, (ano) => {
        _push(`<option${ssrRenderAttr("value", ano.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(filtroAno)) ? ssrLooseContain(unref(filtroAno), ano.value) : ssrLooseEqual(unref(filtroAno), ano.value)) ? " selected" : ""}>${ssrInterpolate(ano.label)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filtroTipo)) ? ssrLooseContain(unref(filtroTipo), "") : ssrLooseEqual(unref(filtroTipo), "")) ? " selected" : ""}>Todos os tipos</option><option value="adiantamento"${ssrIncludeBooleanAttr(Array.isArray(unref(filtroTipo)) ? ssrLooseContain(unref(filtroTipo), "adiantamento") : ssrLooseEqual(unref(filtroTipo), "adiantamento")) ? " selected" : ""}>💰 Adiantamento</option><option value="folha_mensal"${ssrIncludeBooleanAttr(Array.isArray(unref(filtroTipo)) ? ssrLooseContain(unref(filtroTipo), "folha_mensal") : ssrLooseEqual(unref(filtroTipo), "folha_mensal")) ? " selected" : ""}>📊 Folha Mensal</option></select></div><div class="flex items-end">`);
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "secondary",
        onClick: limparFiltros
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Limpar`);
          } else {
            return [
              createTextVNode("Limpar")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
      if (unref(temSalarioQuinzenal)) {
        _push(`<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"><div class="flex items-start gap-3"><span class="text-2xl">🤖</span><div><h3 class="font-semibold text-blue-800 mb-2">Holerites Automáticos</h3><div class="text-sm text-blue-700 space-y-1"><p>• <strong>2ª Quinzena:</strong> Disponibilizado automaticamente 2 dias antes do dia 20</p><p>• <strong>1ª Quinzena:</strong> Liberado manualmente pelo RH no início do mês</p><p>• <strong>Fins de semana/Feriados:</strong> Antecipado para o último dia útil anterior</p></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(user)) {
        _push(`<div class="text-center py-12"><p class="text-red-600">❌ Erro: Usuário não autenticado. Faça login novamente.</p></div>`);
      } else if (unref(carregando)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div><p class="mt-4 text-gray-600">Carregando holerites...</p></div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(holeritesFiltrados), (holerite) => {
          _push(ssrRenderComponent(HoleriteCard, {
            key: holerite.id,
            holerite,
            onView: visualizarHolerite,
            onDownload: baixarPDF
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (unref(holeritesFiltrados).length === 0) {
          _push(ssrRenderComponent(_component_UiEmptyState, {
            title: "Nenhum holerite encontrado",
            description: "Tente ajustar os filtros ou aguarde a geração do próximo holerite."
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(ssrRenderComponent(HoleriteModal, {
        holerite: unref(holeriteVisualizado),
        "user-name": unref(user)?.nome || "",
        "user-cargo": unref(user)?.cargo || "",
        "user-departamento": unref(user)?.departamento || "",
        onClose: ($event) => holeriteVisualizado.value = null,
        onDownload: baixarPDF
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/holerites.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=holerites-jRN-teXj.mjs.map
