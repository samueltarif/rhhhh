<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="[
        'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors',
        disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500'
      ]"
      @change="handleChange"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option 
        v-for="opt in options" 
        :key="getOptionKey(opt)" 
        :value="getOptionValue(opt)"
        :selected="isSelected(opt)"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number | null
  label: string
}

interface Props {
  modelValue: string | number | null
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

// Funções auxiliares para o template
const getOptionKey = (opt: Option) => {
  if (opt.value === null) return 'null-option'
  return opt.value.toString()
}

const getOptionValue = (opt: Option) => {
  if (opt.value === null) return ''
  return opt.value.toString()
}

const isSelected = (opt: Option) => {
  if (opt.value === null) {
    return props.modelValue === null || props.modelValue === '' || props.modelValue === undefined
  }
  if (props.modelValue === null || props.modelValue === undefined) {
    return false
  }
  return opt.value === props.modelValue || opt.value.toString() === props.modelValue.toString()
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  // Encontrar a opção correspondente
  const selectedOption = props.options.find(opt => {
    if (opt.value === null && value === '') {
      return true
    }
    if (opt.value !== null && value !== '') {
      return opt.value.toString() === value
    }
    return false
  })
  
  if (selectedOption) {
    // Preservar o tipo original do valor
    emit('update:modelValue', selectedOption.value)
  } else if (value === '') {
    emit('update:modelValue', null)
  } else {
    // Manter como string por padrão
    emit('update:modelValue', value)
  }
}

const id = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)
</script>
