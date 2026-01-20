<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Industrial Pattern -->
    <div class="absolute inset-0 opacity-5">
      <!-- Grid Pattern -->
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0); background-size: 20px 20px;"></div>
      <!-- Industrial Elements -->
      <div class="absolute top-10 left-10 w-16 h-16 border-2 border-blue-300 rounded-full"></div>
      <div class="absolute top-32 right-20 w-12 h-12 border-2 border-blue-400 rotate-45"></div>
      <div class="absolute bottom-20 left-20 w-20 h-20 border-2 border-blue-300 rounded-full"></div>
      <div class="absolute bottom-40 right-32 w-14 h-14 border-2 border-blue-400 rotate-12"></div>
      <!-- Hexagon shapes for industrial feel -->
      <div class="absolute top-1/4 left-1/4 w-8 h-8 border border-blue-300 transform rotate-30" style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"></div>
      <div class="absolute bottom-1/4 right-1/4 w-6 h-6 border border-blue-400 transform rotate-45" style="clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"></div>
    </div>
    
    <div class="w-full max-w-lg relative z-10">
      <!-- Card de Login -->
      <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 lg:p-12 border border-gray-200/50">
        <!-- Logo e Branding -->
        <div class="text-center mb-8">
          <!-- Logo Qualitec Real -->
          <div class="flex justify-center mb-3">
            <img 
              src="/images/qualitec_logo.png" 
              alt="Qualitec Instrumentos" 
              class="object-contain"
              style="width: calc(12rem + 2cm); height: calc(12rem + 2cm);"
            />
          </div>
          
          <!-- Branding Qualitec -->
          <div class="mb-3">
            <p class="text-sm text-gray-600 font-medium">Gestão de Recursos Humanos</p>
          </div>
          
          <!-- Linha decorativa -->
          <div class="flex items-center justify-center mb-2">
            <div class="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-24"></div>
          </div>
          
          <!-- Certificação -->
          <p class="text-xs text-gray-500 font-medium">ISO 9001:2015 | Instrumentação Industrial</p>
        </div>

        <!-- Mensagem de Acesso -->
        <div class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-center mb-2">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
          </div>
          <p class="text-center text-blue-800 text-sm font-medium">Acesso Restrito</p>
          <p class="text-center text-blue-600 text-xs mt-1">Entre com suas credenciais corporativas fornecidas pelo RH</p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo Email -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                E-mail
              </span>
            </label>
            <UiInput
              v-model="email"
              type="email"
              :uppercase="false"
              placeholder="seu.email@qualitecinstrumentos.com.br"
              required
              :error="error ? ' ' : ''"
              class="w-full"
            />
          </div>

          <!-- Campo Senha -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Senha de Acesso
              </span>
            </label>
            <UiInput
              v-model="senha"
              type="password"
              placeholder="Digite sua senha corporativa"
              required
              show-password-toggle
              :error="error ? ' ' : ''"
              class="w-full"
            />
          </div>

          <!-- Mensagem de Erro -->
          <Transition name="fade">
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-800 text-sm font-medium">{{ error }}</span>
              </div>
            </div>
          </Transition>

          <!-- Botão de Login -->
          <UiButton 
            type="submit" 
            size="lg" 
            :loading="loading" 
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-200"
          >
            <span v-if="!loading" class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Acessar Sistema
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Autenticando...
            </span>
          </UiButton>
        </form>

        <!-- Informações de Segurança -->
        <div class="mt-8 p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div class="text-center">
            <div class="flex items-center justify-center mb-3">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <p class="text-blue-800 font-bold text-sm">Sistema Seguro</p>
                <p class="text-blue-600 text-xs">Certificado ISO 9001:2015</p>
              </div>
            </div>
            <p class="text-gray-600 text-xs leading-relaxed">
              Plataforma corporativa para gestão de recursos humanos.<br>
              Acesso monitorado e protegido por criptografia avançada.
            </p>
          </div>
        </div>
      </div>

      <!-- Rodapé Corporativo -->
      <div class="mt-8 text-center">
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p class="text-white/90 text-sm font-medium mb-1">
            QUALITEC INSTRUMENTOS LTDA
          </p>
          <p class="text-white/70 text-xs">
            © 2026 - Instrumentação Industrial | Criogenia | Óleo & Gás
          </p>
          <p class="text-white/60 text-xs mt-1">
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login } = useAuth()

const email = ref('')
const senha = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  const result = await login(email.value, senha.value)
  
  if (result.success) {
    navigateTo('/dashboard')
  } else {
    error.value = result.message
  }
  loading.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
