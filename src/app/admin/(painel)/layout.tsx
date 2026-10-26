import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { usuarioAtual } from "@/lib/painel/sessao";
import { sair } from "@/lib/painel/acoes";
import { Icone } from "@/components/painel/Icone";

/* Tudo aqui dentro exige login. As ações e o envio de imagem conferem a sessão de novo, por conta própria. */
export default async function LayoutLogado({ children }: Readonly<{ children: React.ReactNode }>) {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/admin/entrar");

  const iniciais = usuario.nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      {/* Lateral (computador) / barra do topo (celular). */}
      <aside className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 bg-ink-900 px-4 sm:px-6 lg:h-dvh lg:flex-col lg:items-stretch lg:justify-start lg:px-4 lg:py-6">
        <Link href="/admin" className="flex items-center gap-3 lg:px-2">
          <Image src="/img/logo-branco.png" alt="Dr. Tércio Rocha" width={120} height={39} className="h-7 w-auto lg:h-8" />
        </Link>
        <p className="u-eyebrow mt-3 hidden px-2 text-gold-400/80 lg:block">Painel do site</p>

        <nav className="hidden lg:mt-8 lg:block" aria-label="Painel">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg bg-bone-100/[0.08] px-3 py-2.5 text-[0.9rem] font-medium text-bone-50"
          >
            <Icone nome="artigos" className="h-[1.1rem] w-[1.1rem] text-gold-400" />
            Artigos
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] text-bone-100/65 transition-colors hover:bg-bone-100/[0.05] hover:text-bone-50"
          >
            <Icone nome="site" className="h-[1.1rem] w-[1.1rem]" />
            Ver o site
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-3">
          <Link href="/admin/artigos/novo" className="painel-botao painel-botao-ouro h-9 px-3 lg:hidden" aria-label="Novo artigo">
            <Icone nome="mais" className="h-4 w-4" />
            <span className="hidden sm:inline">Novo artigo</span>
          </Link>
          <div className="flex items-center gap-3 lg:rounded-xl lg:border lg:border-bone-100/10 lg:bg-bone-100/[0.04] lg:p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/90 text-[0.78rem] font-semibold text-ink-900">
              {iniciais}
            </span>
            <span className="hidden min-w-0 flex-1 lg:block">
              <span className="block truncate text-[0.85rem] font-medium text-bone-50">{usuario.nome}</span>
              <span className="block truncate text-[0.72rem] text-bone-100/50">{usuario.email}</span>
            </span>
            <form action={sair}>
              <button
                type="submit"
                title="Sair"
                aria-label="Sair"
                className="grid h-9 w-9 place-items-center rounded-lg text-bone-100/60 transition-colors hover:bg-bone-100/[0.08] hover:text-bone-50"
              >
                <Icone nome="sair" className="h-[1.1rem] w-[1.1rem]" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
