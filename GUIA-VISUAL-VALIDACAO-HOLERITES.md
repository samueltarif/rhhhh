# Guia Visual: Como Validar Holerites Após Correção

## 🎯 Objetivo

Este guia mostra visualmente como validar que os holerites estão sendo gerados com a competência correta.

---

## ✅ Passo 1: Acessar Gestão de Holerites

1. Fazer login como **Admin**
2. Navegar para **Admin → Holerites**
3. Você verá a tela de gestão de holerites

---

## ✅ Passo 2: Gerar Folha Mensal

1. Clicar no botão **"📄 Gerar Folha Mensal"**
2. Uma modal será aberta com informações sobre a geração
3. Verificar a mensagem:

```
📄 Folha de Pagamento Mensal:
• Gerar holerites completos para todos os funcionários ativos
• Data automática: Entre dia 01 e 25 do mês → gera folha do mês vigente
• Pagamento: 5º dia útil do mês vigente
• Cálculos automáticos de INSS, IRRF e descontos
• Desconto automático de adiantamentos já pagos
```

4. Clicar em **"✓ Confirmar Geração"**

---

## ✅ Passo 3: Verificar Logs do Servidor

### No Terminal/Console do Servidor:

Procure por logs como este:

```
📅 FOLHA MENSAL - Cálculo de Datas:
   Data Atual: 2026-01-21
   Mês Atual: 1/2026
   Período: 2026-01-01 a 2026-01-31
   Mês Referência: 2026-01
   ✅ Competência: 1/2026 (MÊS VIGENTE)
```

### ✅ O que verificar:
- [ ] "Mês Atual" mostra o mês correto (ex: 1/2026 para Janeiro)
- [ ] "Período" começa no dia 1 do mês atual
- [ ] "Período" termina no último dia do mês atual
- [ ] "Mês Referência" corresponde ao mês atual
- [ ] Aparece "✅ Competência: X/2026 (MÊS VIGENTE)"

### ❌ Sinais de Problema:
- "Mês Referência" diferente do "Mês Atual"
- Período começando em mês diferente
- Mensagem de erro nos logs

---

## ✅ Passo 4: Visualizar Holerite Gerado

1. Na lista de holerites, encontre o holerite recém-gerado
2. Clicar no botão **"👁️ Ver"**
3. O holerite será exibido em uma modal

### O que verificar no Cabeçalho:

```
┌─────────────────────────────────────────┐
│  EMPRESA XYZ LTDA                       │
│  CNPJ: 12.345.678/0001-90               │
│                                         │
│           📊 FOLHA MENSAL               │
│           janeiro de 2026               │ ← VERIFICAR AQUI
└─────────────────────────────────────────┘
```

### ✅ Validações:
- [ ] Mês exibido corresponde ao mês atual
- [ ] Ano está correto
- [ ] Tipo de folha está correto ("FOLHA MENSAL" ou "ADIANTAMENTO SALARIAL")

### ❌ Sinais de Problema:
- Mês exibido é diferente do mês atual
- Mostra mês anterior (ex: "dezembro de 2025" quando deveria ser "janeiro de 2026")

---

## ✅ Passo 5: Verificar Detalhes do Período

No corpo do holerite, procure pela seção de informações:

```
┌─────────────────────────────────────────┐
│  Código: 123                            │
│  Nome: João da Silva                    │
│  Cargo: Analista                        │
│  Período: 01/01/2026 a 31/01/2026       │ ← VERIFICAR AQUI
│  Data Pagamento: 06/02/2026             │ ← VERIFICAR AQUI
└─────────────────────────────────────────┘
```

### ✅ Validações:
- [ ] Período começa no dia 1 do mês atual
- [ ] Período termina no último dia do mês atual
- [ ] Data de pagamento é no mês seguinte
- [ ] Data de pagamento é um dia útil (segunda a sexta)

---

## ✅ Passo 6: Validar Múltiplos Cenários

### Cenário A: Gerar no Meio do Mês
**Data:** 15/01/2026  
**Esperado:** Holerite de Janeiro/2026

### Cenário B: Gerar no Final do Mês
**Data:** 31/01/2026  
**Esperado:** Holerite de Janeiro/2026 (ainda do mês vigente)

### Cenário C: Gerar no Início do Mês Seguinte
**Data:** 01/02/2026  
**Esperado:** Holerite de Fevereiro/2026 (novo mês)

### Cenário D: Virada de Ano
**Data:** 31/12/2025  
**Esperado:** Holerite de Dezembro/2025

**Data:** 01/01/2026  
**Esperado:** Holerite de Janeiro/2026

---

## ✅ Passo 7: Validar Adiantamento

1. Clicar em **"💰 Gerar Adiantamento (40%)"**
2. Verificar modal de confirmação
3. Gerar adiantamento

### O que verificar:

```
┌─────────────────────────────────────────┐
│  EMPRESA XYZ LTDA                       │
│                                         │
│     💰 ADIANTAMENTO SALARIAL            │
│           janeiro de 2026               │ ← VERIFICAR AQUI
│                                         │
│  Período: 15/01/2026 a 31/01/2026       │ ← Começa dia 15
│  Pagamento: 20/01/2026                  │ ← Dia 20
└─────────────────────────────────────────┘
```

### ✅ Validações:
- [ ] Mês exibido está correto
- [ ] Período começa no dia 15
- [ ] Período termina no último dia do mês
- [ ] Data de pagamento é dia 20
- [ ] Valor é 40% do salário base
- [ ] Sem descontos de INSS/IRRF

---

## ✅ Passo 8: Executar Script de Validação

### No Terminal:

```bash
npx tsx scripts/validar-competencia-holerite.ts
```

### Resultado Esperado:

```
🔍 Validando Competência de Holerites

============================================================

📄 TESTE 1: Folha Mensal
------------------------------------------------------------
✅ PASSOU: Competência está correta!

💰 TESTE 2: Adiantamento Salarial
------------------------------------------------------------
✅ PASSOU: Adiantamento começa no dia 15
✅ PASSOU: Pagamento no dia 20

🔄 TESTE 3: Consistência entre Campos
------------------------------------------------------------
✅ PASSOU: mes_referencia consistente com periodo_inicio
✅ PASSOU: Folha mensal começa no dia 1
✅ PASSOU: Data de pagamento no mês seguinte

============================================================
✅ TODOS OS TESTES PASSARAM!
============================================================
```

---

## 🚨 O que fazer se encontrar problemas

### Problema 1: Mês Errado no Cabeçalho

**Sintoma:** Holerite mostra "dezembro de 2025" quando deveria mostrar "janeiro de 2026"

**Ação:**
1. Verificar logs do servidor
2. Executar script de validação
3. Consultar [TROUBLESHOOTING-COMPETENCIA-HOLERITE.md](docs/TROUBLESHOOTING-COMPETENCIA-HOLERITE.md)
4. Reportar com screenshots e logs

### Problema 2: Período Incorreto

**Sintoma:** Período não começa no dia 1 ou não termina no último dia do mês

**Ação:**
1. Verificar se é adiantamento (começa dia 15) ou folha mensal (começa dia 1)
2. Verificar logs do servidor
3. Reportar com detalhes

### Problema 3: Data de Pagamento Errada

**Sintoma:** Data de pagamento não é no mês seguinte ou não é dia útil

**Ação:**
1. Verificar se é 5º dia útil do mês seguinte
2. Considerar feriados (não implementado ainda)
3. Reportar se estiver claramente errado

---

## 📊 Checklist de Validação Completa

### Folha Mensal
- [ ] Cabeçalho mostra mês correto
- [ ] Período: 01/XX/YYYY a último dia/XX/YYYY
- [ ] Data pagamento: mês seguinte
- [ ] Logs mostram "MÊS VIGENTE"
- [ ] Script de validação passa

### Adiantamento
- [ ] Cabeçalho mostra mês correto
- [ ] Período: 15/XX/YYYY a último dia/XX/YYYY
- [ ] Data pagamento: 20/XX/YYYY
- [ ] Valor: 40% do salário
- [ ] Sem INSS/IRRF

### Virada de Mês
- [ ] Último dia do mês: folha do mês atual
- [ ] Primeiro dia do mês: folha do novo mês
- [ ] Transição suave entre meses

### Virada de Ano
- [ ] Dezembro/2025 → Janeiro/2026
- [ ] Ano muda corretamente
- [ ] Mês volta para 1 (Janeiro)

---

## ✅ Conclusão

Se todos os itens acima estiverem corretos, o sistema está funcionando perfeitamente!

**Dúvidas?** Consulte a documentação completa:
- [RESUMO-EXECUTIVO-CORRECAO-HOLERITES.md](RESUMO-EXECUTIVO-CORRECAO-HOLERITES.md)
- [EXEMPLOS-COMPORTAMENTO-ESPERADO-HOLERITES.md](EXEMPLOS-COMPORTAMENTO-ESPERADO-HOLERITES.md)
- [TROUBLESHOOTING-COMPETENCIA-HOLERITE.md](docs/TROUBLESHOOTING-COMPETENCIA-HOLERITE.md)
