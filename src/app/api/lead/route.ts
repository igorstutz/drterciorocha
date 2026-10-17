import { NextResponse } from "next/server";
import {
  EMAIL_VALIDO,
  criarLimitador,
  entregarAoCrm,
  ipDaRequisicao,
  soDigitos,
  telefoneComPais,
  texto,
  urlDoCrm,
} from "@/lib/crm";
import { problemaNoTelefone } from "@/lib/telefone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  nome?: string;
  whatsapp?: string;
  email?: string;
  interesse?: string;
  mensagem?: string;
  consentimento?: boolean;
  origem?: string;
  continuar_whatsapp?: boolean;
  pagina?: string;
  atribuicao?: Record<string, string>;
};

const excedeuLimite = criarLimitador();

export async function POST(req: Request) {
  if (excedeuLimite(ipDaRequisicao(req))) {
    return NextResponse.json(
      { erro: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 },
    );
  }

  let corpo: Lead;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  const nome = texto(corpo.nome, 120);
  const email = texto(corpo.email, 160).toLowerCase();
  const telefone = soDigitos(texto(corpo.whatsapp, 30));
  const interesse = texto(corpo.interesse, 80);

  if (nome.length < 2) {
    return NextResponse.json({ erro: "Informe seu nome." }, { status: 400 });
  }
  if (!EMAIL_VALIDO.test(email)) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }
  /* A mesma regra da tela: quem contornar o formulário também não manda número impossível. */
  const problemaTelefone = problemaNoTelefone(texto(corpo.whatsapp, 30));
  if (problemaTelefone || telefone.length < 10 || telefone.length > 15) {
    return NextResponse.json({ erro: problemaTelefone ?? "WhatsApp inválido." }, { status: 400 });
  }
  if (!corpo.consentimento) {
    return NextResponse.json(
      { erro: "É necessário autorizar o contato." },
      { status: 400 },
    );
  }

  const lead = {
    nome,
    email,
    /* Com "+" na frente os dígitos já trazem o país; sem ele, é número nacional. */
    telefone: texto(corpo.whatsapp, 30).startsWith("+") ? telefone : telefoneComPais(telefone),
    produto_interesse: interesse,
    mensagem: texto(corpo.mensagem, 2000),
    origem: texto(corpo.origem, 80) || "site",
    pagina: texto(corpo.pagina, 200) || "/",
    canal: "site",
    /* Veio por um botão de WhatsApp: a conversa abre logo depois do envio. */
    continuar_whatsapp: Boolean(corpo.continuar_whatsapp),
    atribuicao: corpo.atribuicao ?? {},
    recebido_em: new Date().toISOString(),
  };

  /* Entrega ao CRM. Enquanto CRM_WEBHOOK_URL não estiver configurada, o lead
     é registrado no log do servidor — nenhum contato se perde silenciosamente. */
  const webhook = urlDoCrm("site");

  if (!webhook) {
    console.warn("[lead] CRM_WEBHOOK_URL ausente — lead registrado só no log:", lead);
    return NextResponse.json({ ok: true, entregue: false });
  }

  try {
    await entregarAoCrm(webhook, lead);
    return NextResponse.json({ ok: true, entregue: true });
  } catch (err) {
    /* O lead não pode ser perdido por indisponibilidade do CRM: registra e
       devolve sucesso, porque do lado do paciente o envio de fato aconteceu. */
    console.error("[lead] falha ao entregar ao CRM:", err, lead);
    return NextResponse.json({ ok: true, entregue: false });
  }
}
