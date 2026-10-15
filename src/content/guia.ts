/**
 * Listas da ficha para a guia de solicitação de exames (/guia). Módulo simples, sem React:
 * o formulário (navegador) e a API (servidor) validam com as mesmas opções.
 */

export const ESTADOS_CIVIS = ["Solteiro(a)", "Casado(a)", "União estável", "Divorciado(a)", "Viúvo(a)"] as const;

export const ATENDIMENTOS = ["Presencial", "On-line"] as const;

export const LOCAIS = ["São Paulo", "Florianópolis", "Atendimento on-line"] as const;

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

/** Mensagem que abre a conversa depois de enviar a ficha. */
export const MENSAGEM_POS_GUIA = "Olá! Acabei de preencher a ficha para a guia de exames no site.";
