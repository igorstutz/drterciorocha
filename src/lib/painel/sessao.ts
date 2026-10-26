import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Login do painel. Quem pode entrar está em `ADMIN_USUARIOS` (no .env da VPS), uma entrada por
 * pessoa separada por vírgula, no formato `email:sal:hash` — gerada por `node scripts/senha-painel.mjs`,
 * para a senha nunca ficar escrita no servidor. Tirar a entrada de alguém derruba o acesso na hora,
 * mesmo com a sessão aberta.
 *
 * A sessão é um cookie assinado (HMAC com `ADMIN_SEGREDO`). Sem o segredo, o processo sorteia um a
 * cada início: funciona, mas cada nova publicação do site desconecta todo mundo.
 */

export type Usuario = { email: string; nome: string };

const COOKIE = "painel_sessao";
const DURACAO_MS = 1000 * 60 * 60 * 24 * 14;
/* No globalThis porque o Next pode carregar este módulo mais de uma vez no mesmo processo (páginas,
   ações, rotas): um segredo sorteado por cópia invalidaria o cookie de uma para a outra. */
const global = globalThis as typeof globalThis & {
  __painelSegredo?: string;
  __painelTentativas?: Map<string, { erros: number; desde: number }>;
};
const SEGREDO = process.env.ADMIN_SEGREDO || (global.__painelSegredo ??= randomBytes(32).toString("hex"));

type Cadastro = Usuario & { sal: string; hash: string };

function cadastrados(): Cadastro[] {
  return (process.env.ADMIN_USUARIOS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .flatMap((entrada) => {
      const [email, sal, hash] = entrada.split(":");
      if (!email || !sal || !hash) return [];
      return [{ email: email.toLowerCase(), nome: nomeDoEmail(email), sal, hash }];
    });
}

/** "ana.paula@clinica.com" → "Ana Paula". */
function nomeDoEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function painelConfigurado() {
  return cadastrados().length > 0;
}

export function conferirSenha(email: string, senha: string): Usuario | null {
  const alvo = email.trim().toLowerCase();
  const c = cadastrados().find((u) => u.email === alvo);
  /* Calcula o hash mesmo sem cadastro: o tempo de resposta não revela quais e-mails existem. */
  const sal = c?.sal ?? "0".repeat(32);
  const calculado = scryptSync(senha, sal, 32);
  const esperado = Buffer.from(c?.hash ?? "", "hex");
  if (!c || esperado.length !== calculado.length || !timingSafeEqual(calculado, esperado)) return null;
  return { email: c.email, nome: c.nome };
}

function assinar(texto: string) {
  return createHmac("sha256", SEGREDO).update(texto).digest("base64url");
}

export async function abrirSessao(u: Usuario) {
  const carga = Buffer.from(JSON.stringify({ e: u.email, x: Date.now() + DURACAO_MS })).toString("base64url");
  (await cookies()).set(COOKIE, `${carga}.${assinar(carga)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_MS / 1000,
  });
}

export async function fecharSessao() {
  (await cookies()).delete(COOKIE);
}

/** Quem está logado, ou `null`. Confere a assinatura, a validade e se o e-mail segue cadastrado. */
export async function usuarioAtual(): Promise<Usuario | null> {
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!valor) return null;
  const [carga, assinatura] = valor.split(".");
  if (!carga || !assinatura) return null;
  const esperada = Buffer.from(assinar(carga));
  const recebida = Buffer.from(assinatura);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(carga, "base64url").toString()) as { e: string; x: number };
    if (Date.now() > x) return null;
    const c = cadastrados().find((u) => u.email === e);
    return c ? { email: c.email, nome: c.nome } : null;
  } catch {
    return null;
  }
}

/**
 * Para as páginas do painel. O layout também confere, mas o Next não refaz o layout ao navegar
 * entre páginas dentro dele: cada página precisa conferir por si.
 */
export async function exigirUsuario(): Promise<Usuario> {
  const u = await usuarioAtual();
  if (!u) redirect("/admin/entrar");
  return u;
}

/* Freio contra quem tenta adivinhar senha: 8 erros em 15 minutos bloqueiam o IP por 15 minutos. */
const tentativas = (global.__painelTentativas ??= new Map());
const JANELA_MS = 15 * 60 * 1000;

export function bloqueado(ip: string) {
  const t = tentativas.get(ip);
  if (!t) return false;
  if (Date.now() - t.desde > JANELA_MS) {
    tentativas.delete(ip);
    return false;
  }
  return t.erros >= 8;
}

export function registrarErro(ip: string) {
  const t = tentativas.get(ip);
  if (!t || Date.now() - t.desde > JANELA_MS) tentativas.set(ip, { erros: 1, desde: Date.now() });
  else t.erros++;
}

export function limparErros(ip: string) {
  tentativas.delete(ip);
}
