<template>
  <UiInput
    :model-value="modelValue"
    type="password"
    :uppercase="false"
    show-password-toggle
    :label="label"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :error="error"
    :hint="hint"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>