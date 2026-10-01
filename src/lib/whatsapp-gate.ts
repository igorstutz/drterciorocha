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

/** Mensagem que abre a conversa depois do envio. */
export function mensagemPosFormulario(nome: string, interesse?: string) {
  const primeiro = nome.trim().split(/\s+/)[0] ?? "";
  const sobre = interesse && interesse !== "Outros" ? ` sobre ${interesse}` : "";
  return `Olá! Meu nome é ${primeiro}. Acabei de preencher o formulário no site${sobre}.`;
}

/** Na prévia estática (GitHub Pages) não existe /api/lead: o envio é simulado. */
export const ENVIO_SIMULADO = process.env.NEXT_PUBLIC_PREVIA === "true";
