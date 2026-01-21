// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-21',
  devtools: { enabled: true },
  
  nitro: {
    preset: 'vercel'
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
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
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
        { name: 'description', content: 'Sistema Interno de Gestão de Recursos Humanos - Qualitec Instrumentos' },
        { name: 'robots', content: 'noindex, nofollow' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  build: {
    transpile: ['@headlessui/vue']
  },
  
  css: [
    '~/assets/css/main.css'
  ]
})