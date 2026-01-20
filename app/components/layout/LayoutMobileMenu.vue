<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="open" 
        class="lg:hidden fixed inset-0 z-50 bg-black/50"
        @click="$emit('close')"
      />
    </Transition>
    <Transition name="slide">
      <div 
        v-if="open"
        class="lg:hidden fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-white shadow-xl"
      >
        <div class="flex items-center justify-between p-4 border-b">
          <span class="text-lg font-bold text-gray-800">Menu</span>
          <button @click="$emit('close')" class="p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <nav class="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          <LayoutNavLink to="/dashboard" icon="home" @click="$emit('close')">Início</LayoutNavLink>
          <LayoutNavLink to="/meus-dados" icon="user" @click="$emit('close')">Meus Dados</LayoutNavLink>
          <LayoutNavLink v-if="!isAdmin" to="/holerites" icon="document" @click="$emit('close')">Meus Holerites</LayoutNavLink>

          <template v-if="isAdmin">
            <div class="pt-4 mt-4 border-t border-gray-200">
              <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Administração
              </p>
            </div>
            <LayoutNavLink to="/admin/funcionarios" icon="users" @click="$emit('close')">Funcionários</LayoutNavLink>
            <LayoutNavLink to="/admin/empresas" icon="office" @click="$emit('close')">Empresas</LayoutNavLink>
            <LayoutNavLink to="/admin/departamentos" icon="building" @click="$emit('close')">Departamentos</LayoutNavLink>
            <LayoutNavLink to="/admin/cargos" icon="briefcase" @click="$emit('close')">Cargos</LayoutNavLink>
            <LayoutNavLink to="/admin/holerites" icon="money" @click="$emit('close')">Holerites</LayoutNavLink>
          </template>
        </nav>

        <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
            <UiAvatar :name="user?.nome || ''" :avatar-type="user?.avatar" size="sm" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ user?.nome }}</p>
              <p class="text-xs text-gray-500 truncate">{{ obterNomeCargo(user?.cargo) }}</p>
            </div>
          </div>
          <button 
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sair
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

defineProps<{
  open: boolean
  user: any
  isAdmin: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { logout } = useAuth()

// Mapa para conversão de IDs para nomes de cargos
const cargosMap = ref<Record<string, string>>({})

// Função para obter nome do cargo
const obterNomeCargo = (id: string | number) => {
  if (!id) return 'Não informado'
  const idStr = id?.toString()
  return cargosMap.value[idStr] || 'Carregando...'
}

// Carregar mapa de cargos
const carregarCargos = async () => {
  try {
    const cargosRes: any = await $fetch('/api/cargos')
    if (cargosRes.success && cargosRes.data) {
      cargosRes.data.forEach((c: any) => {
        cargosMap.value[c.id.toString()] = c.nome
      })
    }
  } catch (error) {
    console.error('Erro ao carregar cargos:', error)
  }
}

const handleLogout = () => {
  emit('close')
  logout()
}

// Carregar cargos ao montar
onMounted(() => {
  carregarCargos()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
