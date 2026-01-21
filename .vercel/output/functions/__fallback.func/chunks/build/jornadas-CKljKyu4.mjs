import { _ as __nuxt_component_0 } from './UiPageHeader-Cc5ywX71.mjs';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2 } from './UiCard-Co7bHBSC.mjs';
import { _ as __nuxt_component_2$1 } from './UiBadge-BLIbLGMQ.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_7 } from './UiModal-C-UfYvvP.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, isRef, computed, mergeProps, Fragment, renderList, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useJornadas } from './useJornadas-BEy1ph1r.mjs';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { _ as __nuxt_component_0$1 } from './UiCheckbox-Bexlss1e.mjs';
import { _ as __nuxt_component_1$1 } from './UiAlert-BhgRUHOS.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "JornadaVisualizacao",
  __ssrInlineRender: true,
  props: {
    jornada: {},
    mostrarObservacoes: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const {
      formatarHorario,
      formatarHorasDecimais,
      obterNomeDia,
      obterAbrevDia
    } = useJornadas();
    const horariosOrdenados = computed(() => {
      if (!props.jornada.horarios) return [];
      return [...props.jornada.horarios].sort((a, b) => a.dia_semana - b.dia_semana);
    });
    const diasTrabalhados = computed(() => {
      if (!props.jornada.horarios) return 0;
      return props.jornada.horarios.filter((h) => h.trabalha).length;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiBadge = __nuxt_component_2$1;
      const _component_UiCard = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"><div class="flex items-center justify-between"><div><h3 class="text-xl font-bold text-gray-800 flex items-center gap-2"> 🕐 ${ssrInterpolate(__props.jornada.nome)} `);
      if (__props.jornada.padrao) {
        _push(ssrRenderComponent(_component_UiBadge, { variant: "primary" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Padrão`);
            } else {
              return [
                createTextVNode("Padrão")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</h3><p class="text-gray-600 mt-1">${ssrInterpolate(__props.jornada.descricao)}</p></div><div class="text-right"><div class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(formatarHorasDecimais)(__props.jornada.horas_semanais))}</div><div class="text-sm text-gray-500">por semana</div></div></div><div class="mt-4 pt-4 border-t border-blue-200"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"><div><div class="text-lg font-semibold text-gray-800">${ssrInterpolate(unref(formatarHorasDecimais)(__props.jornada.horas_semanais))}</div><div class="text-sm text-gray-500">Horas Semanais</div></div><div><div class="text-lg font-semibold text-gray-800">${ssrInterpolate(unref(formatarHorasDecimais)(__props.jornada.horas_mensais))}</div><div class="text-sm text-gray-500">Horas Mensais</div></div><div><div class="text-lg font-semibold text-gray-800">${ssrInterpolate(unref(diasTrabalhados))}/7 </div><div class="text-sm text-gray-500">Dias por Semana</div></div></div></div></div>`);
      _push(ssrRenderComponent(_component_UiCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><h4 class="text-lg font-bold text-gray-800 mb-4"${_scopeId}>📅 Horários Detalhados</h4><div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(horariosOrdenados), (horario) => {
              _push2(`<div class="${ssrRenderClass([
                "flex items-center justify-between p-4 rounded-xl border-2 transition-colors",
                horario.trabalha ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
              ])}"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="${ssrRenderClass([
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm",
                horario.trabalha ? "bg-green-500 text-white" : "bg-gray-400 text-white"
              ])}"${_scopeId}>${ssrInterpolate(unref(obterAbrevDia)(horario.dia_semana))}</div><div${_scopeId}><div class="font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(obterNomeDia)(horario.dia_semana))}</div>`);
              if (!horario.trabalha) {
                _push2(`<div class="text-sm text-gray-500"${_scopeId}> Não trabalha </div>`);
              } else {
                _push2(`<div class="text-sm text-gray-600"${_scopeId}>${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_liquidas))} líquidas </div>`);
              }
              _push2(`</div></div>`);
              if (horario.trabalha) {
                _push2(`<div class="flex items-center gap-6 text-sm"${_scopeId}><div class="text-center"${_scopeId}><div class="font-semibold text-gray-800"${_scopeId}>${ssrInterpolate(unref(formatarHorario)(horario.entrada))} - ${ssrInterpolate(unref(formatarHorario)(horario.saida))}</div><div class="text-gray-500"${_scopeId}>Expediente</div></div>`);
                if (horario.intervalo_inicio && horario.intervalo_fim) {
                  _push2(`<div class="text-center"${_scopeId}><div class="font-semibold text-orange-600"${_scopeId}>${ssrInterpolate(unref(formatarHorario)(horario.intervalo_inicio))} - ${ssrInterpolate(unref(formatarHorario)(horario.intervalo_fim))}</div><div class="text-gray-500"${_scopeId}> Intervalo (${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_intervalo))}) </div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="text-center"${_scopeId}><div class="font-semibold text-blue-600"${_scopeId}>${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_brutas))}</div><div class="text-gray-500"${_scopeId}>Total</div></div></div>`);
              } else {
                _push2(`<div class="flex items-center gap-2 text-gray-500"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"${_scopeId}></path></svg><span${_scopeId}>Folga</span></div>`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("h4", { class: "text-lg font-bold text-gray-800 mb-4" }, "📅 Horários Detalhados"),
                createVNode("div", { class: "space-y-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(horariosOrdenados), (horario) => {
                    return openBlock(), createBlock("div", {
                      key: horario.dia_semana,
                      class: [
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-colors",
                        horario.trabalha ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                      ]
                    }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("div", {
                          class: [
                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm",
                            horario.trabalha ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                          ]
                        }, toDisplayString(unref(obterAbrevDia)(horario.dia_semana)), 3),
                        createVNode("div", null, [
                          createVNode("div", { class: "font-semibold text-gray-800" }, toDisplayString(unref(obterNomeDia)(horario.dia_semana)), 1),
                          !horario.trabalha ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-sm text-gray-500"
                          }, " Não trabalha ")) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-sm text-gray-600"
                          }, toDisplayString(unref(formatarHorasDecimais)(horario.horas_liquidas)) + " líquidas ", 1))
                        ])
                      ]),
                      horario.trabalha ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-6 text-sm"
                      }, [
                        createVNode("div", { class: "text-center" }, [
                          createVNode("div", { class: "font-semibold text-gray-800" }, toDisplayString(unref(formatarHorario)(horario.entrada)) + " - " + toDisplayString(unref(formatarHorario)(horario.saida)), 1),
                          createVNode("div", { class: "text-gray-500" }, "Expediente")
                        ]),
                        horario.intervalo_inicio && horario.intervalo_fim ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-center"
                        }, [
                          createVNode("div", { class: "font-semibold text-orange-600" }, toDisplayString(unref(formatarHorario)(horario.intervalo_inicio)) + " - " + toDisplayString(unref(formatarHorario)(horario.intervalo_fim)), 1),
                          createVNode("div", { class: "text-gray-500" }, " Intervalo (" + toDisplayString(unref(formatarHorasDecimais)(horario.horas_intervalo)) + ") ", 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "text-center" }, [
                          createVNode("div", { class: "font-semibold text-blue-600" }, toDisplayString(unref(formatarHorasDecimais)(horario.horas_brutas)), 1),
                          createVNode("div", { class: "text-gray-500" }, "Total")
                        ])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center gap-2 text-gray-500"
                      }, [
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
                            d: "M20 12H4"
                          })
                        ])),
                        createVNode("span", null, "Folga")
                      ]))
                    ], 2);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.mostrarObservacoes) {
        _push(ssrRenderComponent(_component_UiCard, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="p-6"${_scopeId}><h4 class="text-lg font-bold text-gray-800 mb-4"${_scopeId}>📝 Observações</h4><div class="space-y-3 text-sm"${_scopeId}><div class="flex items-start gap-2"${_scopeId}><span class="text-blue-500"${_scopeId}>ℹ️</span><span${_scopeId}>O intervalo de almoço não é contabilizado na carga horária.</span></div><div class="flex items-start gap-2"${_scopeId}><span class="text-green-500"${_scopeId}>✅</span><span${_scopeId}>Sexta-feira possui jornada reduzida conforme configuração.</span></div><div class="flex items-start gap-2"${_scopeId}><span class="text-orange-500"${_scopeId}>⚠️</span><span${_scopeId}>Esta jornada é configurada pelo RH e não pode ser alterada pelo funcionário.</span></div><div class="flex items-start gap-2"${_scopeId}><span class="text-purple-500"${_scopeId}>📊</span><span${_scopeId}>O cálculo mensal considera 4,33 semanas por mês em média.</span></div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "p-6" }, [
                  createVNode("h4", { class: "text-lg font-bold text-gray-800 mb-4" }, "📝 Observações"),
                  createVNode("div", { class: "space-y-3 text-sm" }, [
                    createVNode("div", { class: "flex items-start gap-2" }, [
                      createVNode("span", { class: "text-blue-500" }, "ℹ️"),
                      createVNode("span", null, "O intervalo de almoço não é contabilizado na carga horária.")
                    ]),
                    createVNode("div", { class: "flex items-start gap-2" }, [
                      createVNode("span", { class: "text-green-500" }, "✅"),
                      createVNode("span", null, "Sexta-feira possui jornada reduzida conforme configuração.")
                    ]),
                    createVNode("div", { class: "flex items-start gap-2" }, [
                      createVNode("span", { class: "text-orange-500" }, "⚠️"),
                      createVNode("span", null, "Esta jornada é configurada pelo RH e não pode ser alterada pelo funcionário.")
                    ]),
                    createVNode("div", { class: "flex items-start gap-2" }, [
                      createVNode("span", { class: "text-purple-500" }, "📊"),
                      createVNode("span", null, "O cálculo mensal considera 4,33 semanas por mês em média.")
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jornadas/JornadaVisualizacao.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const JornadaVisualizacao = Object.assign(_sfc_main$2, { __name: "JornadasJornadaVisualizacao" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "JornadaForm",
  __ssrInlineRender: true,
  props: {
    jornada: {}
  },
  emits: ["salvar", "cancelar"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const {
      diasSemana,
      formatarHorasDecimais,
      obterNomeDia,
      obterAbrevDia,
      validarJornada
    } = useJornadas();
    const form = ref({
      nome: "",
      descricao: "",
      ativa: true,
      padrao: false,
      horarios: []
    });
    const inicializarForm = () => {
      if (props.jornada) {
        form.value = {
          nome: props.jornada.nome,
          descricao: props.jornada.descricao || "",
          ativa: props.jornada.ativa,
          padrao: props.jornada.padrao,
          horarios: props.jornada.horarios ? [...props.jornada.horarios] : criarHorariosVazios()
        };
      } else {
        form.value = {
          nome: "",
          descricao: "",
          ativa: true,
          padrao: false,
          horarios: criarHorariosVazios()
        };
      }
    };
    const criarHorariosVazios = () => {
      return diasSemana.map((dia) => ({
        id: "",
        jornada_id: "",
        dia_semana: dia.id,
        entrada: "08:00",
        saida: "17:00",
        intervalo_inicio: "12:00",
        intervalo_fim: "13:00",
        horas_brutas: 0,
        horas_intervalo: 0,
        horas_liquidas: 0,
        trabalha: dia.id <= 5
        // Segunda a sexta por padrão
      }));
    };
    const recalcularHoras = (index) => {
      const horario = form.value.horarios[index];
      if (!horario) return;
      if (!horario.trabalha) {
        horario.horas_brutas = 0;
        horario.horas_intervalo = 0;
        horario.horas_liquidas = 0;
        return;
      }
      const entrada = /* @__PURE__ */ new Date(`2000-01-01T${horario.entrada}:00`);
      const saida = /* @__PURE__ */ new Date(`2000-01-01T${horario.saida}:00`);
      horario.horas_brutas = (saida.getTime() - entrada.getTime()) / (1e3 * 60 * 60);
      if (horario.intervalo_inicio && horario.intervalo_fim) {
        const inicioIntervalo = /* @__PURE__ */ new Date(`2000-01-01T${horario.intervalo_inicio}:00`);
        const fimIntervalo = /* @__PURE__ */ new Date(`2000-01-01T${horario.intervalo_fim}:00`);
        horario.horas_intervalo = (fimIntervalo.getTime() - inicioIntervalo.getTime()) / (1e3 * 60 * 60);
      } else {
        horario.horas_intervalo = 0;
      }
      horario.horas_liquidas = Math.max(0, horario.horas_brutas - horario.horas_intervalo);
    };
    const totalSemanal = computed(() => {
      return form.value.horarios.filter((h) => h.trabalha).reduce((total, h) => total + h.horas_liquidas, 0);
    });
    const totalMensal = computed(() => {
      return totalSemanal.value * 4.33;
    });
    const diasTrabalhados = computed(() => {
      return form.value.horarios.filter((h) => h.trabalha).length;
    });
    const errosValidacao = computed(() => {
      const validacao = validarJornada(form.value.horarios);
      const erros = [...validacao.erros];
      if (!form.value.nome.trim()) {
        erros.push("Nome da jornada é obrigatório");
      }
      if (totalSemanal.value === 0) {
        erros.push("A jornada deve ter pelo menos um dia de trabalho");
      }
      return erros;
    });
    watch(() => props.jornada, inicializarForm);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiInput = __nuxt_component_4;
      const _component_UiCheckbox = __nuxt_component_0$1;
      const _component_UiAlert = __nuxt_component_1$1;
      const _component_UiButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><form><div class="space-y-4"><h3 class="text-lg font-bold text-gray-800 mb-4">📋 Informações Básicas</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: unref(form).nome,
        "onUpdate:modelValue": ($event) => unref(form).nome = $event,
        label: "Nome da Jornada",
        required: "",
        placeholder: "Ex: Jornada 42h45min"
      }, null, _parent));
      _push(`<div class="flex gap-4">`);
      _push(ssrRenderComponent(_component_UiCheckbox, {
        modelValue: unref(form).ativa,
        "onUpdate:modelValue": ($event) => unref(form).ativa = $event,
        label: "Jornada Ativa"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiCheckbox, {
        modelValue: unref(form).padrao,
        "onUpdate:modelValue": ($event) => unref(form).padrao = $event,
        label: "Jornada Padrão"
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: unref(form).descricao,
        "onUpdate:modelValue": ($event) => unref(form).descricao = $event,
        label: "Descrição",
        placeholder: "Descreva as características desta jornada"
      }, null, _parent));
      _push(`</div><div class="space-y-4 mt-8"><h3 class="text-lg font-bold text-gray-800 mb-4">🕐 Horários por Dia da Semana</h3><div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(form).horarios, (horario, index) => {
        _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-3"><div class="${ssrRenderClass([
          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
          horario.trabalha ? "bg-green-500 text-white" : "bg-gray-400 text-white"
        ])}">${ssrInterpolate(unref(obterAbrevDia)(horario.dia_semana))}</div><div><h4 class="font-semibold text-gray-800">${ssrInterpolate(unref(obterNomeDia)(horario.dia_semana))}</h4>`);
        if (horario.trabalha) {
          _push(`<p class="text-sm text-gray-600">${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_liquidas))} líquidas </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_UiCheckbox, {
          modelValue: horario.trabalha,
          "onUpdate:modelValue": ($event) => horario.trabalha = $event,
          label: "Trabalha neste dia",
          onChange: ($event) => recalcularHoras(index)
        }, null, _parent));
        _push(`</div>`);
        if (horario.trabalha) {
          _push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: horario.entrada,
            "onUpdate:modelValue": ($event) => horario.entrada = $event,
            type: "time",
            label: "Entrada",
            required: "",
            onChange: ($event) => recalcularHoras(index)
          }, null, _parent));
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: horario.saida,
            "onUpdate:modelValue": ($event) => horario.saida = $event,
            type: "time",
            label: "Saída",
            required: "",
            onChange: ($event) => recalcularHoras(index)
          }, null, _parent));
          _push(ssrRenderComponent(_component_UiInput, {
            "model-value": horario.intervalo_inicio || "",
            "onUpdate:modelValue": ($event) => horario.intervalo_inicio = $event || void 0,
            type: "time",
            label: "Início Intervalo",
            onChange: ($event) => recalcularHoras(index)
          }, null, _parent));
          _push(ssrRenderComponent(_component_UiInput, {
            "model-value": horario.intervalo_fim || "",
            "onUpdate:modelValue": ($event) => horario.intervalo_fim = $event || void 0,
            type: "time",
            label: "Fim Intervalo",
            onChange: ($event) => recalcularHoras(index)
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (horario.trabalha) {
          _push(`<div class="mt-4 p-3 bg-gray-50 rounded-lg"><div class="grid grid-cols-3 gap-4 text-center text-sm"><div><div class="font-semibold text-blue-600">${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_brutas))}</div><div class="text-gray-500">Horas Brutas</div></div><div><div class="font-semibold text-orange-600">${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_intervalo))}</div><div class="text-gray-500">Intervalo</div></div><div><div class="font-semibold text-green-600">${ssrInterpolate(unref(formatarHorasDecimais)(horario.horas_liquidas))}</div><div class="text-gray-500">Horas Líquidas</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"><h3 class="text-lg font-bold text-gray-800 mb-4">📊 Resumo Total</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"><div><div class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(formatarHorasDecimais)(unref(totalSemanal)))}</div><div class="text-sm text-gray-600">Horas Semanais</div></div><div><div class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(formatarHorasDecimais)(unref(totalMensal)))}</div><div class="text-sm text-gray-600">Horas Mensais</div></div><div><div class="text-2xl font-bold text-purple-600">${ssrInterpolate(unref(diasTrabalhados))}/7 </div><div class="text-sm text-gray-600">Dias por Semana</div></div></div></div>`);
      if (unref(errosValidacao).length > 0) {
        _push(`<div class="mt-6">`);
        _push(ssrRenderComponent(_component_UiAlert, {
          variant: "error",
          title: "Erros de Validação"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul class="list-disc list-inside space-y-1"${_scopeId}><!--[-->`);
              ssrRenderList(unref(errosValidacao), (erro) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(erro)}</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                createVNode("ul", { class: "list-disc list-inside space-y-1" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(errosValidacao), (erro) => {
                    return openBlock(), createBlock("li", { key: erro }, toDisplayString(erro), 1);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end gap-3 pt-6 border-t mt-8">`);
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "secondary",
        onClick: ($event) => _ctx.$emit("cancelar")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancelar `);
          } else {
            return [
              createTextVNode(" Cancelar ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiButton, {
        type: "submit",
        disabled: unref(errosValidacao).length > 0
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 💾 ${ssrInterpolate(__props.jornada ? "Atualizar" : "Criar")} Jornada `);
          } else {
            return [
              createTextVNode(" 💾 " + toDisplayString(__props.jornada ? "Atualizar" : "Criar") + " Jornada ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/jornadas/JornadaForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const JornadaForm = Object.assign(_sfc_main$1, { __name: "JornadasJornadaForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "jornadas",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      jornadas,
      salvarJornada: salvarJornadaComposable,
      formatarHorasDecimais
    } = useJornadas();
    const modalVisualizacao = ref(false);
    const modalEdicao = ref(false);
    const jornadaSelecionada = ref(null);
    const jornadaEditando = ref(null);
    const mostrarNotificacao = ref(false);
    const notificacao = ref({
      title: "",
      message: "",
      variant: "success"
    });
    const visualizarJornada = (jornada) => {
      jornadaSelecionada.value = jornada;
      modalVisualizacao.value = true;
    };
    const abrirModal = () => {
      jornadaEditando.value = null;
      modalEdicao.value = true;
    };
    const editarJornada = (jornada) => {
      jornadaEditando.value = jornada;
      modalEdicao.value = true;
    };
    const salvarJornada = async (dadosJornada) => {
      const resultado = await salvarJornadaComposable(dadosJornada);
      notificacao.value = {
        title: resultado.success ? "Sucesso!" : "Erro!",
        message: resultado.message,
        variant: resultado.success ? "success" : "error"
      };
      mostrarNotificacao.value = true;
      if (resultado.success) {
        modalEdicao.value = false;
      }
    };
    const toggleStatus = async (jornada) => {
      try {
        jornada.ativa = !jornada.ativa;
        notificacao.value = {
          title: "Status Atualizado!",
          message: `Jornada ${jornada.nome} ${jornada.ativa ? "ativada" : "inativada"} com sucesso!`,
          variant: "success"
        };
        mostrarNotificacao.value = true;
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: "Erro ao atualizar status da jornada.",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      }
    };
    const contarFuncionarios = (jornadaId) => {
      const mock = {
        "1": 15,
        // Jornada 42h45min
        "2": 8,
        // Jornada 44h
        "3": 3
        // Jornada 40h
      };
      return mock[jornadaId] || 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPageHeader = __nuxt_component_0;
      const _component_UiButton = __nuxt_component_1;
      const _component_UiCard = __nuxt_component_2;
      const _component_UiBadge = __nuxt_component_2$1;
      const _component_UiModal = __nuxt_component_3;
      const _component_UiNotification = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UiPageHeader, {
        title: "Jornadas de Trabalho",
        description: "Gerencie as jornadas e cargas horárias dos funcionários"
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
                  _push3(` Nova Jornada `);
                } else {
                  return [
                    createTextVNode(" Nova Jornada ")
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
                  createTextVNode(" Nova Jornada ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(jornadas), (jornada) => {
        _push(ssrRenderComponent(_component_UiCard, {
          key: jornada.id,
          padding: "p-6"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center"${_scopeId}><span class="text-blue-700 font-bold text-2xl"${_scopeId}>🕐</span></div><div${_scopeId}><div class="flex items-center gap-2"${_scopeId}><h3 class="text-xl font-bold text-gray-800"${_scopeId}>${ssrInterpolate(jornada.nome)}</h3>`);
              if (jornada.padrao) {
                _push2(ssrRenderComponent(_component_UiBadge, { variant: "primary" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Padrão`);
                    } else {
                      return [
                        createTextVNode("Padrão")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_UiBadge, {
                variant: jornada.ativa ? "success" : "gray"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(jornada.ativa ? "Ativa" : "Inativa")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(jornada.ativa ? "Ativa" : "Inativa"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><p class="text-gray-600 mt-1"${_scopeId}>${ssrInterpolate(jornada.descricao)}</p><div class="flex gap-4 mt-2 text-sm text-gray-500"${_scopeId}><span${_scopeId}>📅 ${ssrInterpolate(unref(formatarHorasDecimais)(jornada.horas_semanais))} semanais</span><span${_scopeId}>📊 ${ssrInterpolate(unref(formatarHorasDecimais)(jornada.horas_mensais))} mensais</span><span${_scopeId}>👥 ${ssrInterpolate(contarFuncionarios(jornada.id))} funcionários</span></div></div></div><div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => visualizarJornada(jornada)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` 👁️ Visualizar `);
                  } else {
                    return [
                      createTextVNode(" 👁️ Visualizar ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => editarJornada(jornada)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` ✏️ Editar `);
                  } else {
                    return [
                      createTextVNode(" ✏️ Editar ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: jornada.ativa ? "danger" : "success",
                onClick: ($event) => toggleStatus(jornada)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(jornada.ativa ? "🚫 Inativar" : "✓ Ativar")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(jornada.ativa ? "🚫 Inativar" : "✓ Ativar"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col lg:flex-row lg:items-center justify-between gap-4" }, [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("div", { class: "w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center" }, [
                      createVNode("span", { class: "text-blue-700 font-bold text-2xl" }, "🕐")
                    ]),
                    createVNode("div", null, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("h3", { class: "text-xl font-bold text-gray-800" }, toDisplayString(jornada.nome), 1),
                        jornada.padrao ? (openBlock(), createBlock(_component_UiBadge, {
                          key: 0,
                          variant: "primary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Padrão")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        createVNode(_component_UiBadge, {
                          variant: jornada.ativa ? "success" : "gray"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(jornada.ativa ? "Ativa" : "Inativa"), 1)
                          ]),
                          _: 2
                        }, 1032, ["variant"])
                      ]),
                      createVNode("p", { class: "text-gray-600 mt-1" }, toDisplayString(jornada.descricao), 1),
                      createVNode("div", { class: "flex gap-4 mt-2 text-sm text-gray-500" }, [
                        createVNode("span", null, "📅 " + toDisplayString(unref(formatarHorasDecimais)(jornada.horas_semanais)) + " semanais", 1),
                        createVNode("span", null, "📊 " + toDisplayString(unref(formatarHorasDecimais)(jornada.horas_mensais)) + " mensais", 1),
                        createVNode("span", null, "👥 " + toDisplayString(contarFuncionarios(jornada.id)) + " funcionários", 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UiButton, {
                      variant: "ghost",
                      onClick: ($event) => visualizarJornada(jornada)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 👁️ Visualizar ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UiButton, {
                      variant: "ghost",
                      onClick: ($event) => editarJornada(jornada)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" ✏️ Editar ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UiButton, {
                      variant: jornada.ativa ? "danger" : "success",
                      onClick: ($event) => toggleStatus(jornada)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(jornada.ativa ? "🚫 Inativar" : "✓ Ativar"), 1)
                      ]),
                      _: 2
                    }, 1032, ["variant", "onClick"])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalVisualizacao),
        "onUpdate:modelValue": ($event) => isRef(modalVisualizacao) ? modalVisualizacao.value = $event : null,
        title: `Jornada: ${unref(jornadaSelecionada)?.nome || ""}`,
        "max-width": "max-w-4xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(jornadaSelecionada)) {
              _push2(ssrRenderComponent(JornadaVisualizacao, { jornada: unref(jornadaSelecionada) }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(jornadaSelecionada) ? (openBlock(), createBlock(JornadaVisualizacao, {
                key: 0,
                jornada: unref(jornadaSelecionada)
              }, null, 8, ["jornada"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalEdicao),
        "onUpdate:modelValue": ($event) => isRef(modalEdicao) ? modalEdicao.value = $event : null,
        title: unref(jornadaEditando) ? "Editar Jornada" : "Nova Jornada",
        "max-width": "max-w-5xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(JornadaForm, {
              jornada: unref(jornadaEditando),
              onSalvar: salvarJornada,
              onCancelar: ($event) => modalEdicao.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(JornadaForm, {
                jornada: unref(jornadaEditando),
                onSalvar: salvarJornada,
                onCancelar: ($event) => modalEdicao.value = false
              }, null, 8, ["jornada", "onCancelar"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/jornadas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=jornadas-CKljKyu4.mjs.map
