import Image from "next/image";
import { doctor, regenera } from "@/content/site";
import { Badge, Button } from "@/components/ui";

/**
 * Faixa do congresso na home. Não há foto do evento, então a identidade vem
 * da tipografia: fundo champanhe (único no site), o nome REGENERA vazado ao
 * fundo em escala de cartaz e um cartão com os princípios do congresso.
 */
export function RegeneraBrasil() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,var(--color-gold-200)_0%,var(--color-bone-100)_52%,var(--color-bone-200)_100%)] py-20 md:py-28">
      <p
        aria-hidden="true"
        className="u-outline-text pointer-events-none absolute -bottom-[0.2em] left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(6rem,19vw,19rem)] leading-none font-semibold tracking-[-0.06em]"
      >
        REGENERA
      </p>

      <div className="u-container">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <Badge variant="gold">Congresso · Regenera Brasil</Badge>
            <h2 className="mt-5 text-display text-text-strong">
              Regenera Brasil: o congresso de{" "}
              <span className="u-accent text-gold-700">medicina regenerativa</span>{" "}
              criado pelo Dr. Tércio Rocha
            </h2>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-text-body">
              {regenera.text}
            </p>
            <div className="mt-9">
              <Button href={regenera.url} variant="primary" external>
                Conhecer o Regenera Brasil
              </Button>
            </div>
          </div>

          <div className="u-ring u-ring-always rounded-card bg-bone-50/85 p-7 shadow-[0_32px_70px_-40px_rgb(125_99_41/0.55)] backdrop-blur-sm md:p-9">
            <p className="u-eyebrow text-gold-700">O que guia o congresso</p>
            <ol className="mt-6 space-y-6">
              {regenera.pillars.map((p, i) => (
                <li key={p.title} className="flex gap-4">
                  <span className="font-accent text-[1.9rem] leading-none text-gold-600 italic">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[1.05rem] font-medium tracking-tight text-text-strong">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[0.9rem] leading-relaxed text-text-body">
                      {p.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-center gap-3 border-t border-ink-900/10 pt-5">
              <Image
                src="/img/tercio-retrato.webp"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover object-top"
              />
              <p className="text-[0.82rem] leading-snug text-text-muted">
                Criado e presidido pelo
                <span className="block font-medium text-text-strong">{doctor.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
