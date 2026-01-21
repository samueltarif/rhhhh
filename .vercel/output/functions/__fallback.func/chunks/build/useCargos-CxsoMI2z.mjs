import { ref, computed, readonly } from 'vue';

const useCargos = () => {
  const cargos = ref([]);
  const loading = ref(false);
  const error = ref("");
  const carregarCargos = async () => {
    loading.value = true;
    error.value = "";
    try {
      const response = await $fetch("/api/cargos");
      if (response.success && response.data) {
        cargos.value = Array.isArray(response.data) ? response.data : [];
      } else {
        cargos.value = [];
      }
    } catch (err) {
      error.value = "Erro ao carregar cargos";
      console.error("Erro ao carregar cargos:", err);
      cargos.value = [];
    } finally {
      loading.value = false;
    }
  };
  const salvarCargo = async (cargo) => {
    loading.value = true;
    try {
      const response = await $fetch("/api/cargos", {
        method: "POST",
        body: cargo
      });
      if (response.success) {
        await carregarCargos();
        return { success: true, message: response.message || "Cargo salvo com sucesso!" };
      }
      return { success: false, message: "Erro ao salvar cargo" };
    } catch (err) {
      console.error("Erro ao salvar cargo:", err);
      return { success: false, message: err.data?.message || "Erro ao salvar cargo" };
    } finally {
      loading.value = false;
    }
  };
  const opcoesCargos = computed(() => {
    if (!Array.isArray(cargos.value)) {
      return [];
    }
    return cargos.value.map((c) => ({
      value: c.id.toString(),
      label: c.nome
    }));
  });
  return {
    cargos: readonly(cargos),
    loading: readonly(loading),
    error: readonly(error),
    opcoesCargos,
    carregarCargos,
    salvarCargo
  };
};

export { useCargos as u };
//# sourceMappingURL=useCargos-CxsoMI2z.mjs.map
