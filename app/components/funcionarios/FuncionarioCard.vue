<template>
  <UiCard padding="p-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <UiAvatar 
          :name="funcionario.nome_completo" 
          :avatar-type="funcionario.avatar"
          size="lg"
        />
        
        <!-- Informações -->
        <div>
          <h3 class="text-xl font-bold text-gray-800">{{ funcionario.nome_completo }}</h3>
          <p class="text-lg text-gray-600">{{ funcionario.cargo }} - {{ funcionario.departamento }}</p>
          <p class="text-gray-500">{{ funcionario.email_login }}</p>
          <p class="text-sm text-gray-400">CPF: {{ funcionario.cpf }}</p>
          <p class="text-sm text-gray-400">Admissão: {{ formatarData(funcionario.data_admissao) }}</p>
          
          <!-- Responsável pelo Cadastro -->
          <div class="mt-1 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-700">
              👤 <strong>Cadastrado por:</strong> {{ funcionario.responsavel_cadastro_nome }}
              <span v-if="funcionario.responsavel_cadastro_email" class="text-blue-600">
                ({{ funcionario.responsavel_cadastro_email }})
              </span>
            </p>
          </div>
          
          <!-- Salário Bruto -->
          <div class="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
            <p class="text-lg font-bold text-green-700">
              💰 Salário: {{ formatarMoeda(funcionario.salario_base) }}
            </p>
          </div>
          
          <!-- Badges -->
          <div class="flex gap-2 mt-2">
            <UiBadge :variant="funcionario.status === 'ativo' ? 'success' : 'gray'">
              {{ funcionario.status === 'ativo' ? 'Ativo' : 'Inativo' }}
            </UiBadge>
            
            <UiBadge :variant="funcionario.tipo_acesso === 'admin' ? 'warning' : 'info'">
              {{ funcionario.tipo_acesso === 'admin' ? 'Administrador' : 'Funcionário' }}
            </UiBadge>
            
            <UiBadge variant="gray">
              {{ funcionario.telefone }}
            </UiBadge>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex gap-2">
        <UiButton variant="ghost" @click="$emit('edit', funcionario)">
          ✏️ Editar
        </UiButton>
        
        <UiButton variant="ghost" @click="verHolerites">
          📄 Holerites
        </UiButton>
        
        <UiButton 
          variant="ghost" 
          @click="enviarCredenciais"
          :disabled="enviandoEmail"
        >
          {{ enviandoEmail ? '📧 Enviando...' : '🔑 Login' }}
        </UiButton>
        
        <UiButton 
          :variant="funcionario.status === 'ativo' ? 'danger' : 'success'"
          @click="$emit('toggle-status', funcionario)"
        >
          {{ funcionario.status === 'ativo' ? '🚫 Inativar' : '✓ Ativar' }}
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
interface Props {
  funcionario: {
    id: number
    nome_completo: string
    cpf: string
    cargo: string
    departamento: string
    status: string
    tipo_acesso: string
    email_login: string
    telefone: string
    data_admissao: string
    salario_base: number
    avatar?: string
    responsavel_cadastro_nome?: string
    responsavel_cadastro_email?: string
    responsavel_direto_nome?: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [funcionario: any]
  'toggle-status': [funcionario: any]
  'email-enviado': [mensagem: string]
  'email-erro': [mensagem: string]
}>()

const enviandoEmail = ref(false)

const verHolerites = () => {
  // Navegar para página de holerites do funcionário
  navigateTo('/admin/holerites')
}

const enviarCredenciais = async () => {
  if (enviandoEmail.value) return
  
  enviandoEmail.value = true
  
  try {
    console.log('📧 Enviando credenciais para funcionário ID:', props.funcionario.id)
    
    await $fetch('/api/funcionarios/enviar-acesso', {
      method: 'POST',
      body: {
        funcionario_id: props.funcionario.id
      }
    })
    
    emit('email-enviado', `Credenciais enviadas com sucesso para ${props.funcionario.email_login}!`)
  } catch (error: any) {
    console.error('❌ Erro ao enviar credenciais:', error)
    emit('email-erro', error.data?.message || 'Erro ao enviar credenciais. Verifique se o funcionário possui email cadastrado.')
  } finally {
    enviandoEmail.value = false
  }
}

const formatarData = (data: string) => {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

const formatarMoeda = (valor: number) => {
  if (!valor) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}
</script>