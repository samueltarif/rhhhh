# ✅ Checklist Rápido de Validação - ATUALIZADO

## 🎯 Validação em 5 Minutos

### 1️⃣ Testar Competência (2 min)

```bash
# Executar script de validação
npx tsx scripts/validar-competencia-holerite.ts
```

**Resultado Esperado:**
```
✅ TODOS OS TESTES PASSARAM!
✅ Sistema está gerando holerites com competência correta!
```

---

### 2️⃣ Testar Adiantamento (1 min)

1. Acessar `/admin/holerites`
2. Clicar "💰 Gerar Adiantamento"
3. Visualizar holerite gerado

**✅ Deve ter:**
- Cabeçalho: "ADIANTAMENTO SALARIAL"
- Mês correto (ex: "janeiro de 2026")
- Descontos: R$ 0,00
- Líquido = Valor do adiantamento

**❌ NÃO deve ter:**
- Seção "Bases de Cálculo"
- INSS/IRRF na tabela

---

### 3️⃣ Testar Folha Mensal CLT (1 min)

1. Gerar folha mensal
2. Visualizar holerite de funcionário CLT

**✅ Deve ter:**
- Cabeçalho: "FOLHA MENSAL"
- Mês correto
- Descontos calculados (INSS, IRRF)
- Seção "Bases de Cálculo" ✅

---

### 4️⃣ Testar Folha Mensal PJ (1 min) - **CORRIGIDO**

1. Visualizar holerite de funcionário PJ

**✅ Deve ter:**
- Cabeçalho: "FOLHA MENSAL"
- Mês correto
- Descontos: R$ 0,00

**❌ NÃO deve ter:**
- Seção "Bases de Cálculo" ✅ **CORRIGIDO**
- INSS/IRRF

---

## 📋 Checklist Completo

- [ ] Script de validação passou
- [ ] Adiantamento sem bases
- [ ] Folha CLT com bases
- [ ] **Folha PJ sem bases** ✅ **CORRIGIDO**
- [ ] Mês correto em todos
- [ ] Logs sem erros

---

## 🔧 Correção Aplicada

### Problema Resolvido
✅ **Funcionários PJ não mostram mais "Bases de Cálculo"**

### Arquivo Corrigido
- `server/api/holerites/[id]/html.get.ts` - Adicionado `tipo_contrato`

### Como Funciona Agora
```typescript
// Lógica no holeriteHTML.ts
const isPJ = tipoContrato === 'PJ'
const mostrarBasesCalculo = isFolhaMensal && !isPJ && !isAdiantamento

// Resultado:
// PJ + Folha Mensal = SEM bases ✅
// CLT + Folha Mensal = COM bases ✅
// Qualquer + Adiantamento = SEM bases ✅
```

---

## 🚨 Se algo falhar

1. **Verificar logs do servidor**
   - Procurar: `Tipo Contrato: PJ`
   - Procurar: `Mostrar Bases de Cálculo: false`

2. **Consultar:** [CORRECAO-PJ-BASES-CALCULO-FINAL.md](CORRECAO-PJ-BASES-CALCULO-FINAL.md)

3. **Reportar com:** Screenshots + Logs + Tipo de funcionário

---

## 📚 Documentação Completa

- [CORRECAO-PJ-BASES-CALCULO-FINAL.md](CORRECAO-PJ-BASES-CALCULO-FINAL.md) - **NOVA CORREÇÃO**
- [RESUMO-FINAL-CORRECOES-21-01-2026.md](RESUMO-FINAL-CORRECOES-21-01-2026.md)
- [GUIA-VISUAL-VALIDACAO-HOLERITES.md](GUIA-VISUAL-VALIDACAO-HOLERITES.md)
- [GUIA-VALIDACAO-BASES-CALCULO.md](GUIA-VALIDACAO-BASES-CALCULO.md)
