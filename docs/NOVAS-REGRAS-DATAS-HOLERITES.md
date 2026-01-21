# Novas Regras de Datas para Holerites

## Implementação das Regras Automáticas de Data

### 📅 Data de Referência: 21/01/2026

## 🔄 Regras Implementadas

### 1. Holerite de Adiantamento Salarial

**Quando gerar:** Entre dia 15 e último dia do mês vigente

**Comportamento:**
- **Hoje (21/01/2026):** Gera adiantamento de Janeiro/2026
- **Data de pagamento:** 20/01/2026
- **Período:** 01/01/2026 a 15/01/2026
- **Valor:** 40% do salário base
- **Sem descontos:** INSS, IRRF não são calculados

**Exemplo prático:**
```
Data atual: 21/01/2026 (entre 15 e 31)
→ Gera: Adiantamento de Janeiro/2026
→ Período: 01/01/2026 a 15/01/2026  
→ Pagamento: 20/01/2026
```

### 2. Holerite de Folha Mensal

**Quando gerar:** Entre dia 01 e 25 do mês vigente

**Comportamento:**
- **Hoje (21/01/2026):** Gera folha mensal de Janeiro/2026
- **Data de pagamento:** 5º dia útil de Janeiro/2026 = 07/01/2026
- **Período:** 01/01/2026 a 31/01/2026
- **Com todos os descontos:** INSS, IRRF, adiantamentos, etc.

**Exemplo prático:**
```
Data atual: 21/01/2026 (entre 01 e 25)
→ Gera: Folha mensal de Janeiro/2026
→ Período: 01/01/2026 a 31/01/2026
→ Pagamento: 07/01/2026 (5º dia útil)
```

## 🛠️ Implementação Técnica

### Arquivo: `server/utils/dateUtils.ts`

Funções criadas:
- `calcularDatasHolerite(tipo)`: Calcula datas baseado no tipo e data atual
- `calcular5oDiaUtil(ano, mes)`: Calcula o 5º dia útil do mês
- `formatarData(data)`: Formata datas para exibição
- `isDiaUtil(data)`: Verifica se é dia útil

### Arquivo: `server/api/holerites/gerar.post.ts`

Modificações:
- Import da função `calcularDatasHolerite`
- Remoção da lógica manual de datas
- Uso automático das datas calculadas
- Suporte a override manual (opcional)

### Arquivo: `app/pages/admin/holerites.vue`

Modificações:
- Remoção da lógica manual de datas no frontend
- Atualização das descrições dos modais
- Simplificação da chamada da API

## 📊 Cálculo do 5º Dia Útil

**Janeiro/2026:**
```
01/01 - Quarta (1º dia útil)
02/01 - Quinta (2º dia útil)  
03/01 - Sexta (3º dia útil)
04/01 - Sábado (não conta)
05/01 - Domingo (não conta)
06/01 - Segunda (4º dia útil)
07/01 - Terça (5º dia útil) ← Data de pagamento
```

## 🔄 Fluxo de Trabalho

### Cenário 1: Gerar Adiantamento
1. Admin clica em "Gerar Adiantamento"
2. Sistema verifica: hoje é 21/01 (≥ 15)
3. Calcula automaticamente:
   - Período: 01/01/2026 a 15/01/2026
   - Pagamento: 20/01/2026
4. Gera holerites de 40% do salário

### Cenário 2: Gerar Folha Mensal  
1. Admin clica em "Gerar Folha Mensal"
2. Sistema verifica: hoje é 21/01 (entre 1 e 25)
3. Calcula automaticamente:
   - Período: 01/01/2026 a 31/01/2026
   - Pagamento: 07/01/2026 (5º dia útil)
4. Gera holerites completos com descontos

## ✅ Benefícios

1. **Automação completa:** Não precisa mais inserir datas manualmente
2. **Consistência:** Sempre usa as regras corretas baseadas na data atual
3. **Redução de erros:** Elimina erros de digitação de datas
4. **Flexibilidade:** Ainda permite override manual se necessário
5. **Conformidade:** Segue as regras de negócio da empresa

## 🔧 Configuração

As regras estão implementadas e ativas. Não é necessária configuração adicional.

Para usar:
1. Acesse Admin → Holerites
2. Clique em "Gerar Adiantamento" ou "Gerar Folha Mensal"
3. O sistema calculará as datas automaticamente
4. Confirme a geração

## 📝 Observações

- As datas são calculadas sempre baseadas na data atual do servidor
- O cálculo de dias úteis considera apenas segunda a sexta
- Feriados não são considerados no cálculo (apenas fins de semana)
- As regras podem ser ajustadas no arquivo `dateUtils.ts` se necessário