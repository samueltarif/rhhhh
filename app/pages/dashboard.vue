<template>
  <div>
    <!-- Cabeçalho da Página -->
    <div class="mb-8">
      <h1 class="text-3xl lg:text-4xl font-bold text-gray-800">
        {{ obterSaudacao() }} {{ user?.nome?.split(' ')[0] }}!
      </h1>
      <p class="text-lg text-gray-500 mt-2">
        Bem-vindo ao Sistema de RH. Aqui você encontra tudo sobre sua vida profissional.
      </p>
    </div>

    <!-- Cards de Atalho -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard 
        to="/meus-dados"
        title="Meus Dados"
        description="Veja e atualize suas informações pessoais"
        color="blue"
        icon-path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />

      <DashboardCard 
        v-if="!isAdmin"
        to="/holerites"
        title="Meus Holerites"
        description="Acesse seus contracheques e baixe em PDF"
        color="green"
        icon-path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />

      <DashboardCard 
        :title="empresaUsuario ? (empresaUsuario.nome_fantasia || empresaUsuario.nome) : 'Minha Empresa'"
        :description="empresaUsuario ? `CNPJ: ${empresaUsuario.cnpj || 'Não informado'}` : 'Aguardando cadastro'"
        color="purple"
        icon-path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      >
        <UiBadge 
          :variant="empresaUsuario ? 'success' : 'warning'" 
          class="mt-3"
        >
          {{ empresaUsuario ? '✓ Vinculado' : '⏳ Pendente' }}
        </UiBadge>
      </DashboardCard>
    </div>

    <!-- Informações do Funcionário -->
    <UiCard title="Suas Informações" icon="ℹ️" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Nome Completo</p>
            <p class="text-lg font-semibold text-gray-800">{{ dadosCompletos?.nome_completo || user?.nome }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Cargo</p>
            <p class="text-lg font-semibold text-gray-800">{{ obterNomeCargo(dadosCompletos?.cargo_id) }}</p>
          </div>
          <div v-if="empresaUsuario">
            <p class="text-sm text-gray-500 mb-1">Empresa</p>
            <p class="text-lg font-semibold text-gray-800">{{ empresaUsuario.nome_fantasia || empresaUsuario.nome }}</p>
            <p class="text-sm text-gray-500">{{ empresaUsuario.nome }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Departamento</p>
            <p class="text-lg font-semibold text-gray-800">{{ obterNomeDepartamento(dadosCompletos?.departamento_id) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">Email</p>
            <p class="text-lg font-semibold text-gray-800">{{ dadosCompletos?.email || user?.email }}</p>
          </div>
          <div v-if="empresaUsuario?.cnpj">
            <p class="text-sm text-gray-500 mb-1">CNPJ da Empresa</p>
            <p class="text-lg font-semibold text-gray-800">{{ empresaUsuario.cnpj }}</p>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Cards Admin -->
    <template v-if="isAdmin">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        🛡️ Área do Administrador
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard 
          to="/admin/funcionarios"
          :value="loading ? '...' : stats.totalFuncionarios.toString()"
          label="Funcionários"
          color="blue"
          icon-path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
        <DashboardStatCard 
          to="/admin/departamentos"
          :value="loading ? '...' : stats.totalDepartamentos.toString()"
          label="Departamentos"
          color="purple"
          icon-path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
        <DashboardStatCard 
          to="/admin/holerites"
          :value="loading ? '...' : formatarMoeda(stats.folhaMensal)"
          label="Folha Mensal"
          color="green"
          icon-path="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <svg class="w-10 h-10 mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/>
          </svg>
          <p class="text-3xl font-bold">{{ loading ? '...' : stats.totalAniversariantes }}</p>
          <p class="text-white/80">Aniversariantes</p>
        </div>
      </div>

      <!-- Aniversariantes -->
      <UiCard title="🎂 Aniversariantes do Mês">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Carregando...</p>
        </div>
        
        <div v-else-if="aniversariantes.length === 0" class="text-center py-8 text-gray-500">
          Nenhum aniversariante este mês
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="aniversariante in aniversariantes" 
            :key="aniversariante.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-orange-600 font-bold text-lg">{{ aniversariante.dia }}</span>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ aniversariante.nome_completo }}</h4>
              <p class="text-sm text-gray-600">{{ aniversariante.cargo }} - {{ aniversariante.departamento }}</p>
            </div>
            <div class="text-2xl">🎂</div>
          </div>
        </div>
      </UiCard>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, isAdmin } = useAuth()

// Estados
const stats = ref({
  totalFuncionarios: 0,
  totalDepartamentos: 0,
  folhaMensal: 0,
  totalAniversariantes: 0
})

const aniversariantes = ref<any[]>([])
const loading = ref(true)
const dadosCompletos = ref<any>(null)
const empresaUsuario = ref<any>(null)

// Mapas para conversão de IDs para nomes
const cargosMap = ref<Record<string, string>>({})
const departamentosMap = ref<Record<string, string>>({})

// Função para obter saudação baseada no horário de Brasília/SP
const obterSaudacao = () => {
  const agora = new Date()
  // Converter para horário de Brasília (UTC-3)
  const horarioBrasilia = new Date(agora.getTime() - (3 * 60 * 60 * 1000))
  const hora = horarioBrasilia.getHours()
  
  if (hora >= 5 && hora < 12) {
    return 'Bom dia'
  } else if (hora >= 12 && hora < 18) {
    return 'Boa tarde'
  } else {
    return 'Boa noite'
  }
}

// Funções para obter nomes
const obterNomeCargo = (id: string | number) => {
  const idStr = id?.toString()
  return cargosMap.value[idStr] || idStr || 'Não informado'
}

const obterNomeDepartamento = (id: string | number) => {
  const idStr = id?.toString()
  return departamentosMap.value[idStr] || idStr || 'Não informado'
}

// Carregar mapas de conversão
const carregarMapas = async () => {
  try {
    // Carregar cargos
    const cargosRes: any = await $fetch('/api/cargos')
    if (cargosRes.success && cargosRes.data) {
      cargosRes.data.forEach((c: any) => {
        cargosMap.value[c.id.toString()] = c.nome
      })
    }

    // Carregar departamentos
    const deptosRes: any = await $fetch('/api/departamentos')
    if (deptosRes.success && deptosRes.data) {
      deptosRes.data.forEach((d: any) => {
        departamentosMap.value[d.id.toString()] = d.nome
      })
    }
  } catch (error) {
    console.error('Erro ao carregar mapas:', error)
  }
}

// Buscar dados do dashboard
const carregarDados = async () => {
  try {
    loading.value = true
    
    // Carregar mapas de conversão primeiro
    await carregarMapas()
    
    // Buscar dados completos do usuário (incluindo empresa)
    if (user.value?.id) {
      try {
        const dadosResponse: any = await $fetch(`/api/funcionarios/meus-dados?userId=${user.value.id}`)
        if (dadosResponse.success) {
          dadosCompletos.value = dadosResponse.data
          empresaUsuario.value = dadosResponse.data.empresas
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      }
    }
    
    // Buscar estatísticas apenas para admin
    if (isAdmin.value) {
      const [statsData, aniversariantesData] = await Promise.all([
        $fetch('/api/dashboard/stats'),
        $fetch('/api/dashboard/aniversariantes')
      ])

      stats.value = statsData as any
      aniversariantes.value = aniversariantesData as any[]
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  } finally {
    loading.value = false
  }
}

// Formatar moeda
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Carregar dados ao montar
onMounted(() => {
  carregarDados()
})
</script>
