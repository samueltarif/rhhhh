<template>
  <div v-if="holerite" class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <!-- Informações Principais -->
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-3">
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
              getStatusColor(holerite!.status).bg
            ]"
          >
            {{ getStatusIcon(holerite!.status) }}
          </div>
          
          <div>
            <h3 class="text-lg font-bold text-gray-800">
              {{ holerite.referencia }}
            </h3>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>{{ holerite.competencia }}</span>
              <span v-if="holerite.quinzena" class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {{ holerite.quinzena }}ª Quinzena
              </span>
              <span 
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(holerite!.status).badge
                ]"
              >
                {{ holerite!.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Valores -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <div class="text-xs text-gray-500 mb-1">Proventos</div>
            <div class="text-sm font-semibold text-green-600">
              R$ {{ formatarMoeda(holerite.totalProventos) }}
            </div>
          </div>
          
          <div>
            <div class="text-xs text-gray-500 mb-1">Descontos</div>
            <div class="text-sm font-semibold text-red-600">
              R$ {{ formatarMoeda(holerite.totalDescontos) }}
            </div>
          </div>
          
          <div>
            <div class="text-xs text-gray-500 mb-1">Líquido</div>
            <div class="text-lg font-bold text-blue-600">
              R$ {{ formatarMoeda(holerite.liquido) }}
            </div>
          </div>
          
          <div v-if="holerite.dataDisponibilizacao">
            <div class="text-xs text-gray-500 mb-1">Disponível em</div>
            <div class="text-sm font-medium text-gray-700">
              {{ holerite.dataDisponibilizacao ? formatarData(holerite.dataDisponibilizacao) : 'N/A' }}
            </div>
          </div>
        </div>

        <!-- Período Quinzenal -->
        <div v-if="holerite.periodoInicio && holerite.periodoFim" class="mt-3 p-3 bg-blue-50 rounded-lg">
          <div class="text-xs text-blue-700 font-medium mb-1">📅 Período de Referência</div>
          <div class="text-sm text-blue-800">
            {{ holerite.periodoInicio ? formatarData(holerite.periodoInicio) : 'N/A' }} até {{ holerite.periodoFim ? formatarData(holerite.periodoFim) : 'N/A' }}
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex flex-col gap-2 ml-4">
        <UiButton 
          variant="primary" 
          size="sm"
          @click="$emit('view', holerite)"
          :disabled="!isDisponivel"
        >
          👁️ Visualizar
        </UiButton>
        
        <UiButton 
          variant="secondary" 
          size="sm"
          @click="$emit('download', holerite)"
          :disabled="!isDisponivel"
        >
          📥 Baixar PDF
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  holerite: {
    id: number
    referencia: string
    competencia: string
    mes: string
    ano: string
    quinzena?: 1 | 2
    tipo: string
    status: string
    salarioBase: number
    bonus?: number
    totalProventos: number
    totalDescontos: number
    liquido: number
    dataDisponibilizacao?: Date
    periodoInicio?: Date
    periodoFim?: Date
  }
}

const props = defineProps<Props>()

defineEmits<{
  view: [holerite: any]
  download: [holerite: any]
}>()

const { formatarData } = useHolerites()

// Verificar se o holerite está disponível
const isDisponivel = computed(() => {
  // Se o holerite está visível no perfil do funcionário, sempre está disponível
  // A lógica de disponibilização já foi feita pelo admin
  return true
})

// Função para formatar moeda
const formatarMoeda = (valor: number): string => {
  return valor?.toFixed(2).replace('.', ',') || '0,00'
}

// Função para obter cor do status
const getStatusColor = (status?: string) => {
  const colors: Record<string, { bg: string; badge: string }> = {
    'Pago': {
      bg: 'bg-green-100',
      badge: 'bg-green-100 text-green-800'
    },
    'Pendente': {
      bg: 'bg-yellow-100',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    'Programado': {
      bg: 'bg-blue-100',
      badge: 'bg-blue-100 text-blue-800'
    },
    'Cancelado': {
      bg: 'bg-red-100',
      badge: 'bg-red-100 text-red-800'
    }
  }
  
  return colors[status || 'Pendente'] || colors['Pendente']
}

// Função para obter ícone do status
const getStatusIcon = (status?: string): string => {
  const icons: Record<string, string> = {
    'Pago': '✅',
    'Pendente': '⏳',
    'Programado': '📅',
    'Cancelado': '❌'
  }
  
  return icons[status || 'Pendente'] || '📄'
}
</script>
