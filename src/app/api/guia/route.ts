import { NextResponse } from "next/server";
import { ATENDIMENTOS, ESTADOS_CIVIS, LOCAIS, UFS } from "@/content/guia";
import {
  EMAIL_VALIDO,
  criarLimitador,
  entregarAoCrm,
  ipDaRequisicao,
  soDigitos,
  telefoneComPais,
  texto,
  urlDoCrm,
} from "@/lib/crm";
import { problemaNoTelefone } from "@/lib/telefone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ficha para a guia de solicitação de exames (/guia). Valida, monta o corpo que o painel espera
 * (origem "guia", mesmo token do site) e entrega. Os nomes dos campos são os do mapeamento da
 * origem no painel (scripts/clinica/guia.ts de lá): mudar aqui é mudar lá.
 */

const excedeuLimite = criarLimitador();

function erro(mensagem: string, status = 400) {
  return NextResponse.json({ erro: mensagem }, { status });
}

/** <input type="date"> manda AAAA-MM-DD; a equipe lê DD/MM/AAAA. */
function dataBrasileira(v: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : v;
}

function entre(lista: readonly string[], v: string) {
  return lista.includes(v);
}

export async function POST(req: Request) {
  if (excedeuLimite(ipDaRequisicao(req))) {
    return erro("Muitas tentativas. Tente novamente em alguns minutos.", 429);
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return erro("Requisição inválida.");
  }

  const nome = texto(corpo.nome, 120);
  const email = texto(corpo.email, 160).toLowerCase();
  const telefone = soDigitos(texto(corpo.whatsapp, 30));
  const cpf = soDigitos(texto(corpo.cpf, 20));
  const rg = texto(corpo.rg, 30);
  const nascimento = texto(corpo.nascimento, 10);
  const estadoCivil = texto(corpo.estado_civil, 30);
  const queixa = texto(corpo.queixa, 2000);
  const doencas = texto(corpo.doencas, 1000);
  const metodos = texto(corpo.metodos, 1000);
  const idade = soDigitos(texto(corpo.idade, 3));
  const peso = texto(corpo.peso, 10);
  const altura = texto(corpo.altura, 10);
  const atendimento = texto(corpo.atendimento, 20);
  const local = texto(corpo.local, 30);
  const cep = soDigitos(texto(corpo.cep, 10));
  const rua = texto(corpo.rua, 160);
  const numero = texto(corpo.numero, 20);
  const complemento = texto(corpo.complemento, 80);
  const bairro = texto(corpo.bairro, 80);
  const cidade = texto(corpo.cidade, 80);
  const estado = texto(corpo.estado, 2).toUpperCase();

  if (nome.length < 2) return erro("Informe o nome completo do paciente.");
  if (!EMAIL_VALIDO.test(email)) return erro("E-mail inválido.");
  const problemaTelefone = problemaNoTelefone(texto(corpo.whatsapp, 30));
  if (problemaTelefone || telefone.length < 10 || telefone.length > 15) return erro(problemaTelefone ?? "WhatsApp inválido.");
  if (cpf.length !== 11) return erro("CPF inválido: são 11 dígitos.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento) && !/^\d{2}\/\d{2}\/\d{4}$/.test(nascimento)) {
    return erro("Informe a data de nascimento.");
  }
  if (!entre(ESTADOS_CIVIS, estadoCivil)) return erro("Escolha o estado civil.");
  if (queixa.length < 3) return erro("Descreva a queixa principal.");
  const idadeNum = Number(idade);
  if (!idade || idadeNum < 1 || idadeNum > 120) return erro("Informe a idade.");
  if (!peso) return erro("Informe o peso.");
  if (!altura) return erro("Informe a altura.");
  if (!entre(ATENDIMENTOS, atendimento)) return erro("Escolha o tipo de atendimento.");
  if (!entre(LOCAIS, local)) return erro("Escolha o local de atendimento.");
  if (cep.length !== 8) return erro("CEP inválido: são 8 dígitos.");
  if (!rua) return erro("Informe a rua.");
  if (!numero) return erro("Informe o número.");
  if (!bairro) return erro("Informe o bairro.");
  if (!cidade) return erro("Informe a cidade.");
  if (!entre(UFS, estado)) return erro("Escolha o estado.");
  if (!corpo.consentimento) return erro("É necessário autorizar o uso dos dados para emitir a guia.");

  const ficha = {
    nome,
    email,
    /* Com "+" na frente os dígitos já trazem o país; sem ele, é número nacional. */
    telefone: texto(corpo.whatsapp, 30).startsWith("+") ? telefone : telefoneComPais(telefone),
    cpf,
    rg,
    nascimento: dataBrasileira(nascimento),
    estado_civil: estadoCivil,
    queixa,
    doencas,
    metodos,
    idade,
    peso,
    altura,
    atendimento,
    local,
    cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
    rua,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
    origem: "guia",
    pagina: "/guia",
    canal: "site",
    recebido_em: new Date().toISOString(),
  };

  const url = urlDoCrm("guia");
  if (!url) {
    console.warn("[guia] CRM_WEBHOOK_URL ausente — ficha registrada só no log:", ficha);
    return NextResponse.json({ ok: true, entregue: false });
  }

  try {
    await entregarAoCrm(url, ficha);
    return NextResponse.json({ ok: true, entregue: true });
  } catch (err) {
    /* A ficha não pode se perder por indisponibilidade do painel: registra e devolve
       sucesso, porque do lado do paciente o envio de fato aconteceu. */
    console.error("[guia] falha ao entregar ao CRM:", err, ficha);
    return NextResponse.json({ ok: true, entregue: false });
  }
}
