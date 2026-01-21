import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UiEmptyState",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    icon: { default: "document" }
  },
  setup(__props) {
    const props = __props;
    const iconPath = computed(() => {
      const icons = {
        document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      };
      return icons[props.icon];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center" }, _attrs))}><svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", unref(iconPath))}></path></svg><h3 class="text-xl font-bold text-gray-600 mb-2">${ssrInterpolate(__props.title)}</h3><p class="text-gray-500">${ssrInterpolate(__props.description)}</p>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiEmptyState.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "UiEmptyState" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HoleriteModal",
  __ssrInlineRender: true,
  props: {
    holerite: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formatarMoeda = (valor) => {
      if (!valor) return "R$ 0,00";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    };
    const formatarPeriodo = (inicio, fim) => {
      if (!inicio || !fim) return "Período não definido";
      const dataInicio = new Date(inicio).toLocaleDateString("pt-BR");
      const dataFim = new Date(fim).toLocaleDateString("pt-BR");
      return `${dataInicio} - ${dataFim}`;
    };
    const baixarHTML = async () => {
      try {
        const response = await fetch(`/api/holerites/${props.holerite.id}/html`);
        if (!response.ok) {
          throw new Error("Erro ao gerar HTML");
        }
        const blob = await response.blob();
        const url = (void 0).URL.createObjectURL(blob);
        const a = (void 0).createElement("a");
        a.href = url;
        a.download = `holerite-${props.holerite.funcionario.nome_completo.replace(/\s+/g, "-")}.html`;
        (void 0).body.appendChild(a);
        a.click();
        (void 0).URL.revokeObjectURL(url);
        (void 0).body.removeChild(a);
      } catch (error) {
        console.error("Erro ao baixar HTML:", error);
        alert("Erro ao baixar HTML do holerite");
      }
    };
    const baixarPDF = async () => {
      try {
        const response = await fetch(`/api/holerites/${props.holerite.id}/pdf`);
        if (!response.ok) {
          throw new Error("Erro ao gerar PDF");
        }
        const blob = await response.blob();
        const url = (void 0).URL.createObjectURL(blob);
        const a = (void 0).createElement("a");
        a.href = url;
        a.download = `holerite-${props.holerite.funcionario.nome_completo.replace(/\s+/g, "-")}.pdf`;
        (void 0).body.appendChild(a);
        a.click();
        (void 0).URL.revokeObjectURL(url);
        (void 0).body.removeChild(a);
      } catch (error) {
        console.error("Erro ao baixar PDF:", error);
        alert("Erro ao baixar PDF do holerite");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiButton = __nuxt_component_1;
      if (__props.holerite) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
        if (!__props.holerite.funcionario) {
          _push(`<div class="bg-red-50 p-4 rounded"><p class="text-red-600">Erro: Dados do funcionário não encontrados</p><pre class="text-xs mt-2">${ssrInterpolate(JSON.stringify(__props.holerite, null, 2))}</pre></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.funcionario) {
          _push(`<div class="bg-gray-50 rounded-xl p-4"><p class="font-semibold text-gray-800">${ssrInterpolate(__props.holerite.funcionario.nome_completo)}</p><p class="text-gray-500">${ssrInterpolate(__props.holerite.funcionario.cargo)} - ${ssrInterpolate(__props.holerite.funcionario.empresa)}</p><p class="text-sm text-gray-400 mt-1">Período: ${ssrInterpolate(formatarPeriodo(__props.holerite.periodo_inicio, __props.holerite.periodo_fim))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><h3 class="text-lg font-bold text-green-600 mb-3">Proventos</h3><div class="space-y-2"><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">Salário Base</span><span class="font-semibold">${ssrInterpolate(formatarMoeda(__props.holerite.salario_base))}</span></div>`);
        if (__props.holerite.beneficios && __props.holerite.beneficios.length > 0) {
          _push(`<div><!--[-->`);
          ssrRenderList(__props.holerite.beneficios, (beneficio) => {
            _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">${ssrInterpolate(beneficio.tipo)}</span><span class="font-semibold text-green-600">+ ${ssrInterpolate(formatarMoeda(beneficio.valor))}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.bonus) {
          _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">Bônus</span><span class="font-semibold">${ssrInterpolate(formatarMoeda(__props.holerite.bonus))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.horas_extras) {
          _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">Horas Extras</span><span class="font-semibold">${ssrInterpolate(formatarMoeda(__props.holerite.horas_extras))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-between py-2 mt-2 bg-green-50 px-3 rounded-lg"><span class="font-bold text-green-700">Total Proventos</span><span class="font-bold text-green-700">${ssrInterpolate(formatarMoeda(__props.holerite.total_proventos))}</span></div></div><div><h3 class="text-lg font-bold text-red-600 mb-3">Descontos</h3><div class="space-y-2">`);
        if (__props.holerite.inss) {
          _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">INSS</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(__props.holerite.inss))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.irrf) {
          _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">IRRF</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(__props.holerite.irrf))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.beneficios && __props.holerite.beneficios.length > 0) {
          _push(`<!--[-->`);
          ssrRenderList(__props.holerite.beneficios.filter((b) => b.desconto && b.desconto > 0), (beneficio) => {
            _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">${ssrInterpolate(beneficio.tipo)} (Desconto)</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(beneficio.desconto))}</span></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.descontos_personalizados && __props.holerite.descontos_personalizados.length > 0) {
          _push(`<div><!--[-->`);
          ssrRenderList(__props.holerite.descontos_personalizados, (desconto) => {
            _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">${ssrInterpolate(desconto.tipo)}</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(desconto.valor))}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.vale_transporte) {
          _push(`<div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-600">Vale Transporte</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(__props.holerite.vale_transporte))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.holerite.adiantamento && __props.holerite.adiantamento > 0) {
          _push(`<div class="flex justify-between py-2 border-b border-gray-100 bg-yellow-50"><span class="text-gray-600 font-semibold">💰 Adiantamento Pago</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(__props.holerite.adiantamento))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex justify-between py-2 mt-2 bg-red-50 px-3 rounded-lg"><span class="font-bold text-red-700">Total Descontos</span><span class="font-bold text-red-700">- ${ssrInterpolate(formatarMoeda(__props.holerite.total_descontos))}</span></div></div><div class="bg-primary-50 rounded-xl p-4"><div class="flex justify-between items-center"><span class="text-xl font-bold text-primary-800">Salário Líquido</span><span class="text-2xl font-bold text-primary-700">${ssrInterpolate(formatarMoeda(__props.holerite.salario_liquido))}</span></div></div><div class="flex justify-end gap-3 pt-4 border-t border-gray-200">`);
        _push(ssrRenderComponent(_component_UiButton, {
          variant: "secondary",
          onClick: ($event) => _ctx.$emit("close")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Fechar `);
            } else {
              return [
                createTextVNode(" Fechar ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiButton, {
          variant: "ghost",
          onClick: baixarHTML
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 📄 Baixar HTML `);
            } else {
              return [
                createTextVNode(" 📄 Baixar HTML ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiButton, { onClick: baixarPDF }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 📄 Baixar PDF `);
            } else {
              return [
                createTextVNode(" 📄 Baixar PDF ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-8 text-center" }, _attrs))}><p class="text-gray-500">Carregando dados do holerite...</p></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/holerites/HoleriteModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HoleriteModal = Object.assign(_sfc_main, { __name: "HoleritesHoleriteModal" });

export { HoleriteModal as H, __nuxt_component_2 as _ };
//# sourceMappingURL=HoleriteModal-Cx6Az-Fb.mjs.map
