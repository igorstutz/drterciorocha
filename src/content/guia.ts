/**
 * Listas da ficha para a guia de solicitação de exames (/guia). Módulo simples, sem React:
 * o formulário (navegador) e a API (servidor) validam com as mesmas opções.
 */

export const ESTADOS_CIVIS = ["Solteiro(a)", "Casado(a)", "União estável", "Divorciado(a)", "Viúvo(a)"] as const;

/** Onde a consulta acontece: presencial só em São Paulo (desde out/2026 não há mais Florianópolis) ou on-line. */
export const LOCAIS = ["Presencial São Paulo", "Online"] as const;

/** Tipo de atendimento que vai para o painel junto com o local (o CRM guarda os dois campos). */
export function tipoDoLocal(local: (typeof LOCAIS)[number]): "Presencial" | "On-line" {
  return local === "Online" ? "On-line" : "Presencial";
}

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

/** Mensagem que abre a conversa depois de enviar a ficha. */
export const MENSAGEM_POS_GUIA = "Olá! Acabei de preencher a ficha para a guia de exames no site.";
