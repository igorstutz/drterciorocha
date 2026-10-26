import { ChromeDoSite } from "@/components/ChromeDoSite";

/* As páginas públicas. O grupo (site) não muda nenhum endereço: só separa o site do painel. */
export default function LayoutDoSite({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ChromeDoSite>{children}</ChromeDoSite>;
}
