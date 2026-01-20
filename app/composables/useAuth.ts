// Composable de autenticação
export interface User {
  id: number
  nome: string
  email: string
  tipo: 'admin' | 'funcionario'
  cargo?: string
  departamento?: string
  foto?: string
  avatar?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => {
    // Tentar recuperar do localStorage ao inicializar
    if (process.client) {
      const stored = localStorage.getItem('auth-user')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })
  
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.tipo === 'admin')

  const login = async (email: string, senha: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, senha }
      })

      if (response.success && response.user) {
        user.value = response.user
        // Salvar no localStorage
        if (process.client) {
          localStorage.setItem('auth-user', JSON.stringify(response.user))
        }
        return { success: true, message: 'Login realizado com sucesso!' }
      }

      return { success: false, message: 'Email ou senha incorretos. Tente novamente.' }
    } catch (error: any) {
      console.error('Erro no login:', error)
      return { 
        success: false, 
        message: error.data?.message || 'Email ou senha incorretos. Tente novamente.' 
      }
    }
  }

  const logout = () => {
    user.value = null
    // Limpar localStorage
    if (process.client) {
      localStorage.removeItem('auth-user')
    }
    navigateTo('/login')
  }

  const updateUser = (updatedData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedData }
      // Atualizar no localStorage
      if (process.client) {
        localStorage.setItem('auth-user', JSON.stringify(user.value))
      }
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateUser
  }
}
