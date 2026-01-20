<template>
  <UiModal :model-value="show" @update:model-value="$emit('close')" title="Escolher Avatar">
    <div class="space-y-6">
      <!-- Avatar Atual -->
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Avatar Atual</h3>
        <UiAvatar 
          :name="userName" 
          :avatar-type="currentAvatar" 
          size="xl" 
          class="mx-auto mb-2" 
        />
        <p class="text-sm text-gray-500">{{ userName }}</p>
      </div>

      <!-- Seletor de Avatares -->
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Escolha um Avatar</h3>
        <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
          <button
            v-for="avatar in avatarOptions"
            :key="avatar.id"
            @click="selectAvatar(avatar.id)"
            :class="[
              'p-2 rounded-xl border-2 transition-all hover:scale-105',
              selectedAvatar === avatar.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="text-4xl">{{ avatar.emoji }}</div>
            <p class="text-xs text-gray-600 mt-1">{{ avatar.name }}</p>
          </button>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <UiButton variant="ghost" @click="$emit('close')">
          Cancelar
        </UiButton>
        <UiButton @click="saveAvatar" :disabled="saving">
          {{ saving ? 'Salvando...' : 'Salvar Avatar' }}
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  userName: string
  currentAvatar?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [avatarId: string]
}>()

const selectedAvatar = ref(props.currentAvatar || 'person-1')
const saving = ref(false)

// Lista de avatares disponíveis (específicos para os cargos da empresa)
const avatarOptions = [
  // Avatares básicos
  { id: 'person-1', name: 'Pessoa Padrão', emoji: '👤' },
  
  // GERENTE - Responsável por Fiscal, Financeiro, Comercial, RH e Administrativo
  { id: 'gerente-1', name: 'Gerente', emoji: '👨‍💼' },
  { id: 'gerente-2', name: 'Gerente', emoji: '👩‍💼' },
  { id: 'gerente-3', name: 'Gerente Moreno', emoji: '👨🏽‍💼' },
  { id: 'gerente-4', name: 'Gerente Morena', emoji: '👩🏽‍💼' },
  
  // ASSISTENTE COMERCIAL
  { id: 'ass-comercial-1', name: 'Assistente Comercial', emoji: '🧑‍💼' },
  { id: 'ass-comercial-2', name: 'Assistente Comercial', emoji: '👨‍💼' },
  { id: 'ass-comercial-3', name: 'Assistente Comercial', emoji: '👩‍💼' },
  { id: 'ass-comercial-4', name: 'Assistente Comercial Moreno', emoji: '👨🏽‍💼' },
  { id: 'ass-comercial-5', name: 'Assistente Comercial Morena', emoji: '👩🏽‍💼' },
  
  // REPRESENTANTE COMERCIAL
  { id: 'rep-comercial-1', name: 'Representante Comercial', emoji: '🤝' },
  { id: 'rep-comercial-2', name: 'Representante Comercial', emoji: '👔' },
  { id: 'rep-comercial-3', name: 'Representante Comercial', emoji: '💼' },
  
  // AUXILIAR COMERCIAL
  { id: 'aux-comercial-1', name: 'Auxiliar Comercial', emoji: '📊' },
  { id: 'aux-comercial-2', name: 'Auxiliar Comercial', emoji: '📈' },
  { id: 'aux-comercial-3', name: 'Auxiliar Comercial', emoji: '💹' },
  
  // ASSISTENTE DE PRODUÇÃO
  { id: 'ass-producao-1', name: 'Assistente de Produção', emoji: '👷‍♂️' },
  { id: 'ass-producao-2', name: 'Assistente de Produção', emoji: '👷‍♀️' },
  { id: 'ass-producao-3', name: 'Assistente de Produção Moreno', emoji: '👷🏽‍♂️' },
  { id: 'ass-producao-4', name: 'Assistente de Produção Morena', emoji: '👷🏽‍♀️' },
  
  // AUXILIAR DE PRODUÇÃO
  { id: 'aux-producao-1', name: 'Auxiliar de Produção', emoji: '🔧' },
  { id: 'aux-producao-2', name: 'Auxiliar de Produção', emoji: '⚙️' },
  { id: 'aux-producao-3', name: 'Auxiliar de Produção', emoji: '🛠️' },
  
  // SOLDADOR
  { id: 'soldador-1', name: 'Soldador', emoji: '👨‍🔧' },
  { id: 'soldador-2', name: 'Soldador', emoji: '👩‍🔧' },
  { id: 'soldador-3', name: 'Soldador Moreno', emoji: '👨🏽‍🔧' },
  { id: 'soldador-4', name: 'Soldador Morena', emoji: '👩🏽‍🔧' },
  { id: 'soldador-5', name: 'Soldador', emoji: '🔥' },
  { id: 'soldador-6', name: 'Soldador', emoji: '⚡' },
  
  // AUXILIAR ADMINISTRATIVO
  { id: 'aux-admin-1', name: 'Auxiliar Administrativo', emoji: '📋' },
  { id: 'aux-admin-2', name: 'Auxiliar Administrativo', emoji: '📝' },
  { id: 'aux-admin-3', name: 'Auxiliar Administrativo', emoji: '🗂️' },
  { id: 'aux-admin-4', name: 'Auxiliar Administrativo', emoji: '📄' },
  
  // LÍDER DE ESTOQUE
  { id: 'lider-estoque-1', name: 'Líder de Estoque', emoji: '📦' },
  { id: 'lider-estoque-2', name: 'Líder de Estoque', emoji: '🏪' },
  { id: 'lider-estoque-3', name: 'Líder de Estoque Moreno', emoji: '👨🏽‍💼' },
  { id: 'lider-estoque-4', name: 'Líder de Estoque Morena', emoji: '👩🏽‍💼' },
  
  // AUXILIAR DE ESTOQUE
  { id: 'aux-estoque-1', name: 'Auxiliar de Estoque', emoji: '📋' },
  { id: 'aux-estoque-2', name: 'Auxiliar de Estoque', emoji: '📊' },
  { id: 'aux-estoque-3', name: 'Auxiliar de Estoque', emoji: '🏷️' },
  { id: 'aux-estoque-4', name: 'Auxiliar de Estoque', emoji: '📈' },
  
  // AUXILIAR DE EXPEDIÇÃO
  { id: 'aux-expedicao-1', name: 'Auxiliar de Expedição', emoji: '🚚' },
  { id: 'aux-expedicao-2', name: 'Auxiliar de Expedição', emoji: '📦' },
  { id: 'aux-expedicao-3', name: 'Auxiliar de Expedição', emoji: '🚛' },
  { id: 'aux-expedicao-4', name: 'Auxiliar de Expedição', emoji: '📮' },
  
  // AUXILIAR DE SERVIÇOS GERAIS
  { id: 'aux-servicos-1', name: 'Auxiliar de Serviços Gerais', emoji: '🧹' },
  { id: 'aux-servicos-2', name: 'Auxiliar de Serviços Gerais', emoji: '🧽' },
  { id: 'aux-servicos-3', name: 'Auxiliar de Serviços Gerais', emoji: '🧴' },
  { id: 'aux-servicos-4', name: 'Auxiliar de Serviços Gerais', emoji: '🗑️' },
  
  // TI (Técnico de Informática)
  { id: 'ti-1', name: 'Técnico de TI', emoji: '👨‍💻' },
  { id: 'ti-2', name: 'Técnico de TI', emoji: '👩‍💻' },
  { id: 'ti-3', name: 'Técnico de TI Moreno', emoji: '👨🏽‍💻' },
  { id: 'ti-4', name: 'Técnico de TI Morena', emoji: '👩🏽‍💻' },
  { id: 'ti-5', name: 'Técnico de TI', emoji: '💻' },
  { id: 'ti-6', name: 'Técnico de TI', emoji: '🖥️' }
]

const selectAvatar = (avatarId: string) => {
  selectedAvatar.value = avatarId
}

const saveAvatar = async () => {
  saving.value = true
  try {
    emit('save', selectedAvatar.value)
  } finally {
    saving.value = false
  }
}

// Atualizar seleção quando o avatar atual mudar
watch(() => props.currentAvatar, (newAvatar) => {
  if (newAvatar) {
    selectedAvatar.value = newAvatar
  }
})
</script>