import Link from "next/link";
import { indications } from "@/content/site";
import { IconeArea } from "@/components/IconeArea";

/* Nomes curtos para caber em volta da órbita. */
const rotulo: Record<string, string> = {
  "doencas-autoimunes": "Autoimunes",
  "doencas-degenerativas": "Degenerativas",
  "lesoes-ortopedicas": "Ortopédicas",
  "doencas-cardiovasculares": "Cardiovasculares",
  "transtornos-hematologicos": "Hematológicas",
  "saude-sexual-masculina": "Saúde sexual",
};

/* Raio da órbita, em % do lado do quadrado. */
const RAIO = 40;

/**
 * As seis áreas em volta das células-tronco: o mapa do que o Dr. Tércio trata,
 * com cada área levando à sua página. Posições calculadas no servidor (seno e
 * cosseno fixos), então não há JavaScript nem movimento no cliente.
 */
export function OrbitaAreas() {
  const nos = indications.map((i, idx) => {
    const angulo = (-90 + idx * (360 / indications.length)) * (Math.PI / 180);
    return {
      ...i,
      x: 50 + RAIO * Math.cos(angulo),
      y: 50 + RAIO * Math.sin(angulo),
    };
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[30rem]">
      {/* anéis */}
      <div aria-hidden="true" className="absolute inset-[10%] rounded-full border border-dashed border-azul-300/25" />
      <div aria-hidden="true" className="absolute inset-[27%] rounded-full border border-azul-300/15" />
      <div aria-hidden="true" className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.22),transparent_70%)]" />

      {/* raios do núcleo até cada área */}
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {nos.map((n) => (
          <line
            key={n.slug}
            x1="50"
            y1="50"
            x2={n.x}
            y2={n.y}
            className="stroke-azul-300/25"
            strokeWidth="0.3"
            strokeDasharray="1 1.4"
          />
        ))}
      </svg>

      {/* núcleo */}
      <div className="absolute inset-[34%] grid place-items-center rounded-full border border-azul-300/30 bg-[radial-gradient(circle_at_35%_30%,#2f5aa8,#0d1d3f_72%)] text-center shadow-[0_0_60px_-10px_rgb(77_130_220/0.6),inset_0_1px_0_rgb(255_255_255/0.15)]">
        <div>
          <p className="font-accent text-[1.05rem] leading-tight text-gold-300 italic sm:text-[1.25rem] lg:text-[1.4rem]">
            Células-tronco
          </p>
          <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-bone-100/60 sm:text-[0.62rem]">
            {indications.length} áreas
          </p>
        </div>
      </div>

      {/* áreas */}
      {nos.map((n) => (
        <Link
          key={n.slug}
          href={`/tratamentos/${n.slug}`}
          className="group absolute flex -translate-x-1/2 -translate-y-[1.5rem] flex-col items-center gap-1.5 sm:-translate-y-[1.75rem]"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full border border-azul-300/40 bg-ink-800 text-gold-400 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] transition-[background-color,border-color,transform] duration-300 group-hover:scale-105 group-hover:border-gold-400/70 group-hover:bg-azul-600 sm:h-14 sm:w-14">
            <IconeArea slug={n.slug} className="h-5 w-5 stroke-current sm:h-6 sm:w-6" />
          </span>
          <span className="whitespace-nowrap rounded-full bg-ink-900/70 px-2 py-0.5 text-[0.7rem] font-medium text-bone-100/85 transition-colors group-hover:text-gold-300 sm:text-[0.8rem]">
            {rotulo[n.slug] ?? n.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
