<template>
  <div>
    <UiPageHeader title="Funcionários" description="Gerencie todos os colaboradores da empresa">
      <UiButton size="lg" icon="➕" @click="abrirModal()">
        Novo Funcionário
      </UiButton>
    </UiPageHeader>

    <!-- Busca -->
    <UiCard padding="p-4" class="mb-6">
      <div class="relative">
        <svg class="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          v-model="busca"
          type="text"
          placeholder="Buscar funcionário por nome, cargo ou departamento..."
          class="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 outline-none"
        />
      </div>
    </UiCard>

    <!-- Lista de Funcionários -->
    <div class="space-y-4">
      <template v-for="(func, index) in funcionariosFiltrados" :key="func.id">
        <FuncionarioCard 
          :funcionario="func"
          @edit="abrirModal"
          @toggle-status="toggleStatus"
          @email-enviado="handleEmailEnviado"
          @email-erro="handleEmailErro"
        />
      </template>
    </div>

    <!-- Modal de Cadastro/Edição -->
    <UiModal 
      v-model="modalAberto" 
      :title="funcionarioEditando ? 'Editar Funcionário' : 'Novo Funcionário'"
      max-width="max-w-6xl"
      content-max-height="calc(90vh - 120px)"
      :close-on-backdrop="false"
    >
      <FuncionarioForm 
        :form="form"
        :is-editing="!!funcionarioEditando"
        :show-empresa-select="true"
        :loading="loading"
        @submit="salvarFuncionario"
        @salvar-e-enviar="salvarEEnviarAcesso"
        @cancel="modalAberto = false"
      />
    </UiModal>

    <!-- Notificação -->
    <UiNotification 
      :show="mostrarNotificacao"
      :title="notificacao.title"
      :message="notificacao.message"
      :variant="notificacao.variant"
      @close="mostrarNotificacao = false"
    />
  </div>
</template>

<script setup lang="ts">
// Imports explícitos dos componentes
import FuncionarioForm from '~/components/funcionarios/FuncionarioForm.vue'
import FuncionarioCard from '~/components/funcionarios/FuncionarioCard.vue'

definePageMeta({ middleware: ['auth', 'admin'] })

const busca = ref('')
const modalAberto = ref(false)
const funcionarioEditando = ref<any>(null)
const loading = ref(false)
const mostrarNotificacao = ref(false)
const notificacao = ref({
  title: '',
  message: '',
  variant: 'success' as 'success' | 'error' | 'warning' | 'info'
})

const form = ref({
  // Dados Pessoais
  nome_completo: '',
  cpf: '',
  rg: '',
  pis_pasep: '',
  data_nascimento: '',
  sexo: '',
  estado_civil: '',
  telefone: '',
  email_pessoal: '',
  contato_emergencia_nome: '',
  contato_emergencia_telefone: '',
  
  // Endereço
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  
  // Dados Profissionais
  empresa_id: '',
  departamento_id: '',
  cargo_id: '',
  responsavel_id: 1,
  tipo_contrato: 'CLT',
  data_admissao: '',
  matricula: '',
  jornada_trabalho_id: '',
  
  // Acesso ao Sistema
  email_login: '',
  senha: '',
  tipo_acesso: 'funcionario',
  status: 'ativo',
  
  // Dados Financeiros
  salario_base: '',
  tipo_salario: 'mensal',
  numero_dependentes: 0,
  banco: '',
  agencia: '',
  conta: '',
  tipo_conta: '',
  forma_pagamento: 'deposito',
  
  // Benefícios
  beneficios: {
    vale_transporte: {
      ativo: false,
      valor: 0,
      valor_mensal: 0,
      tipo_desconto: 'percentual',
      percentual_desconto: 6,
      valor_desconto: 0
    },
    cesta_basica: {
      ativo: false,
      valor: 0,
      valor_mensal: 0,
      tipo_desconto: 'sem_desconto',
      percentual_desconto: 0,
      valor_desconto: 0
    },
    plano_saude: {
      ativo: false,
      plano: 'individual',
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
  observacoes_internas: ''
})

const funcionarios = ref<any[]>([])

// Carregar funcionários do banco
const carregarFuncionarios = async () => {
  try {
    const data = await $fetch('/api/funcionarios')
    
    if (data) {
      // Transformar dados da API para formato esperado pelo frontend
      funcionarios.value = data.map(f => ({
        ...f,
        // Extrair nomes dos objetos relacionados
        cargo: f.cargos?.nome || 'Cargo não definido',
        departamento: f.departamentos?.nome || 'Departamento não definido',
        empresa: f.empresas?.nome_fantasia || f.empresas?.nome || 'Empresa não definida'
      }))
    }
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error)
  }
}

// Carregar ao montar
onMounted(() => {
  carregarFuncionarios()
})

const funcionariosFiltrados = computed(() => {
  if (!busca.value) {
    return funcionarios.value
  }
  
  const termo = busca.value.toLowerCase()
  return funcionarios.value.filter(f => {
    return f.nome_completo?.toLowerCase().includes(termo) ||
           f.cargo?.toLowerCase().includes(termo) ||
           f.departamento?.toLowerCase().includes(termo) ||
           f.email_login?.toLowerCase().includes(termo)
  })
})

const abrirModal = async (func?: any) => {
  if (func) {
    // Buscar dados completos do funcionário da API
    try {
      const funcionarioCompleto: any = await $fetch(`/api/funcionarios/${func.id}`)
      funcionarioEditando.value = funcionarioCompleto
      
      // Garantir que benefícios existam com estrutura correta
      const beneficiosPadrao = {
        vale_transporte: {
          ativo: false,
          valor: 0,
          valor_mensal: 0,
          tipo_desconto: 'percentual',
          percentual_desconto: 6,
          valor_desconto: 0
        },
        cesta_basica: {
          ativo: false,
          valor: 0,
          valor_mensal: 0,
          tipo_desconto: 'sem_desconto',
          percentual_desconto: 0,
          valor_desconto: 0
        },
        plano_saude: {
          ativo: false,
          plano: 'individual',
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
      }
      
      // Mesclar benefícios do banco com estrutura padrão
      const beneficiosMesclados = {
        ...beneficiosPadrao,
        ...(funcionarioCompleto.beneficios || {})
      }
      
      // Garantir que personalizados seja array
      if (!Array.isArray(beneficiosMesclados.personalizados)) {
        beneficiosMesclados.personalizados = []
      }
      
      // Atualizar form com dados completos
      form.value = {
        ...funcionarioCompleto,
        beneficios: beneficiosMesclados,
        descontos_personalizados: Array.isArray(funcionarioCompleto.descontos_personalizados) 
          ? funcionarioCompleto.descontos_personalizados 
          : []
      }
      
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error)
      notificacao.value = {
        title: 'Erro!',
        message: 'Erro ao carregar dados do funcionário',
        variant: 'error'
      }
      mostrarNotificacao.value = true
      return
    }
  } else {
    funcionarioEditando.value = null
    form.value = {
      // Dados Pessoais
      nome_completo: '',
      cpf: '',
      rg: '',
      pis_pasep: '',
      data_nascimento: '',
      sexo: '',
      estado_civil: '',
      telefone: '',
      email_pessoal: '',
      contato_emergencia_nome: '',
      contato_emergencia_telefone: '',
      
      // Endereço
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      
      // Dados Profissionais
      empresa_id: '',
      departamento_id: '',
      cargo_id: '',
      responsavel_id: 1,
      tipo_contrato: 'CLT',
      data_admissao: '',
      matricula: '',
      jornada_trabalho_id: '',
      
      // Acesso ao Sistema
      email_login: '',
      senha: '',
      tipo_acesso: 'funcionario',
      status: 'ativo',
      
      // Dados Financeiros
      salario_base: '',
      tipo_salario: 'mensal',
      numero_dependentes: 0,
      banco: '',
      agencia: '',
      conta: '',
      tipo_conta: '',
      forma_pagamento: 'deposito',
      
      // Benefícios
      beneficios: {
        vale_transporte: {
          ativo: false,
          valor: 0,
          valor_mensal: 0,
          tipo_desconto: 'percentual',
          percentual_desconto: 6,
          valor_desconto: 0
        },
        cesta_basica: {
          ativo: false,
          valor: 0,
          valor_mensal: 0,
          tipo_desconto: 'sem_desconto',
          percentual_desconto: 0,
          valor_desconto: 0
        },
        plano_saude: {
          ativo: false,
          plano: 'individual',
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
      observacoes_internas: ''
    }
  }
  
  modalAberto.value = true
}

const salvarFuncionario = async () => {
  loading.value = true
  
  try {
    // Validar apenas campos obrigatórios: nome e CPF
    if (!form.value.nome_completo || !form.value.cpf) {
      throw new Error('Preencha o nome completo e CPF')
    }

    if (funcionarioEditando.value) {
      // ATUALIZAR funcionário existente usando $fetch
      await $fetch(`/api/funcionarios/${funcionarioEditando.value.id}`, {
        method: 'PATCH',
        body: form.value
      })
    } else {
      // CRIAR novo funcionário usando $fetch
      await $fetch('/api/funcionarios', {
        method: 'POST',
        body: form.value
      })
    }
    
    notificacao.value = {
      title: 'Sucesso!',
      message: `Funcionário ${funcionarioEditando.value ? 'atualizado' : 'cadastrado'} com sucesso!`,
      variant: 'success'
    }
    mostrarNotificacao.value = true
    modalAberto.value = false
    
    // Recarregar lista de funcionários
    await carregarFuncionarios()
    
  } catch (error: any) {
    console.error('Erro ao salvar:', error)
    notificacao.value = {
      title: 'Erro!',
      message: error.message || 'Erro ao salvar funcionário. Tente novamente.',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}

const salvarEEnviarAcesso = async () => {
  loading.value = true
  
  try {
    // Validar apenas campos obrigatórios: nome e CPF
    if (!form.value.nome_completo || !form.value.cpf) {
      throw new Error('Preencha o nome completo e CPF')
    }

    // 1. Criar funcionário via API usando $fetch
    const response: any = await $fetch('/api/funcionarios', {
      method: 'POST',
      body: form.value
    })

    const funcionarioCriado = response?.data

    if (!funcionarioCriado || !funcionarioCriado.id) {
      throw new Error('Funcionário criado mas dados não retornados')
    }

    console.log('✅ Funcionário criado:', funcionarioCriado.id)

    // 2. Enviar email de boas-vindas (se tiver email)
    if (form.value.email_login) {
      console.log('📧 Enviando email para:', form.value.email_login)
      
      try {
        await $fetch('/api/funcionarios/enviar-acesso', {
          method: 'POST',
          body: {
            funcionario_id: funcionarioCriado.id
          }
        })

        notificacao.value = {
          title: 'Sucesso!',
          message: `Funcionário cadastrado e email enviado para ${form.value.email_login}! ✉️`,
          variant: 'success'
        }
      } catch (erroEmail: any) {
        console.warn('⚠️ Funcionário criado mas erro ao enviar email:', erroEmail)
        notificacao.value = {
          title: 'Atenção!',
          message: `Funcionário cadastrado, mas não foi possível enviar o email para ${form.value.email_login}. Envie manualmente.`,
          variant: 'warning'
        }
      }
    } else {
      notificacao.value = {
        title: 'Sucesso!',
        message: 'Funcionário cadastrado! Configure o email de login para enviar acesso.',
        variant: 'success'
      }
    }
    
    mostrarNotificacao.value = true
    modalAberto.value = false
    
    // Recarregar lista de funcionários
    await carregarFuncionarios()
    
  } catch (error: any) {
    console.error('Erro ao salvar:', error)
    notificacao.value = {
      title: 'Erro!',
      message: error.message || 'Erro ao salvar funcionário.',
      variant: 'error'
    }
    mostrarNotificacao.value = true
  } finally {
    loading.value = false
  }
}

const toggleStatus = (func: any) => {
  func.status = func.status === 'ativo' ? 'inativo' : 'ativo'
  
  notificacao.value = {
    title: 'Status Atualizado!',
    message: `Funcionário ${func.nome_completo} ${func.status === 'ativo' ? 'ativado' : 'inativado'} com sucesso!`,
    variant: 'success'
  }
  mostrarNotificacao.value = true
}

const handleEmailEnviado = (mensagem: string) => {
  notificacao.value = {
    title: 'Email Enviado!',
    message: mensagem,
    variant: 'success'
  }
  mostrarNotificacao.value = true
}

const handleEmailErro = (mensagem: string) => {
  notificacao.value = {
    title: 'Erro ao Enviar Email',
    message: mensagem,
    variant: 'error'
  }
  mostrarNotificacao.value = true
}
</script>
