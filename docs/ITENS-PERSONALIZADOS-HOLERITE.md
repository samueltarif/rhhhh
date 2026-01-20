# 📋 Sistema de Itens Personalizados para Holerites

## 🎯 Funcionalidade

Sistema que permite adicionar **benefícios** e **descontos personalizados** aos holerites dos funcionários, com controle de período de vigência.

## ✨ Características

### Tipos de Itens
- **💰 Benefício (Provento)**: Valor adicionado ao salário
- **📉 Desconto**: Valor descontado do salário

### Tipos de Vigência
- **📅 Único**: Aplicado apenas em um mês específico
- **🔄 Recorrente**: Aplicado durante um período (com data início e fim)
- **♾️ Recorrente Indefinido**: Aplicado a partir de uma data sem data fim

## 🗄️ Estrutura do Banco de Dados

### Tabela: `holerite_itens_personalizados`

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

## 🔧 Como Usar

### 1. Instalação

Execute o script SQL no Supabase:

```bash
node executar-criar-itens-personalizados.mjs
```

Ou execute manualmente no SQL Editor do Supabase:
```sql
-- Copie e cole o conteúdo de:
database/16-criar-tabela-itens-personalizados-holerite.sql
```

### 2. Adicionar Item Personalizado

No formulário de edição de holerite:

1. Abra a aba **"⚙️ Itens Personalizados"**
2. Clique em **"➕ Adicionar Novo Item"**
3. Preencha:
   - **Tipo**: Benefício ou Desconto
   - **Vigência**: Único ou Recorrente
   - **Descrição**: Nome do item (ex: "Bônus de Produtividade")
   - **Valor**: Valor em R$
   - **Data Início**: Quando começa a valer
   - **Data Fim**: Quando termina (opcional para recorrentes)
   - **Observações**: Informações adicionais (opcional)
4. Clique em **"✅ Adicionar"**

### 3. Geração Automática

Quando você gerar holerites, o sistema:

1. Busca todos os itens personalizados ativos do funcionário
2. Verifica se o período do holerite está dentro da vigência do item
3. Aplica automaticamente os valores:
   - **Benefícios** → Somados aos proventos
   - **Descontos** → Somados aos descontos

## 📊 Exemplos de Uso

### Exemplo 1: Bônus Único
```
Tipo: Benefício
Vigência: Único
Descrição: Bônus de Natal
Valor: R$ 1.000,00
Data Início: 2026-12-01
Data Fim: 2026-12-01
```
→ Aplicado apenas no holerite de dezembro/2026

### Exemplo 2: Desconto Recorrente
```
Tipo: Desconto
Vigência: Recorrente
Descrição: Desconto de Uniforme
Valor: R$ 50,00
Data Início: 2026-01-01
Data Fim: 2026-06-30
```
→ Aplicado nos holerites de janeiro a junho/2026

### Exemplo 3: Benefício Indefinido
```
Tipo: Benefício
Vigência: Recorrente
Descrição: Auxílio Educação
Valor: R$ 200,00
Data Início: 2026-03-01
Data Fim: (vazio)
```
→ Aplicado em todos os holerites a partir de março/2026

## 🔄 Fluxo de Aplicação

```
Gerar Holerite
    ↓
Buscar Itens Personalizados Ativos
    ↓
Filtrar por Período de Vigência
    ↓
Aplicar Benefícios → Total Proventos
    ↓
Aplicar Descontos → Total Descontos
    ↓
Calcular Salário Líquido
    ↓
Salvar Holerite
```

## 🎨 Interface

### Visualização dos Itens

Cada item mostra:
- 🏷️ **Badge de Tipo**: Verde (Benefício) ou Vermelho (Desconto)
- 🏷️ **Badge de Vigência**: Azul (Único) ou Roxo (Recorrente)
- 📝 **Descrição**
- 💵 **Valor**
- 📅 **Período de Vigência**
- 📄 **Observações** (se houver)
- 🗑️ **Botão Remover**

## 🔐 Segurança

- ✅ RLS (Row Level Security) habilitado
- ✅ Apenas admins podem criar/editar/deletar itens
- ✅ Validação de dados no backend
- ✅ Logs de auditoria (created_at, updated_at)

## 📱 APIs Disponíveis

### POST `/api/holerites/itens-personalizados`
Criar novo item personalizado

### GET `/api/holerites/itens-personalizados/[funcionarioId]`
Listar itens de um funcionário

### DELETE `/api/holerites/itens-personalizados/[id]`
Remover item personalizado

## ⚠️ Observações Importantes

1. **Itens inativos** não são aplicados aos holerites
2. **Período de vigência** é verificado automaticamente
3. **Valores** são sempre positivos (o tipo define se é soma ou subtração)
4. **Itens únicos** têm data_inicio = data_fim
5. **Itens recorrentes indefinidos** têm data_fim = NULL

## 🚀 Próximos Passos

- [ ] Histórico de aplicação de itens
- [ ] Relatório de itens personalizados por período
- [ ] Importação em lote de itens
- [ ] Templates de itens comuns

---

**Implementado em:** Janeiro 2026  
**Versão:** 1.0
