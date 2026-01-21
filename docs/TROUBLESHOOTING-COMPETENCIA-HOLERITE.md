# Troubleshooting: Competência de Holerites

## Problema: Holerite mostra mês errado

### Sintomas
- Holerite gerado em Janeiro/2026 mostra "Dezembro/2025"
- Competência no cabeçalho não corresponde ao mês selecionado
- PDF exibe mês anterior ao esperado

### Diagnóstico Rápido

#### 1. Verificar Logs do Servidor
Ao gerar um holerite, procure nos logs:
```
📅 FOLHA MENSAL - Cálculo de Datas:
   Data Atual: 2026-01-21
   Mês Atual: 1/2026
   Período: 2026-01-01 a 2026-01-31
   Mês Referência: 2026-01
   ✅ Competência: 1/2026 (MÊS VIGENTE)
```

Se o log mostrar o mês correto mas o holerite mostrar errado, o problema está na visualização.

#### 2. Executar Script de Validação
```bash
npx tsx scripts/validar-competencia-holerite.ts
```

Este script testa:
- Cálculo de datas
- Consistência entre campos
- Virada de mês/ano

#### 3. Verificar Banco de Dados
```sql
SELECT 
  id,
  funcionario_id,
  periodo_inicio,
  periodo_fim,
  data_pagamento,
  created_at
FROM holerites
WHERE periodo_inicio >= '2026-01-01'
ORDER BY created_at DESC
LIMIT 10;
```

Verifique se `periodo_inicio` está correto.

### Causas Comuns

#### Causa 1: Problema de Timezone
**Sintoma:** Data correta no servidor, mas errada no frontend

**Solução:**
```typescript
// ERRADO
const data = new Date('2026-01-01')

// CORRETO
const data = new Date('2026-01-01T00:00:00')
```

#### Causa 2: Lógica de "Mês Anterior"
**Sintoma:** Sistema sempre subtrai 1 mês

**Verificar:**
- `server/api/holerites/gerar.post.ts`
- `server/utils/dateUtils.ts`

**Procurar por:**
```typescript
// ❌ ERRADO
mesAtual - 1

// ✅ CORRETO (para folha mensal)
mesAtual // Sem subtração
```

#### Causa 3: Override Manual Incorreto
**Sintoma:** Datas manuais sendo passadas incorretamente

**Verificar:**
```typescript
// No frontend (app/pages/admin/holerites.vue)
const resultado = await $fetch('/api/holerites/gerar', {
  method: 'POST',
  body: {
    tipo: 'mensal',
    // ❌ NÃO passar datas manuais a menos que necessário
    // periodo_inicio_manual: '...',
    // periodo_fim_manual: '...',
  }
})
```

### Soluções

#### Solução 1: Limpar Cache e Rebuild
```bash
# Limpar cache do Nuxt
rm -rf .nuxt
rm -rf .output

# Rebuild
npm run build
```

#### Solução 2: Verificar Variáveis de Ambiente
```bash
# Verificar timezone do servidor
echo $TZ

# Definir timezone (se necessário)
export TZ=America/Sao_Paulo
```

#### Solução 3: Recriar Holerites
1. Excluir holerites com competência errada
2. Gerar novamente usando o botão "Gerar Folha Mensal"
3. Verificar logs para confirmar competência correta

### Validação Pós-Correção

#### Checklist
- [ ] Logs mostram mês correto
- [ ] Script de validação passa
- [ ] Banco de dados tem `periodo_inicio` correto
- [ ] Frontend exibe mês correto
- [ ] PDF mostra mês correto
- [ ] Virada de ano funciona (Dez → Jan)
- [ ] Virada de mês funciona (qualquer mês)

#### Testes Manuais

**Teste 1: Gerar Folha Mensal**
1. Acessar `/admin/holerites`
2. Clicar "Gerar Folha Mensal"
3. Verificar logs do servidor
4. Visualizar holerite gerado
5. Confirmar que mostra mês atual

**Teste 2: Virada de Mês**
1. Gerar holerite no último dia do mês
2. Verificar que competência é do mês atual
3. Gerar holerite no primeiro dia do mês seguinte
4. Verificar que competência mudou corretamente

**Teste 3: Virada de Ano**
1. Gerar holerite em Dezembro
2. Verificar competência "dezembro de 2025"
3. Gerar holerite em Janeiro
4. Verificar competência "janeiro de 2026"

### Logs Úteis

#### Ativar Logs Detalhados
Os logs já estão ativados nos arquivos:
- `server/api/holerites/gerar.post.ts`
- `server/utils/dateUtils.ts`
- `server/utils/holeriteHTML.ts`

#### Interpretar Logs

**Log Normal (Correto):**
```
📅 FOLHA MENSAL - Cálculo de Datas:
   Data Atual: 2026-01-21
   Mês Atual: 1/2026
   ✅ Competência: 1/2026 (MÊS VIGENTE)
```

**Log com Problema:**
```
📅 FOLHA MENSAL - Cálculo de Datas:
   Data Atual: 2026-01-21
   Mês Atual: 1/2026
   ❌ Competência: 12/2025 (MÊS ANTERIOR) <- PROBLEMA!
```

### Contato para Suporte

Se o problema persistir após seguir este guia:

1. Coletar logs do servidor
2. Executar script de validação
3. Capturar screenshot do holerite
4. Verificar dados no banco
5. Documentar passos para reproduzir

### Referências

- [CORRECAO-BUG-MES-REFERENCIA-HOLERITE-MENSAL.md](../CORRECAO-BUG-MES-REFERENCIA-HOLERITE-MENSAL.md)
- [DATAS-AUTOMATICAS-HOLERITES.md](./DATAS-AUTOMATICAS-HOLERITES.md)
- [CORRECAO-FOLHA-MENSAL-MES-VIGENTE-21-01-2026.md](../CORRECAO-FOLHA-MENSAL-MES-VIGENTE-21-01-2026.md)
