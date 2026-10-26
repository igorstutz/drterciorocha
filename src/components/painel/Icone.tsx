/* Ícones de traço do painel (24×24, mesma linguagem dos ícones do site). */
export const ICONES = {
  artigos: "M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 3v5h5M9 13h6M9 17h6",
  mais: "M12 5v14M5 12h14",
  site: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  sair: "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10",
  voltar: "M15 18l-6-6 6-6",
  busca: "M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM20 20l-4-4",
  olho: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  olhoFechado: "M3 3l18 18M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
  relogio: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  calendario: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lixo: "M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
  imagem: "M4 5h16v14H4zM4 16l4.5-4.5 4 4L15 13l5 5M15.5 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z",
  upload: "M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  negrito: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z",
  italico: "M14 5h-4M14 19h-4M14 5l-4 14M18 5h-4M10 19H6",
  lista: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  listaNumerada: "M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M4 9h3M4 14.5a1.5 1.5 0 0 1 3 .3c0 .9-3 2.4-3 4.2h3",
  citacao: "M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  separador: "M4 12h16M8 7h8M8 17h8",
  desfazer: "M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3",
  refazer: "M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h3",
  cadeado: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",
  seta: "M6 9l6 6 6-6",
  fechar: "M6 6l12 12M18 6L6 18",
  alerta: "M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  google: "M21 12.2c0-.7-.1-1.4-.2-2H12v3.8h5a4.3 4.3 0 0 1-1.9 2.8v2.3h3A9 9 0 0 0 21 12.2zM12 21a8.9 8.9 0 0 0 6.1-2.2l-3-2.3a5.5 5.5 0 0 1-8.2-2.9H3.8v2.4A9 9 0 0 0 12 21zM6.9 13.6a5.4 5.4 0 0 1 0-3.4V7.8H3.8a9 9 0 0 0 0 8.2zM12 6.6c1.4 0 2.6.5 3.6 1.4l2.6-2.6A9 9 0 0 0 3.8 7.8l3.1 2.4A5.4 5.4 0 0 1 12 6.6z",
  pena: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
} as const;

export function Icone({ nome, className = "h-4 w-4" }: { nome: keyof typeof ICONES; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} shrink-0 stroke-current`}
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONES[nome]} />
    </svg>
  );
}
