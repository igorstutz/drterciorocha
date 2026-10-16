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
