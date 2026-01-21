<template>
  <UiModal 
    v-if="holerite"
    :model-value="true"
    title="Detalhes do Holerite"
    max-width="max-w-4xl"
    @update:model-value="$emit('close')"
  >
    <div class="space-y-6">
      <!-- Dados do Funcionário -->
      <div class="bg-gray-50 rounded-xl p-4">
        <p class="font-semibold text-gray-800">
          {{ holerite?.funcionario?.nome_completo || userName || 'Funcionário' }}
        </p>
        <p class="text-gray-500">
          {{ holerite?.funcionario?.cargo || userCargo || 'Cargo não informado' }} - 
          {{ holerite?.funcionario?.empresa || 'Empresa' }}
        </p>
        <p class="text-sm text-gray-400 mt-1">
          Período: {{ formatarPeriodo(holerite?.periodo_inicio, holerite?.periodo_fim) }}
        </p>
      </div>

    <!-- Proventos -->
    <div>
      <h3 class="text-lg font-bold text-green-600 mb-3">Proventos</h3>
      <div class="space-y-2">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Salário Base</span>
          <span class="font-semibold">{{ formatarMoeda(holerite.salario_base) }}</span>
        </div>
        
        <!-- Benefícios -->
        <div v-if="holerite.beneficios && holerite.beneficios.length > 0">
          <div 
            v-for="beneficio in holerite.beneficios" 
            :key="beneficio.tipo"
            class="flex justify-between py-2 border-b border-gray-100"
          >
            <span class="text-gray-600">{{ beneficio.tipo }}</span>
            <span class="font-semibold text-green-600">+ {{ formatarMoeda(beneficio.valor) }}</span>
          </div>
        </div>
        
        <div v-if="holerite.bonus" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Bônus</span>
          <span class="font-semibold">{{ formatarMoeda(holerite.bonus) }}</span>
        </div>
        <div v-if="holerite.horas_extras" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Horas Extras</span>
          <span class="font-semibold">{{ formatarMoeda(holerite.horas_extras) }}</span>
        </div>
      </div>
      <div class="flex justify-between py-2 mt-2 bg-green-50 px-3 rounded-lg">
        <span class="font-bold text-green-700">Total Proventos</span>
        <span class="font-bold text-green-700">{{ formatarMoeda(holerite.total_proventos) }}</span>
      </div>
    </div>

    <!-- Descontos -->
    <div>
      <h3 class="text-lg font-bold text-red-600 mb-3">Descontos</h3>
      <div class="space-y-2">
        <div v-if="holerite.inss" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">INSS</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.inss) }}</span>
        </div>
        <div v-if="holerite.irrf" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">IRRF</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.irrf) }}</span>
        </div>
        
        <!-- Descontos de Benefícios -->
        <template v-if="holerite.beneficios && holerite.beneficios.length > 0">
          <div 
            v-for="beneficio in holerite.beneficios.filter((b: any) => b.desconto && b.desconto > 0)" 
            :key="beneficio.tipo"
            class="flex justify-between py-2 border-b border-gray-100"
          >
            <span class="text-gray-600">{{ beneficio.tipo }} (Desconto)</span>
            <span class="font-semibold text-red-600">- {{ formatarMoeda(beneficio.desconto) }}</span>
          </div>
        </template>
        
        <!-- Descontos Personalizados -->
        <div v-if="holerite.descontos_personalizados && holerite.descontos_personalizados.length > 0">
          <div 
            v-for="desconto in holerite.descontos_personalizados" 
            :key="desconto.tipo"
            class="flex justify-between py-2 border-b border-gray-100"
          >
            <span class="text-gray-600">{{ desconto.tipo }}</span>
            <span class="font-semibold text-red-600">- {{ formatarMoeda(desconto.valor) }}</span>
          </div>
        </div>
        
        <div v-if="holerite.vale_transporte" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Vale Transporte</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.vale_transporte) }}</span>
        </div>
        
        <!-- Adiantamento -->
        <div v-if="holerite.adiantamento && holerite.adiantamento > 0" class="flex justify-between py-2 border-b border-gray-100 bg-yellow-50">
          <span class="text-gray-600 font-semibold">💰 Adiantamento Pago</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(holerite.adiantamento) }}</span>
        </div>
      </div>
      <div class="flex justify-between py-2 mt-2 bg-red-50 px-3 rounded-lg">
        <span class="font-bold text-red-700">Total Descontos</span>
        <span class="font-bold text-red-700">- {{ formatarMoeda(holerite.total_descontos) }}</span>
      </div>
    </div>

    <!-- Líquido -->
    <div class="bg-primary-50 rounded-xl p-4">
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-primary-800">Salário Líquido</span>
        <span class="text-2xl font-bold text-primary-700">{{ formatarMoeda(holerite.salario_liquido) }}</span>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <UiButton variant="secondary" @click="$emit('close')">
        Fechar
      </UiButton>
      <UiButton variant="ghost" @click="baixarHTML">
        📄 Baixar HTML
      </UiButton>
      <UiButton @click="baixarPDF">
        📄 Baixar PDF
      </UiButton>
    </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  holerite: any
  userName?: string
  userCargo?: string
  userDepartamento?: string
}>()

const emit = defineEmits<{
  close: []
  download: [holerite: any]
}>()

const formatarMoeda = (valor: number | undefined | null) => {
  if (!valor) return 'R$ 0,00'
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  } catch (error) {
    return 'R$ 0,00'
  }
}

const formatarPeriodo = (inicio: string | undefined, fim: string | undefined) => {
  if (!inicio || !fim) return 'Período não definido'
  try {
    const dataInicio = new Date(inicio).toLocaleDateString('pt-BR')
    const dataFim = new Date(fim).toLocaleDateString('pt-BR')
    return `${dataInicio} - ${dataFim}`
  } catch (error) {
    return 'Período inválido'
  }
}

const baixarHTML = async () => {
  try {
    // Fazer download do HTML
    const response = await fetch(`/api/holerites/${props.holerite.id}/html`)
    
    if (!response.ok) {
      throw new Error('Erro ao gerar HTML')
    }
    
    // Criar blob e fazer download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    // Nome do arquivo baseado no funcionário
    const nomeArquivo = props.holerite?.funcionario?.nome_completo?.replace(/\s+/g, '-') || 
                       props.userName?.replace(/\s+/g, '-') || 
                       'funcionario'
    a.download = `holerite-${nomeArquivo}.html`
    
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Erro ao baixar HTML:', error)
    alert('Erro ao baixar HTML do holerite')
  }
}

const baixarPDF = async () => {
  try {
    // Emitir evento para o componente pai
    emit('download', props.holerite)
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    alert('Erro ao baixar PDF do holerite')
  }
}
</script>
