import { _ as __nuxt_component_0 } from './UiPageHeader-Cc5ywX71.mjs';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2 } from './UiCard-Co7bHBSC.mjs';
import { _ as __nuxt_component_2$1 } from './UiBadge-BLIbLGMQ.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_7 } from './UiModal-C-UfYvvP.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, openBlock, createCommentVNode, isRef, withModifiers, Fragment, renderList, computed, watch, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { _ as __nuxt_component_6 } from './UiSelect-DFt9aazW.mjs';
import { _ as __nuxt_component_0$1 } from './UiCheckbox-Bexlss1e.mjs';
import { _ as __nuxt_component_1$1 } from './UiAlert-BhgRUHOS.mjs';
import { u as useEmpresas } from './useEmpresas-ynMlGawe.mjs';
import { n as navigateTo } from './server.mjs';
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

const useCNPJ = () => {
  const loading = ref(false);
  const error = ref("");
  const consultarCNPJ = async (cnpj) => {
    loading.value = true;
    error.value = "";
    try {
      const cnpjLimpo = cnpj.replace(/[^\d]/g, "");
      if (!cnpjLimpo) {
        throw new Error("CNPJ é obrigatório");
      }
      if (cnpjLimpo.length !== 14) {
        throw new Error("CNPJ deve ter 14 dígitos");
      }
      if (!validarCNPJ(cnpjLimpo)) {
        throw new Error("CNPJ inválido");
      }
      console.log("🔍 Consultando CNPJ:", cnpjLimpo);
      const response = await $fetch("/api/consulta-cnpj", {
        method: "POST",
        body: { cnpj: cnpjLimpo },
        headers: {
          "Content-Type": "application/json"
        },
        // Adicionar retry em caso de falha
        retry: 1,
        retryDelay: 1e3
      });
      console.log("📦 Resposta recebida:", response);
      if (response.success) {
        console.log("🏢 Inscrição Estadual:", response.data?.inscricao_estadual || "Não informada");
        return {
          success: true,
          data: response.data,
          message: "Dados da empresa encontrados com sucesso!"
        };
      } else {
        throw new Error("Erro na consulta");
      }
    } catch (err) {
      console.error("❌ Erro na consulta CNPJ:", err);
      let mensagem = "Erro ao consultar CNPJ";
      if (err.statusCode === 404) {
        mensagem = "CNPJ não encontrado na Receita Federal";
      } else if (err.statusCode === 400) {
        mensagem = err.data?.message || err.message || "CNPJ inválido";
      } else if (err.statusCode === 429) {
        mensagem = "Muitas consultas realizadas. Aguarde alguns minutos e tente novamente.";
      } else if (err.statusCode === 503) {
        mensagem = "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
      } else if (err.name === "FetchError") {
        mensagem = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else {
        mensagem = err.data?.message || err.message || "Erro interno do servidor";
      }
      error.value = mensagem;
      return {
        success: false,
        message: mensagem
      };
    } finally {
      loading.value = false;
    }
  };
  const formatarCNPJ = (cnpj) => {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, "");
    if (cnpjLimpo.length === 14) {
      return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    return cnpj;
  };
  const validarCNPJ = (cnpj) => {
    const cnpjLimpo = cnpj.replace(/[^\d]/g, "");
    if (cnpjLimpo.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpjLimpo)) return false;
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digito1 = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (parseInt(cnpjLimpo.charAt(12)) !== digito1) return false;
    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let digito2 = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return parseInt(cnpjLimpo.charAt(13)) === digito2;
  };
  return {
    loading: readonly(loading),
    error: readonly(error),
    consultarCNPJ,
    formatarCNPJ,
    validarCNPJ
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UiInputCNPJ",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: {},
    placeholder: { default: "00.000.000/0000-00" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    hint: {},
    error: {},
    autoConsulta: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "dados-encontrados"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { formatarCNPJ, validarCNPJ, loading: consultando, error: consultaError } = useCNPJ();
    const id = computed(() => `cnpj-input-${Math.random().toString(36).substring(2, 11)}`);
    const consultaSucesso = ref("");
    const debounceTimer = ref(null);
    const displayValue = computed(() => {
      return formatarCNPJ(props.modelValue);
    });
    const cnpjValido = computed(() => {
      const cnpjLimpo = props.modelValue.replace(/[^\d]/g, "");
      return cnpjLimpo.length === 14 && validarCNPJ(cnpjLimpo);
    });
    watch(() => props.modelValue, () => {
      consultaSucesso.value = "";
      if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
      }
    }, { immediate: false });
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
        "w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors pr-20",
        __props.disabled ? "border-gray-100 bg-gray-50 text-gray-500" : "border-gray-200 focus:border-primary-500",
        __props.error ? "border-red-300" : "",
        unref(consultando) ? "bg-blue-50" : ""
      ])}">`);
      if (unref(cnpjValido) && !unref(consultando)) {
        _push(`<button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"> 🔍 Buscar </button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(consultando)) {
        _push(`<div class="absolute right-4 top-1/2 -translate-y-1/2"><svg class="w-5 h-5 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-1 space-y-1">`);
      if (__props.hint && !__props.error && !unref(consultaError)) {
        _push(`<p class="text-xs text-gray-400">${ssrInterpolate(__props.hint)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(__props.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(consultaError)) {
        _push(`<p class="text-xs text-red-500">${ssrInterpolate(unref(consultaError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(consultaSucesso)) {
        _push(`<p class="text-xs text-green-600 flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${ssrInterpolate(unref(consultaSucesso))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiInputCNPJ.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "UiInputCNPJ" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "empresas",
  __ssrInlineRender: true,
  setup(__props) {
    const { empresas, salvarEmpresa, deletarEmpresa } = useEmpresas();
    const modalAberto = ref(false);
    const modalTabelasAberto = ref(false);
    const empresaEditando = ref(null);
    const mostrarNotificacao = ref(false);
    const notificacao = ref({
      title: "",
      message: "",
      variant: "success"
    });
    const form = ref({
      // Dados principais
      nome: "",
      nome_fantasia: "",
      cnpj: "",
      inscricao_estadual: "",
      // Endereço detalhado
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      municipio: "",
      uf: "",
      cep: "",
      // Contatos
      telefone: "",
      email_holerites: "",
      // Informações cadastrais
      situacao_cadastral: "",
      atividade_principal: "",
      natureza_juridica: "",
      porte: "",
      capital_social: "",
      data_abertura: "",
      // Sistema
      logo_url: "",
      mostrar_logo: true,
      mostrar_endereco: true,
      mostrar_cnpj: true,
      mostrar_detalhes_inss: false,
      mostrar_detalhes_irrf: false
    });
    const tabelaINSS = [
      { id: 1, faixa: "Até R$ 1.518,00", aliquota: 7.5 },
      { id: 2, faixa: "R$ 1.518,01 a R$ 2.793,88", aliquota: 9 },
      { id: 3, faixa: "R$ 2.793,89 a R$ 4.190,83", aliquota: 12 },
      { id: 4, faixa: "R$ 4.190,84 a R$ 8.157,41", aliquota: 14 }
    ];
    const tabelaIRRF = [
      { id: 1, faixa: "Até R$ 2.428,80", aliquota: "Isento" },
      { id: 2, faixa: "R$ 2.428,81 a R$ 3.051,00", aliquota: "7,5%" },
      { id: 3, faixa: "R$ 3.051,01 a R$ 4.052,00", aliquota: "15%" },
      { id: 4, faixa: "R$ 4.052,01 a R$ 5.050,00", aliquota: "22,5%" },
      { id: 5, faixa: "Acima de R$ 5.050,00", aliquota: "27,5%" },
      { id: 6, faixa: "Lei 15.270/2025", aliquota: "Redução até R$ 7.350" }
    ];
    const ufOptions = [
      { value: "AC", label: "Acre" },
      { value: "AL", label: "Alagoas" },
      { value: "AP", label: "Amapá" },
      { value: "AM", label: "Amazonas" },
      { value: "BA", label: "Bahia" },
      { value: "CE", label: "Ceará" },
      { value: "DF", label: "Distrito Federal" },
      { value: "ES", label: "Espírito Santo" },
      { value: "GO", label: "Goiás" },
      { value: "MA", label: "Maranhão" },
      { value: "MT", label: "Mato Grosso" },
      { value: "MS", label: "Mato Grosso do Sul" },
      { value: "MG", label: "Minas Gerais" },
      { value: "PA", label: "Pará" },
      { value: "PB", label: "Paraíba" },
      { value: "PR", label: "Paraná" },
      { value: "PE", label: "Pernambuco" },
      { value: "PI", label: "Piauí" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "RN", label: "Rio Grande do Norte" },
      { value: "RS", label: "Rio Grande do Sul" },
      { value: "RO", label: "Rondônia" },
      { value: "RR", label: "Roraima" },
      { value: "SC", label: "Santa Catarina" },
      { value: "SP", label: "São Paulo" },
      { value: "SE", label: "Sergipe" },
      { value: "TO", label: "Tocantins" }
    ];
    const abrirModal = (empresa) => {
      if (empresa) {
        empresaEditando.value = empresa;
        Object.assign(form.value, empresa);
      } else {
        empresaEditando.value = null;
        form.value = {
          // Dados principais
          nome: "",
          nome_fantasia: "",
          cnpj: "",
          inscricao_estadual: "",
          // Endereço
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          municipio: "",
          uf: "",
          cep: "",
          // Contatos
          telefone: "",
          email_holerites: "",
          // Informações cadastrais
          situacao_cadastral: "",
          atividade_principal: "",
          natureza_juridica: "",
          porte: "",
          capital_social: "",
          data_abertura: "",
          // Sistema
          logo_url: "",
          mostrar_logo: true,
          mostrar_endereco: true,
          mostrar_cnpj: true,
          mostrar_detalhes_inss: false,
          mostrar_detalhes_irrf: false
        };
      }
      modalAberto.value = true;
    };
    const salvarEmpresaForm = async () => {
      const dadosEmpresa = empresaEditando.value ? { ...form.value, id: empresaEditando.value.id } : form.value;
      const resultado = await salvarEmpresa(dadosEmpresa);
      notificacao.value = {
        title: resultado.success ? "Sucesso!" : "Erro!",
        message: resultado.message,
        variant: resultado.success ? "success" : "error"
      };
      mostrarNotificacao.value = true;
      if (resultado.success) {
        modalAberto.value = false;
      }
    };
    const deletar = async (empresa) => {
      if (!confirm(`Tem certeza que deseja excluir a empresa "${empresa.nome}"? Esta ação não pode ser desfeita.`)) {
        return;
      }
      const resultado = await deletarEmpresa(empresa.id);
      notificacao.value = {
        title: resultado.success ? "Sucesso!" : "Erro!",
        message: resultado.message,
        variant: resultado.success ? "success" : "error"
      };
      mostrarNotificacao.value = true;
    };
    const verFuncionarios = (empresa) => {
      navigateTo(`/admin/funcionarios?empresa=${empresa.id}`);
    };
    const formatarEnderecoCompleto = (empresa) => {
      const partes = [];
      if (empresa.logradouro) partes.push(empresa.logradouro);
      if (empresa.numero) partes.push(empresa.numero);
      if (empresa.complemento) partes.push(empresa.complemento);
      if (empresa.bairro) partes.push(empresa.bairro);
      if (empresa.municipio) partes.push(empresa.municipio);
      if (empresa.uf) partes.push(empresa.uf);
      if (empresa.cep) partes.push(`CEP: ${empresa.cep}`);
      return partes.join(", ") || empresa.endereco || "Endereço não informado";
    };
    const preencherDadosEmpresa = (dados) => {
      if (dados.nome && !form.value.nome) {
        form.value.nome = dados.nome;
      }
      if (dados.nome_fantasia && !form.value.nome_fantasia) {
        form.value.nome_fantasia = dados.nome_fantasia;
      }
      if (dados.inscricao_estadual && !form.value.inscricao_estadual) {
        form.value.inscricao_estadual = dados.inscricao_estadual;
      }
      if (dados.logradouro && !form.value.logradouro) {
        form.value.logradouro = dados.logradouro;
      }
      if (dados.numero && !form.value.numero) {
        form.value.numero = dados.numero;
      }
      if (dados.complemento && !form.value.complemento) {
        form.value.complemento = dados.complemento;
      }
      if (dados.bairro && !form.value.bairro) {
        form.value.bairro = dados.bairro;
      }
      if (dados.municipio && !form.value.municipio) {
        form.value.municipio = dados.municipio;
      }
      if (dados.uf && !form.value.uf) {
        form.value.uf = dados.uf;
      }
      if (dados.cep && !form.value.cep) {
        form.value.cep = dados.cep;
      }
      if (dados.telefone && !form.value.telefone) {
        form.value.telefone = dados.telefone;
      }
      if (dados.email && !form.value.email_holerites) {
        form.value.email_holerites = dados.email;
      }
      if (dados.situacao_cadastral) {
        form.value.situacao_cadastral = dados.situacao_cadastral;
      }
      if (dados.atividade_principal && !form.value.atividade_principal) {
        form.value.atividade_principal = dados.atividade_principal;
      }
      if (dados.natureza_juridica && !form.value.natureza_juridica) {
        form.value.natureza_juridica = dados.natureza_juridica;
      }
      if (dados.porte && !form.value.porte) {
        form.value.porte = dados.porte;
      }
      if (dados.capital_social && !form.value.capital_social) {
        form.value.capital_social = dados.capital_social;
      }
      if (dados.data_abertura && !form.value.data_abertura) {
        form.value.data_abertura = dados.data_abertura;
      }
      form.value.cnpj = dados.cnpj;
      notificacao.value = {
        title: "Dados encontrados!",
        message: `Empresa: ${dados.nome} - ${dados.situacao_cadastral}`,
        variant: "success"
      };
      mostrarNotificacao.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPageHeader = __nuxt_component_0;
      const _component_UiButton = __nuxt_component_1;
      const _component_UiCard = __nuxt_component_2;
      const _component_UiBadge = __nuxt_component_2$1;
      const _component_UiModal = __nuxt_component_3;
      const _component_UiInputCNPJ = __nuxt_component_5;
      const _component_UiInput = __nuxt_component_4;
      const _component_UiSelect = __nuxt_component_6;
      const _component_UiCheckbox = __nuxt_component_0$1;
      const _component_UiAlert = __nuxt_component_1$1;
      const _component_UiNotification = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UiPageHeader, {
        title: "Empresas",
        description: "Gerencie todas as empresas do sistema"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "ghost",
              icon: "📊",
              onClick: ($event) => modalTabelasAberto.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Ver Tabelas INSS/IRRF `);
                } else {
                  return [
                    createTextVNode(" Ver Tabelas INSS/IRRF ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              size: "lg",
              icon: "➕",
              onClick: ($event) => abrirModal()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Nova Empresa `);
                } else {
                  return [
                    createTextVNode(" Nova Empresa ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-3" }, [
                createVNode(_component_UiButton, {
                  variant: "ghost",
                  icon: "📊",
                  onClick: ($event) => modalTabelasAberto.value = true
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Ver Tabelas INSS/IRRF ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_UiButton, {
                  size: "lg",
                  icon: "➕",
                  onClick: ($event) => abrirModal()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Nova Empresa ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(empresas), (empresa) => {
        _push(ssrRenderComponent(_component_UiCard, {
          key: empresa.id,
          padding: "p-6"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center"${_scopeId}>`);
              if (empresa.logo_url) {
                _push2(`<img${ssrRenderAttr("src", empresa.logo_url)}${ssrRenderAttr("alt", empresa.nome)} class="w-full h-full object-cover rounded-xl"${_scopeId}>`);
              } else {
                _push2(`<span class="text-primary-700 font-bold text-2xl"${_scopeId}>${ssrInterpolate(empresa.nome.charAt(0))}</span>`);
              }
              _push2(`</div><div${_scopeId}><h3 class="text-xl font-bold text-gray-800"${_scopeId}>${ssrInterpolate(empresa.nome)}</h3>`);
              if (empresa.nome_fantasia) {
                _push2(`<p class="text-lg text-gray-600"${_scopeId}>${ssrInterpolate(empresa.nome_fantasia)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p class="text-gray-500"${_scopeId}>CNPJ: ${ssrInterpolate(empresa.cnpj)}</p>`);
              if (empresa.inscricao_estadual) {
                _push2(`<p class="text-sm text-gray-400"${_scopeId}>IE: ${ssrInterpolate(empresa.inscricao_estadual)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p class="text-sm text-gray-400"${_scopeId}>${ssrInterpolate(empresa.endereco_completo || formatarEnderecoCompleto(empresa))}</p><div class="flex gap-2 mt-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UiBadge, { variant: "info" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(empresa.funcionarios_count)} funcionários`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(empresa.funcionarios_count) + " funcionários", 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (empresa.situacao_cadastral) {
                _push2(ssrRenderComponent(_component_UiBadge, {
                  variant: empresa.situacao_cadastral === "ATIVA" ? "success" : "warning"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(empresa.situacao_cadastral)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(empresa.situacao_cadastral), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div><div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => abrirModal(empresa)
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
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "ghost",
                onClick: ($event) => verFuncionarios(empresa)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`👥 Funcionários`);
                  } else {
                    return [
                      createTextVNode("👥 Funcionários")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UiButton, {
                variant: "danger",
                onClick: ($event) => deletar(empresa)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` 🗑️ Excluir `);
                  } else {
                    return [
                      createTextVNode(" 🗑️ Excluir ")
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
                    createVNode("div", { class: "w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center" }, [
                      empresa.logo_url ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: empresa.logo_url,
                        alt: empresa.nome,
                        class: "w-full h-full object-cover rounded-xl"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-primary-700 font-bold text-2xl"
                      }, toDisplayString(empresa.nome.charAt(0)), 1))
                    ]),
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-xl font-bold text-gray-800" }, toDisplayString(empresa.nome), 1),
                      empresa.nome_fantasia ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-lg text-gray-600"
                      }, toDisplayString(empresa.nome_fantasia), 1)) : createCommentVNode("", true),
                      createVNode("p", { class: "text-gray-500" }, "CNPJ: " + toDisplayString(empresa.cnpj), 1),
                      empresa.inscricao_estadual ? (openBlock(), createBlock("p", {
                        key: 1,
                        class: "text-sm text-gray-400"
                      }, "IE: " + toDisplayString(empresa.inscricao_estadual), 1)) : createCommentVNode("", true),
                      createVNode("p", { class: "text-sm text-gray-400" }, toDisplayString(empresa.endereco_completo || formatarEnderecoCompleto(empresa)), 1),
                      createVNode("div", { class: "flex gap-2 mt-2" }, [
                        createVNode(_component_UiBadge, { variant: "info" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(empresa.funcionarios_count) + " funcionários", 1)
                          ]),
                          _: 2
                        }, 1024),
                        empresa.situacao_cadastral ? (openBlock(), createBlock(_component_UiBadge, {
                          key: 0,
                          variant: empresa.situacao_cadastral === "ATIVA" ? "success" : "warning"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(empresa.situacao_cadastral), 1)
                          ]),
                          _: 2
                        }, 1032, ["variant"])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UiButton, {
                      variant: "ghost",
                      onClick: ($event) => abrirModal(empresa)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("✏️ Editar")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UiButton, {
                      variant: "ghost",
                      onClick: ($event) => verFuncionarios(empresa)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("👥 Funcionários")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UiButton, {
                      variant: "danger",
                      onClick: ($event) => deletar(empresa)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 🗑️ Excluir ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
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
        modelValue: unref(modalAberto),
        "onUpdate:modelValue": ($event) => isRef(modalAberto) ? modalAberto.value = $event : null,
        title: unref(empresaEditando) ? "Editar Empresa" : "Nova Empresa",
        "max-width": "max-w-4xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-6"${_scopeId}><div${_scopeId}><h3 class="text-lg font-bold text-gray-800 mb-4"${_scopeId}>🏢 Dados da Empresa</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div class="md:col-span-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiInputCNPJ, {
              modelValue: unref(form).cnpj,
              "onUpdate:modelValue": ($event) => unref(form).cnpj = $event,
              label: "CNPJ",
              required: "",
              onDadosEncontrados: preencherDadosEmpresa
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).nome,
              "onUpdate:modelValue": ($event) => unref(form).nome = $event,
              label: "Nome Empresarial (Razão Social)",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).nome_fantasia,
              "onUpdate:modelValue": ($event) => unref(form).nome_fantasia = $event,
              label: "Nome Fantasia"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).inscricao_estadual,
              "onUpdate:modelValue": ($event) => unref(form).inscricao_estadual = $event,
              label: "Inscrição Estadual"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).situacao_cadastral,
              "onUpdate:modelValue": ($event) => unref(form).situacao_cadastral = $event,
              label: "Situação Cadastral",
              disabled: ""
            }, null, _parent2, _scopeId));
            _push2(`<div class="md:col-span-2"${_scopeId}><h4 class="text-md font-semibold text-gray-700 mb-3 mt-4"${_scopeId}>📍 Endereço</h4></div>`);
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).logradouro,
              "onUpdate:modelValue": ($event) => unref(form).logradouro = $event,
              label: "Logradouro",
              placeholder: "Rua, Avenida, etc."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).numero,
              "onUpdate:modelValue": ($event) => unref(form).numero = $event,
              label: "Número",
              placeholder: "123"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).complemento,
              "onUpdate:modelValue": ($event) => unref(form).complemento = $event,
              label: "Complemento",
              placeholder: "Sala, Andar, etc."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).bairro,
              "onUpdate:modelValue": ($event) => unref(form).bairro = $event,
              label: "Bairro"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).municipio,
              "onUpdate:modelValue": ($event) => unref(form).municipio = $event,
              label: "Município"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiSelect, {
              modelValue: unref(form).uf,
              "onUpdate:modelValue": ($event) => unref(form).uf = $event,
              options: ufOptions,
              label: "UF",
              placeholder: "Selecione..."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).cep,
              "onUpdate:modelValue": ($event) => unref(form).cep = $event,
              label: "CEP",
              placeholder: "00000-000"
            }, null, _parent2, _scopeId));
            _push2(`<div class="md:col-span-2"${_scopeId}><h4 class="text-md font-semibold text-gray-700 mb-3 mt-4"${_scopeId}>📞 Contatos</h4></div>`);
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).telefone,
              "onUpdate:modelValue": ($event) => unref(form).telefone = $event,
              label: "Telefone",
              placeholder: "(11) 3333-4444"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).email_holerites,
              "onUpdate:modelValue": ($event) => unref(form).email_holerites = $event,
              type: "email",
              label: "Email para Holerites",
              placeholder: "rh@empresa.com"
            }, null, _parent2, _scopeId));
            _push2(`<div class="md:col-span-2"${_scopeId}><h4 class="text-md font-semibold text-gray-700 mb-3 mt-4"${_scopeId}>🖼️ Logo da Empresa</h4><div class="flex items-center gap-4"${_scopeId}><div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center"${_scopeId}>`);
            if (unref(form).logo_url) {
              _push2(`<img${ssrRenderAttr("src", unref(form).logo_url)}${ssrRenderAttr("alt", unref(form).nome)} class="w-full h-full object-cover rounded-xl"${_scopeId}>`);
            } else {
              _push2(`<span class="text-gray-400 text-2xl"${_scopeId}>🏢</span>`);
            }
            _push2(`</div><div class="flex-1"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiInput, {
              modelValue: unref(form).logo_url,
              "onUpdate:modelValue": ($event) => unref(form).logo_url = $event,
              label: "URL da Logo",
              placeholder: "https://exemplo.com/logo.png"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div></div></div><div${_scopeId}><h3 class="text-lg font-bold text-gray-800 mb-4"${_scopeId}>📄 Configurações de Holerites</h3><div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: unref(form).mostrar_logo,
              "onUpdate:modelValue": ($event) => unref(form).mostrar_logo = $event,
              label: "Mostrar logo nos holerites"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: unref(form).mostrar_endereco,
              "onUpdate:modelValue": ($event) => unref(form).mostrar_endereco = $event,
              label: "Mostrar endereço nos holerites"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: unref(form).mostrar_cnpj,
              "onUpdate:modelValue": ($event) => unref(form).mostrar_cnpj = $event,
              label: "Mostrar CNPJ nos holerites"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: unref(form).mostrar_detalhes_inss,
              "onUpdate:modelValue": ($event) => unref(form).mostrar_detalhes_inss = $event,
              label: "Mostrar detalhamento do cálculo de INSS"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: unref(form).mostrar_detalhes_irrf,
              "onUpdate:modelValue": ($event) => unref(form).mostrar_detalhes_irrf = $event,
              label: "Mostrar detalhamento do cálculo de IRRF"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex justify-end gap-3 pt-4 border-t"${_scopeId}>`);
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
              icon: "💾"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Salvar Empresa`);
                } else {
                  return [
                    createTextVNode("Salvar Empresa")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                onSubmit: withModifiers(salvarEmpresaForm, ["prevent"]),
                class: "space-y-6"
              }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "text-lg font-bold text-gray-800 mb-4" }, "🏢 Dados da Empresa"),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode(_component_UiInputCNPJ, {
                        modelValue: unref(form).cnpj,
                        "onUpdate:modelValue": ($event) => unref(form).cnpj = $event,
                        label: "CNPJ",
                        required: "",
                        onDadosEncontrados: preencherDadosEmpresa
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).nome,
                      "onUpdate:modelValue": ($event) => unref(form).nome = $event,
                      label: "Nome Empresarial (Razão Social)",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).nome_fantasia,
                      "onUpdate:modelValue": ($event) => unref(form).nome_fantasia = $event,
                      label: "Nome Fantasia"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).inscricao_estadual,
                      "onUpdate:modelValue": ($event) => unref(form).inscricao_estadual = $event,
                      label: "Inscrição Estadual"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).situacao_cadastral,
                      "onUpdate:modelValue": ($event) => unref(form).situacao_cadastral = $event,
                      label: "Situação Cadastral",
                      disabled: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("h4", { class: "text-md font-semibold text-gray-700 mb-3 mt-4" }, "📍 Endereço")
                    ]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).logradouro,
                      "onUpdate:modelValue": ($event) => unref(form).logradouro = $event,
                      label: "Logradouro",
                      placeholder: "Rua, Avenida, etc."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).numero,
                      "onUpdate:modelValue": ($event) => unref(form).numero = $event,
                      label: "Número",
                      placeholder: "123"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).complemento,
                      "onUpdate:modelValue": ($event) => unref(form).complemento = $event,
                      label: "Complemento",
                      placeholder: "Sala, Andar, etc."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).bairro,
                      "onUpdate:modelValue": ($event) => unref(form).bairro = $event,
                      label: "Bairro"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).municipio,
                      "onUpdate:modelValue": ($event) => unref(form).municipio = $event,
                      label: "Município"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiSelect, {
                      modelValue: unref(form).uf,
                      "onUpdate:modelValue": ($event) => unref(form).uf = $event,
                      options: ufOptions,
                      label: "UF",
                      placeholder: "Selecione..."
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).cep,
                      "onUpdate:modelValue": ($event) => unref(form).cep = $event,
                      label: "CEP",
                      placeholder: "00000-000"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("h4", { class: "text-md font-semibold text-gray-700 mb-3 mt-4" }, "📞 Contatos")
                    ]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).telefone,
                      "onUpdate:modelValue": ($event) => unref(form).telefone = $event,
                      label: "Telefone",
                      placeholder: "(11) 3333-4444"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiInput, {
                      modelValue: unref(form).email_holerites,
                      "onUpdate:modelValue": ($event) => unref(form).email_holerites = $event,
                      type: "email",
                      label: "Email para Holerites",
                      placeholder: "rh@empresa.com"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("h4", { class: "text-md font-semibold text-gray-700 mb-3 mt-4" }, "🖼️ Logo da Empresa"),
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("div", { class: "w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center" }, [
                          unref(form).logo_url ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: unref(form).logo_url,
                            alt: unref(form).nome,
                            class: "w-full h-full object-cover rounded-xl"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-gray-400 text-2xl"
                          }, "🏢"))
                        ]),
                        createVNode("div", { class: "flex-1" }, [
                          createVNode(_component_UiInput, {
                            modelValue: unref(form).logo_url,
                            "onUpdate:modelValue": ($event) => unref(form).logo_url = $event,
                            label: "URL da Logo",
                            placeholder: "https://exemplo.com/logo.png"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("h3", { class: "text-lg font-bold text-gray-800 mb-4" }, "📄 Configurações de Holerites"),
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode(_component_UiCheckbox, {
                      modelValue: unref(form).mostrar_logo,
                      "onUpdate:modelValue": ($event) => unref(form).mostrar_logo = $event,
                      label: "Mostrar logo nos holerites"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiCheckbox, {
                      modelValue: unref(form).mostrar_endereco,
                      "onUpdate:modelValue": ($event) => unref(form).mostrar_endereco = $event,
                      label: "Mostrar endereço nos holerites"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiCheckbox, {
                      modelValue: unref(form).mostrar_cnpj,
                      "onUpdate:modelValue": ($event) => unref(form).mostrar_cnpj = $event,
                      label: "Mostrar CNPJ nos holerites"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiCheckbox, {
                      modelValue: unref(form).mostrar_detalhes_inss,
                      "onUpdate:modelValue": ($event) => unref(form).mostrar_detalhes_inss = $event,
                      label: "Mostrar detalhamento do cálculo de INSS"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_UiCheckbox, {
                      modelValue: unref(form).mostrar_detalhes_irrf,
                      "onUpdate:modelValue": ($event) => unref(form).mostrar_detalhes_irrf = $event,
                      label: "Mostrar detalhamento do cálculo de IRRF"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                createVNode("div", { class: "flex justify-end gap-3 pt-4 border-t" }, [
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
                    icon: "💾"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Salvar Empresa")
                    ]),
                    _: 1
                  })
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalTabelasAberto),
        "onUpdate:modelValue": ($event) => isRef(modalTabelasAberto) ? modalTabelasAberto.value = $event : null,
        title: "📊 Tabelas de INSS e IRRF (2026)",
        "max-width": "max-w-4xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiAlert, { variant: "info" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` As tabelas de INSS e IRRF são atualizadas anualmente pelo governo. O sistema permite atualização fácil sem necessidade de alteração no código. `);
                } else {
                  return [
                    createTextVNode(" As tabelas de INSS e IRRF são atualizadas anualmente pelo governo. O sistema permite atualização fácil sem necessidade de alteração no código. ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6"${_scopeId}><div${_scopeId}><h3 class="text-lg font-bold text-gray-800 mb-4"${_scopeId}>INSS - Tabela Progressiva</h3><div class="border rounded-xl overflow-hidden"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-4 py-3 text-left font-semibold text-gray-600"${_scopeId}>Faixa Salarial</th><th class="px-4 py-3 text-right font-semibold text-gray-600"${_scopeId}>Alíquota</th></tr></thead><tbody class="divide-y"${_scopeId}><!--[-->`);
            ssrRenderList(tabelaINSS, (faixa) => {
              _push2(`<tr${_scopeId}><td class="px-4 py-3"${_scopeId}>${ssrInterpolate(faixa.faixa)}</td><td class="px-4 py-3 text-right font-semibold"${_scopeId}>${ssrInterpolate(faixa.aliquota)}%</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div></div><div${_scopeId}><h3 class="text-lg font-bold text-gray-800 mb-4"${_scopeId}>IRRF - Tabela Progressiva</h3><div class="border rounded-xl overflow-hidden"${_scopeId}><table class="w-full text-sm"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-4 py-3 text-left font-semibold text-gray-600"${_scopeId}>Base de Cálculo</th><th class="px-4 py-3 text-right font-semibold text-gray-600"${_scopeId}>Alíquota</th></tr></thead><tbody class="divide-y"${_scopeId}><!--[-->`);
            ssrRenderList(tabelaIRRF, (faixa) => {
              _push2(`<tr${_scopeId}><td class="px-4 py-3"${_scopeId}>${ssrInterpolate(faixa.faixa)}</td><td class="px-4 py-3 text-right font-semibold"${_scopeId}>${ssrInterpolate(faixa.aliquota)}</td></tr>`);
            });
            _push2(`<!--]--></tbody></table></div></div></div><div class="flex justify-between pt-4 border-t"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiBadge, { variant: "success" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`✓ Tabelas Atualizadas para 2026`);
                } else {
                  return [
                    createTextVNode("✓ Tabelas Atualizadas para 2026")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "ghost",
              onClick: ($event) => modalTabelasAberto.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Fechar`);
                } else {
                  return [
                    createTextVNode("Fechar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode(_component_UiAlert, { variant: "info" }, {
                  default: withCtx(() => [
                    createTextVNode(" As tabelas de INSS e IRRF são atualizadas anualmente pelo governo. O sistema permite atualização fácil sem necessidade de alteração no código. ")
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-2 gap-6" }, [
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-lg font-bold text-gray-800 mb-4" }, "INSS - Tabela Progressiva"),
                    createVNode("div", { class: "border rounded-xl overflow-hidden" }, [
                      createVNode("table", { class: "w-full text-sm" }, [
                        createVNode("thead", { class: "bg-gray-50" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-4 py-3 text-left font-semibold text-gray-600" }, "Faixa Salarial"),
                            createVNode("th", { class: "px-4 py-3 text-right font-semibold text-gray-600" }, "Alíquota")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(tabelaINSS, (faixa) => {
                            return createVNode("tr", {
                              key: faixa.id
                            }, [
                              createVNode("td", { class: "px-4 py-3" }, toDisplayString(faixa.faixa), 1),
                              createVNode("td", { class: "px-4 py-3 text-right font-semibold" }, toDisplayString(faixa.aliquota) + "%", 1)
                            ]);
                          }), 64))
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-lg font-bold text-gray-800 mb-4" }, "IRRF - Tabela Progressiva"),
                    createVNode("div", { class: "border rounded-xl overflow-hidden" }, [
                      createVNode("table", { class: "w-full text-sm" }, [
                        createVNode("thead", { class: "bg-gray-50" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-4 py-3 text-left font-semibold text-gray-600" }, "Base de Cálculo"),
                            createVNode("th", { class: "px-4 py-3 text-right font-semibold text-gray-600" }, "Alíquota")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(tabelaIRRF, (faixa) => {
                            return createVNode("tr", {
                              key: faixa.id
                            }, [
                              createVNode("td", { class: "px-4 py-3" }, toDisplayString(faixa.faixa), 1),
                              createVNode("td", { class: "px-4 py-3 text-right font-semibold" }, toDisplayString(faixa.aliquota), 1)
                            ]);
                          }), 64))
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-between pt-4 border-t" }, [
                  createVNode(_component_UiBadge, { variant: "success" }, {
                    default: withCtx(() => [
                      createTextVNode("✓ Tabelas Atualizadas para 2026")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UiButton, {
                    variant: "ghost",
                    onClick: ($event) => modalTabelasAberto.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Fechar")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/empresas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=empresas-DtkbTHHP.mjs.map
