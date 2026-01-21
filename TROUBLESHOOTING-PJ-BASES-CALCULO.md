# Troubleshooting: PJ Mostrando Bases de Cálculo

## 🎯 Problema Reportado

Funcionário cadastrado como PJ está mostrando "Bases de Cálculo" no holerite mensal quando não deveria.

## ✅ Correção Já Implementada

A correção já foi aplicada no código:
- ✅ `server/utils/holeriteHTML.ts` - Lógica condicional implementada
- ✅ `server/api/holerites/[id]/html.get.ts` - Tipo de contrato sendo passado
- ✅ Testes da lógica passaram com sucesso

## 🔍 Diagnóstico Passo a Passo

### Passo 1: Verificar Cadastro do Funcionário

**Problema Comum:** Funcionário não está cadastrado como PJ no banco de dados.

**Como Verificar:**
1. Acessar **Admin → Funcionários**
2. Encontrar o funcionário em questão
3. Verificar campo **"Tipo de Contrato"**
4. Deve estar marcado como **"PJ"**

**Se estiver como CLT:**
1. Editar funcionário
2. Alterar para "PJ"
3. Salvar
4. Gerar novo holerite

### Passo 2: Verificar Logs do Servidor

**Como Fazer:**
1. Gerar novo holerite para o funcionário PJ
2. Verificar logs do servidor
3. Procurar por:

```
📄 Tipo de Holerite:
   Tipo Folha: Folha Mensal
   É Adiantamento: false
   É Folha Mensal: true
   Tipo Contrato: PJ          ← DEVE SER "PJ"
   É PJ: true                 ← DEVE SER "true"
   Mostrar Bases de Cálculo: false ← DEVE SER "false"
```

**Se os logs estão corretos mas ainda mostra bases:**
- Problema pode ser cache do navegador
- Holerite antigo (gerado antes da correção)

### Passo 3: Verificar Holerite Específico

**Problema:** Holerite foi gerado antes da correção ser aplicada.

**Solução:**
1. Excluir holerite antigo
2. Gerar novo holerite
3. Verificar se agora está correto

### Passo 4: Limpar Cache

**Problema:** Cache do navegador mostrando versão antiga.

**Solução:**
1. Pressionar **Ctrl + F5** (Windows) ou **Cmd + Shift + R** (Mac)
2. Ou abrir em aba anônima/privada
3. Gerar novo holerite

### Passo 5: Verificar Banco de Dados

**SQL para Verificar:**
```sql
SELECT 
  id,
  nome_completo,
  tipo_contrato
FROM funcionarios 
WHERE nome_completo ILIKE '%nome_do_funcionario%';
```

**Resultado Esperado:**
```
id | nome_completo | tipo_contrato
1  | João Silva    | PJ
```

**Se tipo_contrato for NULL ou CLT:**
```sql
UPDATE funcionarios 
SET tipo_contrato = 'PJ' 
WHERE id = <id_do_funcionario>;
```

## 🧪 Teste Rápido

### Teste Manual
1. **Cadastrar funcionário teste como PJ**
2. **Gerar holerite mensal**
3. **Verificar resultado:**

**✅ Deve ter:**
- Cabeçalho: "FOLHA MENSAL"
- Descontos: R$ 0,00
- Líquido = Salário Base

**❌ NÃO deve ter:**
- Seção "Bases de Cálculo"
- INSS/IRRF na tabela

### Teste de Logs
```bash
# Verificar se logs aparecem ao gerar holerite
# Procurar por: "📄 Tipo de Holerite:"
```

## 🔧 Soluções por Cenário

### Cenário 1: Funcionário Cadastrado como CLT
**Sintoma:** Logs mostram "Tipo Contrato: CLT"
**Solução:** Alterar cadastro para PJ

### Cenário 2: Logs Corretos mas Ainda Mostra Bases
**Sintoma:** Logs mostram PJ e "Mostrar Bases: false" mas holerite mostra bases
**Solução:** 
1. Limpar cache do navegador
2. Gerar novo holerite
3. Verificar se é holerite antigo

### Cenário 3: Logs Não Aparecem
**Sintoma:** Não aparecem logs de "📄 Tipo de Holerite"
**Solução:**
1. Verificar se correção foi aplicada
2. Fazer deploy da correção
3. Reiniciar servidor

### Cenário 4: Funcionário NULL no Tipo
**Sintoma:** Logs mostram "Tipo Contrato: CLT" (padrão)
**Solução:** Atualizar banco de dados

## 📋 Checklist de Validação

### Pré-Validação
- [ ] Funcionário cadastrado como PJ no sistema
- [ ] Correção aplicada no código
- [ ] Deploy realizado
- [ ] Cache limpo

### Validação
- [ ] Gerar novo holerite para PJ
- [ ] Verificar logs do servidor
- [ ] Confirmar que não mostra bases
- [ ] Testar com funcionário CLT (deve mostrar bases)

### Pós-Validação
- [ ] Documentar resultado
- [ ] Informar usuários
- [ ] Monitorar outros casos

## 🚨 Se Nada Funcionar

### Verificação Final
1. **Confirmar que a correção está no código:**
   ```typescript
   // Em server/utils/holeriteHTML.ts
   const mostrarBasesCalculo = isFolhaMensal && !isPJ && !isAdiantamento
   ```

2. **Verificar se está sendo usado:**
   ```typescript
   ${mostrarBasesCalculo ? `
     <div class="bases-calculo">
   ` : ''}
   ```

3. **Verificar se tipo_contrato está sendo passado:**
   ```typescript
   // Em server/api/holerites/[id]/html.get.ts
   tipo_contrato: funcionario.tipo_contrato || 'CLT'
   ```

### Rollback Temporário
Se o problema persistir, pode ser necessário:
1. Reverter para versão anterior
2. Investigar mais profundamente
3. Aplicar correção específica

## 📞 Suporte

### Informações para Reportar
1. **Nome do funcionário**
2. **Tipo de contrato cadastrado**
3. **Screenshot do holerite**
4. **Logs do servidor**
5. **ID do holerite**

### SQL para Investigação
```sql
-- Verificar funcionário
SELECT * FROM funcionarios WHERE id = <id>;

-- Verificar holerite
SELECT * FROM holerites WHERE id = <id>;

-- Verificar relação
SELECT 
  h.id as holerite_id,
  f.nome_completo,
  f.tipo_contrato,
  h.periodo_inicio,
  h.periodo_fim
FROM holerites h
JOIN funcionarios f ON h.funcionario_id = f.id
WHERE h.id = <id>;
```

## ✅ Confirmação de Correção

### Teste Final
1. Funcionário PJ → Gerar folha mensal → **SEM bases**
2. Funcionário CLT → Gerar folha mensal → **COM bases**
3. Qualquer funcionário → Gerar adiantamento → **SEM bases**

### Logs Esperados
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

**Status:** ✅ Correção Implementada  
**Próximo Passo:** Validar em produção  
**Documentação:** [CORRECAO-BASES-CALCULO-ADIANTAMENTO-PJ.md](CORRECAO-BASES-CALCULO-ADIANTAMENTO-PJ.md)