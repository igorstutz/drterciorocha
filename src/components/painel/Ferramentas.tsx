"use client";

import { useRef, useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { Icone, ICONES } from "@/components/painel/Icone";
import { TIPOS_DE_IMAGEM } from "@/components/painel/enviarImagem";

/** A barra de formatação do texto: só o que o site sabe mostrar. */
export function Ferramentas({ editor, onImagem }: { editor: Editor; onImagem: (arquivo: File) => void }) {
  const estado = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      paragrafo: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      negrito: e.isActive("bold"),
      italico: e.isActive("italic"),
      lista: e.isActive("bulletList"),
      numerada: e.isActive("orderedList"),
      citacao: e.isActive("blockquote"),
      link: e.isActive("link"),
      href: (e.getAttributes("link").href as string | undefined) ?? "",
      podeDesfazer: e.can().undo(),
      podeRefazer: e.can().redo(),
    }),
  });

  const [linkAberto, setLinkAberto] = useState(false);
  const [endereco, setEndereco] = useState("");
  const arquivo = useRef<HTMLInputElement>(null);
  const c = () => editor.chain().focus();

  function abrirLink() {
    setEndereco(estado.href);
    setLinkAberto(true);
  }

  function aplicarLink() {
    let href = endereco.trim();
    if (!href) {
      c().extendMarkRange("link").unsetLink().run();
      setLinkAberto(false);
      return;
    }
    if (!/^(https?:|mailto:|\/|#)/i.test(href)) href = `https://${href}`;
    if (editor.state.selection.empty && !estado.link) {
      c().insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      c().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkAberto(false);
  }

  const tipo = estado.h2 ? "h2" : estado.h3 ? "h3" : "p";

  return (
    <div className="border-b border-ink-900/[0.08] bg-white/95 backdrop-blur">
      <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5 sm:px-3" role="toolbar" aria-label="Formatação do texto">
        <label className="sr-only" htmlFor="tipo-de-bloco">
          Estilo do parágrafo
        </label>
        <select
          id="tipo-de-bloco"
          value={tipo}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") c().setParagraph().run();
            else c().toggleHeading({ level: v === "h2" ? 2 : 3 }).run();
          }}
          className="mr-1 h-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent pr-7 pl-2.5 text-[0.86rem] font-medium text-text-strong hover:bg-ink-900/[0.06] focus:ring-2 focus:ring-azul-500/30 focus:outline-none"
        >
          <option value="p">Texto normal</option>
          <option value="h2">Subtítulo</option>
          <option value="h3">Subtítulo menor</option>
        </select>

        <Separador />
        <Botao icone="negrito" rotulo="Negrito" atalho="Ctrl+B" ativo={estado.negrito} onClick={() => c().toggleBold().run()} />
        <Botao icone="italico" rotulo="Itálico" atalho="Ctrl+I" ativo={estado.italico} onClick={() => c().toggleItalic().run()} />
        <Botao icone="link" rotulo="Link" ativo={estado.link || linkAberto} onClick={abrirLink} />
        <Separador />
        <Botao icone="lista" rotulo="Lista com marcadores" ativo={estado.lista} onClick={() => c().toggleBulletList().run()} />
        <Botao icone="listaNumerada" rotulo="Lista numerada" ativo={estado.numerada} onClick={() => c().toggleOrderedList().run()} />
        <Botao icone="citacao" rotulo="Citação em destaque" ativo={estado.citacao} onClick={() => c().toggleBlockquote().run()} />
        <Separador />
        <Botao icone="imagem" rotulo="Inserir imagem" onClick={() => arquivo.current?.click()} />
        <Botao icone="separador" rotulo="Linha divisória" onClick={() => c().setHorizontalRule().run()} />
        <span className="ml-auto flex shrink-0 items-center gap-0.5 pl-2">
          <Botao icone="desfazer" rotulo="Desfazer" atalho="Ctrl+Z" desativado={!estado.podeDesfazer} onClick={() => c().undo().run()} />
          <Botao icone="refazer" rotulo="Refazer" atalho="Ctrl+Y" desativado={!estado.podeRefazer} onClick={() => c().redo().run()} />
        </span>

        <input
          ref={arquivo}
          type="file"
          accept={TIPOS_DE_IMAGEM}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImagem(f);
            e.target.value = "";
          }}
        />
      </div>

      {linkAberto && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            aplicarLink();
          }}
          className="flex flex-wrap items-center gap-2 border-t border-ink-900/[0.06] bg-bone-100/80 px-3 py-2.5"
        >
          <Icone nome="link" className="h-4 w-4 text-text-muted" />
          <input
            autoFocus
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setLinkAberto(false)}
            placeholder="Cole o endereço do link (ex.: drterciorocha.com/consulta)"
            className="painel-campo h-9 min-w-0 flex-1 text-[0.88rem]"
          />
          <button type="submit" className="painel-botao painel-botao-primario h-9 px-3.5">
            Aplicar
          </button>
          {estado.link && (
            <button
              type="button"
              onClick={() => {
                c().extendMarkRange("link").unsetLink().run();
                setLinkAberto(false);
              }}
              className="painel-botao painel-botao-perigo h-9 px-3"
            >
              Remover link
            </button>
          )}
          <button type="button" onClick={() => setLinkAberto(false)} className="painel-botao painel-botao-fantasma h-9 px-3">
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}

function Botao({
  icone,
  rotulo,
  atalho,
  ativo,
  desativado,
  onClick,
}: {
  icone: keyof typeof ICONES;
  rotulo: string;
  atalho?: string;
  ativo?: boolean;
  desativado?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={desativado}
      aria-pressed={ativo}
      aria-label={rotulo}
      title={atalho ? `${rotulo} (${atalho})` : rotulo}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors disabled:opacity-30 ${
        ativo ? "bg-ink-900 text-bone-50" : "text-text-body hover:bg-ink-900/[0.07] hover:text-text-strong"
      }`}
    >
      <Icone nome={icone} className="h-[1.05rem] w-[1.05rem]" />
    </button>
  );
}

function Separador() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-ink-900/10" />;
}
