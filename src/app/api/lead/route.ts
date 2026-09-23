import { NextResponse } from "next/server";

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
  pagina?: string;
  atribuicao?: Record<string, string>;
};

/** Limite simples por IP em memória. Segura bot burro; não substitui WAF. */
const janela = new Map<string, number[]>();
const LIMITE = 5;
const JANELA_MS = 10 * 60 * 1000;

function excedeuLimite(ip: string) {
  const agora = Date.now();
  const marcas = (janela.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  marcas.push(agora);
  janela.set(ip, marcas);
  if (janela.size > 5000) janela.clear();
  return marcas.length > LIMITE;
}

function soDigitos(v: string) {
  return v.replace(/\D+/g, "");
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "desconhecido";

  if (excedeuLimite(ip)) {
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

  const nome = (corpo.nome ?? "").trim();
  const email = (corpo.email ?? "").trim().toLowerCase();
  const telefone = soDigitos(corpo.whatsapp ?? "");
  const interesse = (corpo.interesse ?? "").trim();

  if (nome.length < 2) {
    return NextResponse.json({ erro: "Informe seu nome." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ erro: "E-mail inválido." }, { status: 400 });
  }
  if (telefone.length < 10 || telefone.length > 13) {
    return NextResponse.json({ erro: "WhatsApp inválido." }, { status: 400 });
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
    telefone: telefone.startsWith("55") ? telefone : `55${telefone}`,
    produto_interesse: interesse,
    mensagem: (corpo.mensagem ?? "").trim().slice(0, 2000),
    origem: corpo.origem ?? "site",
    pagina: corpo.pagina ?? "/",
    canal: "site",
    atribuicao: corpo.atribuicao ?? {},
    recebido_em: new Date().toISOString(),
  };

  /* Entrega ao CRM. Enquanto CRM_WEBHOOK_URL não estiver configurada, o lead
     é registrado no log do servidor — nenhum contato se perde silenciosamente. */
  const webhook = process.env.CRM_WEBHOOK_URL;

  if (!webhook) {
    console.warn("[lead] CRM_WEBHOOK_URL ausente — lead registrado só no log:", lead);
    return NextResponse.json({ ok: true, entregue: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CRM_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`CRM respondeu ${res.status}`);

    return NextResponse.json({ ok: true, entregue: true });
  } catch (err) {
    /* O lead não pode ser perdido por indisponibilidade do CRM: registra e
       devolve sucesso, porque do lado do paciente o envio de fato aconteceu. */
    console.error("[lead] falha ao entregar ao CRM:", err, lead);
    return NextResponse.json({ ok: true, entregue: false });
  }
}
