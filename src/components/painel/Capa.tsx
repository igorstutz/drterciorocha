"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icone } from "@/components/painel/Icone";
import { enviarImagem, TIPOS_DE_IMAGEM } from "@/components/painel/enviarImagem";

/** A imagem de capa: arrastar e soltar, ou clicar para escolher. */
export function Capa({
  valor,
  onMudar,
  onErro,
  invalida,
}: {
  valor: string;
  onMudar: (url: string) => void;
  onErro: (mensagem: string) => void;
  invalida?: boolean;
}) {
  const entrada = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [arrastando, setArrastando] = useState(false);

  async function receber(arquivo?: File | null) {
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      onErro("Escolha uma imagem (JPG, PNG ou WebP).");
      return;
    }
    setEnviando(true);
    try {
      onMudar(await enviarImagem(arquivo));
    } catch (e) {
      onErro((e as Error).message);
    } finally {
      setEnviando(false);
      if (entrada.current) entrada.current.value = "";
    }
  }

  const escolher = () => entrada.current?.click();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastando(false);
        receber(e.dataTransfer.files[0]);
      }}
      className="relative"
    >
      <input ref={entrada} type="file" accept={TIPOS_DE_IMAGEM} className="hidden" onChange={(e) => receber(e.target.files?.[0])} />

      {valor ? (
        <div className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-ink-900/[0.06]">
          <Image src={valor} alt="Capa do artigo" fill sizes="(min-width: 1024px) 48rem, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-ink-900/70 to-transparent p-3 pt-10 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-within:opacity-100">
            <button type="button" onClick={escolher} className="painel-botao painel-botao-secundario h-9 px-3">
              <Icone nome="imagem" />
              Trocar capa
            </button>
            <button
              type="button"
              onClick={() => onMudar("")}
              className="painel-botao h-9 bg-white/90 px-3 text-[#a3321f] hover:bg-white"
              aria-label="Remover capa"
            >
              <Icone nome="lixo" />
            </button>
          </div>
          {(enviando || arrastando) && (
            <div className="absolute inset-0 grid place-items-center bg-ink-900/55 text-[0.9rem] font-medium text-bone-50 backdrop-blur-sm">
              {enviando ? "Enviando a imagem…" : "Solte para trocar a capa"}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={escolher}
          disabled={enviando}
          aria-invalid={invalida}
          className={`flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors ${
            arrastando
              ? "border-azul-500 bg-azul-300/15"
              : invalida
                ? "border-[#c2412d]/60 bg-[#fbeae6]/50"
                : "border-ink-900/15 bg-bone-100/70 hover:border-ink-900/30 hover:bg-bone-100"
          }`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-azul-600 shadow-[0_1px_3px_rgb(10_23_51/0.12)]">
            <Icone nome={enviando ? "relogio" : "upload"} className="h-5 w-5" />
          </span>
          <span className="text-[0.95rem] font-medium text-text-strong">
            {enviando ? "Enviando a imagem…" : arrastando ? "Solte a imagem aqui" : "Adicionar imagem de capa"}
          </span>
          <span className="max-w-xs text-[0.8rem] text-text-muted">
            Arraste uma foto para cá ou clique para escolher. De preferência horizontal, com 1600 px de largura ou mais.
          </span>
        </button>
      )}
    </div>
  );
}
