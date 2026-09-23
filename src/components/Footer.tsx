import Link from "next/link";
import Image from "next/image";
import {
  doctor,
  social,
  sisterSites,
  disclaimer,
  contact,
  whatsappUrl,
  indications,
} from "@/content/site";

const colunas = [
  {
    titulo: "Tratamentos",
    links: indications.map((i) => ({
      href: `/tratamentos/${i.slug}`,
      label: i.title,
    })),
  },
  {
    titulo: "Navegar",
    links: [
      { href: "/dr-tercio-rocha", label: "O médico" },
      { href: "/tratamentos", label: "Todos os tratamentos" },
      { href: "/artigos", label: "Artigos" },
      { href: "/livros", label: "Livros" },
      { href: "/ebook-longevidade", label: "E-book gratuito" },
      { href: "/consulta", label: "Agendar consulta" },
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
    ],
  },
];

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-bone-100/70">
      <div className="u-container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image
              src="/img/logo-branco.png"
              alt="Dr. Tércio Rocha"
              width={200}
              height={65}
              className="h-11 w-auto"
            />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">
              Medicina regenerativa e protocolos de longevidade desde {doctor.since}.
              Clínica Tércio Rocha.
            </p>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 text-[0.95rem] font-medium text-gold-400 transition-colors hover:text-gold-300"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.3 8.3 0 1 1 12 20.3z" />
              </svg>
              {contact.whatsappLabel}
            </a>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem]">
              {social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold-400"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {colunas.map((col) => (
            <div key={col.titulo}>
              <h3 className="u-eyebrow text-gold-500">{col.titulo}</h3>
              <ul className="mt-5 space-y-3 text-[0.92rem]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="transition-colors hover:text-bone-50"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-bone-100/10 pt-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem]">
            <span className="text-bone-100/50">Também do Dr. Tércio:</span>
            {sisterSites.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-400"
              >
                {s.name}
              </a>
            ))}
          </div>

          <p className="mt-7 max-w-4xl text-[0.78rem] leading-relaxed text-bone-100/62">
            {disclaimer}
          </p>

          <div className="mt-6 flex flex-col gap-1.5 text-[0.78rem] text-bone-100/62 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Responsável técnico: {doctor.name} — {doctor.crm.join(" | ")}
            </p>
            <p>© {ano} {doctor.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
