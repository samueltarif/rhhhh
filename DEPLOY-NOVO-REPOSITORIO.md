# Deploy no Novo Repositório - rhhhh

## 🚀 Passos para Deploy no Vercel

### 1. Criar Novo Projeto no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique em **"New Project"**
3. Conecte o repositório: `git@github.com:samueltarif/rhhhh.git`
4. Branch: `main`
5. Framework: **Nuxt.js** (deve detectar automaticamente)

### 2. Configurar Variáveis de Ambiente

No Vercel Dashboard > Settings > Environment Variables, adicione:

```bash
# OBRIGATÓRIAS - Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# DUPLICADAS para compatibilidade
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OPCIONAIS - Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=qualitecinstrumentosdemedicao@gmail.com
EMAIL_PASS=byeqpdyllakkwxkk
EMAIL_FROM=noreply@qualitec.com.br
```

**IMPORTANTE**: Marque todas as variáveis para **Production**, **Preview** e **Development**

### 3. Deploy Automático

- O Vercel fará o deploy automaticamente
- Aguarde o build completar
- Teste o site na URL fornecida

### 4. Configurações Recomendadas

Se necessário, ajuste no Vercel Dashboard:

**Build & Development Settings:**
- Build Command: `npm run build` (padrão)
- Output Directory: `.output/public` (padrão)
- Install Command: `npm install` (padrão)

**Functions:**
- Region: São Paulo (iad1) ou mais próxima
- Timeout: 30 segundos (padrão)

### 5. Teste Pós-Deploy

Após o deploy, teste:

1. **Página inicial**: `https://seu-projeto.vercel.app/`
2. **Login**: `https://seu-projeto.vercel.app/login`
3. **API básica**: `https://seu-projeto.vercel.app/api/auth/login` (POST)

### 6. Domínio Personalizado (Opcional)

Se quiser usar um domínio personalizado:

1. Vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

## 🔧 Troubleshooting

### Se der erro 500:
1. Verifique os logs em **Deployments** > **Functions**
2. Confirme se todas as variáveis estão configuradas
3. Teste se o Supabase está acessível

### Se der erro de build:
1. Verifique se o Node.js está na versão correta (18+)
2. Confirme se todas as dependências estão no package.json
3. Teste o build localmente: `npm run build`

### Se der erro de variáveis:
1. Confirme se as variáveis estão em **Production**
2. Verifique se não há espaços extras nos valores
3. Teste com as chaves do Supabase Dashboard

## ✅ Vantagens do Novo Projeto

- **Configuração limpa**: Sem cache ou configurações antigas
- **Logs limpos**: Mais fácil debugar problemas
- **Performance**: Build otimizado desde o início
- **Flexibilidade**: Pode testar diferentes configurações

## 📝 Próximos Passos

1. **Deploy inicial** e teste básico
2. **Configurar domínio** se necessário
3. **Monitorar logs** nas primeiras horas
4. **Backup das variáveis** para segurança

---

**Repositório**: `git@github.com:samueltarif/rhhhh.git`
**Status**: ✅ Pronto para deploy no Vercel