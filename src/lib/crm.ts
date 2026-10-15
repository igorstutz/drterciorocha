/**
 * Entrega dos formulários ao painel de atendimento (o CRM da clínica, `../ATENDIMENTO CRM IA`).
 *
 * `CRM_WEBHOOK_URL` aponta para a origem "site" do painel (`…/api/webhooks/in/site`). As outras
 * origens de lá moram no mesmo endereço, mudando só o último trecho — a ficha da guia vai para
 * `…/api/webhooks/in/guia` com o mesmo token (`CRM_WEBHOOK_TOKEN`, header `Authorization: Bearer`).
 *
 * Sem a variável, o envio fica registrado no log do servidor e a API responde sucesso ao paciente:
 * do lado dele o envio aconteceu, e nenhum contato se perde por configuração faltando.
 */

export type OrigemCrm = "site" | "guia";

/** "site" é a própria CRM_WEBHOOK_URL; as outras trocam o último trecho do caminho. */
export function urlDoCrm(origem: OrigemCrm): string | undefined {
  const base = process.env.CRM_WEBHOOK_URL?.trim();
  if (!base) return undefined;
  if (origem === "site") return base;
  return base.replace(/\/[^/]*\/?$/, `/${origem}`);
}

export async function entregarAoCrm(url: string, corpo: unknown): Promise<void> {
  const token = process.env.CRM_WEBHOOK_TOKEN?.trim();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`CRM respondeu ${res.status}`);
}

export function ipDaRequisicao(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "desconhecido"
  );
}

/** Limite simples por IP em memória. Segura bot burro; não substitui WAF. */
export function criarLimitador(limite = 5, janelaMs = 10 * 60 * 1000) {
  const janela = new Map<string, number[]>();
  return function excedeuLimite(ip: string): boolean {
    const agora = Date.now();
    const marcas = (janela.get(ip) ?? []).filter((t) => agora - t < janelaMs);
    marcas.push(agora);
    janela.set(ip, marcas);
    if (janela.size > 5000) janela.clear();
    return marcas.length > limite;
  };
}

export function soDigitos(v: string): string {
  return v.replace(/\D+/g, "");
}

/**
 * Telefone como o painel espera: 55 + DDD + número. Decide pelo tamanho, não pelo começo —
 * "55 99999-9999" (DDD 55, Santa Maria) são 11 dígitos nacionais e precisam ganhar o 55 do país.
 */
export function telefoneComPais(digitos: string): string {
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`;
  return digitos;
}

/** Texto aparado e limitado; qualquer coisa que não seja string vira "". */
export function texto(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
