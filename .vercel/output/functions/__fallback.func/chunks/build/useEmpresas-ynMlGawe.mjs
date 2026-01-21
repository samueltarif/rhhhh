import { ref, computed, readonly } from 'vue';

const useEmpresas = () => {
  const empresas = ref([]);
  const loading = ref(false);
  const error = ref("");
  const empresasExemplo = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      nome: "Empresa Exemplo LTDA",
      nome_fantasia: "Exemplo Corp",
      cnpj: "12.345.678/0001-90",
      inscricao_estadual: "123.456.789.012",
      logradouro: "Rua Exemplo",
      numero: "123",
      bairro: "Centro",
      municipio: "São Paulo",
      uf: "SP",
      cep: "01234-567",
      endereco_completo: "Rua Exemplo, 123 - Centro - São Paulo/SP - CEP: 01234-567",
      telefone: "(11) 3333-4444",
      email_holerites: "rh@empresa.com",
      situacao_cadastral: "ATIVA",
      atividade_principal: "Atividades de consultoria em gestão empresarial",
      porte: "DEMAIS",
      logo_url: "",
      funcionarios_count: 12,
      ativo: true
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      nome: "Tech Solutions S.A.",
      nome_fantasia: "TechSol",
      cnpj: "98.765.432/0001-10",
      inscricao_estadual: "987.654.321.098",
      logradouro: "Av. Tecnologia",
      numero: "456",
      bairro: "Copacabana",
      municipio: "Rio de Janeiro",
      uf: "RJ",
      cep: "22070-900",
      endereco_completo: "Av. Tecnologia, 456 - Copacabana - Rio de Janeiro/RJ - CEP: 22070-900",
      telefone: "(21) 2222-3333",
      email_holerites: "rh@techsolutions.com",
      situacao_cadastral: "ATIVA",
      atividade_principal: "Desenvolvimento de programas de computador sob encomenda",
      porte: "DEMAIS",
      logo_url: "",
      funcionarios_count: 25,
      ativo: true
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      nome: "Consultoria ABC LTDA",
      nome_fantasia: "ABC Consultoria",
      cnpj: "11.222.333/0001-44",
      inscricao_estadual: "111.222.333.444",
      logradouro: "Rua Consultoria",
      numero: "789",
      bairro: "Savassi",
      municipio: "Belo Horizonte",
      uf: "MG",
      cep: "30112-000",
      endereco_completo: "Rua Consultoria, 789 - Savassi - Belo Horizonte/MG - CEP: 30112-000",
      telefone: "(31) 1111-2222",
      email_holerites: "rh@consultoriaabc.com",
      situacao_cadastral: "BAIXADA",
      atividade_principal: "Atividades de consultoria em gestão empresarial",
      porte: "ME",
      logo_url: "",
      funcionarios_count: 8,
      ativo: false
    }
  ];
  const carregarEmpresas = async () => {
    loading.value = true;
    error.value = "";
    try {
      const response = await $fetch("/api/empresas");
      if (response.success && response.data) {
        empresas.value = response.data;
      }
    } catch (err) {
      error.value = "Erro ao carregar empresas";
      console.error("Erro ao carregar empresas:", err);
      empresas.value = empresasExemplo;
    } finally {
      loading.value = false;
    }
  };
  const salvarEmpresa = async (empresa) => {
    loading.value = true;
    try {
      const response = await $fetch("/api/empresas", {
        method: "POST",
        body: empresa
      });
      if (response.success) {
        await carregarEmpresas();
        return { success: true, message: response.message || "Empresa salva com sucesso!" };
      }
      return { success: false, message: "Erro ao salvar empresa" };
    } catch (err) {
      console.error("Erro ao salvar empresa:", err);
      return { success: false, message: err.data?.message || "Erro ao salvar empresa" };
    } finally {
      loading.value = false;
    }
  };
  const deletarEmpresa = async (empresaId) => {
    try {
      const response = await $fetch(`/api/empresas/${empresaId}`, {
        method: "DELETE"
      });
      if (response.success) {
        const index = empresas.value.findIndex((e) => e.id === empresaId);
        if (index !== -1) {
          empresas.value.splice(index, 1);
        }
        return { success: true, message: "Empresa excluída com sucesso!" };
      }
      return { success: false, message: "Erro ao excluir empresa" };
    } catch (err) {
      console.error("Erro ao excluir empresa:", err);
      return { success: false, message: err.data?.message || "Erro ao excluir empresa" };
    }
  };
  const obterEmpresaPorId = (id) => {
    return empresas.value.find((e) => e.id === id);
  };
  const obterEmpresasAtivas = computed(() => {
    return empresas.value;
  });
  const obterOpcoesEmpresas = computed(() => {
    return empresas.value.map((e) => ({
      value: e.id,
      label: e.nome
    }));
  });
  return {
    empresas: readonly(empresas),
    loading: readonly(loading),
    error: readonly(error),
    obterEmpresasAtivas,
    obterOpcoesEmpresas,
    carregarEmpresas,
    salvarEmpresa,
    deletarEmpresa,
    obterEmpresaPorId
  };
};

export { useEmpresas as u };
//# sourceMappingURL=useEmpresas-ynMlGawe.mjs.map
