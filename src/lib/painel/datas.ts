/**
 * Datas do painel sempre no horário de Brasília, seja qual for o fuso do computador de quem usa.
 * O Brasil não tem horário de verão desde 2019, então o fuso é fixo em -03:00.
 */
const FUSO = "America/Sao_Paulo";

export function dataCurta(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric", timeZone: FUSO })
    .format(new Date(iso))
    .replace(/ de /g, " ")
    .replace(".", "");
}

/** "31 out, 09:00" (o ano só aparece quando não é o atual). */
export function dataHora(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const mesmoAno = new Date().getFullYear() === d.getFullYear();
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    ...(mesmoAno ? {} : { year: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSO,
  })
    .format(d)
    .replace(/ de /g, " ")
    .replace(".", "");
}

/** "sexta-feira, 31 de outubro, às 09:00". */
export function dataPorExtenso(iso: string) {
  const d = new Date(iso);
  const dia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: FUSO }).format(d);
  const hora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: FUSO }).format(d);
  return `${dia}, às ${hora}`;
}

/** "agora há pouco", "há 12 min", "há 3 h", "ontem", senão a data. */
export function haQuanto(iso: string) {
  if (!iso) return "";
  const min = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (min < 1) return "agora há pouco";
  if (min < 60) return `há ${min} min`;
  if (min < 60 * 24) return `há ${Math.round(min / 60)} h`;
  if (min < 60 * 48) return "ontem";
  return dataCurta(iso);
}

/** ISO → campos dos inputs `date` e `time`, no horário de Brasília. */
export function paraCampos(iso: string) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: FUSO,
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return { data: `${partes.year}-${partes.month}-${partes.day}`, hora: `${partes.hour}:${partes.minute}` };
}

export function deCampos(data: string, hora: string) {
  return data && hora ? new Date(`${data}T${hora}:00-03:00`).toISOString() : "";
}

/** Sugestões de agendamento: amanhã e a próxima segunda, às 9h. */
export function sugestoes() {
  const hoje = paraCampos(new Date().toISOString()).data;
  const base = new Date(`${hoje}T12:00:00-03:00`);
  const somar = (dias: number) => paraCampos(new Date(base.getTime() + dias * 86400000).toISOString()).data;
  const diaDaSemana = new Date(`${hoje}T12:00:00-03:00`).getUTCDay();
  const ateSegunda = ((8 - diaDaSemana) % 7) || 7;
  return [
    { rotulo: "Amanhã, 9h", data: somar(1), hora: "09:00" },
    { rotulo: ateSegunda === 1 ? "Depois de amanhã, 9h" : "Segunda, 9h", data: somar(ateSegunda === 1 ? 2 : ateSegunda), hora: "09:00" },
  ];
}
