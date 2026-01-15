<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card de Login -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span class="text-white font-bold text-3xl">RH</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Sistema RH</h1>
          <p class="text-lg text-gray-500 mt-2">Gestão de Colaboradores</p>
        </div>

        <!-- Mensagem de Boas-vindas -->
        <UiAlert variant="info" icon="👋" :show-icon="false" class="mb-6">
          Bem-vindo! Digite seu email e senha para entrar no sistema.
        </UiAlert>

        <!-- Formulário -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UiInput
            v-model="email"
            type="email"
            :uppercase="false"
            label="📧 Email"
            placeholder="Digite seu email"
            required
            :error="error ? ' ' : ''"
          />

          <UiInput
            v-model="senha"
            type="password"
            label="🔒 Senha"
            placeholder="Digite sua senha"
            required
            show-password-toggle
            :error="error ? ' ' : ''"
          />

          <!-- Mensagem de Erro -->
          <Transition name="fade">
            <UiAlert v-if="error" variant="error">
              {{ error }}
            </UiAlert>
          </Transition>

          <!-- Botão de Login -->
          <UiButton type="submit" size="lg" :loading="loading" class="w-full">
            {{ loading ? 'Entrando...' : 'Entrar no Sistema' }}
          </UiButton>
        </form>

        <!-- Dica de Acesso -->
        <div class="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p class="text-center text-blue-800 text-sm">
            <strong>🔐 Sistema de Login Seguro</strong>
          </p>
          <p class="text-center text-blue-600 text-xs mt-2">
            Entre com suas credenciais fornecidas pelo RH
          </p>
        </div>
      </div>

      <!-- Rodapé -->
      <p class="text-center text-white/80 mt-6 text-base">
        Sistema de RH © 2026 - Todos os direitos reservados
      </p>
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
