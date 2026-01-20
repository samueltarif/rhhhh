-- ========================================
-- SCRIPT PARA CRIAR FUNCIONÁRIOS USUÁRIOS
-- Execute este script no Supabase SQL Editor
-- ========================================

-- Inserir funcionários com dados fornecidos
INSERT INTO funcionarios (
  nome_completo,
  email,
  senha,
  cpf,
  data_nascimento,
  status,
  tipo,
  empresa_id,
  salario_base,
  numero_dependentes,
  pensao_alimenticia,
  created_at,
  updated_at
) VALUES 
-- 1. Cloves Alexandre da Silva Junior
(
  'Cloves Alexandre da Silva Junior',
  'clovesalex.11@hotmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', -- Hash SHA256 da senha
  '398.922.388-77',
  '1999-11-20',
  'ativo',
  'funcionario',
  1, -- Assumindo empresa_id = 1
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 2. Lucas Veiga Carneiro
(
  'Lucas Veiga Carneiro',
  'veiga4308@gmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  '545.026.218-38',
  '2003-03-09',
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 3. Vitor Gabriel da Silva
(
  'Vitor Gabriel da Silva',
  'contatovitorgabrieldasilva2005@gmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  '447.441.128-54',
  '2005-03-03',
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 4. Antonio Barbosa
(
  'Antonio Barbosa',
  'antoniobarbosasilva59@gmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  NULL, -- CPF não fornecido
  NULL, -- Data não fornecida
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 5. Marcos Paulo Menézes Pires
(
  'Marcos Paulo Menézes Pires',
  'marcospires4165@gmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  '521.464.618-61',
  NULL, -- Data não fornecida
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 6. Leonardo Santos
(
  'Leonardo Santos',
  'leozinhodocs12@gmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  NULL, -- CPF não fornecido
  NULL, -- Data não fornecida
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 7. Luccas Augusto de Souza Lomba
(
  'Luccas Augusto de Souza Lomba',
  'luccas.lomba27@gmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  '510.408.998-38',
  '2001-02-27',
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
),

-- 8. Arthur da Silva Barbosa
(
  'Arthur da Silva Barbosa',
  'arthur.barbosa10.07@hotmail.com',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  '432.690.308-27',
  '1994-07-10',
  'ativo',
  'funcionario',
  1,
  1500.00,
  0,
  0,
  NOW(),
  NOW()
)

-- Tratar conflitos de email (caso já existam)
ON CONFLICT (email) DO UPDATE SET
  nome_completo = EXCLUDED.nome_completo,
  cpf = COALESCE(EXCLUDED.cpf, funcionarios.cpf),
  data_nascimento = COALESCE(EXCLUDED.data_nascimento, funcionarios.data_nascimento),
  updated_at = NOW();

-- ========================================
-- ATUALIZAR SENHAS COM HASH CORRETO
-- ========================================

-- Atualizar senhas com hash SHA256 das senhas reais
UPDATE funcionarios SET 
  senha = encode(sha256(('Cx9@Lq7!mR2#A' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'clovesalex.11@hotmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('Vg8$P2!xN#4L' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'veiga4308@gmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('Ct@9R!5M#xA7' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'contatovitorgabrieldasilva2005@gmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('AbS59!@Xr8#Q' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'antoniobarbosasilva59@gmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('Mp4#S!9xR7@L' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'marcospires4165@gmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('Ld12@!R#8xQ' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'leozinhodocs12@gmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('Ll27#@R!9xS' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'luccas.lomba27@gmail.com';

UPDATE funcionarios SET 
  senha = encode(sha256(('Ab10.07@!R#x9' || 'rh_salt_2024')::bytea), 'hex'),
  updated_at = NOW()
WHERE email = 'arthur.barbosa10.07@hotmail.com';

-- ========================================
-- VERIFICAR FUNCIONÁRIOS CRIADOS
-- ========================================

-- Mostrar funcionários criados
SELECT 
  id,
  nome_completo,
  email,
  cpf,
  data_nascimento,
  status,
  salario_base,
  created_at
FROM funcionarios 
WHERE email IN (
  'clovesalex.11@hotmail.com',
  'veiga4308@gmail.com',
  'contatovitorgabrieldasilva2005@gmail.com',
  'antoniobarbosasilva59@gmail.com',
  'marcospires4165@gmail.com',
  'leozinhodocs12@gmail.com',
  'luccas.lomba27@gmail.com',
  'arthur.barbosa10.07@hotmail.com'
)
ORDER BY nome_completo;

-- ========================================
-- INFORMAÇÕES IMPORTANTES
-- ========================================

/*
🔐 CREDENCIAIS DE ACESSO CRIADAS:

1. Cloves Alexandre da Silva Junior
   📧 clovesalex.11@hotmail.com
   🔑 Cx9@Lq7!mR2#A
   📄 CPF: 398.922.388-77
   🎂 Nascimento: 20/11/1999

2. Lucas Veiga Carneiro
   📧 veiga4308@gmail.com
   🔑 Vg8$P2!xN#4L
   📄 CPF: 545.026.218-38
   🎂 Nascimento: 09/03/2003

3. Vitor Gabriel da Silva
   📧 contatovitorgabrieldasilva2005@gmail.com
   🔑 Ct@9R!5M#xA7
   📄 CPF: 447.441.128-54
   🎂 Nascimento: 03/03/2005

4. Antonio Barbosa
   📧 antoniobarbosasilva59@gmail.com
   🔑 AbS59!@Xr8#Q
   📄 CPF: Não fornecido
   🎂 Nascimento: Não fornecido

5. Marcos Paulo Menézes Pires
   📧 marcospires4165@gmail.com
   🔑 Mp4#S!9xR7@L
   📄 CPF: 521.464.618-61
   🎂 Nascimento: Não fornecido

6. Leonardo Santos
   📧 leozinhodocs12@gmail.com
   🔑 Ld12@!R#8xQ
   📄 CPF: Não fornecido
   🎂 Nascimento: Não fornecido

7. Luccas Augusto de Souza Lomba
   📧 luccas.lomba27@gmail.com
   🔑 Ll27#@R!9xS
   📄 CPF: 510.408.998-38
   🎂 Nascimento: 27/02/2001

8. Arthur da Silva Barbosa
   📧 arthur.barbosa10.07@hotmail.com
   🔑 Ab10.07@!R#x9
   📄 CPF: 432.690.308-27
   🎂 Nascimento: 10/07/1994

⚠️ PRÓXIMOS PASSOS:
1. Complete os dados faltantes (CPF, data nascimento) no painel admin
2. Configure salários específicos para cada funcionário
3. Defina cargos e departamentos
4. Oriente os funcionários a alterarem as senhas no primeiro acesso
5. Configure benefícios (vale transporte, planos de saúde, etc.)

✅ Todos os funcionários foram criados com:
- Status: Ativo
- Tipo: Funcionário
- Salário base: R$ 1.500,00 (ajustar conforme necessário)
- Dependentes: 0 (ajustar conforme necessário)
- Pensão alimentícia: R$ 0,00 (ajustar conforme necessário)
*/