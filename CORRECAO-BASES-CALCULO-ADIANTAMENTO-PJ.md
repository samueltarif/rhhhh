# Correção: Bases de Cálculo em Adiantamentos e Funcionários PJ

**Data:** 21/01/2026  
**Tipo:** Bug Fix - Crítico  
**Status:** ✅ Implementado

## Problema Identificado

### Sintoma 1: Adiantamentos com Bases de Cálculo
Holerites de **adiantamento salarial** estavam exibindo a seção "Bases de Cálculo" (INSS, IRRF, FGTS) quando não deveriam, pois adiantamentos são apenas pagamentos antecipados sem descontos.

### Sintoma 2: Funcionários PJ com Bases de Cálculo
Holerites de **funcionários PJ** estavam exibindo "Bases de Cálculo" quando não deveriam, pois PJs não têm descontos de INSS/IRRF/FGTS em folha.

## Regras de Negócio

### Adiantamento Salarial
- **Valor:** 40% do salário base
- **Descontos:** NENHUM (INSS = 0, IRRF = 0)
- **Bases de Cálculo:** NÃO EXIBIR
- **FGTS:** NÃO CALCULAR
- **Valor Líquido:** = Valor do Adiantamento (sem descontos)

### Funcionários PJ
- **Descontos:** NENHUM (INSS = 0, IRRF = 0)
- **Bases de Cálculo:** NÃO EXIBIR
- **FGTS:** NÃO CALCULAR
- **Valor Líquido:** = Salário Base (sem descontos)

### Folha Mensal CLT
- **Descontos:** INSS, IRRF (calculados)
- **Bases de Cálculo:** EXIBIR
- **FGTS:** CALCULAR (8% do salário)
- **Valor Líquido:** = Salário - Descontos - Adiantamento

## Correção Aplicada

### Arquivo: `server/utils/holeriteHTML.ts`

#### 1. Identificação do Tipo de Holerite e Contrato

```typescript
// Verificar tipo de contrato do funcionário
const tipoContrato = funcionario.tipo_contrato || 'CLT'
const isPJ = tipoContrato === 'PJ'

// PJ e Adiantamento NÃO devem mostrar bases de cálculo
const mostrarBasesCalculo = isFolhaMensal && !isPJ && !isAdiantamento
```

#### 2. Condicional para Exibir Bases

```typescript
${mostrarBasesCalculo ? `
  <div class="bases-calculo">
    <!-- Bases de Cálculo -->
  </div>
` : ''}
```

#### 3. Logs de Debug

```typescript
console.log(`📄 Tipo de Holerite:`)
console.log(`   Tipo Folha: ${tipoFolha}`)
console.log(`   É Adiantamento: ${isAdiantamento}`)
console.log(`   É Folha Mensal: ${isFolhaMensal}`)
console.log(`   Tipo Contrato: ${tipoContrato}`)
console.log(`   É PJ: ${isPJ}`)
console.log(`   Mostrar Bases de Cálculo: ${mostrarBasesCalculo}`)
```

## Matriz de Decisão

| Tipo de Holerite | Tipo Contrato | Mostrar Bases? | INSS/IRRF | FGTS |
|------------------|---------------|----------------|-----------|------|
| Folha Mensal     | CLT           | ✅ SIM         | ✅ SIM    | ✅ SIM |
| Folha Mensal     | PJ            | ❌ NÃO         | ❌ NÃO    | ❌ NÃO |
| Adiantamento     | CLT           | ❌ NÃO         | ❌ NÃO    | ❌ NÃO |
| Adiantamento     | PJ            | ❌ NÃO         | ❌ NÃO    | ❌ NÃO |

## Exemplos de Comportamento

### Exemplo 1: Adiantamento CLT

**Entrada:**
- Funcionário: João Silva (CLT)
- Salário Base: R$ 5.000,00
- Tipo: Adiantamento
- Período: 15/01/2026 a 31/01/2026

**Saída Esperada:**
```
┌─────────────────────────────────────────┐
│  💰 ADIANTAMENTO SALARIAL               │
│  janeiro de 2026                        │
│                                         │
│  Vencimentos:                           │
│  - Adiantamento: R$ 2.000,00 (40%)      │
│                                         │
│  Descontos: R$ 0,00                     │
│  Valor Líquido: R$ 2.000,00             │
│                                         │
│  ❌ SEM SEÇÃO "BASES DE CÁLCULO"        │
└─────────────────────────────────────────┘
```

### Exemplo 2: Folha Mensal PJ

**Entrada:**
- Funcionário: Maria Santos (PJ)
- Salário Base: R$ 8.000,00
- Tipo: Folha Mensal
- Período: 01/01/2026 a 31/01/2026

**Saída Esperada:**
```
┌─────────────────────────────────────────┐
│  📊 FOLHA MENSAL                        │
│  janeiro de 2026                        │
│                                         │
│  Vencimentos:                           │
│  - Salário Base: R$ 8.000,00            │
│                                         │
│  Descontos: R$ 0,00                     │
│  Valor Líquido: R$ 8.000,00             │
│                                         │
│  ❌ SEM SEÇÃO "BASES DE CÁLCULO"        │
└─────────────────────────────────────────┘
```

### Exemplo 3: Folha Mensal CLT

**Entrada:**
- Funcionário: Pedro Costa (CLT)
- Salário Base: R$ 5.000,00
- Tipo: Folha Mensal
- Período: 01/01/2026 a 31/01/2026
- Adiantamento: R$ 2.000,00

**Saída Esperada:**
```
┌─────────────────────────────────────────┐
│  📊 FOLHA MENSAL                        │
│  janeiro de 2026                        │
│                                         │
│  Vencimentos:                           │
│  - Salário Base: R$ 5.000,00            │
│                                         │
│  Descontos:                             │
│  - INSS: R$ 461,50                      │
│  - IRRF: R$ 0,00                        │
│  - Adiantamento: R$ 2.000,00            │
│  Total Descontos: R$ 2.461,50           │
│                                         │
│  Valor Líquido: R$ 2.538,50             │
│                                         │
│  ✅ BASES DE CÁLCULO:                   │
│  - Salário Base: R$ 5.000,00            │
│  - Sal. Contr. INSS: R$ 5.000,00        │
│  - Base Cálc. FGTS: R$ 5.000,00         │
│  - FGTS do Mês: R$ 400,00               │
│  - Base Cálc. IRRF: R$ 4.538,50         │
└─────────────────────────────────────────┘
```

## Validação

### Checklist de Testes

#### Teste 1: Adiantamento CLT
- [ ] Gerar adiantamento para funcionário CLT
- [ ] Verificar que NÃO mostra "Bases de Cálculo"
- [ ] Verificar que descontos = R$ 0,00
- [ ] Verificar que líquido = valor do adiantamento

#### Teste 2: Adiantamento PJ
- [ ] Gerar adiantamento para funcionário PJ
- [ ] Verificar que NÃO mostra "Bases de Cálculo"
- [ ] Verificar que descontos = R$ 0,00
- [ ] Verificar que líquido = valor do adiantamento

#### Teste 3: Folha Mensal PJ
- [ ] Gerar folha mensal para funcionário PJ
- [ ] Verificar que NÃO mostra "Bases de Cálculo"
- [ ] Verificar que descontos = R$ 0,00
- [ ] Verificar que líquido = salário base

#### Teste 4: Folha Mensal CLT
- [ ] Gerar folha mensal para funcionário CLT
- [ ] Verificar que MOSTRA "Bases de Cálculo"
- [ ] Verificar que descontos estão calculados
- [ ] Verificar que FGTS está calculado (8%)

### Logs Esperados

#### Adiantamento CLT:
```
📄 Tipo de Holerite:
   Tipo Folha: Adiantamento Salarial
   É Adiantamento: true
   É Folha Mensal: false
   Tipo Contrato: CLT
   É PJ: false
   Mostrar Bases de Cálculo: false ✅
```

#### Folha Mensal PJ:
```
📄 Tipo de Holerite:
   Tipo Folha: Folha Mensal
   É Adiantamento: false
   É Folha Mensal: true
   Tipo Contrato: PJ
   É PJ: true
   Mostrar Bases de Cálculo: false ✅
```

#### Folha Mensal CLT:
```
📄 Tipo de Holerite:
   Tipo Folha: Folha Mensal
   É Adiantamento: false
   É Folha Mensal: true
   Tipo Contrato: CLT
   É PJ: false
   Mostrar Bases de Cálculo: true ✅
```

## Impacto

### Antes da Correção
- ❌ Adiantamentos mostravam bases de cálculo incorretamente
- ❌ PJs mostravam bases de cálculo incorretamente
- ❌ Confusão para funcionários e RH
- ❌ Informações enganosas no holerite

### Depois da Correção
- ✅ Adiantamentos sem bases de cálculo
- ✅ PJs sem bases de cálculo
- ✅ Apenas CLT em folha mensal mostra bases
- ✅ Informações corretas e claras

## Arquivos Modificados

```
✅ server/utils/holeriteHTML.ts
   - Adicionada lógica para identificar tipo de contrato
   - Adicionada variável mostrarBasesCalculo
   - Condicional para exibir bases apenas quando apropriado
   - Logs de debug adicionados
```

## Documentação Relacionada

- [FUNCIONARIOS-PJ-SEM-DESCONTOS.md](docs/FUNCIONARIOS-PJ-SEM-DESCONTOS.md)
- [SISTEMA-ADIANTAMENTO-SALARIAL.md](docs/SISTEMA-ADIANTAMENTO-SALARIAL.md)
- [COMO-GERAR-HOLERITES.md](docs/COMO-GERAR-HOLERITES.md)

## Próximos Passos

1. **Testar em Desenvolvimento**
   - Gerar holerites de teste para cada cenário
   - Validar logs
   - Confirmar visualização

2. **Deploy em Produção**
   - Seguir checklist de deploy
   - Validar em produção
   - Monitorar logs

3. **Comunicar Mudança**
   - Informar equipe de RH
   - Explicar correção
   - Solicitar validação

---

**Status:** ✅ Implementado  
**Prioridade:** 🔴 Alta  
**Impacto:** Crítico - Afeta visualização de holerites  
**Testado:** ⏳ Pendente
