-- CORREÇÃO FINAL DOS CAMPOS CALCULADOS DA TABELA HOLERITES
-- Este script remove os campos calculados e os recria corretamente

-- 1. Remover as colunas calculadas existentes (se existirem)
ALTER TABLE holerites 
DROP COLUMN IF EXISTS total_proventos CASCADE;

ALTER TABLE holerites 
DROP COLUMN IF EXISTS total_descontos CASCADE;

ALTER TABLE holerites 
DROP COLUMN IF EXISTS salario_liquido CASCADE;

-- 2. Recriar as colunas como campos normais (não calculados)
ALTER TABLE holerites 
ADD COLUMN total_proventos DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE holerites 
ADD COLUMN total_descontos DECIMAL(10,2) DEFAULT 0.00;

ALTER TABLE holerites 
ADD COLUMN salario_liquido DECIMAL(10,2) DEFAULT 0.00;

-- 3. Criar função para calcular automaticamente (trigger)
CREATE OR REPLACE FUNCTION calcular_valores_holerite()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular total de proventos
    NEW.total_proventos := COALESCE(NEW.salario_base, 0) + 
                          COALESCE(NEW.horas_extras, 0) + 
                          COALESCE(NEW.adicional_noturno, 0) + 
                          COALESCE(NEW.dsr_horas_extras, 0) + 
                          COALESCE(NEW.adicional_periculosidade, 0) + 
                          COALESCE(NEW.adicional_insalubridade, 0) + 
                          COALESCE(NEW.comissoes, 0) + 
                          COALESCE(NEW.bonus, 0) + 
                          COALESCE(NEW.ajuda_custo, 0) + 
                          COALESCE(NEW.outros_proventos, 0);

    -- Calcular total de descontos
    NEW.total_descontos := COALESCE(NEW.inss_desconto, 0) + 
                          COALESCE(NEW.irrf_desconto, 0) + 
                          COALESCE(NEW.fgts_desconto, 0) + 
                          COALESCE(NEW.vale_transporte_desconto, 0) + 
                          COALESCE(NEW.cesta_basica_desconto, 0) + 
                          COALESCE(NEW.plano_saude_desconto, 0) + 
                          COALESCE(NEW.plano_odonto_desconto, 0) + 
                          COALESCE(NEW.seguro_vida_desconto, 0) + 
                          COALESCE(NEW.pensao_alimenticia, 0) + 
                          COALESCE(NEW.emprestimo_consignado, 0) + 
                          COALESCE(NEW.adiantamento_salarial, 0) + 
                          COALESCE(NEW.outros_descontos, 0);

    -- Calcular salário líquido
    NEW.salario_liquido := NEW.total_proventos - NEW.total_descontos;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar trigger para executar a função
DROP TRIGGER IF EXISTS trigger_calcular_valores_holerite ON holerites;

CREATE TRIGGER trigger_calcular_valores_holerite
    BEFORE INSERT OR UPDATE ON holerites
    FOR EACH ROW
    EXECUTE FUNCTION calcular_valores_holerite();

-- 5. Verificar se a estrutura está correta
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'holerites' 
AND column_name IN ('total_proventos', 'total_descontos', 'salario_liquido')
ORDER BY column_name;