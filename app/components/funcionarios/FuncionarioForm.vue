<template>
  <div class="space-y-6">
    <!-- Navegação por Abas -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="() => { console.log('Clicou na aba:', tab.id); abaAtiva = tab.id }"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            abaAtiva === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Conteúdo das Abas -->
    <div class="min-h-[400px]">
      <!-- Aba: Dados Pessoais -->
      <div v-if="abaAtiva === 'pessoais'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">👤 Dados Pessoais</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <UiInput 
              v-model="form.nome_completo" 
              label="Nome Completo" 
              required 
              placeholder="Digite o nome completo"
            />
          </div>
          
          <UiInput 
            v-model="form.cpf" 
            label="CPF" 
            required
            placeholder="000.000.000-00"
          />
          
          <UiInputPIS 
            v-model="form.pis_pasep" 
            label="PIS/PASEP" 
            placeholder="000.00000.00-0"
          />
          
          <UiInput 
            v-model="form.rg" 
            label="RG" 
            placeholder="00.000.000-0"
          />
          
          <UiInput 
            v-model="form.data_nascimento" 
            type="date" 
            label="Data de Nascimento"
          />
          
          <UiSelect 
            v-model="form.sexo" 
            :options="sexoOptions" 
            label="Sexo" 
            placeholder="Selecione..."
          />
          
          <UiInput 
            v-model="form.telefone" 
            label="Telefone"
            placeholder="(11) 99999-9999"
          />
          
          <UiInput 
            v-model="form.email_pessoal" 
            type="email" 
            :uppercase="false"
            label="Email Pessoal" 
            placeholder="email@pessoal.com"
          />
        </div>
      </div>

      <!-- Aba: Dados Profissionais -->
      <div v-if="abaAtiva === 'profissionais'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">💼 Dados Profissionais</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Empresa -->
          <div v-if="showEmpresaSelect" class="md:col-span-2">
            <UiSelect 
              v-model="form.empresa_id" 
              :options="empresasOptions" 
              label="Empresa" 
              placeholder="Selecione a empresa..."
            />
          </div>
          
          <UiSelect 
            v-model="form.departamento_id" 
            :options="departamentosOptions" 
            label="Departamento" 
            placeholder="Selecione..."
          />
          
          <UiSelect 
            v-model="form.cargo_id" 
            :options="cargosOptions" 
            label="Cargo" 
            placeholder="Selecione..."
          />
          
          <UiSelect 
            v-model="form.tipo_contrato" 
            :options="tipoContratoOptions" 
            label="Tipo de Contrato"
          />
          
          <UiInput 
            v-model="form.data_admissao" 
            type="date" 
            label="Data de Admissão"
          />
          
          <UiInput 
            v-model="form.matricula" 
            label="Matrícula/Registro" 
            placeholder="Gerado automaticamente"
          />
          
          <UiSelect 
            v-model="form.jornada_trabalho_id" 
            :options="jornadaOptionsComputed" 
            label="Jornada de Trabalho"
          />
          
          <UiSelect 
            v-model="form.responsavel_id" 
            :options="responsavelOptions" 
            label="Responsável Direto" 
            placeholder="Selecione..."
          />
        </div>
        
        <div class="mt-4 p-4 bg-blue-50 rounded-xl">
          <p class="text-sm text-blue-700">
            👩‍💼 <strong>Responsável Padrão:</strong> Silvana é automaticamente definida como responsável direto de todos os funcionários. 
            Você pode alterar se necessário, mas por padrão ela supervisiona toda a equipe.
          </p>
        </div>
      </div>

      <!-- Aba: Acesso ao Sistema -->
      <div v-if="abaAtiva === 'acesso'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🔐 Acesso ao Sistema</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput 
            v-model="form.email_login" 
            type="email" 
            :uppercase="false"
            label="Email de Login"
            required
            placeholder="email@empresa.com"
          />
          
          <UiInput 
            v-model="form.senha" 
            type="password" 
            label="Senha"
            required
            show-password-toggle
            placeholder="••••••••"
          />
          
          <UiSelect 
            v-model="form.tipo_acesso" 
            :options="tipoAcessoOptions" 
            label="Tipo de Acesso"
          />
          
          <UiSelect 
            v-model="form.status" 
            :options="statusOptions" 
            label="Status do Usuário"
          />
        </div>
        
        <div class="mt-4 p-4 bg-blue-50 rounded-xl">
          <h4 class="font-semibold text-blue-800 mb-2">📋 Tipos de Acesso:</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li><strong>Funcionário:</strong> Visualiza apenas seus próprios dados</li>
            <li><strong>Administrador:</strong> Acesso total ao sistema</li>
          </ul>
        </div>
      </div>

      <!-- Aba: Dados Financeiros -->
      <div v-if="abaAtiva === 'financeiros'" class="space-y-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">💰 Dados Financeiros</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiInput 
            v-model="form.salario_base" 
            type="number" 
            :uppercase="false"
            step="0.01"
            label="Salário Base (R$)"
            placeholder="0,00"
          />
          
          <UiSelect 
            v-model="form.tipo_salario" 
            :options="tipoSalarioOptions" 
            label="Tipo de Salário"
          />
          
          <UiInput 
            v-model="form.numero_dependentes" 
            type="number" 
            :uppercase="false"
            min="0"
            step="1"
            label="Número de Dependentes (IRRF)"
            placeholder="0"
          />
          
          <UiInput 
            v-model="form.banco" 
            label="Banco" 
            placeholder="Nome do banco"
          />
          
          <UiInput 
            v-model="form.agencia" 
            label="Agência" 
            placeholder="0000"
          />
          
          <UiInput 
            v-model="form.conta" 
            label="Conta" 
            placeholder="00000-0"
          />
          
          <UiSelect 
            v-model="form.tipo_conta" 
            :options="tipoContaOptions" 
            label="Tipo de Conta" 
            placeholder="Selecione..."
          />
          
          <UiSelect 
            v-model="form.forma_pagamento" 
            :options="formaPagamentoOptions" 
            label="Forma de Pagamento"
          />
        </div>
      </div>

      <!-- Aba: Benefícios e Descontos -->
      <div v-if="abaAtiva === 'beneficios'" class="space-y-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">🎁 Benefícios e Descontos</h3>
        
        <!-- Aviso para funcionários PJ -->
        <div v-if="form.tipo_contrato === 'PJ'" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div class="flex items-center gap-2 text-yellow-700">
            <span class="text-xl">⚠️</span>
            <div>
              <h4 class="font-semibold">Funcionário PJ - Sem Descontos em Folha</h4>
              <p class="text-sm">Funcionários PJ não podem ter descontos em folha de pagamento. Apenas benefícios sem desconto são permitidos.</p>
            </div>
          </div>
        </div>
        
        <!-- Benefícios Padrão -->
        <div v-if="form.beneficios" class="space-y-4">
          <h4 class="text-md font-semibold text-gray-700 mb-3">📋 Benefícios Padrão</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Vale Transporte -->
            <div v-if="form.beneficios.vale_transporte" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🚌</span>
                  <h5 class="font-semibold text-gray-800">Vale Transporte</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.vale_transporte.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.vale_transporte.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.vale_transporte.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor Diário (R$)" 
                  placeholder="0,00"
                />
                
                <!-- Descontos apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiSelect 
                    v-model="form.beneficios.vale_transporte.tipo_desconto" 
                    :options="tipoDescontoOptions" 
                    label="Tipo de Desconto" 
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.vale_transporte.tipo_desconto === 'percentual'"
                    v-model="form.beneficios.vale_transporte.percentual_desconto" 
                    type="number" 
                    step="0.01"
                    label="% de Desconto" 
                    placeholder="6.00"
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.vale_transporte.tipo_desconto === 'valor_fixo'"
                    v-model="form.beneficios.vale_transporte.valor_desconto" 
                    type="number" 
                    step="0.01"
                    label="Valor do Desconto (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700">
                    💼 <strong>Funcionário PJ:</strong> Benefício sem desconto em folha
                  </p>
                </div>
              </div>
            </div>

            <!-- Cesta Básica -->
            <div v-if="form.beneficios.cesta_basica" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🛒</span>
                  <h5 class="font-semibold text-gray-800">Cesta Básica</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.cesta_basica.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.cesta_basica.ativo" class="space-y-3">
                <UiInput 
                  v-model="form.beneficios.cesta_basica.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor Diário (R$)" 
                  placeholder="0,00"
                />
                
                <!-- Descontos apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiSelect 
                    v-model="form.beneficios.cesta_basica.tipo_desconto" 
                    :options="tipoDescontoOptions" 
                    label="Tipo de Desconto" 
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.cesta_basica.tipo_desconto === 'percentual'"
                    v-model="form.beneficios.cesta_basica.percentual_desconto" 
                    type="number" 
                    step="0.01"
                    label="% de Desconto" 
                    placeholder="20.00"
                  />
                  
                  <UiInput 
                    v-if="form.beneficios.cesta_basica.tipo_desconto === 'valor_fixo'"
                    v-model="form.beneficios.cesta_basica.valor_desconto" 
                    type="number" 
                    step="0.01"
                    label="Valor do Desconto (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700">
                    💼 <strong>Funcionário PJ:</strong> Benefício sem desconto em folha
                  </p>
                </div>
              </div>
            </div>

            <!-- Plano de Saúde -->
            <div v-if="form.beneficios.plano_saude" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🏥</span>
                  <h5 class="font-semibold text-gray-800">Plano de Saúde</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.plano_saude.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.plano_saude.ativo" class="space-y-3">
                <UiSelect 
                  v-model="form.beneficios.plano_saude.plano" 
                  :options="planoSaudeOptions" 
                  label="Tipo de Plano" 
                />
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.valor_empresa" 
                  type="number" 
                  step="0.01"
                  label="Valor Pago pela Empresa (R$)" 
                  placeholder="0,00"
                />
                
                <!-- Desconto apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiInput 
                    v-model="form.beneficios.plano_saude.valor_funcionario" 
                    type="number" 
                    step="0.01"
                    label="Valor Descontado do Funcionário (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700">
                    💼 <strong>Funcionário PJ:</strong> Sem desconto em folha para plano de saúde
                  </p>
                </div>
                
                <UiInput 
                  v-model="form.beneficios.plano_saude.dependentes" 
                  type="number" 
                  label="Número de Dependentes" 
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Plano Odontológico -->
            <div v-if="form.beneficios.plano_odonto" class="p-4 border border-gray-200 rounded-xl">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🦷</span>
                  <h5 class="font-semibold text-gray-800">Plano Odontológico</h5>
                </div>
                <UiCheckbox 
                  v-model="form.beneficios.plano_odonto.ativo" 
                  label=""
                />
              </div>
              
              <div v-if="form.beneficios.plano_odonto.ativo" class="space-y-3">
                <!-- Desconto apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'">
                  <UiInput 
                    v-model="form.beneficios.plano_odonto.valor_funcionario" 
                    type="number" 
                    step="0.01"
                    label="Valor Descontado (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700">
                    💼 <strong>Funcionário PJ:</strong> Sem desconto em folha para plano odontológico
                  </p>
                </div>
                
                <UiInput 
                  v-model="form.beneficios.plano_odonto.dependentes" 
                  type="number" 
                  label="Número de Dependentes" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mensagem de erro se benefícios não existirem -->
        <div v-else class="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center gap-2 text-red-700">
            <span class="text-xl">⚠️</span>
            <div>
              <h4 class="font-semibold">Benefícios não inicializados</h4>
              <p class="text-sm">Clique no botão abaixo para inicializar os benefícios.</p>
              <button 
                @click="inicializarBeneficios" 
                class="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                🔧 Inicializar Benefícios
              </button>
            </div>
          </div>
        </div>

        <!-- Benefícios Personalizados -->
        <div v-if="form.beneficios" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-md font-semibold text-gray-700 mb-3">✨ Benefícios Personalizados</h4>
            <UiButton 
              variant="secondary" 
              size="sm"
              @click="adicionarBeneficioPersonalizado"
            >
              ➕ Adicionar Benefício
            </UiButton>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(beneficio, index) in form.beneficios.personalizados" 
              :key="index"
              class="p-4 border border-gray-200 rounded-xl"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <UiInput 
                    v-model="beneficio.icone" 
                    label=""
                    placeholder="🎯"
                    class="w-12 text-center text-xl"
                  />
                  <UiInput 
                    v-model="beneficio.nome" 
                    label=""
                    placeholder="Nome do benefício"
                    class="font-semibold"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <UiCheckbox 
                    v-model="beneficio.ativo" 
                    label=""
                  />
                  <UiButton 
                    variant="danger" 
                    size="sm" 
                    @click="removerBeneficioPersonalizado(Number(index))"
                  >
                    🗑️
                  </UiButton>
                </div>
              </div>
              
              <div v-if="beneficio.ativo" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UiInput 
                    v-model="beneficio.valor" 
                    type="number" 
                    step="0.01"
                    label="Valor do Benefício (R$)" 
                    placeholder="0,00"
                  />
                  
                  <UiSelect 
                    v-model="beneficio.tipo_valor" 
                    :options="tipoBeneficioOptions" 
                    label="Tipo de Valor" 
                  />
                </div>
                
                <!-- Descontos apenas para CLT -->
                <div v-if="form.tipo_contrato !== 'PJ'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <UiSelect 
                    v-model="beneficio.tipo_desconto" 
                    :options="tipoDescontoOptions" 
                    label="Tipo de Desconto" 
                  />
                  
                  <UiInput 
                    v-if="beneficio.tipo_desconto === 'percentual'"
                    v-model="beneficio.percentual_desconto" 
                    type="number" 
                    step="0.01"
                    label="% de Desconto" 
                    placeholder="0,00"
                  />
                  
                  <UiInput 
                    v-if="beneficio.tipo_desconto === 'valor_fixo'"
                    v-model="beneficio.valor_desconto" 
                    type="number" 
                    step="0.01"
                    label="Valor do Desconto (R$)" 
                    placeholder="0,00"
                  />
                </div>
                
                <!-- Aviso para PJ -->
                <div v-else class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-sm text-blue-700">
                    💼 <strong>Funcionário PJ:</strong> Benefício sem desconto em folha
                  </p>
                </div>
                
                <UiInput 
                  v-model="beneficio.descricao" 
                  label="Descrição (opcional)" 
                  placeholder="Ex: Auxílio creche, seguro de vida, etc."
                />
              </div>
            </div>
            
            <div v-if="!form.beneficios.personalizados || form.beneficios.personalizados.length === 0" class="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <span class="text-2xl">✨</span>
              <p class="mt-2">Nenhum benefício personalizado adicionado</p>
              <p class="text-sm">Clique em "Adicionar Benefício" para criar um novo</p>
            </div>
          </div>
        </div>

        <!-- Descontos Personalizados - Apenas para CLT -->
        <div v-if="form.descontos_personalizados && form.tipo_contrato !== 'PJ'" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-md font-semibold text-gray-700">📉 Descontos Personalizados</h4>
            <UiButton 
              variant="secondary" 
              size="sm"
              @click="adicionarDesconto"
            >
              ➕ Adicionar Desconto
            </UiButton>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(desconto, index) in form.descontos_personalizados" 
              :key="index"
              class="p-4 border border-gray-200 rounded-xl"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <UiInput 
                  v-model="desconto.descricao" 
                  label="Descrição" 
                  placeholder="Ex: Empréstimo, Seguro de Vida"
                />
                
                <UiSelect 
                  v-model="desconto.tipo" 
                  :options="tipoDescontoOptions" 
                  label="Tipo" 
                />
                
                <UiInput 
                  v-if="desconto.tipo === 'percentual'"
                  v-model="desconto.percentual" 
                  type="number" 
                  step="0.01"
                  label="Percentual (%)" 
                  placeholder="0,00"
                />
                
                <UiInput 
                  v-if="desconto.tipo === 'valor_fixo'"
                  v-model="desconto.valor" 
                  type="number" 
                  step="0.01"
                  label="Valor (R$)" 
                  placeholder="0,00"
                />
                
                <div class="flex items-end">
                  <UiButton 
                    variant="danger" 
                    size="sm" 
                    @click="removerDesconto(Number(index))"
                  >
                    🗑️ Remover
                  </UiButton>
                </div>
              </div>
              
              <div class="mt-3 flex gap-4">
                <UiCheckbox 
                  v-model="desconto.recorrente" 
                  label="Desconto recorrente"
                />
                
                <UiInput 
                  v-if="!desconto.recorrente"
                  v-model="desconto.parcelas" 
                  type="number" 
                  label="Número de parcelas" 
                  placeholder="1"
                  class="w-32"
                />
              </div>
            </div>
            
            <div v-if="form.descontos_personalizados.length === 0" class="p-4 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              <span class="text-2xl">📝</span>
              <p class="mt-2">Nenhum desconto personalizado adicionado</p>
              <p class="text-sm">Clique em "Adicionar Desconto" para criar um novo</p>
            </div>
          </div>
        </div>
        
        <!-- Aviso para funcionários PJ sobre descontos -->
        <div v-else-if="form.tipo_contrato === 'PJ'" class="p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div class="flex items-center gap-2 text-gray-600">
            <span class="text-xl">💼</span>
            <div>
              <h4 class="font-semibold">Funcionário PJ - Descontos Não Aplicáveis</h4>
              <p class="text-sm">Funcionários PJ não podem ter descontos personalizados em folha de pagamento.</p>
            </div>
          </div>
        </div>
        
        <!-- Mensagem de erro se descontos não existirem -->
        <div v-else class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div class="flex items-center gap-2 text-orange-700">
            <span class="text-xl">⚠️</span>
            <div>
              <h4 class="font-semibold">Descontos personalizados não inicializados</h4>
              <p class="text-sm">Clique no botão abaixo para inicializar os descontos.</p>
              <button 
                @click="inicializarBeneficios" 
                class="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                🔧 Inicializar Descontos
              </button>
            </div>
          </div>
        </div>

        <!-- Resumo dos Benefícios -->
        <div class="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <h4 class="text-lg font-bold text-gray-800 mb-4">📊 Resumo dos Benefícios</h4>
          
          <div v-if="form.tipo_contrato === 'PJ'" class="text-center">
            <div class="text-xl font-bold text-blue-600 mb-2">
              R$ {{ calcularTotalBeneficios().toFixed(2).replace('.', ',') }}
            </div>
            <div class="text-sm text-gray-600 mb-4">Total de Benefícios (Sem Descontos)</div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <p class="text-sm text-blue-700">
                💼 <strong>Funcionário PJ:</strong> Recebe benefícios integralmente, sem descontos em folha
              </p>
            </div>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-green-600">
                R$ {{ calcularTotalBeneficios().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Total de Benefícios</div>
            </div>
            
            <div>
              <div class="text-xl font-bold text-red-600">
                R$ {{ calcularTotalDescontos().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Total de Descontos</div>
            </div>
            
            <div>
              <div class="text-xl font-bold text-blue-600">
                R$ {{ calcularSaldoLiquido().toFixed(2).replace('.', ',') }}
              </div>
              <div class="text-sm text-gray-600">Impacto no Salário</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <UiButton variant="secondary" @click="$emit('cancel')">
        Cancelar
      </UiButton>
      
      <UiButton 
        variant="success" 
        @click="salvarEEnviarAcesso"
        :disabled="loading"
      >
        💾 Salvar e Enviar Acesso
      </UiButton>
      
      <UiButton 
        @click="handleSubmit"
        :disabled="loading"
      >
        💾 {{ isEditing ? 'Atualizar' : 'Salvar' }} Funcionário
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, isReactive } from 'vue'
interface Props {
  form: any
  isEditing: boolean
  showEmpresaSelect?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showEmpresaSelect: false,
  loading: false
})

const emit = defineEmits<{
  submit: []
  cancel: []
  'salvar-e-enviar': []
}>()

// Estado da aba ativa
const abaAtiva = ref('pessoais')

// Abas do formulário
const tabs = [
  { id: 'pessoais', label: 'Dados Pessoais', icon: '👤' },
  { id: 'profissionais', label: 'Dados Profissionais', icon: '💼' },
  { id: 'acesso', label: 'Acesso ao Sistema', icon: '🔐' },
  { id: 'financeiros', label: 'Dados Financeiros', icon: '💰' },
  { id: 'beneficios', label: 'Benefícios e Descontos', icon: '🎁' }
]

// Opções para os selects
const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Outro' }
]

const tipoContratoOptions = [
  { value: 'CLT', label: 'CLT' },
  { value: 'PJ', label: 'PJ' },
  { value: 'Estagio', label: 'Estágio' },
  { value: 'Temporario', label: 'Temporário' }
]

const jornadaOptions = [
  { value: '44h', label: '44h semanais' },
  { value: '40h', label: '40h semanais' },
  { value: '36h', label: '36h semanais' },
  { value: '30h', label: '30h semanais' }
]

const tipoAcessoOptions = [
  { value: 'funcionario', label: 'Funcionário' },
  { value: 'admin', label: 'Administrador' }
]

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' }
]

const tipoSalarioOptions = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'horista', label: 'Horista' }
]

const formaPagamentoOptions = [
  { value: 'deposito', label: 'Depósito Bancário' },
  { value: 'pix', label: 'PIX' }
]

const tipoContaOptions = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' },
  { value: 'salario', label: 'Conta Salário' }
]

const tipoDescontoOptions = [
  { value: 'sem_desconto', label: 'Sem Desconto' },
  { value: 'percentual', label: 'Percentual (%)' },
  { value: 'valor_fixo', label: 'Valor Fixo (R$)' }
]

const planoSaudeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'coparticipacao', label: 'Coparticipação' }
]

const tipoBeneficioOptions = [
  { value: 'diario', label: 'Valor Diário' },
  { value: 'mensal', label: 'Valor Mensal' },
  { value: 'fixo', label: 'Valor Fixo' }
]

// Função para calcular valor diário da Cesta Básica
const calcularValorDiarioCB = () => {
  if (props.form.beneficios?.cesta_basica?.valor_mensal) {
    props.form.beneficios.cesta_basica.valor = props.form.beneficios.cesta_basica.valor_mensal / 22
  }
}

const { 
  formatarHorario, 
  formatarHorasDecimais, 
  obterNomeDia, 
  obterAbrevDia 
} = useJornadas()

const { opcoesJornadas, carregarJornadas } = useJornadas()
const { empresas, carregarEmpresas, obterOpcoesEmpresas } = useEmpresas()
const { opcoesDepartamentos, carregarDepartamentos } = useDepartamentos()
const { opcoesCargos, carregarCargos } = useCargos()
const { nomeAdmin, idAdmin, buscarAdmin } = useAdmin()

// Função para inicializar benefícios de forma reativa
const inicializarBeneficios = () => {
  console.log('🔧 Inicializando benefícios...')
  
  if (!props.form.beneficios) {
    console.log('📋 Criando estrutura de benefícios')
    props.form.beneficios = reactive({
      vale_transporte: {
        ativo: false,
        valor: 0,
        valor_mensal: 0,
        tipo_desconto: 'percentual',
        percentual_desconto: 6,
        valor_desconto: 0
      },
      cesta_basica: {
        ativo: false,
        valor: 0,
        valor_mensal: 0,
        tipo_desconto: 'sem_desconto',
        percentual_desconto: 0,
        valor_desconto: 0
      },
      plano_saude: {
        ativo: false,
        plano: 'individual',
        valor_empresa: 0,
        valor_funcionario: 0,
        dependentes: 0
      },
      plano_odonto: {
        ativo: false,
        valor_funcionario: 0,
        dependentes: 0
      },
      personalizados: []
    })
  }

  // Garantir que benefícios personalizados existam e sejam reativos
  if (!props.form.beneficios.personalizados) {
    props.form.beneficios.personalizados = reactive([])
  } else if (!isReactive(props.form.beneficios.personalizados)) {
    // Se existir mas não for reativo, tornar reativo e converter tipos
    console.log('🔄 Tornando benefícios personalizados reativos e convertendo tipos')
    const beneficiosConvertidos = props.form.beneficios.personalizados.map((beneficio: any) => ({
      ...beneficio,
      valor: typeof beneficio.valor === 'string' ? parseFloat(beneficio.valor) || 0 : beneficio.valor,
      percentual_desconto: typeof beneficio.percentual_desconto === 'string' ? parseFloat(beneficio.percentual_desconto) || 0 : beneficio.percentual_desconto,
      valor_desconto: typeof beneficio.valor_desconto === 'string' ? parseFloat(beneficio.valor_desconto) || 0 : beneficio.valor_desconto
    }))
    props.form.beneficios.personalizados = reactive(beneficiosConvertidos)
  } else {
    // Se já for reativo, apenas converter tipos se necessário
    props.form.beneficios.personalizados.forEach((beneficio: any) => {
      if (typeof beneficio.valor === 'string') {
        beneficio.valor = parseFloat(beneficio.valor) || 0
      }
      if (typeof beneficio.percentual_desconto === 'string') {
        beneficio.percentual_desconto = parseFloat(beneficio.percentual_desconto) || 0
      }
      if (typeof beneficio.valor_desconto === 'string') {
        beneficio.valor_desconto = parseFloat(beneficio.valor_desconto) || 0
      }
    })
  }

  if (!props.form.descontos_personalizados) {
    console.log('📉 Criando array de descontos personalizados')
    props.form.descontos_personalizados = reactive([])
  } else if (!isReactive(props.form.descontos_personalizados)) {
    // Se existir mas não for reativo, tornar reativo
    console.log('🔄 Tornando descontos personalizados reativos')
    props.form.descontos_personalizados = reactive([...props.form.descontos_personalizados])
  }
  
  console.log('✅ Benefícios inicializados:', props.form.beneficios)
}

// Função para definir responsável padrão (Silvana - ID 1)
const definirResponsavelPadrao = () => {
  // Se não há responsável definido, definir Silvana (ID 1) como padrão
  if (!props.form.responsavel_id) {
    props.form.responsavel_id = 1
    console.log('👩‍💼 Silvana definida como responsável padrão (ID: 1)')
  }
}

// Carregar dados ao montar o componente
onMounted(async () => {
  console.log('🚀 Montando componente FuncionarioForm')
  
  // Inicializar benefícios primeiro
  inicializarBeneficios()
  
  // Definir responsável padrão
  definirResponsavelPadrao()
  
  // Carregar dados das APIs
  await Promise.all([
    carregarJornadas(),
    carregarEmpresas(),
    carregarDepartamentos(),
    carregarCargos(),
    buscarAdmin()
  ])
  
  console.log('✅ Componente montado com sucesso')
})

// Watch para garantir que benefícios estejam sempre inicializados
watch(() => props.form, (novoForm) => {
  if (novoForm && !novoForm.beneficios) {
    console.log('⚠️ Benefícios não encontrados no watch, inicializando...')
    inicializarBeneficios()
  }
}, { deep: true, immediate: true })

// Watch específico para benefícios personalizados (debug e conversão)
watch(() => props.form.beneficios?.personalizados, (novos, antigos) => {
  if (novos && novos.length > 0) {
    console.log('🔍 Benefícios personalizados alterados:', novos)
    novos.forEach((beneficio: any, index: number) => {
      // Garantir que valores sejam numéricos
      garantirValoresNumericos(beneficio)
      
      console.log(`Benefício ${index}:`, {
        nome: beneficio.nome,
        tipo_valor: beneficio.tipo_valor,
        valor: beneficio.valor,
        valor_tipo: typeof beneficio.valor,
        ativo: beneficio.ativo
      })
    })
  }
}, { deep: true })

// Watch para limpar descontos quando mudar para PJ
watch(() => props.form.tipo_contrato, (novoTipo, tipoAnterior) => {
  if (novoTipo === 'PJ' && tipoAnterior !== 'PJ') {
    console.log('🚫 Funcionário alterado para PJ - removendo descontos em folha')
    
    // Limpar descontos dos benefícios padrão
    if (props.form.beneficios) {
      if (props.form.beneficios.vale_transporte) {
        props.form.beneficios.vale_transporte.tipo_desconto = 'sem_desconto'
        props.form.beneficios.vale_transporte.percentual_desconto = 0
        props.form.beneficios.vale_transporte.valor_desconto = 0
      }
      
      if (props.form.beneficios.cesta_basica) {
        props.form.beneficios.cesta_basica.tipo_desconto = 'sem_desconto'
        props.form.beneficios.cesta_basica.percentual_desconto = 0
        props.form.beneficios.cesta_basica.valor_desconto = 0
      }
      
      if (props.form.beneficios.plano_saude) {
        props.form.beneficios.plano_saude.valor_funcionario = 0
      }
      
      if (props.form.beneficios.plano_odonto) {
        props.form.beneficios.plano_odonto.valor_funcionario = 0
      }
      
      // Limpar descontos dos benefícios personalizados
      if (props.form.beneficios.personalizados) {
        props.form.beneficios.personalizados.forEach((beneficio: any) => {
          beneficio.tipo_desconto = 'sem_desconto'
          beneficio.percentual_desconto = 0
          beneficio.valor_desconto = 0
        })
      }
    }
    
    // Limpar descontos personalizados
    if (props.form.descontos_personalizados) {
      props.form.descontos_personalizados.splice(0)
    }
    
    console.log('✅ Descontos removidos para funcionário PJ')
  }
})

// Recarregar dados sempre que o formulário for exibido (detectando mudanças no form)
watch(() => props.form.nome_completo, async (novoNome, nomeAntigo) => {
  // Se o nome mudou de vazio para preenchido ou vice-versa, recarregar dados
  if ((novoNome && !nomeAntigo) || (!novoNome && nomeAntigo)) {
    console.log('🔄 Recarregando dados dos selects...')
    await Promise.all([
      carregarJornadas(),
      carregarEmpresas(),
      carregarDepartamentos(),
      carregarCargos()
    ])
  }
})

// Opções de departamentos vindas da API
const departamentosOptions = computed(() => opcoesDepartamentos.value)

// Opções de cargos vindas da API
const cargosOptions = computed(() => opcoesCargos.value)

// Opções de responsável direto (Silvana como padrão)
const responsavelOptions = computed(() => {
  const options = []
  
  // Silvana sempre como primeira opção (ID 1)
  options.push({ 
    value: 1, 
    label: 'Silvana (Responsável Padrão) ⭐' 
  })
  
  // Adicionar admin se disponível e diferente de Silvana
  if (idAdmin.value && nomeAdmin.value && idAdmin.value !== 1) {
    options.push({ 
      value: idAdmin.value, 
      label: `${nomeAdmin.value} (Admin)` 
    })
  }
  
  // Opção para remover responsável (apenas se necessário)
  options.push({ 
    value: null, 
    label: 'Nenhum responsável' 
  })
  
  return options
})

// Opções de empresas vindas do banco de dados
const empresasOptions = computed(() => obterOpcoesEmpresas.value)

// Opções de jornadas
const jornadaOptionsComputed = computed(() => opcoesJornadas.value)

// Funções para gerenciar descontos personalizados
const adicionarDesconto = () => {
  props.form.descontos_personalizados.push({
    descricao: '',
    tipo: 'valor_fixo',
    valor: 0,
    percentual: 0,
    recorrente: true,
    parcelas: 1
  })
}

const removerDesconto = (index: number) => {
  if (props.form.descontos_personalizados) {
    props.form.descontos_personalizados.splice(index, 1)
  }
}

// Funções para gerenciar benefícios personalizados
const adicionarBeneficioPersonalizado = () => {
  if (!props.form.beneficios.personalizados) {
    props.form.beneficios.personalizados = reactive([])
  }
  
  props.form.beneficios.personalizados.push({
    icone: '🎯',
    nome: '',
    ativo: false,
    valor: 0, // Garantir que seja número
    tipo_valor: 'mensal',
    tipo_desconto: 'sem_desconto',
    percentual_desconto: 0, // Garantir que seja número
    valor_desconto: 0, // Garantir que seja número
    descricao: ''
  })
}

const removerBeneficioPersonalizado = (index: number) => {
  if (props.form.beneficios.personalizados) {
    props.form.beneficios.personalizados.splice(index, 1)
  }
}

// Função para garantir que valores sejam numéricos
const garantirValoresNumericos = (beneficio: any) => {
  if (typeof beneficio.valor === 'string') {
    beneficio.valor = parseFloat(beneficio.valor) || 0
  }
  if (typeof beneficio.percentual_desconto === 'string') {
    beneficio.percentual_desconto = parseFloat(beneficio.percentual_desconto) || 0
  }
  if (typeof beneficio.valor_desconto === 'string') {
    beneficio.valor_desconto = parseFloat(beneficio.valor_desconto) || 0
  }
}

// Funções para calcular totais
const calcularTotalBeneficios = () => {
  let total = 0
  
  // Vale Transporte - usar valor_mensal se existir, senão calcular
  if (props.form.beneficios?.vale_transporte?.ativo) {
    const valorMensal = props.form.beneficios.vale_transporte.valor_mensal || 
                        (props.form.beneficios.vale_transporte.valor || 0) * 22
    total += valorMensal
  }
  
  // Cesta Básica - usar valor_mensal se existir, senão calcular
  if (props.form.beneficios?.cesta_basica?.ativo) {
    const valorMensal = props.form.beneficios.cesta_basica.valor_mensal || 
                        (props.form.beneficios.cesta_basica.valor || 0) * 22
    total += valorMensal
  }
  
  // Plano de Saúde (valor pago pela empresa)
  if (props.form.beneficios?.plano_saude?.ativo) {
    total += props.form.beneficios.plano_saude.valor_empresa || 0
  }
  
  // Benefícios Personalizados
  if (props.form.beneficios?.personalizados) {
    props.form.beneficios.personalizados.forEach((beneficio: any) => {
      if (beneficio.ativo) {
        let valorBeneficio = beneficio.valor || 0
        
        // Converter para valor mensal se necessário
        if (beneficio.tipo_valor === 'diario') {
          valorBeneficio = valorBeneficio * 22
        }
        
        total += valorBeneficio
      }
    })
  }
  
  return total
}

const calcularTotalDescontos = () => {
  let total = 0
  const salarioBase = parseFloat(props.form.salario_base) || 0
  
  // Funcionários PJ não têm descontos em folha
  if (props.form.tipo_contrato === 'PJ') {
    return 0
  }
  
  // Descontos dos benefícios padrão
  if (props.form.beneficios?.vale_transporte?.ativo) {
    const vt = props.form.beneficios.vale_transporte
    if (vt.tipo_desconto === 'percentual') {
      total += salarioBase * (vt.percentual_desconto || 0) / 100
    } else if (vt.tipo_desconto === 'valor_fixo') {
      total += vt.valor_desconto || 0
    }
  }
  
  if (props.form.beneficios?.cesta_basica?.ativo) {
    const cb = props.form.beneficios.cesta_basica
    if (cb.tipo_desconto === 'percentual') {
      total += salarioBase * (cb.percentual_desconto || 0) / 100
    } else if (cb.tipo_desconto === 'valor_fixo') {
      total += cb.valor_desconto || 0
    }
  }
  
  // Plano de Saúde
  if (props.form.beneficios?.plano_saude?.ativo) {
    total += props.form.beneficios.plano_saude.valor_funcionario || 0
  }
  
  // Plano Odontológico
  if (props.form.beneficios?.plano_odonto?.ativo) {
    total += props.form.beneficios.plano_odonto.valor_funcionario || 0
  }
  
  // Descontos dos benefícios personalizados
  if (props.form.beneficios?.personalizados) {
    props.form.beneficios.personalizados.forEach((beneficio: any) => {
      if (beneficio.ativo) {
        if (beneficio.tipo_desconto === 'percentual') {
          total += salarioBase * (beneficio.percentual_desconto || 0) / 100
        } else if (beneficio.tipo_desconto === 'valor_fixo') {
          total += beneficio.valor_desconto || 0
        }
      }
    })
  }
  
  // Descontos personalizados
  props.form.descontos_personalizados?.forEach((desconto: any) => {
    if (desconto.tipo === 'percentual') {
      total += salarioBase * (desconto.percentual || 0) / 100
    } else if (desconto.tipo === 'valor_fixo') {
      total += desconto.valor || 0
    }
  })
  
  return total
}

const calcularSaldoLiquido = () => {
  return calcularTotalBeneficios() - calcularTotalDescontos()
}

// Handlers
const handleSubmit = () => {
  emit('submit')
}

const salvarEEnviarAcesso = () => {
  emit('salvar-e-enviar')
}
</script>