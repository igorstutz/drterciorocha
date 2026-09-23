import Link from "next/link";
import { Button } from "@/components/ui";
import { indications } from "@/content/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[75vh] items-center bg-ink-900 pt-32 pb-20">
      <div className="u-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-[5rem] leading-none text-gold-500/40">404</p>
          <h1 className="mt-4 text-display text-bone-50">
            Esta página não existe mais
          </h1>
          <p className="mt-6 text-lead text-bone-100/70">
            O endereço pode ter mudado com a reformulação do site. Abaixo estão os
            caminhos mais procurados.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" variant="gold">
              Ir para o início
            </Button>
            <Button href="/consulta" variant="ghostDark">
              Agendar consulta
            </Button>
          </div>

          <div className="mt-14 border-t border-bone-100/12 pt-10">
            <p className="u-eyebrow text-bone-100/45">Tratamentos</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
              {indications.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/tratamentos/${i.slug}`}
                    className="inline-block rounded-chip border border-bone-100/18 px-4 py-2 text-[0.85rem] text-bone-100/70 transition-colors hover:border-gold-500/60 hover:text-gold-400"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
