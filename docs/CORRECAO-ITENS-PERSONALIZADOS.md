# 🔧 Correção: Erro ao Criar Itens Personalizados

## ❌ Erros Encontrados

### Erro 1: Tabela não existe
```
ERROR: Could not find the table 'public.holerite_itens_personalizados' in the schema cache
```

### Erro 2: Recursão infinita (APÓS criar a tabela)
```
ERROR: infinite recursion detected in policy for relation "funcionarios"
```

**Causa:** As políticas RLS estavam fazendo referência à tabela `funcionarios`, criando um loop infinito.

## ✅ Solução Completa

### Passo 1: Remover Políticas Antigas (se já executou o SQL antes)

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie e execute: `CORRIGIR-RLS-ITENS-PERSONALIZADOS.sql`

### Passo 2: Criar/Recriar a Tabela

1. No **SQL Editor** do Supabase
2. Copie TODO o conteúdo de: `EXECUTAR-ITENS-PERSONALIZADOS.sql`
3. Cole e clique em **"Run"**

### Passo 3: Verificar

Você deve ver:
```
✅ Tabela holerite_itens_personalizados criada com sucesso!
✅ Total de colunas: 11
✅ Políticas RLS criadas: 1
```

### Passo 4: Testar a Funcionalidade

1. Acesse o sistema
2. Vá em **Holerites** > Editar um holerite
3. Clique na aba **"⚙️ Itens Personalizados"**
4. Tente adicionar um novo item

## 📋 Estrutura da Tabela Criada

```sql
CREATE TABLE holerite_itens_personalizados (
  id SERIAL PRIMARY KEY,
  funcionario_id INTEGER NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'beneficio' ou 'desconto'
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  vigencia_tipo VARCHAR(20) NOT NULL, -- 'unico' ou 'recorrente'
  data_inicio DATE NOT NULL,
  data_fim DATE, -- NULL = indefinido
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Políticas RLS Criadas

1. **SELECT**: Admins podem ver todos os itens
2. **INSERT**: Admins podem inserir itens
3. **UPDATE**: Admins podem atualizar itens
4. **DELETE**: Admins podem deletar itens

## 🎯 Como Usar Após Correção

### Adicionar Benefício Único (Ex: Bônus)

1. Abra a edição de um holerite
2. Vá na aba **"⚙️ Itens Personalizados"**
3. Clique em **"➕ Adicionar Novo Item"**
4. Preencha:
   - **Tipo**: 💰 Benefício (Provento)
   - **Vigência**: 📅 Único (apenas este mês)
   - **Descrição**: Bônus de Produtividade
   - **Valor**: 500.00
   - **Data Início**: 2026-01-01
5. Clique em **"✅ Adicionar"**

### Adicionar Desconto Recorrente (Ex: Uniforme)

1. Mesmos passos acima
2. Preencha:
   - **Tipo**: 📉 Desconto
   - **Vigência**: 🔄 Recorrente (vários meses)
   - **Descrição**: Desconto de Uniforme
   - **Valor**: 50.00
   - **Data Início**: 2026-01-01
   - **Data Fim**: 2026-06-30
3. Clique em **"✅ Adicionar"**

## 🔄 Aplicação Automática

Quando você **gerar holerites**, o sistema:

1. ✅ Busca todos os itens personalizados ativos
2. ✅ Verifica se o período do holerite está na vigência
3. ✅ Aplica automaticamente:
   - **Benefícios** → Somados aos proventos
   - **Descontos** → Somados aos descontos
4. ✅ Calcula o salário líquido final

## 📊 Exemplo Prático

### Funcionário: João Silva
**Salário Base:** R$ 3.000,00

### Itens Personalizados Cadastrados:
1. **Bônus de Produtividade** (Benefício)
   - Valor: R$ 500,00
   - Vigência: Janeiro/2026 (único)

2. **Desconto de Uniforme** (Desconto)
   - Valor: R$ 50,00
   - Vigência: Jan-Jun/2026 (recorrente)

### Holerite de Janeiro/2026:
```
Salário Base:           R$ 3.000,00
Bônus Produtividade:    R$   500,00  ✅ Aplicado
--------------------------------
Total Proventos:        R$ 3.500,00

INSS:                   R$   300,00
IRRF:                   R$   100,00
Desconto Uniforme:      R$    50,00  ✅ Aplicado
--------------------------------
Total Descontos:        R$   450,00

SALÁRIO LÍQUIDO:        R$ 3.050,00
```

### Holerite de Fevereiro/2026:
```
Salário Base:           R$ 3.000,00
--------------------------------
Total Proventos:        R$ 3.000,00

INSS:                   R$   300,00
IRRF:                   R$   100,00
Desconto Uniforme:      R$    50,00  ✅ Aplicado
--------------------------------
Total Descontos:        R$   450,00

SALÁRIO LÍQUIDO:        R$ 2.550,00
```

**Nota:** O bônus não aparece em fevereiro porque era único (apenas janeiro).

## ⚠️ Observações Importantes

1. **Itens inativos** não são aplicados
2. **Período de vigência** é verificado automaticamente
3. **Valores** são sempre positivos (o tipo define se soma ou subtrai)
4. **Itens únicos** têm data_inicio = data_fim
5. **Itens recorrentes indefinidos** têm data_fim = NULL

## 🐛 Troubleshooting

### Erro: "500 Server Error"
- ✅ Verifique se executou o SQL no Supabase
- ✅ Verifique se a tabela foi criada: vá em **Table Editor** e procure por `holerite_itens_personalizados`

### Erro: "Permission denied"
- ✅ Verifique se está logado como admin
- ✅ Verifique as políticas RLS no Supabase

### Item não aparece no holerite
- ✅ Verifique se o item está **ativo**
- ✅ Verifique se o **período do holerite** está dentro da **vigência do item**
- ✅ Verifique os logs do console ao gerar o holerite

## 📞 Suporte

Se o erro persistir:

1. Verifique os logs do servidor
2. Verifique se a tabela existe no Supabase
3. Verifique as políticas RLS
4. Teste com um item simples primeiro

---

**Corrigido em:** Janeiro 2026  
**Status:** ✅ Resolvido
