import { _ as __nuxt_component_0 } from './UiPageHeader-Cc5ywX71.mjs';
import { _ as __nuxt_component_1 } from './UiButton-Cg4Ttn4O.mjs';
import { _ as __nuxt_component_2 } from './UiCard-Co7bHBSC.mjs';
import { a as __nuxt_component_3, _ as __nuxt_component_7 } from './UiModal-C-UfYvvP.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, createVNode, unref, createBlock, withDirectives, openBlock, isRef, vModelText, mergeProps, toDisplayString, createCommentVNode, watch, reactive, isReactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './UiCheckbox-Bexlss1e.mjs';
import { _ as __nuxt_component_4 } from './UiInput-D3rcqyNi.mjs';
import { _ as __nuxt_component_6 } from './UiSelect-DFt9aazW.mjs';
import { _ as __nuxt_component_1$2 } from './UiInputPIS-DlrVjyhf.mjs';
import { u as useJornadas } from './useJornadas-BEy1ph1r.mjs';
import { u as useEmpresas } from './useEmpresas-ynMlGawe.mjs';
import { u as useCargos } from './useCargos-CxsoMI2z.mjs';
import { u as useAdmin } from './useAdmin-B-9JwZLf.mjs';
import { _ as __nuxt_component_1$1 } from './UiAvatar-BMVSUvdY.mjs';
import { _ as __nuxt_component_2$1 } from './UiBadge-BLIbLGMQ.mjs';
import { n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@vue/shared';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@supabase/ssr';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "FuncionarioDadosPessoais",
  __ssrInlineRender: true,
  props: {
    form: {}
  },
  setup(__props) {
    const sexoOptions = [
      { value: "M", label: "Masculino" },
      { value: "F", label: "Feminino" },
      { value: "O", label: "Outro" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiInput = __nuxt_component_4;
      const _component_UiInputPIS = __nuxt_component_1$2;
      const _component_UiSelect = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h3 class="text-lg font-bold text-gray-800 mb-4">👤 Dados Pessoais</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="md:col-span-2">`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.nome_completo,
        "onUpdate:modelValue": ($event) => __props.form.nome_completo = $event,
        label: "Nome Completo",
        required: "",
        placeholder: "Digite o nome completo"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.cpf,
        "onUpdate:modelValue": ($event) => __props.form.cpf = $event,
        label: "CPF",
        required: "",
        placeholder: "000.000.000-00"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInputPIS, {
        modelValue: __props.form.pis_pasep,
        "onUpdate:modelValue": ($event) => __props.form.pis_pasep = $event,
        label: "PIS/PASEP",
        placeholder: "000.00000.00-0"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.rg,
        "onUpdate:modelValue": ($event) => __props.form.rg = $event,
        label: "RG",
        placeholder: "00.000.000-0"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.data_nascimento,
        "onUpdate:modelValue": ($event) => __props.form.data_nascimento = $event,
        type: "date",
        label: "Data de Nascimento"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.sexo,
        "onUpdate:modelValue": ($event) => __props.form.sexo = $event,
        options: sexoOptions,
        label: "Sexo",
        placeholder: "Selecione..."
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.telefone,
        "onUpdate:modelValue": ($event) => __props.form.telefone = $event,
        label: "Telefone",
        placeholder: "(11) 99999-9999"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.email_pessoal,
        "onUpdate:modelValue": ($event) => __props.form.email_pessoal = $event,
        type: "email",
        uppercase: false,
        label: "Email Pessoal",
        placeholder: "email@pessoal.com"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/funcionarios/FuncionarioDadosPessoais.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const FuncionarioDadosPessoais = Object.assign(_sfc_main$6, { __name: "FuncionariosFuncionarioDadosPessoais" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "FuncionarioDadosProfissionais",
  __ssrInlineRender: true,
  props: {
    form: {},
    showEmpresaSelect: { type: Boolean, default: false },
    empresasOptions: {},
    departamentosOptions: {},
    cargosOptions: {},
    jornadaOptionsComputed: {},
    responsavelOptions: {}
  },
  setup(__props) {
    const tipoContratoOptions = [
      { value: "CLT", label: "CLT" },
      { value: "PJ", label: "PJ" },
      { value: "Estagio", label: "Estágio" },
      { value: "Temporario", label: "Temporário" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiSelect = __nuxt_component_6;
      const _component_UiInput = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h3 class="text-lg font-bold text-gray-800 mb-4">💼 Dados Profissionais</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      if (__props.showEmpresaSelect) {
        _push(`<div class="md:col-span-2">`);
        _push(ssrRenderComponent(_component_UiSelect, {
          modelValue: __props.form.empresa_id,
          "onUpdate:modelValue": ($event) => __props.form.empresa_id = $event,
          options: __props.empresasOptions,
          label: "Empresa",
          placeholder: "Selecione a empresa..."
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.departamento_id,
        "onUpdate:modelValue": ($event) => __props.form.departamento_id = $event,
        options: __props.departamentosOptions,
        label: "Departamento",
        placeholder: "Selecione..."
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.cargo_id,
        "onUpdate:modelValue": ($event) => __props.form.cargo_id = $event,
        options: __props.cargosOptions,
        label: "Cargo",
        placeholder: "Selecione..."
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.tipo_contrato,
        "onUpdate:modelValue": ($event) => __props.form.tipo_contrato = $event,
        options: tipoContratoOptions,
        label: "Tipo de Contrato"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.data_admissao,
        "onUpdate:modelValue": ($event) => __props.form.data_admissao = $event,
        type: "date",
        label: "Data de Admissão"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.matricula,
        "onUpdate:modelValue": ($event) => __props.form.matricula = $event,
        label: "Matrícula/Registro",
        placeholder: "Gerado automaticamente"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.jornada_trabalho_id,
        "onUpdate:modelValue": ($event) => __props.form.jornada_trabalho_id = $event,
        options: __props.jornadaOptionsComputed,
        label: "Jornada de Trabalho"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.responsavel_id,
        "onUpdate:modelValue": ($event) => __props.form.responsavel_id = $event,
        options: __props.responsavelOptions,
        label: "Responsável Direto",
        placeholder: "Selecione..."
      }, null, _parent));
      _push(`</div><div class="mt-4 p-4 bg-blue-50 rounded-xl"><p class="text-sm text-blue-700"> 👩‍💼 <strong>Responsável Padrão:</strong> Silvana é automaticamente definida como responsável direto de todos os funcionários. Você pode alterar se necessário, mas por padrão ela supervisiona toda a equipe. </p></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/funcionarios/FuncionarioDadosProfissionais.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const FuncionarioDadosProfissionais = Object.assign(_sfc_main$5, { __name: "FuncionariosFuncionarioDadosProfissionais" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FuncionarioAcessoSistema",
  __ssrInlineRender: true,
  props: {
    form: {}
  },
  setup(__props) {
    const tipoAcessoOptions = [
      { value: "funcionario", label: "Funcionário" },
      { value: "admin", label: "Administrador" }
    ];
    const statusOptions = [
      { value: "ativo", label: "Ativo" },
      { value: "inativo", label: "Inativo" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiInput = __nuxt_component_4;
      const _component_UiSelect = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h3 class="text-lg font-bold text-gray-800 mb-4">🔐 Acesso ao Sistema</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.email_login,
        "onUpdate:modelValue": ($event) => __props.form.email_login = $event,
        type: "email",
        uppercase: false,
        label: "Email de Login",
        required: "",
        placeholder: "email@empresa.com"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.senha,
        "onUpdate:modelValue": ($event) => __props.form.senha = $event,
        type: "password",
        label: "Senha",
        required: "",
        "show-password-toggle": "",
        placeholder: "••••••••"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.tipo_acesso,
        "onUpdate:modelValue": ($event) => __props.form.tipo_acesso = $event,
        options: tipoAcessoOptions,
        label: "Tipo de Acesso"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.status,
        "onUpdate:modelValue": ($event) => __props.form.status = $event,
        options: statusOptions,
        label: "Status do Usuário"
      }, null, _parent));
      _push(`</div><div class="mt-4 p-4 bg-blue-50 rounded-xl"><h4 class="font-semibold text-blue-800 mb-2">📋 Tipos de Acesso:</h4><ul class="text-sm text-blue-700 space-y-1"><li><strong>Funcionário:</strong> Visualiza apenas seus próprios dados</li><li><strong>Administrador:</strong> Acesso total ao sistema</li></ul></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/funcionarios/FuncionarioAcessoSistema.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const FuncionarioAcessoSistema = Object.assign(_sfc_main$4, { __name: "FuncionariosFuncionarioAcessoSistema" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FuncionarioDadosFinanceiros",
  __ssrInlineRender: true,
  props: {
    form: {}
  },
  setup(__props) {
    const tipoSalarioOptions = [
      { value: "mensal", label: "Mensal" },
      { value: "quinzenal", label: "Quinzenal" },
      { value: "horista", label: "Horista" }
    ];
    const formaPagamentoOptions = [
      { value: "deposito", label: "Depósito Bancário" },
      { value: "pix", label: "PIX" }
    ];
    const tipoContaOptions = [
      { value: "corrente", label: "Conta Corrente" },
      { value: "poupanca", label: "Conta Poupança" },
      { value: "salario", label: "Conta Salário" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiInput = __nuxt_component_4;
      const _component_UiSelect = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h3 class="text-lg font-bold text-gray-800 mb-4">💰 Dados Financeiros</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.salario_base,
        "onUpdate:modelValue": ($event) => __props.form.salario_base = $event,
        type: "number",
        uppercase: false,
        step: "0.01",
        label: "Salário Base (R$)",
        placeholder: "0,00"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.tipo_salario,
        "onUpdate:modelValue": ($event) => __props.form.tipo_salario = $event,
        options: tipoSalarioOptions,
        label: "Tipo de Salário"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.numero_dependentes,
        "onUpdate:modelValue": ($event) => __props.form.numero_dependentes = $event,
        type: "number",
        uppercase: false,
        min: "0",
        step: "1",
        label: "Número de Dependentes (IRRF)",
        placeholder: "0"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.banco,
        "onUpdate:modelValue": ($event) => __props.form.banco = $event,
        label: "Banco",
        placeholder: "Nome do banco"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.agencia,
        "onUpdate:modelValue": ($event) => __props.form.agencia = $event,
        label: "Agência",
        placeholder: "0000"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiInput, {
        modelValue: __props.form.conta,
        "onUpdate:modelValue": ($event) => __props.form.conta = $event,
        label: "Conta",
        placeholder: "00000-0"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.tipo_conta,
        "onUpdate:modelValue": ($event) => __props.form.tipo_conta = $event,
        options: tipoContaOptions,
        label: "Tipo de Conta",
        placeholder: "Selecione..."
      }, null, _parent));
      _push(ssrRenderComponent(_component_UiSelect, {
        modelValue: __props.form.forma_pagamento,
        "onUpdate:modelValue": ($event) => __props.form.forma_pagamento = $event,
        options: formaPagamentoOptions,
        label: "Forma de Pagamento"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/funcionarios/FuncionarioDadosFinanceiros.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const FuncionarioDadosFinanceiros = Object.assign(_sfc_main$3, { __name: "FuncionariosFuncionarioDadosFinanceiros" });
const useDepartamentos = () => {
  const departamentos = ref([]);
  const loading = ref(false);
  const carregarDepartamentos = async () => {
    loading.value = true;
    try {
      const resultado = await $fetch("/api/departamentos");
      if (resultado.success && resultado.data) {
        departamentos.value = Array.isArray(resultado.data) ? resultado.data : [];
        console.log("✅ Departamentos carregados:", departamentos.value.length);
      } else {
        departamentos.value = [];
      }
    } catch (error) {
      console.error("Erro ao carregar departamentos:", error);
      departamentos.value = [];
    } finally {
      loading.value = false;
    }
  };
  const opcoesDepartamentos = computed(() => {
    if (!Array.isArray(departamentos.value)) {
      return [];
    }
    return departamentos.value.map((dep) => ({
      value: dep.id.toString(),
      label: dep.nome
    }));
  });
  return {
    departamentos,
    loading,
    carregarDepartamentos,
    opcoesDepartamentos
  };
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FuncionarioForm",
  __ssrInlineRender: true,
  props: {
    form: {},
    isEditing: { type: Boolean },
    showEmpresaSelect: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  emits: ["submit", "cancel", "salvar-e-enviar"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const abaAtiva = ref("pessoais");
    const tabs = [
      { id: "pessoais", label: "Dados Pessoais", icon: "👤" },
      { id: "profissionais", label: "Dados Profissionais", icon: "💼" },
      { id: "acesso", label: "Acesso ao Sistema", icon: "🔐" },
      { id: "financeiros", label: "Dados Financeiros", icon: "💰" },
      { id: "beneficios", label: "Benefícios e Descontos", icon: "🎁" }
    ];
    const tipoDescontoOptions = [
      { value: "sem_desconto", label: "Sem Desconto" },
      { value: "percentual", label: "Percentual (%)" },
      { value: "valor_fixo", label: "Valor Fixo (R$)" }
    ];
    const planoSaudeOptions = [
      { value: "individual", label: "Individual" },
      { value: "familiar", label: "Familiar" },
      { value: "coparticipacao", label: "Coparticipação" }
    ];
    const tipoBeneficioOptions = [
      { value: "diario", label: "Valor Diário" },
      { value: "mensal", label: "Valor Mensal" },
      { value: "fixo", label: "Valor Fixo" }
    ];
    useJornadas();
    const { opcoesJornadas, carregarJornadas } = useJornadas();
    const { carregarEmpresas, obterOpcoesEmpresas } = useEmpresas();
    const { opcoesDepartamentos, carregarDepartamentos } = useDepartamentos();
    const { opcoesCargos, carregarCargos } = useCargos();
    const { nomeAdmin, idAdmin } = useAdmin();
    const inicializarBeneficios = () => {
      console.log("🔧 [FuncionarioForm] Inicializando benefícios...");
      if (!props.form) {
        console.error("❌ [FuncionarioForm] ERRO: Não é possível inicializar benefícios - form é null!");
        return;
      }
      if (!props.form.beneficios) {
        console.log("📋 [FuncionarioForm] Criando estrutura de benefícios");
        props.form.beneficios = reactive({
          vale_transporte: {
            ativo: false,
            valor: 0,
            valor_mensal: 0,
            tipo_desconto: "percentual",
            percentual_desconto: 6,
            valor_desconto: 0
          },
          cesta_basica: {
            ativo: false,
            valor: 0,
            valor_mensal: 0,
            tipo_desconto: "sem_desconto",
            percentual_desconto: 0,
            valor_desconto: 0
          },
          plano_saude: {
            ativo: false,
            plano: "individual",
            valor_empresa: 0,
            valor_funcionario: 0,
            dependentes: 0
          },
          plano_odonto: {
            ativo: false,
            valor_funcionario: 0,
            dependentes: 0
          },
          personalizados: []
        });
      } else {
        console.log("✅ [FuncionarioForm] Benefícios já existem");
      }
      if (!props.form.beneficios.personalizados) {
        console.log("📋 [FuncionarioForm] Criando array de benefícios personalizados");
        props.form.beneficios.personalizados = reactive([]);
      } else if (!isReactive(props.form.beneficios.personalizados)) {
        console.log("🔄 [FuncionarioForm] Tornando benefícios personalizados reativos e convertendo tipos");
        const beneficiosConvertidos = props.form.beneficios.personalizados.map((beneficio) => ({
          ...beneficio,
          valor: typeof beneficio.valor === "string" ? parseFloat(beneficio.valor) || 0 : beneficio.valor,
          percentual_desconto: typeof beneficio.percentual_desconto === "string" ? parseFloat(beneficio.percentual_desconto) || 0 : beneficio.percentual_desconto,
          valor_desconto: typeof beneficio.valor_desconto === "string" ? parseFloat(beneficio.valor_desconto) || 0 : beneficio.valor_desconto
        }));
        props.form.beneficios.personalizados = reactive(beneficiosConvertidos);
      } else {
        props.form.beneficios.personalizados.forEach((beneficio) => {
          if (typeof beneficio.valor === "string") {
            beneficio.valor = parseFloat(beneficio.valor) || 0;
          }
          if (typeof beneficio.percentual_desconto === "string") {
            beneficio.percentual_desconto = parseFloat(beneficio.percentual_desconto) || 0;
          }
          if (typeof beneficio.valor_desconto === "string") {
            beneficio.valor_desconto = parseFloat(beneficio.valor_desconto) || 0;
          }
        });
      }
      if (!props.form.descontos_personalizados) {
        console.log("📉 [FuncionarioForm] Criando array de descontos personalizados");
        props.form.descontos_personalizados = reactive([]);
      } else if (!isReactive(props.form.descontos_personalizados)) {
        console.log("🔄 [FuncionarioForm] Tornando descontos personalizados reativos");
        props.form.descontos_personalizados = reactive([...props.form.descontos_personalizados]);
      }
      console.log("✅ [FuncionarioForm] Benefícios inicializados:", {
        beneficiosExist: !!props.form.beneficios,
        valeTransporte: !!props.form.beneficios?.vale_transporte,
        cestaBasica: !!props.form.beneficios?.cesta_basica,
        personalizadosCount: props.form.beneficios?.personalizados?.length || 0
      });
    };
    watch(() => props.form, (novoForm, formAnterior) => {
      console.log("👀 [FuncionarioForm] Watch form disparado:", {
        novoFormExists: !!novoForm,
        formAnteriorExists: !!formAnterior,
        novoFormKeys: novoForm ? Object.keys(novoForm) : "null",
        beneficiosExists: novoForm?.beneficios ? "Sim" : "Não"
      });
      if (novoForm && !novoForm.beneficios) {
        console.log("⚠️ [FuncionarioForm] Benefícios não encontrados no watch, inicializando...");
        inicializarBeneficios();
      } else if (novoForm?.beneficios) {
        console.log("✅ [FuncionarioForm] Benefícios já existem no form");
      }
    }, { deep: true, immediate: true });
    watch(() => props.form.beneficios?.personalizados, (novos, antigos) => {
      if (novos && novos.length > 0) {
        console.log("🔍 Benefícios personalizados alterados:", novos);
        novos.forEach((beneficio, index) => {
          garantirValoresNumericos(beneficio);
          console.log(`Benefício ${index}:`, {
            nome: beneficio.nome,
            tipo_valor: beneficio.tipo_valor,
            valor: beneficio.valor,
            valor_tipo: typeof beneficio.valor,
            ativo: beneficio.ativo
          });
        });
      }
    }, { deep: true });
    watch(() => props.form.tipo_contrato, (novoTipo, tipoAnterior) => {
      if (novoTipo === "PJ" && tipoAnterior !== "PJ") {
        console.log("🚫 Funcionário alterado para PJ - removendo descontos em folha");
        if (props.form.beneficios) {
          if (props.form.beneficios.vale_transporte) {
            props.form.beneficios.vale_transporte.tipo_desconto = "sem_desconto";
            props.form.beneficios.vale_transporte.percentual_desconto = 0;
            props.form.beneficios.vale_transporte.valor_desconto = 0;
          }
          if (props.form.beneficios.cesta_basica) {
            props.form.beneficios.cesta_basica.tipo_desconto = "sem_desconto";
            props.form.beneficios.cesta_basica.percentual_desconto = 0;
            props.form.beneficios.cesta_basica.valor_desconto = 0;
          }
          if (props.form.beneficios.plano_saude) {
            props.form.beneficios.plano_saude.valor_funcionario = 0;
          }
          if (props.form.beneficios.plano_odonto) {
            props.form.beneficios.plano_odonto.valor_funcionario = 0;
          }
          if (props.form.beneficios.personalizados) {
            props.form.beneficios.personalizados.forEach((beneficio) => {
              beneficio.tipo_desconto = "sem_desconto";
              beneficio.percentual_desconto = 0;
              beneficio.valor_desconto = 0;
            });
          }
        }
        if (props.form.descontos_personalizados) {
          props.form.descontos_personalizados.splice(0);
        }
        console.log("✅ Descontos removidos para funcionário PJ");
      }
    });
    watch(() => props.form.nome_completo, async (novoNome, nomeAntigo) => {
      if (novoNome && !nomeAntigo || !novoNome && nomeAntigo) {
        console.log("🔄 Recarregando dados dos selects...");
        await Promise.all([
          carregarJornadas(),
          carregarEmpresas(),
          carregarDepartamentos(),
          carregarCargos()
        ]);
      }
    });
    const departamentosOptions = computed(() => opcoesDepartamentos.value);
    const cargosOptions = computed(() => opcoesCargos.value);
    const responsavelOptions = computed(() => {
      const options = [];
      options.push({
        value: 1,
        label: "Silvana (Responsável Padrão) ⭐"
      });
      if (idAdmin.value && nomeAdmin.value && idAdmin.value !== 1) {
        options.push({
          value: idAdmin.value,
          label: `${nomeAdmin.value} (Admin)`
        });
      }
      options.push({
        value: null,
        label: "Nenhum responsável"
      });
      return options;
    });
    const empresasOptions = computed(() => obterOpcoesEmpresas.value);
    const jornadaOptionsComputed = computed(() => opcoesJornadas.value);
    const adicionarDesconto = () => {
      props.form.descontos_personalizados.push({
        descricao: "",
        tipo: "valor_fixo",
        valor: 0,
        percentual: 0,
        recorrente: true,
        parcelas: 1
      });
    };
    const removerDesconto = (index) => {
      if (props.form.descontos_personalizados) {
        props.form.descontos_personalizados.splice(index, 1);
      }
    };
    const adicionarBeneficioPersonalizado = () => {
      if (!props.form.beneficios.personalizados) {
        props.form.beneficios.personalizados = reactive([]);
      }
      props.form.beneficios.personalizados.push({
        icone: "🎯",
        nome: "",
        ativo: false,
        valor: 0,
        // Garantir que seja número
        tipo_valor: "mensal",
        tipo_desconto: "sem_desconto",
        percentual_desconto: 0,
        // Garantir que seja número
        valor_desconto: 0,
        // Garantir que seja número
        descricao: ""
      });
    };
    const removerBeneficioPersonalizado = (index) => {
      if (props.form.beneficios.personalizados) {
        props.form.beneficios.personalizados.splice(index, 1);
      }
    };
    const garantirValoresNumericos = (beneficio) => {
      if (typeof beneficio.valor === "string") {
        beneficio.valor = parseFloat(beneficio.valor) || 0;
      }
      if (typeof beneficio.percentual_desconto === "string") {
        beneficio.percentual_desconto = parseFloat(beneficio.percentual_desconto) || 0;
      }
      if (typeof beneficio.valor_desconto === "string") {
        beneficio.valor_desconto = parseFloat(beneficio.valor_desconto) || 0;
      }
    };
    const calcularTotalBeneficios = () => {
      let total = 0;
      if (props.form.beneficios?.vale_transporte?.ativo) {
        const valorMensal = props.form.beneficios.vale_transporte.valor_mensal || (props.form.beneficios.vale_transporte.valor || 0) * 22;
        total += valorMensal;
      }
      if (props.form.beneficios?.cesta_basica?.ativo) {
        const valorMensal = props.form.beneficios.cesta_basica.valor_mensal || (props.form.beneficios.cesta_basica.valor || 0) * 22;
        total += valorMensal;
      }
      if (props.form.beneficios?.plano_saude?.ativo) {
        total += props.form.beneficios.plano_saude.valor_empresa || 0;
      }
      if (props.form.beneficios?.personalizados) {
        props.form.beneficios.personalizados.forEach((beneficio) => {
          if (beneficio.ativo) {
            let valorBeneficio = beneficio.valor || 0;
            if (beneficio.tipo_valor === "diario") {
              valorBeneficio = valorBeneficio * 22;
            }
            total += valorBeneficio;
          }
        });
      }
      return total;
    };
    const calcularTotalDescontos = () => {
      let total = 0;
      const salarioBase = parseFloat(props.form.salario_base) || 0;
      if (props.form.tipo_contrato === "PJ") {
        return 0;
      }
      if (props.form.beneficios?.vale_transporte?.ativo) {
        const vt = props.form.beneficios.vale_transporte;
        if (vt.tipo_desconto === "percentual") {
          total += salarioBase * (vt.percentual_desconto || 0) / 100;
        } else if (vt.tipo_desconto === "valor_fixo") {
          total += vt.valor_desconto || 0;
        }
      }
      if (props.form.beneficios?.cesta_basica?.ativo) {
        const cb = props.form.beneficios.cesta_basica;
        if (cb.tipo_desconto === "percentual") {
          total += salarioBase * (cb.percentual_desconto || 0) / 100;
        } else if (cb.tipo_desconto === "valor_fixo") {
          total += cb.valor_desconto || 0;
        }
      }
      if (props.form.beneficios?.plano_saude?.ativo) {
        total += props.form.beneficios.plano_saude.valor_funcionario || 0;
      }
      if (props.form.beneficios?.plano_odonto?.ativo) {
        total += props.form.beneficios.plano_odonto.valor_funcionario || 0;
      }
      if (props.form.beneficios?.personalizados) {
        props.form.beneficios.personalizados.forEach((beneficio) => {
          if (beneficio.ativo) {
            if (beneficio.tipo_desconto === "percentual") {
              total += salarioBase * (beneficio.percentual_desconto || 0) / 100;
            } else if (beneficio.tipo_desconto === "valor_fixo") {
              total += beneficio.valor_desconto || 0;
            }
          }
        });
      }
      props.form.descontos_personalizados?.forEach((desconto) => {
        if (desconto.tipo === "percentual") {
          total += salarioBase * (desconto.percentual || 0) / 100;
        } else if (desconto.tipo === "valor_fixo") {
          total += desconto.valor || 0;
        }
      });
      return total;
    };
    const calcularSaldoLiquido = () => {
      return calcularTotalBeneficios() - calcularTotalDescontos();
    };
    const handleSubmit = () => {
      emit("submit");
    };
    const salvarEEnviarAcesso = () => {
      emit("salvar-e-enviar");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiCheckbox = __nuxt_component_0$1;
      const _component_UiInput = __nuxt_component_4;
      const _component_UiSelect = __nuxt_component_6;
      const _component_UiButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="border-b border-gray-200"><nav class="-mb-px flex space-x-8"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
          unref(abaAtiva) === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        ])}">${ssrInterpolate(tab.icon)} ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></nav></div><div class="min-h-[400px]">`);
      if (unref(abaAtiva) === "pessoais") {
        _push(ssrRenderComponent(FuncionarioDadosPessoais, { form: __props.form }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "profissionais") {
        _push(ssrRenderComponent(FuncionarioDadosProfissionais, {
          form: __props.form,
          "show-empresa-select": __props.showEmpresaSelect,
          "empresas-options": unref(empresasOptions),
          "departamentos-options": unref(departamentosOptions),
          "cargos-options": unref(cargosOptions),
          "jornada-options-computed": unref(jornadaOptionsComputed),
          "responsavel-options": unref(responsavelOptions)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "acesso") {
        _push(ssrRenderComponent(FuncionarioAcessoSistema, { form: __props.form }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "financeiros") {
        _push(ssrRenderComponent(FuncionarioDadosFinanceiros, { form: __props.form }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(abaAtiva) === "beneficios") {
        _push(`<div class="space-y-6"><h3 class="text-lg font-bold text-gray-800 mb-4">🎁 Benefícios e Descontos</h3>`);
        if (__props.form.tipo_contrato === "PJ") {
          _push(`<div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"><div class="flex items-center gap-2 text-yellow-700"><span class="text-xl">⚠️</span><div><h4 class="font-semibold">Funcionário PJ - Sem Descontos em Folha</h4><p class="text-sm">Funcionários PJ não podem ter descontos em folha de pagamento. Apenas benefícios sem desconto são permitidos.</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.form.beneficios) {
          _push(`<div class="space-y-4"><h4 class="text-md font-semibold text-gray-700 mb-3">📋 Benefícios Padrão</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-6">`);
          if (__props.form.beneficios.vale_transporte) {
            _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2"><span class="text-2xl">🚌</span><h5 class="font-semibold text-gray-800">Vale Transporte</h5></div>`);
            _push(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: __props.form.beneficios.vale_transporte.ativo,
              "onUpdate:modelValue": ($event) => __props.form.beneficios.vale_transporte.ativo = $event,
              label: ""
            }, null, _parent));
            _push(`</div>`);
            if (__props.form.beneficios.vale_transporte.ativo) {
              _push(`<div class="space-y-3">`);
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: __props.form.beneficios.vale_transporte.valor,
                "onUpdate:modelValue": ($event) => __props.form.beneficios.vale_transporte.valor = $event,
                type: "number",
                step: "0.01",
                label: "Valor Diário (R$)",
                placeholder: "0,00"
              }, null, _parent));
              if (__props.form.tipo_contrato !== "PJ") {
                _push(`<div>`);
                _push(ssrRenderComponent(_component_UiSelect, {
                  modelValue: __props.form.beneficios.vale_transporte.tipo_desconto,
                  "onUpdate:modelValue": ($event) => __props.form.beneficios.vale_transporte.tipo_desconto = $event,
                  options: tipoDescontoOptions,
                  label: "Tipo de Desconto"
                }, null, _parent));
                if (__props.form.beneficios.vale_transporte.tipo_desconto === "percentual") {
                  _push(ssrRenderComponent(_component_UiInput, {
                    modelValue: __props.form.beneficios.vale_transporte.percentual_desconto,
                    "onUpdate:modelValue": ($event) => __props.form.beneficios.vale_transporte.percentual_desconto = $event,
                    type: "number",
                    step: "0.01",
                    label: "% de Desconto",
                    placeholder: "6.00"
                  }, null, _parent));
                } else {
                  _push(`<!---->`);
                }
                if (__props.form.beneficios.vale_transporte.tipo_desconto === "valor_fixo") {
                  _push(ssrRenderComponent(_component_UiInput, {
                    modelValue: __props.form.beneficios.vale_transporte.valor_desconto,
                    "onUpdate:modelValue": ($event) => __props.form.beneficios.vale_transporte.valor_desconto = $event,
                    type: "number",
                    step: "0.01",
                    label: "Valor do Desconto (R$)",
                    placeholder: "0,00"
                  }, null, _parent));
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              } else {
                _push(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700"> 💼 <strong>Funcionário PJ:</strong> Benefício sem desconto em folha </p></div>`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.form.beneficios.cesta_basica) {
            _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2"><span class="text-2xl">🛒</span><h5 class="font-semibold text-gray-800">Cesta Básica</h5></div>`);
            _push(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: __props.form.beneficios.cesta_basica.ativo,
              "onUpdate:modelValue": ($event) => __props.form.beneficios.cesta_basica.ativo = $event,
              label: ""
            }, null, _parent));
            _push(`</div>`);
            if (__props.form.beneficios.cesta_basica.ativo) {
              _push(`<div class="space-y-3">`);
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: __props.form.beneficios.cesta_basica.valor,
                "onUpdate:modelValue": ($event) => __props.form.beneficios.cesta_basica.valor = $event,
                type: "number",
                step: "0.01",
                label: "Valor Diário (R$)",
                placeholder: "0,00"
              }, null, _parent));
              if (__props.form.tipo_contrato !== "PJ") {
                _push(`<div>`);
                _push(ssrRenderComponent(_component_UiSelect, {
                  modelValue: __props.form.beneficios.cesta_basica.tipo_desconto,
                  "onUpdate:modelValue": ($event) => __props.form.beneficios.cesta_basica.tipo_desconto = $event,
                  options: tipoDescontoOptions,
                  label: "Tipo de Desconto"
                }, null, _parent));
                if (__props.form.beneficios.cesta_basica.tipo_desconto === "percentual") {
                  _push(ssrRenderComponent(_component_UiInput, {
                    modelValue: __props.form.beneficios.cesta_basica.percentual_desconto,
                    "onUpdate:modelValue": ($event) => __props.form.beneficios.cesta_basica.percentual_desconto = $event,
                    type: "number",
                    step: "0.01",
                    label: "% de Desconto",
                    placeholder: "20.00"
                  }, null, _parent));
                } else {
                  _push(`<!---->`);
                }
                if (__props.form.beneficios.cesta_basica.tipo_desconto === "valor_fixo") {
                  _push(ssrRenderComponent(_component_UiInput, {
                    modelValue: __props.form.beneficios.cesta_basica.valor_desconto,
                    "onUpdate:modelValue": ($event) => __props.form.beneficios.cesta_basica.valor_desconto = $event,
                    type: "number",
                    step: "0.01",
                    label: "Valor do Desconto (R$)",
                    placeholder: "0,00"
                  }, null, _parent));
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              } else {
                _push(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700"> 💼 <strong>Funcionário PJ:</strong> Benefício sem desconto em folha </p></div>`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.form.beneficios.plano_saude) {
            _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2"><span class="text-2xl">🏥</span><h5 class="font-semibold text-gray-800">Plano de Saúde</h5></div>`);
            _push(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: __props.form.beneficios.plano_saude.ativo,
              "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_saude.ativo = $event,
              label: ""
            }, null, _parent));
            _push(`</div>`);
            if (__props.form.beneficios.plano_saude.ativo) {
              _push(`<div class="space-y-3">`);
              _push(ssrRenderComponent(_component_UiSelect, {
                modelValue: __props.form.beneficios.plano_saude.plano,
                "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_saude.plano = $event,
                options: planoSaudeOptions,
                label: "Tipo de Plano"
              }, null, _parent));
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: __props.form.beneficios.plano_saude.valor_empresa,
                "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_saude.valor_empresa = $event,
                type: "number",
                step: "0.01",
                label: "Valor Pago pela Empresa (R$)",
                placeholder: "0,00"
              }, null, _parent));
              if (__props.form.tipo_contrato !== "PJ") {
                _push(`<div>`);
                _push(ssrRenderComponent(_component_UiInput, {
                  modelValue: __props.form.beneficios.plano_saude.valor_funcionario,
                  "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_saude.valor_funcionario = $event,
                  type: "number",
                  step: "0.01",
                  label: "Valor Descontado do Funcionário (R$)",
                  placeholder: "0,00"
                }, null, _parent));
                _push(`</div>`);
              } else {
                _push(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700"> 💼 <strong>Funcionário PJ:</strong> Sem desconto em folha para plano de saúde </p></div>`);
              }
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: __props.form.beneficios.plano_saude.dependentes,
                "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_saude.dependentes = $event,
                type: "number",
                label: "Número de Dependentes",
                placeholder: "0"
              }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.form.beneficios.plano_odonto) {
            _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2"><span class="text-2xl">🦷</span><h5 class="font-semibold text-gray-800">Plano Odontológico</h5></div>`);
            _push(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: __props.form.beneficios.plano_odonto.ativo,
              "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_odonto.ativo = $event,
              label: ""
            }, null, _parent));
            _push(`</div>`);
            if (__props.form.beneficios.plano_odonto.ativo) {
              _push(`<div class="space-y-3">`);
              if (__props.form.tipo_contrato !== "PJ") {
                _push(`<div>`);
                _push(ssrRenderComponent(_component_UiInput, {
                  modelValue: __props.form.beneficios.plano_odonto.valor_funcionario,
                  "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_odonto.valor_funcionario = $event,
                  type: "number",
                  step: "0.01",
                  label: "Valor Descontado (R$)",
                  placeholder: "0,00"
                }, null, _parent));
                _push(`</div>`);
              } else {
                _push(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700"> 💼 <strong>Funcionário PJ:</strong> Sem desconto em folha para plano odontológico </p></div>`);
              }
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: __props.form.beneficios.plano_odonto.dependentes,
                "onUpdate:modelValue": ($event) => __props.form.beneficios.plano_odonto.dependentes = $event,
                type: "number",
                label: "Número de Dependentes",
                placeholder: "0"
              }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<div class="p-4 bg-red-50 border border-red-200 rounded-xl"><div class="flex items-center gap-2 text-red-700"><span class="text-xl">⚠️</span><div><h4 class="font-semibold">Benefícios não inicializados</h4><p class="text-sm">Clique no botão abaixo para inicializar os benefícios.</p><button class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"> 🔧 Inicializar Benefícios </button></div></div></div>`);
        }
        if (__props.form.beneficios) {
          _push(`<div class="space-y-4"><div class="flex items-center justify-between"><h4 class="text-md font-semibold text-gray-700 mb-3">✨ Benefícios Personalizados</h4>`);
          _push(ssrRenderComponent(_component_UiButton, {
            variant: "secondary",
            size: "sm",
            onClick: adicionarBeneficioPersonalizado
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ➕ Adicionar Benefício `);
              } else {
                return [
                  createTextVNode(" ➕ Adicionar Benefício ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="space-y-4"><!--[-->`);
          ssrRenderList(__props.form.beneficios.personalizados, (beneficio, index) => {
            _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2">`);
            _push(ssrRenderComponent(_component_UiInput, {
              modelValue: beneficio.icone,
              "onUpdate:modelValue": ($event) => beneficio.icone = $event,
              label: "",
              placeholder: "🎯",
              class: "w-12 text-center text-xl"
            }, null, _parent));
            _push(ssrRenderComponent(_component_UiInput, {
              modelValue: beneficio.nome,
              "onUpdate:modelValue": ($event) => beneficio.nome = $event,
              label: "",
              placeholder: "Nome do benefício",
              class: "font-semibold"
            }, null, _parent));
            _push(`</div><div class="flex items-center gap-2">`);
            _push(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: beneficio.ativo,
              "onUpdate:modelValue": ($event) => beneficio.ativo = $event,
              label: ""
            }, null, _parent));
            _push(ssrRenderComponent(_component_UiButton, {
              variant: "danger",
              size: "sm",
              onClick: ($event) => removerBeneficioPersonalizado(Number(index))
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` 🗑️ `);
                } else {
                  return [
                    createTextVNode(" 🗑️ ")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div>`);
            if (beneficio.ativo) {
              _push(`<div class="space-y-3"><div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: beneficio.valor,
                "onUpdate:modelValue": ($event) => beneficio.valor = $event,
                type: "number",
                step: "0.01",
                label: "Valor do Benefício (R$)",
                placeholder: "0,00"
              }, null, _parent));
              _push(ssrRenderComponent(_component_UiSelect, {
                modelValue: beneficio.tipo_valor,
                "onUpdate:modelValue": ($event) => beneficio.tipo_valor = $event,
                options: tipoBeneficioOptions,
                label: "Tipo de Valor"
              }, null, _parent));
              _push(`</div>`);
              if (__props.form.tipo_contrato !== "PJ") {
                _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
                _push(ssrRenderComponent(_component_UiSelect, {
                  modelValue: beneficio.tipo_desconto,
                  "onUpdate:modelValue": ($event) => beneficio.tipo_desconto = $event,
                  options: tipoDescontoOptions,
                  label: "Tipo de Desconto"
                }, null, _parent));
                if (beneficio.tipo_desconto === "percentual") {
                  _push(ssrRenderComponent(_component_UiInput, {
                    modelValue: beneficio.percentual_desconto,
                    "onUpdate:modelValue": ($event) => beneficio.percentual_desconto = $event,
                    type: "number",
                    step: "0.01",
                    label: "% de Desconto",
                    placeholder: "0,00"
                  }, null, _parent));
                } else {
                  _push(`<!---->`);
                }
                if (beneficio.tipo_desconto === "valor_fixo") {
                  _push(ssrRenderComponent(_component_UiInput, {
                    modelValue: beneficio.valor_desconto,
                    "onUpdate:modelValue": ($event) => beneficio.valor_desconto = $event,
                    type: "number",
                    step: "0.01",
                    label: "Valor do Desconto (R$)",
                    placeholder: "0,00"
                  }, null, _parent));
                } else {
                  _push(`<!---->`);
                }
                _push(`</div>`);
              } else {
                _push(`<div class="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700"> 💼 <strong>Funcionário PJ:</strong> Benefício sem desconto em folha </p></div>`);
              }
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: beneficio.descricao,
                "onUpdate:modelValue": ($event) => beneficio.descricao = $event,
                label: "Descrição (opcional)",
                placeholder: "Ex: Auxílio creche, seguro de vida, etc."
              }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]-->`);
          if (!__props.form.beneficios.personalizados || __props.form.beneficios.personalizados.length === 0) {
            _push(`<div class="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl"><span class="text-2xl">✨</span><p class="mt-2">Nenhum benefício personalizado adicionado</p><p class="text-sm">Clique em &quot;Adicionar Benefício&quot; para criar um novo</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.form.descontos_personalizados && __props.form.tipo_contrato !== "PJ") {
          _push(`<div class="space-y-4"><div class="flex items-center justify-between"><h4 class="text-md font-semibold text-gray-700">📉 Descontos Personalizados</h4>`);
          _push(ssrRenderComponent(_component_UiButton, {
            variant: "secondary",
            size: "sm",
            onClick: adicionarDesconto
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ➕ Adicionar Desconto `);
              } else {
                return [
                  createTextVNode(" ➕ Adicionar Desconto ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="space-y-3"><!--[-->`);
          ssrRenderList(__props.form.descontos_personalizados, (desconto, index) => {
            _push(`<div class="p-4 border border-gray-200 rounded-xl"><div class="grid grid-cols-1 md:grid-cols-4 gap-4">`);
            _push(ssrRenderComponent(_component_UiInput, {
              modelValue: desconto.descricao,
              "onUpdate:modelValue": ($event) => desconto.descricao = $event,
              label: "Descrição",
              placeholder: "Ex: Empréstimo, Seguro de Vida"
            }, null, _parent));
            _push(ssrRenderComponent(_component_UiSelect, {
              modelValue: desconto.tipo,
              "onUpdate:modelValue": ($event) => desconto.tipo = $event,
              options: tipoDescontoOptions,
              label: "Tipo"
            }, null, _parent));
            if (desconto.tipo === "percentual") {
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: desconto.percentual,
                "onUpdate:modelValue": ($event) => desconto.percentual = $event,
                type: "number",
                step: "0.01",
                label: "Percentual (%)",
                placeholder: "0,00"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (desconto.tipo === "valor_fixo") {
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: desconto.valor,
                "onUpdate:modelValue": ($event) => desconto.valor = $event,
                type: "number",
                step: "0.01",
                label: "Valor (R$)",
                placeholder: "0,00"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex items-end">`);
            _push(ssrRenderComponent(_component_UiButton, {
              variant: "danger",
              size: "sm",
              onClick: ($event) => removerDesconto(Number(index))
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` 🗑️ Remover `);
                } else {
                  return [
                    createTextVNode(" 🗑️ Remover ")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div><div class="mt-3 flex gap-4">`);
            _push(ssrRenderComponent(_component_UiCheckbox, {
              modelValue: desconto.recorrente,
              "onUpdate:modelValue": ($event) => desconto.recorrente = $event,
              label: "Desconto recorrente"
            }, null, _parent));
            if (!desconto.recorrente) {
              _push(ssrRenderComponent(_component_UiInput, {
                modelValue: desconto.parcelas,
                "onUpdate:modelValue": ($event) => desconto.parcelas = $event,
                type: "number",
                label: "Número de parcelas",
                placeholder: "1",
                class: "w-32"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]-->`);
          if (__props.form.descontos_personalizados.length === 0) {
            _push(`<div class="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl"><span class="text-2xl">📝</span><p class="mt-2">Nenhum desconto personalizado adicionado</p><p class="text-sm">Clique em &quot;Adicionar Desconto&quot; para criar um novo</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else if (__props.form.tipo_contrato === "PJ") {
          _push(`<div class="p-4 bg-gray-50 border border-gray-200 rounded-xl"><div class="flex items-center gap-2 text-gray-600"><span class="text-xl">💼</span><div><h4 class="font-semibold">Funcionário PJ - Descontos Não Aplicáveis</h4><p class="text-sm">Funcionários PJ não podem ter descontos personalizados em folha de pagamento.</p></div></div></div>`);
        } else {
          _push(`<div class="p-4 bg-orange-50 border border-orange-200 rounded-xl"><div class="flex items-center gap-2 text-orange-700"><span class="text-xl">⚠️</span><div><h4 class="font-semibold">Descontos personalizados não inicializados</h4><p class="text-sm">Clique no botão abaixo para inicializar os descontos.</p><button class="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"> 🔧 Inicializar Descontos </button></div></div></div>`);
        }
        _push(`<div class="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"><h4 class="text-lg font-bold text-gray-800 mb-4">📊 Resumo dos Benefícios</h4>`);
        if (__props.form.tipo_contrato === "PJ") {
          _push(`<div class="text-center"><div class="text-xl font-bold text-blue-600 mb-2"> R$ ${ssrInterpolate(calcularTotalBeneficios().toFixed(2).replace(".", ","))}</div><div class="text-sm text-gray-600 mb-4">Total de Benefícios (Sem Descontos)</div><div class="p-3 bg-blue-100 rounded-lg"><p class="text-sm text-blue-700"> 💼 <strong>Funcionário PJ:</strong> Recebe benefícios integralmente, sem descontos em folha </p></div></div>`);
        } else {
          _push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"><div><div class="text-xl font-bold text-green-600"> R$ ${ssrInterpolate(calcularTotalBeneficios().toFixed(2).replace(".", ","))}</div><div class="text-sm text-gray-600">Total de Benefícios</div></div><div><div class="text-xl font-bold text-red-600"> R$ ${ssrInterpolate(calcularTotalDescontos().toFixed(2).replace(".", ","))}</div><div class="text-sm text-gray-600">Total de Descontos</div></div><div><div class="text-xl font-bold text-blue-600"> R$ ${ssrInterpolate(calcularSaldoLiquido().toFixed(2).replace(".", ","))}</div><div class="text-sm text-gray-600">Impacto no Salário</div></div></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex justify-end gap-3 pt-6 border-t">`);
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
      _push(ssrRenderComponent(_component_UiButton, {
        variant: "success",
        onClick: salvarEEnviarAcesso,
        disabled: __props.loading
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 💾 Salvar e Enviar Acesso `);
          } else {
            return [
              createTextVNode(" 💾 Salvar e Enviar Acesso ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiButton, {
        onClick: handleSubmit,
        disabled: __props.loading
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 💾 ${ssrInterpolate(__props.isEditing ? "Atualizar" : "Salvar")} Funcionário `);
          } else {
            return [
              createTextVNode(" 💾 " + toDisplayString(__props.isEditing ? "Atualizar" : "Salvar") + " Funcionário ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/funcionarios/FuncionarioForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const FuncionarioForm = Object.assign(_sfc_main$2, { __name: "FuncionariosFuncionarioForm" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FuncionarioCard",
  __ssrInlineRender: true,
  props: {
    funcionario: {}
  },
  emits: ["edit", "toggle-status", "email-enviado", "email-erro"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const enviandoEmail = ref(false);
    const verHolerites = () => {
      navigateTo("/admin/holerites");
    };
    const enviarCredenciais = async () => {
      if (enviandoEmail.value) return;
      enviandoEmail.value = true;
      try {
        console.log("📧 Enviando credenciais para funcionário ID:", props.funcionario.id);
        await $fetch("/api/funcionarios/enviar-acesso", {
          method: "POST",
          body: {
            funcionario_id: props.funcionario.id
          }
        });
        emit("email-enviado", `Credenciais enviadas com sucesso para ${props.funcionario.email_login}!`);
      } catch (error) {
        console.error("❌ Erro ao enviar credenciais:", error);
        emit("email-erro", error.data?.message || "Erro ao enviar credenciais. Verifique se o funcionário possui email cadastrado.");
      } finally {
        enviandoEmail.value = false;
      }
    };
    const formatarData = (data) => {
      if (!data) return "";
      return new Date(data).toLocaleDateString("pt-BR");
    };
    const formatarMoeda = (valor) => {
      if (!valor) return "R$ 0,00";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(valor);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiCard = __nuxt_component_2;
      const _component_UiAvatar = __nuxt_component_1$1;
      const _component_UiBadge = __nuxt_component_2$1;
      const _component_UiButton = __nuxt_component_1;
      _push(ssrRenderComponent(_component_UiCard, mergeProps({ padding: "p-6" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4"${_scopeId}><div class="flex items-center gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiAvatar, {
              name: __props.funcionario.nome_completo,
              "avatar-type": __props.funcionario.avatar,
              size: "lg"
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><h3 class="text-xl font-bold text-gray-800"${_scopeId}>${ssrInterpolate(__props.funcionario.nome_completo)}</h3><p class="text-lg text-gray-600"${_scopeId}>${ssrInterpolate(__props.funcionario.cargo)} - ${ssrInterpolate(__props.funcionario.departamento)}</p><p class="text-gray-500"${_scopeId}>${ssrInterpolate(__props.funcionario.email_login)}</p><p class="text-sm text-gray-400"${_scopeId}>CPF: ${ssrInterpolate(__props.funcionario.cpf)}</p><p class="text-sm text-gray-400"${_scopeId}>Admissão: ${ssrInterpolate(formatarData(__props.funcionario.data_admissao))}</p><div class="mt-1 p-2 bg-blue-50 rounded-lg border border-blue-200"${_scopeId}><p class="text-sm text-blue-700"${_scopeId}> 👤 <strong${_scopeId}>Cadastrado por:</strong> ${ssrInterpolate(__props.funcionario.responsavel_cadastro_nome)} `);
            if (__props.funcionario.responsavel_cadastro_email) {
              _push2(`<span class="text-blue-600"${_scopeId}> (${ssrInterpolate(__props.funcionario.responsavel_cadastro_email)}) </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</p></div><div class="mt-2 p-2 bg-green-50 rounded-lg border border-green-200"${_scopeId}><p class="text-lg font-bold text-green-700"${_scopeId}> 💰 Salário: ${ssrInterpolate(formatarMoeda(__props.funcionario.salario_base))}</p></div><div class="flex gap-2 mt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiBadge, {
              variant: __props.funcionario.status === "ativo" ? "success" : "gray"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.funcionario.status === "ativo" ? "Ativo" : "Inativo")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.funcionario.status === "ativo" ? "Ativo" : "Inativo"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiBadge, {
              variant: __props.funcionario.tipo_acesso === "admin" ? "warning" : "info"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.funcionario.tipo_acesso === "admin" ? "Administrador" : "Funcionário")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.funcionario.tipo_acesso === "admin" ? "Administrador" : "Funcionário"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiBadge, { variant: "gray" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.funcionario.telefone)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.funcionario.telefone), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div><div class="flex gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "ghost",
              onClick: ($event) => _ctx.$emit("edit", __props.funcionario)
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
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "ghost",
              onClick: verHolerites
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` 📄 Holerites `);
                } else {
                  return [
                    createTextVNode(" 📄 Holerites ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: "ghost",
              onClick: enviarCredenciais,
              disabled: unref(enviandoEmail)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(enviandoEmail) ? "📧 Enviando..." : "🔑 Login")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(enviandoEmail) ? "📧 Enviando..." : "🔑 Login"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UiButton, {
              variant: __props.funcionario.status === "ativo" ? "danger" : "success",
              onClick: ($event) => _ctx.$emit("toggle-status", __props.funcionario)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.funcionario.status === "ativo" ? "🚫 Inativar" : "✓ Ativar")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.funcionario.status === "ativo" ? "🚫 Inativar" : "✓ Ativar"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col lg:flex-row lg:items-center justify-between gap-4" }, [
                createVNode("div", { class: "flex items-center gap-4" }, [
                  createVNode(_component_UiAvatar, {
                    name: __props.funcionario.nome_completo,
                    "avatar-type": __props.funcionario.avatar,
                    size: "lg"
                  }, null, 8, ["name", "avatar-type"]),
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-xl font-bold text-gray-800" }, toDisplayString(__props.funcionario.nome_completo), 1),
                    createVNode("p", { class: "text-lg text-gray-600" }, toDisplayString(__props.funcionario.cargo) + " - " + toDisplayString(__props.funcionario.departamento), 1),
                    createVNode("p", { class: "text-gray-500" }, toDisplayString(__props.funcionario.email_login), 1),
                    createVNode("p", { class: "text-sm text-gray-400" }, "CPF: " + toDisplayString(__props.funcionario.cpf), 1),
                    createVNode("p", { class: "text-sm text-gray-400" }, "Admissão: " + toDisplayString(formatarData(__props.funcionario.data_admissao)), 1),
                    createVNode("div", { class: "mt-1 p-2 bg-blue-50 rounded-lg border border-blue-200" }, [
                      createVNode("p", { class: "text-sm text-blue-700" }, [
                        createTextVNode(" 👤 "),
                        createVNode("strong", null, "Cadastrado por:"),
                        createTextVNode(" " + toDisplayString(__props.funcionario.responsavel_cadastro_nome) + " ", 1),
                        __props.funcionario.responsavel_cadastro_email ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-blue-600"
                        }, " (" + toDisplayString(__props.funcionario.responsavel_cadastro_email) + ") ", 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "mt-2 p-2 bg-green-50 rounded-lg border border-green-200" }, [
                      createVNode("p", { class: "text-lg font-bold text-green-700" }, " 💰 Salário: " + toDisplayString(formatarMoeda(__props.funcionario.salario_base)), 1)
                    ]),
                    createVNode("div", { class: "flex gap-2 mt-2" }, [
                      createVNode(_component_UiBadge, {
                        variant: __props.funcionario.status === "ativo" ? "success" : "gray"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.funcionario.status === "ativo" ? "Ativo" : "Inativo"), 1)
                        ]),
                        _: 1
                      }, 8, ["variant"]),
                      createVNode(_component_UiBadge, {
                        variant: __props.funcionario.tipo_acesso === "admin" ? "warning" : "info"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.funcionario.tipo_acesso === "admin" ? "Administrador" : "Funcionário"), 1)
                        ]),
                        _: 1
                      }, 8, ["variant"]),
                      createVNode(_component_UiBadge, { variant: "gray" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.funcionario.telefone), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex gap-2" }, [
                  createVNode(_component_UiButton, {
                    variant: "ghost",
                    onClick: ($event) => _ctx.$emit("edit", __props.funcionario)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" ✏️ Editar ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UiButton, {
                    variant: "ghost",
                    onClick: verHolerites
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" 📄 Holerites ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UiButton, {
                    variant: "ghost",
                    onClick: enviarCredenciais,
                    disabled: unref(enviandoEmail)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(enviandoEmail) ? "📧 Enviando..." : "🔑 Login"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  createVNode(_component_UiButton, {
                    variant: __props.funcionario.status === "ativo" ? "danger" : "success",
                    onClick: ($event) => _ctx.$emit("toggle-status", __props.funcionario)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.funcionario.status === "ativo" ? "🚫 Inativar" : "✓ Ativar"), 1)
                    ]),
                    _: 1
                  }, 8, ["variant", "onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/funcionarios/FuncionarioCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FuncionarioCard = Object.assign(_sfc_main$1, { __name: "FuncionariosFuncionarioCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "funcionarios",
  __ssrInlineRender: true,
  setup(__props) {
    const busca = ref("");
    const modalAberto = ref(false);
    const funcionarioEditando = ref(null);
    const loading = ref(false);
    const mostrarNotificacao = ref(false);
    const notificacao = ref({
      title: "",
      message: "",
      variant: "success"
    });
    const form = ref({
      // Dados Pessoais
      nome_completo: "",
      cpf: "",
      rg: "",
      pis_pasep: "",
      data_nascimento: "",
      sexo: "",
      estado_civil: "",
      telefone: "",
      email_pessoal: "",
      contato_emergencia_nome: "",
      contato_emergencia_telefone: "",
      // Endereço
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      // Dados Profissionais
      empresa_id: "",
      departamento_id: "",
      cargo_id: "",
      responsavel_id: 1,
      tipo_contrato: "CLT",
      data_admissao: "",
      matricula: "",
      jornada_trabalho_id: "",
      // Acesso ao Sistema
      email_login: "",
      senha: "",
      tipo_acesso: "funcionario",
      status: "ativo",
      // Dados Financeiros
      salario_base: "",
      tipo_salario: "mensal",
      numero_dependentes: 0,
      banco: "",
      agencia: "",
      conta: "",
      tipo_conta: "",
      forma_pagamento: "deposito",
      // Benefícios
      beneficios: {
        vale_transporte: {
          ativo: false,
          valor: 0,
          valor_mensal: 0,
          tipo_desconto: "percentual",
          percentual_desconto: 6,
          valor_desconto: 0
        },
        cesta_basica: {
          ativo: false,
          valor: 0,
          valor_mensal: 0,
          tipo_desconto: "sem_desconto",
          percentual_desconto: 0,
          valor_desconto: 0
        },
        plano_saude: {
          ativo: false,
          plano: "individual",
          valor_empresa: 0,
          valor_funcionario: 0,
          dependentes: 0
        },
        plano_odonto: {
          ativo: false,
          valor_funcionario: 0,
          dependentes: 0
        },
        personalizados: []
      },
      // Descontos Personalizados
      descontos_personalizados: [],
      // Observações
      observacoes_internas: ""
    });
    const funcionarios = ref([]);
    const carregarFuncionarios = async () => {
      try {
        const data = await $fetch("/api/funcionarios");
        if (data) {
          funcionarios.value = data;
        }
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      }
    };
    const funcionariosFiltrados = computed(() => {
      if (!busca.value) return funcionarios.value;
      const termo = busca.value.toLowerCase();
      return funcionarios.value.filter(
        (f) => f.nome_completo.toLowerCase().includes(termo) || f.cargo.toLowerCase().includes(termo) || f.departamento.toLowerCase().includes(termo) || f.email_login.toLowerCase().includes(termo)
      );
    });
    const abrirModal = async (func) => {
      console.log("🔍 [Funcionarios] Abrindo modal:", {
        isEditing: !!func,
        funcionarioId: func?.id,
        funcionarioNome: func?.nome_completo
      });
      if (func) {
        try {
          console.log("🔍 [Funcionarios] Buscando dados completos do funcionário ID:", func.id);
          const funcionarioCompleto = await $fetch(`/api/funcionarios/${func.id}`);
          console.log("✅ [Funcionarios] Dados completos recebidos:", {
            id: funcionarioCompleto.id,
            nome: funcionarioCompleto.nome_completo,
            beneficios: funcionarioCompleto.beneficios ? "Existe" : "Null",
            beneficiosType: typeof funcionarioCompleto.beneficios,
            keys: Object.keys(funcionarioCompleto)
          });
          funcionarioEditando.value = funcionarioCompleto;
          const beneficiosPadrao = {
            vale_transporte: {
              ativo: false,
              valor: 0,
              valor_mensal: 0,
              tipo_desconto: "percentual",
              percentual_desconto: 6,
              valor_desconto: 0
            },
            cesta_basica: {
              ativo: false,
              valor: 0,
              valor_mensal: 0,
              tipo_desconto: "sem_desconto",
              percentual_desconto: 0,
              valor_desconto: 0
            },
            plano_saude: {
              ativo: false,
              plano: "individual",
              valor_empresa: 0,
              valor_funcionario: 0,
              dependentes: 0
            },
            plano_odonto: {
              ativo: false,
              valor_funcionario: 0,
              dependentes: 0
            },
            personalizados: []
          };
          const beneficiosMesclados = {
            ...beneficiosPadrao,
            ...funcionarioCompleto.beneficios || {}
          };
          if (!Array.isArray(beneficiosMesclados.personalizados)) {
            beneficiosMesclados.personalizados = [];
          }
          form.value = {
            ...funcionarioCompleto,
            beneficios: beneficiosMesclados,
            descontos_personalizados: Array.isArray(funcionarioCompleto.descontos_personalizados) ? funcionarioCompleto.descontos_personalizados : []
          };
          console.log("📋 [Funcionarios] Form atualizado:", {
            nome: form.value.nome_completo,
            cpf: form.value.cpf,
            email: form.value.email_login,
            beneficios: form.value.beneficios ? "Estruturado" : "Null",
            beneficiosKeys: form.value.beneficios ? Object.keys(form.value.beneficios) : "null"
          });
        } catch (error) {
          console.error("❌ [Funcionarios] Erro ao buscar funcionário:", error);
          notificacao.value = {
            title: "Erro!",
            message: "Erro ao carregar dados do funcionário",
            variant: "error"
          };
          mostrarNotificacao.value = true;
          return;
        }
      } else {
        console.log("➕ [Funcionarios] Criando novo funcionário");
        funcionarioEditando.value = null;
        form.value = {
          // Dados Pessoais
          nome_completo: "",
          cpf: "",
          rg: "",
          pis_pasep: "",
          data_nascimento: "",
          sexo: "",
          estado_civil: "",
          telefone: "",
          email_pessoal: "",
          contato_emergencia_nome: "",
          contato_emergencia_telefone: "",
          // Endereço
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          // Dados Profissionais
          empresa_id: "",
          departamento_id: "",
          cargo_id: "",
          responsavel_id: 1,
          tipo_contrato: "CLT",
          data_admissao: "",
          matricula: "",
          jornada_trabalho_id: "",
          // Acesso ao Sistema
          email_login: "",
          senha: "",
          tipo_acesso: "funcionario",
          status: "ativo",
          // Dados Financeiros
          salario_base: "",
          tipo_salario: "mensal",
          numero_dependentes: 0,
          banco: "",
          agencia: "",
          conta: "",
          tipo_conta: "",
          forma_pagamento: "deposito",
          // Benefícios
          beneficios: {
            vale_transporte: {
              ativo: false,
              valor: 0,
              valor_mensal: 0,
              tipo_desconto: "percentual",
              percentual_desconto: 6,
              valor_desconto: 0
            },
            cesta_basica: {
              ativo: false,
              valor: 0,
              valor_mensal: 0,
              tipo_desconto: "sem_desconto",
              percentual_desconto: 0,
              valor_desconto: 0
            },
            plano_saude: {
              ativo: false,
              plano: "individual",
              valor_empresa: 0,
              valor_funcionario: 0,
              dependentes: 0
            },
            plano_odonto: {
              ativo: false,
              valor_funcionario: 0,
              dependentes: 0
            },
            personalizados: []
          },
          // Descontos Personalizados
          descontos_personalizados: [],
          // Observações
          observacoes_internas: ""
        };
        console.log("📝 [Funcionarios] Form novo funcionário criado");
      }
      console.log("🚀 [Funcionarios] Abrindo modal...");
      modalAberto.value = true;
    };
    const salvarFuncionario = async () => {
      loading.value = true;
      try {
        if (!form.value.nome_completo || !form.value.cpf) {
          throw new Error("Preencha o nome completo e CPF");
        }
        if (funcionarioEditando.value) {
          await $fetch(`/api/funcionarios/${funcionarioEditando.value.id}`, {
            method: "PATCH",
            body: form.value
          });
        } else {
          await $fetch("/api/funcionarios", {
            method: "POST",
            body: form.value
          });
        }
        notificacao.value = {
          title: "Sucesso!",
          message: `Funcionário ${funcionarioEditando.value ? "atualizado" : "cadastrado"} com sucesso!`,
          variant: "success"
        };
        mostrarNotificacao.value = true;
        modalAberto.value = false;
        await carregarFuncionarios();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        notificacao.value = {
          title: "Erro!",
          message: error.message || "Erro ao salvar funcionário. Tente novamente.",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const salvarEEnviarAcesso = async () => {
      loading.value = true;
      try {
        if (!form.value.nome_completo || !form.value.cpf) {
          throw new Error("Preencha o nome completo e CPF");
        }
        const response = await $fetch("/api/funcionarios", {
          method: "POST",
          body: form.value
        });
        const funcionarioCriado = response?.data;
        if (!funcionarioCriado || !funcionarioCriado.id) {
          throw new Error("Funcionário criado mas dados não retornados");
        }
        console.log("✅ Funcionário criado:", funcionarioCriado.id);
        if (form.value.email_login) {
          console.log("📧 Enviando email para:", form.value.email_login);
          try {
            await $fetch("/api/funcionarios/enviar-acesso", {
              method: "POST",
              body: {
                funcionario_id: funcionarioCriado.id
              }
            });
            notificacao.value = {
              title: "Sucesso!",
              message: `Funcionário cadastrado e email enviado para ${form.value.email_login}! ✉️`,
              variant: "success"
            };
          } catch (erroEmail) {
            console.warn("⚠️ Funcionário criado mas erro ao enviar email:", erroEmail);
            notificacao.value = {
              title: "Atenção!",
              message: `Funcionário cadastrado, mas não foi possível enviar o email para ${form.value.email_login}. Envie manualmente.`,
              variant: "warning"
            };
          }
        } else {
          notificacao.value = {
            title: "Sucesso!",
            message: "Funcionário cadastrado! Configure o email de login para enviar acesso.",
            variant: "success"
          };
        }
        mostrarNotificacao.value = true;
        modalAberto.value = false;
        await carregarFuncionarios();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        notificacao.value = {
          title: "Erro!",
          message: error.message || "Erro ao salvar funcionário.",
          variant: "error"
        };
        mostrarNotificacao.value = true;
      } finally {
        loading.value = false;
      }
    };
    const toggleStatus = (func) => {
      func.status = func.status === "ativo" ? "inativo" : "ativo";
      notificacao.value = {
        title: "Status Atualizado!",
        message: `Funcionário ${func.nome_completo} ${func.status === "ativo" ? "ativado" : "inativado"} com sucesso!`,
        variant: "success"
      };
      mostrarNotificacao.value = true;
    };
    const handleEmailEnviado = (mensagem) => {
      notificacao.value = {
        title: "Email Enviado!",
        message: mensagem,
        variant: "success"
      };
      mostrarNotificacao.value = true;
    };
    const handleEmailErro = (mensagem) => {
      notificacao.value = {
        title: "Erro ao Enviar Email",
        message: mensagem,
        variant: "error"
      };
      mostrarNotificacao.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiPageHeader = __nuxt_component_0;
      const _component_UiButton = __nuxt_component_1;
      const _component_UiCard = __nuxt_component_2;
      const _component_UiModal = __nuxt_component_3;
      const _component_UiNotification = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_UiPageHeader, {
        title: "Funcionários",
        description: "Gerencie todos os colaboradores da empresa"
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
                  _push3(` Novo Funcionário `);
                } else {
                  return [
                    createTextVNode(" Novo Funcionário ")
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
                  createTextVNode(" Novo Funcionário ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UiCard, {
        padding: "p-4",
        class: "mb-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative"${_scopeId}><svg class="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><input${ssrRenderAttr("value", unref(busca))} type="text" placeholder="Buscar funcionário por nome, cargo ou departamento..." class="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "relative" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  })
                ])),
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => isRef(busca) ? busca.value = $event : null,
                  type: "text",
                  placeholder: "Buscar funcionário por nome, cargo ou departamento...",
                  class: "w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, unref(busca)]
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4"><!--[-->`);
      ssrRenderList(unref(funcionariosFiltrados), (func) => {
        _push(ssrRenderComponent(FuncionarioCard, {
          key: func.id,
          funcionario: func,
          onEdit: abrirModal,
          onToggleStatus: toggleStatus,
          onEmailEnviado: handleEmailEnviado,
          onEmailErro: handleEmailErro
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UiModal, {
        modelValue: unref(modalAberto),
        "onUpdate:modelValue": ($event) => isRef(modalAberto) ? modalAberto.value = $event : null,
        title: unref(funcionarioEditando) ? "Editar Funcionário" : "Novo Funcionário",
        "max-width": "max-w-6xl",
        "content-max-height": "calc(90vh - 120px)",
        "close-on-backdrop": false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(FuncionarioForm, {
              form: unref(form),
              "is-editing": !!unref(funcionarioEditando),
              "show-empresa-select": true,
              loading: unref(loading),
              onSubmit: salvarFuncionario,
              onSalvarEEnviar: salvarEEnviarAcesso,
              onCancel: ($event) => modalAberto.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(FuncionarioForm, {
                form: unref(form),
                "is-editing": !!unref(funcionarioEditando),
                "show-empresa-select": true,
                loading: unref(loading),
                onSubmit: salvarFuncionario,
                onSalvarEEnviar: salvarEEnviarAcesso,
                onCancel: ($event) => modalAberto.value = false
              }, null, 8, ["form", "is-editing", "loading", "onCancel"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/funcionarios.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=funcionarios-BLADvK_X.mjs.map
