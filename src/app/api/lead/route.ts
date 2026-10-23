import { NextResponse } from "next/server";
import {
  EMAIL_VALIDO,
  criarLimitador,
  cookiesDoPixel,
  entregarAoCrm,
  ipDaRequisicao,
  soDigitos,
  telefoneComPais,
  texto,
  urlDoCrm,
} from "@/lib/crm";
import { problemaNoTelefone } from "@/lib/telefone";
import { categoriaDoLead, enviarLeadParaMeta } from "@/lib/meta-capi";

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
  /** Protocolo do formulário (o mesmo da mensagem do WhatsApp): o painel liga a conversa ao lead mesmo com o número errado. */
  protocolo?: string;
  pagina?: string;
  atribuicao?: Record<string, string>;
  /** Do pixel no navegador: id do evento (deduplicação) e cookies _fbp/_fbc. */
  meta?: { event_id?: unknown; contact_event_id?: unknown; fbp?: unknown; fbc?: unknown; url?: unknown };
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
    protocolo: /^[A-Z0-9]{5,8}$/.test(String(corpo.protocolo ?? "")) ? String(corpo.protocolo) : undefined,
    atribuicao: corpo.atribuicao ?? {},
    recebido_em: new Date().toISOString(),
  };

  /* Entrega ao CRM. Enquanto CRM_WEBHOOK_URL não estiver configurada, o lead
     é registrado no log do servidor — nenhum contato se perde silenciosamente. */
  /* API de Conversões da Meta, em paralelo e sem segurar a resposta: falha aqui nunca derruba o lead.
     Só identificação criptografada vai — nunca o que a pessoa quer tratar nem a mensagem. */
  const meta = corpo.meta ?? {};
  const textoMeta = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : undefined);
  void enviarLeadParaMeta(
    {
      eventoId: textoMeta(meta.event_id, 100),
      contatoId: lead.continuar_whatsapp ? textoMeta(meta.contact_event_id, 100) : undefined,
      email,
      telefone: lead.telefone,
      nome,
      ip: ipDaRequisicao(req),
      navegador: req.headers.get("user-agent"),
      fbp: textoMeta(meta.fbp, 200),
      fbc: textoMeta(meta.fbc, 300),
      url: textoMeta(meta.url, 500),
      categoria: categoriaDoLead(lead.origem),
    },
    lead.pagina,
  );

  const webhook = urlDoCrm("site");

  if (!webhook) {
    console.warn("[lead] CRM_WEBHOOK_URL ausente — lead registrado só no log:", lead);
    return NextResponse.json({ ok: true, entregue: false });
  }

  try {
    await entregarAoCrm(webhook, { ...lead, meta: cookiesDoPixel(req, meta) });
    return NextResponse.json({ ok: true, entregue: true });
  } catch (err) {
    /* O lead não pode ser perdido por indisponibilidade do CRM: registra e
       devolve sucesso, porque do lado do paciente o envio de fato aconteceu. */
    console.error("[lead] falha ao entregar ao CRM:", err, lead);
    return NextResponse.json({ ok: true, entregue: false });
  }
}
