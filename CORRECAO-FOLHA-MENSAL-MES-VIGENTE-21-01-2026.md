# Correção: Folha Mensal do Mês Vigente

**Data:** 21/01/2026  
**Problema:** Holerite de folha mensal estava referenciando o mês passado em vez do mês vigente

## Problema Identificado

### Lógica Anterior (Incorreta)
A folha mensal tinha duas regras baseadas no dia atual:
- **Dia 1 a 25:** Gerar folha mensal do mês atual
- **Após dia 25:** Gerar folha mensal do próximo mês

### Problema
Isso causava confusão, pois dependendo do dia que o admin gerasse a folha, ela poderia ser de meses diferentes.

## Correção Aplicada

### Nova Lógica (Correta)
A folha mensal agora é **sempre do mês vigente (atual)**, independentemente do dia em que for gerada.

### Arquivos Corrigidos

#### 1. `server/api/holerites/gerar.post.ts`
```typescript
// ANTES
if (diaAtual >= 1 && diaAtual <= 25) {
  // Gerar folha mensal do mês atual
} else {
  // Após dia 25, gerar folha mensal do próximo mês
}

// DEPOIS
// Sempre gerar folha mensal do mês atual
const periodoInicio = new Date(anoAtual, mesAtual - 1, 1)
const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
const periodoFim = new Date(anoAtual, mesAtual - 1, ultimoDiaMes)

// Data de pagamento: 5º dia útil do mês seguinte
const proximoMes = mesAtual === 12 ? 1 : mesAtual + 1
const proximoAno = mesAtual === 12 ? anoAtual + 1 : anoAtual
const dataPagamento = calcular5oDiaUtil(proximoAno, proximoMes)
```

#### 2. `server/utils/dateUtils.ts`
- Aplicada a mesma correção na função `calcularDatasHolerite()`

#### 3. Busca de Adiantamentos
A lógica de busca de adiantamentos também foi atualizada:
```typescript
// Buscar adiantamentos do mês atual
.gte('periodo_inicio', mesAno + '-15') // Adiantamentos começam no dia 15
.lte('periodo_inicio', mesAno + '-15') // Apenas adiantamentos que começam no dia 15
```

## Regras de Negócio Atualizadas

### Adiantamento Salarial
- **Período:** Dia 15 ao último dia do mês vigente
- **Valor:** 40% do salário base
- **Data de Pagamento:** Dia 20 do mês vigente

### Folha Mensal
- **Período:** Dia 1 ao último dia do mês vigente (sempre)
- **Valor:** Salário integral com descontos
- **Data de Pagamento:** 5º dia útil do mês seguinte
- **Desconto:** Adiantamentos do mês são automaticamente descontados

## Benefícios da Correção

### ✅ Consistência
- Folha mensal sempre do mês atual, independente do dia de geração

### ✅ Previsibilidade
- Admin sempre sabe que está gerando folha do mês vigente

### ✅ Simplicidade
- Elimina confusão sobre qual mês será gerado

### ✅ Integração Correta
- Adiantamentos do mês são corretamente descontados da folha mensal

## Exemplo Prático

### Cenário: Hoje é 28/01/2026

#### Antes (Incorreto)
- Gerar folha mensal → Folha de **fevereiro/2026**
- Período: 01/02/2026 a 28/02/2026

#### Depois (Correto)
- Gerar folha mensal → Folha de **janeiro/2026**
- Período: 01/01/2026 a 31/01/2026
- Data de pagamento: 5º dia útil de fevereiro/2026

## Teste Recomendado

1. **Gerar Folha Mensal:** Verificar se o período é sempre do mês atual
2. **Verificar Desconto:** Confirmar se adiantamentos do mês são descontados
3. **Data de Pagamento:** Confirmar se é 5º dia útil do mês seguinte
4. **Visualização:** Verificar se aparece corretamente no frontend

---

**Status:** ✅ Implementado  
**Build:** Em andamento  
**Próximo:** Teste em produção