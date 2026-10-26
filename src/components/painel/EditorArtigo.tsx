"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import type { EditorView } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { salvarArtigo, excluirArtigo, criarPrevia } from "@/lib/painel/acoes";
import { Capa } from "@/components/painel/Capa";
import { Ferramentas } from "@/components/painel/Ferramentas";
import { DialogoPublicar, type ItemConferido } from "@/components/painel/DialogoPublicar";
import { Icone } from "@/components/painel/Icone";
import { Selo } from "@/components/painel/Selo";
import { enviarImagem } from "@/components/painel/enviarImagem";
import { dataCurta, dataPorExtenso, haQuanto } from "@/lib/painel/datas";
import { minutosDeLeitura, nomeDaCategoria, slugify } from "@/lib/slug";
import { autores, AUTOR_PADRAO } from "@/content/autores";
import type { Acao, ArtigoNoEditor, EntradaArtigo } from "@/lib/painel/tipos";

const NOVA_CATEGORIA = "__nova__";
const DESCRICAO_IDEAL = 160;
/* Rascunhos se salvam sozinhos depois de alguns segundos sem digitar. Publicados, nunca: só no botão. */
const AUTOSALVAR_MS = 15_000;

type Aviso = { tipo: "ok" | "erro"; texto: string; link?: { href: string; rotulo: string } };

export function EditorArtigo({ inicial, categorias }: { inicial: ArtigoNoEditor | null; categorias: string[] }) {
  const router = useRouter();
  const [artigo, setArtigo] = useState<ArtigoNoEditor | null>(inicial);
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [categoria, setCategoria] = useState(inicial?.categoria ?? "");
  const [categoriaNova, setCategoriaNova] = useState(false);
  const [capa, setCapa] = useState(inicial?.capaLocal ?? "");
  const [autor, setAutor] = useState(inicial?.autor ?? AUTOR_PADRAO);
  const [slug, setSlug] = useState(inicial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!inicial);
  const [palavras, setPalavras] = useState(0);

  const [sujo, setSujo] = useState(false);
  const [mudancas, setMudancas] = useState(0);
  const contadorDeMudancas = useRef(0);
  const [ocupado, setOcupado] = useState<Acao | "previa" | "excluir" | null>(null);
  const [campoComErro, setCampoComErro] = useState<keyof EntradaArtigo | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [publicarAberto, setPublicarAberto] = useState(false);
  const [confirmar, setConfirmar] = useState<"excluir" | "tirar" | null>(null);
  const [, setRelogio] = useState(0);

  const situacao = artigo?.situacao ?? null;
  const jaPublicado = situacao === "publicado" || situacao === "agendado";
  const slugFinal = slugManual ? slug : slugify(titulo).slice(0, 90);

  const marcar = useCallback(() => {
    contadorDeMudancas.current++;
    setSujo(true);
    setMudancas(contadorDeMudancas.current);
  }, []);

  /* ------------------------------------------------------------ editor */

  const inserirImagens = useCallback(async (view: EditorView, arquivos: File[], pos?: number) => {
    for (const arquivo of arquivos) {
      try {
        const src = await enviarImagem(arquivo);
        const no = view.state.schema.nodes.image.create({ src, alt: "" });
        const onde = pos ?? view.state.selection.to;
        view.dispatch(view.state.tr.insert(Math.min(onde, view.state.doc.content.size), no));
      } catch (e) {
        setAviso({ tipo: "erro", texto: (e as Error).message });
      }
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image,
      Placeholder.configure({ placeholder: "Comece a escrever o artigo aqui…" }),
      Markdown,
    ],
    content: inicial?.corpo ?? "",
    contentType: "markdown",
    editorProps: {
      attributes: { class: "prose-artigo prose-artigo-cont", "aria-label": "Texto do artigo" },
      /* Imagens coladas de outro site ou do Google Docs ficariam presas ao endereço de origem
         (e somem quando ele muda). Saem do texto colado; a pessoa insere pelo botão de imagem. */
      transformPastedHTML(html) {
        let removidas = 0;
        const limpo = html.replace(/<img\b[^>]*>/gi, (tag) => {
          if (/\ssrc="\/(midia|img)\//i.test(tag)) return tag;
          removidas++;
          return "";
        });
        if (removidas) {
          setAviso({
            tipo: "erro",
            texto: `${removidas === 1 ? "A imagem colada ficou" : `${removidas} imagens coladas ficaram`} de fora. Use o botão de imagem da barra para inserir.`,
          });
        }
        return limpo;
      },
      handlePaste(view, event) {
        const arquivos = [...(event.clipboardData?.files ?? [])].filter((f) => f.type.startsWith("image/"));
        if (!arquivos.length) return false;
        inserirImagens(view, arquivos);
        return true;
      },
      handleDrop(view, event) {
        const arquivos = [...(event.dataTransfer?.files ?? [])].filter((f) => f.type.startsWith("image/"));
        if (!arquivos.length) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        inserirImagens(view, arquivos, pos);
        return true;
      },
    },
    onCreate: ({ editor: e }) => setPalavras(contar(e.getText())),
    onUpdate: ({ editor: e }) => {
      setPalavras(contar(e.getText()));
      marcar();
    },
  });

  /* ------------------------------------------------------------ salvar */

  const entrada = useCallback(
    (publicarEm?: string): EntradaArtigo => ({
      id: artigo?.id,
      versao: artigo?.atualizado,
      titulo,
      descricao,
      categoria,
      slug: slugFinal,
      capaLocal: capa,
      corpo: editor?.getMarkdown() ?? "",
      autor,
      publicarEm,
    }),
    [artigo, titulo, descricao, categoria, slugFinal, capa, autor, editor],
  );

  const salvar = useCallback(
    async (acao: Acao, publicarEm?: string, silencioso = false) => {
      if (!editor || ocupado) return false;
      setOcupado(acao);
      if (!silencioso) setAviso(null);
      const estavaNoAr = artigo?.situacao === "publicado";
      const mudancasAntes = contadorDeMudancas.current;
      let r: Awaited<ReturnType<typeof salvarArtigo>>;
      try {
        r = await salvarArtigo(entrada(publicarEm), acao);
      } catch {
        r = { ok: false, erro: "Não consegui falar com o servidor. Confira a internet e tente de novo." };
      }
      setOcupado(null);

      if (!r.ok) {
        setCampoComErro(r.campo ?? null);
        setAviso({ tipo: "erro", texto: r.erro });
        return false;
      }

      const novo = r.artigo;
      setCampoComErro(null);
      setArtigo(novo);
      setSlug(novo.slug);
      setSlugManual(true);
      /* Se a pessoa digitou enquanto salvava, continua "não salvo". */
      if (contadorDeMudancas.current === mudancasAntes) setSujo(false);
      /* Só troca o endereço: recarregar a página agora remontaria o editor e perderia o cursor. */
      if (!artigo) window.history.replaceState(null, "", `/admin/artigos/${novo.id}`);

      if (!silencioso) {
        const noSite = { href: `/artigos/${novo.slug}`, rotulo: "Ver no site" };
        if (acao === "publicar") setAviso({ tipo: "ok", texto: "Publicado! O artigo já está no site.", link: noSite });
        else if (acao === "agendar") setAviso({ tipo: "ok", texto: `Agendado: entra no ar ${dataPorExtenso(novo.publicado)}.` });
        else if (acao === "rascunho")
          setAviso({ tipo: "ok", texto: estavaNoAr ? "O artigo saiu do site e voltou a ser rascunho." : "Rascunho salvo." });
        else
          setAviso({
            tipo: "ok",
            texto: novo.situacao === "publicado" ? "Alterações publicadas no site." : "Alterações salvas.",
            link: novo.situacao === "publicado" ? noSite : undefined,
          });
      }
      return true;
    },
    [editor, ocupado, artigo, entrada],
  );

  /* Ctrl+S salva sem mudar a situação (rascunho continua rascunho, publicado continua publicado). */
  const salvarRapido = useCallback(() => salvar(jaPublicado ? "salvar" : "rascunho"), [salvar, jaPublicado]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        salvarRapido();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [salvarRapido]);

  /* Rascunho com título se salva sozinho. */
  useEffect(() => {
    if (!sujo || jaPublicado || !titulo.trim() || ocupado) return;
    const t = setTimeout(() => salvar("rascunho", undefined, true), AUTOSALVAR_MS);
    return () => clearTimeout(t);
  }, [mudancas, sujo, jaPublicado, titulo, ocupado, salvar]);

  /* Aviso do navegador ao fechar a aba com alterações não salvas. */
  useEffect(() => {
    if (!sujo) return;
    const antes = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", antes);
    return () => window.removeEventListener("beforeunload", antes);
  }, [sujo]);

  /* "Salvo há 3 min" se atualiza sozinho. */
  useEffect(() => {
    const t = setInterval(() => setRelogio((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  /* Avisos de sucesso somem sozinhos; os de erro ficam até a pessoa fechar. */
  useEffect(() => {
    if (aviso?.tipo !== "ok") return;
    const t = setTimeout(() => setAviso(null), 6000);
    return () => clearTimeout(t);
  }, [aviso]);

  async function previsualizar() {
    const janela = window.open("about:blank", "_blank");
    setOcupado("previa");
    let r: Awaited<ReturnType<typeof criarPrevia>>;
    try {
      r = await criarPrevia(entrada());
    } catch {
      r = { ok: false, erro: "Não consegui falar com o servidor." };
    }
    setOcupado(null);
    if (r.ok && janela) janela.location.href = r.url;
    else {
      janela?.close();
      setAviso({ tipo: "erro", texto: r.ok ? "O navegador bloqueou a nova aba. Libere as janelas deste site." : r.erro });
    }
  }

  async function excluir() {
    if (!artigo) return;
    setOcupado("excluir");
    const r = await excluirArtigo(artigo.id, artigo.atualizado).catch(() => ({
      ok: false as const,
      erro: "Não consegui falar com o servidor.",
    }));
    setOcupado(null);
    if (!r.ok) {
      setConfirmar(null);
      setAviso({ tipo: "erro", texto: r.erro });
      return;
    }
    setSujo(false);
    router.push("/admin");
  }

  function sairSemSalvar(e: React.MouseEvent) {
    if (sujo && !window.confirm("Há alterações não salvas. Sair mesmo assim?")) e.preventDefault();
  }

  /* ------------------------------------------------------------ conferência */

  const conferencia: ItemConferido[] = [
    { rotulo: "Título", ok: !!titulo.trim(), obrigatorio: true },
    { rotulo: "Imagem de capa", ok: !!capa, obrigatorio: true, dica: "Adicione no topo do artigo." },
    { rotulo: "Categoria", ok: !!categoria.trim(), obrigatorio: true, dica: "Escolha na coluna ao lado." },
    { rotulo: "Texto do artigo", ok: palavras >= 30, obrigatorio: true, dica: "O texto ainda está muito curto." },
    {
      rotulo: "Resumo",
      ok: !!descricao.trim(),
      obrigatorio: false,
      dica: "Recomendado: é o que aparece no Google. Sem ele, o site usa o começo do texto.",
    },
  ];

  const opcoesCategoria = [...new Set([...categorias, ...(categoria && !categoriaNova ? [categoria] : [])])];

  /* ------------------------------------------------------------ tela */

  return (
    <div className="pb-24">
      {/* Barra de ações */}
      <div className="sticky top-16 z-30 border-b border-ink-900/[0.08] bg-[#f3f1ec]/90 backdrop-blur-md lg:top-0">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
          <Link
            href="/admin"
            onClick={sairSemSalvar}
            className="painel-botao painel-botao-fantasma h-10 w-10 shrink-0 p-0 sm:w-auto sm:px-3"
            aria-label="Voltar para os artigos"
          >
            <Icone nome="voltar" />
            <span className="hidden sm:inline">Artigos</span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {situacao ? <Selo situacao={situacao} /> : <span className="text-[0.85rem] font-medium text-text-strong">Novo artigo</span>}
            <span className="hidden truncate text-[0.8rem] text-text-muted md:inline" suppressHydrationWarning>
              {ocupado && ocupado !== "previa" && ocupado !== "excluir" ? (
                "Salvando…"
              ) : sujo ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  Alterações não salvas
                </span>
              ) : artigo ? (
                `Salvo ${haQuanto(artigo.atualizado)}${artigo.atualizadoPor ? ` por ${artigo.atualizadoPor}` : ""}`
              ) : (
                ""
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={previsualizar}
            disabled={!!ocupado}
            className="painel-botao painel-botao-fantasma hidden sm:inline-flex"
            title="Abre o artigo como ele vai ficar no site, numa nova aba"
          >
            <Icone nome="olho" />
            Pré-visualizar
          </button>

          {situacao === "publicado" ? (
            <>
              <MenuMais
                itens={[
                  { rotulo: "Pré-visualizar", icone: "olho", onClick: previsualizar, soCelular: true },
                  { rotulo: "Ver no site", icone: "site", href: `/artigos/${artigo!.slug}` },
                  { rotulo: "Tirar do ar", icone: "relogio", onClick: () => setConfirmar("tirar") },
                  { rotulo: "Excluir artigo", icone: "lixo", onClick: () => setConfirmar("excluir"), perigo: true },
                ]}
              />
              <button
                type="button"
                onClick={() => salvar("salvar")}
                disabled={!!ocupado || !sujo}
                className="painel-botao painel-botao-primario px-4"
              >
                {ocupado === "salvar" ? "Salvando…" : sujo ? "Atualizar no site" : "Tudo salvo"}
              </button>
            </>
          ) : (
            <>
              <MenuMais
                itens={[
                  {
                    rotulo: situacao === "agendado" ? "Salvar" : "Salvar rascunho",
                    icone: "check",
                    onClick: () => salvar(situacao === "agendado" ? "salvar" : "rascunho"),
                    soCelular: true,
                  },
                  { rotulo: "Pré-visualizar", icone: "olho", onClick: previsualizar, soCelular: true },
                  ...(artigo ? [{ rotulo: "Excluir artigo", icone: "lixo" as const, onClick: () => setConfirmar("excluir"), perigo: true }] : []),
                ]}
              />
              <button
                type="button"
                onClick={() => salvar(situacao === "agendado" ? "salvar" : "rascunho")}
                disabled={!!ocupado}
                className="painel-botao painel-botao-secundario hidden sm:inline-flex"
              >
                {ocupado === "rascunho" || ocupado === "salvar" ? "Salvando…" : situacao === "agendado" ? "Salvar" : "Salvar rascunho"}
              </button>
              <button
                type="button"
                onClick={() => setPublicarAberto(true)}
                disabled={!!ocupado}
                className="painel-botao painel-botao-primario px-4"
              >
                {situacao === "agendado" ? (
                  <>
                    <Icone nome="calendario" />
                    Agendamento
                  </>
                ) : (
                  "Publicar…"
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-[84rem] gap-6 px-3 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8 lg:px-8 lg:pt-8">
        {/* Folha do artigo */}
        <div className="painel-cartao min-w-0 overflow-clip">
          <div className="p-3 sm:p-5">
            <Capa
              valor={capa}
              invalida={campoComErro === "capaLocal"}
              onMudar={(url) => {
                setCapa(url);
                if (campoComErro === "capaLocal") setCampoComErro(null);
                marcar();
              }}
              onErro={(texto) => setAviso({ tipo: "erro", texto })}
            />
          </div>

          <div className="mx-auto max-w-[44rem] px-5 pt-4 sm:px-8">
            <TextoAjustavel
              valor={titulo}
              onMudar={(v) => {
                setTitulo(v.replace(/\n/g, " "));
                marcar();
              }}
              placeholder="Título do artigo"
              invalido={campoComErro === "titulo"}
              className="text-[clamp(1.85rem,1.4rem+1.6vw,2.6rem)] leading-[1.1] font-medium tracking-[-0.03em] text-text-strong"
              rotulo="Título"
            />
            <div className="group relative mt-4">
              <TextoAjustavel
                valor={descricao}
                onMudar={(v) => {
                  setDescricao(v.replace(/\n/g, " "));
                  marcar();
                }}
                placeholder="Resumo em uma ou duas frases. Aparece abaixo do título e no Google."
                className="text-lead text-text-body"
                rotulo="Resumo"
              />
              <span
                className={`pointer-events-none absolute -bottom-5 right-0 text-[0.72rem] tabular-nums opacity-0 transition-opacity group-focus-within:opacity-100 ${
                  descricao.length > DESCRICAO_IDEAL ? "text-[#a3321f]" : "text-text-muted"
                }`}
              >
                {descricao.length}/{DESCRICAO_IDEAL}
              </span>
            </div>
          </div>

          <div className="sticky top-32 z-20 mt-8 lg:top-16">
            {editor && <Ferramentas editor={editor} onImagem={(f) => inserirImagens(editor.view, [f])} />}
          </div>

          <div
            className={`mx-auto max-w-[44rem] px-5 pt-8 sm:px-8 ${campoComErro === "corpo" ? "rounded-lg ring-2 ring-[#c2412d]/40" : ""}`}
          >
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="min-h-[22rem] animate-pulse rounded-lg bg-ink-900/[0.04]" aria-label="Carregando o editor" />
            )}
          </div>
        </div>

        {/* Coluna de ajustes */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Cartao titulo="Publicação">
            <div className="flex items-center justify-between gap-3">
              {situacao ? <Selo situacao={situacao} /> : <span className="text-[0.85rem] text-text-muted">Ainda não salvo</span>}
              <span className="text-[0.78rem] text-text-muted tabular-nums">
                {palavras} palavras · {minutosDeLeitura(palavras)} min
              </span>
            </div>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-text-body">
              {situacao === "publicado" && <>No ar desde {dataCurta(artigo!.publicado)}.</>}
              {situacao === "agendado" && <>Entra no ar sozinho {dataPorExtenso(artigo!.publicado)}.</>}
              {situacao === "rascunho" && "Só aparece aqui no painel. Os rascunhos se salvam sozinhos."}
              {!situacao && "Escreva à vontade: ao dar um título, o rascunho passa a se salvar sozinho."}
            </p>
            {situacao === "publicado" && (
              <a
                href={`/artigos/${artigo!.slug}`}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-azul-600 hover:underline"
              >
                Ver no site
                <Icone nome="site" className="h-3.5 w-3.5" />
              </a>
            )}
            {situacao === "agendado" && (
              <button
                type="button"
                onClick={() => setPublicarAberto(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-azul-600 hover:underline"
              >
                Mudar a data ou publicar agora
              </button>
            )}
          </Cartao>

          {autores.length > 1 && (
            <Cartao titulo="Autor">
              <select
                value={autor}
                onChange={(e) => {
                  setAutor(e.target.value);
                  marcar();
                }}
                className="painel-campo cursor-pointer"
              >
                {autores.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.nome}
                  </option>
                ))}
              </select>
            </Cartao>
          )}

          <Cartao titulo="Categoria">
            {categoriaNova ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    marcar();
                  }}
                  placeholder="Nome da nova categoria"
                  aria-invalid={campoComErro === "categoria"}
                  className="painel-campo"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCategoriaNova(false);
                    setCategoria(inicial?.categoria ?? "");
                  }}
                  className="painel-botao painel-botao-secundario h-[2.875rem] px-3"
                  aria-label="Voltar para a lista de categorias"
                >
                  <Icone nome="fechar" />
                </button>
              </div>
            ) : (
              <select
                value={categoria}
                aria-invalid={campoComErro === "categoria"}
                onChange={(e) => {
                  if (e.target.value === NOVA_CATEGORIA) {
                    setCategoriaNova(true);
                    setCategoria("");
                  } else setCategoria(e.target.value);
                  if (campoComErro === "categoria") setCampoComErro(null);
                  marcar();
                }}
                className="painel-campo cursor-pointer"
              >
                <option value="">Escolha uma categoria</option>
                {opcoesCategoria.map((c) => (
                  <option key={c} value={c}>
                    {nomeDaCategoria(c)}
                  </option>
                ))}
                <option value={NOVA_CATEGORIA}>+ Nova categoria…</option>
              </select>
            )}
          </Cartao>

          <Cartao titulo="Endereço no site">
            {artigo?.slugTravado ? (
              <>
                <p className="flex items-start gap-2 rounded-lg bg-bone-100 px-3 py-2.5 text-[0.82rem] break-all text-text-strong">
                  <Icone nome="cadeado" className="mt-0.5 h-3.5 w-3.5 text-text-muted" />
                  drterciorocha.com/artigos/{artigo.slug}
                </p>
                <p className="mt-2 text-[0.76rem] leading-relaxed text-text-muted">
                  Depois de publicado, o endereço não muda: quem já compartilhou o link continua chegando ao artigo.
                </p>
              </>
            ) : (
              <>
                <div
                  className={`flex items-center overflow-hidden rounded-[0.625rem] border bg-white focus-within:border-azul-500 focus-within:shadow-[0_0_0_3px_rgb(53_103_196/0.16)] ${
                    campoComErro === "slug" ? "border-[#c2412d]" : "border-ink-900/14"
                  }`}
                >
                  <span className="shrink-0 border-r border-ink-900/10 bg-bone-100 px-2.5 py-2.5 text-[0.76rem] text-text-muted">/artigos/</span>
                  <input
                    value={slugFinal}
                    onChange={(e) => {
                      setSlugManual(true);
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                      marcar();
                    }}
                    onBlur={() => setSlug(slugify(slugFinal))}
                    placeholder="endereco-do-artigo"
                    className="min-w-0 flex-1 px-2.5 py-2.5 text-[0.85rem] text-text-strong outline-none"
                    aria-label="Endereço do artigo"
                  />
                </div>
                <p className="mt-2 text-[0.76rem] leading-relaxed text-text-muted">
                  Sai do título. Dá para encurtar: endereços curtos e com as palavras principais ajudam no Google.
                </p>
                {slugManual && slugFinal !== slugify(titulo).slice(0, 90) && titulo && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugManual(false);
                      marcar();
                    }}
                    className="mt-1.5 text-[0.78rem] font-medium text-azul-600 hover:underline"
                  >
                    Voltar a seguir o título
                  </button>
                )}
              </>
            )}
          </Cartao>

          <Cartao titulo="Como aparece no Google">
            <div className="rounded-lg border border-ink-900/[0.08] bg-white p-3.5">
              <p className="flex items-center gap-2 text-[0.74rem] text-text-muted">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-ink-900 text-[0.55rem] font-semibold text-gold-400">TR</span>
                drterciorocha.com › artigos
              </p>
              <p className="mt-1.5 line-clamp-2 text-[1rem] leading-snug text-[#1a0dab]">
                {titulo || "Título do artigo"} | Dr. Tércio Rocha
              </p>
              <p className="mt-1 line-clamp-3 text-[0.8rem] leading-relaxed text-[#4d5156]">
                {descricao || editor?.getText().slice(0, 160) || "O resumo do artigo aparece aqui."}
              </p>
            </div>
          </Cartao>

          {artigo && situacao !== "publicado" && (
            <button
              type="button"
              onClick={() => setConfirmar("excluir")}
              className="painel-botao painel-botao-perigo w-full"
            >
              <Icone nome="lixo" />
              Excluir artigo
            </button>
          )}
        </aside>
      </div>

      {/* Aviso flutuante */}
      {aviso && (
        <div
          role={aviso.tipo === "erro" ? "alert" : "status"}
          className={`fixed inset-x-3 bottom-4 z-50 mx-auto flex max-w-lg items-start gap-3 rounded-xl px-4 py-3.5 text-[0.9rem] shadow-[0_20px_50px_-12px_rgb(10_23_51/0.45)] sm:bottom-6 ${
            aviso.tipo === "ok" ? "bg-ink-900 text-bone-50" : "bg-[#7f2416] text-white"
          }`}
        >
          <span
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${aviso.tipo === "ok" ? "bg-emerald-500" : "bg-white/20"}`}
          >
            <Icone nome={aviso.tipo === "ok" ? "check" : "alerta"} className="h-3 w-3" />
          </span>
          <span className="min-w-0 flex-1 leading-snug">
            {aviso.texto}
            {aviso.link && (
              <a href={aviso.link.href} target="_blank" rel="noopener" className="ml-2 font-medium text-gold-300 underline underline-offset-2">
                {aviso.link.rotulo}
              </a>
            )}
          </span>
          <button type="button" onClick={() => setAviso(null)} aria-label="Fechar aviso" className="-mr-1 opacity-60 hover:opacity-100">
            <Icone nome="fechar" />
          </button>
        </div>
      )}

      <DialogoPublicar
        aberto={publicarAberto}
        onFechar={() => setPublicarAberto(false)}
        situacao={situacao}
        agendadoPara={artigo?.publicado ?? ""}
        conferencia={conferencia}
        ocupado={!!ocupado}
        onPublicar={async () => {
          if (await salvar("publicar")) setPublicarAberto(false);
        }}
        onAgendar={async (iso) => {
          if (await salvar("agendar", iso)) setPublicarAberto(false);
        }}
        onCancelarAgendamento={async () => {
          if (await salvar("rascunho")) setPublicarAberto(false);
        }}
      />

      <DialogoConfirmar
        aberto={confirmar === "excluir"}
        titulo="Excluir este artigo?"
        texto={`“${titulo || "Sem título"}” sai do painel${situacao === "publicado" ? " e do site" : ""}. Não dá para desfazer por aqui.`}
        botao="Excluir"
        perigo
        ocupado={ocupado === "excluir"}
        onConfirmar={excluir}
        onFechar={() => setConfirmar(null)}
      />
      <DialogoConfirmar
        aberto={confirmar === "tirar"}
        titulo="Tirar do ar?"
        texto="O artigo sai do site e volta a ser rascunho. Você pode publicá-lo de novo quando quiser, no mesmo endereço."
        botao="Tirar do ar"
        ocupado={ocupado === "rascunho"}
        onConfirmar={async () => {
          if (await salvar("rascunho")) setConfirmar(null);
        }}
        onFechar={() => setConfirmar(null)}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- peças */

function contar(texto: string) {
  const t = texto.trim();
  return t ? t.split(/\s+/).length : 0;
}

function Cartao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="painel-cartao p-4 sm:p-5">
      <h2 className="mb-3 text-[0.78rem] font-semibold tracking-[0.08em] text-text-muted uppercase">{titulo}</h2>
      {children}
    </section>
  );
}

/** Campo de texto sem borda que cresce com o conteúdo: o título e o resumo parecem parte da folha. */
function TextoAjustavel({
  valor,
  onMudar,
  placeholder,
  className,
  rotulo,
  invalido,
}: {
  valor: string;
  onMudar: (v: string) => void;
  placeholder: string;
  className: string;
  rotulo: string;
  invalido?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [valor]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={valor}
      onChange={(e) => onMudar(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      placeholder={placeholder}
      aria-label={rotulo}
      aria-invalid={invalido}
      className={`block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-text-muted/45 ${
        invalido ? "rounded-md ring-2 ring-[#c2412d]/45" : ""
      } ${className}`}
    />
  );
}

type ItemMenu = {
  rotulo: string;
  icone: "olho" | "site" | "relogio" | "lixo" | "check";
  onClick?: () => void;
  href?: string;
  perigo?: boolean;
  soCelular?: boolean;
};

function MenuMais({ itens }: { itens: ItemMenu[] }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  const visiveis = itens.filter((i) => !i.soCelular);
  if (!itens.length) return null;

  return (
    <div ref={ref} className={`relative ${visiveis.length ? "" : "sm:hidden"}`}>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-label="Mais opções"
        className="painel-botao painel-botao-fantasma h-10 w-10 p-0"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>
      {aberto && (
        <div className="painel-cartao absolute top-12 right-0 z-40 w-56 overflow-hidden p-1.5">
          {itens.map((i) => {
            const classe = `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.88rem] transition-colors ${
              i.perigo ? "text-[#a3321f] hover:bg-[#fbeae6]" : "text-text-strong hover:bg-ink-900/[0.05]"
            } ${i.soCelular ? "sm:hidden" : ""}`;
            return i.href ? (
              <a key={i.rotulo} href={i.href} target="_blank" rel="noopener" className={classe} onClick={() => setAberto(false)}>
                <Icone nome={i.icone} />
                {i.rotulo}
              </a>
            ) : (
              <button
                key={i.rotulo}
                type="button"
                className={classe}
                onClick={() => {
                  setAberto(false);
                  i.onClick?.();
                }}
              >
                <Icone nome={i.icone} />
                {i.rotulo}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DialogoConfirmar({
  aberto,
  titulo,
  texto,
  botao,
  perigo,
  ocupado,
  onConfirmar,
  onFechar,
}: {
  aberto: boolean;
  titulo: string;
  texto: string;
  botao: string;
  perigo?: boolean;
  ocupado: boolean;
  onConfirmar: () => void;
  onFechar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (aberto && d && !d.open) d.showModal();
    if (!aberto && d?.open) d.close();
  }, [aberto]);

  return (
    <dialog ref={ref} onClose={onFechar} className="painel-dialogo max-w-md">
      <div className="p-6">
        <h2 className="text-[1.2rem] font-medium tracking-tight text-text-strong">{titulo}</h2>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-text-body">{texto}</p>
      </div>
      <div className="flex justify-end gap-2 rounded-b-2xl border-t border-ink-900/[0.07] bg-bone-100/50 px-6 py-4">
        <button type="button" onClick={onFechar} className="painel-botao painel-botao-secundario">
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={ocupado}
          className={`painel-botao px-4 ${perigo ? "bg-[#b4321f] text-white hover:bg-[#992a1a]" : "painel-botao-primario"}`}
        >
          {ocupado ? "Aguarde…" : botao}
        </button>
      </div>
    </dialog>
  );
}
