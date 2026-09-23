"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/content/site";

const nav = [
  { href: "/tratamentos", label: "Tratamentos" },
  { href: "/dr-tercio-rocha", label: "O médico" },
  { href: "/artigos", label: "Artigos" },
  { href: "/livros", label: "Livros" },
  { href: "/ebook-longevidade", label: "E-book" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled || open
          ? "bg-ink-900/92 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="u-container flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="relative z-10 shrink-0"
          aria-label="Dr. Tércio Rocha — página inicial"
        >
          <Image
            src="/img/logo-branco.png"
            alt="Dr. Tércio Rocha"
            width={168}
            height={54}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-[0.9rem] font-medium tracking-tight transition-colors ${
                  active ? "text-gold-400" : "text-bone-100/80 hover:text-bone-50"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold-500 transition-all duration-400 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/consulta"
            className="hidden rounded-btn bg-gold-500 px-6 py-2.5 text-[0.85rem] font-semibold tracking-tight text-ink-900 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-gold-400 sm:inline-flex"
          >
            Agendar consulta
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-btn border border-bone-100/20 text-bone-50 transition-colors hover:border-gold-500/60 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-full bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-bone-100/10 bg-ink-900/98 backdrop-blur-xl lg:hidden"
      >
        <nav className="u-container flex flex-col py-6" aria-label="Menu mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-bone-100/8 py-4 font-display text-2xl text-bone-50 transition-colors hover:text-gold-400"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/consulta"
              className="rounded-btn bg-gold-500 px-6 py-3.5 text-center text-sm font-semibold text-ink-900"
            >
              Agendar consulta
            </Link>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-btn border border-bone-100/25 px-6 py-3.5 text-center text-sm font-medium text-bone-50"
            >
              Falar no WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
