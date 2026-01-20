# ✅ Correção: Campo Endereço Inexistente

## 🎯 Problema Identificado

Ao tentar atualizar dados pessoais na página "Meus Dados", ocorria erro 500:

### **Erro no Console:**
```
Failed to load resource: the server responded with a status of 500 (Server Error)
Erro ao salvar dados pessoais: FetchError: [PATCH] "/api/funcionarios/meus-dados": 500 Server Error
```

### **Erro no Terminal:**
```
❌ Erro ao atualizar: {"code":"PGRST204","details":null,"hint":null,"message":"Could not find the 'endereco' column of 'funcionarios' in the schema cache"}
💥 Erro ao atualizar dados: Erro ao atualizar dados: {"code":"PGRST204","details":null,"hint":null,"message":"Could not find the 'endereco' column of 'funcionarios' in the schema cache"}
```

## 🔍 Diagnóstico

### **Causa do Problema:**
A API estava tentando atualizar a coluna `endereco` que **não existe** na tabela `funcionarios`.

### **Estrutura Real da Tabela:**
```
Colunas disponíveis na tabela funcionarios:
  - id
  - nome_completo
  - cpf
  - rg
  - data_nascimento
  - sexo
  - telefone
  - email_pessoal
  - empresa_id
  - departamento_id
  - cargo_id
  - jornada_trabalho_id
  - responsavel_id
  - tipo_contrato
  - data_admissao
  - data_demissao
  - matricula
  - email_login
  - senha
  - tipo_acesso
  - status
  - salario_base
  - tipo_salario
  - banco
  - agencia
  - conta
  - tipo_conta
  - forma_pagamento
  - created_at
  - updated_at
  - jornada_id
  - beneficios
  - descontos_personalizados
  - pis_pasep
  - numero_dependentes
  - pensao_alimenticia
```

**❌ Coluna `endereco` NÃO EXISTE**

## 🔧 Correções Implementadas

### **1. API Corrigida**
**Arquivo:** `server/api/funcionarios/meus-dados.patch.ts`

**Antes:**
```typescript
const camposPermitidos: any = {
  telefone: body.telefone,
  endereco: body.endereco,  // ❌ CAMPO INEXISTENTE
  email_pessoal: body.email_pessoal,
  // ...
}
```

**Depois:**
```typescript
const camposPermitidos: any = {
  telefone: body.telefone,
  // endereco removido ✅
  email_pessoal: body.email_pessoal,
  // ...
}
```

### **2. Interface Atualizada**
**Arquivo:** `app/pages/meus-dados.vue`

#### **Template Corrigido:**
**Antes:**
```vue
<UiInput v-model="dadosPessoais.telefone" label="Telefone" />
<div class="md:col-span-2">
  <UiInput v-model="dadosPessoais.endereco" label="Endereço" />  <!-- ❌ REMOVIDO -->
</div>
<UiInput v-model="dadosPessoais.pensaoAlimenticia" label="Pensão Alimentícia" />
```

**Depois:**
```vue
<UiInput v-model="dadosPessoais.telefone" label="Telefone" />
<UiInput v-model="dadosPessoais.pensaoAlimenticia" label="Pensão Alimentícia" />
```

#### **Estado Corrigido:**
**Antes:**
```typescript
const dadosPessoais = ref({
  nome: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  endereco: '',  // ❌ REMOVIDO
  email_pessoal: '',
  pensaoAlimenticia: 0
})
```

**Depois:**
```typescript
const dadosPessoais = ref({
  nome: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  // endereco removido ✅
  email_pessoal: '',
  pensaoAlimenticia: 0
})
```

#### **Carregamento Corrigido:**
**Antes:**
```typescript
dadosPessoais.value = {
  nome: response.data.nome_completo || '',
  cpf: response.data.cpf || '',
  dataNascimento: response.data.data_nascimento || '',
  telefone: response.data.telefone || '',
  endereco: response.data.endereco || '',  // ❌ REMOVIDO
  email_pessoal: response.data.email_pessoal || '',
  pensaoAlimenticia: response.data.pensao_alimenticia || 0
}
```

**Depois:**
```typescript
dadosPessoais.value = {
  nome: response.data.nome_completo || '',
  cpf: response.data.cpf || '',
  dataNascimento: response.data.data_nascimento || '',
  telefone: response.data.telefone || '',
  // endereco removido ✅
  email_pessoal: response.data.email_pessoal || '',
  pensaoAlimenticia: response.data.pensao_alimenticia || 0
}
```

#### **Envio Corrigido:**
**Antes:**
```typescript
body: {
  userId: user.value.id,
  telefone: dadosPessoais.value.telefone,
  endereco: dadosPessoais.value.endereco,  // ❌ REMOVIDO
  email_pessoal: dadosPessoais.value.email_pessoal,
  pensao_alimenticia: dadosPessoais.value.pensaoAlimenticia
}
```

**Depois:**
```typescript
body: {
  userId: user.value.id,
  telefone: dadosPessoais.value.telefone,
  // endereco removido ✅
  email_pessoal: dadosPessoais.value.email_pessoal,
  pensao_alimenticia: dadosPessoais.value.pensaoAlimenticia
}
```

## 🧪 Validação Realizada

### **Teste de Atualização:**
✅ **Funcionário:** MACIEL CARVALHO (ID: 129)
✅ **Campos testados:** telefone, email_pessoal, pensao_alimenticia
✅ **Status da API:** 200 (sucesso)
✅ **Dados persistidos:** Verificado no banco

### **Resultados do Teste:**
```
Dados atuais:
   Nome: MACIEL CARVALHO
   Telefone: Não informado
   Email pessoal: Não informado
   Pensão alimentícia: 0

Atualização:
   Telefone: (11) 99999-9999
   Email pessoal: maciel.teste@email.com
   Pensão alimentícia: 600

Verificação:
   ✅ Telefone atualizado
   ✅ Email atualizado
   ✅ Pensão atualizada

🎉 TESTE PASSOU! Todos os dados foram atualizados corretamente.
```

## 📊 Campos Disponíveis para Atualização

### **Dados Pessoais (Funcionário pode editar):**
- ✅ `telefone` - Telefone de contato
- ✅ `email_pessoal` - Email pessoal
- ✅ `pensao_alimenticia` - Valor da pensão alimentícia

### **Dados Bancários (Funcionário pode editar):**
- ✅ `banco` - Código do banco
- ✅ `agencia` - Agência bancária
- ✅ `conta` - Número da conta
- ✅ `tipo_conta` - Tipo da conta (corrente/poupança)

### **Dados Profissionais (Apenas admin pode editar):**
- ✅ `cargo_id` - ID do cargo
- ✅ `departamento_id` - ID do departamento
- ✅ `data_admissao` - Data de admissão
- ✅ `tipo_contrato` - Tipo de contrato
- ✅ `empresa_id` - ID da empresa

### **Campos NÃO Editáveis:**
- ❌ `endereco` - **NÃO EXISTE na tabela**
- ❌ `nome_completo` - Apenas visualização
- ❌ `cpf` - Apenas visualização
- ❌ `data_nascimento` - Apenas visualização

## 💡 Benefícios da Correção

### **1. Funcionalidade Restaurada**
- ✅ Atualização de dados pessoais funcionando
- ✅ Sem mais erros 500
- ✅ Interface responsiva

### **2. Consistência**
- ✅ API alinhada com estrutura real da tabela
- ✅ Interface sem campos inexistentes
- ✅ Validação correta dos dados

### **3. Experiência do Usuário**
- ✅ Formulário funcional
- ✅ Feedback de sucesso
- ✅ Dados persistidos corretamente

## 🎯 Status Final

### **✅ CORREÇÃO CONCLUÍDA**
- ✅ Campo `endereco` removido da API
- ✅ Campo `endereco` removido da interface
- ✅ Atualização de dados funcionando
- ✅ Testes validados com sucesso

### **📱 Funcionalidade Restaurada:**
Os usuários podem agora atualizar seus dados pessoais sem erros:
- **Telefone:** Campo funcional
- **Email Pessoal:** Campo funcional
- **Pensão Alimentícia:** Campo funcional
- **Dados Bancários:** Campos funcionais

**Data da correção:** 19/01/2026  
**Problema:** ❌ Erro 500 ao atualizar dados (campo inexistente)  
**Solução:** ✅ Campo removido, API funcionando  
**Status:** 🚀 **FUNCIONANDO PERFEITAMENTE**