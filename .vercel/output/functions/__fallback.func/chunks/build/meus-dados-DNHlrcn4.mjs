import { _ as __nuxt_component_0 } from './UiPageHeader-Cc5ywX71.mjs';
import { _ as __nuxt_component_2 } from './UiCard-Co7bHBSC.mjs';
import { _ as __nuxt_component_1 } from './UiAvatar-BMVSUvdY.mjs';
import { _ as __nuxt_component_1$1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2$1 } from './UiBadge-BLIbLGMQ.mjs';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, createCommentVNode, renderList, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_6$1 } from './UiSelect-DFt9aazW.mjs';
import { _ as __nuxt_component_1$2 } from './UiInputPIS-DlrVjyhf.mjs';
import { _ as __nuxt_component_1$3 } from './UiAlert-BhgRUHOS.mjs';
import { _ as __nuxt_component_7, a as __nuxt_component_3 } from './UiModal-C-UfYvvP.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UiInputCPF",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: {},
    placeholder: { default: "000.000.000-00" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    hint: {},
    error: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const id = computed(() => `cpf-input-${Math.random().toString(36).substring(2, 11)}`);
    const displayValue = computed(() => {
      return formatarCPF(props.modelValue);
    });
    const cpfValido = computed(() => {
      const cpfLimpo = props.modelValue.replace(/[^\d]/g, "");
      return cpfLimpo.length === 11 && validarCPF(cpfLimpo);
    });
    function formatarCPF(cpf) {
      const cpfLimpo = cpf.replace(/[^\d]/g, "");
      if (cpfLimpo.length <= 3) return cpfLimpo;
      if (cpfLimpo.length <= 6) return cpfLimpo.replace(/^(\d{3})(\d+)/, "$1.$2");
      if (cpfLimpo.length <= 9) return cpfLimpo.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
      return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
    }
    function validarCPF(cpf) {
      const cpfLimpo = cpf.replace(/[^\d]/g, "");
      if (cpfLimpo.length !== 11) return false;
      if (/^(\d)\1+$/.test(cpfLimpo)) return false;
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
      }
      let digito1 = 11 - soma % 11;
      if (digito1 > 9) digito1 = 0;
      if (parseInt(cpfLimpo.charAt(9)) !== digito1) return false;
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
      }
      let digito2 = 11 - soma % 11;
      if (digito2 > 9) digito2 = 0;
      return parseInt(cpfLimpo.charAt(10)) === digito2;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", unref(id))} class="block text-sm font-medium text-gray-600 mb-1">${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="text-red-500">*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative"><input${ssrRenderAttr("id", unref(id))}${ssrRenderAttr("value", unref(displayValue))}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([
        "w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors",
        __props.disabled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-gray-200 focus:border-primary-500",
        __props.error ? "border-red-300" : "",
        unref(cpfValido) ? "border-green-300" : ""
      ])}">`);
      if (__props.modelValue && !__props.disabled) {
        _push(`<div class="absolute right-4 top-1/2 -translate-y-1/2">`);
        if (unref(cpfValido)) {
          _push(`<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
        } else if (__props.modelValue.length >= 11) {
          _push(`<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6m0 0l-6-6m6 6l-6 6"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-1 space-y-1">`);
      if (__props.hint && !__props.error) {
        _push(`<p class="text-xs text-gray-400">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(__props.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(cpfValido) && !__props.error) {
        _push(`<p class="text-xs text-green-600">CPF válido</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiInputCPF.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$3, { __name: "UiInputCPF" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UiInputPhone",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: {},
    placeholder: { default: "(11) 99999-9999" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    hint: {},
    error: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const id = computed(() => `phone-input-${Math.random().toString(36).substring(2, 11)}`);
    const displayValue = computed(() => {
      return formatarTelefone(props.modelValue);
    });
    function formatarTelefone(telefone) {
      const telLimpo = telefone.replace(/[^\d]/g, "");
      if (telLimpo.length <= 2) return telLimpo;
      if (telLimpo.length <= 6) return telLimpo.replace(/^(\d{2})(\d+)/, "($1) $2");
      if (telLimpo.length <= 10) return telLimpo.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
      return telLimpo.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", unref(id))} class="block text-sm font-medium text-gray-600 mb-1">${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="text-red-500">*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("id", unref(id))}${ssrRenderAttr("value", unref(displayValue))}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([
        "w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors",
        __props.disabled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-gray-200 focus:border-primary-500",
        __props.error ? "border-red-300" : ""
      ])}"><div class="mt-1 space-y-1">`);
      if (__props.hint && !__props.error) {
        _push(`<p class="text-xs text-gray-400">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(__props.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiInputPhone.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "UiInputPhone" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UiAvatarSelector",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean },
    userName: {},
    currentAvatar: {}
  },
  emits: ["close", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectedAvatar = ref(props.currentAvatar || "person-1");
    const saving = ref(false);
    const avatarOptions = [
      // Avatares básicos
      { id: "person-1", name: "Pessoa Padrão", emoji: "👤" },
      // GERENTE - Responsável por Fiscal, Financeiro, Comercial, RH e Administrativo
      { id: "gerente-1", name: "Gerente", emoji: "👨‍💼" },
      { id: "gerente-2", name: "Gerente", emoji: "👩‍💼" },
      { id: "gerente-3", name: "Gerente Moreno", emoji: "👨🏽‍💼" },
      { id: "gerente-4", name: "Gerente Morena", emoji: "👩🏽‍💼" },
      // ASSISTENTE COMERCIAL
      { id: "ass-comercial-1", name: "Assistente Comercial", emoji: "🧑‍💼" },
      { id: "ass-comercial-2", name: "Assistente Comercial", emoji: "👨‍💼" },
      { id: "ass-comercial-3", name: "Assistente Comercial", emoji: "👩‍💼" },
      { id: "ass-comercial-4", name: "Assistente Comercial Moreno", emoji: "👨🏽‍💼" },
      { id: "ass-comercial-5", name: "Assistente Comercial Morena", emoji: "👩🏽‍💼" },
      // REPRESENTANTE COMERCIAL
      { id: "rep-comercial-1", name: "Representante Comercial", emoji: "🤝" },
      { id: "rep-comercial-2", name: "Representante Comercial", emoji: "👔" },
      { id: "rep-comercial-3", name: "Representante Comercial", emoji: "💼" },
      // AUXILIAR COMERCIAL
      { id: "aux-comercial-1", name: "Auxiliar Comercial", emoji: "📊" },
      { id: "aux-comercial-2", name: "Auxiliar Comercial", emoji: "📈" },
      { id: "aux-comercial-3", name: "Auxiliar Comercial", emoji: "💹" },
      // ASSISTENTE DE PRODUÇÃO
      { id: "ass-producao-1", name: "Assistente de Produção", emoji: "👷‍♂️" },
      { id: "ass-producao-2", name: "Assistente de Produção", emoji: "👷‍♀️" },
      { id: "ass-producao-3", name: "Assistente de Produção Moreno", emoji: "👷🏽‍♂️" },
      { id: "ass-producao-4", name: "Assistente de Produção Morena", emoji: "👷🏽‍♀️" },
      // AUXILIAR DE PRODUÇÃO
      { id: "aux-producao-1", name: "Auxiliar de Produção", emoji: "🔧" },
      { id: "aux-producao-2", name: "Auxiliar de Produção", emoji: "⚙️" },
      { id: "aux-producao-3", name: "Auxiliar de Produção", emoji: "🛠️" },
      // SOLDADOR
      { id: "soldador-1", name: "Soldador", emoji: "👨‍🔧" },
      { id: "soldador-2", name: "Soldador", emoji: "👩‍🔧" },
      { id: "soldador-3", name: "Soldador Moreno", emoji: "👨🏽‍🔧" },
      { id: "soldador-4", name: "Soldador Morena", emoji: "👩🏽‍🔧" },
      { id: "soldador-5", name: "Soldador", emoji: "🔥" },
      { id: "soldador-6", name: "Soldador", emoji: "⚡" },
      // AUXILIAR ADMINISTRATIVO
      { id: "aux-admin-1", name: "Auxiliar Administrativo", emoji: "📋" },
      { id: "aux-admin-2", name: "Auxiliar Administrativo", emoji: "📝" },
      { id: "aux-admin-3", name: "Auxiliar Administrativo", emoji: "🗂️" },
      { id: "aux-admin-4", name: "Auxiliar Administrativo", emoji: "📄" },
      // LÍDER DE ESTOQUE
      { id: "lider-estoque-1", name: "Líder de Estoque", emoji: "📦" },
      { id: "lider-estoque-2", name: "Líder de Estoque", emoji: "🏪" },
      { id: "lider-estoque-3", name: "Líder de Estoque Moreno", emoji: "👨🏽‍💼" },
      { id: "lider-estoque-4", name: "Líder de Estoque Morena", emoji: "👩🏽‍💼" },
      // AUXILIAR DE ESTOQUE
      { id: "aux-estoque-1", name: "Auxiliar de Estoque", emoji: "📋" },
      { id: "aux-estoque-2", name: "Auxiliar de Estoque", emoji: "📊" },
      { id: "aux-estoque-3", name: "Auxiliar de Estoque", emoji: "🏷️" },
      { id: "aux-estoque-4", name: "Auxiliar de Estoque", emoji: "📈" },
      // AUXILIAR DE EXPEDIÇÃO
      { id: "aux-expedicao-1", name: "Auxiliar de Expedição", emoji: "🚚" },
      { id: "aux-expedicao-2", name: "Auxiliar de Expedição", emoji: "📦" },
      { id: "aux-expedicao-3", name: "Auxiliar de Expedição", emoji: "🚛" },
      { id: "aux-expedicao-4", name: "Auxiliar de Expedição", emoji: "📮" },
      // AUXILIAR DE SERVIÇOS GERAIS
      { id: "aux-servicos-1", name: "Auxiliar de Serviços Gerais", emoji: "🧹" },
      { id: "aux-servicos-2", name: "Auxiliar de Serviços Gerais", emoji: "🧽" },
      { id: "aux-servicos-3", name: "Auxiliar de Serviços Gerais", emoji: "🧴" },
      { id: "aux-servicos-4", name: "Auxiliar de Serviços Gerais", emoji: "🗑️" },
      // TI (Técnico de Informática)
      { id: "ti-1", name: "Técnico de TI", emoji: "👨‍💻" },
      { id: "ti-2", name: "Técnico de TI", emoji: "👩‍💻" },
      { id: "ti-3", name: "Técnico de TI Moreno", emoji: "👨🏽‍💻" },
      { id: "ti-4", name: "Técnico de TI Morena", emoji: "👩🏽‍💻" },
      { id: "ti-5", name: "Técnico de TI", emoji: "💻" },
      { id: "ti-6", name: "Técnico de TI", emoji: "🖥️" }
    ];
    const selectAvatar = (avatarId) => {
      selectedAvatar.value = avatarId;
    };
    const saveAvatar = async () => {
      saving.value = true;
      try {
        emit("save", selectedAvatar.value);
      } finally {
        saving.value = false;
      }
    };
    watch(() => props.currentAvatar, (newAvatar) => {
      if (newAvatar) {
        selectedAvatar.value = newAvatar;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiModal = __nuxt_component_3;
      const _component_UiAvatar = __nuxt_component_1;
      const _component_UiButton = __nuxt_component_1$1;
      _push(ssrRenderComponent(_component_UiModal, mergeProps({
        "model-value": __props.show,
        "onUpdate:modelValue": ($event) => _ctx.$emit("close"),
        title: "Escolher Avatar"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="text-center"${_scopeId}><h3 class="text-lg font-semibold text-gray-800 mb-4"${_scopeId}>Avatar Atual</h3>`);
            _push2(ssrRenderComponent(_component_UiAvatar, {
              name: __props.userName,
              "avatar-type": __props.currentAvatar,
              size: "xl",
              class: "mx-auto mb-2"
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(__props.userName)}</p></div><div${_scopeId}><h3 class="text-lg font-semibold text-gray-800 mb-4"${_scopeId}>Escolha um Avatar</h3><div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto"${_scopeId}><!--[-->`);
            ssrRenderList(avatarOptions, (avatar) => {
              _push2(`<button class="${ssrRenderClass([
                "p-2 rounded-xl border-2 transition-all hover:scale-105",
                unref(selectedAvatar) === avatar.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              ])}"${_scopeId}><div class="text-4xl"${_scopeId}>${ssrInterpolate(avatar.emoji)}</div><p class="text-xs text-gray-600 mt-1"${_scopeId}>${ssrInterpolate(avatar.name)}</p></button>`);
            });
            _push2(`<!--]--></div></div><div class="flex justify-end gap-3 pt-4 border-t"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "ghost",
              onClick: ($event) => _ctx.$emit("close")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancelar `);
                } else {
                  return [
                    createTextVNode(" Cancelar ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              onClick: saveAvatar,
              disabled: unref(saving)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(saving) ? "Salvando..." : "Salvar Avatar")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(saving) ? "Salvando..." : "Salvar Avatar"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800 mb-4" }, "Avatar Atual"),
                  createVNode(_component_UiAvatar, {
                    name: __props.userName,
                    "avatar-type": __props.currentAvatar,
                    size: "xl",
                    class: "mx-auto mb-2"
                  }, null, 8, ["name", "avatar-type"]),
                  createVNode("p", { class: "text-sm text-gray-500" }, toDisplayString(__props.userName), 1)
                ]),
                createVNode("div", null, [
                  createVNode("h3", { class: "text-lg font-semibold text-gray-800 mb-4" }, "Escolha um Avatar"),
                  createVNode("div", { class: "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(avatarOptions, (avatar) => {
                      return createVNode("button", {
                        key: avatar.id,
                        onClick: ($event) => selectAvatar(avatar.id),
                        class: [
                          "p-2 rounded-xl border-2 transition-all hover:scale-105",
                          unref(selectedAvatar) === avatar.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        ]
                      }, [
                        createVNode("div", { class: "text-4xl" }, toDisplayString(avatar.emoji), 1),
                        createVNode("p", { class: "text-xs text-gray-600 mt-1" }, toDisplayString(avatar.name), 1)
                      ], 10, ["onClick"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", { class: "flex justify-end gap-3 pt-4 border-t" }, [
                  createVNode(_component_UiButton, {
                    variant: "ghost",
                    onClick: ($event) => _ctx.$emit("close")
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancelar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UiButton, {
                    onClick: saveAvatar,
                    disabled: unref(saving)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(saving) ? "Salvando..." : "Salvar Avatar"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiAvatarSelector.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$1, { __name: "UiAvatarSelector" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "meus-dados",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, isAdmin, updateUser } = useAuth();
    const editandoDadosPessoais = ref(false);
    const editandoDadosProfissionais = ref(false);
    const editandoPagamento = ref(false);
    const salvando = ref(false);
    const carregando = ref(true);
    const mostrarNotificacao = ref(false);
    const mostrarSeletorAvatar = ref(false);
    const mostrarSalario = ref(false);
    const notificacao = ref({
      title: "",
      message: "",
      variant: "success"
    });
    const dadosOriginais = ref(null);
    const dadosPessoais = ref({
      nome: "",
      cpf: "",
      rg: "",
      dataNascimento: "",
      sexo: "",
      telefone: "",
      email_pessoal: "",
      pis_pasep: ""
    });
    const dadosProfissionais = ref({
      cargo: "",
      departamento: "",
      dataAdmissao: "",
      tipoContrato: "",
      empresa: ""
    });
    const dadosFinanceiros = ref({
      salario_base: "",
      banco: "",
      agencia: "",
      conta: "",
      tipo_conta: "",
      forma_pagamento: "deposito",
      chave_pix: ""
    });
    const camposEditadosUmaVez = ref({
      sexo: false,
      dataNascimento: false,
      rg: false,
      cpf: false
    });
    const bancosOptions = [
      { value: "001", label: "Banco do Brasil" },
      { value: "104", label: "Caixa Econômica" },
      { value: "237", label: "Bradesco" },
      { value: "341", label: "Itaú" },
      { value: "033", label: "Santander" },
      { value: "260", label: "Nubank" }
    ];
    const tipoContaOptions = [
      { value: "corrente", label: "Conta Corrente" },
      { value: "poupanca", label: "Conta Poupança" }
    ];
    const sexoOptions = [
      { value: "masculino", label: "Masculino" },
      { value: "feminino", label: "Feminino" },
      { value: "outro", label: "Outro" },
      { value: "nao_informar", label: "Prefiro não informar" }
    ];
    const formaPagamentoOptions = [
      { value: "deposito", label: "Depósito em Conta" },
      { value: "pix", label: "PIX" },
      { value: "dinheiro", label: "Dinheiro" }
    ];
    const tipoContratoOptions = [
      { value: "CLT", label: "CLT" },
      { value: "PJ", label: "PJ" },
      { value: "Estagio", label: "Estágio" },
      { value: "Temporario", label: "Temporário" }
    ];
    const cargosOptions = ref([]);
    const departamentosOptions = ref([]);
    const empresasOptions = ref([]);
    const cargosMap = ref({});
    const departamentosMap = ref({});
    const empresasMap = ref({});
    const formatarData = (data) => {
      if (!data) return "--";
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    };
    const formatarDataContratacao = () => {
      if (!dadosProfissionais.value.dataAdmissao) return "Desde --/--";
      try {
        const data = /* @__PURE__ */ new Date(dadosProfissionais.value.dataAdmissao + "T00:00:00");
        if (isNaN(data.getTime())) {
          return "Desde --/--";
        }
        const meses = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez"
        ];
        const mes = meses[data.getMonth()];
        const ano = data.getFullYear();
        return `Desde ${mes}/${ano}`;
      } catch (error) {
        console.error("Erro ao formatar data de contratação:", error);
        return "Desde --/--";
      }
    };
    const formatarMoeda = (valor) => {
      const num = typeof valor === "string" ? parseFloat(valor) : valor;
      if (!num) return "R$ 0,00";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(num);
    };
    const obterNomeCargo = (id) => {
      const idStr = id?.toString();
      return cargosMap.value[idStr] || idStr || "--";
    };
    const obterNomeDepartamento = (id) => {
      const idStr = id?.toString();
      return departamentosMap.value[idStr] || idStr || "--";
    };
    const obterNomeEmpresa = (id) => {
      const idStr = id?.toString();
      return empresasMap.value[idStr] || idStr || "--";
    };
    const beneficiosAtivos = computed(() => {
      if (!dadosOriginais.value?.beneficios) return {};
      let beneficios = {};
      try {
        beneficios = typeof dadosOriginais.value.beneficios === "string" ? JSON.parse(dadosOriginais.value.beneficios) : dadosOriginais.value.beneficios;
      } catch (error) {
        console.error("Erro ao parsear benefícios:", error);
        return {};
      }
      const ativos = {};
      if (beneficios.vale_transporte?.ativo && beneficios.vale_transporte?.valor > 0) {
        ativos.vale_transporte = beneficios.vale_transporte;
      }
      if (beneficios.cesta_basica?.ativo && beneficios.cesta_basica?.valor > 0) {
        ativos.cesta_basica = beneficios.cesta_basica;
      }
      if (beneficios.plano_saude?.ativo && beneficios.plano_saude?.valor_funcionario > 0) {
        ativos.plano_saude = beneficios.plano_saude;
      }
      if (beneficios.plano_odonto?.ativo && beneficios.plano_odonto?.valor_funcionario > 0) {
        ativos.plano_odonto = beneficios.plano_odonto;
      }
      return ativos;
    });
    const beneficiosPersonalizadosAtivos = computed(() => {
      if (!dadosOriginais.value?.beneficios) return [];
      let beneficios = {};
      try {
        beneficios = typeof dadosOriginais.value.beneficios === "string" ? JSON.parse(dadosOriginais.value.beneficios) : dadosOriginais.value.beneficios;
      } catch (error) {
        console.error("Erro ao parsear benefícios:", error);
        return [];
      }
      if (!beneficios.personalizados || !Array.isArray(beneficios.personalizados)) {
        return [];
      }
      return beneficios.personalizados.filter((b) => b.ativo && b.valor > 0);
    });
    const temBeneficios = computed(() => {
      return Object.keys(beneficiosAtivos.value).length > 0 || beneficiosPersonalizadosAtivos.value.length > 0;
    });
    const carregarDados = async () => {
      if (!user.value?.id) {
        mostrarMensagem("Erro!", "Usuário não autenticado", "error");
        return;
      }
      carregando.value = true;
      try {
        const response = await $fetch(`/api/funcionarios/meus-dados?userId=${user.value.id}`);
        if (response.success && response.data) {
          dadosOriginais.value = response.data;
          dadosPessoais.value = {
            nome: response.data.nome_completo || "",
            cpf: response.data.cpf || "",
            rg: response.data.rg || "",
            dataNascimento: response.data.data_nascimento || "",
            sexo: response.data.sexo || "",
            telefone: response.data.telefone || "",
            email_pessoal: response.data.email_pessoal || "",
            pis_pasep: response.data.pis_pasep || ""
          };
          dadosProfissionais.value = {
            cargo: response.data.cargo_id?.toString() || "",
            departamento: response.data.departamento_id?.toString() || "",
            dataAdmissao: response.data.data_admissao || "",
            tipoContrato: response.data.tipo_contrato || "CLT",
            empresa: response.data.empresa_id?.toString() || ""
          };
          dadosFinanceiros.value = {
            salario_base: response.data.salario_base || 0,
            banco: response.data.banco || "",
            agencia: response.data.agencia || "",
            conta: response.data.conta || "",
            tipo_conta: response.data.tipo_conta || "corrente",
            forma_pagamento: response.data.forma_pagamento || "deposito",
            chave_pix: response.data.chave_pix || ""
          };
          camposEditadosUmaVez.value = {
            sexo: !!response.data.sexo,
            dataNascimento: !!response.data.data_nascimento,
            rg: !!response.data.rg,
            cpf: !!response.data.cpf
          };
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        mostrarMensagem("Erro!", "Não foi possível carregar seus dados", "error");
      } finally {
        carregando.value = false;
      }
    };
    const salvarDadosPessoais = async () => {
      if (!user.value?.id) {
        mostrarMensagem("Erro!", "Usuário não autenticado", "error");
        return;
      }
      salvando.value = true;
      try {
        const dadosParaEnviar = {
          userId: user.value.id,
          telefone: dadosPessoais.value.telefone,
          email_pessoal: dadosPessoais.value.email_pessoal,
          pis_pasep: dadosPessoais.value.pis_pasep
        };
        if (!camposEditadosUmaVez.value.dataNascimento || isAdmin.value) {
          dadosParaEnviar.data_nascimento = dadosPessoais.value.dataNascimento;
        }
        if (!camposEditadosUmaVez.value.sexo || isAdmin.value) {
          dadosParaEnviar.sexo = dadosPessoais.value.sexo;
        }
        if (!camposEditadosUmaVez.value.rg || isAdmin.value) {
          dadosParaEnviar.rg = dadosPessoais.value.rg;
        }
        if (isAdmin.value) {
          dadosParaEnviar.nome_completo = dadosPessoais.value.nome;
          dadosParaEnviar.cpf = dadosPessoais.value.cpf;
        } else if (!camposEditadosUmaVez.value.cpf) {
          dadosParaEnviar.cpf = dadosPessoais.value.cpf;
        }
        const response = await $fetch("/api/funcionarios/meus-dados", {
          method: "PATCH",
          body: dadosParaEnviar
        });
        if (response.success) {
          if (response.data) {
            dadosPessoais.value.telefone = response.data.telefone || dadosPessoais.value.telefone;
            dadosPessoais.value.email_pessoal = response.data.email_pessoal || dadosPessoais.value.email_pessoal;
            dadosPessoais.value.dataNascimento = response.data.data_nascimento || dadosPessoais.value.dataNascimento;
            if (isAdmin.value && response.data.nome_completo) {
              dadosPessoais.value.nome = response.data.nome_completo;
              updateUser({ nome: response.data.nome_completo });
            }
            if (isAdmin.value && response.data.cpf) {
              dadosPessoais.value.cpf = response.data.cpf;
            }
            if (dadosOriginais.value) {
              dadosOriginais.value.telefone = response.data.telefone || dadosOriginais.value.telefone;
              dadosOriginais.value.email_pessoal = response.data.email_pessoal || dadosOriginais.value.email_pessoal;
              dadosOriginais.value.data_nascimento = response.data.data_nascimento || dadosOriginais.value.data_nascimento;
              if (isAdmin.value && response.data.nome_completo) {
                dadosOriginais.value.nome_completo = response.data.nome_completo;
              }
              if (isAdmin.value && response.data.cpf) {
                dadosOriginais.value.cpf = response.data.cpf;
              }
            }
          }
          mostrarMensagem("Sucesso!", "Dados pessoais atualizados com sucesso!", "success");
          editandoDadosPessoais.value = false;
        }
      } catch (error) {
        console.error("Erro ao salvar dados pessoais:", error);
        mostrarMensagem("Erro!", error.data?.message || "Não foi possível salvar os dados", "error");
      } finally {
        salvando.value = false;
      }
    };
    const salvarDadosProfissionais = async () => {
      if (!user.value?.id) {
        mostrarMensagem("Erro!", "Usuário não autenticado", "error");
        return;
      }
      if (!isAdmin.value) {
        mostrarMensagem("Erro!", "Apenas administradores podem editar dados profissionais", "error");
        return;
      }
      salvando.value = true;
      try {
        const response = await $fetch("/api/funcionarios/meus-dados", {
          method: "PATCH",
          body: {
            userId: user.value.id,
            cargo_id: dadosProfissionais.value.cargo,
            departamento_id: dadosProfissionais.value.departamento,
            data_admissao: dadosProfissionais.value.dataAdmissao,
            tipo_contrato: dadosProfissionais.value.tipoContrato,
            empresa_id: dadosProfissionais.value.empresa
          }
        });
        if (response.success) {
          mostrarMensagem("Sucesso!", "Dados profissionais atualizados com sucesso!", "success");
          editandoDadosProfissionais.value = false;
          await carregarDados();
        }
      } catch (error) {
        console.error("Erro ao salvar dados profissionais:", error);
        mostrarMensagem("Erro!", error.data?.message || "Não foi possível salvar os dados", "error");
      } finally {
        salvando.value = false;
      }
    };
    const salvarDadosFinanceiros = async () => {
      if (!user.value?.id) {
        mostrarMensagem("Erro!", "Usuário não autenticado", "error");
        return;
      }
      salvando.value = true;
      try {
        const response = await $fetch("/api/funcionarios/meus-dados", {
          method: "PATCH",
          body: {
            userId: user.value.id,
            banco: dadosFinanceiros.value.banco,
            agencia: dadosFinanceiros.value.agencia,
            conta: dadosFinanceiros.value.conta,
            tipo_conta: dadosFinanceiros.value.tipo_conta,
            forma_pagamento: dadosFinanceiros.value.forma_pagamento,
            chave_pix: dadosFinanceiros.value.chave_pix
          }
        });
        if (response.success) {
          mostrarMensagem("Sucesso!", "Dados financeiros atualizados com sucesso!", "success");
          editandoPagamento.value = false;
          await carregarDados();
        }
      } catch (error) {
        console.error("Erro ao salvar dados financeiros:", error);
        mostrarMensagem("Erro!", error.data?.message || "Não foi possível salvar os dados", "error");
      } finally {
        salvando.value = false;
      }
    };
    const mostrarMensagem = (title, message, variant) => {
      notificacao.value = { title, message, variant };
      mostrarNotificacao.value = true;
      setTimeout(() => {
        mostrarNotificacao.value = false;
      }, 5e3);
    };
    const salvarAvatar = async (avatarId) => {
      if (!user.value?.id) {
        mostrarMensagem("Erro!", "Usuário não autenticado", "error");
        return;
      }
      try {
        const response = await $fetch("/api/funcionarios/meus-dados", {
          method: "PATCH",
          body: {
            userId: user.value.id,
            avatar: avatarId
          }
        });
        if (response.success) {
          if (dadosOriginais.value) {
            dadosOriginais.value.avatar = avatarId;
          }
          mostrarMensagem("Sucesso!", "Avatar atualizado com sucesso!", "success");
          mostrarSeletorAvatar.value = false;
        }
      } catch (error) {
        console.error("Erro ao salvar avatar:", error);
        mostrarMensagem("Erro!", error.data?.message || "Não foi possível salvar o avatar", "error");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPageHeader = __nuxt_component_0;
      const _component_UiCard = __nuxt_component_2;
      const _component_UiAvatar = __nuxt_component_1;
      const _component_UiButton = __nuxt_component_1$1;
      const _component_UiBadge = __nuxt_component_2$1;
      const _component_UiInput = __nuxt_component_4;
      const _component_UiInputCPF = __nuxt_component_6;
      const _component_UiSelect = __nuxt_component_6$1;
      const _component_UiInputPhone = __nuxt_component_8;
      const _component_UiInputPIS = __nuxt_component_1$2;
      const _component_UiAlert = __nuxt_component_1$3;
      const _component_UiNotification = __nuxt_component_7;
      const _component_UiAvatarSelector = __nuxt_component_12;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UiPageHeader, {
        title: "Meus Dados",
        description: "Visualize e atualize suas informações pessoais"
      }, null, _parent));
      if (unref(carregando)) {
        _push(`<div class="flex items-center justify-center py-12"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p class="text-gray-600">Carregando seus dados...</p></div></div>`);
      } else {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_UiCard, { class: "mb-6" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col md:flex-row items-start gap-6"${_scopeId}><div class="flex flex-col items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UiAvatar, {
                name: unref(user)?.nome || "",
                "avatar-type": unref(dadosOriginais)?.avatar,
                size: "xl"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                class: "mt-4",
                onClick: ($event) => mostrarSeletorAvatar.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` 📷 Alterar Foto `);
                  } else {
                    return [
                      createTextVNode(" 📷 Alterar Foto ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="flex-1 w-full"${_scopeId}><h2 class="text-2xl font-bold text-gray-800 mb-1"${_scopeId}>${ssrInterpolate(unref(dadosOriginais)?.nome_completo || unref(user)?.nome)}</h2><p class="text-lg text-gray-500 mb-4"${_scopeId}>`);
              if (unref(dadosOriginais) && Object.keys(unref(cargosMap)).length > 0) {
                _push2(`<!--[-->${ssrInterpolate(obterNomeCargo(unref(dadosOriginais).cargo_id))} - ${ssrInterpolate(obterNomeDepartamento(unref(dadosOriginais).departamento_id))}<!--]-->`);
              } else {
                _push2(`<!--[--> Carregando... <!--]-->`);
              }
              _push2(`</p><div class="flex flex-wrap gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UiBadge, { variant: "success" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`✓ Funcionário Ativo`);
                  } else {
                    return [
                      createTextVNode("✓ Funcionário Ativo")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiBadge, { variant: "info" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`📅 ${ssrInterpolate(formatarDataContratacao())}`);
                  } else {
                    return [
                      createTextVNode("📅 " + toDisplayString(formatarDataContratacao()), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col md:flex-row items-start gap-6" }, [
                  createVNode("div", { class: "flex flex-col items-center" }, [
                    createVNode(_component_UiAvatar, {
                      name: unref(user)?.nome || "",
                      "avatar-type": unref(dadosOriginais)?.avatar,
                      size: "xl"
                    }, null, 8, ["name", "avatar-type"]),
                    createVNode(_component_UiButton, {
                      variant: "ghost",
                      class: "mt-4",
                      onClick: ($event) => mostrarSeletorAvatar.value = true
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 📷 Alterar Foto ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  createVNode("div", { class: "flex-1 w-full" }, [
                    createVNode("h2", { class: "text-2xl font-bold text-gray-800 mb-1" }, toDisplayString(unref(dadosOriginais)?.nome_completo || unref(user)?.nome), 1),
                    createVNode("p", { class: "text-lg text-gray-500 mb-4" }, [
                      unref(dadosOriginais) && Object.keys(unref(cargosMap)).length > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString(obterNomeCargo(unref(dadosOriginais).cargo_id)) + " - " + toDisplayString(obterNomeDepartamento(unref(dadosOriginais).departamento_id)), 1)
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode(" Carregando... ")
                      ], 64))
                    ]),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      createVNode(_component_UiBadge, { variant: "success" }, {
                        default: withCtx(() => [
                          createTextVNode("✓ Funcionário Ativo")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_UiBadge, { variant: "info" }, {
                        default: withCtx(() => [
                          createTextVNode("📅 " + toDisplayString(formatarDataContratacao()), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiCard, {
          title: "👤 Dados Pessoais",
          class: "mb-6"
        }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => editandoDadosPessoais.value = !unref(editandoDadosPessoais)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(editandoDadosPessoais) ? "✕ Cancelar" : "✏️ Editar")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(editandoDadosPessoais) ? "✕ Cancelar" : "✏️ Editar"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UiButton, {
                  variant: "ghost",
                  onClick: ($event) => editandoDadosPessoais.value = !unref(editandoDadosPessoais)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editandoDadosPessoais) ? "✕ Cancelar" : "✏️ Editar"), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UiInput, {
                modelValue: unref(dadosPessoais).nome,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).nome = $event,
                label: "Nome Completo",
                disabled: !unref(editandoDadosPessoais) || !unref(isAdmin),
                hint: !unref(isAdmin) ? "Apenas administradores podem alterar o nome" : ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInputCPF, {
                modelValue: unref(dadosPessoais).cpf,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).cpf = $event,
                label: "CPF",
                disabled: !unref(editandoDadosPessoais) || !unref(isAdmin) || unref(camposEditadosUmaVez).cpf && !unref(isAdmin),
                hint: !unref(isAdmin) && unref(camposEditadosUmaVez).cpf ? "CPF já foi editado uma vez" : !unref(isAdmin) ? "Apenas administradores podem alterar o CPF" : ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInput, {
                modelValue: unref(dadosPessoais).rg,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).rg = $event,
                label: "RG",
                disabled: !unref(editandoDadosPessoais) || unref(camposEditadosUmaVez).rg && !unref(isAdmin),
                hint: unref(camposEditadosUmaVez).rg && !unref(isAdmin) ? "RG já foi editado uma vez" : ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInput, {
                modelValue: unref(dadosPessoais).dataNascimento,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).dataNascimento = $event,
                type: "date",
                label: "Data de Nascimento",
                disabled: !unref(editandoDadosPessoais) || unref(camposEditadosUmaVez).dataNascimento && !unref(isAdmin),
                hint: unref(camposEditadosUmaVez).dataNascimento && !unref(isAdmin) ? "Data de nascimento já foi editada uma vez" : ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiSelect, {
                modelValue: unref(dadosPessoais).sexo,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).sexo = $event,
                options: sexoOptions,
                label: "Sexo",
                disabled: !unref(editandoDadosPessoais) || unref(camposEditadosUmaVez).sexo && !unref(isAdmin),
                hint: unref(camposEditadosUmaVez).sexo && !unref(isAdmin) ? "Sexo já foi editado uma vez" : ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInputPhone, {
                modelValue: unref(dadosPessoais).telefone,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).telefone = $event,
                label: "Telefone",
                disabled: !unref(editandoDadosPessoais)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInput, {
                modelValue: unref(dadosPessoais).email_pessoal,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).email_pessoal = $event,
                type: "email",
                label: "Email Pessoal",
                disabled: !unref(editandoDadosPessoais)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInputPIS, {
                modelValue: unref(dadosPessoais).pis_pasep,
                "onUpdate:modelValue": ($event) => unref(dadosPessoais).pis_pasep = $event,
                label: "PIS/PASEP",
                disabled: !unref(editandoDadosPessoais)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              if (unref(editandoDadosPessoais)) {
                _push2(`<div class="mt-6 flex justify-end"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UiButton, {
                  icon: "💾",
                  onClick: salvarDadosPessoais,
                  disabled: unref(salvando)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(salvando) ? "Salvando..." : "Salvar Alterações")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar Alterações"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                  createVNode(_component_UiInput, {
                    modelValue: unref(dadosPessoais).nome,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).nome = $event,
                    label: "Nome Completo",
                    disabled: !unref(editandoDadosPessoais) || !unref(isAdmin),
                    hint: !unref(isAdmin) ? "Apenas administradores podem alterar o nome" : ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "hint"]),
                  createVNode(_component_UiInputCPF, {
                    modelValue: unref(dadosPessoais).cpf,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).cpf = $event,
                    label: "CPF",
                    disabled: !unref(editandoDadosPessoais) || !unref(isAdmin) || unref(camposEditadosUmaVez).cpf && !unref(isAdmin),
                    hint: !unref(isAdmin) && unref(camposEditadosUmaVez).cpf ? "CPF já foi editado uma vez" : !unref(isAdmin) ? "Apenas administradores podem alterar o CPF" : ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "hint"]),
                  createVNode(_component_UiInput, {
                    modelValue: unref(dadosPessoais).rg,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).rg = $event,
                    label: "RG",
                    disabled: !unref(editandoDadosPessoais) || unref(camposEditadosUmaVez).rg && !unref(isAdmin),
                    hint: unref(camposEditadosUmaVez).rg && !unref(isAdmin) ? "RG já foi editado uma vez" : ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "hint"]),
                  createVNode(_component_UiInput, {
                    modelValue: unref(dadosPessoais).dataNascimento,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).dataNascimento = $event,
                    type: "date",
                    label: "Data de Nascimento",
                    disabled: !unref(editandoDadosPessoais) || unref(camposEditadosUmaVez).dataNascimento && !unref(isAdmin),
                    hint: unref(camposEditadosUmaVez).dataNascimento && !unref(isAdmin) ? "Data de nascimento já foi editada uma vez" : ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "hint"]),
                  createVNode(_component_UiSelect, {
                    modelValue: unref(dadosPessoais).sexo,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).sexo = $event,
                    options: sexoOptions,
                    label: "Sexo",
                    disabled: !unref(editandoDadosPessoais) || unref(camposEditadosUmaVez).sexo && !unref(isAdmin),
                    hint: unref(camposEditadosUmaVez).sexo && !unref(isAdmin) ? "Sexo já foi editado uma vez" : ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "hint"]),
                  createVNode(_component_UiInputPhone, {
                    modelValue: unref(dadosPessoais).telefone,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).telefone = $event,
                    label: "Telefone",
                    disabled: !unref(editandoDadosPessoais)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  createVNode(_component_UiInput, {
                    modelValue: unref(dadosPessoais).email_pessoal,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).email_pessoal = $event,
                    type: "email",
                    label: "Email Pessoal",
                    disabled: !unref(editandoDadosPessoais)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  createVNode(_component_UiInputPIS, {
                    modelValue: unref(dadosPessoais).pis_pasep,
                    "onUpdate:modelValue": ($event) => unref(dadosPessoais).pis_pasep = $event,
                    label: "PIS/PASEP",
                    disabled: !unref(editandoDadosPessoais)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                ]),
                unref(editandoDadosPessoais) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-6 flex justify-end"
                }, [
                  createVNode(_component_UiButton, {
                    icon: "💾",
                    onClick: salvarDadosPessoais,
                    disabled: unref(salvando)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar Alterações"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiCard, {
          title: "💼 Dados Profissionais",
          class: "mb-6"
        }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
              if (!unref(isAdmin)) {
                _push2(`<span class="text-sm text-gray-500"${_scopeId}>(somente visualização)</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(isAdmin)) {
                _push2(ssrRenderComponent(_component_UiButton, {
                  variant: "ghost",
                  onClick: ($event) => editandoDadosProfissionais.value = !unref(editandoDadosProfissionais)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(editandoDadosProfissionais) ? "✕ Cancelar" : "✏️ Editar")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(editandoDadosProfissionais) ? "✕ Cancelar" : "✏️ Editar"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  !unref(isAdmin) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-sm text-gray-500"
                  }, "(somente visualização)")) : createCommentVNode("", true),
                  unref(isAdmin) ? (openBlock(), createBlock(_component_UiButton, {
                    key: 1,
                    variant: "ghost",
                    onClick: ($event) => editandoDadosProfissionais.value = !unref(editandoDadosProfissionais)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(editandoDadosProfissionais) ? "✕ Cancelar" : "✏️ Editar"), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!unref(isAdmin)) {
                _push2(ssrRenderComponent(_component_UiAlert, {
                  variant: "warning",
                  class: "mb-6"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Estes dados são gerenciados pelo RH e não podem ser alterados por você. `);
                    } else {
                      return [
                        createTextVNode(" Estes dados são gerenciados pelo RH e não podem ser alterados por você. ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(_component_UiAlert, {
                  variant: "info",
                  class: "mb-6"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Como administrador, você pode editar seus próprios dados profissionais. `);
                    } else {
                      return [
                        createTextVNode(" Como administrador, você pode editar seus próprios dados profissionais. ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              }
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}>`);
              if (!unref(isAdmin) || !unref(editandoDadosProfissionais)) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Cargo</label><p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl"${_scopeId}>${ssrInterpolate(obterNomeCargo(unref(dadosOriginais)?.cargo_id) || unref(user)?.cargo || "--")}</p></div>`);
              } else {
                _push2(ssrRenderComponent(_component_UiSelect, {
                  modelValue: unref(dadosProfissionais).cargo,
                  "onUpdate:modelValue": ($event) => unref(dadosProfissionais).cargo = $event,
                  options: unref(cargosOptions),
                  label: "Cargo",
                  placeholder: "Selecione um cargo..."
                }, null, _parent2, _scopeId));
              }
              if (!unref(isAdmin) || !unref(editandoDadosProfissionais)) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Departamento</label><p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl"${_scopeId}>${ssrInterpolate(obterNomeDepartamento(unref(dadosOriginais)?.departamento_id) || unref(user)?.departamento || "--")}</p></div>`);
              } else {
                _push2(ssrRenderComponent(_component_UiSelect, {
                  modelValue: unref(dadosProfissionais).departamento,
                  "onUpdate:modelValue": ($event) => unref(dadosProfissionais).departamento = $event,
                  options: unref(departamentosOptions),
                  label: "Departamento",
                  placeholder: "Selecione um departamento..."
                }, null, _parent2, _scopeId));
              }
              if (!unref(isAdmin) || !unref(editandoDadosProfissionais)) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Data de Admissão</label><p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl"${_scopeId}>${ssrInterpolate(formatarData(unref(dadosProfissionais).dataAdmissao))}</p></div>`);
              } else {
                _push2(ssrRenderComponent(_component_UiInput, {
                  modelValue: unref(dadosProfissionais).dataAdmissao,
                  "onUpdate:modelValue": ($event) => unref(dadosProfissionais).dataAdmissao = $event,
                  type: "date",
                  label: "Data de Admissão"
                }, null, _parent2, _scopeId));
              }
              if (!unref(isAdmin) || !unref(editandoDadosProfissionais)) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Tipo de Contrato</label><p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl"${_scopeId}>${ssrInterpolate(unref(dadosProfissionais).tipoContrato)}</p></div>`);
              } else {
                _push2(ssrRenderComponent(_component_UiSelect, {
                  modelValue: unref(dadosProfissionais).tipoContrato,
                  "onUpdate:modelValue": ($event) => unref(dadosProfissionais).tipoContrato = $event,
                  options: tipoContratoOptions,
                  label: "Tipo de Contrato"
                }, null, _parent2, _scopeId));
              }
              if (!unref(isAdmin) || !unref(editandoDadosProfissionais)) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Empresa</label><p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl"${_scopeId}>${ssrInterpolate(obterNomeEmpresa(unref(dadosOriginais)?.empresa_id) || "--")}</p></div>`);
              } else {
                _push2(ssrRenderComponent(_component_UiSelect, {
                  modelValue: unref(dadosProfissionais).empresa,
                  "onUpdate:modelValue": ($event) => unref(dadosProfissionais).empresa = $event,
                  options: unref(empresasOptions),
                  label: "Empresa",
                  placeholder: "Selecione uma empresa..."
                }, null, _parent2, _scopeId));
              }
              _push2(`</div>`);
              if (unref(isAdmin) && unref(editandoDadosProfissionais)) {
                _push2(`<div class="mt-6 flex justify-end"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UiButton, {
                  icon: "💾",
                  onClick: salvarDadosProfissionais,
                  disabled: unref(salvando)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(salvando) ? "Salvando..." : "Salvar Alterações")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar Alterações"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                !unref(isAdmin) ? (openBlock(), createBlock(_component_UiAlert, {
                  key: 0,
                  variant: "warning",
                  class: "mb-6"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Estes dados são gerenciados pelo RH e não podem ser alterados por você. ")
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(_component_UiAlert, {
                  key: 1,
                  variant: "info",
                  class: "mb-6"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Como administrador, você pode editar seus próprios dados profissionais. ")
                  ]),
                  _: 1
                })),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                  !unref(isAdmin) || !unref(editandoDadosProfissionais) ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Cargo"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl" }, toDisplayString(obterNomeCargo(unref(dadosOriginais)?.cargo_id) || unref(user)?.cargo || "--"), 1)
                  ])) : (openBlock(), createBlock(_component_UiSelect, {
                    key: 1,
                    modelValue: unref(dadosProfissionais).cargo,
                    "onUpdate:modelValue": ($event) => unref(dadosProfissionais).cargo = $event,
                    options: unref(cargosOptions),
                    label: "Cargo",
                    placeholder: "Selecione um cargo..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])),
                  !unref(isAdmin) || !unref(editandoDadosProfissionais) ? (openBlock(), createBlock("div", { key: 2 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Departamento"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl" }, toDisplayString(obterNomeDepartamento(unref(dadosOriginais)?.departamento_id) || unref(user)?.departamento || "--"), 1)
                  ])) : (openBlock(), createBlock(_component_UiSelect, {
                    key: 3,
                    modelValue: unref(dadosProfissionais).departamento,
                    "onUpdate:modelValue": ($event) => unref(dadosProfissionais).departamento = $event,
                    options: unref(departamentosOptions),
                    label: "Departamento",
                    placeholder: "Selecione um departamento..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])),
                  !unref(isAdmin) || !unref(editandoDadosProfissionais) ? (openBlock(), createBlock("div", { key: 4 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Data de Admissão"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl" }, toDisplayString(formatarData(unref(dadosProfissionais).dataAdmissao)), 1)
                  ])) : (openBlock(), createBlock(_component_UiInput, {
                    key: 5,
                    modelValue: unref(dadosProfissionais).dataAdmissao,
                    "onUpdate:modelValue": ($event) => unref(dadosProfissionais).dataAdmissao = $event,
                    type: "date",
                    label: "Data de Admissão"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])),
                  !unref(isAdmin) || !unref(editandoDadosProfissionais) ? (openBlock(), createBlock("div", { key: 6 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Tipo de Contrato"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl" }, toDisplayString(unref(dadosProfissionais).tipoContrato), 1)
                  ])) : (openBlock(), createBlock(_component_UiSelect, {
                    key: 7,
                    modelValue: unref(dadosProfissionais).tipoContrato,
                    "onUpdate:modelValue": ($event) => unref(dadosProfissionais).tipoContrato = $event,
                    options: tipoContratoOptions,
                    label: "Tipo de Contrato"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])),
                  !unref(isAdmin) || !unref(editandoDadosProfissionais) ? (openBlock(), createBlock("div", { key: 8 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Empresa"),
                    createVNode("p", { class: "text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl" }, toDisplayString(obterNomeEmpresa(unref(dadosOriginais)?.empresa_id) || "--"), 1)
                  ])) : (openBlock(), createBlock(_component_UiSelect, {
                    key: 9,
                    modelValue: unref(dadosProfissionais).empresa,
                    "onUpdate:modelValue": ($event) => unref(dadosProfissionais).empresa = $event,
                    options: unref(empresasOptions),
                    label: "Empresa",
                    placeholder: "Selecione uma empresa..."
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]))
                ]),
                unref(isAdmin) && unref(editandoDadosProfissionais) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-6 flex justify-end"
                }, [
                  createVNode(_component_UiButton, {
                    icon: "💾",
                    onClick: salvarDadosProfissionais,
                    disabled: unref(salvando)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar Alterações"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiCard, {
          title: "💰 Dados Financeiros",
          class: "mb-6"
        }, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => editandoPagamento.value = !unref(editandoPagamento)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(editandoPagamento) ? "✕ Cancelar" : "✏️ Editar")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(editandoPagamento) ? "✕ Cancelar" : "✏️ Editar"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UiButton, {
                  variant: "ghost",
                  onClick: ($event) => editandoPagamento.value = !unref(editandoPagamento)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editandoPagamento) ? "✕ Cancelar" : "✏️ Editar"), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Salário Base (R$)</label><div class="p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><p class="text-lg font-bold text-green-700"${_scopeId}>${ssrInterpolate(unref(mostrarSalario) ? formatarMoeda(unref(dadosFinanceiros).salario_base) : "••••••••")}</p><svg class="${ssrRenderClass([{ "text-green-600": unref(mostrarSalario) }, "w-5 h-5 text-gray-400"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}>`);
              if (!unref(mostrarSalario)) {
                _push2(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId}></path>`);
              } else {
                _push2(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"${_scopeId}></path>`);
              }
              _push2(`</svg></div><p class="text-xs text-gray-500 mt-1 flex items-center gap-1"${_scopeId}><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"${_scopeId}></path></svg> ${ssrInterpolate(unref(mostrarSalario) ? "Clique para ocultar" : "Clique para revelar")} • Campo bloqueado para edição </p></div></div>`);
              _push2(ssrRenderComponent(_component_UiSelect, {
                modelValue: unref(dadosFinanceiros).forma_pagamento,
                "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).forma_pagamento = $event,
                options: formaPagamentoOptions,
                label: "Forma de Pagamento",
                disabled: !unref(editandoPagamento)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiSelect, {
                modelValue: unref(dadosFinanceiros).banco,
                "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).banco = $event,
                options: bancosOptions,
                label: "Banco",
                disabled: !unref(editandoPagamento)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiSelect, {
                modelValue: unref(dadosFinanceiros).tipo_conta,
                "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).tipo_conta = $event,
                options: tipoContaOptions,
                label: "Tipo de Conta",
                disabled: !unref(editandoPagamento)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInput, {
                modelValue: unref(dadosFinanceiros).agencia,
                "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).agencia = $event,
                label: "Agência",
                disabled: !unref(editandoPagamento)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiInput, {
                modelValue: unref(dadosFinanceiros).conta,
                "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).conta = $event,
                label: "Conta",
                disabled: !unref(editandoPagamento)
              }, null, _parent2, _scopeId));
              if (unref(dadosFinanceiros).forma_pagamento === "pix") {
                _push2(ssrRenderComponent(_component_UiInput, {
                  modelValue: unref(dadosFinanceiros).chave_pix,
                  "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).chave_pix = $event,
                  label: "Chave PIX",
                  placeholder: "Digite sua chave PIX (CPF, email, telefone ou chave aleatória)",
                  disabled: !unref(editandoPagamento)
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (unref(editandoPagamento)) {
                _push2(`<div class="mt-6 flex justify-end"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UiButton, {
                  icon: "💾",
                  onClick: salvarDadosFinanceiros,
                  disabled: unref(salvando)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(salvando) ? "Salvando..." : "Salvar Alterações")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar Alterações"), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Salário Base (R$)"),
                    createVNode("div", {
                      class: "p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors",
                      onClick: ($event) => mostrarSalario.value = !unref(mostrarSalario)
                    }, [
                      createVNode("div", { class: "flex items-center justify-between" }, [
                        createVNode("p", { class: "text-lg font-bold text-green-700" }, toDisplayString(unref(mostrarSalario) ? formatarMoeda(unref(dadosFinanceiros).salario_base) : "••••••••"), 1),
                        (openBlock(), createBlock("svg", {
                          class: ["w-5 h-5 text-gray-400", { "text-green-600": unref(mostrarSalario) }],
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          !unref(mostrarSalario) ? (openBlock(), createBlock("path", {
                            key: 0,
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          })) : (openBlock(), createBlock("path", {
                            key: 1,
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          }))
                        ], 2))
                      ]),
                      createVNode("p", { class: "text-xs text-gray-500 mt-1 flex items-center gap-1" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-3 h-3",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          })
                        ])),
                        createTextVNode(" " + toDisplayString(unref(mostrarSalario) ? "Clique para ocultar" : "Clique para revelar") + " • Campo bloqueado para edição ", 1)
                      ])
                    ], 8, ["onClick"])
                  ]),
                  createVNode(_component_UiSelect, {
                    modelValue: unref(dadosFinanceiros).forma_pagamento,
                    "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).forma_pagamento = $event,
                    options: formaPagamentoOptions,
                    label: "Forma de Pagamento",
                    disabled: !unref(editandoPagamento)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  createVNode(_component_UiSelect, {
                    modelValue: unref(dadosFinanceiros).banco,
                    "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).banco = $event,
                    options: bancosOptions,
                    label: "Banco",
                    disabled: !unref(editandoPagamento)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  createVNode(_component_UiSelect, {
                    modelValue: unref(dadosFinanceiros).tipo_conta,
                    "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).tipo_conta = $event,
                    options: tipoContaOptions,
                    label: "Tipo de Conta",
                    disabled: !unref(editandoPagamento)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  createVNode(_component_UiInput, {
                    modelValue: unref(dadosFinanceiros).agencia,
                    "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).agencia = $event,
                    label: "Agência",
                    disabled: !unref(editandoPagamento)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  createVNode(_component_UiInput, {
                    modelValue: unref(dadosFinanceiros).conta,
                    "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).conta = $event,
                    label: "Conta",
                    disabled: !unref(editandoPagamento)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                  unref(dadosFinanceiros).forma_pagamento === "pix" ? (openBlock(), createBlock(_component_UiInput, {
                    key: 0,
                    modelValue: unref(dadosFinanceiros).chave_pix,
                    "onUpdate:modelValue": ($event) => unref(dadosFinanceiros).chave_pix = $event,
                    label: "Chave PIX",
                    placeholder: "Digite sua chave PIX (CPF, email, telefone ou chave aleatória)",
                    disabled: !unref(editandoPagamento)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])) : createCommentVNode("", true)
                ]),
                unref(editandoPagamento) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-6 flex justify-end"
                }, [
                  createVNode(_component_UiButton, {
                    icon: "💾",
                    onClick: salvarDadosFinanceiros,
                    disabled: unref(salvando)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar Alterações"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiCard, {
          title: "🎁 Benefícios",
          class: "mb-6"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UiAlert, {
                variant: "info",
                class: "mb-6"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Estes benefícios são gerenciados pelo RH e não podem ser alterados por você. `);
                  } else {
                    return [
                      createTextVNode(" Estes benefícios são gerenciados pelo RH e não podem ser alterados por você. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"${_scopeId}>`);
              if (unref(beneficiosAtivos).vale_transporte) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Vale Transporte</label><div class="p-3 bg-green-50 rounded-xl border border-green-200"${_scopeId}><p class="text-lg font-semibold text-green-800"${_scopeId}>${ssrInterpolate(formatarMoeda(unref(beneficiosAtivos).vale_transporte.valor))}</p><p class="text-xs text-green-600 mt-1"${_scopeId}>✓ Ativo • Gerenciado pelo RH</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(beneficiosAtivos).cesta_basica) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Cesta Básica</label><div class="p-3 bg-blue-50 rounded-xl border border-blue-200"${_scopeId}><p class="text-lg font-semibold text-blue-800"${_scopeId}>${ssrInterpolate(formatarMoeda(unref(beneficiosAtivos).cesta_basica.valor))}</p><p class="text-xs text-blue-600 mt-1"${_scopeId}>✓ Ativo • Gerenciado pelo RH</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(beneficiosAtivos).plano_saude) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Plano de Saúde</label><div class="p-3 bg-purple-50 rounded-xl border border-purple-200"${_scopeId}><p class="text-lg font-semibold text-purple-800"${_scopeId}>${ssrInterpolate(formatarMoeda(unref(beneficiosAtivos).plano_saude.valor_funcionario))}</p><p class="text-xs text-purple-600 mt-1"${_scopeId}>✓ Ativo • Gerenciado pelo RH</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(beneficiosAtivos).plano_odonto) {
                _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>Plano Odontológico</label><div class="p-3 bg-indigo-50 rounded-xl border border-indigo-200"${_scopeId}><p class="text-lg font-semibold text-indigo-800"${_scopeId}>${ssrInterpolate(formatarMoeda(unref(beneficiosAtivos).plano_odonto.valor_funcionario))}</p><p class="text-xs text-indigo-600 mt-1"${_scopeId}>✓ Ativo • Gerenciado pelo RH</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(unref(beneficiosPersonalizadosAtivos), (beneficio) => {
                _push2(`<div class="beneficio-personalizado"${_scopeId}><label class="block text-sm font-medium text-gray-500 mb-1"${_scopeId}>${ssrInterpolate(beneficio.nome)}</label><div class="p-3 bg-orange-50 rounded-xl border border-orange-200"${_scopeId}><div class="flex items-center gap-2 mb-1"${_scopeId}><span class="text-lg"${_scopeId}>${ssrInterpolate(beneficio.icone || "🎯")}</span><p class="text-lg font-semibold text-orange-800"${_scopeId}>${ssrInterpolate(formatarMoeda(beneficio.valor))}</p></div><p class="text-xs text-orange-600"${_scopeId}>✓ Ativo • Gerenciado pelo RH</p>`);
                if (beneficio.descricao) {
                  _push2(`<p class="text-xs text-gray-600 mt-1"${_scopeId}>${ssrInterpolate(beneficio.descricao)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]-->`);
              if (!unref(temBeneficios)) {
                _push2(`<div class="col-span-full"${_scopeId}><div class="text-center py-8 bg-gray-50 rounded-xl border border-gray-200"${_scopeId}><svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"${_scopeId}></path></svg><p class="text-gray-600 font-medium"${_scopeId}>Nenhum benefício configurado</p><p class="text-sm text-gray-500 mt-1"${_scopeId}>Entre em contato com o RH para mais informações</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode(_component_UiAlert, {
                  variant: "info",
                  class: "mb-6"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Estes benefícios são gerenciados pelo RH e não podem ser alterados por você. ")
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
                  unref(beneficiosAtivos).vale_transporte ? (openBlock(), createBlock("div", { key: 0 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Vale Transporte"),
                    createVNode("div", { class: "p-3 bg-green-50 rounded-xl border border-green-200" }, [
                      createVNode("p", { class: "text-lg font-semibold text-green-800" }, toDisplayString(formatarMoeda(unref(beneficiosAtivos).vale_transporte.valor)), 1),
                      createVNode("p", { class: "text-xs text-green-600 mt-1" }, "✓ Ativo • Gerenciado pelo RH")
                    ])
                  ])) : createCommentVNode("", true),
                  unref(beneficiosAtivos).cesta_basica ? (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Cesta Básica"),
                    createVNode("div", { class: "p-3 bg-blue-50 rounded-xl border border-blue-200" }, [
                      createVNode("p", { class: "text-lg font-semibold text-blue-800" }, toDisplayString(formatarMoeda(unref(beneficiosAtivos).cesta_basica.valor)), 1),
                      createVNode("p", { class: "text-xs text-blue-600 mt-1" }, "✓ Ativo • Gerenciado pelo RH")
                    ])
                  ])) : createCommentVNode("", true),
                  unref(beneficiosAtivos).plano_saude ? (openBlock(), createBlock("div", { key: 2 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Plano de Saúde"),
                    createVNode("div", { class: "p-3 bg-purple-50 rounded-xl border border-purple-200" }, [
                      createVNode("p", { class: "text-lg font-semibold text-purple-800" }, toDisplayString(formatarMoeda(unref(beneficiosAtivos).plano_saude.valor_funcionario)), 1),
                      createVNode("p", { class: "text-xs text-purple-600 mt-1" }, "✓ Ativo • Gerenciado pelo RH")
                    ])
                  ])) : createCommentVNode("", true),
                  unref(beneficiosAtivos).plano_odonto ? (openBlock(), createBlock("div", { key: 3 }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, "Plano Odontológico"),
                    createVNode("div", { class: "p-3 bg-indigo-50 rounded-xl border border-indigo-200" }, [
                      createVNode("p", { class: "text-lg font-semibold text-indigo-800" }, toDisplayString(formatarMoeda(unref(beneficiosAtivos).plano_odonto.valor_funcionario)), 1),
                      createVNode("p", { class: "text-xs text-indigo-600 mt-1" }, "✓ Ativo • Gerenciado pelo RH")
                    ])
                  ])) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(beneficiosPersonalizadosAtivos), (beneficio) => {
                    return openBlock(), createBlock("div", {
                      key: beneficio.nome,
                      class: "beneficio-personalizado"
                    }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-500 mb-1" }, toDisplayString(beneficio.nome), 1),
                      createVNode("div", { class: "p-3 bg-orange-50 rounded-xl border border-orange-200" }, [
                        createVNode("div", { class: "flex items-center gap-2 mb-1" }, [
                          createVNode("span", { class: "text-lg" }, toDisplayString(beneficio.icone || "🎯"), 1),
                          createVNode("p", { class: "text-lg font-semibold text-orange-800" }, toDisplayString(formatarMoeda(beneficio.valor)), 1)
                        ]),
                        createVNode("p", { class: "text-xs text-orange-600" }, "✓ Ativo • Gerenciado pelo RH"),
                        beneficio.descricao ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-xs text-gray-600 mt-1"
                        }, toDisplayString(beneficio.descricao), 1)) : createCommentVNode("", true)
                      ])
                    ]);
                  }), 128)),
                  !unref(temBeneficios) ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "col-span-full"
                  }, [
                    createVNode("div", { class: "text-center py-8 bg-gray-50 rounded-xl border border-gray-200" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-12 h-12 text-gray-400 mx-auto mb-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        })
                      ])),
                      createVNode("p", { class: "text-gray-600 font-medium" }, "Nenhum benefício configurado"),
                      createVNode("p", { class: "text-sm text-gray-500 mt-1" }, "Entre em contato com o RH para mais informações")
                    ])
                  ])) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UiNotification, {
          show: unref(mostrarNotificacao),
          title: unref(notificacao).title,
          message: unref(notificacao).message,
          variant: unref(notificacao).variant,
          onClose: ($event) => mostrarNotificacao.value = false
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiAvatarSelector, {
          show: unref(mostrarSeletorAvatar),
          "user-name": unref(dadosOriginais)?.nome_completo || unref(user)?.nome || "",
          "current-avatar": unref(dadosOriginais)?.avatar,
          onClose: ($event) => mostrarSeletorAvatar.value = false,
          onSave: salvarAvatar
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/meus-dados.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=meus-dados-DNHlrcn4.mjs.map
