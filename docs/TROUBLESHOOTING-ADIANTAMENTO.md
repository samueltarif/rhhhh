# 🔧 Troubleshooting: Adiantamento Salarial

## ❌ Problema: Adiantamento não aparece no holerite mensal

### Sintomas
- Adiantamento foi gerado corretamente
- Folha mensal foi gerada
- Mas o desconto do adiantamento não aparece

### Causas Possíveis

#### 1. Período do Adiantamento Incorreto
**Problema:** Adiantamento foi gerado com `periodo_fim` maior que dia 15

**Verificar:**
```sql
SELECT id, funcionario_id, periodo_inicio, periodo_fim, salario_base, observacoes
FROM holerites
WHERE periodo_fim <= '2026-01-15'
AND observacoes LIKE '%Adiantamento%';
```

**Solução:** Regenerar adiantamento com período correto (01 a 15)

#### 2. Mês Diferente
**Problema:** Adiantamento foi gerado em um mês, folha mensal em outro

**Verificar:**
```sql
-- Adiantamentos de Janeiro
SELECT * FROM holerites 
WHERE periodo_inicio >= '2026-01-01' 
AND periodo_fim <= '2026-01-15';

-- Folhas mensais de Janeiro
SELECT * FROM holerites 
WHERE periodo_inicio >= '2026-01-01' 
AND periodo_fim >= '2026-01-30';
```

**Solução:** Gerar ambos no mesmo mês

#### 3. Campo `adiantamento` não foi salvo
**Problema:** Holerite de adiantamento não tem o campo preenchido

**Verificar:**
```sql
SELECT id, funcionario_id, salario_base, adiantamento, observacoes
FROM holerites
WHERE observacoes LIKE '%Adiantamento%';
```

**Solução:** O sistema agora usa `observacoes` como fallback

### Como Testar

Execute o script de teste:
```bash
node testar-adiantamento.mjs
```

Você deve ver:
```
✅ Adiantamento gerado
✅ Folha mensal gerada
✅ Adiantamento foi descontado!
```

### Verificação Manual

1. **Gerar Adiantamento:**
   - Período: 01/01/2026 a 15/01/2026
   - Valor: 40% do salário

2. **Verificar no Banco:**
```sql
SELECT 
  f.nome_completo,
  h.periodo_inicio,
  h.periodo_fim,
  h.salario_base,
  h.adiantamento,
  h.observacoes
FROM holerites h
JOIN funcionarios f ON f.id = h.funcionario_id
WHERE h.periodo_fim = '2026-01-15'
ORDER BY f.nome_completo;
```

3. **Gerar Folha Mensal:**
   - Período: 01/01/2026 a 31/01/2026

4. **Verificar Desconto:**
```sql
SELECT 
  f.nome_completo,
  h.salario_base,
  h.inss,
  h.irrf,
  h.adiantamento,
  h.total_descontos,
  h.salario_liquido
FROM holerites h
JOIN funcionarios f ON f.id = h.funcionario_id
WHERE h.periodo_fim = '2026-01-31'
ORDER BY f.nome_completo;
```

### Logs do Sistema

Ao gerar folha mensal, você deve ver nos logs:

```
🔍 Buscando adiantamentos do mês 2026-01...
📋 1 adiantamento(s) encontrado(s)
   - Adiantamento: R$ 2.000,00
💸 Total de adiantamento a descontar: R$ 2.000,00
```

Se não aparecer, o problema está na busca.

### Correção Aplicada

**Antes:**
```typescript
.lt('periodo_inicio', mesAno + '-16') // ❌ Errado
```

**Depois:**
```typescript
.lt('periodo_fim', mesAno + '-16') // ✅ Correto
```

A busca agora usa `periodo_fim` ao invés de `periodo_inicio`.

### Visualização no Holerite

O adiantamento deve aparecer em:

1. **Modal de Visualização:**
   - Seção "Descontos"
   - Linha "💰 Adiantamento Pago"
   - Com fundo amarelo

2. **PDF/HTML:**
   - Código: 910
   - Descrição: ADIANTAMENTO SALARIAL
   - Valor na coluna de descontos

### Se o Problema Persistir

1. **Limpar holerites antigos:**
```sql
DELETE FROM holerites 
WHERE periodo_inicio >= '2026-01-01' 
AND periodo_inicio < '2026-02-01';
```

2. **Gerar novamente:**
   - Primeiro: Adiantamento (01 a 15)
   - Depois: Folha Mensal (01 a 31)

3. **Verificar logs do servidor:**
   - Procurar por "Buscando adiantamentos"
   - Verificar se encontrou registros

4. **Verificar estrutura da tabela:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name = 'adiantamento';
```

Se a coluna não existir, adicione:
```sql
ALTER TABLE holerites 
ADD COLUMN adiantamento DECIMAL(10,2) DEFAULT 0;
```

---

**Atualizado em:** Janeiro 2026  
**Status:** ✅ Corrigido
