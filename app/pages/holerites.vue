<template>
  <div>


    <!-- Filtros -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">🔍 Filtrar Holerites</h3>
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mês</label>
          <select v-model="filtroMes" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Todos os meses</option>
            <option v-for="mes in mesesOptions" :key="mes.value" :value="mes.value">{{ mes.label }}</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <select v-model="filtroAno" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Todos os anos</option>
            <option v-for="ano in anosOptions" :key="ano.value" :value="ano.value">{{ ano.label }}</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select v-model="filtroTipo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Todos os tipos</option>
            <option value="adiantamento">💰 Adiantamento</option>
            <option value="folha_mensal">📊 Folha Mensal</option>
          </select>
        </div>
        <div class="flex items-end">
          <UiButton variant="secondary" @click="limparFiltros">Limpar</UiButton>
        </div>
      </div>
    </div>

    <!-- Informações sobre Holerites Automáticos -->
    <div v-if="temSalarioQuinzenal" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div class="flex items-start gap-3">
        <span class="text-2xl">🤖</span>
        <div>
          <h3 class="font-semibold text-blue-800 mb-2">Holerites Automáticos</h3>
          <div class="text-sm text-blue-700 space-y-1">
            <p>• <strong>2ª Quinzena:</strong> Disponibilizado automaticamente 2 dias antes do dia 20</p>
            <p>• <strong>1ª Quinzena:</strong> Liberado manualmente pelo RH no início do mês</p>
            <p>• <strong>Fins de semana/Feriados:</strong> Antecipado para o último dia útil anterior</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Holerites -->
    <div v-if="!user" class="text-center py-12">
      <p class="text-red-600">❌ Erro: Usuário não autenticado. Faça login novamente.</p>
    </div>
    
    <div v-else-if="carregando" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Carregando holerites...</p>
    </div>

    <div v-else class="space-y-4">
      <template v-for="holerite in holeritesFiltrados" :key="holerite?.id || Math.random()">
        <HoleriteCard 
          v-if="holerite && holerite.id"
          :holerite="holerite"
          @view="visualizarHolerite"
          @download="baixarPDF"
        />
      </template>

      <UiEmptyState 
        v-if="holeritesFiltrados.length === 0"
        title="Nenhum holerite encontrado"
        description="Tente ajustar os filtros ou aguarde a geração do próximo holerite."
      />
    </div>

    <!-- Modal de Visualização -->
    <HoleriteModal 
      v-if="holeriteVisualizado"
      :holerite="holeriteVisualizado"
      :user-name="user?.nome || ''"
      :user-cargo="user?.cargo || ''"
      :user-departamento="user?.departamento || ''"
      @close="holeriteVisualizado = null"
      @download="baixarPDF"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

// Imports
import HoleriteModal from '~/components/holerites/HoleriteModal.vue'
import HoleriteCard from '~/components/holerites/HoleriteCard.vue'

const { user } = useAuth()

// Redirecionar admin para página de gestão de holerites
if (process.client && user.value?.tipo === 'admin') {
  await navigateTo('/admin/holerites')
}
const { 
  formatarData, 
  calcularDataDisponibilizacaoHolerite20,
  calcularPeriodoQuinzenal,
  calcularValorQuinzenal,
  isAdiantamento,
  getTipoHolerite
} = useHolerites()

const filtroMes = ref('')
const filtroAno = ref('')
const filtroTipo = ref('')
const holeriteVisualizado = ref<any>(null)
const holerites = ref<any[]>([])
const carregando = ref(true)

// Verificar se o usuário tem salário quinzenal
const temSalarioQuinzenal = computed(() => {
  return (user.value as any)?.tipo_salario === 'quinzenal'
})

const mesesOptions = [
  { value: '01', label: 'Janeiro' }, { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' }, { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' }, { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }
]

const anosOptions = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' }
]

const tipoOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: '1quinzena', label: '1ª Quinzena' },
  { value: '2quinzena', label: '2ª Quinzena' }
]

// Buscar holerites reais do banco de dados
const carregarHolerites = async () => {
  carregando.value = true
  try {
    // Aguardar o user estar disponível
    if (!user.value) {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (!user.value) {
        holerites.value = []
        carregando.value = false
        return
      }
    }
    
    // Pegar o ID do funcionário do usuário logado
    const funcionarioId = (user.value as any)?.id
    
    if (!funcionarioId) {
      holerites.value = []
      carregando.value = false
      return
    }
    
    const data = await $fetch('/api/holerites/meus-holerites', {
      query: { funcionarioId }
    })
    
    // Verificar se data é um array válido
    if (!Array.isArray(data)) {
      holerites.value = []
      carregando.value = false
      return
    }
    
    // Formatar holerites para o formato esperado pelo componente
    holerites.value = (data as any[]).map((h, index) => {
      // Verificar se h é um objeto válido
      if (!h || typeof h !== 'object') {
        return null
      }
      
      const periodoInicio = h.periodo_inicio ? new Date(h.periodo_inicio) : new Date()
      const periodoFim = h.periodo_fim ? new Date(h.periodo_fim) : new Date()
      const mes = String(periodoInicio.getMonth() + 1).padStart(2, '0')
      const ano = String(periodoInicio.getFullYear())
      
      // Determinar tipo e quinzena
      let tipo = 'Mensal'
      let quinzena = null
      let referencia = `Holerite ${periodoInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
      
      // Verificar se é quinzenal baseado no período
      const diaInicio = periodoInicio.getDate()
      const diaFim = periodoFim.getDate()
      
      if (diaInicio === 1 && diaFim <= 15) {
        tipo = 'Quinzenal'
        quinzena = 1
        referencia += ' - 1ª Quinzena'
      } else if (diaInicio === 16) {
        tipo = 'Quinzenal'
        quinzena = 2
        referencia += ' - 2ª Quinzena'
      }
      
      const holeriteFormatado = {
        id: h.id || 0,
        referencia,
        competencia: `${mes}/${ano}`,
        mes,
        ano,
        quinzena,
        tipo,
        status: h.status || 'Pago',
        salarioBase: h.salario_base || 0,
        bonus: h.bonus || 0,
        totalProventos: h.total_proventos || 0,
        inss: h.inss || 0,
        irrf: h.irrf || 0,
        valeTransporte: h.vale_transporte || 0,
        totalDescontos: h.total_descontos || 0,
        liquido: h.salario_liquido || 0,
        periodoInicio: periodoInicio,
        periodoFim: periodoFim,
        dataDisponibilizacao: h.data_pagamento ? new Date(h.data_pagamento) : null,
        // Campos adicionais para edição
        horas_trabalhadas: h.horas_trabalhadas || null,
        horas_extras: h.horas_extras || 0,
        adicional_noturno: h.adicional_noturno || 0,
        adicional_periculosidade: h.adicional_periculosidade || 0,
        adicional_insalubridade: h.adicional_insalubridade || 0,
        comissoes: h.comissoes || 0,
        vale_refeicao_desconto: h.vale_refeicao_desconto || 0,
        plano_saude: h.plano_saude || 0,
        plano_odontologico: h.plano_odontologico || 0,
        adiantamento: h.adiantamento || 0,
        faltas: h.faltas || 0,
        data_pagamento: h.data_pagamento || null,
        observacoes: h.observacoes || ''
      }
      
      return holeriteFormatado
    }).filter(h => h !== null) // Remover holerites inválidos
    
  } catch (error) {
    console.error('Erro ao carregar holerites:', error)
    // Se não houver holerites, manter array vazio
    holerites.value = []
  } finally {
    carregando.value = false
  }
}

// Carregar holerites ao montar o componente
onMounted(() => {
  carregarHolerites()
})

const holeritesFiltrados = computed(() => {
  return holerites.value.filter(h => {
    if (filtroMes.value && h.mes !== filtroMes.value) return false
    if (filtroAno.value && h.ano !== filtroAno.value) return false
    if (filtroTipo.value) {
      const tipoHolerite = getTipoHolerite(h)
      if (filtroTipo.value === 'adiantamento' && tipoHolerite !== 'adiantamento') return false
      if (filtroTipo.value === 'folha_mensal' && tipoHolerite !== 'folha_mensal') return false
    }
    return true
  })
})

const limparFiltros = () => { 
  filtroMes.value = ''
  filtroAno.value = ''
  filtroTipo.value = ''
}

const visualizarHolerite = async (holerite: any) => { 
  // Garantir que sempre temos dados básicos do funcionário
  let dadosFuncionario = {
    nome_completo: user.value?.nome || 'Funcionário',
    cargo: user.value?.cargo || 'Não definido',
    empresa: 'Empresa'
  }
  
  // Buscar nome da empresa
  try {
    if (user.value) {
      const funcionarioCompleto: any = await $fetch(`/api/funcionarios/${user.value.id}`)
      
      // Atualizar dados do funcionário com informações completas
      dadosFuncionario = {
        nome_completo: funcionarioCompleto.nome_completo || user.value?.nome || 'Funcionário',
        cargo: funcionarioCompleto.cargo || user.value?.cargo || 'Não definido',
        empresa: 'Empresa'
      }
      
      if (funcionarioCompleto.empresa_id) {
        const empresaResponse: any = await $fetch(`/api/empresas/${funcionarioCompleto.empresa_id}`)
        const empresa = empresaResponse.data || empresaResponse
        dadosFuncionario.empresa = empresa.nome_fantasia || empresa.nome || 'Empresa'
      }
    }
  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    // Manter dados padrão em caso de erro
  }
  
  // Adicionar dados do funcionário ao holerite
  const holeriteCompleto = {
    ...holerite,
    funcionario: dadosFuncionario,
    // Garantir que as datas e valores estejam no formato correto
    periodo_inicio: holerite.periodoInicio,
    periodo_fim: holerite.periodoFim,
    salario_base: holerite.salarioBase,
    salario_liquido: holerite.liquido, // Corrigir o campo
    total_proventos: holerite.totalProventos,
    total_descontos: holerite.totalDescontos
  }
  
  holeriteVisualizado.value = holeriteCompleto
}

const baixarPDF = (holerite: any) => { 
  // Abrir holerite em nova aba
  window.open(`/api/holerites/${holerite.id}/pdf`, '_blank')
}
</script>
