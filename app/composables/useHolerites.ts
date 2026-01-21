export const useHolerites = () => {
  // Função para determinar se um holerite é adiantamento
  const isAdiantamento = (holerite: any): boolean => {
    // Verifica se é quinzena 1 ou se o período vai do dia 15 ao último dia do mês
    if (holerite.quinzena === 1) return true
    
    if (holerite.periodo_inicio && holerite.periodo_fim) {
      const inicio = new Date(holerite.periodo_inicio)
      const fim = new Date(holerite.periodo_fim)
      // Adiantamento: período do dia 15 ao último dia do mês
      return inicio.getDate() === 15 && fim.getDate() >= 28
    }
    
    // Verifica pelo tipo ou referência
    return holerite.tipo?.toLowerCase().includes('adiantamento') ||
           holerite.referencia?.toLowerCase().includes('adiantamento')
  }

  // Função para obter o tipo do holerite
  const getTipoHolerite = (holerite: any): 'adiantamento' | 'folha_mensal' => {
    return isAdiantamento(holerite) ? 'adiantamento' : 'folha_mensal'
  }

  // Função para obter label do tipo
  const getTipoLabel = (holerite: any): string => {
    return isAdiantamento(holerite) ? '💰 Adiantamento' : '📊 Folha Mensal'
  }

  // Função para verificar se uma data é feriado
  const isFeriado = (data: Date): boolean => {
    const feriados = [
      // Feriados fixos
      '01-01', // Ano Novo
      '04-21', // Tiradentes
      '05-01', // Dia do Trabalhador
      '09-07', // Independência do Brasil
      '10-12', // Nossa Senhora Aparecida
      '11-02', // Finados
      '11-15', // Proclamação da República
      '12-25', // Natal
      
      // Adicione outros feriados fixos conforme necessário
    ]
    
    const meseDia = data.toISOString().slice(5, 10)
    return feriados.includes(meseDia)
  }

  // Função para verificar se é fim de semana
  const isFimDeSemana = (data: Date): boolean => {
    const diaSemana = data.getDay()
    return diaSemana === 0 || diaSemana === 6 // Domingo ou Sábado
  }

  // Função para verificar se é dia útil
  const isDiaUtil = (data: Date): boolean => {
    return !isFimDeSemana(data) && !isFeriado(data)
  }

  // Função para encontrar o último dia útil anterior a uma data
  const obterUltimoDiaUtil = (data: Date): Date => {
    const novaData = new Date(data)
    
    // Volta um dia até encontrar um dia útil
    while (!isDiaUtil(novaData)) {
      novaData.setDate(novaData.getDate() - 1)
    }
    
    return novaData
  }

  // Função para calcular a data de disponibilização do holerite do dia 20
  const calcularDataDisponibilizacaoHolerite20 = (ano: number, mes: number): Date => {
    // Data do dia 20 do mês
    const dia20 = new Date(ano, mes - 1, 20)
    
    // Se o dia 20 cair em dia útil, disponibiliza 2 dias antes
    if (isDiaUtil(dia20)) {
      const dataDisponibilizacao = new Date(dia20)
      dataDisponibilizacao.setDate(dataDisponibilizacao.getDate() - 2)
      
      // Se 2 dias antes não for dia útil, encontra o último dia útil anterior
      if (!isDiaUtil(dataDisponibilizacao)) {
        return obterUltimoDiaUtil(dataDisponibilizacao)
      }
      
      return dataDisponibilizacao
    } else {
      // Se o dia 20 não for dia útil, encontra o último dia útil anterior
      const ultimoDiaUtil = obterUltimoDiaUtil(dia20)
      
      // Disponibiliza 2 dias antes do último dia útil
      const dataDisponibilizacao = new Date(ultimoDiaUtil)
      dataDisponibilizacao.setDate(dataDisponibilizacao.getDate() - 2)
      
      // Se 2 dias antes não for dia útil, encontra o último dia útil anterior
      if (!isDiaUtil(dataDisponibilizacao)) {
        return obterUltimoDiaUtil(dataDisponibilizacao)
      }
      
      return dataDisponibilizacao
    }
  }

  // Função para verificar se o holerite do dia 20 deve estar disponível hoje
  const deveEstarDisponivelHolerite20 = (ano: number, mes: number): boolean => {
    const hoje = new Date()
    const dataDisponibilizacao = calcularDataDisponibilizacaoHolerite20(ano, mes)
    
    return hoje >= dataDisponibilizacao
  }

  // Função para calcular próximas datas de disponibilização
  const calcularProximasDisponibilizacoes = (): Array<{
    tipo: 'inicio_mes' | 'dia_20'
    mes: number
    ano: number
    dataDisponibilizacao: Date
    descricao: string
  }> => {
    const hoje = new Date()
    const proximasDisponibilizacoes = []
    
    // Calcular para os próximos 6 meses
    for (let i = 0; i < 6; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1)
      const ano = data.getFullYear()
      const mes = data.getMonth() + 1
      
      // Holerite do início do mês (manual)
      proximasDisponibilizacoes.push({
        tipo: 'inicio_mes' as const,
        mes,
        ano,
        dataDisponibilizacao: new Date(ano, mes - 1, 1), // Placeholder - será manual
        descricao: `Holerite ${mes.toString().padStart(2, '0')}/${ano} - 1ª Quinzena (Manual)`
      })
      
      // Holerite do dia 20 (automático)
      const dataHolerite20 = calcularDataDisponibilizacaoHolerite20(ano, mes)
      proximasDisponibilizacoes.push({
        tipo: 'dia_20' as const,
        mes,
        ano,
        dataDisponibilizacao: dataHolerite20,
        descricao: `Holerite ${mes.toString().padStart(2, '0')}/${ano} - 2ª Quinzena (Automático)`
      })
    }
    
    return proximasDisponibilizacoes.sort((a, b) => 
      a.dataDisponibilizacao.getTime() - b.dataDisponibilizacao.getTime()
    )
  }

  // Função para formatar data para exibição
  const formatarData = (data: Date): string => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Função para formatar data e hora para exibição
  const formatarDataHora = (data: Date): string => {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Função para calcular período de pagamento quinzenal
  const calcularPeriodoQuinzenal = (ano: number, mes: number, quinzena: 1 | 2): {
    inicio: Date
    fim: Date
    descricao: string
  } => {
    if (quinzena === 1) {
      // Primeira quinzena (Adiantamento): dia 15 ao último dia do mês
      const ultimoDia = new Date(ano, mes, 0).getDate()
      return {
        inicio: new Date(ano, mes - 1, 15),
        fim: new Date(ano, mes - 1, ultimoDia),
        descricao: `Adiantamento Salarial - 15 a ${ultimoDia}/${mes.toString().padStart(2, '0')}/${ano}`
      }
    } else {
      // Segunda quinzena (Folha Mensal): dia 1 ao último dia do mês
      const ultimoDia = new Date(ano, mes, 0).getDate()
      return {
        inicio: new Date(ano, mes - 1, 1),
        fim: new Date(ano, mes - 1, ultimoDia),
        descricao: `Folha Mensal - 01 a ${ultimoDia}/${mes.toString().padStart(2, '0')}/${ano}`
      }
    }
  }

  // Função para verificar se funcionário tem salário quinzenal
  const isSalarioQuinzenal = (funcionario: any): boolean => {
    return funcionario?.tipo_salario === 'quinzenal'
  }

  // Função para calcular valor quinzenal
  const calcularValorQuinzenal = (salarioMensal: number): number => {
    return salarioMensal / 2
  }

  return {
    // Funções de tipo de holerite
    isAdiantamento,
    getTipoHolerite,
    getTipoLabel,
    
    // Funções de data e feriados
    isFeriado,
    isFimDeSemana,
    isDiaUtil,
    obterUltimoDiaUtil,
    calcularDataDisponibilizacaoHolerite20,
    deveEstarDisponivelHolerite20,
    calcularProximasDisponibilizacoes,
    
    // Funções de formatação
    formatarData,
    formatarDataHora,
    
    // Funções de cálculo
    calcularPeriodoQuinzenal,
    isSalarioQuinzenal,
    calcularValorQuinzenal
  }
}