# Estrutura Atual das Tabelas de Holerites

## 📋 Resumo da Verificação

**Data:** 20/01/2026  
**Status:** ✅ Todas as tabelas existem e são acessíveis

---

## 1. Tabela `holerites`

### ✅ Status: EXISTE e FUNCIONAL

### 📊 Campos Descobertos:
```sql
-- Campos obrigatórios
funcionario_id: INTEGER NOT NULL

-- Período
periodo_inicio: DATE NOT NULL
periodo_fim: DATE NOT NULL
data_pagamento: DATE (nullable)

-- Proventos
salario_base: DECIMAL DEFAULT 0
bonus: DECIMAL DEFAULT 0
horas_extras: DECIMAL DEFAULT 0
adicional_noturno: DECIMAL DEFAULT 0
adicional_periculosidade: DECIMAL DEFAULT 0
adicional_insalubridade: DECIMAL DEFAULT 0
comissoes: DECIMAL DEFAULT 0

-- Descontos
inss: DECIMAL DEFAULT 0
base_inss: DECIMAL (nullable)
aliquota_inss: DECIMAL (nullable)
irrf: DECIMAL DEFAULT 0
base_irrf: DECIMAL (nullable)
aliquota_irrf: DECIMAL (nullable)
vale_transporte: DECIMAL DEFAULT 0
vale_refeicao_desconto: DECIMAL DEFAULT 0  -- ⚠️ AINDA É vale_refeicao_desconto
plano_saude: DECIMAL DEFAULT 0
plano_odontologico: DECIMAL DEFAULT 0
adiantamento: DECIMAL DEFAULT 0
faltas: DECIMAL DEFAULT 0
outros_descontos: DECIMAL DEFAULT 0

-- Controle
status: VARCHAR DEFAULT 'gerado'
horas_trabalhadas: INTEGER (nullable)
observacoes: TEXT (nullable)

-- Timestamps
enviado_em: TIMESTAMP (nullable)
visualizado_em: TIMESTAMP (nullable)
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()

-- Campos Calculados (GENERATED COLUMNS)
total_proventos: DECIMAL (calculado automaticamente)
total_descontos: DECIMAL (calculado automaticamente)
salario_liquido: DECIMAL (calculado automaticamente)

-- Campos Adicionais
faixa_irrf: TEXT (nullable)
beneficios: JSONB (nullable)
descontos_personalizados: JSONB (nullable)
```

### ⚠️ IMPORTANTE:
- A coluna ainda é `vale_refeicao_desconto` e NÃO `cesta_basica_desconto`
- Precisa executar a migração para alterar para cesta básica

---

## 2. Tabela `holerite_itens_personalizados`

### ✅ Status: EXISTE mas estrutura INCOMPLETA

### 📊 Campos Obrigatórios:
```sql
funcionario_id: INTEGER NOT NULL
```

### ⚠️ Problemas Encontrados:
- Erro ao inserir: campo `vigencia_inicio` não existe no schema cache
- Erro ao inserir: campo `parcelas_pagas` não existe no schema cache
- Estrutura não foi completamente descoberta

### 💡 Ação Necessária:
- Verificar script de criação da tabela
- Executar migração se necessário

---

## 3. Tabela `configuracoes_holerites`

### ✅ Status: EXISTE e FUNCIONAL

### 📊 Estrutura Descoberta:
```sql
-- Campos opcionais (todos nullable)
id: SERIAL PRIMARY KEY
empresa_id: INTEGER (nullable)
liberar_automatico_2quinzena: BOOLEAN DEFAULT true
dias_antecedencia: INTEGER DEFAULT 2
respeitar_feriados: BOOLEAN DEFAULT true
respeitar_fins_semana: BOOLEAN DEFAULT true
notificar_funcionarios: BOOLEAN DEFAULT true
notificar_rh: BOOLEAN DEFAULT true
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

### ⚠️ Campos NÃO Existem:
- `mostrar_logo`
- `mostrar_assinatura`
- `texto_cabecalho`
- `texto_rodape`

---

## 🔧 Ações Necessárias Antes dos Testes

### 1. Migração da Cesta Básica
```sql
-- Executar script para alterar vale_refeicao_desconto → cesta_basica_desconto
-- Arquivo: database/19-alterar-vale-refeicao-para-cesta-basica.sql
```

### 2. Verificar Tabela de Itens Personalizados
```sql
-- Verificar se a estrutura está completa
-- Pode precisar executar: database/16-criar-tabela-itens-personalizados-holerite.sql
```

### 3. Atualizar Scripts de Teste
- Usar `vale_refeicao_desconto` até migração ser executada
- Ajustar estrutura de itens personalizados
- Usar apenas campos existentes em configurações

---

## 📝 Exemplo de Inserção Correta

### Holerite:
```javascript
const holerite = {
  funcionario_id: 1,
  periodo_inicio: '2026-01-01',
  periodo_fim: '2026-01-31',
  salario_base: 2500.00,
  vale_refeicao_desconto: 0.00, // Usar este campo por enquanto
  status: 'gerado'
}
```

### Configuração:
```javascript
const config = {
  empresa_id: 1,
  liberar_automatico_2quinzena: true,
  dias_antecedencia: 2
}
```

---

## 🎯 Próximos Passos

1. **Executar migração da cesta básica**
2. **Verificar/corrigir tabela de itens personalizados**
3. **Atualizar scripts de teste com estrutura correta**
4. **Testar todas as funcionalidades de holerite**

---

**Status Final:** ✅ Estrutura mapeada e pronta para correções