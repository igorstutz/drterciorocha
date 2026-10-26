import type { Metadata } from "next";

/* O painel do site: fora do Google e sem o cabeçalho, o rodapé e os pixels das páginas públicas. */
export const metadata: Metadata = {
  title: { default: "Painel do site", template: "%s · Painel do site" },
  robots: { index: false, follow: false },
};

export default function LayoutDoPainel({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="painel min-h-dvh bg-[#f3f1ec] text-text-body">{children}</div>;
}
