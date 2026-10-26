"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { lerAcervo, gravarAcervo, estaNoAr, type ArtigoGuardado } from "@/lib/acervo";
import { contarPalavras, slugify } from "@/lib/slug";
import {
  abrirSessao,
  bloqueado,
  conferirSenha,
  fecharSessao,
  limparErros,
  registrarErro,
  usuarioAtual,
} from "@/lib/painel/sessao";
import { paraEditor } from "@/lib/painel/editor";
import { guardarPrevia } from "@/lib/painel/previas";
import type { Acao, EntradaArtigo, Resultado } from "@/lib/painel/tipos";
import { autores, AUTOR_PADRAO } from "@/content/autores";

/* ---------------------------------------------------------------- login */

export async function entrar(_: { erro: string } | null, form: FormData): Promise<{ erro: string } | null> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (bloqueado(ip)) return { erro: "Muitas tentativas seguidas. Espere 15 minutos e tente de novo." };

  const usuario = conferirSenha(String(form.get("email") ?? ""), String(form.get("senha") ?? ""));
  if (!usuario) {
    registrarErro(ip);
    return { erro: "E-mail ou senha não conferem." };
  }
  limparErros(ip);
  await abrirSessao(usuario);
  redirect("/admin");
}

export async function sair() {
  await fecharSessao();
  redirect("/admin/entrar");
}

/* ---------------------------------------------------------------- artigos */

const falha = (erro: string, campo?: keyof EntradaArtigo): Resultado => ({ ok: false, erro, campo });

function limpar(e: EntradaArtigo) {
  return {
    titulo: e.titulo.trim().replace(/\s+/g, " "),
    descricao: e.descricao.trim().replace(/\s+/g, " "),
    categoria: e.categoria.trim().replace(/\s+/g, " "),
    capaLocal: e.capaLocal.trim(),
    corpo: e.corpo.replace(/\r\n/g, "\n").trim(),
    slug: slugify(e.slug || e.titulo).slice(0, 90).replace(/-+$/, ""),
    /* Autor desconhecido (alguém saiu da lista) vira o Dr. Tércio em vez de quebrar a página. */
    autor: autores.some((a) => a.slug === e.autor) ? e.autor : AUTOR_PADRAO,
  };
}

export async function salvarArtigo(entrada: EntradaArtigo, acao: Acao): Promise<Resultado> {
  const usuario = await usuarioAtual();
  if (!usuario) return falha("Sua sessão expirou. Entre de novo (em outra aba, para não perder o texto) e salve outra vez.");

  const c = limpar(entrada);
  if (!c.titulo) return falha("Dê um título ao artigo.", "titulo");
  if (!c.slug) return falha("O endereço do artigo ficou vazio. Escreva um título com letras.", "slug");

  const vaiAoAr = acao !== "rascunho";
  if (vaiAoAr) {
    if (!c.capaLocal) return falha("Escolha uma imagem de capa antes de publicar.", "capaLocal");
    if (!c.categoria) return falha("Escolha a categoria do artigo.", "categoria");
    if (contarPalavras(c.corpo) < 30) return falha("O texto está muito curto para publicar.", "corpo");
  }

  /* Daqui até gravar não há await: duas gravações simultâneas não se atropelam. */
  const agora = Date.now();
  const lista = lerAcervo();
  const atual = entrada.id ? lista.find((a) => a.id === entrada.id) : undefined;
  if (entrada.id && !atual) return falha("Este artigo não existe mais — alguém pode tê-lo excluído.");
  if (atual && entrada.versao !== atual.atualizado) {
    return falha(
      `${atual.atualizadoPor || "Outra pessoa"} salvou este artigo enquanto você editava. Copie o seu texto, recarregue a página e aplique de novo.`,
    );
  }

  const slug = atual && estaNoAr(atual, agora) ? atual.slug : c.slug;
  if (lista.some((a) => a.slug === slug && a.id !== atual?.id)) {
    return falha("Já existe um artigo com este endereço. Mude o endereço ou o título.", "slug");
  }

  let status: ArtigoGuardado["status"];
  let publicado: string;
  /* Só agendamento de artigo que já tem data própria usa noArEm; as outras ações o limpam. */
  let noArEm: string | undefined;
  const temDataPropria = !!atual?.publicado && Date.parse(atual.publicado) <= agora;
  switch (acao) {
    case "rascunho":
      status = "rascunho";
      publicado = atual?.publicado ?? "";
      break;
    case "publicar":
      status = "publicado";
      /* Republicar um artigo que já esteve no ar mantém a data original. */
      publicado = atual?.publicado && Date.parse(atual.publicado) <= agora ? atual.publicado : new Date(agora).toISOString();
      break;
    case "agendar": {
      const quando = Date.parse(entrada.publicarEm ?? "");
      if (!Number.isFinite(quando)) return falha("Escolha a data e a hora da publicação.", "publicarEm");
      if (quando < agora + 60_000) return falha("A data do agendamento precisa estar no futuro.", "publicarEm");
      status = "publicado";
      /* Artigo com data própria (ex.: migrado do stemcells) mantém a data e só agenda a entrada no ar. */
      if (temDataPropria) {
        publicado = atual!.publicado;
        noArEm = new Date(quando).toISOString();
      } else {
        publicado = new Date(quando).toISOString();
      }
      break;
    }
    case "salvar":
      if (!atual || atual.status !== "publicado") return falha("Este artigo ainda não foi publicado.");
      status = "publicado";
      publicado = atual.publicado;
      noArEm = atual.noArEm;
      break;
  }

  const novo: ArtigoGuardado = {
    capa: "",
    urlAntiga: "",
    ...atual,
    ...c,
    slug,
    id: atual?.id ?? randomUUID(),
    status,
    publicado,
    noArEm,
    palavras: contarPalavras(c.corpo),
    atualizado: new Date(agora).toISOString(),
    criadoPor: atual?.criadoPor ?? usuario.nome,
    atualizadoPor: usuario.nome,
  };
  gravarAcervo(atual ? lista.map((a) => (a.id === novo.id ? novo : a)) : [...lista, novo]);

  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  return { ok: true, artigo: paraEditor(novo) };
}

export async function excluirArtigo(id: string, versao: string): Promise<{ ok: true } | { ok: false; erro: string }> {
  if (!(await usuarioAtual())) return { ok: false, erro: "Sua sessão expirou. Entre de novo." };
  const lista = lerAcervo();
  const atual = lista.find((a) => a.id === id);
  if (!atual) return { ok: true };
  if (atual.atualizado !== versao) return { ok: false, erro: "Alguém alterou este artigo agora há pouco. Recarregue a página antes de excluir." };
  gravarAcervo(lista.filter((a) => a.id !== id));
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  return { ok: true };
}

/** Guarda o que está na tela do editor (salvo ou não) e devolve o endereço da pré-visualização. */
export async function criarPrevia(entrada: EntradaArtigo): Promise<{ ok: true; url: string } | { ok: false; erro: string }> {
  if (!(await usuarioAtual())) return { ok: false, erro: "Sua sessão expirou. Entre de novo." };
  const c = limpar(entrada);
  const codigo = guardarPrevia({
    ...c,
    id: entrada.id ?? "previa",
    slug: c.slug || "previa",
    titulo: c.titulo || "Artigo sem título",
    capa: "",
    urlAntiga: "",
    status: "rascunho",
    publicado: entrada.publicarEm || new Date().toISOString(),
    atualizado: new Date().toISOString(),
    palavras: contarPalavras(c.corpo),
  });
  return { ok: true, url: `/admin/previa/${codigo}` };
}
