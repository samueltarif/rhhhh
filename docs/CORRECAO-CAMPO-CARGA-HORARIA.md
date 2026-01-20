# ✅ Correção: Campo carga_horaria Inexistente

## 🎯 Problema Identificado

Erro 500 ao salvar dados profissionais no perfil do admin:

```
"Could not find the 'carga_horaria' column of 'funcionarios' in the schema cache"
```

## 🔍 Causa Raiz

O frontend estava tentando atualizar um campo `carga_horaria` que **não existe** na tabela `funcionarios` do banco de dados.

### Estrutura Real da Tabela

Verificação da tabela `funcionarios` mostrou que as colunas disponíveis são:

```
 1. agencia                   
 2. banco                     
 3. beneficios                
 4. cargo_id                  
 5. conta                     
 6. cpf                       
 7. created_at                
 8. data_admissao             
 9. data_demissao             
10. data_nascimento           
11. departamento_id           
12. descontos_personalizados  
13. email_login               
14. email_pessoal             
15. empresa_id                
16. forma_pagamento           
17. id                        
18. jornada_id                
19. jornada_trabalho_id       
20. matricula                 
21. nome_completo             
22. numero_dependentes        
23. pis_pasep                 
24. responsavel_id            
25. rg                        
26. salario_base              
27. senha                     
28. sexo                      
29. status                    
30. telefone                  
31. tipo_acesso               
32. tipo_conta                
33. tipo_contrato             
34. tipo_salario              
35. updated_at                
```

**❌ Campo `carga_horaria` NÃO EXISTE**

## ✅ Solução Implementada

### 1. API Backend (`server/api/funcionarios/meus-dados.patch.ts`)

Removida a referência ao campo inexistente:

```typescript
// ANTES (com erro)
if (body.carga_horaria !== undefined) camposPermitidos.carga_horaria = body.carga_horaria

// DEPOIS (corrigido)
// Linha removida completamente
```

### 2. Frontend (`app/pages/meus-dados.vue`)

#### A. Removido do Template

```vue
<!-- ANTES (com erro) -->
<div v-if="!isAdmin || !editandoDadosProfissionais">
  <label class="block text-sm font-medium text-gray-500 mb-1">Carga Horária</label>
  <p class="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl">{{ dadosProfissionais.cargaHoraria }}</p>
</div>
<UiInput 
  v-else
  v-model="dadosProfissionais.cargaHoraria" 
  label="Carga Horária" 
  placeholder="44 horas semanais"
/>

<!-- DEPOIS (removido) -->
<!-- Campo completamente removido -->
```

#### B. Removido do Objeto Reativo

```typescript
// ANTES (com erro)
const dadosProfissionais = ref({
  cargo: '',
  departamento: '',
  dataAdmissao: '',
  tipoContrato: '',
  cargaHoraria: '',  // ❌ Campo inexistente
  empresa: ''
})

// DEPOIS (corrigido)
const dadosProfissionais = ref({
  cargo: '',
  departamento: '',
  dataAdmissao: '',
  tipoContrato: '',
  empresa: ''
})
```

#### C. Removido da Requisição PATCH

```typescript
// ANTES (com erro)
const response: any = await $fetch('/api/funcionarios/meus-dados', {
  method: 'PATCH',
  body: {
    userId: user.value.id,
    cargo_id: dadosProfissionais.value.cargo,
    departamento_id: dadosProfissionais.value.departamento,
    data_admissao: dadosProfissionais.value.dataAdmissao,
    tipo_contrato: dadosProfissionais.value.tipoContrato,
    carga_horaria: dadosProfissionais.value.cargaHoraria,  // ❌ Campo inexistente
    empresa_id: dadosProfissionais.value.empresa
  }
})

// DEPOIS (corrigido)
const response: any = await $fetch('/api/funcionarios/meus-dados', {
  method: 'PATCH',
  body: {
    userId: user.value.id,
    cargo_id: dadosProfissionais.value.cargo,
    departamento_id: dadosProfissionais.value.departamento,
    data_admissao: dadosProfissionais.value.dataAdmissao,
    tipo_contrato: dadosProfissionais.value.tipoContrato,
    empresa_id: dadosProfissionais.value.empresa
  }
})
```

#### D. Removido da Função de Carregamento

```typescript
// ANTES (com erro)
dadosProfissionais.value = {
  cargo: response.data.cargo_id || '',
  departamento: response.data.departamento_id || '',
  dataAdmissao: response.data.data_admissao || '',
  tipoContrato: response.data.tipo_contrato || 'CLT',
  cargaHoraria: response.data.carga_horaria || '44 horas semanais',  // ❌ Campo inexistente
  empresa: response.data.empresa_id || ''
}

// DEPOIS (corrigido)
dadosProfissionais.value = {
  cargo: response.data.cargo_id || '',
  departamento: response.data.departamento_id || '',
  dataAdmissao: response.data.data_admissao || '',
  tipoContrato: response.data.tipo_contrato || 'CLT',
  empresa: response.data.empresa_id || ''
}
```

## 🧪 Validação

### Script de Verificação

Criado `verificar-colunas-funcionarios.mjs` para confirmar a estrutura da tabela:

```javascript
// Busca um funcionário e lista todas as colunas disponíveis
const funcionarios = await fetch(`${SUPABASE_URL}/rest/v1/funcionarios?select=*&limit=1`)
const funcionario = funcionarios[0]
Object.keys(funcionario).sort().forEach((coluna, i) => {
  console.log(`${i + 1}. ${coluna}`)
})
```

### Resultado da Verificação

✅ **Confirmado**: Campo `carga_horaria` não existe na tabela
✅ **Alternativa**: Informação de carga horária pode ser obtida através da `jornada_trabalho_id`

## 📋 Campos Profissionais Disponíveis

Após a correção, os campos editáveis pelo admin são:

1. ✅ **Cargo** (`cargo_id`)
2. ✅ **Departamento** (`departamento_id`) 
3. ✅ **Data de Admissão** (`data_admissao`)
4. ✅ **Tipo de Contrato** (`tipo_contrato`)
5. ✅ **Empresa** (`empresa_id`)

## 💡 Observações Importantes

### Sobre Carga Horária

Se for necessário armazenar informações de carga horária, existem duas opções:

#### Opção 1: Usar Jornada de Trabalho (Recomendado)
- A tabela já possui `jornada_trabalho_id`
- A tabela `jornadas_trabalho` pode conter informações detalhadas
- Mais estruturado e normalizado

#### Opção 2: Adicionar Campo à Tabela
- Executar migration para adicionar `carga_horaria` à tabela `funcionarios`
- Atualizar RLS policies se necessário

### Campos Relacionados Existentes

A tabela possui campos relacionados a jornada:
- `jornada_id` (null)
- `jornada_trabalho_id` (number)

## 🎯 Status Final

✅ **ERRO CORRIGIDO**
- API não tenta mais atualizar campo inexistente
- Frontend não envia campo inexistente
- Interface limpa sem campo desnecessário
- Validação TypeScript passa sem erros

## 📝 Arquivos Modificados

1. `server/api/funcionarios/meus-dados.patch.ts` - Removida referência ao campo
2. `app/pages/meus-dados.vue` - Removido campo do template, objeto reativo e requisições
3. `verificar-colunas-funcionarios.mjs` - Script de verificação (novo)

**Data da correção:** 16/01/2026
**Testado e validado:** ✅