function gerarHoleriteHTML(holerite, funcionario, empresa) {
  var _a;
  const periodoInicio = new Date(holerite.periodo_inicio);
  const periodoFim = new Date(holerite.periodo_fim);
  const mesAno = periodoInicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const dataAdmissao = funcionario.data_admissao ? new Date(funcionario.data_admissao).toLocaleDateString("pt-BR") : "N\xE3o informada";
  const numeroDependentes = funcionario.numero_dependentes || 0;
  const diaInicio = periodoInicio.getDate();
  const diaFim = periodoFim.getDate();
  let tipoFolha = "Folha Mensal";
  let isAdiantamento = false;
  let corTema = "#2563eb";
  let corFundo = "#eff6ff";
  if (diaInicio === 1 && diaFim <= 15) {
    tipoFolha = "Adiantamento Salarial - 1\xAA Quinzena";
    isAdiantamento = true;
    corTema = "#ea580c";
    corFundo = "#fff7ed";
  } else if (diaInicio === 16) {
    tipoFolha = "Folha Quinzenal - 2\xAA Quinzena";
  }
  const cnpjFormatado = ((_a = empresa.cnpj) == null ? void 0 : _a.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")) || "";
  const salarioBase = Number(holerite.salario_base) || 0;
  const bonus = Number(holerite.bonus) || 0;
  const horasExtras = Number(holerite.horas_extras) || 0;
  const adicionalNoturno = Number(holerite.adicional_noturno) || 0;
  const adicionalPericulosidade = Number(holerite.adicional_periculosidade) || 0;
  const adicionalInsalubridade = Number(holerite.adicional_insalubridade) || 0;
  const comissoes = Number(holerite.comissoes) || 0;
  const inss = Number(holerite.inss) || 0;
  const irrf = Number(holerite.irrf) || 0;
  const valeTransporte = Number(holerite.vale_transporte) || 0;
  const cestaBasica = Number(holerite.cesta_basica_desconto) || 0;
  const planoSaude = Number(holerite.plano_saude) || 0;
  const planoOdonto = Number(holerite.plano_odontologico) || 0;
  const adiantamento = Number(holerite.adiantamento) || 0;
  const faltas = Number(holerite.faltas) || 0;
  const pensaoAlimenticia = Number(funcionario.pensao_alimenticia) || 0;
  const beneficiosPersonalizados = holerite.beneficios || [];
  const descontosPersonalizados = holerite.descontos_personalizados || [];
  let totalBeneficiosPersonalizados = 0;
  beneficiosPersonalizados.forEach((b) => {
    if (b.valor > 0) {
      totalBeneficiosPersonalizados += Number(b.valor) || 0;
    }
  });
  let totalDescontosPersonalizados = 0;
  descontosPersonalizados.forEach((d) => {
    totalDescontosPersonalizados += Number(d.valor) || 0;
  });
  const totalVencimentos = salarioBase + bonus + horasExtras + adicionalNoturno + adicionalPericulosidade + adicionalInsalubridade + comissoes + totalBeneficiosPersonalizados;
  const totalDescontos = inss + irrf + valeTransporte + cestaBasica + planoSaude + planoOdonto + adiantamento + faltas + pensaoAlimenticia + totalDescontosPersonalizados;
  const valorLiquido = totalVencimentos - totalDescontos;
  const fgts = salarioBase * 0.08;
  const agora = /* @__PURE__ */ new Date();
  const dataHoraAssinatura = agora.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "medium"
  });
  let linhasTabela = "";
  if (salarioBase > 0) {
    linhasTabela += `
        <tr>
          <td>8781</td>
          <td>DIAS NORMAIS</td>
          <td class="text-center">30,00</td>
          <td class="text-right">${salarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (bonus > 0) {
    linhasTabela += `
        <tr>
          <td>100</td>
          <td>B\xD4NUS</td>
          <td class="text-center"></td>
          <td class="text-right">${bonus.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (horasExtras > 0) {
    linhasTabela += `
        <tr>
          <td>200</td>
          <td>HORAS EXTRAS</td>
          <td class="text-center"></td>
          <td class="text-right">${horasExtras.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (adicionalNoturno > 0) {
    linhasTabela += `
        <tr>
          <td>300</td>
          <td>ADICIONAL NOTURNO</td>
          <td class="text-center"></td>
          <td class="text-right">${adicionalNoturno.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (adicionalPericulosidade > 0) {
    linhasTabela += `
        <tr>
          <td>400</td>
          <td>ADICIONAL DE PERICULOSIDADE</td>
          <td class="text-center"></td>
          <td class="text-right">${adicionalPericulosidade.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (adicionalInsalubridade > 0) {
    linhasTabela += `
        <tr>
          <td>500</td>
          <td>ADICIONAL DE INSALUBRIDADE</td>
          <td class="text-center"></td>
          <td class="text-right">${adicionalInsalubridade.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (comissoes > 0) {
    linhasTabela += `
        <tr>
          <td>600</td>
          <td>COMISS\xD5ES</td>
          <td class="text-center"></td>
          <td class="text-right">${comissoes.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
  }
  if (beneficiosPersonalizados && beneficiosPersonalizados.length > 0) {
    let codigoBeneficio = 700;
    beneficiosPersonalizados.forEach((beneficio) => {
      if (beneficio.valor > 0) {
        linhasTabela += `
        <tr>
          <td>${codigoBeneficio}</td>
          <td>${(beneficio.tipo || beneficio.descricao || "BENEF\xCDCIO").toUpperCase()}</td>
          <td class="text-center"></td>
          <td class="text-right">${Number(beneficio.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td></td>
        </tr>`;
        codigoBeneficio++;
      }
    });
  }
  if (inss > 0) {
    linhasTabela += `
        <tr>
          <td>998</td>
          <td>I.N.S.S.</td>
          <td class="text-center">${holerite.aliquota_inss || "9,23"}</td>
          <td></td>
          <td class="text-right">${inss.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (irrf > 0) {
    linhasTabela += `
        <tr>
          <td>999</td>
          <td>I.R.R.F.</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${irrf.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (adiantamento > 0) {
    linhasTabela += `
        <tr>
          <td>910</td>
          <td>ADIANTAMENTO SALARIAL</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${adiantamento.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (pensaoAlimenticia > 0) {
    linhasTabela += `
        <tr>
          <td>915</td>
          <td>PENS\xC3O ALIMENT\xCDCIA</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${pensaoAlimenticia.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (valeTransporte > 0) {
    linhasTabela += `
        <tr>
          <td>920</td>
          <td>VALE TRANSPORTE</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${valeTransporte.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (cestaBasica > 0) {
    linhasTabela += `
        <tr>
          <td>930</td>
          <td>CESTA B\xC1SICA</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${cestaBasica.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (planoSaude > 0) {
    linhasTabela += `
        <tr>
          <td>940</td>
          <td>PLANO DE SA\xDADE</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${planoSaude.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (planoOdonto > 0) {
    linhasTabela += `
        <tr>
          <td>950</td>
          <td>PLANO ODONTOL\xD3GICO</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${planoOdonto.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (pensaoAlimenticia > 0) {
    linhasTabela += `
        <tr>
          <td>960</td>
          <td>PENS\xC3O ALIMENT\xCDCIA</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${pensaoAlimenticia.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (faltas > 0) {
    linhasTabela += `
        <tr>
          <td>960</td>
          <td>FALTAS</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${faltas.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
  }
  if (descontosPersonalizados && descontosPersonalizados.length > 0) {
    let codigoDesconto = 970;
    descontosPersonalizados.forEach((desconto) => {
      if (desconto.valor > 0) {
        linhasTabela += `
        <tr>
          <td>${codigoDesconto}</td>
          <td>${(desconto.tipo || desconto.descricao || "DESCONTO").toUpperCase()}</td>
          <td class="text-center"></td>
          <td></td>
          <td class="text-right">${Number(desconto.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`;
        codigoDesconto++;
      }
    });
  }
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Holerite - ${funcionario.nome_completo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #333;
      padding: 20px;
      background: ${corFundo};
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      margin-bottom: 20px;
      padding: 20px 20px 15px 20px;
      border-bottom: 3px solid ${corTema};
      background: linear-gradient(135deg, ${corFundo} 0%, white 100%);
      border-radius: 8px 8px 0 0;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    
    .company-name {
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      color: ${corTema};
    }
    
    .company-cnpj {
      font-size: 11px;
      margin-top: 3px;
      color: #666;
    }
    
    .header-right {
      text-align: right;
    }
    
    .folha-tipo {
      font-size: 14px;
      font-weight: bold;
      color: ${corTema};
      background: white;
      padding: 8px 16px;
      border-radius: 20px;
      border: 2px solid ${corTema};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .folha-tipo::before {
      content: "${isAdiantamento ? "\u{1F4B0}" : "\u{1F4CA}"}";
      margin-right: 8px;
    }
    
    .competencia {
      font-size: 11px;
      text-transform: capitalize;
      margin-top: 5px;
      color: #666;
    }
    
    .employee-info {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin: 0 20px 20px 20px;
      padding: 15px;
      background: ${corFundo};
      border: 2px solid ${corTema};
      border-radius: 8px;
    }
    
    .info-item {
      font-size: 10px;
    }
    
    .info-label {
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
    }
    
    .info-value {
      display: block;
    }
    
    table {
      width: calc(100% - 40px);
      margin: 0 20px 15px 20px;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    th {
      background: ${corTema};
      color: white;
      padding: 12px 8px;
      text-align: left;
      font-size: 11px;
      font-weight: bold;
      border: none;
    }
    
    td {
      padding: 8px;
      border: 1px solid #e5e7eb;
      font-size: 10px;
      background: white;
    }
    
    tr:nth-child(even) td {
      background: #f9fafb;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals {
      margin: 10px 20px 20px 20px;
      padding: 20px;
      background: linear-gradient(135deg, ${corFundo} 0%, white 100%);
      border: 3px solid ${corTema};
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .total-row:last-child {
      border-bottom: none;
    }
    
    .total-row.liquido {
      font-size: 16px;
      font-weight: bold;
      padding: 15px 0 10px 0;
      border-top: 3px solid ${corTema};
      margin-top: 10px;
      color: ${corTema};
    }
    
    .signature {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      font-size: 10px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .signature-image {
      max-width: 200px;
      height: auto;
    }
    
    .signature-text {
      flex: 1;
    }
    
    .signature-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .bases-calculo {
      margin-top: 20px;
    }
    
    .bases-title {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 10px;
      padding: 5px;
      background: #f0f0f0;
      border: 1px solid #ccc;
    }
    
    .bases-table {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 1px;
      background: #ccc;
      border: 1px solid #ccc;
    }
    
    .base-item {
      background: white;
      padding: 8px 5px;
      font-size: 9px;
      text-align: center;
    }
    
    .base-label {
      font-weight: bold;
      display: block;
      margin-bottom: 3px;
    }
    
    .base-value {
      display: block;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .container {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        <div>
          <div class="company-name">${empresa.nome_fantasia || empresa.nome}</div>
          <div class="company-cnpj">CNPJ: ${cnpjFormatado}</div>
          <div class="company-cnpj">CC: GERAL</div>
          <div class="company-cnpj">Mensalista</div>
        </div>
        <div class="header-right">
          <div class="folha-tipo">${tipoFolha}</div>
          <div class="competencia">${mesAno}</div>
        </div>
      </div>
    </div>
    
    <div class="employee-info">
      <div class="info-item">
        <span class="info-label">C\xF3digo</span>
        <span class="info-value">${funcionario.id}</span>
      </div>
      <div class="info-item" style="grid-column: span 2;">
        <span class="info-label">Nome do Funcion\xE1rio</span>
        <span class="info-value">${funcionario.nome_completo}</span>
        <span class="info-value">${funcionario.cargo_nome || "CARGO N\xC3O DEFINIDO"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">CBO</span>
        <span class="info-value">354125</span>
      </div>
      <div class="info-item">
        <span class="info-label">Departamento</span>
        <span class="info-value">${funcionario.departamento_nome || "Comercial"}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Mat</span>
        <span class="info-value">${funcionario.id}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Admiss\xE3o:</span>
        <span class="info-value">${dataAdmissao}</span>
      </div>
      ${numeroDependentes > 0 ? `
      <div class="info-item">
        <span class="info-label">Dependentes:</span>
        <span class="info-value">${numeroDependentes}</span>
      </div>` : ""}
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">C\xF3digo</th>
          <th style="width: 40%;">Descri\xE7\xE3o</th>
          <th style="width: 15%;" class="text-center">Refer\xEAncia</th>
          <th style="width: 17.5%;" class="text-right">Vencimentos</th>
          <th style="width: 17.5%;" class="text-right">Descontos</th>
        </tr>
      </thead>
      <tbody>
        ${linhasTabela}
      </tbody>
    </table>
    
    <div class="totals">
      <div class="total-row">
        <span>Total de Vencimentos</span>
        <span>${totalVencimentos.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row">
        <span>Total de Descontos</span>
        <span>${totalDescontos.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-row liquido">
        <span>Valor L\xEDquido</span>
        <span>${valorLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
    
    <div class="signature">
      <img src="/ass.png" alt="Assinatura Digital" class="signature-image" />
      <div class="signature-text">
        <div class="signature-title">Assinado de forma digital por ${empresa.responsavel_nome || "SILVANA APARECIDA BARDUCHI"}</div>
        <div>CPF: ${empresa.responsavel_cpf || "04487488869"}</div>
        <div>Dados: ${dataHoraAssinatura} -03'00'</div>
      </div>
    </div>
    
    <div class="bases-calculo">
      <div class="bases-title">Bases de C\xE1lculo</div>
      <div class="bases-table">
        <div class="base-item">
          <span class="base-label">Sal\xE1rio Base</span>
          <span class="base-value">${salarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Sal. Contr. INSS</span>
          <span class="base-value">${(holerite.base_inss || salarioBase).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Base C\xE1lc. FGTS</span>
          <span class="base-value">${salarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">F.G.T.S do M\xEAs</span>
          <span class="base-value">${fgts.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Base C\xE1lc. IRRF</span>
          <span class="base-value">${(totalVencimentos - inss).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="base-item">
          <span class="base-label">Faixa IRRF</span>
          <span class="base-value">${holerite.faixa_irrf || "0,00"}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export { gerarHoleriteHTML as g };
//# sourceMappingURL=holeriteHTML.mjs.map
