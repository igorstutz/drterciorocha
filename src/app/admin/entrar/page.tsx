import Image from "next/image";
import { redirect } from "next/navigation";
import { painelConfigurado, usuarioAtual } from "@/lib/painel/sessao";
import { FormEntrar } from "@/components/painel/FormEntrar";

export const metadata = { title: "Entrar" };

export default async function Entrar() {
  if (await usuarioAtual()) redirect("/admin");

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Lado marinho: a marca e o que o painel faz. No celular vira uma faixa no topo. */}
      <div className="u-grain relative isolate flex flex-col justify-between overflow-hidden bg-ink-900 px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.25),transparent_66%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.16),transparent_68%)] blur-2xl"
        />
        <Image src="/img/logo-branco.png" alt="Dr. Tércio Rocha" width={168} height={54} priority className="relative h-9 w-auto self-start" />

        <div className="relative mt-10 hidden max-w-md lg:block">
          <p className="u-eyebrow text-gold-400">Painel do site</p>
          <p className="mt-5 text-[2.6rem] leading-[1.08] font-medium tracking-[-0.03em] text-bone-50">
            Escreva, agende e publique os{" "}
            <span className="u-accent text-gold-300">artigos</span> do site.
          </p>
          <ul className="mt-9 space-y-3.5 text-[0.95rem] text-bone-100/70">
            {[
              "Editor que já mostra o texto como ele fica no site",
              "Agendamento: o artigo entra no ar sozinho no dia e na hora marcados",
              "Pré-visualização antes de publicar",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-10 hidden text-[0.78rem] text-bone-100/40 lg:block">drterciorocha.com</p>
      </div>

      <div className="flex items-start justify-center px-5 py-10 sm:items-center sm:px-10">
        <div className="w-full max-w-[25rem]">
          <h1 className="text-[1.75rem] font-medium tracking-[-0.025em] text-text-strong">Entrar no painel</h1>
          <p className="mt-2 text-[0.95rem] text-text-muted">Use o e-mail e a senha que você recebeu.</p>

          {painelConfigurado() ? (
            <FormEntrar />
          ) : (
            <div className="mt-8 rounded-xl border border-gold-500/40 bg-gold-200/40 p-5 text-[0.92rem] leading-relaxed text-text-strong">
              O acesso ao painel ainda não foi configurado neste servidor. Peça ao responsável pelo site para
              cadastrar o seu e-mail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
