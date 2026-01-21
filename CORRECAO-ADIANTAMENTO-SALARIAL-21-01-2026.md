# Correção de Inconsistências no Adiantamento Salarial

**Data:** 21/01/2026  
**Problema:** Duas inconsistências identificadas no sistema de holerites de adiantamento salarial

## Problemas Identificados

### 1. Período de Referência Incorreto
- **Problema:** Adiantamentos estavam sendo exibidos com período de referência errado
- **Esperado:** Período do dia 15 ao último dia do mês vigente
- **Encontrado:** Sistema já estava correto nos arquivos de backend

### 2. Descrição Incorreta como "Folha Mensal"
- **Problema:** Adiantamentos apareciam com descrição "Folha Mensal" em vez de "Adiantamento Salarial"
- **Causa:** Lógica de identificação de adiantamento no frontend estava incorreta

## Correções Aplicadas

### 1. Arquivo: `app/pages/holerites.vue`
**Localização:** Linha ~180-190  
**Alteração:** Corrigida a lógica de identificação de adiantamento

```javascript
// ANTES
if (diaInicio === 1 && diaFim <= 15) {
  tipo = 'Quinzenal'
  quinzena = 1
  referencia += ' - 1ª Quinzena'
}

// DEPOIS
if (diaInicio === 15) {
  // Adiantamento salarial: período do dia 15 ao último dia do mês
  tipo = 'Adiantamento'
  quinzena = 1
  referencia = `Adiantamento Salarial ${periodoInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
}
```

## Arquivos Verificados (Já Corretos)

### 1. `server/api/holerites/gerar.post.ts`
- ✅ Período de referência correto: dia 15 ao último dia do mês
- ✅ Lógica de cálculo de datas correta

### 2. `server/utils/holeriteHTML.ts`
- ✅ Template HTML identifica corretamente adiantamentos (diaInicio === 15)
- ✅ Exibe "Adiantamento Salarial" para períodos que começam no dia 15

### 3. `server/utils/dateUtils.ts`
- ✅ Função `calcularDatasHolerite()` com lógica correta para adiantamentos

### 4. `app/composables/useHolerites.ts`
- ✅ Função `isAdiantamento()` identifica corretamente períodos que começam no dia 15

### 5. `app/components/holerites/HoleriteCard.vue`
- ✅ Componente identifica corretamente adiantamentos baseado no período

## Regras de Negócio Confirmadas

### Adiantamento Salarial
- **Período de Referência:** Dia 15 ao último dia do mês vigente
- **Valor:** 40% do salário base (sem descontos)
- **Data de Pagamento:** Dia 20 do mês vigente
- **Identificação:** Período que inicia no dia 15

### Folha Mensal
- **Período de Referência:** Dia 1 ao último dia do mês
- **Valor:** Salário integral com todos os descontos
- **Data de Pagamento:** 5º dia útil do mês seguinte
- **Identificação:** Período que inicia no dia 1

## Resultado

Após as correções:
- ✅ Adiantamentos agora aparecem com a descrição correta: "Adiantamento Salarial"
- ✅ Período de referência exibido corretamente: "15/XX/XXXX até XX/XX/XXXX"
- ✅ Diferenciação visual entre adiantamento (laranja) e folha mensal (azul)
- ✅ Build do sistema executado com sucesso

## Teste Recomendado

1. Gerar um holerite de adiantamento no painel admin
2. Verificar se aparece como "Adiantamento Salarial" (não "Folha Mensal")
3. Confirmar se o período de referência está correto (dia 15 ao último dia do mês)
4. Verificar a visualização no perfil do funcionário