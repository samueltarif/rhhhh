# Checklist: Deploy da Correção de Competência de Holerites

## ✅ Pré-Deploy

### Validações Locais
- [x] Script de validação executado com sucesso
- [x] Todos os testes passaram
- [x] Sem erros de diagnóstico no código
- [x] Logs detalhados implementados
- [x] Documentação completa criada

### Arquivos Modificados
- [x] `server/api/holerites/gerar.post.ts` - Logs adicionados
- [x] `server/utils/dateUtils.ts` - Logs adicionados
- [x] `server/utils/holeriteHTML.ts` - Parsing de datas corrigido
- [x] `server/utils/__tests__/dateUtils.test.ts` - Testes criados
- [x] `scripts/validar-competencia-holerite.ts` - Script de validação criado

### Arquivos de Documentação
- [x] `CORRECAO-BUG-MES-REFERENCIA-HOLERITE-MENSAL.md`
- [x] `docs/TROUBLESHOOTING-COMPETENCIA-HOLERITE.md`
- [x] `RESUMO-CORRECAO-COMPETENCIA-HOLERITE-21-01-2026.md`
- [x] `CHECKLIST-DEPLOY-CORRECAO-COMPETENCIA.md` (este arquivo)

## 🚀 Deploy

### 1. Commit e Push
```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "fix: corrigir competência de holerites mensais

- Corrigido parsing de datas no holeriteHTML.ts
- Adicionados logs detalhados em todos os pontos críticos
- Criados testes automatizados para validação
- Adicionado script de validação rápida
- Documentação completa do bug e correção

Fixes: Bug onde holerites mensais mostravam mês anterior
Impact: Crítico - Afeta todos os holerites mensais
Testing: Script de validação passa com sucesso"

# Push para repositório
git push origin main
```

### 2. Verificar Build
- [ ] Build do Vercel iniciou automaticamente
- [ ] Build completou sem erros
- [ ] Deploy em produção realizado

### 3. Validação em Produção

#### Teste 1: Verificar Logs
- [ ] Acessar logs do Vercel
- [ ] Procurar por logs de geração de holerites
- [ ] Confirmar que logs mostram competência correta

#### Teste 2: Gerar Holerite de Teste
- [ ] Acessar `/admin/holerites` em produção
- [ ] Clicar em "Gerar Folha Mensal"
- [ ] Verificar que holerite foi gerado
- [ ] Visualizar holerite gerado

#### Teste 3: Validar Visualização
- [ ] Abrir holerite gerado
- [ ] Verificar cabeçalho mostra mês correto
- [ ] Verificar competência está correta
- [ ] Verificar período está correto

#### Teste 4: Validar PDF (se aplicável)
- [ ] Baixar PDF do holerite
- [ ] Verificar que PDF mostra mês correto
- [ ] Verificar formatação está correta

## 📊 Monitoramento Pós-Deploy

### Dia 1 (Imediato)
- [ ] Verificar logs de produção
- [ ] Gerar 2-3 holerites de teste
- [ ] Validar com usuário admin
- [ ] Confirmar que não há erros

### Semana 1
- [ ] Monitorar logs diariamente
- [ ] Coletar feedback dos usuários
- [ ] Verificar se há novos bugs reportados
- [ ] Validar virada de mês (se aplicável)

### Mês 1
- [ ] Validar virada de mês completa
- [ ] Confirmar que todos os holerites estão corretos
- [ ] Documentar qualquer issue encontrado
- [ ] Considerar melhorias adicionais

## 🔧 Rollback (Se Necessário)

### Quando fazer rollback:
- Holerites continuam mostrando mês errado
- Novos bugs críticos aparecem
- Sistema fica instável

### Como fazer rollback:
```bash
# Reverter para commit anterior
git revert HEAD

# Ou reverter para commit específico
git revert <commit-hash>

# Push do revert
git push origin main
```

### Após rollback:
1. Investigar causa do problema
2. Corrigir localmente
3. Testar extensivamente
4. Tentar deploy novamente

## 📝 Comunicação

### Notificar Stakeholders
- [ ] Informar equipe de RH sobre correção
- [ ] Explicar o que foi corrigido
- [ ] Pedir para validarem próximos holerites
- [ ] Disponibilizar documentação

### Mensagem Sugerida:
```
Assunto: Correção Implementada - Competência de Holerites

Olá equipe,

Implementamos uma correção importante no sistema de holerites:

PROBLEMA CORRIGIDO:
- Holerites mensais agora mostram o mês correto no cabeçalho
- Competência sempre corresponde ao período gerado

O QUE MUDOU:
- Correção no cálculo de datas
- Logs detalhados para facilitar debug
- Testes automatizados para garantir qualidade

AÇÃO NECESSÁRIA:
- Validar próximos holerites gerados
- Reportar qualquer inconsistência
- Confirmar que tudo está funcionando

Documentação completa disponível em:
- RESUMO-CORRECAO-COMPETENCIA-HOLERITE-21-01-2026.md
- docs/TROUBLESHOOTING-COMPETENCIA-HOLERITE.md

Qualquer dúvida, estou à disposição.
```

## ✅ Conclusão

### Checklist Final
- [ ] Todos os testes passaram
- [ ] Deploy realizado com sucesso
- [ ] Validação em produção OK
- [ ] Stakeholders notificados
- [ ] Documentação completa
- [ ] Monitoramento ativo

### Próximos Passos
1. Monitorar por 1 semana
2. Coletar feedback
3. Considerar melhorias adicionais
4. Atualizar documentação se necessário

---

**Data de Deploy:** _____/_____/_____  
**Responsável:** _____________________  
**Status:** ⬜ Pendente | ⬜ Em Progresso | ⬜ Concluído
