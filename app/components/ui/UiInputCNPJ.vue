<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors pr-20',
          disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500',
          error ? 'border-red-300' : '',
          consultando ? 'bg-blue-50' : ''
        ]"
        @input="handleInput"
        @blur="handleBlur"
      />
      
      <!-- Botão de consulta -->
      <button
        v-if="cnpjValido && !consultando"
        type="button"
        @click="consultarDados"
        class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
      >
        🔍 Buscar
      </button>
      
      <!-- Loading -->
      <div v-if="consultando" class="absolute right-4 top-1/2 -translate-y-1/2">
        <svg class="w-5 h-5 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>
    </div>
    
    <!-- Mensagens -->
    <div class="mt-1 space-y-1">
      <p v-if="hint && !error && !consultaError" class="text-xs text-gray-400">{{ hint }}</p>
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      <p v-if="consultaError" class="text-xs text-red-500">{{ consultaError }}</p>
      <p v-if="consultaSucesso" class="text-xs text-green-600 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ consultaSucesso }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  hint?: string
  error?: string
  autoConsulta?: boolean // Se deve consultar automaticamente quando CNPJ for válido
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '00.000.000/0000-00',
  disabled: false,
  required: false,
  autoConsulta: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'dados-encontrados': [dados: any]
}>()

const { consultarCNPJ, formatarCNPJ, validarCNPJ, loading: consultando, error: consultaError } = useCNPJ()

const id = computed(() => `cnpj-input-${Math.random().toString(36).substring(2, 11)}`)
const consultaSucesso = ref('')
const debounceTimer = ref(null)

// Valor formatado para exibição
const displayValue = computed(() => {
  return formatarCNPJ(props.modelValue)
})

// Verifica se CNPJ é válido
const cnpjValido = computed(() => {
  const cnpjLimpo = props.modelValue.replace(/[^\d]/g, '')
  return cnpjLimpo.length === 14 && validarCNPJ(cnpjLimpo)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let valor = target.value.replace(/[^\d]/g, '') // Remove tudo que não é número
  
  // Limita a 14 dígitos
  if (valor.length > 14) {
    valor = valor.substring(0, 14)
  }
  
  emit('update:modelValue', valor)
  
  // Limpar mensagens
  consultaSucesso.value = ''
  
  // Auto consulta quando CNPJ estiver completo e válido (com debounce)
  if (props.autoConsulta && valor.length === 14 && validarCNPJ(valor)) {
    // Debounce para evitar muitas consultas
    clearTimeout(debounceTimer.value)
    debounceTimer.value = setTimeout(() => {
      consultarDados()
    }, 1500) // Aguarda 1.5 segundos após parar de digitar
  }
}

const handleBlur = () => {
  // Pode adicionar validações adicionais aqui
}

const consultarDados = async () => {
  if (!cnpjValido.value) return
  
  consultaSucesso.value = ''
  
  try {
    const resultado = await consultarCNPJ(props.modelValue)
    
    if (resultado.success && resultado.data) {
      consultaSucesso.value = 'Dados da empresa encontrados!'
      emit('dados-encontrados', resultado.data)
    }
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error)
  }
}

// Limpar mensagem de sucesso quando CNPJ mudar
watch(() => props.modelValue, () => {
  consultaSucesso.value = ''
  // Limpar timer anterior se existir
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
}, { immediate: false })

// Limpar timer ao desmontar componente
onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>