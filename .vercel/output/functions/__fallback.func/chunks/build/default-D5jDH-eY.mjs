import { _ as __nuxt_component_0$2 } from './nuxt-link-BWubxknC.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, computed, createBlock, createVNode, openBlock, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_1$1 } from './UiAvatar-BMVSUvdY.mjs';
import { a as useAuth, _ as _export_sfc } from './server.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "LayoutNavLink",
  __ssrInlineRender: true,
  props: {
    to: {},
    icon: {}
  },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const iconPaths = {
      home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      document: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      office: "M3 21h18M5 21V7l8-4v18M9 9h1m0 0v1m-1-1h1m0 0V9m0 0h1m0 0v1m-1-1h1M9 15h1m0 0v1m-1-1h1m0 0v-1m0 0h1m0 0v1m-1-1h1",
      briefcase: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      gift: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      money: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      robot: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    };
    const iconPath = computed(() => iconPaths[props.icon] || iconPaths.home);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: __props.to,
        class: "flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors",
        "active-class": "bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800",
        onClick: ($event) => _ctx.$emit("click")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", unref(iconPath))}${_scopeId}></path></svg><span${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: unref(iconPath)
                }, null, 8, ["d"])
              ])),
              createVNode("span", null, [
                renderSlot(_ctx.$slots, "default")
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LayoutNavLink.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$3, { __name: "LayoutNavLink" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LayoutSidebar",
  __ssrInlineRender: true,
  props: {
    user: {},
    isAdmin: { type: Boolean }
  },
  emits: ["logout"],
  setup(__props) {
    useAuth();
    const cargosMap = ref({});
    const obterNomeCargo = (id) => {
      if (!id) return "Não informado";
      const idStr = id?.toString();
      return cargosMap.value[idStr] || "Carregando...";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutNavLink = __nuxt_component_0$1;
      const _component_UiAvatar = __nuxt_component_1$1;
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm" }, _attrs))}><div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100"><div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center"><span class="text-white font-bold text-xl">RH</span></div><div><h1 class="text-xl font-bold text-gray-800">Sistema RH</h1><p class="text-sm text-gray-500">Gestão de Pessoas</p></div></div><nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">`);
      _push(ssrRenderComponent(_component_LayoutNavLink, {
        to: "/dashboard",
        icon: "home"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Início`);
          } else {
            return [
              createTextVNode("Início")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!__props.isAdmin) {
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/holerites",
          icon: "document"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Meus Holerites`);
            } else {
              return [
                createTextVNode("Meus Holerites")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_LayoutNavLink, {
        to: "/meus-dados",
        icon: "user"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Meus Dados`);
          } else {
            return [
              createTextVNode("Meus Dados")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.isAdmin) {
        _push(`<!--[--><div class="pt-4 mt-4 border-t border-gray-200"><p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"> Administração </p></div>`);
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/admin/funcionarios",
          icon: "users"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Funcionários`);
            } else {
              return [
                createTextVNode("Funcionários")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/admin/jornadas",
          icon: "clock"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Jornadas de Trabalho`);
            } else {
              return [
                createTextVNode("Jornadas de Trabalho")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/admin/empresas",
          icon: "office"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Empresas`);
            } else {
              return [
                createTextVNode("Empresas")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/admin/departamentos",
          icon: "building"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Departamentos`);
            } else {
              return [
                createTextVNode("Departamentos")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/admin/cargos",
          icon: "briefcase"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Cargos`);
            } else {
              return [
                createTextVNode("Cargos")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_LayoutNavLink, {
          to: "/admin/holerites",
          icon: "money"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Holerites`);
            } else {
              return [
                createTextVNode("Holerites")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><div class="p-4 border-t border-gray-200"><div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50">`);
      _push(ssrRenderComponent(_component_UiAvatar, {
        name: __props.user?.nome || "",
        "avatar-type": __props.user?.avatar
      }, null, _parent));
      _push(`<div class="flex-1 min-w-0"><p class="text-base font-semibold text-gray-800 truncate">${ssrInterpolate(__props.user?.nome)}</p><p class="text-sm text-gray-500 truncate">${ssrInterpolate(obterNomeCargo(__props.user?.cargo))}</p></div></div><button class="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Sair do Sistema </button></div></aside>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LayoutSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "LayoutSidebar" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LayoutMobileMenu",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    user: {},
    isAdmin: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    useAuth();
    const cargosMap = ref({});
    const obterNomeCargo = (id) => {
      if (!id) return "Não informado";
      const idStr = id?.toString();
      return cargosMap.value[idStr] || "Carregando...";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutNavLink = __nuxt_component_0$1;
      const _component_UiAvatar = __nuxt_component_1$1;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="lg:hidden fixed inset-0 z-50 bg-black/50" data-v-a39f9b9e></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (__props.open) {
          _push2(`<div class="lg:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-white shadow-xl" data-v-a39f9b9e><div class="flex items-center justify-between p-4 border-b" data-v-a39f9b9e><span class="text-lg font-bold text-gray-800" data-v-a39f9b9e>Menu</span><button class="p-2 rounded-lg hover:bg-gray-100" data-v-a39f9b9e><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-a39f9b9e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-a39f9b9e></path></svg></button></div><nav class="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]" data-v-a39f9b9e>`);
          _push2(ssrRenderComponent(_component_LayoutNavLink, {
            to: "/dashboard",
            icon: "home",
            onClick: ($event) => _ctx.$emit("close")
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Início`);
              } else {
                return [
                  createTextVNode("Início")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_LayoutNavLink, {
            to: "/meus-dados",
            icon: "user",
            onClick: ($event) => _ctx.$emit("close")
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Meus Dados`);
              } else {
                return [
                  createTextVNode("Meus Dados")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (!__props.isAdmin) {
            _push2(ssrRenderComponent(_component_LayoutNavLink, {
              to: "/holerites",
              icon: "document",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Meus Holerites`);
                } else {
                  return [
                    createTextVNode("Meus Holerites")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (__props.isAdmin) {
            _push2(`<!--[--><div class="pt-4 mt-4 border-t border-gray-200" data-v-a39f9b9e><p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3" data-v-a39f9b9e> Administração </p></div>`);
            _push2(ssrRenderComponent(_component_LayoutNavLink, {
              to: "/admin/funcionarios",
              icon: "users",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Funcionários`);
                } else {
                  return [
                    createTextVNode("Funcionários")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_LayoutNavLink, {
              to: "/admin/empresas",
              icon: "office",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Empresas`);
                } else {
                  return [
                    createTextVNode("Empresas")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_LayoutNavLink, {
              to: "/admin/departamentos",
              icon: "building",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Departamentos`);
                } else {
                  return [
                    createTextVNode("Departamentos")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_LayoutNavLink, {
              to: "/admin/cargos",
              icon: "briefcase",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Cargos`);
                } else {
                  return [
                    createTextVNode("Cargos")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_LayoutNavLink, {
              to: "/admin/holerites",
              icon: "money",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Holerites`);
                } else {
                  return [
                    createTextVNode("Holerites")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`<!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</nav><div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white" data-v-a39f9b9e><div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3" data-v-a39f9b9e>`);
          _push2(ssrRenderComponent(_component_UiAvatar, {
            name: __props.user?.nome || "",
            "avatar-type": __props.user?.avatar,
            size: "sm"
          }, null, _parent));
          _push2(`<div class="flex-1 min-w-0" data-v-a39f9b9e><p class="text-sm font-semibold text-gray-800 truncate" data-v-a39f9b9e>${ssrInterpolate(__props.user?.nome)}</p><p class="text-xs text-gray-500 truncate" data-v-a39f9b9e>${ssrInterpolate(obterNomeCargo(__props.user?.cargo))}</p></div></div><button class="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100" data-v-a39f9b9e><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-a39f9b9e><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-v-a39f9b9e></path></svg> Sair </button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/LayoutMobileMenu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-a39f9b9e"]]), { __name: "LayoutMobileMenu" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, isAdmin } = useAuth();
    const mobileMenuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LayoutSidebar = __nuxt_component_0;
      const _component_LayoutMobileMenu = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_LayoutSidebar, {
        user: unref(user),
        "is-admin": unref(isAdmin)
      }, null, _parent));
      _push(`<div class="lg:pl-72"><header class="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm"><div class="flex items-center justify-between px-4 py-3"><div class="flex items-center gap-2"><div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold">RH</span></div><span class="font-bold text-gray-800">Sistema RH</span></div><button class="p-2 rounded-lg hover:bg-gray-100"><svg class="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div></header>`);
      _push(ssrRenderComponent(_component_LayoutMobileMenu, {
        open: unref(mobileMenuOpen),
        user: unref(user),
        "is-admin": unref(isAdmin),
        onClose: ($event) => mobileMenuOpen.value = false
      }, null, _parent));
      _push(`<main class="p-4 lg:p-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-D5jDH-eY.mjs.map
