# Funcionários PJ - Sem Descontos em Folha

## 📋 Resumo
Implementada restrição completa para que funcionários cadastrados como **PJ (Pessoa Jurídica)** não tenham descontos obrigatórios (INSS/IRRF) nem descontos de benefícios em folha de pagamento.

## 🎯 Objetivo
- Funcionários PJ recebem salário integral sem descontos obrigatórios
- Podem ter benefícios mas sem descontos em folha
- Conformidade com legislação trabalhista para PJ

## 🔧 Implementações

### 1. Frontend - Interface Adaptada
- **Aviso visual**: Banner amarelo alertando sobre a restrição para PJ
- **Campos condicionais**: Descontos só aparecem para CLT/outros contratos
- **Resumo diferenciado**: Mostra apenas benefícios para PJ

### 2. Backend - Cálculos Corrigidos
**Arquivo**: `server/api/holerites/gerar.post.ts`

#### INSS para PJ
```javascript
const tipoContrato = (func as any).tipo_contrato || 'CLT'

if (tipoContrato === 'PJ') {
  // Funcionários PJ não têm desconto de INSS
  inss = 0
  aliquotaEfetiva = 0
  console.log(`💼 Funcionário PJ - Sem desconto de INSS`)
} else {
  // Cálculo normal do INSS para CLT e outros contratos
  // ... cálculo progressivo do INSS
}
```

#### IRRF para PJ
```javascript
if (tipoContrato === 'PJ') {
  // Funcionários PJ não têm desconto de IRRF
  irrf = 0
  baseIRRF = 0
  aliquotaIRRF = 0
  console.log(`💼 Funcionário PJ - Sem desconto de IRRF`)
} else {
  // Cálculo normal do IRRF para CLT e outros contratos
  // ... cálculo com Lei 15.270/2025
}
```

### 3. Benefícios Sem Desconto para PJ
Para funcionários PJ, os seguintes campos de desconto são **ocultos**:
- Vale Transporte: tipo_desconto, percentual_desconto, valor_desconto
- Cesta Básica: tipo_desconto, percentual_desconto, valor_desconto  
- Plano de Saúde: valor_funcionario
- Plano Odontológico: valor_funcionario

### 4. Descontos Personalizados Bloqueados
- **Seção completamente oculta** para funcionários PJ
- Aviso explicativo sobre não aplicabilidade
- Botão "Adicionar Desconto" não disponível

### 5. Limpeza Automática no Frontend
Quando tipo de contrato é alterado para PJ:
- Remove todos os descontos dos benefícios padrão
- Limpa descontos dos benefícios personalizados
- Remove todos os descontos personalizados
- Define tipo_desconto como 'sem_desconto'

## 📊 Resultados dos Testes

### Teste com Antonio Barbosa (PJ - R$ 5.500)
```
💰 Salário Base: R$ 5500
📉 INSS: R$ 0 (correto para PJ)
📉 IRRF: R$ 0 (correto para PJ)
💵 Líquido: R$ 5500 (= salário base)
✅ CORRETO: PJ sem descontos!
```

### Comparação PJ vs CLT
- **PJ**: Recebe salário integral
- **CLT**: Tem descontos de INSS e IRRF
- **Economia PJ**: Não paga contribuições obrigatórias

## 🔄 Comportamento por Tipo de Contrato

### Funcionário PJ
- ✅ Salário base integral
- ❌ Sem INSS (0%)
- ❌ Sem IRRF (0%)
- ✅ Benefícios sem desconto
- ❌ Sem descontos personalizados
- 💰 **Líquido = Bruto**

### Funcionário CLT
- ✅ Salário base
- ✅ INSS (7,5% a 14%)
- ✅ IRRF (conforme tabela)
- ✅ Benefícios com desconto opcional
- ✅ Descontos personalizados
- 💰 **Líquido = Bruto - Descontos**

## 🎨 Elementos Visuais

### Avisos para PJ
- Banner principal: `bg-yellow-50 border-yellow-200 text-yellow-700`
- Avisos locais: `bg-blue-50 border-blue-200 text-blue-700`
- Seção desabilitada: `bg-gray-50 border-gray-200 text-gray-600`

### Logs do Sistema
```
📊 CÁLCULOS MENSAIS:
   Tipo Contrato: PJ
   Salário Base: R$ 5500.00
   INSS: R$ 0.00 (0%)
   IRRF Final: R$ 0.00 (0%)
   Faixa: pj_sem_irrf
   💼 PJ: Salário integral sem descontos obrigatórios
```

## ✅ Validações Implementadas

### Frontend
- Interface oculta campos de desconto para PJ
- Cálculos retornam 0 para descontos de PJ
- Limpeza automática ao alterar tipo de contrato

### Backend
- Consulta inclui `tipo_contrato` na geração de holerites
- Validação condicional para INSS e IRRF
- Logs específicos para funcionários PJ

## 📝 Arquivos Modificados
- `app/components/funcionarios/FuncionarioForm.vue` (Frontend)
- `server/api/holerites/gerar.post.ts` (Backend)

## 🎯 Resultado Final
- ✅ Funcionários PJ recebem salário integral
- ✅ Sem descontos obrigatórios (INSS/IRRF)
- ✅ Benefícios sem desconto em folha
- ✅ Interface clara e intuitiva
- ✅ Conformidade com legislação PJ
- ✅ Testes validados com sucesso