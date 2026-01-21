import { _ as __nuxt_component_0 } from './UiPageHeader-Cc5ywX71.mjs';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2 } from './UiCard-Co7bHBSC.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_7 } from './UiModal-C-UfYvvP.mjs';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { _ as __nuxt_component_5 } from './UiTextarea-CCA7ly10.mjs';
import { _ as __nuxt_component_6 } from './UiSelect-DFt9aazW.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, createVNode, unref, createBlock, openBlock, createCommentVNode, toDisplayString, isRef, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useCargos } from './useCargos-CxsoMI2z.mjs';
import './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cargos",
  __ssrInlineRender: true,
  setup(__props) {
    const { cargos, loading, salvarCargo } = useCargos();
    const modalAberto = ref(false);
    const editando = ref(null);
    const form = ref({ nome: "", descricao: "", nivel: "" });
    const mostrarNotificacao = ref(false);
    const notificacao = ref({
      title: "",
      message: "",
      variant: "success"
    });
    const superioresOptions = computed(() => {
      return cargos.value.filter((c) => !editando.value || c.id !== editando.value.id).map((c) => ({
        value: c.id,
        label: c.nome
      }));
    });
    const abrirModal = (cargo) => {
      editando.value = cargo || null;
      form.value = cargo ? { ...cargo } : { nome: "", descricao: "", nivel: "" };
      modalAberto.value = true;
    };
    const salvar = async () => {
      const dadosCargo = editando.value ? { ...form.value, id: editando.value.id } : form.value;
      const resultado = await salvarCargo(dadosCargo);
      notificacao.value = {
        title: resultado.success ? "Sucesso!" : "Erro!",
        message: resultado.message,
        variant: resultado.success ? "success" : "error"
      };
      mostrarNotificacao.value = true;
      if (resultado.success) {
        modalAberto.value = false;
      }
      setTimeout(() => {
        mostrarNotificacao.value = false;
      }, 3e3);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPageHeader = __nuxt_component_0;
      const _component_UiButton = __nuxt_component_1;
      const _component_UiCard = __nuxt_component_2;
      const _component_UiModal = __nuxt_component_3;
      const _component_UiInput = __nuxt_component_4;
      const _component_UiTextarea = __nuxt_component_5;
      const _component_UiSelect = __nuxt_component_6;
      const _component_UiNotification = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UiPageHeader, {
        title: "Cargos",
        description: "Defina os cargos e hierarquia da empresa"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UiButton, {
              size: "lg",
              icon: "➕",
              onClick: ($event) => abrirModal()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Novo Cargo `);
                } else {
                  return [
                    createTextVNode(" Novo Cargo ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UiButton, {
                size: "lg",
                icon: "➕",
                onClick: ($event) => abrirModal()
              }, {
                default: withCtx(() => [
                  createTextVNode(" Novo Cargo ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(cargos), (cargo) => {
        _push(ssrRenderComponent(_component_UiCard, {
          key: cargo.id,
          padding: "p-6"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center"${_scopeId}><svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"${_scopeId}></path></svg></div><div${_scopeId}><h3 class="text-xl font-bold text-gray-800"${_scopeId}>${ssrInterpolate(cargo.nome)}</h3><p class="text-gray-500"${_scopeId}>${ssrInterpolate(cargo.descricao)}</p>`);
              if (cargo.nivel) {
                _push2(`<p class="text-sm text-gray-400 mt-1"${_scopeId}> Nível: ${ssrInterpolate(cargo.nivel)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => abrirModal(cargo)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`✏️ Editar`);
                  } else {
                    return [
                      createTextVNode("✏️ Editar")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("div", { class: "w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-7 h-7 text-blue-600",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        })
                      ]))
                    ]),
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-xl font-bold text-gray-800" }, toDisplayString(cargo.nome), 1),
                      createVNode("p", { class: "text-gray-500" }, toDisplayString(cargo.descricao), 1),
                      cargo.nivel ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-gray-400 mt-1"
                      }, " Nível: " + toDisplayString(cargo.nivel), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode(_component_UiButton, {
                    variant: "ghost",
                    onClick: ($event) => abrirModal(cargo)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("✏️ Editar")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalAberto),
        "onUpdate:modelValue": ($event) => isRef(modalAberto) ? modalAberto.value = $event : null,
        title: unref(editando) ? "Editar Cargo" : "Novo Cargo"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).nome,
              "onUpdate:modelValue": ($event) => unref(form).nome = $event,
              label: "Nome do Cargo",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiTextarea, {
              modelValue: unref(form).descricao,
              "onUpdate:modelValue": ($event) => unref(form).descricao = $event,
              label: "Descrição"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiSelect, {
              modelValue: unref(form).nivel,
              "onUpdate:modelValue": ($event) => unref(form).nivel = $event,
              options: unref(superioresOptions),
              label: "Cargo Superior (Reporta a)",
              placeholder: "Nenhum (cargo mais alto)"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end gap-3 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "secondary",
              onClick: ($event) => modalAberto.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancelar`);
                } else {
                  return [
                    createTextVNode("Cancelar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              type: "submit",
              icon: "💾",
              disabled: unref(loading)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Salvar`);
                } else {
                  return [
                    createTextVNode("Salvar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(salvar, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode(_component_UiInput, {
                  modelValue: unref(form).nome,
                  "onUpdate:modelValue": ($event) => unref(form).nome = $event,
                  label: "Nome do Cargo",
                  required: ""
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UiTextarea, {
                  modelValue: unref(form).descricao,
                  "onUpdate:modelValue": ($event) => unref(form).descricao = $event,
                  label: "Descrição"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UiSelect, {
                  modelValue: unref(form).nivel,
                  "onUpdate:modelValue": ($event) => unref(form).nivel = $event,
                  options: unref(superioresOptions),
                  label: "Cargo Superior (Reporta a)",
                  placeholder: "Nenhum (cargo mais alto)"
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
                createVNode("div", { class: "flex justify-end gap-3 pt-4" }, [
                  createVNode(_component_UiButton, {
                    variant: "secondary",
                    onClick: ($event) => modalAberto.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancelar")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UiButton, {
                    type: "submit",
                    icon: "💾",
                    disabled: unref(loading)
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Salvar")
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ])
              ], 32)
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/cargos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cargos-C_eSzEN7.mjs.map
