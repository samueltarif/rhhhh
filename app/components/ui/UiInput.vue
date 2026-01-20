<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <span v-if="icon" class="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{{ icon }}</span>
      <input
        :id="id"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors',
          icon ? 'pl-12' : '',
          showPasswordToggle ? 'pr-14' : '',
          disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100',
          error ? 'border-red-300' : '',
          (uppercase && type !== 'password' && type !== 'email') ? 'uppercase' : ''
        ]"
        :style="(uppercase && type !== 'password' && type !== 'email') ? 'text-transform: uppercase;' : ''"
        @input="handleInput"
      />
      <button
        v-if="showPasswordToggle && type === 'password'"
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
        @click="passwordVisible = !passwordVisible"
        tabindex="-1"
      >
        <svg v-if="!passwordVisible" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
        </svg>
      </button>
    </div>
    <p v-if="hint && !error" class="text-xs text-gray-400 mt-1">{{ hint }}</p>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  icon?: string
  hint?: string
  error?: string
  showPasswordToggle?: boolean
  uppercase?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  showPasswordToggle: false,
  uppercase: true // Por padrão, todos os inputs serão em maiúsculas
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const passwordVisible = ref(false)

const computedType = computed(() => {
  if (props.type === 'password' && passwordVisible.value) return 'text'
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  // Aplicar maiúsculas apenas se habilitado E não for campo de senha ou email
  if (props.uppercase && props.type !== 'password' && props.type !== 'email') {
    value = value.toUpperCase()
  }
  
  // Converter para número se for input numérico
  if (props.type === 'number') {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      emit('update:modelValue', numValue)
    } else if (value === '') {
      emit('update:modelValue', '')
    } else {
      emit('update:modelValue', value)
    }
  } else {
    emit('update:modelValue', value)
  }
}</script>
