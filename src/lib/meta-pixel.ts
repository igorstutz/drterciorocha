/**
 * Pixel da Meta no navegador (o par dele no servidor é src/lib/meta-capi.ts).
 *
 * O Lead sai dos dois lados com o mesmo `eventID`: o pixel pega quem não bloqueia rastreio, a API de
 * Conversões pega o resto (bloqueador, Safari), e a Meta conta uma vez só (deduplicação pelo id).
 *
 * Nada de saúde vai para a Meta: o "o que você pretende tratar" e a mensagem ficam de fora dos eventos, e a
 * ficha da guia (/guia), com CPF e queixas, não carrega o pixel.
 */
import { META_PIXEL_ID } from "@/content/site";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export { META_PIXEL_ID };

/** Páginas sem pixel: a ficha da guia tem CPF, RG e dados de saúde. */
const SEM_PIXEL = ["/guia"];

export function paginaSemPixel(caminho: string): boolean {
  return SEM_PIXEL.some((p) => caminho === p || caminho.startsWith(`${p}/`));
}

export function novoEventoId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function cookie(nome: string): string | undefined {
  try {
    const par = document.cookie.split("; ").find((c) => c.startsWith(`${nome}=`));
    return par ? decodeURIComponent(par.slice(nome.length + 1)) : undefined;
  } catch {
    return undefined;
  }
}

/** O que o servidor precisa para a API de Conversões casar o lead com a visita (cookies do pixel). */
export function dadosParaMeta(eventoId: string) {
  return {
    event_id: eventoId,
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc"),
    url: typeof window === "undefined" ? undefined : window.location.href,
  };
}

/**
 * Evento no pixel, com o mesmo id que o servidor manda pela API de Conversões.
 *
 * O formulário enviado sai como LeadSubmitted (evento personalizado), não como o Lead padrão: a Meta classificou
 * a conta como saúde e o pixel traz `eventValidation.restrictedEventNames: ["Lead"]` — o navegador nem envia o Lead
 * (conferido em 19/10/2026). LeadSubmitted é o nome que a gestora de tráfego configurou nos anúncios.
 */
export const EVENTO_LEAD = "LeadSubmitted";

function rastrear(evento: typeof EVENTO_LEAD | "Contact", eventoId: string, categoria: string): void {
  try {
    if (evento === "Contact") window.fbq?.("track", evento, { content_category: categoria }, { eventID: eventoId });
    else window.fbq?.("trackCustom", evento, { content_category: categoria }, { eventID: eventoId });
  } catch {
    /* pixel bloqueado ou fora do ar: a API de Conversões cobre */
  }
}

/** LeadSubmitted: todo formulário enviado (consulta, WhatsApp, e-book). */
export function rastrearLead(eventoId: string, categoria: string): void {
  rastrear(EVENTO_LEAD, eventoId, categoria);
}

/**
 * Contact: só o caminho do WhatsApp (pop-up dos botões "Falar com a equipe", flutuante e do menu, que termina em
 * "Continuar no WhatsApp"). Vai junto com o LeadSubmitted, para medir quem prefere o WhatsApp sem tirar volume do LeadSubmitted
 * (pedido da gestora de tráfego, 19/10/2026).
 */
export function rastrearContato(eventoId: string): void {
  rastrear("Contact", eventoId, "whatsapp");
}
