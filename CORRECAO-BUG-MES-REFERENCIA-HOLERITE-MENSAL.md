# Correção: Bug no Mês de Referência do Holerite Mensal

**Data:** 21/01/2026  
**Problema:** Ao gerar holerite mensal, o documento exibe o mês anterior ao invés do mês selecionado/gerado

## Problema Identificado

### Sintoma
- Usuário gera holerite mensal de Janeiro/2026
- Sistema exibe "Dezembro/2025" no cabeçalho do holerite
- Competência incorreta no PDF e visualização

### Causa Raiz
A função `gerarHoleriteHTML()` em `server/utils/holeriteHTML.ts` está usando `periodoInicio` para extrair o mês de referência:

```typescript
const mesAno = periodoInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
```

Quando o `periodo_inicio` está incorreto ou quando há alguma lógica que subtrai um mês, o cabeçalho mostra o mês errado.

## Análise do Código Atual

### Arquivo: `server/api/holerites/gerar.post.ts`

A função `calcularDatasHolerite()` para folha mensal está correta:
```typescript
// Sempre gerar folha mensal do mês atual
const periodoInicio = new Date(anoAtual, mesAtual - 1, 1)
const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate()
const periodoFim = new Date(anoAtual, mesAtual - 1, ultimoDiaMes)
```

**Problema:** O código está correto, mas precisa garantir que:
1. Não há override manual incorreto das datas
2. A visualização usa a data correta
3. Não há lógica de "mês anterior" em nenhum lugar

## Correções Necessárias

### 1. Garantir que `periodo_inicio` sempre reflete o mês correto
### 2. Adicionar validação no frontend
### 3. Adicionar logs para debug
### 4. Criar testes automatizados

## Arquivos Corrigidos

1. ✅ `server/api/holerites/gerar.post.ts` - Adicionados logs detalhados
2. ✅ `server/utils/dateUtils.ts` - Adicionados logs detalhados
3. ✅ `server/utils/holeriteHTML.ts` - Corrigido parsing de datas e adicionados logs
4. ✅ `server/utils/__tests__/dateUtils.test.ts` - Criados testes automatizados

## Implementação Realizada

### ✅ Passo 1: Logs Detalhados Adicionados
Adicionados logs em todos os pontos críticos:
- Cálculo de datas na API de geração
- Cálculo de datas no utilitário dateUtils
- Geração do HTML do holerite

### ✅ Passo 2: Correção no Parsing de Datas
Corrigido o parsing de datas no `holeriteHTML.ts`:
```typescript
// ANTES
const periodoInicio = new Date(holerite.periodo_inicio)

// DEPOIS
const periodoInicio = new Date(holerite.periodo_inicio + 'T00:00:00')
```

Isso garante que a data seja interpretada no timezone local, evitando problemas de offset.

### ✅ Passo 3: Testes Automatizados Criados
Criado arquivo de testes com cobertura para:
- Geração de folha mensal no mês vigente
- Virada de ano (Dezembro → Janeiro)
- Virada de mês comum
- Consistência entre `periodo_inicio` e `mes_referencia`
- Validação de data de pagamento

### ✅ Passo 4: Documentação Atualizada
Este documento serve como referência para o comportamento esperado.

## Mudanças Específicas

### 1. server/utils/holeriteHTML.ts
**Problema:** Parsing de data sem timezone causava offset de 1 dia
**Solução:** Adicionar 'T00:00:00' ao fazer parse da data

### 2. Logs de Debug
Todos os arquivos agora incluem logs detalhados:
```
📅 FOLHA MENSAL - Cálculo de Datas:
   Data Atual: 2026-01-21
   Mês Atual: 1/2026
   Período: 2026-01-01 a 2026-01-31
   Mês Referência: 2026-01
   ✅ Competência: 1/2026 (MÊS VIGENTE)
```

### 3. Testes Automatizados
Arquivo: `server/utils/__tests__/dateUtils.test.ts`
- Valida que folha mensal sempre usa mês vigente
- Testa virada de ano
- Garante consistência entre campos

## Como Testar

### Teste Manual
1. Acessar `/admin/holerites`
2. Clicar em "Gerar Folha Mensal"
3. Verificar nos logs do servidor:
   - Mês de referência deve ser o mês atual
   - Período deve ser do dia 1 ao último dia do mês atual
4. Visualizar o holerite gerado
5. Confirmar que o cabeçalho mostra o mês correto

### Teste Automatizado
```bash
npm run test server/utils/__tests__/dateUtils.test.ts
```

## Critérios de Aceitação

- ✅ Gerar holerite mensal de Janeiro/2026 mostra "janeiro de 2026"
- ✅ Gerar holerite mensal de Dezembro/2025 mostra "dezembro de 2025"
- ✅ Virada de ano funciona corretamente
- ✅ Logs mostram competência correta
- ✅ Testes automatizados passam

---

**Status:** ✅ Implementado  
**Prioridade:** 🔴 Alta  
**Impacto:** Crítico - Afeta todos os holerites mensais  
**Próximo Passo:** Deploy e validação em produção
