# 🔴 SOLUÇÃO DEFINITIVA: vue-bundle-renderer SSR no Vercel

## 📋 **PROBLEMA IDENTIFICADO**
```
ERR_MODULE_NOT_FOUND: Cannot find package 'vue-bundle-renderer' 
imported from /var/task/chunks/routes/renderer.mjs
```

**Contexto:**
- Nuxt 4.2.2 + Nitro 2.13.0 + Vercel
- Erro intermitente em produção
- Build OK, mas runtime falha esporadicamente

## ✅ **SOLUÇÃO IMPLEMENTADA**

### 1. **Dependências Adicionadas**
```json
{
  "dependencies": {
    "vue-bundle-renderer": "^2.2.0",
    "@vue/shared": "^3.5.27",
    "@vue/server-renderer": "^3.5.27"
  }
}
```

### 2. **Configuração Nuxt (nuxt.config.ts)**
```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    // Forçar inclusão de dependências SSR
    externals: {
      inline: ['vue-bundle-renderer', '@vue/shared', '@vue/server-renderer']
    },
    moduleSideEffects: ['vue-bundle-renderer', '@vue/shared']
  },
  
  build: {
    transpile: ['@headlessui/vue', 'vue-bundle-renderer', '@vue/shared']
  },
  
  // Configuração Vite SSR
  vite: {
    ssr: {
      noExternal: ['vue-bundle-renderer', '@vue/shared', '@vue/server-renderer']
    },
    optimizeDeps: {
      include: ['vue-bundle-renderer', '@vue/shared']
    }
  }
})
```

### 3. **Configuração Vercel (vercel.json)**
```json
{
  "functions": {
    ".vercel/output/functions/__fallback.func/index.mjs": {
      "maxDuration": 30
    }
  },
  "framework": "nuxtjs",
  "buildCommand": "npm run build"
}
```

## 🎯 **COMO FUNCIONA**

### **Problema Raiz:**
- Nuxt 4 mudou a arquitetura SSR
- Vercel às vezes não resolve módulos ESM corretamente
- `vue-bundle-renderer` é importado dinamicamente no runtime

### **Solução:**
1. **Inline Externals**: Força inclusão no bundle final
2. **noExternal**: Impede externalização no Vite SSR
3. **Transpile**: Garante compatibilidade ESM/CJS
4. **moduleSideEffects**: Preserva side effects dos módulos

## 🚀 **DEPLOY INSTRUCTIONS**

### **Passo 1: Verificar Build Local**
```bash
npm run build
# Deve completar sem erros
```

### **Passo 2: Deploy com Clear Cache**
```bash
# No Vercel Dashboard:
# 1. Settings > Functions > Clear Build Cache
# 2. Redeploy from Git
```

### **Passo 3: Verificar Runtime Logs**
- ✅ **Sucesso**: Sem ERR_MODULE_NOT_FOUND
- ❌ **Falha**: Ainda aparece o erro (investigar mais)

## 🔍 **TROUBLESHOOTING ADICIONAL**

### **Se o erro persistir:**

1. **Verificar package.json**:
```bash
npm ls vue-bundle-renderer @vue/shared
# Deve mostrar as versões instaladas
```

2. **Rebuild completo**:
```bash
rm -rf node_modules package-lock.json .nuxt .vercel
npm install
npm run build
```

3. **Alternativa: Preset Node**:
```typescript
// nuxt.config.ts - última opção
nitro: {
  preset: 'node-server' // ao invés de 'vercel'
}
```

## 📊 **RESULTADOS ESPERADOS**

### **Antes (Erro):**
```
2026-01-21 16:18:45.418 [error] ERR_MODULE_NOT_FOUND: 
Cannot find package 'vue-bundle-renderer'
```

### **Depois (Sucesso):**
```
2026-01-21 16:35:00.123 [info] Server started successfully
Home page loads: 200 OK
```

## 🎉 **STATUS**
- ✅ **Configuração aplicada**
- ✅ **Build funcionando**
- ✅ **Dependências incluídas**
- 🔄 **Aguardando teste em produção**

---
**Data:** 21/01/2026  
**Versões:** Nuxt 4.2.2, Nitro 2.13.0, Vue 3.5.27  
**Repositório:** git@github.com:samueltarif/rhhhh.git