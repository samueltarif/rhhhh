<template>
  <div class="space-y-6">
    <!-- Navegação por Abas -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="abaAtiva = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            abaAtiva === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Conteúdo das Abas -->
    <div class="min-h-[400px]">
      <!-- Aba: Dados Pessoais -->
      <div v-if="abaAtiva === 'pessoais'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">👤 Dados Pessoais</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <UiInput 
              v-model="form.nome_completo" 
              label="Nome Completo" 
              required 
              placeholder="Digite o nome completo"
            />
          </div>
          
          <UiInput 
            v-model="form.cpf" 
            label="CPF" 
            required
            placeholder="000.000.000-00"
          />
          
          <UiInputPIS 
            v-model="form.pis_pasep" 
            label="PIS/PASEP" 
            placeholder="000.00000.00-0"
          />
          
          <UiInput 
            v-model="form.rg" 
            label="RG" 
            placeholder="00.000.000-0"
          />
          
          <UiInput 
            v-model="form.data_nascimento" 
            type="date" 
            label="Data de Nascimento"
          />
          
          <UiSelect 
            v-model="form.sexo" 
            :options="sexoOptions" 
            label="Sexo" 
            placeholder="Selecione..."
          />
          
          <UiInput 
            v-model="form.telefone" 
            label="Telefone"
            placeholder="(11) 99999-9999"
          />
          
          <UiInput 
            v-model="form.email_pessoal" 
            type="email" 
            :uppercase="false"
            label="Email Pessoal" 
            placeholder="email@pessoal.com"
          />
        </div>
      </div>

      <!-- Aba: Dados Profissionais -->
      <div v-if="abaAtiva === 'profissionais'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">💼 Dados Profissionais</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Empresa -->
          <div v-if="showEmpresaSelect" class="md:col-span-2">
            <UiSelect 
              v-model="form.empresa_id" 
              :options="empresasOptions" 
              label="Empresa" 
              placeholder="Selecione a empresa..."
            />
          </div>
          
          <UiSelect 
            v-model="form.departamento_id" 
            :options="departamentosOptions" 
            label="Departamento" 
            placeholder="Selecione..."
          />
          
          <UiSelect 
            v-model="form.cargo_id" 
            :options="cargosOptions" 
            label="Cargo" 
            placeholder="Selecione..."
          />
          
          <UiSelect 
            v-model="form.tipo_contrato" 
            :options="tipoContratoOptions" 
            label="Tipo de Contrato"
          />
          
          <UiInput 
            v-model="form.data_admissao" 
            type="date" 
            label="Data de Admissão"
          />
          
          <UiInput 
            v-model="form.matricula" 
            label="Matrícula/Registro" 
            placeholder="Gerado automaticamente"
          />
          
          <UiSelect 
            v-model="form.jornada_trabalho_id" 
            :options="jornadaOptionsComputed" 
            label="Jornada de Trabalho"
          />
          
          <UiSelect 
            v-model="form.responsavel_direto" 
            :options="responsavelOptions" 
            label="Responsável Direto" 
            placeholder="Selecione..."
          />
        </div>
        
        <div class="mt-4 p-4 bg-blue-50 rounded-xl">
          <p class="text-sm text-blue-700">
            💡 <strong>Dica:</strong> O responsável direto é quem supervisiona este funcionário. 
            Por padrão, sugerimos <strong>{{ nomeAdmin }}</strong> como responsável.
          </p>
        </div>
      </div>

      <!-- Aba: Acesso ao Sistema -->
      <div v-if="abaAtiva === 'acesso'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🔐 Acesso ao Sistema</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput 
            v-model="form.email_login" 
            type="email" 
            :uppercase="false"
            label="Email de Login"
            required
            placeholder="email@empresa.com"
          />
          
          <UiInput 
            v-model="form.senha" 
            type="password" 
            label="Senha"
            required
            show-password-toggle
            placeholder="••••••••"
          />
          
          <UiSelect 
            v-model="form.tipo_acesso" 
            :options="tipoAcessoOptions" 
            label="Tipo de Acesso"
          />
          
          <UiSelect 
            v-model="form.status" 
            :options="statusOptions" 
            label="Status do Usuário"
          />
        </div>
        
        <div class="mt-4 p-4 bg-blue-50 rounded-xl">
          <h4 class="font-semibold text-blue-800 mb-2">📋 Tipos de Acesso:</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li><strong>Funcionário:</strong> Visualiza apenas seus próprios dados</li>
            <li><strong>Administrador:</strong> Acesso total ao sistema</li>
          </ul>
        </div>
      </div>

      <!-- Aba: Dados Financeiros -->
      <div v-if="abaAtiva === 'financeiros'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">💰 Dados Financeiros</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput 
            v-model="form.salario_base" 
            type="number" 
            :uppercase="false"
            step="0.01"
            label="Salário Base (R$)"
            placeholder="0,00"
          />
          
          <UiSelect 
            v-model="form.tipo_salario" 
            :options="tipoSalarioOptions" 
            label="Tipo de Salário"
          />
          
          <UiInput 
            v-model="form.numero_dependentes" 
            type="number" 
            :uppercase="false"
            min="0"
            step="1"
            label="Número de Dependentes (IRRF)"
            placeholder="0"
          />
          
          <UiInput 
            v-model="form.banco" 
            label="Banco" 
            placeholder="Nome do banco"
          />
          
          <UiInput 
            v-model="form.agencia" 
            label="Agência" 
            placeholder="0000"
          />
          
          <UiInput 
            v-model="form.conta" 
            label="Conta" 
            placeholder="00000-0"
          />
          
          <UiSelect 
            v-model="form.tipo_conta" 
            :options="tipoContaOptions" 
            label="Tipo de Conta" 
            placeholder="Selecione..."
          />
          
          <UiSelect 
            v-model="form.forma_pagamento" 
            :options="formaPagamentoOptions" 
            label="Forma de Pagamento"
          />
        </div>
      </div>

      <!-- Aba: Benefícios e Descontos -->
      <div v-if="abaAtiva === 'beneficios'" class="space-y-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🎁 Benefícios e Descontos</h3>
        
        <!-- Benefícios Padrão -->
        <div class="space-y-4">
          <h4 class="text-md font-semibold text-gray-700 mb-3">📋 Benefícios Padrão</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Vale Transporte -->
            <div class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🚌</span>
                  <h5 class="font-semibold text-gray-800">Vale Transporte</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.vale_transporte.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.vale_transporte.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.vale_transporte.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor Diário (R$)" 
                  placeholder="0,00"
                />
                
                <UiSelect 
                  v-model="form.beneficios.vale_transporte.tipo_desconto" 
                  :options="tipoDescontoOptions" 
                  label="Tipo de Desconto" 
                />
                
                <UiInput 
                  v-if="form.beneficios.vale_transporte.tipo_desconto === 'percentual'"
                  v-model="form.beneficios.vale_transporte.percentual_desconto" 
                  type="number" 
                  step="0.01"
                  label="% de Desconto" 
                  placeholder="6.00"
                />
                
                <UiInput 
                  v-if="form.beneficios.vale_transporte.tipo_desconto === 'valor_fixo'"
                  v-model="form.beneficios.vale_transporte.valor_desconto" 
                  type="number" 
                  step="0.01"
                  label="Valor do Desconto (R$)" 
                  placeholder="0,00"
                />
              </div>
            </div>

            <!-- Vale Refeição -->
            <div class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🍽️</span>
                  <h5 class="font-semibold text-gray-800">Vale Refeição</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.vale_refeicao.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.vale_refeicao.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.vale_refeicao.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor Diário (R$)" 
                  placeholder="0,00"
                />
                
                <UiSelect 
                  v-model="form.beneficios.vale_refeicao.tipo_desconto" 
                  :options="tipoDescontoOptions" 
                  label="Tipo de Desconto" 
                />
                
                <UiInput 
                  v-if="form.beneficios.vale_refeicao.tipo_desconto === 'percentual'"
                  v-model="form.beneficios.vale_refeicao.percentual_desconto" 
                  type="number" 
                  step="0.01"
                  label="% de Desconto" 
                  placeholder="20.00"
                />
                
                <UiInput 
                  v-if="form.beneficios.vale_refeicao.tipo_desconto === 'valor_fixo'"
                  v-model="form.beneficios.vale_refeicao.valor_desconto" 
                  type="number" 
                  step="0.01"
                  label="Valor do Desconto (R$)" 
                  placeholder="0,00"
                />
              </div>
            </div>

            <!-- Plano de Saúde -->
            <div class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🏥</span>
                  <h5 class="font-semibold text-gray-800">Plano de Saúde</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.plano_saude.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.plano_saude.ativo" class="space-y-3">
                <UiSelect 
                  v-model="form.beneficios.plano_saude.plano" 
                  :options="planoSaudeOptions" 
                  label="Tipo de Plano" 
                />
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.valor_empresa" 
                  type="number" 
                  step="0.01"
                  label="Valor Pago pela Empresa (R$)" 
                  placeholder="0,00"
                />
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.valor_funcionario" 
                  type="number" 
                  step="0.01"
                  label="Valor Descontado do Funcionário (R$)" 
                  placeholder="0,00"
                />
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.dependentes" 
                  type="number" 
                  label="Número de Dependentes" 
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Plano Odontológico -->
            <div class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🦷</span>
                  <h5 class="font-semibold text-gray-800">Plano Odontológico</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.plano_odonto.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.plano_odonto.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.plano_odonto.valor_funcionario" 
                  type="number" 
                  step="0.01"
                  label="Valor Descontado (R$)" 
                  placeholder="0,00"
                />
                
                <UiInput 
                  v-model="form.beneficios.plano_odonto.dependentes" 
                  type="number" 
                  label="Número de Dependentes" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Descontos Personalizados -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-md font-semibold text-gray-700">📉 Descontos Personalizados</h4>
            <UiButton 
              variant="secondary" 
              size="sm"
              @click="adicionarDesconto"
            >
              ➕ Adicionar Desconto
            </UiButton>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(desconto, index) in form.descontos_personalizados" 
              :key="index"
              class="p-4 border border-gray-200 rounded-xl"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <UiInput 
                  v-model="desconto.descricao" 
                  label="Descrição" 
                  placeholder="Ex: Empréstimo, Seguro de Vida"
                />
                
                <UiSelect 
                  v-model="desconto.tipo" 
                  :options="tipoDescontoOptions" 
                  label="Tipo" 
                />
                
                <UiInput 
                  v-if="desconto.tipo === 'percentual'"
                  v-model="desconto.percentual" 
                  type="number" 
                  step="0.01"
                  label="Percentual (%)" 
                  placeholder="0,00"
                />
                
                <UiInput 
                  v-if="desconto.tipo === 'valor_fixo'"
                  v-model="desconto.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor (R$)" 
                  placeholder="0,00"
                />
                
                <div class="flex items-end">
                  <UiButton 
                    variant="danger" 
                    size="sm" 
                    @click="removerDesconto(Number(index))"
                  >
                    🗑️ Remover
                  </UiButton>
                </div>
              </div>
              
              <div class="mt-3 flex gap-4">
                <UiCheckbox 
                  v-model="desconto.recorrente" 
                  label="Desconto recorrente"
                />
                
                <UiInput 
                  v-if="!desconto.recorrente"
                  v-model="desconto.parcelas" 
                  type="number" 
                  label="Número de parcelas" 
                  placeholder="1"
                  class="w-32"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Resumo dos Benefícios -->
        <div class="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <h4 class="text-lg font-bold text-gray-800 mb-4">📊 Resumo dos Benefícios</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-green-600">
                R$ {{ calcularTotalBeneficios().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Total de Benefícios</div>
            </div>
            
            <div>
              <div class="text-xl font-bold text-red-600">
                R$ {{ calcularTotalDescontos().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Total de Descontos</div>
            </div>
            
            <div>
              <div class="text-xl font-bold text-blue-600">
                R$ {{ calcularSaldoLiquido().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Impacto no Salário</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <UiButton variant="secondary" @click="$emit('cancel')">
        Cancelar
      </UiButton>
      
      <UiButton 
        variant="success" 
        @click="salvarEEnviarAcesso"
        :disabled="loading"
      >
        💾 Salvar e Enviar Acesso
      </UiButton>
      
      <UiButton 
        @click="handleSubmit"
        :disabled="loading"
      >
        💾 {{ isEditing ? 'Atualizar' : 'Salvar' }} Funcionário
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: any
  isEditing: boolean
  showEmpresaSelect?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showEmpresaSelect: false,
  loading: false
})

const emit = defineEmits<{
  submit: []
  cancel: []
  'salvar-e-enviar': []
}>()

// Estado da aba ativa
const abaAtiva = ref('pessoais')

// Abas do formulário
const tabs = [
  { id: 'pessoais', label: 'Dados Pessoais', icon: '👤' },
  { id: 'profissionais', label: 'Dados Profissionais', icon: '💼' },
  { id: 'acesso', label: 'Acesso ao Sistema', icon: '🔐' },
  { id: 'financeiros', label: 'Dados Financeiros', icon: '💰' },
  { id: 'beneficios', label: 'Benefícios e Descontos', icon: '🎁' }
]

// Opções para os selects
const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
]

const tipoContratoOptions = [
  { value: 'CLT', label: 'CLT' },
  { value: 'PJ', label: 'PJ' },
  { value: 'Estagio', label: 'Estágio' },
  { value: 'Temporario', label: 'Temporário' }
]

const jornadaOptions = [
  { value: '44h', label: '44h semanais' },
  { value: '40h', label: '40h semanais' },
  { value: '36h', label: '36h semanais' },
  { value: '30h', label: '30h semanais' }
]

const tipoAcessoOptions = [
  { value: 'funcionario', label: 'Funcionário' },
  { value: 'admin', label: 'Administrador' }
]

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' }
]

const tipoSalarioOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'horista', label: 'Horista' }
]

const formaPagamentoOptions = [
  { value: 'deposito', label: 'Depósito Bancário' },
  { value: 'pix', label: 'PIX' }
]

const tipoContaOptions = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' },
  { value: 'salario', label: 'Conta Salário' }
]

const tipoDescontoOptions = [
  { value: 'sem_desconto', label: 'Sem Desconto' },
  { value: 'percentual', label: 'Percentual (%)' },
  { value: 'valor_fixo', label: 'Valor Fixo (R$)' }
]

const planoSaudeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'coparticipacao', label: 'Coparticipação' }
]

// Inicializar estrutura de benefícios se não existir
if (!props.form.beneficios) {
  props.form.beneficios = {
    vale_transporte: {
      ativo: false,
      valor: 0,
      valor_mensal: 0,
      tipo_desconto: 'percentual',
      percentual_desconto: 6,
      valor_desconto: 0
    },
    vale_refeicao: {
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
    }
  }
}

if (!props.form.descontos_personalizados) {
  props.form.descontos_personalizados = []
}

// Função para calcular valor diário do Vale Refeição
const calcularValorDiarioVR = () => {
  if (props.form.beneficios?.vale_refeicao?.valor_mensal) {
    props.form.beneficios.vale_refeicao.valor = props.form.beneficios.vale_refeicao.valor_mensal / 22
  }
}

const { 
  formatarHorario, 
  formatarHorasDecimais, 
  obterNomeDia, 
  obterAbrevDia 
} = useJornadas()

const { opcoesJornadas, carregarJornadas } = useJornadas()
const { empresas, carregarEmpresas, obterOpcoesEmpresas } = useEmpresas()
const { opcoesDepartamentos, carregarDepartamentos } = useDepartamentos()
const { opcoesCargos, carregarCargos } = useCargos()
const { nomeAdmin, buscarAdmin } = useAdmin()

// Carregar dados ao montar o componente
onMounted(async () => {
  await Promise.all([
    carregarJornadas(),
    carregarEmpresas(),
    carregarDepartamentos(),
    carregarCargos(),
    buscarAdmin()
  ])
})

// Recarregar dados sempre que o formulário for exibido (detectando mudanças no form)
watch(() => props.form.nome_completo, async (novoNome, nomeAntigo) => {
  // Se o nome mudou de vazio para preenchido ou vice-versa, recarregar dados
  if ((novoNome && !nomeAntigo) || (!novoNome && nomeAntigo)) {
    console.log('🔄 Recarregando dados dos selects...')
    await Promise.all([
      carregarJornadas(),
      carregarEmpresas(),
      carregarDepartamentos(),
      carregarCargos()
    ])
  }
})

// Opções de departamentos vindas da API
const departamentosOptions = computed(() => opcoesDepartamentos.value)

// Opções de cargos vindas da API
const cargosOptions = computed(() => opcoesCargos.value)

// Opções de responsável direto (com admin em destaque)
const responsavelOptions = computed(() => [
  { value: nomeAdmin.value, label: `${nomeAdmin.value} (Admin) ⭐` },
  // Outros responsáveis serão carregados da API
])

// Opções de empresas vindas do banco de dados
const empresasOptions = computed(() => obterOpcoesEmpresas.value)

// Opções de jornadas
const jornadaOptionsComputed = computed(() => opcoesJornadas.value)

// Funções para gerenciar descontos personalizados
const adicionarDesconto = () => {
  props.form.descontos_personalizados.push({
    descricao: '',
    tipo: 'valor_fixo',
    valor: 0,
    percentual: 0,
    recorrente: true,
    parcelas: 1
  })
}

const removerDesconto = (index: number) => {
  if (props.form.descontos_personalizados) {
    props.form.descontos_personalizados.splice(index, 1)
  }
}

// Funções para calcular totais
const calcularTotalBeneficios = () => {
  let total = 0
  
  // Vale Transporte - usar valor_mensal se existir, senão calcular
  if (props.form.beneficios?.vale_transporte?.ativo) {
    const valorMensal = props.form.beneficios.vale_transporte.valor_mensal || 
                        (props.form.beneficios.vale_transporte.valor || 0) * 22
    total += valorMensal
  }
  
  // Vale Refeição - usar valor_mensal se existir, senão calcular
  if (props.form.beneficios?.vale_refeicao?.ativo) {
    const valorMensal = props.form.beneficios.vale_refeicao.valor_mensal || 
                        (props.form.beneficios.vale_refeicao.valor || 0) * 22
    total += valorMensal
  }
  
  // Plano de Saúde (valor pago pela empresa)
  if (props.form.beneficios?.plano_saude?.ativo) {
    total += props.form.beneficios.plano_saude.valor_empresa || 0
  }
  
  return total
}

const calcularTotalDescontos = () => {
  let total = 0
  const salarioBase = parseFloat(props.form.salario_base) || 0
  
  // Descontos dos benefícios
  if (props.form.beneficios?.vale_transporte?.ativo) {
    const vt = props.form.beneficios.vale_transporte
    if (vt.tipo_desconto === 'percentual') {
      total += salarioBase * (vt.percentual_desconto || 0) / 100
    } else if (vt.tipo_desconto === 'valor_fixo') {
      total += vt.valor_desconto || 0
    }
  }
  
  if (props.form.beneficios?.vale_refeicao?.ativo) {
    const vr = props.form.beneficios.vale_refeicao
    if (vr.tipo_desconto === 'percentual') {
      total += salarioBase * (vr.percentual_desconto || 0) / 100
    } else if (vr.tipo_desconto === 'valor_fixo') {
      total += vr.valor_desconto || 0
    }
  }
  
  // Plano de Saúde
  if (props.form.beneficios?.plano_saude?.ativo) {
    total += props.form.beneficios.plano_saude.valor_funcionario || 0
  }
  
  // Plano Odontológico
  if (props.form.beneficios?.plano_odonto?.ativo) {
    total += props.form.beneficios.plano_odonto.valor_funcionario || 0
  }
  
  // Descontos personalizados
  props.form.descontos_personalizados?.forEach((desconto: any) => {
    if (desconto.tipo === 'percentual') {
      total += salarioBase * (desconto.percentual || 0) / 100
    } else if (desconto.tipo === 'valor_fixo') {
      total += desconto.valor || 0
    }
  })
  
  return total
}

const calcularSaldoLiquido = () => {
  return calcularTotalBeneficios() - calcularTotalDescontos()
}

// Handlers
const handleSubmit = () => {
  emit('submit')
}

const salvarEEnviarAcesso = () => {
  emit('salvar-e-enviar')
}
</script>