/**
 * Máscara do campo de WhatsApp dos formulários (consulta, e-book, ficha da guia).
 *
 * Formata enquanto a pessoa digita: "(11) 99999-9999" no celular, "(11) 9999-9999" no fixo.
 * Tira o 55 quando o número chega com o código do país (o link da ficha da guia traz
 * `?tel=5511999998888`; o preenchimento automático do navegador às vezes traz "+55 11 …").
 * Número estrangeiro (começa com "+" e não é +55) fica como a pessoa digitou: a API aceita
 * de 10 a 13 dígitos e o painel normaliza.
 */
export function mascararTelefone(valor: string): string {
  const bruto = valor.trimStart();
  if (bruto.startsWith("+") && !bruto.replace(/\s/g, "").startsWith("+55")) {
    return bruto.replace(/[^\d+\s()-]/g, "").slice(0, 20);
  }
  let d = bruto.replace(/\D/g, "");
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  if (resto.length <= 4) return `(${ddd}) ${resto}`;
  if (d.length <= 10) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

/**
 * Para usar no `onChange` de um campo controlado: aplica a máscara e, quando a pessoa
 * apaga só um caractere de formatação (o traço, o parêntese, o espaço), apaga também o
 * dígito anterior — sem isso a máscara recolocaria o caractere e o apagar travaria.
 */
export function proximoValorTelefone(anterior: string, digitado: string): string {
  const digitos = (v: string) => v.replace(/\D/g, "");
  if (digitado.length < anterior.length && digitos(digitado) === digitos(anterior)) {
    return mascararTelefone(digitos(digitado).slice(0, -1));
  }
  return mascararTelefone(digitado);
}

/* DDDs que existem no Brasil (Anatel). */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/**
 * O que está errado no WhatsApp digitado, numa frase que diz como corrigir — ou null se o
 * número é possível. Usada na tela (antes de enviar) e nas rotas /api/lead e /api/guia.
 *
 * Não dá para saber se o número tem WhatsApp: a API oficial da Meta não tem consulta para isso
 * (só se descobre mandando uma mensagem). O que dá para barrar é o número impossível — a
 * Marly digitou "55 11 999-8750" e virou DDD 55 com 9 dígitos começando por 1 (17/10/2026); o
 * lead caiu no CRM sem jeito de ser chamado.
 */
export function problemaNoTelefone(valor: string): string | null {
  const bruto = (valor ?? "").trim();
  const digitos = bruto.replace(/\D/g, "");
  if (!digitos) return "Informe seu WhatsApp com DDD.";

  // Estrangeiro: só com "+" e código de outro país. O painel normaliza.
  if (bruto.startsWith("+") && !digitos.startsWith("55")) {
    return digitos.length >= 8 && digitos.length <= 15 ? null : "Confira o número com o código do país.";
  }

  let d = digitos;
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  if (d.length < 10) return "Faltam dígitos. Informe o DDD e o número, como (11) 98765-4321.";
  if (d.length > 11) return "Sobram dígitos. Informe só o DDD e o número, como (11) 98765-4321.";

  const ddd = Number(d.slice(0, 2));
  const numero = d.slice(2);
  if (!DDDS.has(ddd)) return `O DDD ${d.slice(0, 2)} não existe. Confira o número.`;
  if (/^(\d)\1+$/.test(numero)) return "Confira o número: ele parece incompleto.";
  if (numero.length === 9) {
    return numero.startsWith("9") ? null : "O celular tem 9 dígitos depois do DDD e começa com 9. Confira o número.";
  }
  // 8 dígitos: fixo (2 a 5) ou celular antigo, sem o 9 da frente. Fixo passa: muito número fixo tem
  // WhatsApp Business hoje (pedido do usuário, 17/10/2026) — quem avisa é `avisoNoTelefone`, sem barrar.
  if (/^[2-5]/.test(numero)) return null;
  return "Faltam dígitos: o celular tem 9 dígitos depois do DDD e começa com 9.";
}

/**
 * Alerta que não impede o envio: o número é possível, mas tem cara de telefone fixo. Muito fixo tem
 * WhatsApp Business, então a pessoa pode seguir; o alerta só faz quem digitou o celular errado conferir.
 */
export function avisoNoTelefone(valor: string): string | null {
  const bruto = (valor ?? "").trim();
  if (bruto.startsWith("+") && !bruto.replace(/\D/g, "").startsWith("55")) return null;
  if (problemaNoTelefone(bruto)) return null;
  let d = bruto.replace(/\D/g, "");
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) d = d.slice(2);
  return d.length === 10 && /^[2-5]/.test(d.slice(2))
    ? "Esse número parece de telefone fixo. Se ele tem WhatsApp, pode enviar assim."
    : null;
}
