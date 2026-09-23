/**
 * Acordeão em <details>: sem JavaScript, sem hidratação e — o que importa para
 * AEO — a resposta já está no HTML, legível por crawler mesmo fechada.
 */
export function Faq({
  items,
  dark = false,
}: {
  items: readonly { q: string; a: string }[];
  dark?: boolean;
}) {
  return (
    <div className="divide-y divide-current/10">
      {items.map((item) => (
        <details
          key={item.q}
          name="faq"
          className={`group py-1 ${dark ? "text-bone-100/70" : "text-text-body"}`}
        >
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left font-display text-[1.12rem] leading-snug transition-colors md:text-[1.22rem] ${
              dark
                ? "text-bone-50 group-hover:text-gold-400"
                : "text-text-strong group-hover:text-gold-700"
            }`}
          >
            {item.q}
            <span
              className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-chip border transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45 ${
                dark ? "border-bone-100/25" : "border-ink-900/18"
              }`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="max-w-3xl pb-6 pr-10 text-[0.98rem] leading-relaxed">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
