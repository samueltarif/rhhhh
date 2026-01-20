# 📧 Fluxo de Envio de Holerites

## 🎯 Regras de Envio

### 💰 Adiantamento Salarial (40%)

**Envio AUTOMÁTICO** assim que gerado!

- ✅ Enviado automaticamente por email
- ✅ Disponibilizado automaticamente no perfil
- ✅ Status: "enviado"
- ✅ Funcionário recebe notificação imediata
- ✅ Acontece 1x por mês (dia 15)

**Fluxo:**
```
1. Admin clica em "💰 Gerar Adiantamento (40%)"
2. Sistema gera os holerites
3. Sistema ENVIA AUTOMATICAMENTE:
   - Email para o funcionário
   - Disponibiliza no perfil
   - Atualiza status para "enviado"
4. Funcionário recebe e pode visualizar
```

### 📄 Folha de Pagamento Mensal

**Envio MANUAL** - Admin decide quando disponibilizar!

- ❌ NÃO é enviado automaticamente
- ❌ NÃO aparece no perfil automaticamente
- ✅ Status inicial: "gerado"
- ✅ Admin controla quando disponibilizar

**Fluxo:**
```
1. Admin clica em "📄 Gerar Folha Mensal"
2. Sistema gera os holerites
3. Holerites ficam com status "gerado"
4. Admin revisa os holerites
5. Admin clica em "👤 Disponibilizar no Perfil"
6. Seleciona "📄 Apenas Folhas Mensais"
7. Sistema disponibiliza no perfil
8. Funcionário pode visualizar
```

## 📊 Comparação

| Característica | Adiantamento | Folha Mensal |
|----------------|--------------|--------------|
| Envio Email | ✅ Automático | ❌ Manual |
| Perfil | ✅ Automático | ❌ Manual |
| Status Inicial | "enviado" | "gerado" |
| Controle Admin | ❌ Não | ✅ Sim |
| Frequência | 1x/mês (dia 15) | 1x/mês (dia 30) |

## 🔄 Fluxo Mensal Completo

### Dia 15 do Mês
```
1. Admin: "💰 Gerar Adiantamento (40%)"
2. Sistema: Gera + Envia automaticamente
3. Funcionário: Recebe email + Vê no perfil
4. Funcionário: Recebe 40% do salário
```

### Dia 30 do Mês
```
1. Admin: "📄 Gerar Folha Mensal"
2. Sistema: Gera holerites (status: "gerado")
3. Admin: Revisa os holerites
4. Admin: Edita se necessário
5. Admin: "👤 Disponibilizar no Perfil"
6. Admin: Seleciona "📄 Apenas Folhas Mensais"
7. Sistema: Disponibiliza no perfil
8. Funcionário: Vê no perfil
9. Funcionário: Recebe salário - adiantamento
```

## 🎨 Interface Admin

### Botões Principais

**💰 Gerar Adiantamento (40%)**
- Gera + Envia automaticamente
- Sem necessidade de ação adicional

**📄 Gerar Folha Mensal**
- Apenas gera
- Precisa disponibilizar manualmente

**👤 Disponibilizar no Perfil**
- Opções:
  - 💰 Apenas Adiantamentos (raramente usado)
  - 📄 Apenas Folhas Mensais (uso principal)
  - 📋 Todos os Holerites

**📧 Enviar por Email**
- Envia email adicional
- Útil para reenvios

## ⚙️ Configuração Técnica

### Status dos Holerites

**"gerado"**
- Holerite criado mas não disponibilizado
- Não aparece no perfil do funcionário
- Usado para folhas mensais

**"enviado"**
- Holerite enviado por email
- Disponível no perfil
- Usado para adiantamentos (automático)

**"visualizado"**
- Funcionário já visualizou
- Disponível no perfil
- Usado após disponibilização manual

### Lógica de Envio Automático

```typescript
if (isAdiantamento) {
  // Atualizar status
  await supabase
    .from('holerites')
    .update({ 
      status: 'enviado',
      enviado_em: new Date().toISOString()
    })
    .eq('id', holerite.id)
  
  // Enviar email (se configurado)
  // Disponibilizar no perfil
}
```

## 🔐 Segurança

- ✅ Apenas admins podem gerar holerites
- ✅ Apenas admins podem disponibilizar
- ✅ Funcionários só veem seus próprios holerites
- ✅ Holerites com status "gerado" não aparecem no perfil

## 📱 Experiência do Funcionário

### Adiantamento (Dia 15)
```
1. Recebe email: "Seu adiantamento está disponível"
2. Acessa o sistema
3. Vê o holerite em "Meus Holerites"
4. Baixa PDF/HTML
5. Recebe 40% do salário
```

### Folha Mensal (Dia 30)
```
1. Acessa o sistema (quando quiser)
2. Vê o holerite em "Meus Holerites"
3. Baixa PDF/HTML
4. Verifica desconto do adiantamento
5. Recebe salário restante
```

## 🎯 Vantagens deste Fluxo

### Para o Admin
- ✅ Controle total sobre folhas mensais
- ✅ Pode revisar antes de disponibilizar
- ✅ Pode editar se necessário
- ✅ Adiantamentos automáticos (menos trabalho)

### Para o Funcionário
- ✅ Recebe adiantamento rapidamente
- ✅ Não precisa esperar admin para ver adiantamento
- ✅ Folha mensal disponível quando aprovada
- ✅ Tudo organizado em um só lugar

## 📝 Observações

1. **Adiantamentos são urgentes** - Por isso são automáticos
2. **Folhas mensais precisam revisão** - Por isso são manuais
3. **Admin tem controle** - Pode disponibilizar quando quiser
4. **Funcionário tem acesso** - Quando admin liberar

---

**Implementado em:** Janeiro 2026  
**Versão:** 2.0 (com envio automático de adiantamentos)
