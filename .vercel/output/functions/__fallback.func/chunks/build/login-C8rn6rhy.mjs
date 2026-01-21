import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { defineComponent, ref, mergeProps, unref, isRef, withCtx, createBlock, openBlock, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as _export_sfc, a as useAuth } from './server.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@supabase/ssr';

const _imports_0 = publicAssetsURL("/images/qualitec_logo.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const email = ref("");
    const senha = ref("");
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiInput = __nuxt_component_4;
      const _component_UiButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden" }, _attrs))} data-v-adb25b66><div class="absolute inset-0 opacity-5" data-v-adb25b66><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", "background-size": "20px 20px" })}" data-v-adb25b66></div><div class="absolute top-10 left-10 w-16 h-16 border-2 border-blue-300 rounded-full" data-v-adb25b66></div><div class="absolute top-32 right-20 w-12 h-12 border-2 border-blue-400 rotate-45" data-v-adb25b66></div><div class="absolute bottom-20 left-20 w-20 h-20 border-2 border-blue-300 rounded-full" data-v-adb25b66></div><div class="absolute bottom-40 right-32 w-14 h-14 border-2 border-blue-400 rotate-12" data-v-adb25b66></div><div class="absolute top-1/4 left-1/4 w-8 h-8 border border-blue-300 transform rotate-30" style="${ssrRenderStyle({ "clip-path": "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)" })}" data-v-adb25b66></div><div class="absolute bottom-1/4 right-1/4 w-6 h-6 border border-blue-400 transform rotate-45" style="${ssrRenderStyle({ "clip-path": "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)" })}" data-v-adb25b66></div></div><div class="w-full max-w-lg relative z-10" data-v-adb25b66><div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 lg:p-12 border border-gray-200/50" data-v-adb25b66><div class="text-center mb-8" data-v-adb25b66><div class="flex justify-center mb-3" data-v-adb25b66><img${ssrRenderAttr("src", _imports_0)} alt="Qualitec Instrumentos" class="object-contain" style="${ssrRenderStyle({ "width": "calc(12rem + 2cm)", "height": "calc(12rem + 2cm)" })}" data-v-adb25b66></div><div class="mb-3" data-v-adb25b66><p class="text-sm text-gray-600 font-medium" data-v-adb25b66>Gestão de Recursos Humanos</p></div><div class="flex items-center justify-center mb-2" data-v-adb25b66><div class="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-24" data-v-adb25b66></div></div><p class="text-xs text-gray-500 font-medium" data-v-adb25b66>ISO 9001:2015 | Instrumentação Industrial</p></div><div class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-v-adb25b66><div class="flex items-center justify-center mb-2" data-v-adb25b66><div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center" data-v-adb25b66><svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-adb25b66><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-v-adb25b66></path></svg></div></div><p class="text-center text-blue-800 text-sm font-medium" data-v-adb25b66>Acesso Restrito</p><p class="text-center text-blue-600 text-xs mt-1" data-v-adb25b66>Entre com suas credenciais corporativas fornecidas pelo RH</p></div><form class="space-y-6" data-v-adb25b66><div class="space-y-2" data-v-adb25b66><label class="block text-sm font-semibold text-gray-700 mb-2" data-v-adb25b66><span class="flex items-center" data-v-adb25b66><svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-adb25b66><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" data-v-adb25b66></path></svg> E-mail </span></label>`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: unref(email),
        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
        type: "email",
        uppercase: false,
        placeholder: "seu.email@qualitecinstrumentos.com.br",
        required: "",
        error: unref(error) ? " " : "",
        class: "w-full"
      }, null, _parent));
      _push(`</div><div class="space-y-2" data-v-adb25b66><label class="block text-sm font-semibold text-gray-700 mb-2" data-v-adb25b66><span class="flex items-center" data-v-adb25b66><svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-adb25b66><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-v-adb25b66></path></svg> Senha de Acesso </span></label>`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: unref(senha),
        "onUpdate:modelValue": ($event) => isRef(senha) ? senha.value = $event : null,
        type: "password",
        placeholder: "Digite sua senha corporativa",
        required: "",
        "show-password-toggle": "",
        error: unref(error) ? " " : "",
        class: "w-full"
      }, null, _parent));
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 rounded-lg" data-v-adb25b66><div class="flex items-center" data-v-adb25b66><svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-adb25b66><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-adb25b66></path></svg><span class="text-red-800 text-sm font-medium" data-v-adb25b66>${ssrInterpolate(unref(error))}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UiButton, {
        type: "submit",
        size: "lg",
        loading: unref(loading),
        class: "w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(loading)) {
              _push2(`<span class="flex items-center justify-center" data-v-adb25b66${_scopeId}><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-adb25b66${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" data-v-adb25b66${_scopeId}></path></svg> Acessar Sistema </span>`);
            } else {
              _push2(`<span class="flex items-center justify-center" data-v-adb25b66${_scopeId}><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-adb25b66${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-adb25b66${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-adb25b66${_scopeId}></path></svg> Autenticando... </span>`);
            }
          } else {
            return [
              !unref(loading) ? (openBlock(), createBlock("span", {
                key: 0,
                class: "flex items-center justify-center"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mr-2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  })
                ])),
                createTextVNode(" Acessar Sistema ")
              ])) : (openBlock(), createBlock("span", {
                key: 1,
                class: "flex items-center justify-center"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("circle", {
                    class: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  createVNode("path", {
                    class: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ])),
                createTextVNode(" Autenticando... ")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="mt-8 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200" data-v-adb25b66><div class="text-center" data-v-adb25b66><div class="flex items-center justify-center mb-3" data-v-adb25b66><div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3" data-v-adb25b66><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-adb25b66><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-v-adb25b66></path></svg></div><div data-v-adb25b66><p class="text-blue-800 font-bold text-sm" data-v-adb25b66>Sistema Seguro</p><p class="text-blue-600 text-xs" data-v-adb25b66>Certificado ISO 9001:2015</p></div></div><p class="text-gray-600 text-xs leading-relaxed" data-v-adb25b66> Plataforma corporativa para gestão de recursos humanos.<br data-v-adb25b66> Acesso monitorado e protegido por criptografia avançada. </p></div></div></div><div class="mt-8 text-center" data-v-adb25b66><div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20" data-v-adb25b66><p class="text-white/90 text-sm font-medium mb-1" data-v-adb25b66> QUALITEC INSTRUMENTOS LTDA </p><p class="text-white/70 text-xs" data-v-adb25b66> © 2026 - Instrumentação Industrial | Criogenia | Óleo &amp; Gás </p><p class="text-white/60 text-xs mt-1" data-v-adb25b66> Todos os direitos reservados </p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-adb25b66"]]);

export { login as default };
//# sourceMappingURL=login-C8rn6rhy.mjs.map
