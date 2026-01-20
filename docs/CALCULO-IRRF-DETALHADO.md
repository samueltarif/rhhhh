# CÁLCULO DETALHADO DO IRRF NO SISTEMA

## 🎯 VISÃO GERAL

O sistema implementa um cálculo de IRRF **híbrido** que combina:
1. **Isenção CLT** até R$ 5.000,00 (base IRRF)
2. **Faixa de transição** com redutor (R$ 5.000,01 a R$ 7.350,00)
3. **Tabela progressiva normal** acima de R$ 7.350,00

---

## 📊 PASSO A PASSO DO CÁLCULO

### **ETAPA 1: CALCULAR A BASE DO IRRF**

```
Base IRRF = Salário Bruto - INSS - Dedução Dependentes - Pensão Alimentícia
```

**Componentes:**
- **Salário Bruto:** Salário base do funcionário
- **INSS:** Calculado pela tabela progressiva 2025
- **Dedução Dependentes:** R$ 189,59 × número de dependentes
- **Pensão Alimentícia:** Valor fixo (se houver)

**Exemplo:**
- Salário: R$ 6.000,00
- INSS: R$ 649,60
- Dependentes: 2 × R$ 189,59 = R$ 379,18
- Pensão: R$ 500,00
- **Base IRRF:** R$ 6.000 - R$ 649,60 - R$ 379,18 - R$ 500,00 = **R$ 4.471,22**

---

### **ETAPA 2: APLICAR AS REGRAS DE CÁLCULO**

## 🟢 **REGRA 1: ISENÇÃO CLT (Base IRRF ≤ R$ 5.000,00)**

```javascript
if (baseIRRF <= 5000.00) {
  irrf = 0
  aliquotaIRRF = 0
  faixaIRRF = 'Isento CLT (até R$ 5.000,00)'
}
```

**Características:**
- ✅ **IRRF = R$ 0,00**
- ✅ **Alíquota = 0%**
- ✅ **Aplicável para a maioria dos funcionários CLT**

**Exemplo:**
- Base IRRF: R$ 4.471,22 ≤ R$ 5.000,00
- **Resultado: ISENTO (R$ 0,00)**

---

## 🟡 **REGRA 2: FAIXA DE TRANSIÇÃO (R$ 5.000,01 a R$ 7.350,00)**

```javascript
else if (baseIRRF <= 7350.00) {
  // 1. Calcular IR pela tabela progressiva normal
  let irrfTabela = calcularTabelaNormal(baseIRRF)
  
  // 2. Aplicar redutor progressivo
  const fatorReducao = (baseIRRF - 5000.00) / (7350.00 - 5000.00)
  irrf = irrfTabela * fatorReducao
}
```

**Características:**
- 🔄 **Calcula pela tabela normal primeiro**
- 📉 **Aplica redutor progressivo**
- 🎯 **Transição suave entre isenção e tabela normal**

**Exemplo (Base IRRF: R$ 6.000,00):**
1. **IR Tabela Normal:** R$ 518,56 (15% - R$ 381,44)
2. **Fator Redução:** (6.000 - 5.000) ÷ (7.350 - 5.000) = 42,55%
3. **IR Final:** R$ 518,56 × 42,55% = **R$ 220,65**

---

## 🔴 **REGRA 3: TABELA PROGRESSIVA NORMAL (Base IRRF > R$ 7.350,00)**

```javascript
else {
  // Aplicar tabela progressiva oficial do IR
  if (baseIRRF <= 2259.20) {
    irrf = 0
  } else if (baseIRRF <= 2826.65) {
    irrf = (baseIRRF * 0.075) - 169.44
  } else if (baseIRRF <= 3751.05) {
    irrf = (baseIRRF * 0.15) - 381.44
  } else if (baseIRRF <= 4664.68) {
    irrf = (baseIRRF * 0.225) - 662.77
  } else {
    irrf = (baseIRRF * 0.275) - 896.00
  }
}
```

**Faixas da Tabela Progressiva 2026:**
| Base IRRF | Alíquota | Dedução | Exemplo |
|-----------|----------|---------|---------|
| Até R$ 2.259,20 | 0% | R$ 0,00 | R$ 0,00 |
| R$ 2.259,21 a R$ 2.826,65 | 7,5% | R$ 169,44 | R$ 42,56 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 381,44 | R$ 181,06 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 662,77 | R$ 181,06 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 | R$ 387,29 |

---

## 🧮 EXEMPLOS PRÁTICOS

### **Exemplo 1: Funcionário com Salário R$ 3.000,00**
```
1. Salário Bruto: R$ 3.000,00
2. INSS (9%): R$ 270,00
3. Dependentes: 0 × R$ 189,59 = R$ 0,00
4. Pensão: R$ 0,00
5. Base IRRF: R$ 3.000 - R$ 270 = R$ 2.730,00
6. Regra: Base ≤ R$ 5.000 → ISENTO
7. IRRF: R$ 0,00
```

### **Exemplo 2: Funcionário com Salário R$ 8.000,00**
```
1. Salário Bruto: R$ 8.000,00
2. INSS (teto): R$ 908,85
3. Dependentes: 1 × R$ 189,59 = R$ 189,59
4. Pensão: R$ 0,00
5. Base IRRF: R$ 8.000 - R$ 908,85 - R$ 189,59 = R$ 6.901,56
6. Regra: R$ 5.000 < Base ≤ R$ 7.350 → TRANSIÇÃO
7. IR Tabela: (R$ 6.901,56 × 27,5%) - R$ 896 = R$ 1.002,43
8. Fator Redução: (6.901,56 - 5.000) ÷ 2.350 = 80,9%
9. IRRF Final: R$ 1.002,43 × 80,9% = R$ 811,96
```

### **Exemplo 3: Funcionário com Salário R$ 12.000,00**
```
1. Salário Bruto: R$ 12.000,00
2. INSS (teto): R$ 908,85
3. Dependentes: 0 × R$ 189,59 = R$ 0,00
4. Pensão: R$ 0,00
5. Base IRRF: R$ 12.000 - R$ 908,85 = R$ 11.091,15
6. Regra: Base > R$ 7.350 → TABELA NORMAL
7. IRRF: (R$ 11.091,15 × 27,5%) - R$ 896 = R$ 2.154,07
```

---

## 🔍 DETALHES TÉCNICOS

### **Cálculo do INSS (Base para IRRF):**
```javascript
// Tabela INSS 2025
if (salarioBase <= 1518.00) {
  inss = salarioBase * 0.075 // 7,5%
} else if (salarioBase <= 2793.88) {
  inss = 1518.00 * 0.075 + (salarioBase - 1518.00) * 0.09 // 9%
} else if (salarioBase <= 4190.83) {
  inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (salarioBase - 2793.88) * 0.12 // 12%
} else if (salarioBase <= 8157.41) {
  inss = 1518.00 * 0.075 + (2793.88 - 1518.00) * 0.09 + (4190.83 - 2793.88) * 0.12 + (salarioBase - 4190.83) * 0.14 // 14%
} else {
  inss = 908.85 // Teto máximo
}
```

### **Fator de Redução (Transição):**
```javascript
const fatorReducao = (baseIRRF - 5000.00) / (7350.00 - 5000.00)
// Varia de 0% (base = R$ 5.000) a 100% (base = R$ 7.350)
```

### **Arredondamento:**
```javascript
irrf = Math.max(0, Math.round(irrf * 100) / 100)
// Sempre positivo e arredondado para 2 casas decimais
```

---

## 📋 VARIÁVEIS CONSIDERADAS

### **Dados do Funcionário:**
- ✅ **Salário Base:** Campo `salario_base`
- ✅ **Número de Dependentes:** Campo `numero_dependentes`
- ✅ **Pensão Alimentícia:** Campo `pensao_alimenticia`

### **Valores Calculados:**
- ✅ **INSS:** Calculado pela tabela progressiva
- ✅ **Base IRRF:** Salário - INSS - Dependentes - Pensão
- ✅ **Alíquota Efetiva:** Percentual real aplicado
- ✅ **Faixa IRRF:** Classificação da regra aplicada

---

## 🎯 VANTAGENS DO SISTEMA

### **1. Isenção CLT Ampliada:**
- Funcionários com base IRRF até R$ 5.000 ficam isentos
- Beneficia a maioria dos trabalhadores CLT

### **2. Transição Suave:**
- Evita "salto" brusco de R$ 0 para valor alto
- Aplicação gradual do imposto

### **3. Conformidade Legal:**
- Usa tabela oficial do IR 2026
- Considera todas as deduções legais
- Cálculo preciso e auditável

---

## 🧪 TESTE DO CÁLCULO

Para testar o cálculo com diferentes cenários:

```bash
node testar-calculo-irrf-2026.mjs
```

Este script testa:
- ✅ Funcionários isentos
- ✅ Funcionários na faixa de transição
- ✅ Funcionários na tabela normal
- ✅ Diferentes números de dependentes
- ✅ Com e sem pensão alimentícia

---

## 📊 RESUMO EXECUTIVO

**O sistema implementa um cálculo de IRRF mais benéfico para funcionários CLT, mantendo conformidade legal e oferecendo transição suave entre as faixas de tributação.**

**Resultado:** Funcionários pagam menos IR que na tabela padrão, especialmente na faixa de R$ 5.000 a R$ 7.350 de base IRRF.