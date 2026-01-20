# 🚀 Guia Rápido: Itens Personalizados

## ⚡ Instalação em 3 Passos

### 1️⃣ Abrir Supabase
- Acesse: https://supabase.com/dashboard
- Entre no seu projeto
- Clique em **SQL Editor** (ícone 🗄️)

### 2️⃣ Executar SQL
- Clique em **"+ New query"**
- Abra o arquivo: `EXECUTAR-ITENS-PERSONALIZADOS.sql`
- Copie TODO o conteúdo
- Cole no editor
- Clique em **"Run"** ▶️

### 3️⃣ Verificar
Você deve ver:
```
✅ Tabela holerite_itens_personalizados criada com sucesso!
✅ Total de colunas: 11
✅ Políticas RLS criadas: 4
```

## 🎯 Como Usar

### Adicionar Bônus (Único)
```
1. Editar Holerite
2. Aba "⚙️ Itens Personalizados"
3. Clicar "➕ Adicionar Novo Item"
4. Preencher:
   - Tipo: 💰 Benefício
   - Vigência: 📅 Único
   - Descrição: Bônus de Natal
   - Valor: 1000.00
   - Data Início: 2026-12-01
5. Clicar "✅ Adicionar"
```

### Adicionar Desconto (Recorrente)
```
1. Editar Holerite
2. Aba "⚙️ Itens Personalizados"
3. Clicar "➕ Adicionar Novo Item"
4. Preencher:
   - Tipo: 📉 Desconto
   - Vigência: 🔄 Recorrente
   - Descrição: Desconto Uniforme
   - Valor: 50.00
   - Data Início: 2026-01-01
   - Data Fim: 2026-06-30
5. Clicar "✅ Adicionar"
```

## 🔄 Aplicação Automática

Ao gerar holerites, o sistema:
- ✅ Busca itens ativos
- ✅ Verifica período de vigência
- ✅ Aplica automaticamente
- ✅ Calcula salário líquido

## ❌ Problemas?

### Erro: "Could not find the table"
**Solução:** Execute o passo 2️⃣ acima

### Erro: "Permission denied"
**Solução:** Verifique se está logado como admin

### Item não aparece no holerite
**Solução:** Verifique:
- ✅ Item está ativo
- ✅ Período do holerite está na vigência
- ✅ Data início/fim estão corretas

## 📚 Documentação Completa

- `docs/ITENS-PERSONALIZADOS-HOLERITE.md` - Documentação completa
- `docs/CORRECAO-ITENS-PERSONALIZADOS.md` - Troubleshooting detalhado

---

**Dúvidas?** Veja a documentação completa! 📖
