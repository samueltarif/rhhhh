import { defineComponent, ref, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, computed, resolveDynamicComponent, mergeProps, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrRenderClass, ssrRenderSlot, ssrRenderAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './UiBadge-BLIbLGMQ.mjs';
import { _ as __nuxt_component_2$1 } from './UiCard-Co7bHBSC.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BWubxknC.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DashboardCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    to: {},
    color: { default: "blue" },
    iconPath: { default: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
  },
  setup(__props) {
    const props = __props;
    const colorMap = {
      blue: { bg: "bg-blue-100", icon: "text-blue-600", hover: "group-hover:bg-blue-200" },
      green: { bg: "bg-green-100", icon: "text-green-600", hover: "group-hover:bg-green-200" },
      purple: { bg: "bg-purple-100", icon: "text-purple-600", hover: "group-hover:bg-purple-200" },
      orange: { bg: "bg-orange-100", icon: "text-orange-600", hover: "group-hover:bg-orange-200" }
    };
    const iconBgClass = computed(() => colorMap[props.color].bg);
    const iconColorClass = computed(() => colorMap[props.color].icon);
    const groupHoverClass = computed(() => colorMap[props.color].hover);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.to ? "NuxtLink" : "div"), mergeProps({
        to: __props.to,
        class: [
          "bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all",
          __props.to ? "hover:shadow-md hover:border-primary-200 group" : ""
        ]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([[unref(iconBgClass), __props.to ? unref(groupHoverClass) : ""], "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors"])}"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
              _push2(`<svg class="${ssrRenderClass([unref(iconColorClass), "w-7 h-7"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", __props.iconPath)}${_scopeId}></path></svg>`);
            }, _push2, _parent2, _scopeId);
            _push2(`</div><h3 class="text-xl font-bold text-gray-800 mb-2"${_scopeId}>${ssrInterpolate(__props.title)}</h3><p class="text-gray-500"${_scopeId}>${ssrInterpolate(__props.description)}</p>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("div", {
                class: ["w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors", [unref(iconBgClass), __props.to ? unref(groupHoverClass) : ""]]
              }, [
                renderSlot(_ctx.$slots, "icon", {}, () => [
                  (openBlock(), createBlock("svg", {
                    class: ["w-7 h-7", unref(iconColorClass)],
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: __props.iconPath
                    }, null, 8, ["d"])
                  ], 2))
                ])
              ], 2),
              createVNode("h3", { class: "text-xl font-bold text-gray-800 mb-2" }, toDisplayString(__props.title), 1),
              createVNode("p", { class: "text-gray-500" }, toDisplayString(__props.description), 1),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "DashboardCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DashboardStatCard",
  __ssrInlineRender: true,
  props: {
    to: {},
    value: {},
    label: {},
    color: {},
    iconPath: {}
  },
  setup(__props) {
    const props = __props;
    const gradientMap = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      green: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      orange: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
    };
    const gradientClass = computed(() => gradientMap[props.color]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: __props.to,
        class: [
          "rounded-2xl p-5 text-white transition-all",
          unref(gradientClass)
        ]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-10 h-10 mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", __props.iconPath)}${_scopeId}></path></svg><p class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(__props.value)}</p><p class="text-white/80"${_scopeId}>${ssrInterpolate(__props.label)}</p>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-10 h-10 mb-3 opacity-90",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: __props.iconPath
                }, null, 8, ["d"])
              ])),
              createVNode("p", { class: "text-3xl font-bold" }, toDisplayString(__props.value), 1),
              createVNode("p", { class: "text-white/80" }, toDisplayString(__props.label), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardStatCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "DashboardStatCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, isAdmin } = useAuth();
    const stats = ref({
      totalFuncionarios: 0,
      totalDepartamentos: 0,
      folhaMensal: 0,
      totalAniversariantes: 0
    });
    const aniversariantes = ref([]);
    const loading = ref(true);
    const dadosCompletos = ref(null);
    const empresaUsuario = ref(null);
    const cargosMap = ref({});
    const departamentosMap = ref({});
    const obterSaudacao = () => {
      const agora = /* @__PURE__ */ new Date();
      const horarioBrasilia = new Date(agora.getTime() - 3 * 60 * 60 * 1e3);
      const hora = horarioBrasilia.getHours();
      if (hora >= 5 && hora < 12) {
        return "Bom dia";
      } else if (hora >= 12 && hora < 18) {
        return "Boa tarde";
      } else {
        return "Boa noite";
      }
    };
    const obterNomeCargo = (id) => {
      const idStr = id?.toString();
      return cargosMap.value[idStr] || idStr || "Não informado";
    };
    const obterNomeDepartamento = (id) => {
      const idStr = id?.toString();
      return departamentosMap.value[idStr] || idStr || "Não informado";
    };
    const formatarMoeda = (valor) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardCard = __nuxt_component_0;
      const _component_UiBadge = __nuxt_component_2;
      const _component_UiCard = __nuxt_component_2$1;
      const _component_DashboardStatCard = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-8"><h1 class="text-3xl lg:text-4xl font-bold text-gray-800">${ssrInterpolate(obterSaudacao())} ${ssrInterpolate(unref(user)?.nome?.split(" ")[0])}! </h1><p class="text-lg text-gray-500 mt-2"> Bem-vindo ao Sistema de RH. Aqui você encontra tudo sobre sua vida profissional. </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">`);
      _push(ssrRenderComponent(_component_DashboardCard, {
        to: "/meus-dados",
        title: "Meus Dados",
        description: "Veja e atualize suas informações pessoais",
        color: "blue",
        "icon-path": "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      }, null, _parent));
      if (!unref(isAdmin)) {
        _push(ssrRenderComponent(_component_DashboardCard, {
          to: "/holerites",
          title: "Meus Holerites",
          description: "Acesse seus contracheques e baixe em PDF",
          color: "green",
          "icon-path": "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_DashboardCard, {
        title: unref(empresaUsuario) ? unref(empresaUsuario).nome_fantasia || unref(empresaUsuario).nome : "Minha Empresa",
        description: unref(empresaUsuario) ? `CNPJ: ${unref(empresaUsuario).cnpj || "Não informado"}` : "Aguardando cadastro",
        color: "purple",
        "icon-path": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UiBadge, {
              variant: unref(empresaUsuario) ? "success" : "warning",
              class: "mt-3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(empresaUsuario) ? "✓ Vinculado" : "⏳ Pendente")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(empresaUsuario) ? "✓ Vinculado" : "⏳ Pendente"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UiBadge, {
                variant: unref(empresaUsuario) ? "success" : "warning",
                class: "mt-3"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(empresaUsuario) ? "✓ Vinculado" : "⏳ Pendente"), 1)
                ]),
                _: 1
              }, 8, ["variant"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UiCard, {
        title: "Suas Informações",
        icon: "ℹ️",
        class: "mb-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}><div class="space-y-4"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>Nome Completo</p><p class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(dadosCompletos)?.nome_completo || unref(user)?.nome)}</p></div><div${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>Cargo</p><p class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(obterNomeCargo(unref(dadosCompletos)?.cargo_id))}</p></div>`);
            if (unref(empresaUsuario)) {
              _push2(`<div${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>Empresa</p><p class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(empresaUsuario).nome_fantasia || unref(empresaUsuario).nome)}</p><p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(unref(empresaUsuario).nome)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-4"${_scopeId}><div${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>Departamento</p><p class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(obterNomeDepartamento(unref(dadosCompletos)?.departamento_id))}</p></div><div${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>Email</p><p class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(dadosCompletos)?.email || unref(user)?.email)}</p></div>`);
            if (unref(empresaUsuario)?.cnpj) {
              _push2(`<div${_scopeId}><p class="text-sm text-gray-500 mb-1"${_scopeId}>CNPJ da Empresa</p><p class="text-lg font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(empresaUsuario).cnpj)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, "Nome Completo"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(unref(dadosCompletos)?.nome_completo || unref(user)?.nome), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, "Cargo"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(obterNomeCargo(unref(dadosCompletos)?.cargo_id)), 1)
                  ]),
                  unref(empresaUsuario) ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, "Empresa"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(unref(empresaUsuario).nome_fantasia || unref(empresaUsuario).nome), 1),
                    createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(unref(empresaUsuario).nome), 1)
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, "Departamento"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(obterNomeDepartamento(unref(dadosCompletos)?.departamento_id)), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, "Email"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(unref(dadosCompletos)?.email || unref(user)?.email), 1)
                  ]),
                  unref(empresaUsuario)?.cnpj ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("p", { class: "text-sm text-gray-500 mb-1" }, "CNPJ da Empresa"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800" }, toDisplayString(unref(empresaUsuario).cnpj), 1)
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(isAdmin)) {
        _push(`<!--[--><h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"> 🛡️ Área do Administrador </h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">`);
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          to: "/admin/funcionarios",
          value: unref(loading) ? "..." : unref(stats).totalFuncionarios.toString(),
          label: "Funcionários",
          color: "blue",
          "icon-path": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          to: "/admin/departamentos",
          value: unref(loading) ? "..." : unref(stats).totalDepartamentos.toString(),
          label: "Departamentos",
          color: "purple",
          "icon-path": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          to: "/admin/holerites",
          value: unref(loading) ? "..." : formatarMoeda(unref(stats).folhaMensal),
          label: "Folha Mensal",
          color: "green",
          "icon-path": "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        }, null, _parent));
        _push(`<div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white"><svg class="w-10 h-10 mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path></svg><p class="text-3xl font-bold">${ssrInterpolate(unref(loading) ? "..." : unref(stats).totalAniversariantes)}</p><p class="text-white/80">Aniversariantes</p></div></div>`);
        _push(ssrRenderComponent(_component_UiCard, { title: "🎂 Aniversariantes do Mês" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(loading)) {
                _push2(`<div class="text-center py-8"${_scopeId}><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"${_scopeId}></div><p class="mt-2 text-gray-600"${_scopeId}>Carregando...</p></div>`);
              } else if (unref(aniversariantes).length === 0) {
                _push2(`<div class="text-center py-8 text-gray-500"${_scopeId}> Nenhum aniversariante este mês </div>`);
              } else {
                _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
                ssrRenderList(unref(aniversariantes), (aniversariante) => {
                  _push2(`<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"${_scopeId}><div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"${_scopeId}><span class="text-orange-600 font-bold text-lg"${_scopeId}>${ssrInterpolate(aniversariante.dia)}</span></div><div class="flex-1"${_scopeId}><h4 class="font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(aniversariante.nome_completo)}</h4><p class="text-sm text-gray-600"${_scopeId}>${ssrInterpolate(aniversariante.cargo)} - ${ssrInterpolate(aniversariante.departamento)}</p></div><div class="text-2xl"${_scopeId}>🎂</div></div>`);
                });
                _push2(`<!--]--></div>`);
              }
            } else {
              return [
                unref(loading) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-8"
                }, [
                  createVNode("div", { class: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }),
                  createVNode("p", { class: "mt-2 text-gray-600" }, "Carregando...")
                ])) : unref(aniversariantes).length === 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-8 text-gray-500"
                }, " Nenhum aniversariante este mês ")) : (openBlock(), createBlock("div", {
                  key: 2,
                  class: "space-y-4"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(aniversariantes), (aniversariante) => {
                    return openBlock(), createBlock("div", {
                      key: aniversariante.id,
                      class: "flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    }, [
                      createVNode("div", { class: "w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center" }, [
                        createVNode("span", { class: "text-orange-600 font-bold text-lg" }, toDisplayString(aniversariante.dia), 1)
                      ]),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("h4", { class: "font-semibold text-gray-900" }, toDisplayString(aniversariante.nome_completo), 1),
                        createVNode("p", { class: "text-sm text-gray-600" }, toDisplayString(aniversariante.cargo) + " - " + toDisplayString(aniversariante.departamento), 1)
                      ]),
                      createVNode("div", { class: "text-2xl" }, "🎂")
                    ]);
                  }), 128))
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-U-mUzyY2.mjs.map
