# Sistema de Datas Automáticas para Holerites

## Visão Geral

O sistema agora calcula automaticamente as datas de geração e pagamento dos holerites baseado na data atual e no tipo de holerite solicitado.

## Regras Implementadas

### 1. Holerite de Adiantamento Salarial

**Quando gerar entre dia 15 e último dia do mês:**
- Gera holerite de adiantamento do **mês vigente**
- Período: 1º ao 15º dia do mês atual
- Data de pagamento: dia 20 do mês atual

**Quando gerar antes do dia 15:**
- Gera holerite de adiantamento do **mês anterior**
- Período: 1º ao 15º dia do mês anterior
- Data de pagamento: dia 20 do mês anterior

### 2. Holerite de Folha Mensal

**Quando gerar entre dia 1 e 25 do mês:**
- Gera holerite mensal do **mês vigente**
- Período: 1º ao último dia do mês atual
- Data de pagamento: 5º dia útil do mês atual

**Quando gerar após dia 25:**
- Gera holerite mensal do **mês anterior**
- Período: 1º ao último dia do mês anterior
- Data de pagamento: 5º dia útil do mês anterior

## Exemplo Prático (21/01/2026)

### Adiantamento
```json
{
  "periodo_inicio": "2026-01-01",
  "periodo_fim": "2026-01-15",
  "data_pagamento": "2026-01-20",
  "mes_referencia": "1/2026",
  "descricao": "Adiantamento 1/2026 - Pagamento dia 20"
}
```

### Folha Mensal
```json
{
  "periodo_inicio": "2026-01-01",
  "periodo_fim": "2026-01-31",
  "data_pagamento": "2026-01-07",
  "mes_referencia": "1/2026",
  "descricao": "Folha Mensal 1/2026 - Pagamento 7/1 (5º dia útil)"
}
```

## Cálculo do 5º Dia Útil

O sistema calcula automaticamente o 5º dia útil de cada mês, considerando:
- Segunda a sexta-feira como dias úteis
- Sábados e domingos como não úteis
- **Nota:** Feriados não são considerados (pode ser implementado futuramente)

### Exemplos de 5º Dia Útil em 2026:
- Janeiro: 7/01 (terça-feira)
- Fevereiro: 6/02 (sexta-feira)
- Março: 6/03 (sexta-feira)

## Como Usar na API

### Geração Automática (Padrão)
```javascript
// As datas são calculadas automaticamente
const response = await fetch('/api/holerites/gerar', {
  method: 'POST',
  body: JSON.stringify({
    tipo: 'adiantamento', // ou 'mensal'
    funcionario_ids: [1, 2, 3]
  })
})
```

### Override Manual (Opcional)
```javascript
// Forçar datas específicas se necessário
const response = await fetch('/api/holerites/gerar', {
  method: 'POST',
  body: JSON.stringify({
    tipo: 'mensal',
    funcionario_ids: [1, 2, 3],
    periodo_inicio_manual: '2026-01-01',
    periodo_fim_manual: '2026-01-31',
    data_pagamento_manual: '2026-01-10'
  })
})
```

## Benefícios

1. **Automatização**: Não é mais necessário calcular datas manualmente
2. **Consistência**: Sempre segue as regras de negócio da empresa
3. **Flexibilidade**: Permite override manual quando necessário
4. **Auditoria**: Logs detalhados mostram como as datas foram calculadas

## Arquivos Modificados

- `server/utils/datasHolerite.ts` - Lógica de cálculo das datas
- `server/api/holerites/gerar.post.ts` - Integração com a API de geração
- `docs/DATAS-AUTOMATICAS-HOLERITES.md` - Esta documentação

## Próximos Passos

1. **Feriados**: Implementar consideração de feriados no cálculo de dias úteis
2. **Configuração**: Permitir configurar regras por empresa
3. **Interface**: Atualizar frontend para mostrar as datas calculadas
4. **Validação**: Adicionar validações para períodos inválidos