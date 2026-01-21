import { _ as __nuxt_component_0 } from './UiPageHeader-Cc5ywX71.mjs';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2 } from './UiCard-Co7bHBSC.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_7 } from './UiModal-C-UfYvvP.mjs';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { _ as __nuxt_component_5 } from './UiTextarea-CCA7ly10.mjs';
import { _ as __nuxt_component_6 } from './UiSelect-DFt9aazW.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, createVNode, unref, createBlock, openBlock, toDisplayString, isRef, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useAdmin } from './useAdmin-B-9JwZLf.mjs';
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
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "departamentos",
  __ssrInlineRender: true,
  setup(__props) {
    const { nomeAdmin } = useAdmin();
    const modalAberto = ref(false);
    const editando = ref(null);
    const form = ref({ nome: "", descricao: "", responsavel: "" });
    const carregando = ref(true);
    const salvando = ref(false);
    const mostrarNotificacao = ref(false);
    const notificacao = ref({
      title: "",
      message: "",
      variant: "success"
    });
    const departamentos = ref([]);
    const responsaveisOptions = computed(() => [
      { value: nomeAdmin.value, label: `${nomeAdmin.value} (Admin) ⭐` }
      // Outros responsáveis serão carregados da API
    ]);
    const carregarDepartamentos = async () => {
      carregando.value = true;
      try {
        const response = await $fetch("/api/departamentos");
        if (response.success && response.data) {
          departamentos.value = response.data.map((d) => ({
            ...d,
            funcionarios: 0
            // TODO: Contar funcionários por departamento
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar departamentos:", error);
        mostrarMensagem("Erro!", "Não foi possível carregar departamentos", "error");
      } finally {
        carregando.value = false;
      }
    };
    const abrirModal = (dept) => {
      editando.value = dept || null;
      form.value = dept ? { nome: dept.nome, descricao: dept.descricao, responsavel: dept.responsavel } : { nome: "", descricao: "", responsavel: nomeAdmin.value };
      modalAberto.value = true;
    };
    const salvar = async () => {
      salvando.value = true;
      try {
        const dados = editando.value ? { ...form.value, id: editando.value.id } : form.value;
        const response = await $fetch("/api/departamentos/criar", {
          method: "POST",
          body: dados
        });
        if (response.success) {
          mostrarMensagem("Sucesso!", response.message, "success");
          modalAberto.value = false;
          await carregarDepartamentos();
        }
      } catch (error) {
        console.error("Erro ao salvar departamento:", error);
        mostrarMensagem("Erro!", error.data?.message || "Não foi possível salvar o departamento", "error");
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
        title: "Departamentos",
        description: "Organize os setores da empresa"
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
                  _push3(` Novo Departamento `);
                } else {
                  return [
                    createTextVNode(" Novo Departamento ")
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
                  createTextVNode(" Novo Departamento ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(carregando)) {
        _push(`<div class="flex items-center justify-center py-12"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div><p class="text-gray-600">Carregando departamentos...</p></div></div>`);
      } else if (unref(departamentos).length === 0) {
        _push(`<div class="text-center py-12"><p class="text-gray-500 mb-4">Nenhum departamento cadastrado</p>`);
        _push(ssrRenderComponent(_component_UiButton, {
          onClick: ($event) => abrirModal()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`➕ Criar Primeiro Departamento`);
            } else {
              return [
                createTextVNode("➕ Criar Primeiro Departamento")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        ssrRenderList(unref(departamentos), (dept) => {
          _push(ssrRenderComponent(_component_UiCard, {
            key: dept.id,
            padding: "p-6"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start justify-between mb-4"${_scopeId}><div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center"${_scopeId}><svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"${_scopeId}></path></svg></div>`);
                _push2(ssrRenderComponent(_component_UiButton, {
                  variant: "ghost",
                  size: "sm",
                  onClick: ($event) => abrirModal(dept)
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
                _push2(`</div><h3 class="text-xl font-bold text-gray-800 mb-1"${_scopeId}>${ssrInterpolate(dept.nome)}</h3><p class="text-gray-500 mb-3"${_scopeId}>${ssrInterpolate(dept.descricao)}</p><div class="flex items-center gap-2 text-sm text-gray-600"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg> Responsável: ${ssrInterpolate(dept.responsavel)}</div><div class="mt-3 pt-3 border-t border-gray-100"${_scopeId}><span class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(dept.funcionarios)} funcionários</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-start justify-between mb-4" }, [
                    createVNode("div", { class: "w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-7 h-7 text-purple-600",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        })
                      ]))
                    ]),
                    createVNode(_component_UiButton, {
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => abrirModal(dept)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("✏️ Editar")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  createVNode("h3", { class: "text-xl font-bold text-gray-800 mb-1" }, toDisplayString(dept.nome), 1),
                  createVNode("p", { class: "text-gray-500 mb-3" }, toDisplayString(dept.descricao), 1),
                  createVNode("div", { class: "flex items-center gap-2 text-sm text-gray-600" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      })
                    ])),
                    createTextVNode(" Responsável: " + toDisplayString(dept.responsavel), 1)
                  ]),
                  createVNode("div", { class: "mt-3 pt-3 border-t border-gray-100" }, [
                    createVNode("span", { class: "text-sm text-gray-500" }, toDisplayString(dept.funcionarios) + " funcionários", 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalAberto),
        "onUpdate:modelValue": ($event) => isRef(modalAberto) ? modalAberto.value = $event : null,
        title: unref(editando) ? "Editar Departamento" : "Novo Departamento"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).nome,
              "onUpdate:modelValue": ($event) => unref(form).nome = $event,
              label: "Nome do Departamento",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiTextarea, {
              modelValue: unref(form).descricao,
              "onUpdate:modelValue": ($event) => unref(form).descricao = $event,
              label: "Descrição"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiSelect, {
              modelValue: unref(form).responsavel,
              "onUpdate:modelValue": ($event) => unref(form).responsavel = $event,
              options: unref(responsaveisOptions),
              label: "Responsável",
              placeholder: "Selecione..."
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
              disabled: unref(salvando)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(salvando) ? "Salvando..." : "Salvar")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar"), 1)
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
                  label: "Nome do Departamento",
                  required: ""
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UiTextarea, {
                  modelValue: unref(form).descricao,
                  "onUpdate:modelValue": ($event) => unref(form).descricao = $event,
                  label: "Descrição"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UiSelect, {
                  modelValue: unref(form).responsavel,
                  "onUpdate:modelValue": ($event) => unref(form).responsavel = $event,
                  options: unref(responsaveisOptions),
                  label: "Responsável",
                  placeholder: "Selecione..."
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
                    disabled: unref(salvando)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(salvando) ? "Salvando..." : "Salvar"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/departamentos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=departamentos-Dx_IfhcZ.mjs.map
