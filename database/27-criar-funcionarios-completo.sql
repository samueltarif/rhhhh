-- ========================================
-- SCRIPT COMPLETO PARA SUPABASE SQL EDITOR
-- 1. Adiciona coluna responsavel_cadastro_id
-- 2. Cria os 8 funcionários solicitados
-- ========================================

-- PARTE 1: ADICIONAR COLUNA RESPONSÁVEL CADASTRO
-- ========================================

-- Adicionar coluna responsavel_cadastro_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'funcionarios' 
        AND column_name = 'responsavel_cadastro_id'
    ) THEN
        ALTER TABLE funcionarios 
        ADD COLUMN responsavel_cadastro_id INTEGER REFERENCES funcionarios(id);
        
        RAISE NOTICE 'Coluna responsavel_cadastro_id adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna responsavel_cadastro_id já existe';
    END IF;
END $$;

-- Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_funcionarios_responsavel_cadastro 
ON funcionarios(responsavel_cadastro_id);

-- PARTE 2: CRIAR FUNCIONÁRIOS
-- ========================================

-- Buscar ID do admin para usar como responsável pelo cadastro
DO $$
DECLARE
    admin_id INTEGER;
BEGIN
    -- Buscar ID do admin (Silvana ou primeiro admin encontrado)
    SELECT id INTO admin_id 
    FROM funcionarios 
    WHERE tipo_acesso = 'admin' 
    OR email_login ILIKE '%silvana%'
    ORDER BY 
        CASE WHEN email_login ILIKE '%silvana%' THEN 1 ELSE 2 END,
        id 
    LIMIT 1;
    
    IF admin_id IS NULL THEN
        RAISE NOTICE 'Admin não encontrado, funcionários serão criados sem responsável';
        admin_id := NULL;
    ELSE
        RAISE NOTICE 'Admin encontrado com ID: %', admin_id;
    END IF;

    -- Inserir funcionários com dados fornecidos
    INSERT INTO funcionarios (
        nome_completo,
        email_login,
        senha,
        cpf,
        data_nascimento,
        status,
        tipo_acesso,
        empresa_id,
        salario_base,
        numero_dependentes,
        pensao_alimenticia,
        responsavel_cadastro_id,
        created_at,
        updated_at
    ) VALUES 
    -- 1. Cloves Alexandre da Silva Junior
    (
        'Cloves Alexandre da Silva Junior',
        'clovesalex.11@hotmail.com',
        encode(sha256(('Cx9@Lq7!mR2#A' || 'salt_rh_system')::bytea), 'hex'),
        '398.922.388-77',
        '1999-11-20',
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 2. Lucas Veiga Carneiro
    (
        'Lucas Veiga Carneiro',
        'veiga4308@gmail.com',
        encode(sha256(('Vg8$P2!xN#4L' || 'salt_rh_system')::bytea), 'hex'),
        '545.026.218-38',
        '2003-03-09',
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 3. Vitor Gabriel da Silva
    (
        'Vitor Gabriel da Silva',
        'contatovitorgabrieldasilva2005@gmail.com',
        encode(sha256(('Ct@9R!5M#xA7' || 'salt_rh_system')::bytea), 'hex'),
        '447.441.128-54',
        '2005-03-03',
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 4. Antonio Barbosa
    (
        'Antonio Barbosa',
        'antoniobarbosasilva59@gmail.com',
        encode(sha256(('AbS59!@Xr8#Q' || 'salt_rh_system')::bytea), 'hex'),
        NULL, -- CPF não fornecido
        NULL, -- Data não fornecida
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 5. Marcos Paulo Menézes Pires
    (
        'Marcos Paulo Menézes Pires',
        'marcospires4165@gmail.com',
        encode(sha256(('Mp4#S!9xR7@L' || 'salt_rh_system')::bytea), 'hex'),
        '521.464.618-61',
        NULL, -- Data não fornecida
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 6. Leonardo Santos (Leo)
    (
        'Leonardo Santos',
        'leozinhodocs12@gmail.com',
        encode(sha256(('Ld12@!R#8xQ' || 'salt_rh_system')::bytea), 'hex'),
        NULL, -- CPF não fornecido
        NULL, -- Data não fornecida
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 7. Luccas Augusto de Souza Lomba
    (
        'Luccas Augusto de Souza Lomba',
        'luccas.lomba27@gmail.com',
        encode(sha256(('Ll27#@R!9xS' || 'salt_rh_system')::bytea), 'hex'),
        '510.408.998-38',
        '2001-02-27',
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    ),

    -- 8. Arthur da Silva Barbosa
    (
        'Arthur da Silva Barbosa',
        'arthur.barbosa10.07@hotmail.com',
        encode(sha256(('Ab10.07@!R#x9' || 'salt_rh_system')::bytea), 'hex'),
        '432.690.308-27',
        '1994-07-10',
        'ativo',
        'funcionario',
        1,
        1500.00,
        0,
        0,
        admin_id,
        NOW(),
        NOW()
    )

    -- Tratar conflitos de email (caso já existam)
    ON CONFLICT (email_login) DO UPDATE SET
        nome_completo = EXCLUDED.nome_completo,
        cpf = COALESCE(EXCLUDED.cpf, funcionarios.cpf),
        data_nascimento = COALESCE(EXCLUDED.data_nascimento, funcionarios.data_nascimento),
        responsavel_cadastro_id = COALESCE(EXCLUDED.responsavel_cadastro_id, funcionarios.responsavel_cadastro_id),
        updated_at = NOW();

    RAISE NOTICE 'Funcionários inseridos/atualizados com sucesso';
END $$;

-- PARTE 3: ATUALIZAR FUNCIONÁRIOS EXISTENTES SEM RESPONSÁVEL
-- ========================================

-- Atualizar funcionários existentes para ter responsável pelo cadastro
UPDATE funcionarios 
SET responsavel_cadastro_id = (
    SELECT id FROM funcionarios 
    WHERE tipo_acesso = 'admin' 
    OR email_login ILIKE '%silvana%'
    ORDER BY 
        CASE WHEN email_login ILIKE '%silvana%' THEN 1 ELSE 2 END,
        id 
    LIMIT 1
),
updated_at = NOW()
WHERE responsavel_cadastro_id IS NULL;

-- PARTE 4: VERIFICAR RESULTADO
-- ========================================

-- Mostrar funcionários criados/atualizados
SELECT 
    f.id,
    f.nome_completo,
    f.email_login,
    f.cpf,
    f.data_nascimento,
    f.status,
    f.salario_base,
    r.nome_completo as responsavel_cadastro,
    f.created_at
FROM funcionarios f
LEFT JOIN funcionarios r ON f.responsavel_cadastro_id = r.id
WHERE f.email_login IN (
    'clovesalex.11@hotmail.com',
    'veiga4308@gmail.com',
    'contatovitorgabrieldasilva2005@gmail.com',
    'antoniobarbosasilva59@gmail.com',
    'marcospires4165@gmail.com',
    'leozinhodocs12@gmail.com',
    'luccas.lomba27@gmail.com',
    'arthur.barbosa10.07@hotmail.com'
)
ORDER BY f.nome_completo;

-- Mostrar estatísticas
SELECT 
    'Total de funcionários' as estatistica,
    COUNT(*) as quantidade
FROM funcionarios
UNION ALL
SELECT 
    'Funcionários com responsável cadastro',
    COUNT(*)
FROM funcionarios 
WHERE responsavel_cadastro_id IS NOT NULL
UNION ALL
SELECT 
    'Funcionários criados hoje',
    COUNT(*)
FROM funcionarios 
WHERE DATE(created_at) = CURRENT_DATE;

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

✅ FUNCIONALIDADES IMPLEMENTADAS:
- Coluna responsavel_cadastro_id adicionada
- Todos os funcionários têm responsável pelo cadastro definido
- Senhas criptografadas com SHA256
- Status ativo para todos
- Salário base padrão de R$ 1.500,00
- Tratamento de conflitos de email
- Índices para performance

🔧 HASH DAS SENHAS:
As senhas são criptografadas usando SHA256 com salt 'salt_rh_system'
Para verificar: encode(sha256(('SENHA' || 'salt_rh_system')::bytea), 'hex')
*/