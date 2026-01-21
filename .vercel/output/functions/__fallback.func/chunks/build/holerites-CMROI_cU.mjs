import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_6 } from './UiSelect-DFt9aazW.mjs';
import { _ as __nuxt_component_2, H as HoleriteModal } from './HoleriteModal-Cx6Az-Fb.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_7 } from './UiModal-C-UfYvvP.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, isRef, createBlock, createCommentVNode, openBlock, toDisplayString, createVNode, withDirectives, vModelCheckbox, vModelRadio, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HoleriteEditForm",
  __ssrInlineRender: true,
  props: {
    holerite: {}
  },
  emits: ["save", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const abaAtiva = ref("basicos");
    const empresaInfo = ref(null);
    const horasPadrao = ref(0);
    const carregandoDados = ref(true);
    const itensPersonalizados = ref([]);
    const mostrarFormNovoItem = ref(false);
    const tabs = [
      { id: "basicos", label: "Dados Básicos", icon: "📋" },
      { id: "proventos", label: "Proventos", icon: "💰" },
      { id: "descontos", label: "Descontos", icon: "📉" },
      { id: "personalizados", label: "Itens Personalizados", icon: "⚙️" }
    ];
    const form = ref({
      salario_base: props.holerite.salario_base || 0,
      horas_trabalhadas: props.holerite.horas_trabalhadas || 0,
      data_pagamento: props.holerite.data_pagamento || "",
      observacoes: props.holerite.observacoes || "",
      bonus: props.holerite.bonus || 0,
      horas_extras: props.holerite.horas_extras || 0,
      adicional_noturno: props.holerite.adicional_noturno || 0,
      adicional_periculosidade: props.holerite.adicional_periculosidade || 0,
      adicional_insalubridade: props.holerite.adicional_insalubridade || 0,
      comissoes: props.holerite.comissoes || 0,
      inss: props.holerite.inss || 0,
      irrf: props.holerite.irrf || 0,
      vale_transporte: props.holerite.vale_transporte || 0,
      vale_refeicao_desconto: props.holerite.vale_refeicao_desconto || 0,
      plano_saude: props.holerite.plano_saude || 0,
      plano_odontologico: props.holerite.plano_odontologico || 0,
      adiantamento: props.holerite.adiantamento || 0,
      faltas: props.holerite.faltas || 0
    });
    const novoItem = ref({
      tipo: "beneficio",
      descricao: "",
      valor: 0,
      vigencia_tipo: "unico",
      data_inicio: "",
      data_fim: "",
      observacoes: ""
    });
    const carregarItensPersonalizados = async (funcId) => {
      try {
        const response = await $fetch(`/api/holerites/itens-personalizados/${funcId}`);
        if (response.warning) {
          console.warn("⚠️", response.warning);
        }
        itensPersonalizados.value = response.data || [];
      } catch (error) {
        console.error("Erro ao carregar itens personalizados:", error);
        itensPersonalizados.value = [];
        if (error.message?.includes("PGRST205") || error.message?.includes("not exist")) {
          console.error("❌ A tabela holerite_itens_personalizados não existe!");
          console.error("📋 Execute o arquivo: EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor");
        }
      }
    };
    const adicionarItem = async () => {
      try {
        const funcId = props.holerite.funcionario_id || props.holerite.funcionario?.id;
        if (!novoItem.value.descricao || !novoItem.value.valor || !novoItem.value.data_inicio) {
          alert("⚠️ Preencha todos os campos obrigatórios");
          return;
        }
        const dataFim = novoItem.value.vigencia_tipo === "unico" ? novoItem.value.data_inicio : novoItem.value.data_fim || null;
        await $fetch("/api/holerites/itens-personalizados", {
          method: "POST",
          body: {
            funcionario_id: funcId,
            tipo: novoItem.value.tipo,
            descricao: novoItem.value.descricao,
            valor: Number(novoItem.value.valor),
            vigencia_tipo: novoItem.value.vigencia_tipo,
            data_inicio: novoItem.value.data_inicio,
            data_fim: dataFim,
            observacoes: novoItem.value.observacoes
          }
        });
        await carregarItensPersonalizados(funcId);
        cancelarNovoItem();
        alert("✅ Item adicionado com sucesso!");
      } catch (error) {
        console.error("Erro ao adicionar item:", error);
        if (error.message?.includes("não existe") || error.message?.includes("EXECUTAR-ITENS-PERSONALIZADOS")) {
          alert("❌ Erro: A tabela não existe no banco de dados.\n\n📋 Execute o arquivo EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor.\n\nVeja a documentação em: docs/CORRECAO-ITENS-PERSONALIZADOS.md");
        } else {
          alert("❌ Erro ao adicionar item: " + error.message);
        }
      }
    };
    const cancelarNovoItem = () => {
      mostrarFormNovoItem.value = false;
      novoItem.value = {
        tipo: "beneficio",
        descricao: "",
        valor: 0,
        vigencia_tipo: "unico",
        data_inicio: "",
        data_fim: "",
        observacoes: ""
      };
    };
    const calcularTotalProventos = () => {
      return Number(form.value.salario_base) + Number(form.value.bonus) + Number(form.value.horas_extras) + Number(form.value.adicional_noturno) + Number(form.value.adicional_periculosidade) + Number(form.value.adicional_insalubridade) + Number(form.value.comissoes);
    };
    const calcularTotalDescontos = () => {
      return Number(form.value.inss) + Number(form.value.irrf) + Number(form.value.vale_transporte) + Number(form.value.vale_refeicao_desconto) + Number(form.value.plano_saude) + Number(form.value.plano_odontologico) + Number(form.value.adiantamento) + Number(form.value.faltas);
    };
    const calcularSalarioLiquido = () => {
      return calcularTotalProventos() - calcularTotalDescontos();
    };
    const formatarMoeda = (valor) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    };
    const formatarCNPJ = (cnpj) => {
      const numeros = cnpj.replace(/\D/g, "");
      return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    };
    const formatarData = (data) => {
      if (!data) return "";
      return (/* @__PURE__ */ new Date(data + "T00:00:00")).toLocaleDateString("pt-BR");
    };
    const salvar = () => {
      emit("save", form.value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiInput = __nuxt_component_4;
      const _component_UiAlert = __nuxt_component_1$1;
      const _component_UiButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-gray-50 rounded-xl p-4"><h3 class="font-semibold text-gray-900 mb-2">${ssrInterpolate(__props.holerite.funcionario.nome_completo)}</h3>`);
      if (unref(carregandoDados)) {
        _push(`<div class="text-sm text-gray-500"> ⏳ Carregando informações... </div>`);
      } else {
        _push(`<div class="grid grid-cols-2 gap-2 text-sm"><div><span class="text-gray-600">Cargo:</span><span class="ml-2 font-medium">${ssrInterpolate(__props.holerite.funcionario.cargo)}</span></div><div><span class="text-gray-600">Empresa:</span><span class="ml-2 font-medium">${ssrInterpolate(unref(empresaInfo) ? unref(empresaInfo).nome_fantasia || unref(empresaInfo).nome || "Não definida" : "Não encontrada")}</span></div>`);
        if (unref(empresaInfo)?.cnpj) {
          _push(`<div class="col-span-2"><span class="text-gray-600">CNPJ:</span><span class="ml-2 font-medium">${ssrInterpolate(formatarCNPJ(unref(empresaInfo).cnpj))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(horasPadrao) > 0) {
          _push(`<div class="col-span-2"><span class="text-gray-600">Horas Padrão do Mês:</span><span class="ml-2 font-medium">${ssrInterpolate(unref(horasPadrao))}h</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div><div class="border-b border-gray-200"><nav class="-mb-px flex space-x-8"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
          unref(abaAtiva) === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        ])}">${ssrInterpolate(tab.icon)} ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></nav></div>`);
      if (unref(abaAtiva) === "basicos") {
        _push(`<div class="space-y-4"><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).salario_base,
          "onUpdate:modelValue": ($event) => unref(form).salario_base = $event,
          type: "number",
          label: "Salário Base",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).horas_trabalhadas,
          "onUpdate:modelValue": ($event) => unref(form).horas_trabalhadas = $event,
          type: "number",
          label: "Horas Trabalhadas no Mês",
          placeholder: `Padrão: ${unref(horasPadrao)}h`,
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).data_pagamento,
          "onUpdate:modelValue": ($event) => unref(form).data_pagamento = $event,
          type: "date",
          label: "Data de Pagamento"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).observacoes,
          "onUpdate:modelValue": ($event) => unref(form).observacoes = $event,
          label: "Observações",
          placeholder: "Observações sobre este holerite"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "proventos") {
        _push(`<div class="space-y-4"><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).bonus,
          "onUpdate:modelValue": ($event) => unref(form).bonus = $event,
          type: "number",
          label: "Bônus",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).horas_extras,
          "onUpdate:modelValue": ($event) => unref(form).horas_extras = $event,
          type: "number",
          label: "Horas Extras",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).adicional_noturno,
          "onUpdate:modelValue": ($event) => unref(form).adicional_noturno = $event,
          type: "number",
          label: "Adicional Noturno",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).adicional_periculosidade,
          "onUpdate:modelValue": ($event) => unref(form).adicional_periculosidade = $event,
          type: "number",
          label: "Adicional de Periculosidade",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).adicional_insalubridade,
          "onUpdate:modelValue": ($event) => unref(form).adicional_insalubridade = $event,
          type: "number",
          label: "Adicional de Insalubridade",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).comissoes,
          "onUpdate:modelValue": ($event) => unref(form).comissoes = $event,
          type: "number",
          label: "Comissões",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="bg-green-50 p-4 rounded-lg"><div class="flex justify-between items-center"><span class="font-semibold text-green-700">Total de Proventos:</span><span class="text-xl font-bold text-green-700">${ssrInterpolate(formatarMoeda(calcularTotalProventos()))}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "descontos") {
        _push(`<div class="space-y-4"><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).inss,
          "onUpdate:modelValue": ($event) => unref(form).inss = $event,
          type: "number",
          label: "INSS",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).irrf,
          "onUpdate:modelValue": ($event) => unref(form).irrf = $event,
          type: "number",
          label: "IRRF",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).vale_transporte,
          "onUpdate:modelValue": ($event) => unref(form).vale_transporte = $event,
          type: "number",
          label: "Vale Transporte",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).vale_refeicao_desconto,
          "onUpdate:modelValue": ($event) => unref(form).vale_refeicao_desconto = $event,
          type: "number",
          label: "Vale Refeição",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).plano_saude,
          "onUpdate:modelValue": ($event) => unref(form).plano_saude = $event,
          type: "number",
          label: "Plano de Saúde",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).plano_odontologico,
          "onUpdate:modelValue": ($event) => unref(form).plano_odontologico = $event,
          type: "number",
          label: "Plano Odontológico",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).adiantamento,
          "onUpdate:modelValue": ($event) => unref(form).adiantamento = $event,
          type: "number",
          label: "Adiantamento",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(ssrRenderComponent(_component_UiInput, {
          modelValue: unref(form).faltas,
          "onUpdate:modelValue": ($event) => unref(form).faltas = $event,
          type: "number",
          label: "Faltas",
          placeholder: "0.00",
          step: "0.01"
        }, null, _parent));
        _push(`</div><div class="bg-red-50 p-4 rounded-lg"><div class="flex justify-between items-center"><span class="font-semibold text-red-700">Total de Descontos:</span><span class="text-xl font-bold text-red-700">${ssrInterpolate(formatarMoeda(calcularTotalDescontos()))}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "personalizados") {
        _push(`<div class="space-y-4">`);
        _push(ssrRenderComponent(_component_UiAlert, {
          variant: "info",
          class: "mb-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Adicione benefícios ou descontos personalizados que serão aplicados automaticamente nos holerites do funcionário durante o período definido. `);
            } else {
              return [
                createTextVNode(" Adicione benefícios ou descontos personalizados que serão aplicados automaticamente nos holerites do funcionário durante o período definido. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(itensPersonalizados).length > 0) {
          _push(`<div class="space-y-3 mb-6"><h4 class="font-semibold text-gray-700">Itens Ativos</h4><!--[-->`);
          ssrRenderList(unref(itensPersonalizados), (item) => {
            _push(`<div class="bg-white border rounded-lg p-4"><div class="flex justify-between items-start"><div class="flex-1"><div class="flex items-center gap-2 mb-2"><span class="${ssrRenderClass([
              "px-2 py-1 rounded text-xs font-semibold",
              item.tipo === "beneficio" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            ])}">${ssrInterpolate(item.tipo === "beneficio" ? "💰 Benefício" : "📉 Desconto")}</span><span class="${ssrRenderClass([
              "px-2 py-1 rounded text-xs font-semibold",
              item.vigencia_tipo === "unico" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            ])}">${ssrInterpolate(item.vigencia_tipo === "unico" ? "📅 Único" : "🔄 Recorrente")}</span></div><p class="font-semibold text-gray-900">${ssrInterpolate(item.descricao)}</p><p class="${ssrRenderClass([item.tipo === "beneficio" ? "text-green-600" : "text-red-600", "text-lg font-bold"])}">${ssrInterpolate(formatarMoeda(item.valor))}</p><p class="text-sm text-gray-500 mt-1"> Vigência: ${ssrInterpolate(formatarData(item.data_inicio))} ${ssrInterpolate(item.data_fim ? `até ${formatarData(item.data_fim)}` : "(sem data fim)")}</p>`);
            if (item.observacoes) {
              _push(`<p class="text-sm text-gray-400 mt-1">${ssrInterpolate(item.observacoes)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><button class="text-red-500 hover:text-red-700 p-2" title="Remover item"> 🗑️ </button></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8 text-gray-500"> Nenhum item personalizado cadastrado </div>`);
        }
        if (!unref(mostrarFormNovoItem)) {
          _push(ssrRenderComponent(_component_UiButton, {
            onClick: ($event) => mostrarFormNovoItem.value = true,
            variant: "secondary",
            class: "w-full"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ➕ Adicionar Novo Item `);
              } else {
                return [
                  createTextVNode(" ➕ Adicionar Novo Item ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(mostrarFormNovoItem)) {
          _push(`<div class="bg-gray-50 rounded-lg p-4 space-y-4"><h4 class="font-semibold text-gray-700">Novo Item Personalizado</h4><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="beneficio"${ssrIncludeBooleanAttr(Array.isArray(unref(novoItem).tipo) ? ssrLooseContain(unref(novoItem).tipo, "beneficio") : ssrLooseEqual(unref(novoItem).tipo, "beneficio")) ? " selected" : ""}>💰 Benefício (Provento)</option><option value="desconto"${ssrIncludeBooleanAttr(Array.isArray(unref(novoItem).tipo) ? ssrLooseContain(unref(novoItem).tipo, "desconto") : ssrLooseEqual(unref(novoItem).tipo, "desconto")) ? " selected" : ""}>📉 Desconto</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Vigência</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"><option value="unico"${ssrIncludeBooleanAttr(Array.isArray(unref(novoItem).vigencia_tipo) ? ssrLooseContain(unref(novoItem).vigencia_tipo, "unico") : ssrLooseEqual(unref(novoItem).vigencia_tipo, "unico")) ? " selected" : ""}>📅 Único (apenas este mês)</option><option value="recorrente"${ssrIncludeBooleanAttr(Array.isArray(unref(novoItem).vigencia_tipo) ? ssrLooseContain(unref(novoItem).vigencia_tipo, "recorrente") : ssrLooseEqual(unref(novoItem).vigencia_tipo, "recorrente")) ? " selected" : ""}>🔄 Recorrente (vários meses)</option></select></div></div>`);
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: unref(novoItem).descricao,
            "onUpdate:modelValue": ($event) => unref(novoItem).descricao = $event,
            label: "Descrição",
            placeholder: "Ex: Bônus de produtividade, Desconto de uniforme..."
          }, null, _parent));
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: unref(novoItem).valor,
            "onUpdate:modelValue": ($event) => unref(novoItem).valor = $event,
            type: "number",
            label: "Valor",
            placeholder: "0.00",
            step: "0.01"
          }, null, _parent));
          _push(`<div class="grid grid-cols-2 gap-4">`);
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: unref(novoItem).data_inicio,
            "onUpdate:modelValue": ($event) => unref(novoItem).data_inicio = $event,
            type: "date",
            label: "Data Início"
          }, null, _parent));
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: unref(novoItem).data_fim,
            "onUpdate:modelValue": ($event) => unref(novoItem).data_fim = $event,
            type: "date",
            label: "Data Fim (opcional)",
            disabled: unref(novoItem).vigencia_tipo === "unico"
          }, null, _parent));
          _push(`</div>`);
          _push(ssrRenderComponent(_component_UiInput, {
            modelValue: unref(novoItem).observacoes,
            "onUpdate:modelValue": ($event) => unref(novoItem).observacoes = $event,
            label: "Observações (opcional)",
            placeholder: "Informações adicionais..."
          }, null, _parent));
          _push(`<div class="flex gap-3">`);
          _push(ssrRenderComponent(_component_UiButton, {
            onClick: adicionarItem,
            class: "flex-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ✅ Adicionar `);
              } else {
                return [
                  createTextVNode(" ✅ Adicionar ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_UiButton, {
            variant: "secondary",
            onClick: cancelarNovoItem,
            class: "flex-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ❌ Cancelar `);
              } else {
                return [
                  createTextVNode(" ❌ Cancelar ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-blue-50 p-4 rounded-lg border-2 border-blue-200"><div class="space-y-2"><div class="flex justify-between text-sm"><span class="text-gray-700">Total Proventos:</span><span class="font-semibold text-green-600">${ssrInterpolate(formatarMoeda(calcularTotalProventos()))}</span></div><div class="flex justify-between text-sm"><span class="text-gray-700">Total Descontos:</span><span class="font-semibold text-red-600">- ${ssrInterpolate(formatarMoeda(calcularTotalDescontos()))}</span></div><div class="border-t border-blue-300 pt-2 flex justify-between"><span class="font-bold text-blue-900">Salário Líquido:</span><span class="text-2xl font-bold text-blue-900">${ssrInterpolate(formatarMoeda(calcularSalarioLiquido()))}</span></div></div></div><div class="flex justify-end gap-3 pt-4 border-t">`);
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "secondary",
        onClick: ($event) => _ctx.$emit("cancel")
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
      _push(ssrRenderComponent(_component_UiButton, { onClick: salvar }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 💾 Salvar Alterações `);
          } else {
            return [
              createTextVNode(" 💾 Salvar Alterações ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/holerites/HoleriteEditForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HoleriteEditForm = Object.assign(_sfc_main$1, { __name: "HoleritesHoleriteEditForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "holerites",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = ref(false);
    const holerites = ref([]);
    const modalVisualizacao = ref(false);
    const modalEdicao = ref(false);
    const mostrarModalGerar = ref(false);
    const mostrarModalEnvio = ref(false);
    const mostrarModalDisponibilizar = ref(false);
    const tipoGeracao = ref("mensal");
    const tipoEnvio = ref("todos");
    const tipoDisponibilizar = ref("todos");
    const holeriteSelecionado = ref(null);
    const mostrarNotificacao = ref(false);
    const notificacao = ref({ title: "", message: "", variant: "info" });
    const empresas = ref([]);
    const opcoesGeracao = ref({
      recriar: false
    });
    const filtros = ref({
      empresa: "",
      mes: "",
      status: ""
    });
    const empresasOptions = computed(() => [
      { value: "", label: "Todas as empresas" },
      ...empresas.value.map((e) => ({
        value: e.id.toString(),
        label: e.nome_fantasia
      }))
    ]);
    const mesesOptions = computed(() => {
      const opcoes = [{ value: "", label: "Todos os períodos" }];
      const hoje = /* @__PURE__ */ new Date();
      for (let i = 0; i < 12; i++) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const valor = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
        const label = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
        opcoes.push({ value: valor, label });
      }
      return opcoes;
    });
    const statusOptions = computed(() => [
      { value: "", label: "Todos os status" },
      { value: "gerado", label: "Gerado" },
      { value: "enviado", label: "Enviado" },
      { value: "visualizado", label: "Visualizado" }
    ]);
    const abrirModalGerar = (tipo) => {
      tipoGeracao.value = tipo;
      mostrarModalGerar.value = true;
    };
    const abrirModalEnvio = () => {
      tipoEnvio.value = "todos";
      mostrarModalEnvio.value = true;
    };
    const abrirModalDisponibilizar = () => {
      tipoDisponibilizar.value = "todos";
      mostrarModalDisponibilizar.value = true;
    };
    const contarHoleritesPorTipo = () => {
      if (tipoEnvio.value === "todos") {
        return holerites.value.filter((h) => h.status !== "enviado").length;
      } else if (tipoEnvio.value === "adiantamento") {
        return holerites.value.filter((h) => {
          const diaFim = new Date(h.periodo_fim).getDate();
          return diaFim <= 15 && h.status !== "enviado";
        }).length;
      } else {
        return holerites.value.filter((h) => {
          const diaFim = new Date(h.periodo_fim).getDate();
          return diaFim > 15 && h.status !== "enviado";
        }).length;
      }
    };
    const contarHoleritesPorTipoDisp = () => {
      if (tipoDisponibilizar.value === "todos") {
        return holerites.value.length;
      } else if (tipoDisponibilizar.value === "adiantamento") {
        return holerites.value.filter((h) => {
          const diaFim = new Date(h.periodo_fim).getDate();
          return diaFim <= 15;
        }).length;
      } else {
        return holerites.value.filter((h) => {
          const diaFim = new Date(h.periodo_fim).getDate();
          return diaFim > 15;
        }).length;
      }
    };
    const confirmarDisponibilizacao = async () => {
      mostrarModalDisponibilizar.value = false;
      await disponibilizarHolerites();
    };
    const disponibilizarHolerites = async () => {
      loading.value = true;
      try {
        let holeritesFiltrados = [];
        if (tipoDisponibilizar.value === "todos") {
          holeritesFiltrados = holerites.value;
        } else if (tipoDisponibilizar.value === "adiantamento") {
          holeritesFiltrados = holerites.value.filter((h) => {
            const diaFim = new Date(h.periodo_fim).getDate();
            return diaFim <= 15;
          });
        } else {
          holeritesFiltrados = holerites.value.filter((h) => {
            const diaFim = new Date(h.periodo_fim).getDate();
            return diaFim > 15;
          });
        }
        if (holeritesFiltrados.length === 0) {
          notificacao.value = {
            title: "Aviso",
            message: "Nenhum holerite para disponibilizar",
            variant: "warning"
          };
          mostrarNotificacao.value = true;
          loading.value = false;
          return;
        }
        let disponibilizados = 0;
        let erros = 0;
        for (const holerite of holeritesFiltrados) {
          try {
            await $fetch(`/api/holerites/${holerite.id}`, {
              method: "PATCH",
              body: {
                status: "visualizado"
                // Status que indica disponível no perfil
              }
            });
            disponibilizados++;
          } catch (error) {
            console.error(`Erro ao disponibilizar holerite ${holerite.id}:`, error);
            erros++;
          }
        }
        const tipoTexto = tipoDisponibilizar.value === "adiantamento" ? "adiantamentos" : tipoDisponibilizar.value === "mensal" ? "folhas mensais" : "holerites";
        notificacao.value = {
          title: "Disponibilização Concluída!",
          message: `${disponibilizados} ${tipoTexto} disponibilizado(s) no perfil${erros > 0 ? ` (${erros} erro(s))` : ""}`,
          variant: erros > 0 ? "warning" : "success"
        };
        mostrarNotificacao.value = true;
        await carregarHolerites();
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: error.data?.message || "Erro ao disponibilizar holerites",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const carregarHolerites = async () => {
      loading.value = true;
      try {
        const params = {};
        if (filtros.value.empresa) params.empresa = filtros.value.empresa;
        if (filtros.value.mes) params.mes = filtros.value.mes;
        if (filtros.value.status) params.status = filtros.value.status;
        const data = await $fetch("/api/holerites", { params });
        holerites.value = data;
      } catch (error) {
        console.error("Erro ao carregar holerites:", error);
        notificacao.value = {
          title: "Erro!",
          message: "Erro ao carregar holerites do banco de dados",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const gerarHoleritesAutomaticos = async () => {
      loading.value = true;
      try {
        const hoje = /* @__PURE__ */ new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        let periodo_inicio, periodo_fim;
        if (tipoGeracao.value === "adiantamento") {
          periodo_inicio = `${ano}-${mes}-01`;
          periodo_fim = `${ano}-${mes}-15`;
        } else {
          periodo_inicio = `${ano}-${mes}-01`;
          const ultimoDia = new Date(ano, hoje.getMonth() + 1, 0).getDate();
          periodo_fim = `${ano}-${mes}-${String(ultimoDia).padStart(2, "0")}`;
        }
        const resultado = await $fetch("/api/holerites/gerar", {
          method: "POST",
          body: {
            periodo_inicio,
            periodo_fim,
            tipo: tipoGeracao.value,
            recriar: opcoesGeracao.value.recriar
          }
        });
        notificacao.value = {
          title: "Sucesso!",
          message: resultado.message || `${tipoGeracao.value === "adiantamento" ? "Adiantamentos" : "Holerites"} gerados com sucesso`,
          variant: "success"
        };
        mostrarNotificacao.value = true;
        await carregarHolerites();
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: error.data?.message || "Erro ao gerar holerites automaticamente",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const confirmarGeracaoHolerites = async () => {
      mostrarModalGerar.value = false;
      await gerarHoleritesAutomaticos();
    };
    const confirmarEnvioHolerites = async () => {
      mostrarModalEnvio.value = false;
      await enviarHoleritesPorTipo();
    };
    const enviarHoleritesPorTipo = async () => {
      loading.value = true;
      try {
        let holeritesFiltrados = [];
        if (tipoEnvio.value === "todos") {
          holeritesFiltrados = holerites.value.filter((h) => h.status !== "enviado");
        } else if (tipoEnvio.value === "adiantamento") {
          holeritesFiltrados = holerites.value.filter((h) => {
            const diaFim = new Date(h.periodo_fim).getDate();
            return diaFim <= 15 && h.status !== "enviado";
          });
        } else {
          holeritesFiltrados = holerites.value.filter((h) => {
            const diaFim = new Date(h.periodo_fim).getDate();
            return diaFim > 15 && h.status !== "enviado";
          });
        }
        if (holeritesFiltrados.length === 0) {
          notificacao.value = {
            title: "Aviso",
            message: "Nenhum holerite para enviar",
            variant: "warning"
          };
          mostrarNotificacao.value = true;
          loading.value = false;
          return;
        }
        let enviados = 0;
        let erros = 0;
        for (const holerite of holeritesFiltrados) {
          try {
            await $fetch(`/api/holerites/${holerite.id}/enviar-email`, {
              method: "POST"
            });
            enviados++;
          } catch (error) {
            console.error(`Erro ao enviar holerite ${holerite.id}:`, error);
            erros++;
          }
        }
        const tipoTexto = tipoEnvio.value === "adiantamento" ? "adiantamentos" : tipoEnvio.value === "mensal" ? "folhas mensais" : "holerites";
        notificacao.value = {
          title: "Envio Concluído!",
          message: `${enviados} ${tipoTexto} enviado(s) com sucesso${erros > 0 ? ` (${erros} erro(s))` : ""}`,
          variant: erros > 0 ? "warning" : "success"
        };
        mostrarNotificacao.value = true;
        await carregarHolerites();
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: error.data?.message || "Erro ao enviar holerites",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const visualizarHolerite = (holerite) => {
      holeriteSelecionado.value = holerite;
      modalVisualizacao.value = true;
    };
    const editarHolerite = (holerite) => {
      holeriteSelecionado.value = { ...holerite };
      modalEdicao.value = true;
    };
    const enviarHolerite = async (holerite) => {
      try {
        loading.value = true;
        const resultado = await $fetch(`/api/holerites/${holerite.id}/enviar-email`, {
          method: "POST"
        });
        holerite.status = "enviado";
        notificacao.value = {
          title: "Enviado!",
          message: `Holerite enviado para ${holerite.funcionario.nome_completo} (${resultado.email})`,
          variant: "success"
        };
        mostrarNotificacao.value = true;
        await carregarHolerites();
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: error.data?.message || "Erro ao enviar holerite",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const salvarEdicaoHolerite = async (dadosAtualizados) => {
      if (!holeriteSelecionado.value) return;
      try {
        loading.value = true;
        const resultado = await $fetch(`/api/holerites/${holeriteSelecionado.value.id}`, {
          method: "PATCH",
          body: dadosAtualizados
        });
        modalEdicao.value = false;
        notificacao.value = {
          title: "Salvo!",
          message: "Holerite atualizado com sucesso",
          variant: "success"
        };
        mostrarNotificacao.value = true;
        await carregarHolerites();
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: error.data?.message || "Erro ao salvar alterações",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const aplicarFiltros = () => {
      carregarHolerites();
    };
    const excluirHolerite = async (holerite) => {
      if (!confirm(`Tem certeza que deseja excluir o holerite de ${holerite.funcionario.nome_completo}?

Esta ação não pode ser desfeita.`)) {
        return;
      }
      try {
        loading.value = true;
        await $fetch(`/api/holerites/${holerite.id}`, {
          method: "DELETE"
        });
        notificacao.value = {
          title: "Excluído!",
          message: `Holerite de ${holerite.funcionario.nome_completo} excluído com sucesso`,
          variant: "success"
        };
        mostrarNotificacao.value = true;
        await carregarHolerites();
      } catch (error) {
        notificacao.value = {
          title: "Erro!",
          message: error.data?.message || "Erro ao excluir holerite",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const formatarMoeda = (valor) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    };
    const formatarPeriodo = (inicio, fim) => {
      const dataInicio = new Date(inicio).toLocaleDateString("pt-BR");
      const dataFim = new Date(fim).toLocaleDateString("pt-BR");
      return `${dataInicio} - ${dataFim}`;
    };
    const getStatusLabel = (status) => {
      const labels = {
        gerado: "Gerado",
        enviado: "Enviado",
        visualizado: "Visualizado"
      };
      return labels[status] || status;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiButton = __nuxt_component_1;
      const _component_UiSelect = __nuxt_component_6;
      const _component_UiEmptyState = __nuxt_component_2;
      const _component_UiModal = __nuxt_component_3;
      const _component_UiNotification = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-gray-900">📄 Gestão de Holerites</h1><p class="text-gray-600">Gerencie e envie holerites para os funcionários</p></div><div class="flex gap-3">`);
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "secondary",
        onClick: ($event) => abrirModalGerar("adiantamento"),
        disabled: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 💰 Gerar Adiantamento (40%) `);
          } else {
            return [
              createTextVNode(" 💰 Gerar Adiantamento (40%) ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiButton, {
        onClick: ($event) => abrirModalGerar("mensal"),
        disabled: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 📄 Gerar Folha Mensal `);
          } else {
            return [
              createTextVNode(" 📄 Gerar Folha Mensal ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "ghost",
        onClick: abrirModalDisponibilizar,
        disabled: unref(loading) || unref(holerites).length === 0
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 👤 Disponibilizar no Perfil `);
          } else {
            return [
              createTextVNode(" 👤 Disponibilizar no Perfil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "ghost",
        onClick: abrirModalEnvio,
        disabled: unref(loading) || unref(holerites).length === 0
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 📧 Enviar por Email `);
          } else {
            return [
              createTextVNode(" 📧 Enviar por Email ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="bg-white p-4 rounded-xl border border-gray-200"><div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: unref(filtros).empresa,
        "onUpdate:modelValue": ($event) => unref(filtros).empresa = $event,
        options: unref(empresasOptions),
        label: "Empresa",
        placeholder: "Todas as empresas"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: unref(filtros).mes,
        "onUpdate:modelValue": ($event) => unref(filtros).mes = $event,
        options: unref(mesesOptions),
        label: "Mês/Ano",
        placeholder: "Selecione o período"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: unref(filtros).status,
        "onUpdate:modelValue": ($event) => unref(filtros).status = $event,
        options: unref(statusOptions),
        label: "Status",
        placeholder: "Todos os status"
      }, null, _parent));
      _push(`<div class="flex items-end">`);
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "secondary",
        onClick: aplicarFiltros,
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 🔍 Filtrar `);
          } else {
            return [
              createTextVNode(" 🔍 Filtrar ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="bg-white rounded-xl border border-gray-200"><div class="p-6 border-b border-gray-200"><h2 class="text-lg font-semibold text-gray-900">Holerites Gerados</h2><p class="text-sm text-gray-600">${ssrInterpolate(unref(holerites).length)} holerite(s) encontrado(s)</p></div>`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p class="mt-2 text-gray-600">Carregando holerites...</p></div>`);
      } else if (unref(holerites).length === 0) {
        _push(`<div class="p-8">`);
        _push(ssrRenderComponent(_component_UiEmptyState, {
          title: "Nenhum holerite encontrado",
          description: "Gere holerites automáticos ou ajuste os filtros",
          icon: "document"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="divide-y divide-gray-200"><!--[-->`);
        ssrRenderList(unref(holerites), (holerite) => {
          _push(`<div class="p-6 hover:bg-gray-50 transition-colors"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><span class="text-blue-600 font-semibold">${ssrInterpolate(holerite.funcionario.nome_completo.charAt(0))}</span></div><div><h3 class="font-semibold text-gray-900">${ssrInterpolate(holerite.funcionario.nome_completo)}</h3><p class="text-sm text-gray-600">${ssrInterpolate(holerite.funcionario.cargo || "Cargo não definido")}</p><p class="text-xs text-gray-500">${ssrInterpolate(holerite.funcionario.empresa || "Empresa não definida")}</p></div></div><div class="flex items-center gap-4"><div class="text-right"><p class="font-semibold text-gray-900">${ssrInterpolate(formatarMoeda(holerite.salario_liquido))}</p><p class="text-sm text-gray-600">${ssrInterpolate(formatarPeriodo(holerite.periodo_inicio, holerite.periodo_fim))}</p><span class="${ssrRenderClass([
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            holerite.status === "enviado" ? "bg-green-100 text-green-800" : holerite.status === "gerado" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          ])}">${ssrInterpolate(getStatusLabel(holerite.status))}</span></div><div class="flex gap-2">`);
          _push(ssrRenderComponent(_component_UiButton, {
            variant: "secondary",
            size: "sm",
            onClick: ($event) => visualizarHolerite(holerite)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` 👁️ Ver `);
              } else {
                return [
                  createTextVNode(" 👁️ Ver ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UiButton, {
            variant: "secondary",
            size: "sm",
            onClick: ($event) => editarHolerite(holerite)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ✏️ Editar `);
              } else {
                return [
                  createTextVNode(" ✏️ Editar ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UiButton, {
            size: "sm",
            onClick: ($event) => enviarHolerite(holerite),
            disabled: holerite.status === "enviado"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` 📧 Enviar `);
              } else {
                return [
                  createTextVNode(" 📧 Enviar ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UiButton, {
            variant: "danger",
            size: "sm",
            onClick: ($event) => excluirHolerite(holerite)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` 🗑️ Excluir `);
              } else {
                return [
                  createTextVNode(" 🗑️ Excluir ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalVisualizacao),
        "onUpdate:modelValue": ($event) => isRef(modalVisualizacao) ? modalVisualizacao.value = $event : null,
        title: "Visualizar Holerite",
        "max-width": "max-w-3xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(holeriteSelecionado)) {
              _push2(ssrRenderComponent(HoleriteModal, {
                holerite: unref(holeriteSelecionado),
                onClose: ($event) => modalVisualizacao.value = false
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(holeriteSelecionado) ? (openBlock(), createBlock(HoleriteModal, {
                key: 0,
                holerite: unref(holeriteSelecionado),
                onClose: ($event) => modalVisualizacao.value = false
              }, null, 8, ["holerite", "onClose"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalEdicao),
        "onUpdate:modelValue": ($event) => isRef(modalEdicao) ? modalEdicao.value = $event : null,
        title: "Editar Holerite",
        "max-width": "max-w-4xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(holeriteSelecionado)) {
              _push2(ssrRenderComponent(HoleriteEditForm, {
                holerite: unref(holeriteSelecionado),
                onSave: salvarEdicaoHolerite,
                onCancel: ($event) => modalEdicao.value = false
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(holeriteSelecionado) ? (openBlock(), createBlock(HoleriteEditForm, {
                key: 0,
                holerite: unref(holeriteSelecionado),
                onSave: salvarEdicaoHolerite,
                onCancel: ($event) => modalEdicao.value = false
              }, null, 8, ["holerite", "onCancel"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(mostrarModalGerar),
        "onUpdate:modelValue": ($event) => isRef(mostrarModalGerar) ? mostrarModalGerar.value = $event : null,
        title: unref(tipoGeracao) === "adiantamento" ? "Gerar Adiantamento Salarial" : "Gerar Folha Mensal",
        "max-width": "max-w-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (unref(tipoGeracao) === "adiantamento") {
              _push2(`<div class="bg-blue-50 border border-blue-200 rounded-lg p-4"${_scopeId}><p class="text-sm text-blue-800"${_scopeId}><strong${_scopeId}>💰 Adiantamento Salarial (40%):</strong><br${_scopeId}> • Gerar adiantamento de 40% do salário base<br${_scopeId}> • Período: Primeira quinzena do mês atual<br${_scopeId}> • O valor será descontado automaticamente na folha mensal<br${_scopeId}> • Sem cálculo de INSS e IRRF (apenas adiantamento) </p></div>`);
            } else {
              _push2(`<div class="bg-blue-50 border border-blue-200 rounded-lg p-4"${_scopeId}><p class="text-sm text-blue-800"${_scopeId}><strong${_scopeId}>📄 Folha de Pagamento Mensal:</strong><br${_scopeId}> • Gerar holerites completos para todos os funcionários ativos<br${_scopeId}> • Período: Mês completo<br${_scopeId}> • Cálculos automáticos de INSS, IRRF e descontos<br${_scopeId}> • Desconto automático de adiantamentos já pagos </p></div>`);
            }
            _push2(`<div class="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"${_scopeId}><input type="checkbox" id="recriar"${ssrIncludeBooleanAttr(Array.isArray(unref(opcoesGeracao).recriar) ? ssrLooseContain(unref(opcoesGeracao).recriar, null) : unref(opcoesGeracao).recriar) ? " checked" : ""} class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"${_scopeId}><label for="recriar" class="text-sm text-yellow-800 cursor-pointer"${_scopeId}><strong${_scopeId}>🔄 Recriar holerites existentes</strong><br${_scopeId}><span class="text-xs"${_scopeId}>Se marcado, holerites já gerados para este período serão excluídos e recriados</span></label></div><div class="flex gap-3 justify-end pt-4 border-t"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "secondary",
              onClick: ($event) => mostrarModalGerar.value = false
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
              onClick: confirmarGeracaoHolerites,
              disabled: unref(loading)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(loading) ? "Gerando..." : "✓ Confirmar Geração")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(loading) ? "Gerando..." : "✓ Confirmar Geração"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                unref(tipoGeracao) === "adiantamento" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-blue-50 border border-blue-200 rounded-lg p-4"
                }, [
                  createVNode("p", { class: "text-sm text-blue-800" }, [
                    createVNode("strong", null, "💰 Adiantamento Salarial (40%):"),
                    createVNode("br"),
                    createTextVNode(" • Gerar adiantamento de 40% do salário base"),
                    createVNode("br"),
                    createTextVNode(" • Período: Primeira quinzena do mês atual"),
                    createVNode("br"),
                    createTextVNode(" • O valor será descontado automaticamente na folha mensal"),
                    createVNode("br"),
                    createTextVNode(" • Sem cálculo de INSS e IRRF (apenas adiantamento) ")
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bg-blue-50 border border-blue-200 rounded-lg p-4"
                }, [
                  createVNode("p", { class: "text-sm text-blue-800" }, [
                    createVNode("strong", null, "📄 Folha de Pagamento Mensal:"),
                    createVNode("br"),
                    createTextVNode(" • Gerar holerites completos para todos os funcionários ativos"),
                    createVNode("br"),
                    createTextVNode(" • Período: Mês completo"),
                    createVNode("br"),
                    createTextVNode(" • Cálculos automáticos de INSS, IRRF e descontos"),
                    createVNode("br"),
                    createTextVNode(" • Desconto automático de adiantamentos já pagos ")
                  ])
                ])),
                createVNode("div", { class: "flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg" }, [
                  withDirectives(createVNode("input", {
                    type: "checkbox",
                    id: "recriar",
                    "onUpdate:modelValue": ($event) => unref(opcoesGeracao).recriar = $event,
                    class: "w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelCheckbox, unref(opcoesGeracao).recriar]
                  ]),
                  createVNode("label", {
                    for: "recriar",
                    class: "text-sm text-yellow-800 cursor-pointer"
                  }, [
                    createVNode("strong", null, "🔄 Recriar holerites existentes"),
                    createVNode("br"),
                    createVNode("span", { class: "text-xs" }, "Se marcado, holerites já gerados para este período serão excluídos e recriados")
                  ])
                ]),
                createVNode("div", { class: "flex gap-3 justify-end pt-4 border-t" }, [
                  createVNode(_component_UiButton, {
                    variant: "secondary",
                    onClick: ($event) => mostrarModalGerar.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancelar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UiButton, {
                    onClick: confirmarGeracaoHolerites,
                    disabled: unref(loading)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(loading) ? "Gerando..." : "✓ Confirmar Geração"), 1)
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
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(mostrarModalEnvio),
        "onUpdate:modelValue": ($event) => isRef(mostrarModalEnvio) ? mostrarModalEnvio.value = $event : null,
        title: "Enviar Holerites por Email",
        "max-width": "max-w-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"${_scopeId}><p class="text-sm text-blue-800 mb-3"${_scopeId}><strong${_scopeId}>📧 Selecione o tipo de holerite para enviar:</strong></p><div class="space-y-3"${_scopeId}><div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"${_scopeId}><input type="radio" id="enviar-adiantamento" value="adiantamento"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(tipoEnvio), "adiantamento")) ? " checked" : ""} class="w-4 h-4 text-blue-600"${_scopeId}><label for="enviar-adiantamento" class="flex-1 cursor-pointer"${_scopeId}><strong class="text-gray-900"${_scopeId}>💰 Apenas Adiantamentos</strong><br${_scopeId}><span class="text-xs text-gray-600"${_scopeId}>Enviar apenas holerites de adiantamento (primeira quinzena)</span></label></div><div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"${_scopeId}><input type="radio" id="enviar-mensal" value="mensal"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(tipoEnvio), "mensal")) ? " checked" : ""} class="w-4 h-4 text-blue-600"${_scopeId}><label for="enviar-mensal" class="flex-1 cursor-pointer"${_scopeId}><strong class="text-gray-900"${_scopeId}>📄 Apenas Folhas Mensais</strong><br${_scopeId}><span class="text-xs text-gray-600"${_scopeId}>Enviar apenas holerites mensais completos</span></label></div><div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"${_scopeId}><input type="radio" id="enviar-todos" value="todos"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(tipoEnvio), "todos")) ? " checked" : ""} class="w-4 h-4 text-blue-600"${_scopeId}><label for="enviar-todos" class="flex-1 cursor-pointer"${_scopeId}><strong class="text-gray-900"${_scopeId}>📧 Todos os Holerites</strong><br${_scopeId}><span class="text-xs text-gray-600"${_scopeId}>Enviar todos os holerites listados</span></label></div></div></div><div class="bg-gray-50 border border-gray-200 rounded-lg p-4"${_scopeId}><p class="text-sm text-gray-700"${_scopeId}><strong${_scopeId}>Total a enviar:</strong> ${ssrInterpolate(contarHoleritesPorTipo())} holerite(s) </p></div><div class="flex gap-3 justify-end pt-4 border-t"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "secondary",
              onClick: ($event) => mostrarModalEnvio.value = false
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
              onClick: confirmarEnvioHolerites,
              disabled: unref(loading) || contarHoleritesPorTipo() === 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(loading) ? "Enviando..." : "✓ Confirmar Envio")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(loading) ? "Enviando..." : "✓ Confirmar Envio"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "bg-blue-50 border border-blue-200 rounded-lg p-4" }, [
                  createVNode("p", { class: "text-sm text-blue-800 mb-3" }, [
                    createVNode("strong", null, "📧 Selecione o tipo de holerite para enviar:")
                  ]),
                  createVNode("div", { class: "space-y-3" }, [
                    createVNode("div", { class: "flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200" }, [
                      withDirectives(createVNode("input", {
                        type: "radio",
                        id: "enviar-adiantamento",
                        value: "adiantamento",
                        "onUpdate:modelValue": ($event) => isRef(tipoEnvio) ? tipoEnvio.value = $event : null,
                        class: "w-4 h-4 text-blue-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelRadio, unref(tipoEnvio)]
                      ]),
                      createVNode("label", {
                        for: "enviar-adiantamento",
                        class: "flex-1 cursor-pointer"
                      }, [
                        createVNode("strong", { class: "text-gray-900" }, "💰 Apenas Adiantamentos"),
                        createVNode("br"),
                        createVNode("span", { class: "text-xs text-gray-600" }, "Enviar apenas holerites de adiantamento (primeira quinzena)")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200" }, [
                      withDirectives(createVNode("input", {
                        type: "radio",
                        id: "enviar-mensal",
                        value: "mensal",
                        "onUpdate:modelValue": ($event) => isRef(tipoEnvio) ? tipoEnvio.value = $event : null,
                        class: "w-4 h-4 text-blue-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelRadio, unref(tipoEnvio)]
                      ]),
                      createVNode("label", {
                        for: "enviar-mensal",
                        class: "flex-1 cursor-pointer"
                      }, [
                        createVNode("strong", { class: "text-gray-900" }, "📄 Apenas Folhas Mensais"),
                        createVNode("br"),
                        createVNode("span", { class: "text-xs text-gray-600" }, "Enviar apenas holerites mensais completos")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200" }, [
                      withDirectives(createVNode("input", {
                        type: "radio",
                        id: "enviar-todos",
                        value: "todos",
                        "onUpdate:modelValue": ($event) => isRef(tipoEnvio) ? tipoEnvio.value = $event : null,
                        class: "w-4 h-4 text-blue-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelRadio, unref(tipoEnvio)]
                      ]),
                      createVNode("label", {
                        for: "enviar-todos",
                        class: "flex-1 cursor-pointer"
                      }, [
                        createVNode("strong", { class: "text-gray-900" }, "📧 Todos os Holerites"),
                        createVNode("br"),
                        createVNode("span", { class: "text-xs text-gray-600" }, "Enviar todos os holerites listados")
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-gray-50 border border-gray-200 rounded-lg p-4" }, [
                  createVNode("p", { class: "text-sm text-gray-700" }, [
                    createVNode("strong", null, "Total a enviar:"),
                    createTextVNode(" " + toDisplayString(contarHoleritesPorTipo()) + " holerite(s) ", 1)
                  ])
                ]),
                createVNode("div", { class: "flex gap-3 justify-end pt-4 border-t" }, [
                  createVNode(_component_UiButton, {
                    variant: "secondary",
                    onClick: ($event) => mostrarModalEnvio.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancelar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UiButton, {
                    onClick: confirmarEnvioHolerites,
                    disabled: unref(loading) || contarHoleritesPorTipo() === 0
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(loading) ? "Enviando..." : "✓ Confirmar Envio"), 1)
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
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(mostrarModalDisponibilizar),
        "onUpdate:modelValue": ($event) => isRef(mostrarModalDisponibilizar) ? mostrarModalDisponibilizar.value = $event : null,
        title: "Disponibilizar Holerites no Perfil",
        "max-width": "max-w-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"${_scopeId}><p class="text-sm text-blue-800 mb-3"${_scopeId}><strong${_scopeId}>👤 Selecione o tipo de holerite para disponibilizar:</strong><br${_scopeId}><span class="text-xs"${_scopeId}>Os holerites ficarão disponíveis para visualização no perfil do funcionário</span></p><div class="space-y-3"${_scopeId}><div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"${_scopeId}><input type="radio" id="disp-adiantamento" value="adiantamento"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(tipoDisponibilizar), "adiantamento")) ? " checked" : ""} class="w-4 h-4 text-blue-600"${_scopeId}><label for="disp-adiantamento" class="flex-1 cursor-pointer"${_scopeId}><strong class="text-gray-900"${_scopeId}>💰 Apenas Adiantamentos</strong><br${_scopeId}><span class="text-xs text-gray-600"${_scopeId}>Disponibilizar apenas holerites de adiantamento</span></label></div><div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"${_scopeId}><input type="radio" id="disp-mensal" value="mensal"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(tipoDisponibilizar), "mensal")) ? " checked" : ""} class="w-4 h-4 text-blue-600"${_scopeId}><label for="disp-mensal" class="flex-1 cursor-pointer"${_scopeId}><strong class="text-gray-900"${_scopeId}>📄 Apenas Folhas Mensais</strong><br${_scopeId}><span class="text-xs text-gray-600"${_scopeId}>Disponibilizar apenas holerites mensais completos</span></label></div><div class="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200"${_scopeId}><input type="radio" id="disp-todos" value="todos"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(tipoDisponibilizar), "todos")) ? " checked" : ""} class="w-4 h-4 text-blue-600"${_scopeId}><label for="disp-todos" class="flex-1 cursor-pointer"${_scopeId}><strong class="text-gray-900"${_scopeId}>📋 Todos os Holerites</strong><br${_scopeId}><span class="text-xs text-gray-600"${_scopeId}>Disponibilizar todos os holerites listados</span></label></div></div></div><div class="bg-gray-50 border border-gray-200 rounded-lg p-4"${_scopeId}><p class="text-sm text-gray-700"${_scopeId}><strong${_scopeId}>Total a disponibilizar:</strong> ${ssrInterpolate(contarHoleritesPorTipoDisp())} holerite(s) </p><p class="text-xs text-gray-500 mt-2"${_scopeId}> Os funcionários poderão visualizar e baixar seus holerites na área &quot;Meus Holerites&quot; </p></div><div class="flex gap-3 justify-end pt-4 border-t"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "secondary",
              onClick: ($event) => mostrarModalDisponibilizar.value = false
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
              onClick: confirmarDisponibilizacao,
              disabled: unref(loading) || contarHoleritesPorTipoDisp() === 0
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(loading) ? "Disponibilizando..." : "✓ Confirmar")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(loading) ? "Disponibilizando..." : "✓ Confirmar"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "bg-blue-50 border border-blue-200 rounded-lg p-4" }, [
                  createVNode("p", { class: "text-sm text-blue-800 mb-3" }, [
                    createVNode("strong", null, "👤 Selecione o tipo de holerite para disponibilizar:"),
                    createVNode("br"),
                    createVNode("span", { class: "text-xs" }, "Os holerites ficarão disponíveis para visualização no perfil do funcionário")
                  ]),
                  createVNode("div", { class: "space-y-3" }, [
                    createVNode("div", { class: "flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200" }, [
                      withDirectives(createVNode("input", {
                        type: "radio",
                        id: "disp-adiantamento",
                        value: "adiantamento",
                        "onUpdate:modelValue": ($event) => isRef(tipoDisponibilizar) ? tipoDisponibilizar.value = $event : null,
                        class: "w-4 h-4 text-blue-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelRadio, unref(tipoDisponibilizar)]
                      ]),
                      createVNode("label", {
                        for: "disp-adiantamento",
                        class: "flex-1 cursor-pointer"
                      }, [
                        createVNode("strong", { class: "text-gray-900" }, "💰 Apenas Adiantamentos"),
                        createVNode("br"),
                        createVNode("span", { class: "text-xs text-gray-600" }, "Disponibilizar apenas holerites de adiantamento")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200" }, [
                      withDirectives(createVNode("input", {
                        type: "radio",
                        id: "disp-mensal",
                        value: "mensal",
                        "onUpdate:modelValue": ($event) => isRef(tipoDisponibilizar) ? tipoDisponibilizar.value = $event : null,
                        class: "w-4 h-4 text-blue-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelRadio, unref(tipoDisponibilizar)]
                      ]),
                      createVNode("label", {
                        for: "disp-mensal",
                        class: "flex-1 cursor-pointer"
                      }, [
                        createVNode("strong", { class: "text-gray-900" }, "📄 Apenas Folhas Mensais"),
                        createVNode("br"),
                        createVNode("span", { class: "text-xs text-gray-600" }, "Disponibilizar apenas holerites mensais completos")
                      ])
                    ]),
                    createVNode("div", { class: "flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200" }, [
                      withDirectives(createVNode("input", {
                        type: "radio",
                        id: "disp-todos",
                        value: "todos",
                        "onUpdate:modelValue": ($event) => isRef(tipoDisponibilizar) ? tipoDisponibilizar.value = $event : null,
                        class: "w-4 h-4 text-blue-600"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelRadio, unref(tipoDisponibilizar)]
                      ]),
                      createVNode("label", {
                        for: "disp-todos",
                        class: "flex-1 cursor-pointer"
                      }, [
                        createVNode("strong", { class: "text-gray-900" }, "📋 Todos os Holerites"),
                        createVNode("br"),
                        createVNode("span", { class: "text-xs text-gray-600" }, "Disponibilizar todos os holerites listados")
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-gray-50 border border-gray-200 rounded-lg p-4" }, [
                  createVNode("p", { class: "text-sm text-gray-700" }, [
                    createVNode("strong", null, "Total a disponibilizar:"),
                    createTextVNode(" " + toDisplayString(contarHoleritesPorTipoDisp()) + " holerite(s) ", 1)
                  ]),
                  createVNode("p", { class: "text-xs text-gray-500 mt-2" }, ' Os funcionários poderão visualizar e baixar seus holerites na área "Meus Holerites" ')
                ]),
                createVNode("div", { class: "flex gap-3 justify-end pt-4 border-t" }, [
                  createVNode(_component_UiButton, {
                    variant: "secondary",
                    onClick: ($event) => mostrarModalDisponibilizar.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancelar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UiButton, {
                    onClick: confirmarDisponibilizacao,
                    disabled: unref(loading) || contarHoleritesPorTipoDisp() === 0
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(loading) ? "Disponibilizando..." : "✓ Confirmar"), 1)
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
      if (unref(mostrarNotificacao)) {
        _push(ssrRenderComponent(_component_UiNotification, {
          show: unref(mostrarNotificacao),
          title: unref(notificacao).title,
          message: unref(notificacao).message,
          variant: unref(notificacao).variant,
          onClose: ($event) => mostrarNotificacao.value = false
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/holerites.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=holerites-CMROI_cU.mjs.map
