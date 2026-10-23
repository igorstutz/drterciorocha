/**
 * Todo contato pelo WhatsApp passa antes pelo formulário: o lead precisa ficar
 * registrado no CRM com nome, contato e interesse. Nenhum link do site aponta
 * direto para o wa.me — só a tela de sucesso do formulário.
 *
 * O botão é um link comum para /consulta (funciona sem JavaScript) com
 * atributos data-*. O WhatsAppGate intercepta o clique e abre o formulário numa
 * janela, sem tirar a pessoa da página.
 */
export const ROTA_FORM_WHATSAPP = "/consulta?canal=whatsapp#formulario";

export type GateWhatsApp = {
  /** De onde veio o clique (vai para o CRM como origem). */
  local: string;
  /** Condição já selecionada no formulário. */
  interesse?: string;
};

export function atributosGate({ local, interesse }: GateWhatsApp) {
  return {
    "data-whatsapp": local,
    ...(interesse ? { "data-interesse": interesse } : {}),
  };
}

/**
 * Protocolo do formulário: vai para o painel junto com o lead e na mensagem que abre o WhatsApp. Se a pessoa digitou o número
 * errado, o painel reconhece pelo protocolo quem escreveu e junta tudo no número certo (vinculo-formulario.ts no painel).
 * Sem 0/O, 1/I/L, 5/S e 8/B, que se confundem.
 */
const ALFABETO_PROTOCOLO = "ACDEFGHJKMNPQRTUVWXY234679";

export function novoProtocolo(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALFABETO_PROTOCOLO[b % ALFABETO_PROTOCOLO.length]).join("");
}

/** Mensagem que abre a conversa depois do envio. */
export function mensagemPosFormulario(nome: string, interesse?: string, protocolo?: string) {
  const primeiro = nome.trim().split(/\s+/)[0] ?? "";
  const sobre = interesse && interesse !== "Outros" ? ` sobre ${interesse}` : "";
  return `Olá! Meu nome é ${primeiro}. Acabei de preencher o formulário no site${sobre}.${protocolo ? ` Protocolo ${protocolo}` : ""}`;
}

/** Na prévia estática (GitHub Pages) não existe /api/lead: o envio é simulado. */
export const ENVIO_SIMULADO = process.env.NEXT_PUBLIC_PREVIA === "true";
