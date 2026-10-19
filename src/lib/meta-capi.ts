import { createHash } from "node:crypto";
import { META_PIXEL_ID, site } from "@/content/site";

/**
 * API de Conversões da Meta: o Lead sai do servidor com o mesmo `event_id` do pixel (src/lib/meta-pixel.ts),
 * para a Meta contar uma vez só e ainda receber quem bloqueia o pixel no navegador.
 *
 * Vai para a Meta só o que identifica a pessoa, criptografado (SHA-256) como a Meta pede: e-mail, telefone,
 * nome e sobrenome, mais IP, navegador e os cookies do pixel. Nunca o que ela pretende tratar, a mensagem
 * ou a ficha da guia — dado de saúde não vai para anúncio.
 *
 * O token (META_CAPI_TOKEN) mora no .env da VPS. Sem ele, nada é enviado. Falha aqui nunca derruba o lead.
 */

const hash = (v: string) => createHash("sha256").update(v.trim().toLowerCase(), "utf8").digest("hex");

export interface LeadParaMeta {
  eventoId?: string;
  /** Caminho do WhatsApp: manda também um Contact, com este id (o mesmo do pixel). */
  contatoId?: string;
  email: string;
  telefone: string; // com o código do país, só dígitos
  nome: string;
  ip: string;
  navegador: string | null;
  fbp?: string;
  fbc?: string;
  url?: string;
  categoria: string;
}

function urlDoEvento(url: string | undefined, pagina: string): string {
  const raiz = site.url.replace(/\/$/, "");
  if (url && url.startsWith(raiz)) return url.slice(0, 500);
  return `${raiz}${pagina.startsWith("/") ? pagina : "/"}`;
}

export async function enviarLeadParaMeta(d: LeadParaMeta, pagina = "/"): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return;

  const partes = d.nome.trim().split(/\s+/).filter(Boolean);
  const primeiro = partes[0];
  const ultimo = partes.length > 1 ? partes[partes.length - 1] : undefined;
  const digitos = d.telefone.replace(/\D/g, "");

  const user_data: Record<string, unknown> = {
    em: [hash(d.email)],
    ph: [hash(digitos)],
    external_id: [hash(digitos)],
    ...(primeiro ? { fn: [hash(primeiro)] } : {}),
    ...(ultimo ? { ln: [hash(ultimo)] } : {}),
    country: [hash("br")],
    ...(d.ip && d.ip !== "desconhecido" ? { client_ip_address: d.ip } : {}),
    ...(d.navegador ? { client_user_agent: d.navegador.slice(0, 500) } : {}),
    ...(d.fbp ? { fbp: d.fbp.slice(0, 200) } : {}),
    ...(d.fbc ? { fbc: d.fbc.slice(0, 300) } : {}),
  };

  const quando = Math.floor(Date.now() / 1000);
  /* LeadSubmitted, não Lead: a Meta restringe o Lead nesta conta (saúde) — ver EVENTO_LEAD em meta-pixel.ts. */
  const evento = (nome: "LeadSubmitted" | "Contact", id: string | undefined, categoria: string) => ({
    event_name: nome,
    event_time: quando,
    ...(id ? { event_id: id.slice(0, 100) } : {}),
    action_source: "website",
    event_source_url: urlDoEvento(d.url, pagina),
    user_data,
    custom_data: { content_category: categoria },
  });
  const corpo = {
    data: [evento("LeadSubmitted", d.eventoId, d.categoria), ...(d.contatoId ? [evento("Contact", d.contatoId, "whatsapp")] : [])],
  };

  try {
    const r = await fetch(`https://graph.facebook.com/v25.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      const erro = await r.json().catch(() => ({}));
      console.warn("[meta-capi] Lead recusado:", r.status, (erro as { error?: { message?: string } }).error?.message ?? "");
    }
  } catch (e) {
    console.warn("[meta-capi] Lead não enviado:", e instanceof Error ? e.message : e);
  }
}

/** Categoria do lead pelo lugar de onde veio — nunca pela doença. */
export function categoriaDoLead(origem: string): string {
  if (origem.startsWith("ebook")) return "ebook";
  if (origem.startsWith("whatsapp")) return "whatsapp";
  return "consulta";
}
