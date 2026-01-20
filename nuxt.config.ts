// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Otimização para Vercel
  nitro: {
    preset: 'vercel',
    vercel: {
      functions: {
        maxDuration: 30
      }
    }
  },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],
  
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login']
    }
  },
  
  runtimeConfig: {
    // Chaves privadas (apenas no servidor)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Chaves públicas (expostas ao cliente)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY,
      baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  
  app: {
    head: {
      title: 'Sistema Corporativo - Qualitec Instrumentos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema Interno de Gestão de Recursos Humanos - Qualitec Instrumentos. Instrumentação Industrial, Criogenia, Óleo & Gás.' },
        { name: 'robots', content: 'noindex, nofollow' }, // Privacidade para sistema interno
        { name: 'author', content: 'Qualitec Instrumentos Ltda' },
        { name: 'company', content: 'Qualitec Instrumentos' },
        { name: 'theme-color', content: '#1e40af' },
        { property: 'og:title', content: 'Sistema Corporativo - Qualitec Instrumentos' },
        { property: 'og:description', content: 'Sistema Interno de RH - Instrumentação Industrial' },
        { property: 'og:type', content: 'website' },
        { name: 'application-name', content: 'Qualitec RH' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },
  
  // Otimizações de build
  build: {
    transpile: ['@headlessui/vue']
  },
  
  // CSS otimizado
  css: [
    '~/assets/css/main.css'
  ]
})