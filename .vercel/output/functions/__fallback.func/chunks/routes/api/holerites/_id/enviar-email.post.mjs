import { d as defineEventHandler, a as useRuntimeConfig, e as getRouterParam, c as createError } from '../../../../_/nitro.mjs';
import { a as enviarEmail } from '../../../../_/email.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'nodemailer';

const enviarEmail_post = defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const supabaseUrl = config.public.supabaseUrl;
    const serviceRoleKey = config.supabaseServiceRoleKey || config.public.supabaseKey;
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "ID do holerite n\xE3o fornecido"
      });
    }
    console.log("\u{1F4E7} Buscando holerite ID:", id);
    const holeriteResponse = await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}&select=*`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!holeriteResponse.ok) {
      const errorText = await holeriteResponse.text();
      console.error("\u274C Erro ao buscar holerite:", errorText);
      throw new Error("Erro ao buscar holerite");
    }
    const holerites = await holeriteResponse.json();
    if (!holerites || holerites.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Holerite n\xE3o encontrado"
      });
    }
    const holerite = holerites[0];
    console.log("\u2705 Holerite encontrado:", holerite.id);
    const funcionarioResponse = await fetch(
      `${supabaseUrl}/rest/v1/funcionarios?id=eq.${holerite.funcionario_id}&select=*`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!funcionarioResponse.ok) {
      throw new Error("Erro ao buscar funcion\xE1rio");
    }
    const funcionarios = await funcionarioResponse.json();
    if (!funcionarios || funcionarios.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Funcion\xE1rio n\xE3o encontrado"
      });
    }
    const funcionario = funcionarios[0];
    console.log("\u2705 Funcion\xE1rio encontrado:", funcionario.nome_completo);
    const emailDestino = funcionario.email || funcionario.email_login;
    if (!emailDestino) {
      throw createError({
        statusCode: 400,
        message: "Funcion\xE1rio n\xE3o possui email cadastrado"
      });
    }
    const periodoInicio = new Date(holerite.periodo_inicio);
    const periodoFim = new Date(holerite.periodo_fim);
    const mesAno = periodoInicio.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    let tipoHolerite = "mensal";
    if (periodoInicio.getDate() === 1 && periodoFim.getDate() <= 15) {
      tipoHolerite = "1\xAA quinzena";
    } else if (periodoInicio.getDate() === 16) {
      tipoHolerite = "2\xAA quinzena";
    }
    console.log("\u{1F4E8} Enviando email para:", emailDestino);
    const emailEnviado = await enviarEmail({
      to: emailDestino,
      subject: `Holerite dispon\xEDvel - ${mesAno}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Holerite Dispon\xEDvel</h2>
          
          <p>Ol\xE1, <strong>${funcionario.nome_completo}</strong>!</p>
          
          <p>Seu holerite referente a <strong>${mesAno} (${tipoHolerite})</strong> est\xE1 dispon\xEDvel para visualiza\xE7\xE3o.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Resumo do Holerite</h3>
            <p><strong>Per\xEDodo:</strong> ${periodoInicio.toLocaleDateString("pt-BR")} a ${periodoFim.toLocaleDateString("pt-BR")}</p>
            <p><strong>Sal\xE1rio Base:</strong> ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(holerite.salario_base || 0)}</p>
            <p><strong>Sal\xE1rio L\xEDquido:</strong> ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(holerite.salario_liquido || 0)}</p>
          </div>
          
          <p>Acesse o sistema para visualizar os detalhes completos e fazer o download do PDF.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>Este \xE9 um email autom\xE1tico. Por favor, n\xE3o responda.</p>
          </div>
        </div>
      `
    });
    if (!emailEnviado || !emailEnviado.success) {
      throw createError({
        statusCode: 500,
        message: "Erro ao enviar email"
      });
    }
    console.log("\u2705 Email enviado com sucesso!");
    await fetch(
      `${supabaseUrl}/rest/v1/holerites?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ status: "enviado" })
      }
    );
    return {
      success: true,
      message: "Email enviado com sucesso",
      email: emailDestino
    };
  } catch (error) {
    console.error("\u{1F4A5} Erro ao enviar email do holerite:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erro ao enviar email"
    });
  }
});

export { enviarEmail_post as default };
//# sourceMappingURL=enviar-email.post.mjs.map
