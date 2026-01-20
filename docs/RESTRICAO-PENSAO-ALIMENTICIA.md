# 🔒 Restrição: Pensão Alimentícia Apenas para Admin

## 🎯 Objetivo Alcançado

Removida a capacidade do funcionário editar sua própria pensão alimentícia, mantendo essa informação sensível restrita apenas ao RH/admin.

## 🔍 Justificativa

A pensão alimentícia é uma informação:
- **Sensível:** Relacionada a questões judiciais e pessoais
- **Confidencial:** Não deve ser visível ou editável pelo próprio funcionário
- **Administrativa:** Deve ser gerenciada apenas pelo RH/admin

## 🔧 Alterações Implementadas

### **1. API Corrigida**
**Arquivo:** `server/api/funcionarios/meus-dados.patch.ts`

#### **Verificação de Permissões Adicionada:**
```typescript
// Primeiro, verificar se o usuário é admin
const userResponse = await fetch(
  `${supabaseUrl}/rest/v1/funcionarios?id=eq.${userId}&select=tipo_acesso`,
  {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    }
  }
)

const userData = await userResponse.json()
const isAdmin = userData[0]?.tipo_acesso === 'admin'
```

#### **Campos Restritos por Tipo de Usuário:**
**Antes:**
```typescript
const camposPermitidos: any = {
  telefone: body.telefone,
  // ...
  pensao_alimenticia: body.pensao_alimenticia  // ❌ SEMPRE PERMITIDO
}
```

**Depois:**
```typescript
// Campos que o funcionário pode atualizar
const camposPermitidos: any = {
  telefone: body.telefone,
  data_nascimento: body.data_nascimento,
  email_pessoal: body.email_pessoal,
  // pensao_alimenticia REMOVIDO ✅
}

// Se for admin, pode atualizar dados profissionais e pensão alimentícia
if (isAdmin) {
  if (body.pensao_alimenticia !== undefined) camposPermitidos.pensao_alimenticia = body.pensao_alimenticia
} else {
  // Se não for admin e tentar atualizar pensão alimentícia, ignorar silenciosamente
  if (body.pensao_alimenticia !== undefined) {
    console.log('⚠️ Funcionário tentou atualizar pensão alimentícia - IGNORADO')
  }
}
```

### **2. Interface Atualizada**
**Arquivo:** `app/pages/meus-dados.vue`

#### **Campo Removido do Template:**
```vue
<!-- ❌ REMOVIDO -->
<UiInput 
  v-model="dadosPessoais.pensaoAlimenticia" 
  type="number" 
  step="0.01" 
  min="0"
  label="Pensão Alimentícia (R$)" 
  :disabled="!editandoDadosPessoais"
  hint="Valor mensal da pensão alimentícia (dedutível do IRRF)"
/>
```

#### **Estado Limpo:**
**Antes:**
```typescript
const dadosPessoais = ref({
  nome: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  email_pessoal: '',
  pensaoAlimenticia: 0  // ❌ REMOVIDO
})
```

**Depois:**
```typescript
const dadosPessoais = ref({
  nome: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  email_pessoal: ''
  // pensaoAlimenticia removido ✅
})
```

#### **Carregamento Limpo:**
**Antes:**
```typescript
dadosPessoais.value = {
  nome: response.data.nome_completo || '',
  // ...
  pensaoAlimenticia: response.data.pensao_alimenticia || 0  // ❌ REMOVIDO
}
```

**Depois:**
```typescript
dadosPessoais.value = {
  nome: response.data.nome_completo || '',
  // ...
  // pensaoAlimenticia removido ✅
}
```

#### **Envio Limpo:**
**Antes:**
```typescript
body: {
  userId: user.value.id,
  telefone: dadosPessoais.value.telefone,
  // ...
  pensao_alimenticia: dadosPessoais.value.pensaoAlimenticia  // ❌ REMOVIDO
}
```

**Depois:**
```typescript
body: {
  userId: user.value.id,
  telefone: dadosPessoais.value.telefone,
  data_nascimento: dadosPessoais.value.dataNascimento,
  email_pessoal: dadosPessoais.value.email_pessoal
  // pensao_alimenticia removido ✅
}
```

## 🧪 Validação de Segurança

### **Teste de Restrição:**
✅ **Funcionário:** MACIEL CARVALHO (ID: 129, tipo: funcionário)
✅ **Tentativa:** Atualizar pensão alimentícia de 999 para 1500
✅ **Resultado:** Campo ignorado, valor preservado
✅ **Status:** PROTEGIDO

### **Resultados do Teste:**
```
Dados atuais:
   Nome: MACIEL CARVALHO
   Pensão alimentícia atual: 999
   Telefone: 11951378575

Tentativa de atualização:
   Pensão alimentícia: 1500 (tentativa)
   Telefone: (11) 77777-7777

Resultado:
   ✅ Pensão alimentícia preservada: 999 (INALTERADO)
   ✅ Telefone atualizado: (11) 77777-7777
   ✅ Log: "Funcionário tentou atualizar pensão alimentícia - IGNORADO"

🎉 TESTE PASSOU! Pensão alimentícia está protegida.
```

## 📊 Controle de Acesso

### **👤 Funcionário PODE Editar:**
- ✅ `telefone` - Telefone de contato
- ✅ `data_nascimento` - Data de nascimento
- ✅ `email_pessoal` - Email pessoal
- ✅ `numero_dependentes` - Número de dependentes
- ✅ `banco` - Dados bancários
- ✅ `agencia` - Agência bancária
- ✅ `conta` - Número da conta
- ✅ `tipo_conta` - Tipo da conta

### **🔒 Apenas ADMIN Pode Editar:**
- 🔒 `pensao_alimenticia` - **Pensão alimentícia**
- 🔒 `cargo_id` - Cargo
- 🔒 `departamento_id` - Departamento
- 🔒 `empresa_id` - Empresa
- 🔒 `data_admissao` - Data de admissão
- 🔒 `tipo_contrato` - Tipo de contrato

### **❌ NINGUÉM Pode Editar (Apenas Visualização):**
- ❌ `nome_completo` - Nome completo
- ❌ `cpf` - CPF

## 🔄 Fluxo de Segurança

### **1. Verificação de Permissões**
1. **API recebe requisição** → Extrai `userId` do body
2. **Consulta tipo de usuário** → `SELECT tipo_acesso FROM funcionarios WHERE id = userId`
3. **Determina permissões** → `isAdmin = tipo_acesso === 'admin'`

### **2. Filtragem de Campos**
1. **Campos básicos** → Sempre permitidos para funcionários
2. **Campos administrativos** → Apenas se `isAdmin = true`
3. **Pensão alimentícia** → Apenas se `isAdmin = true`

### **3. Proteção Silenciosa**
1. **Funcionário tenta editar pensão** → Campo ignorado
2. **Log de segurança** → "Funcionário tentou atualizar pensão alimentícia - IGNORADO"
3. **Resposta normal** → Sucesso, mas campo não alterado

## 💡 Benefícios da Restrição

### **1. Segurança**
- ✅ Informações sensíveis protegidas
- ✅ Acesso baseado em permissões
- ✅ Logs de tentativas não autorizadas

### **2. Privacidade**
- ✅ Funcionário não vê própria pensão alimentícia
- ✅ Informação confidencial mantida
- ✅ Conformidade com boas práticas

### **3. Controle Administrativo**
- ✅ RH mantém controle total
- ✅ Alterações apenas por admin
- ✅ Auditoria de mudanças

## 🎯 Status Final

### **✅ RESTRIÇÃO IMPLEMENTADA**
- ✅ Campo removido da interface do funcionário
- ✅ API protegida com verificação de permissões
- ✅ Tentativas de edição ignoradas silenciosamente
- ✅ Logs de segurança implementados

### **🔒 Acesso Controlado:**
- **Funcionário:** Não vê nem pode editar pensão alimentícia
- **Admin:** Pode visualizar e editar pensão alimentícia
- **Sistema:** Mantém integridade e confidencialidade

**Data da implementação:** 19/01/2026  
**Tipo:** Restrição de segurança  
**Impacto:** Proteção de dados sensíveis  
**Status:** 🔒 **PROTEGIDO E FUNCIONAL**