/**
 * Google Analytics 4 (G-GD62ED5FTP). Marca os mesmos momentos do pixel da Meta (src/lib/meta-pixel.ts):
 *
 * - `generate_lead` (evento recomendado do GA4) em todo formulário enviado, com `lead_source` = consulta | whatsapp | ebook;
 * - `contato_whatsapp` no caminho do WhatsApp (pop-up dos botões, que termina em "Continuar no WhatsApp").
 *
 * Nada pessoal nem de saúde vai para o Google (a política do GA proíbe dado pessoal): nem o que a pessoa quer tratar,
 * nem a mensagem, nem o telefone. A ficha da guia (/guia), cujo link traz o telefone no endereço, não carrega o GA.
 */
export const GA_ID = "G-GD62ED5FTP";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function evento(nome: string, params: Record<string, string>): void {
  try {
    window.gtag?.("event", nome, params);
  } catch {
    /* GA bloqueado ou fora do ar */
  }
}

/** Formulário enviado (consulta, WhatsApp ou e-book). */
export function gaLead(origem: string): void {
  evento("generate_lead", { lead_source: origem });
}

/** Caminho do WhatsApp concluído. */
export function gaContatoWhatsapp(): void {
  evento("contato_whatsapp", { lead_source: "whatsapp" });
}
