# Guia de Validação: Bases de Cálculo em Holerites

## 🎯 Objetivo

Validar que a seção "Bases de Cálculo" aparece APENAS em holerites de folha mensal para funcionários CLT.

---

## ✅ Cenário 1: Adiantamento CLT (NÃO deve mostrar bases)

### Passo 1: Gerar Adiantamento
1. Acessar **Admin → Holerites**
2. Clicar em **"💰 Gerar Adiantamento (40%)"**
3. Confirmar geração

### Passo 2: Visualizar Holerite
1. Encontrar holerite de adiantamento na lista
2. Clicar em **"👁️ Ver"**

### Passo 3: Validar

**✅ O que DEVE aparecer:**
```
┌─────────────────────────────────────────┐
│  💰 ADIANTAMENTO SALARIAL               │
│  janeiro de 2026                        │
│                                         │
│  Código: 123                            │
│  Nome: João Silva                       │
│  Cargo: Analista                        │
│  Período: 15/01/2026 a 31/01/2026       │
│                                         │
│  VENCIMENTOS:                           │
│  8781  DIAS NORMAIS    30,00  2.000,00  │
│                                         │
│  Total Vencimentos: R$ 2.000,00         │
│  Total Descontos: R$ 0,00               │
│  Valor Líquido: R$ 2.000,00             │
└─────────────────────────────────────────┘
```

**❌ O que NÃO deve aparecer:**
- Seção "Bases de Cálculo"
- INSS na tabela de descontos
- IRRF na tabela de descontos
- FGTS do Mês
- Base Cálc. IRRF
- Sal. Contr. INSS

### Passo 4: Verificar Logs
```
📄 Tipo de Holerite:
   Tipo Folha: Adiantamento Salarial
   É Adiantamento: true
   É Folha Mensal: false
   Tipo Contrato: CLT
   É PJ: false
   Mostrar Bases de Cálculo: false ✅
```

---

## ✅ Cenário 2: Folha Mensal PJ (NÃO deve mostrar bases)

### Passo 1: Identificar Funcionário PJ
1. Acessar **Admin → Funcionários**
2. Encontrar funcionário com **Tipo Contrato: PJ**
3. Anotar o nome

### Passo 2: Gerar Folha Mensal
1. Acessar **Admin → Holerites**
2. Clicar em **"📄 Gerar Folha Mensal"**
3. Confirmar geração

### Passo 3: Visualizar Holerite do PJ
1. Encontrar holerite do funcionário PJ
2. Clicar em **"👁️ Ver"**

### Passo 4: Validar

**✅ O que DEVE aparecer:**
```
┌─────────────────────────────────────────┐
│  📊 FOLHA MENSAL                        │
│  janeiro de 2026                        │
│                                         │
│  Código: 456                            │
│  Nome: Maria Santos (PJ)                │
│  Cargo: Consultor                       │
│  Período: 01/01/2026 a 31/01/2026       │
│                                         │
│  VENCIMENTOS:                           │
│  8781  DIAS NORMAIS    30,00  8.000,00  │
│                                         │
│  Total Vencimentos: R$ 8.000,00         │
│  Total Descontos: R$ 0,00               │
│  Valor Líquido: R$ 8.000,00             │
└─────────────────────────────────────────┘
```

**❌ O que NÃO deve aparecer:**
- Seção "Bases de Cálculo"
- INSS na tabela de descontos
- IRRF na tabela de descontos
- FGTS do Mês
- Base Cálc. IRRF
- Sal. Contr. INSS

### Passo 5: Verificar Logs
```
📄 Tipo de Holerite:
   Tipo Folha: Folha Mensal
   É Adiantamento: false
   É Folha Mensal: true
   Tipo Contrato: PJ
   É PJ: true
   Mostrar Bases de Cálculo: false ✅
```

---

## ✅ Cenário 3: Folha Mensal CLT (DEVE mostrar bases)

### Passo 1: Identificar Funcionário CLT
1. Acessar **Admin → Funcionários**
2. Encontrar funcionário com **Tipo Contrato: CLT**
3. Anotar o nome

### Passo 2: Gerar Folha Mensal
1. Acessar **Admin → Holerites**
2. Clicar em **"📄 Gerar Folha Mensal"**
3. Confirmar geração

### Passo 3: Visualizar Holerite do CLT
1. Encontrar holerite do funcionário CLT
2. Clicar em **"👁️ Ver"**

### Passo 4: Validar

**✅ O que DEVE aparecer:**
```
┌─────────────────────────────────────────┐
│  📊 FOLHA MENSAL                        │
│  janeiro de 2026                        │
│                                         │
│  Código: 789                            │
│  Nome: Pedro Costa (CLT)                │
│  Cargo: Analista                        │
│  Período: 01/01/2026 a 31/01/2026       │
│                                         │
│  VENCIMENTOS:                           │
│  8781  DIAS NORMAIS    30,00  5.000,00  │
│                                         │
│  DESCONTOS:                             │
│  998   I.N.S.S.        9,23      461,50 │
│  999   I.R.R.F.                    0,00 │
│  910   ADIANTAMENTO            2.000,00 │
│                                         │
│  Total Vencimentos: R$ 5.000,00         │
│  Total Descontos: R$ 2.461,50           │
│  Valor Líquido: R$ 2.538,50             │
│                                         │
│  ✅ BASES DE CÁLCULO:                   │
│  ┌────────────────────────────────────┐ │
│  │ Salário Base      │ R$ 5.000,00    │ │
│  │ Sal. Contr. INSS  │ R$ 5.000,00    │ │
│  │ Base Cálc. FGTS   │ R$ 5.000,00    │ │
│  │ F.G.T.S do Mês    │ R$ 400,00      │ │
│  │ Base Cálc. IRRF   │ R$ 4.538,50    │ │
│  │ Faixa IRRF        │ 0,00           │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**✅ O que DEVE aparecer:**
- Seção "Bases de Cálculo" ✅
- INSS calculado ✅
- IRRF calculado ✅
- FGTS do Mês (8% do salário) ✅
- Base Cálc. IRRF ✅
- Sal. Contr. INSS ✅

### Passo 5: Verificar Logs
```
📄 Tipo de Holerite:
   Tipo Folha: Folha Mensal
   É Adiantamento: false
   É Folha Mensal: true
   Tipo Contrato: CLT
   É PJ: false
   Mostrar Bases de Cálculo: true ✅
```

---

## 📊 Matriz de Validação

| Cenário | Tipo Holerite | Tipo Contrato | Bases de Cálculo | Status |
|---------|---------------|---------------|------------------|--------|
| 1       | Adiantamento  | CLT           | ❌ NÃO           | [ ]    |
| 2       | Adiantamento  | PJ            | ❌ NÃO           | [ ]    |
| 3       | Folha Mensal  | CLT           | ✅ SIM           | [ ]    |
| 4       | Folha Mensal  | PJ            | ❌ NÃO           | [ ]    |

---

## 🚨 Problemas Comuns

### Problema 1: Adiantamento mostrando bases

**Sintoma:** Holerite de adiantamento exibe "Bases de Cálculo"

**Diagnóstico:**
1. Verificar logs do servidor
2. Procurar por: `Mostrar Bases de Cálculo: true` (deveria ser false)

**Solução:**
1. Verificar se `diaInicio === 15` (adiantamento)
2. Verificar se `isAdiantamento === true`
3. Verificar se `mostrarBasesCalculo === false`

### Problema 2: PJ mostrando bases

**Sintoma:** Holerite de funcionário PJ exibe "Bases de Cálculo"

**Diagnóstico:**
1. Verificar logs do servidor
2. Procurar por: `Tipo Contrato: PJ` e `Mostrar Bases de Cálculo: true`

**Solução:**
1. Verificar se funcionário está cadastrado como PJ
2. Verificar se `isPJ === true`
3. Verificar se `mostrarBasesCalculo === false`

### Problema 3: CLT mensal NÃO mostrando bases

**Sintoma:** Holerite de folha mensal CLT NÃO exibe "Bases de Cálculo"

**Diagnóstico:**
1. Verificar logs do servidor
2. Procurar por: `Tipo Contrato: CLT`, `É Folha Mensal: true`, `Mostrar Bases de Cálculo: false`

**Solução:**
1. Verificar se é realmente folha mensal (não adiantamento)
2. Verificar se funcionário está cadastrado como CLT
3. Verificar lógica: `mostrarBasesCalculo = isFolhaMensal && !isPJ && !isAdiantamento`

---

## ✅ Checklist Final

### Validação Completa
- [ ] Adiantamento CLT sem bases
- [ ] Adiantamento PJ sem bases
- [ ] Folha Mensal CLT com bases
- [ ] Folha Mensal PJ sem bases
- [ ] Logs corretos para todos os cenários
- [ ] Valores calculados corretamente
- [ ] Visualização clara e sem confusão

### Documentação
- [ ] [CORRECAO-BASES-CALCULO-ADIANTAMENTO-PJ.md](CORRECAO-BASES-CALCULO-ADIANTAMENTO-PJ.md) lido
- [ ] [FUNCIONARIOS-PJ-SEM-DESCONTOS.md](docs/FUNCIONARIOS-PJ-SEM-DESCONTOS.md) consultado
- [ ] [SISTEMA-ADIANTAMENTO-SALARIAL.md](docs/SISTEMA-ADIANTAMENTO-SALARIAL.md) consultado

---

## 📞 Suporte

Se encontrar problemas:

1. **Coletar Logs**
   ```
   Procurar por: "📄 Tipo de Holerite:"
   ```

2. **Verificar Banco de Dados**
   ```sql
   SELECT 
     f.nome_completo,
     f.tipo_contrato,
     h.periodo_inicio,
     h.periodo_fim,
     h.inss,
     h.irrf
   FROM holerites h
   JOIN funcionarios f ON h.funcionario_id = f.id
   WHERE h.id = <holerite_id>;
   ```

3. **Reportar com Detalhes**
   - Screenshot do holerite
   - Logs do servidor
   - Tipo de contrato do funcionário
   - Tipo de holerite (adiantamento/mensal)

---

**Última Atualização:** 21/01/2026  
**Versão:** 1.0.0
