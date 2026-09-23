import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "muted";
}) {
  return (
    <p
      className={`u-eyebrow ${
        tone === "gold" ? "text-gold-700" : "text-bone-100/60"
      }`}
    >
      {children}
    </p>
  );
}

/**
 * Badge metalizado. O gradiente é estático; o lustro varre em laço enquanto o
 * badge está na tela (data-anima + o observador em AnimacaoEmVista).
 */
export function Badge({
  children,
  variant = "gold",
  className = "",
}: {
  children: ReactNode;
  variant?: "gold" | "steel" | "outline";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]";

  if (variant === "outline") {
    return (
      <span
        className={`${base} border border-gold-500/40 text-gold-600 ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      data-anima
      className={`${base} ${
        variant === "gold" ? "u-badge-metal" : "u-badge-steel"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  dark = false,
  centered = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow && (
        <div className={centered ? "flex justify-center" : ""}>
          <Badge variant={dark ? "gold" : "steel"}>{eyebrow}</Badge>
        </div>
      )}
      <h2
        className={`mt-5 text-display ${dark ? "text-bone-50" : "text-text-strong"}`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 text-lead ${dark ? "text-bone-100/70" : "text-text-body"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/**
 * Botão. `u-ring` põe o par de reflexos orbitando a borda no hover e
 * `u-sheen` faz o lustro atravessar a peça.
 */
export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "gold" | "ghost" | "ghostDark";
  external?: boolean;
  className?: string;
}) {
  const base =
    "u-ring u-sheen group inline-flex items-center justify-center gap-2 rounded-btn px-7 py-3.5 text-[0.9rem] font-semibold tracking-tight transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5";

  const variants = {
    primary:
      "bg-ink-900 text-bone-50 hover:bg-ink-700 hover:shadow-[0_14px_36px_-16px_rgb(6_8_11/0.6)]",
    gold: "bg-gold-500 text-ink-900 hover:bg-gold-400 hover:shadow-[0_14px_36px_-14px_rgb(196_160_86/0.7)]",
    ghost: "border border-ink-900/18 text-text-strong hover:border-gold-500/60",
    ghostDark: "border border-bone-100/22 text-bone-50 hover:border-gold-500/70",
  } as const;

  const cls = `${base} ${variants[variant]} ${className}`;
  const conteudo = <span className="relative z-[3]">{children}</span>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {conteudo}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {conteudo}
    </Link>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`u-rule ${className}`} aria-hidden="true" />;
}

export function Breadcrumbs({
  trail,
  dark = false,
}: {
  trail: { name: string; url: string }[];
  dark?: boolean;
}) {
  return (
    <nav
      aria-label="Trilha de navegação"
      className={`text-[0.78rem] ${dark ? "text-bone-100/55" : "text-text-muted"}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((t, i) => (
          <li key={t.url} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page">{t.name}</span>
            ) : (
              <Link
                href={t.url}
                className={`transition-colors ${
                  dark ? "hover:text-gold-400" : "hover:text-gold-700"
                }`}
              >
                {t.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Seta que desliza no hover do card pai (`group`). */
export function ArrowLink({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.85rem] font-semibold ${
        dark ? "text-gold-400" : "text-gold-700"
      }`}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 stroke-current transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </span>
  );
}
