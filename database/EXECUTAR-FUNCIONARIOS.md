# COMO EXECUTAR - CRIAR FUNCIONÁRIOS

## 🚀 **EXECUÇÃO RÁPIDA (RECOMENDADO)**

### **Opção 1: Script Completo (Tudo de uma vez)**
1. Acesse **Supabase Dashboard** → **SQL Editor**
2. Execute o arquivo: **`database/27-criar-funcionarios-completo.sql`**
3. ✅ **Pronto!** Funcionários criados com responsável configurado

---

## 🔧 **EXECUÇÃO SEPARADA (Se necessário)**

### **Passo 1: Adicionar Coluna Responsável**
```sql
-- Execute: database/26-adicionar-responsavel-cadastro.sql
```

### **Passo 2: Criar Funcionários**
```sql
-- Execute: database/27-criar-funcionarios-completo.sql
```

---

## 👥 **FUNCIONÁRIOS QUE SERÃO CRIADOS**

| Nome | Email | CPF | Nascimento |
|------|-------|-----|------------|
| Cloves Alexandre da Silva Junior | clovesalex.11@hotmail.com | 398.922.388-77 | 20/11/1999 |
| Lucas Veiga Carneiro | veiga4308@gmail.com | 545.026.218-38 | 09/03/2003 |
| Vitor Gabriel da Silva | contatovitorgabrieldasilva2005@gmail.com | 447.441.128-54 | 03/03/2005 |
| Antonio Barbosa | antoniobarbosasilva59@gmail.com | - | - |
| Marcos Paulo Menézes Pires | marcospires4165@gmail.com | 521.464.618-61 | - |
| Leonardo Santos | leozinhodocs12@gmail.com | - | - |
| Luccas Augusto de Souza Lomba | luccas.lomba27@gmail.com | 510.408.998-38 | 27/02/2001 |
| Arthur da Silva Barbosa | arthur.barbosa10.07@hotmail.com | 432.690.308-27 | 10/07/1994 |

---

## 🔐 **CREDENCIAIS DE ACESSO**

### **Senhas dos Funcionários:**
- **Cloves:** Cx9@Lq7!mR2#A
- **Lucas:** Vg8$P2!xN#4L
- **Vitor:** Ct@9R!5M#xA7
- **Antonio:** AbS59!@Xr8#Q
- **Marcos:** Mp4#S!9xR7@L
- **Leonardo:** Ld12@!R#8xQ
- **Luccas:** Ll27#@R!9xS
- **Arthur:** Ab10.07@!R#x9

---

## ✅ **VERIFICAR SE DEU CERTO**

### **1. No Supabase:**
```sql
-- Verificar funcionários criados
SELECT nome_completo, email_login, cpf, data_nascimento 
FROM funcionarios 
WHERE email_login LIKE '%@hotmail.com' 
   OR email_login LIKE '%@gmail.com'
ORDER BY nome_completo;
```

### **2. No Sistema:**
1. Acesse `/admin/funcionarios`
2. Verifique se os 8 funcionários aparecem
3. Confirme se mostra "👤 Cadastrado por: [Nome Admin]"

---

## 🔧 **CONFIGURAÇÕES PADRÃO**

Todos os funcionários são criados com:
- **Status:** Ativo
- **Tipo:** Funcionário
- **Empresa:** ID 1 (padrão)
- **Salário:** R$ 1.500,00
- **Dependentes:** 0
- **Pensão:** R$ 0,00
- **Responsável Cadastro:** Admin do sistema

---

## 📋 **PRÓXIMOS PASSOS**

### **Obrigatórios:**
1. ✅ Complete CPF e datas de nascimento faltantes
2. ✅ Configure salários reais
3. ✅ Defina cargos e departamentos
4. ✅ Oriente sobre mudança de senhas

### **Opcionais:**
1. Configure benefícios (vale transporte, planos)
2. Defina jornadas de trabalho
3. Configure responsáveis diretos
4. Adicione fotos de perfil

---

## 🆘 **TROUBLESHOOTING**

### **Erro: "email_login already exists"**
**Solução:** Funcionário já existe, o script atualiza automaticamente

### **Erro: "column responsavel_cadastro_id does not exist"**
**Solução:** Execute primeiro o script `26-adicionar-responsavel-cadastro.sql`

### **Erro: "relation funcionarios does not exist"**
**Solução:** Verifique se a tabela funcionários foi criada corretamente

---

## 📊 **RESULTADO ESPERADO**

Após execução bem-sucedida:
- ✅ 8 funcionários criados/atualizados
- ✅ Coluna responsável_cadastro_id adicionada
- ✅ Todos com responsável pelo cadastro definido
- ✅ Senhas criptografadas
- ✅ Dados básicos preenchidos

**🎉 Funcionários prontos para usar o sistema!**