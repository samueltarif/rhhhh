<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        🎁 Benefícios e Descontos
        <UiBadge variant="info">{{ totalBeneficios }} benefícios ativos</UiBadge>
      </h3>
      <p class="text-gray-600 mt-1">Resumo dos benefícios e descontos aplicados</p>
    </div>

    <!-- Benefícios Ativos -->
    <div v-if="beneficiosAtivos.length > 0" class="space-y-4">
      <h4 class="text-lg font-semibold text-gray-800">✅ Benefícios Ativos</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Vale Transporte -->
        <div v-if="funcionario.beneficios?.vale_transporte?.ativo" class="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🚌</span>
            <div>
              <h5 class="font-semibold text-gray-800">Vale Transporte</h5>
              <p class="text-sm text-gray-600">R$ {{ formatarMoeda(funcionario.beneficios.vale_transporte.valor) }} por dia</p>
            </div>
          </div>
          
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span>Valor mensal:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(funcionario.beneficios.vale_transporte.valor * 22) }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Desconto:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(calcularDescontoVT()) }}</span>
            </div>
          </div>
        </div>

        <!-- Cesta Básica -->
        <div v-if="funcionario.beneficios?.cesta_basica?.ativo" class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🛒</span>
            <div>
              <h5 class="font-semibold text-gray-800">Cesta Básica</h5>
              <p class="text-sm text-gray-600">R$ {{ formatarMoeda(funcionario.beneficios.cesta_basica.valor) }} por dia</p>
            </div>
          </div>
          
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span>Valor mensal:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(funcionario.beneficios.cesta_basica.valor * 22) }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Desconto:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(calcularDescontoCB()) }}</span>
            </div>
          </div>
        </div>

        <!-- Plano de Saúde -->
        <div v-if="funcionario.beneficios?.plano_saude?.ativo" class="p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🏥</span>
            <div>
              <h5 class="font-semibold text-gray-800">Plano de Saúde</h5>
              <p class="text-sm text-gray-600">{{ funcionario.beneficios.plano_saude.plano }} - {{ funcionario.beneficios.plano_saude.dependentes }} dependentes</p>
            </div>
          </div>
          
          <div class="text-sm space-y-1">
            <div class="flex justify-between text-green-600">
              <span>Pago pela empresa:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(funcionario.beneficios.plano_saude.valor_empresa) }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Desconto funcionário:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(funcionario.beneficios.plano_saude.valor_funcionario) }}</span>
            </div>
          </div>
        </div>

        <!-- Plano Odontológico -->
        <div v-if="funcionario.beneficios?.plano_odonto?.ativo" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">🦷</span>
            <div>
              <h5 class="font-semibold text-gray-800">Plano Odontológico</h5>
              <p class="text-sm text-gray-600">{{ funcionario.beneficios.plano_odonto.dependentes }} dependentes</p>
            </div>
          </div>
          
          <div class="text-sm">
            <div class="flex justify-between text-red-600">
              <span>Desconto mensal:</span>
              <span class="font-semibold">R$ {{ formatarMoeda(funcionario.beneficios.plano_odonto.valor_funcionario) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Descontos Personalizados -->
    <div v-if="funcionario.descontos_personalizados?.length > 0" class="space-y-4">
      <h4 class="text-lg font-semibold text-gray-800">📉 Descontos Personalizados</h4>
      
      <div class="space-y-3">
        <div 
          v-for="(desconto, index) in funcionario.descontos_personalizados" 
          :key="index"
          class="p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div class="flex items-center justify-between">
            <div>
              <h5 class="font-semibold text-gray-800">{{ desconto.descricao }}</h5>
              <p class="text-sm text-gray-600">
                {{ desconto.recorrente ? 'Desconto recorrente' : `${desconto.parcelas} parcelas` }}
              </p>
            </div>
            
            <div class="text-right">
              <div class="text-lg font-bold text-red-600">
                <span v-if="desconto.tipo === 'percentual'">
                  {{ desconto.percentual }}%
                </span>
                <span v-else>
                  R$ {{ formatarMoeda(desconto.valor) }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                {{ desconto.tipo === 'percentual' ? 'do salário' : 'valor fixo' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumo Financeiro -->
    <div class="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
      <h4 class="text-lg font-bold text-gray-800 mb-4">💰 Resumo Financeiro</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-xl font-bold text-gray-800">
            R$ {{ formatarMoeda(parseFloat(funcionario.salario_base) || 0) }}
          </div>
          <div class="text-sm text-gray-600">Salário Base</div>
        </div>
        
        <div>
          <div class="text-xl font-bold text-green-600">
            R$ {{ formatarMoeda(calcularTotalBeneficios()) }}
          </div>
          <div class="text-sm text-gray-600">Total Benefícios</div>
        </div>
        
        <div>
          <div class="text-xl font-bold text-red-600">
            R$ {{ formatarMoeda(calcularTotalDescontos()) }}
          </div>
          <div class="text-sm text-gray-600">Total Descontos</div>
        </div>
        
        <div>
          <div class="text-xl font-bold text-blue-600">
            R$ {{ formatarMoeda(calcularSalarioLiquido()) }}
          </div>
          <div class="text-sm text-gray-600">Salário Líquido</div>
        </div>
      </div>
    </div>

    <!-- Observação -->
    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
      <div class="flex items-start gap-2">
        <span class="text-yellow-500">ℹ️</span>
        <div class="text-sm text-yellow-800">
          <p class="font-semibold mb-1">Observações importantes:</p>
          <ul class="space-y-1">
            <li>• Os valores são calculados considerando 22 dias úteis por mês</li>
            <li>• Descontos percentuais são aplicados sobre o salário base</li>
            <li>• Valores podem variar conforme faltas e horas extras</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  funcionario: any
}

const props = defineProps<Props>()

// Benefícios ativos
const beneficiosAtivos = computed(() => {
  const ativos = []
  
  if (props.funcionario.beneficios?.vale_transporte?.ativo) ativos.push('Vale Transporte')
  if (props.funcionario.beneficios?.cesta_basica?.ativo) ativos.push('Cesta Básica')
  if (props.funcionario.beneficios?.plano_saude?.ativo) ativos.push('Plano de Saúde')
  if (props.funcionario.beneficios?.plano_odonto?.ativo) ativos.push('Plano Odontológico')
  
  return ativos
})

const totalBeneficios = computed(() => {
  return beneficiosAtivos.value.length + (props.funcionario.descontos_personalizados?.length || 0)
})

// Funções de cálculo
const formatarMoeda = (valor: number): string => {
  return valor.toFixed(2).replace('.', ',')
}

const calcularDescontoVT = (): number => {
  const vt = props.funcionario.beneficios?.vale_transporte
  if (!vt?.ativo) return 0
  
  const salarioBase = parseFloat(props.funcionario.salario_base) || 0
  
  if (vt.tipo_desconto === 'percentual') {
    return salarioBase * (vt.percentual_desconto || 0) / 100
  } else if (vt.tipo_desconto === 'valor_fixo') {
    return vt.valor_desconto || 0
  }
  
  return 0
}

const calcularDescontoCB = (): number => {
  const cb = props.funcionario.beneficios?.cesta_basica
  if (!cb?.ativo) return 0
  
  const salarioBase = parseFloat(props.funcionario.salario_base) || 0
  
  if (cb.tipo_desconto === 'percentual') {
    return salarioBase * (cb.percentual_desconto || 0) / 100
  } else if (cb.tipo_desconto === 'valor_fixo') {
    return cb.valor_desconto || 0
  }
  
  return 0
}

const calcularTotalBeneficios = (): number => {
  let total = 0
  
  // Vale Transporte (22 dias úteis)
  if (props.funcionario.beneficios?.vale_transporte?.ativo) {
    total += (props.funcionario.beneficios.vale_transporte.valor || 0) * 22
  }
  
  // Cesta Básica (22 dias úteis)
  if (props.funcionario.beneficios?.cesta_basica?.ativo) {
    total += (props.funcionario.beneficios.cesta_basica.valor || 0) * 22
  }
  
  // Plano de Saúde (valor pago pela empresa)
  if (props.funcionario.beneficios?.plano_saude?.ativo) {
    total += props.funcionario.beneficios.plano_saude.valor_empresa || 0
  }
  
  return total
}

const calcularTotalDescontos = (): number => {
  let total = 0
  const salarioBase = parseFloat(props.funcionario.salario_base) || 0
  
  // Descontos dos benefícios
  total += calcularDescontoVT()
  total += calcularDescontoCB()
  
  // Plano de Saúde
  if (props.funcionario.beneficios?.plano_saude?.ativo) {
    total += props.funcionario.beneficios.plano_saude.valor_funcionario || 0
  }
  
  // Plano Odontológico
  if (props.funcionario.beneficios?.plano_odonto?.ativo) {
    total += props.funcionario.beneficios.plano_odonto.valor_funcionario || 0
  }
  
  // Descontos personalizados
  props.funcionario.descontos_personalizados?.forEach((desconto: any) => {
    if (desconto.tipo === 'percentual') {
      total += salarioBase * (desconto.percentual || 0) / 100
    } else if (desconto.tipo === 'valor_fixo') {
      total += desconto.valor || 0
    }
  })
  
  return total
}

const calcularSalarioLiquido = (): number => {
  const salarioBase = parseFloat(props.funcionario.salario_base) || 0
  return salarioBase - calcularTotalDescontos()
}
</script>