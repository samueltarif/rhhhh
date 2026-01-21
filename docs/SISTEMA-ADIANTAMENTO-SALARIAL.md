# 💰 Sistema de Adiantamento Salarial

## 🎯 Funcionalidade

Sistema que permite gerar adiantamentos salariais de 40% do salário base, que são automaticamente descontados na folha de pagamento mensal.

## ✨ Como Funciona

### 1. Geração de Adiantamento (40%)

**Quando:** Segunda quinzena do mês (período de 15 ao último dia do mês)

**Período de Referência:** Do dia 15 ao último dia do mês vigente

**Cálculo:**
```
Adiantamento = Salário Base × 40%
```

**Características:**
- ✅ Sem desconto de INSS
- ✅ Sem desconto de IRRF
- ✅ Sem benefícios ou descontos personalizados
- ✅ Valor líquido = 40% do salário base
- ✅ Período: 15/MM/AAAA até último dia do mês

**Exemplo:**
```
Salário Base: R$ 5.000,00
Adiantamento: R$ 5.000,00 × 40% = R$ 2.000,00
Valor a Receber: R$ 2.000,00
Período: 15/01/2026 a 31/01/2026
```

### 2. Folha de Pagamento Mensal

**Quando:** Final do mês (geralmente dia 30)

**Cálculo:**
```
Salário Bruto
- INSS
- IRRF
- Descontos Personalizados
- ADIANTAMENTO JÁ PAGO ← Desconto automático
= Salário Líquido
```

**Características:**
- ✅ Cálculo completo de INSS e IRRF
- ✅ Todos os benefícios e descontos aplicados
- ✅ Desconto automático do adiantamento pago
- ✅ Valor líquido = Salário total - Adiantamento

**Exemplo:**
```
Salário Base:           R$ 5.000,00
Benefícios:             R$   500,00
--------------------------------
Total Proventos:        R$ 5.500,00

INSS:                   R$   500,00
IRRF:                   R$   300,00
Adiantamento Pago:      R$ 2.000,00 ← Descontado
--------------------------------
Total Descontos:        R$ 2.800,00

SALÁRIO LÍQUIDO:        R$ 2.700,00
```

## 🖥️ Como Usar

### Na Interface Admin

1. Acesse **Holerites** no menu
2. Você verá dois botões:

#### Botão 1: 💰 Gerar Adiantamento (40%)
- Gera adiantamento de 40% para todos os funcionários
- Período: Primeira quinzena do mês
- Sem descontos de INSS/IRRF

#### Botão 2: 📄 Gerar Folha Mensal
- Gera folha completa para todos os funcionários
- Período: Mês completo
- Desconta automaticamente adiantamentos já pagos

### Fluxo Mensal Recomendado

```
Dia 15 do mês:
└─ Clicar em "💰 Gerar Adiantamento (40%)"
└─ Enviar holerites de adiantamento

Dia 30 do mês:
└─ Clicar em "📄 Gerar Folha Mensal"
└─ Sistema desconta automaticamente o adiantamento
└─ Enviar holerites mensais
```

## 📊 Visualização no Holerite

### Holerite de Adiantamento
```
═══════════════════════════════════════
        ADIANTAMENTO SALARIAL
═══════════════════════════════════════
Funcionário: João Silva
Período: 15/01/2026 a 31/01/2026

PROVENTOS
Adiantamento (40%)      R$ 2.000,00
───────────────────────────────────────
TOTAL PROVENTOS         R$ 2.000,00

DESCONTOS
(Nenhum desconto)
───────────────────────────────────────
TOTAL DESCONTOS         R$     0,00

═══════════════════════════════════════
VALOR LÍQUIDO           R$ 2.000,00
═══════════════════════════════════════

Observação: Será descontado na folha mensal
```

### Holerite Mensal (com desconto de adiantamento)
```
═══════════════════════════════════════
        FOLHA DE PAGAMENTO
═══════════════════════════════════════
Funcionário: João Silva
Período: 01/01/2026 a 31/01/2026

PROVENTOS
Salário Base            R$ 5.000,00
Vale Alimentação        R$   500,00
───────────────────────────────────────
TOTAL PROVENTOS         R$ 5.500,00

DESCONTOS
INSS (9%)               R$   500,00
IRRF (7,5%)             R$   300,00
Adiantamento Pago       R$ 2.000,00 ← Desconto
───────────────────────────────────────
TOTAL DESCONTOS         R$ 2.800,00

═══════════════════════════════════════
VALOR LÍQUIDO           R$ 2.700,00
═══════════════════════════════════════

Observação: Desconto de adiantamento: R$ 2.000,00
```

## 🔧 Implementação Técnica

### API: `/api/holerites/gerar`

**Parâmetros:**
```typescript
{
  tipo: 'adiantamento' | 'mensal',
  periodo_inicio: string,
  periodo_fim: string,
  recriar: boolean
}
```

### Lógica de Desconto Automático

Quando gera folha mensal, o sistema:

1. Busca adiantamentos do mês atual (período que inicia no dia 15)
2. Soma todos os valores de adiantamento
3. Adiciona ao campo `adiantamento` do holerite
4. Inclui no total de descontos

```typescript
// Buscar adiantamentos já pagos (período 15 ao último dia)
const { data: adiantamentos } = await supabase
  .from('holerites')
  .select('salario_base, adiantamento')
  .eq('funcionario_id', funcionarioId)
  .gte('periodo_inicio', '2026-01-15')
  .lt('periodo_fim', '2026-02-01')

// Somar adiantamentos
const adiantamentoValor = adiantamentos.reduce((sum, h) => 
  sum + (h.adiantamento || h.salario_base || 0), 0
)

// Incluir nos descontos
totalDescontos = inss + irrf + outros + adiantamentoValor
```

## ⚠️ Observações Importantes

1. **Múltiplos Adiantamentos:** Se houver mais de um adiantamento no mês, todos serão somados e descontados
2. **Sem Adiantamento:** Se não houver adiantamento, a folha mensal é gerada normalmente
3. **Recriação:** Ao recriar holerites, o sistema recalcula tudo automaticamente
4. **Período:** Adiantamentos são identificados por terem `periodo_fim` até dia 15

## 📈 Benefícios do Sistema

- ✅ **Automático:** Desconto calculado automaticamente
- ✅ **Transparente:** Funcionário vê o desconto no holerite
- ✅ **Preciso:** Sem erros de cálculo manual
- ✅ **Rastreável:** Histórico completo de adiantamentos
- ✅ **Flexível:** Suporta múltiplos adiantamentos

## 🐛 Troubleshooting

### Adiantamento não foi descontado
**Causa:** Adiantamento foi gerado com período errado  
**Solução:** Verificar se `periodo_inicio` é dia 15 e `periodo_fim` é último dia do mês

### Desconto duplicado
**Causa:** Adiantamento gerado duas vezes  
**Solução:** Excluir adiantamento duplicado antes de gerar folha mensal

### Valor errado
**Causa:** Salário base foi alterado após gerar adiantamento  
**Solução:** Recriar adiantamento com novo salário

### Período de referência incorreto
**Causa:** Sistema estava gerando período de 01 a 15 em vez de 15 ao último dia  
**Solução:** Corrigido - agora gera período correto de 15 ao último dia do mês

---

**Implementado em:** Janeiro 2026  
**Versão:** 1.0
