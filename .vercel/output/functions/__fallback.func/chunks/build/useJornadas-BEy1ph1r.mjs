import { ref, computed, readonly } from 'vue';

const useJornadas = () => {
  const jornadas = ref([]);
  const loading = ref(false);
  const error = ref("");
  const diasSemana = [
    { id: 1, nome: "Segunda-feira", abrev: "Seg" },
    { id: 2, nome: "Terça-feira", abrev: "Ter" },
    { id: 3, nome: "Quarta-feira", abrev: "Qua" },
    { id: 4, nome: "Quinta-feira", abrev: "Qui" },
    { id: 5, nome: "Sexta-feira", abrev: "Sex" },
    { id: 6, nome: "Sábado", abrev: "Sáb" },
    { id: 7, nome: "Domingo", abrev: "Dom" }
  ];
  const carregarJornadas = async () => {
    loading.value = true;
    error.value = "";
    try {
      const response = await $fetch("/api/jornadas");
      if (response.success && response.data) {
        jornadas.value = response.data;
        return { success: true, message: "Jornadas carregadas com sucesso!" };
      }
      return { success: false, message: "Erro ao carregar jornadas" };
    } catch (err) {
      error.value = err.data?.message || "Erro ao carregar jornadas";
      console.error("Erro ao carregar jornadas:", err);
      jornadas.value = [
        {
          id: "1",
          nome: "Jornada 42h45min",
          descricao: "Jornada personalizada: Segunda a quinta 8h45min, sexta 7h45min",
          horas_semanais: 42.75,
          horas_mensais: 185.25,
          ativa: true,
          padrao: true,
          created_at: "2026-01-13T10:00:00Z",
          updated_at: "2026-01-13T10:00:00Z",
          horarios: []
        }
      ];
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };
  const salvarJornada = async (jornada) => {
    loading.value = true;
    try {
      const response = await $fetch("/api/jornadas", {
        method: "POST",
        body: jornada
      });
      if (response.success) {
        await carregarJornadas();
        return { success: true, message: response.message || "Jornada salva com sucesso!" };
      }
      return { success: false, message: "Erro ao salvar jornada" };
    } catch (err) {
      console.error("Erro ao salvar jornada:", err);
      return { success: false, message: err.data?.message || "Erro ao salvar jornada" };
    } finally {
      loading.value = false;
    }
  };
  const obterJornada = (id) => {
    return jornadas.value.find((j) => j.id === id);
  };
  const obterJornadaPadrao = () => {
    return jornadas.value.find((j) => j.padrao && j.ativa);
  };
  const opcoesJornadas = computed(() => {
    return jornadas.value.filter((j) => j.ativa).map((j) => ({
      value: j.id,
      label: `${j.nome} (${j.horas_semanais}h semanais)`
    }));
  });
  const formatarHorario = (horario) => {
    if (!horario || horario === "00:00") return "--";
    return horario.substring(0, 5);
  };
  const formatarHorasDecimais = (horas) => {
    if (horas === 0) return "0h";
    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);
    if (minutos === 0) {
      return `${horasInteiras}h`;
    }
    return `${horasInteiras}h${minutos.toString().padStart(2, "0")}min`;
  };
  const calcularHorasSemanais = (horarios) => {
    return horarios.filter((h) => h.trabalha).reduce((total, h) => total + h.horas_liquidas, 0);
  };
  const calcularHorasMensais = (horasSemanais) => {
    return horasSemanais * 4.33;
  };
  const obterNomeDia = (diaSemana) => {
    const dia = diasSemana.find((d) => d.id === diaSemana);
    return dia ? dia.nome : "Desconhecido";
  };
  const obterAbrevDia = (diaSemana) => {
    const dia = diasSemana.find((d) => d.id === diaSemana);
    return dia ? dia.abrev : "?";
  };
  const validarJornada = (horarios) => {
    const erros = [];
    horarios.forEach((horario) => {
      if (!horario.trabalha) return;
      if (horario.entrada >= horario.saida) {
        erros.push(`${obterNomeDia(horario.dia_semana)}: Horário de entrada deve ser anterior ao de saída`);
      }
      if (horario.intervalo_inicio && horario.intervalo_fim) {
        if (horario.intervalo_inicio >= horario.intervalo_fim) {
          erros.push(`${obterNomeDia(horario.dia_semana)}: Início do intervalo deve ser anterior ao fim`);
        }
        if (horario.intervalo_inicio <= horario.entrada || horario.intervalo_fim >= horario.saida) {
          erros.push(`${obterNomeDia(horario.dia_semana)}: Intervalo deve estar dentro do horário de trabalho`);
        }
      }
    });
    return {
      valida: erros.length === 0,
      erros
    };
  };
  return {
    // Estado
    jornadas: readonly(jornadas),
    loading: readonly(loading),
    error: readonly(error),
    // Dados auxiliares
    diasSemana,
    opcoesJornadas,
    // Métodos
    carregarJornadas,
    salvarJornada,
    obterJornada,
    obterJornadaPadrao,
    formatarHorario,
    formatarHorasDecimais,
    calcularHorasSemanais,
    calcularHorasMensais,
    obterNomeDia,
    obterAbrevDia,
    validarJornada
  };
};

export { useJornadas as u };
//# sourceMappingURL=useJornadas-BEy1ph1r.mjs.map
