# Exemplos: Comportamento Esperado - Geração de Holerites

## Cenários de Teste

### Cenário 1: Gerar Folha Mensal em Janeiro/2026

**Data Atual:** 21/01/2026 (terça-feira)

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Janeiro de 2026
Período: 01/01/2026 a 31/01/2026
Data de Pagamento: 06/02/2026 (5º dia útil de fevereiro)
```

**Cabeçalho do Holerite:**
```
FOLHA DE PAGAMENTO MENSAL
janeiro de 2026
```

**Logs do Servidor:**
```
📅 FOLHA MENSAL - Cálculo de Datas:
   Data Atual: 2026-01-21
   Mês Atual: 1/2026
   Período: 2026-01-01 a 2026-01-31
   Mês Referência: 2026-01
   ✅ Competência: 1/2026 (MÊS VIGENTE)
```

---

### Cenário 2: Gerar Folha Mensal no Último Dia do Mês

**Data Atual:** 31/01/2026 (sábado)

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Janeiro de 2026
Período: 01/01/2026 a 31/01/2026
Data de Pagamento: 06/02/2026
```

**Observação:** Mesmo no último dia do mês, a folha ainda é do mês vigente (Janeiro).

---

### Cenário 3: Gerar Folha Mensal no Primeiro Dia do Mês

**Data Atual:** 01/02/2026 (domingo)

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Fevereiro de 2026
Período: 01/02/2026 a 28/02/2026
Data de Pagamento: 05/03/2026 (5º dia útil de março)
```

**Cabeçalho do Holerite:**
```
FOLHA DE PAGAMENTO MENSAL
fevereiro de 2026
```

---

### Cenário 4: Virada de Ano - Dezembro para Janeiro

**Data Atual:** 28/12/2025 (domingo)

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Dezembro de 2025
Período: 01/12/2025 a 31/12/2025
Data de Pagamento: 07/01/2026 (5º dia útil de janeiro/2026)
```

**Depois, em 02/01/2026:**

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Janeiro de 2026
Período: 01/01/2026 a 31/01/2026
Data de Pagamento: 06/02/2026
```

---

### Cenário 5: Gerar Adiantamento Salarial

**Data Atual:** 21/01/2026 (após dia 15)

**Ação:** Admin clica em "Gerar Adiantamento (40%)"

**Resultado Esperado:**
```
Competência: Janeiro de 2026
Período: 15/01/2026 a 31/01/2026
Data de Pagamento: 20/01/2026
Valor: 40% do salário base
```

**Cabeçalho do Holerite:**
```
ADIANTAMENTO SALARIAL
janeiro de 2026
```

---

### Cenário 6: Gerar Adiantamento Antes do Dia 15

**Data Atual:** 10/01/2026 (antes do dia 15)

**Ação:** Admin clica em "Gerar Adiantamento (40%)"

**Resultado Esperado:**
```
Competência: Dezembro de 2025
Período: 15/12/2025 a 31/12/2025
Data de Pagamento: 20/12/2025
```

**Observação:** Antes do dia 15, o sistema gera adiantamento do mês anterior.

---

### Cenário 7: Folha Mensal com Desconto de Adiantamento

**Passo 1 - Data Atual:** 18/01/2026

**Ação:** Admin gera adiantamento

**Resultado:**
```
Adiantamento de Janeiro/2026
Valor: R$ 2.000,00 (40% de R$ 5.000,00)
```

**Passo 2 - Data Atual:** 25/01/2026

**Ação:** Admin gera folha mensal

**Resultado Esperado:**
```
Competência: Janeiro de 2026
Salário Base: R$ 5.000,00
Descontos:
  - INSS: R$ 461,50
  - IRRF: R$ 0,00
  - Adiantamento: R$ 2.000,00
Salário Líquido: R$ 2.538,50
```

**Observação:** O adiantamento de Janeiro é automaticamente descontado da folha mensal de Janeiro.

---

### Cenário 8: Mês com 28 Dias (Fevereiro)

**Data Atual:** 15/02/2026

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Fevereiro de 2026
Período: 01/02/2026 a 28/02/2026
Data de Pagamento: 05/03/2026
```

**Observação:** Sistema calcula automaticamente o último dia do mês (28 para fevereiro não-bissexto).

---

### Cenário 9: Mês com 30 Dias (Abril)

**Data Atual:** 15/04/2026

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Abril de 2026
Período: 01/04/2026 a 30/04/2026
Data de Pagamento: 07/05/2026
```

---

### Cenário 10: Mês com 31 Dias (Março)

**Data Atual:** 15/03/2026

**Ação:** Admin clica em "Gerar Folha Mensal"

**Resultado Esperado:**
```
Competência: Março de 2026
Período: 01/03/2026 a 31/03/2026
Data de Pagamento: 07/04/2026
```

---

## Validações Importantes

### ✅ Sempre Verdadeiro para Folha Mensal
1. `periodo_inicio` sempre é dia 1 do mês
2. `periodo_fim` sempre é o último dia do mês
3. `mes_referencia` sempre corresponde ao mês do `periodo_inicio`
4. `data_pagamento` sempre é no mês seguinte ao `periodo_fim`
5. Competência exibida sempre corresponde ao `periodo_inicio`

### ✅ Sempre Verdadeiro para Adiantamento
1. `periodo_inicio` sempre é dia 15
2. `periodo_fim` sempre é o último dia do mês
3. `data_pagamento` sempre é dia 20 do mesmo mês
4. Valor sempre é 40% do salário base
5. Sem descontos de INSS/IRRF

### ❌ Nunca Deve Acontecer
1. Folha mensal mostrando mês diferente do período
2. Competência do mês anterior quando gerado no mês atual
3. `periodo_inicio` diferente de dia 1 para folha mensal
4. `data_pagamento` no mesmo mês do `periodo_fim` para folha mensal
5. Adiantamento com descontos de INSS/IRRF

---

## Como Validar

### Validação Visual (Frontend)
1. Abrir holerite gerado
2. Verificar cabeçalho mostra mês correto
3. Verificar período está correto
4. Verificar data de pagamento está correta

### Validação Técnica (Logs)
1. Verificar logs do servidor
2. Confirmar que `mes_referencia` está correto
3. Confirmar que `periodo_inicio` e `periodo_fim` estão corretos

### Validação Banco de Dados
```sql
SELECT 
  id,
  periodo_inicio,
  periodo_fim,
  data_pagamento,
  EXTRACT(MONTH FROM periodo_inicio) as mes_competencia,
  EXTRACT(YEAR FROM periodo_inicio) as ano_competencia
FROM holerites
WHERE id = <holerite_id>;
```

Verificar que `mes_competencia` e `ano_competencia` correspondem ao esperado.

---

## Troubleshooting

Se algum cenário não se comportar como esperado, consulte:
- [TROUBLESHOOTING-COMPETENCIA-HOLERITE.md](docs/TROUBLESHOOTING-COMPETENCIA-HOLERITE.md)
- [CORRECAO-BUG-MES-REFERENCIA-HOLERITE-MENSAL.md](CORRECAO-BUG-MES-REFERENCIA-HOLERITE-MENSAL.md)

Ou execute o script de validação:
```bash
npx tsx scripts/validar-competencia-holerite.ts
```
