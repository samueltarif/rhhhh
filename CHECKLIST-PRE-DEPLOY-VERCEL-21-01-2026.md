# CHECKLIST PRÉ-DEPLOY VERCEL - 21/01/2026

## 🎯 OBJETIVO
Verificar e corrigir possíveis problemas antes do deploy no Vercel para evitar erros 500.

## ✅ VERIFICAÇÕES REALIZADAS

### 1. **Build Local** ✅
- **Status**: ✅ **SUCESSO**
- **Comando**: `npm run build`
- **Resultado**: Build completo sem erros
- **Tamanho**: 6.67 MB (1.42 MB gzip)
- **Preset**: vercel (configurado corretamente)

### 2. **Variáveis de Ambiente** ⚠️
**Arquivo**: `.env.example` (documentação completa)

#### Variáveis Obrigatórias para Vercel:
```bash
# Supabase (CRÍTICAS)
SUPABASE_URL=https://projeto.supabase.co
NUXT_PUBLIC_SUPABASE_URL=https://projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Email (OPCIONAIS - mas recomendadas)
GMAIL_EMAIL=qualitecinstrumentosdemedicao@gmail.com
GMAIL_APP_PASSWORD=byeqpdyllakkwxkk
```

### 3. **Estrutura de APIs** ✅
**Verificação**: Todas as APIs seguem padrão Nitro/Nuxt

#### APIs Críticas Validadas:
- ✅ `server/api/health.get.ts` - Health check
- ✅ `server/api/auth/login.post.ts` - Autenticação
- ✅ `server/api/holerites/gerar.post.ts` - Geração de holerites
- ✅ `server/api/funcionarios/enviar-acesso.post.ts` - Envio de emails

### 4. **Dependências** ✅
**Verificação**: Todas as dependências estão no package.json

#### Dependências Críticas:
- ✅ `@supabase/supabase-js` - Cliente Supabase
- ✅ `nodemailer` - Envio de emails
- ✅ `nuxt` - Framework principal
- ✅ `@nuxtjs/supabase` - Integração Supabase

### 5. **Configuração Nuxt** ✅
**Arquivo**: `nuxt.config.ts`

#### Configurações Verificadas:
- ✅ **SSR**: Habilitado para SEO
- ✅ **Nitro**: Preset vercel configurado
- ✅ **Supabase**: Módulo configurado
- ✅ **Tailwind**: CSS framework configurado

## 🚨 PROBLEMAS IDENTIFICADOS E SOLUÇÕES

### 1. **Warnings de Deprecação** ⚠️
**Problema**: Warnings sobre trailing slash patterns
```
(node:11132) [DEP0155] DeprecationWarning: Use of deprecated trailing slash pattern mapping
```

**Impacto**: ⚠️ **BAIXO** - Apenas warnings, não afeta funcionalidade
**Ação**: Monitorar, atualizar dependências quando possível

### 2. **Imports Não Utilizados** ⚠️
**Problema**: Imports não utilizados em módulos Supabase
```
"PostgrestError" is imported from external module "@supabase/postgrest-js" but never used
```

**Impacto**: ⚠️ **BAIXO** - Tree-shaking remove automaticamente
**Ação**: Nenhuma ação necessária

### 3. **Tipos de Database** ⚠️
**Problema**: Arquivo de tipos não encontrado
```
Database types configured at "~/types/database.types.ts" but file not found
```

**Impacto**: ⚠️ **BAIXO** - Usa fallback `Database = unknown`
**Ação**: Funciona normalmente, tipos genéricos aplicados

## 🔧 CORREÇÕES APLICADAS

### 1. **Campos "undefined" nos Holerites** ✅
- **Problema**: Campos mostravam "Matundefined", "Códigoundefined"
- **Solução**: Fallbacks seguros em `server/utils/holeriteHTML.ts`
- **Status**: ✅ **CORRIGIDO**

### 2. **Bases de Cálculo PJ/Adiantamento** ✅
- **Problema**: PJ e adiantamentos mostravam bases incorretamente
- **Solução**: Lógica condicional baseada em tipo de contrato
- **Status**: ✅ **CORRIGIDO**

### 3. **Competência de Holerites** ✅
- **Problema**: Mês errado no cabeçalho (mês anterior)
- **Solução**: Parse correto de datas com timezone
- **Status**: ✅ **CORRIGIDO**

### 4. **Links de Login em Emails** ✅
- **Problema**: Links não direcionavam para produção
- **Solução**: URL fixa `https://rhqualitec.vercel.app/login`
- **Status**: ✅ **CORRIGIDO**

## 📋 CHECKLIST FINAL PRÉ-DEPLOY

### Código:
- [x] Build local bem-sucedido
- [x] Testes automatizados passando
- [x] Logs de debug implementados
- [x] Tratamento de erros adequado
- [x] Fallbacks para campos undefined

### Configuração:
- [x] Preset Vercel configurado
- [x] Variáveis de ambiente documentadas
- [x] APIs seguem padrão Nitro
- [x] SSR configurado corretamente

### Funcionalidades:
- [x] Autenticação funcionando
- [x] Geração de holerites corrigida
- [x] Envio de emails com links corretos
- [x] Bases de cálculo condicionais

## 🚀 COMANDOS PARA DEPLOY

### 1. **Adicionar Arquivos ao Git**
```bash
git add .
```

### 2. **Commit das Alterações**
```bash
git commit -m "fix: Correções críticas para deploy

- Corrigir campos undefined nos holerites
- Implementar lógica condicional para bases de cálculo (PJ/Adiantamento)
- Corrigir competência de holerites mensais
- Atualizar links de login nos emails
- Adicionar logs de debug e validação
- Melhorar tratamento de erros"
```

### 3. **Push para GitHub**
```bash
git push origin main
```

### 4. **Verificar Deploy no Vercel**
- Acessar: https://vercel.com/dashboard
- Verificar build automático
- Testar: https://rhqualitec.vercel.app/api/health

## 🔍 VALIDAÇÃO PÓS-DEPLOY

### Testes Essenciais:
1. **Health Check**: `GET /api/health`
2. **Login**: `POST /api/auth/login`
3. **Dashboard**: Carregar página principal
4. **Holerites**: Gerar e visualizar holerite
5. **Email**: Enviar credenciais de acesso

### URLs de Teste:
- **Produção**: https://rhqualitec.vercel.app
- **Health**: https://rhqualitec.vercel.app/api/health
- **Login**: https://rhqualitec.vercel.app/login

## 📊 MÉTRICAS DE SUCESSO

### Build:
- ✅ **Tempo**: < 2 minutos
- ✅ **Tamanho**: 6.67 MB (otimizado)
- ✅ **Erros**: 0 (zero)

### Runtime:
- 🎯 **Tempo de resposta**: < 2s
- 🎯 **Uptime**: > 99%
- 🎯 **Erros 500**: 0 (zero)

---

**Data**: 21/01/2026  
**Status**: ✅ Pronto para deploy  
**Confiança**: 🟢 Alta (todas as correções aplicadas)  
**Próximo passo**: Executar comandos de deploy