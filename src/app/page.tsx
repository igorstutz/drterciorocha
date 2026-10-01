import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  doctor,
  indications,
  books,
  ebook,
  homeFaqIds,
  pickFaqs,
} from "@/content/site";
import { getArtigos, formatarData } from "@/lib/artigos";
import {
  Button,
  Badge,
  Eyebrow,
  SectionHeading,
  Rule,
  ArrowLink,
} from "@/components/ui";
import { IconeArea } from "@/components/IconeArea";
import { Carrossel } from "@/components/Carrossel";
import { LeadForm } from "@/components/LeadForm";
import { Faq } from "@/components/Faq";
import { PassosConsulta } from "@/components/PassosConsulta";
import { RegeneraBrasil } from "@/components/RegeneraBrasil";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { JsonLd, graph, faqSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Dr. Tércio Rocha | Medicina Regenerativa e Células-tronco",
  description:
    "Tratamento com células-tronco e medicina regenerativa com o Dr. Tércio Rocha, endocrinologista com mais de 34 anos de prática. Agende sua avaliação.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const artigos = getArtigos();
  const destaque = books.find((b) => b.featured) ?? books[0];
  const perguntas = pickFaqs(homeFaqIds);

  return (
    <>
      {/* ================= HERO — cabe em uma tela no desktop ================= */}
      {/* O padding-top no desktop não é estético: com `items-center` sobre
          `h-svh` o conteúdo se centraliza na tela inteira, header incluído, e
          em telas baixas o topo passava por baixo do cabeçalho fixo. O padding
          reserva a faixa dos 5rem do header antes de centralizar o resto. */}
      <section className="u-grain u-grid-lines relative isolate flex items-center overflow-hidden bg-ink-900 pt-28 pb-16 lg:h-svh lg:max-h-[56rem] lg:min-h-[40rem] lg:pb-16 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 -top-48 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.18),transparent_66%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(47_124_104/0.16),transparent_68%)] blur-2xl"
        />

        <div className="u-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 xl:gap-24">
            <div>
              <Badge variant="gold">
                Medicina regenerativa e células-tronco · desde {doctor.since}
              </Badge>

              {/* O H1 carrega o termo principal da página. A segunda parte vem
                  da copy do marketing ("devolver ao organismo a capacidade de
                  se reconstruir"). */}
              <h1 className="mt-6 text-display text-bone-50">
                <span className="u-accent text-gold-400">Medicina regenerativa</span>:
                devolver ao corpo a capacidade de se reconstruir
              </h1>

              <p className="mt-6 max-w-xl text-lead text-bone-100/72">
                Médico endocrinologista com mais de {doctor.yearsOfPractice} anos de
                prática clínica e pesquisa, o Dr. Tércio Rocha usa a medicina
                regenerativa com células-tronco no tratamento de doenças autoimunes,
                degenerativas, ortopédicas e cardiovasculares.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/consulta" variant="gold">
                  Solicitar avaliação
                </Button>
                <Button href="/tratamentos" variant="ghostDark">
                  Ver tratamentos
                </Button>
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-bone-100/12 border-t border-bone-100/12 pt-6">
                {[
                  { n: `${doctor.yearsOfPractice}+`, l: "anos de prática clínica" },
                  { n: "3", l: "estados com registro ativo" },
                  { n: "31", l: "casos publicados" },
                ].map((s, i) => (
                  <div key={s.l} className={i === 0 ? "pr-5" : "px-5"}>
                    <dt className="text-3xl font-medium tracking-tight text-gold-400 md:text-4xl">
                      {s.n}
                    </dt>
                    <dd className="mt-1 text-[0.74rem] leading-snug text-bone-100/55">
                      {s.l}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Retrato: aspect 4/5 igual ao do arquivo, então nada é cortado,
                e a altura é limitada por svh para caber sem rolagem. */}
            <div data-anima className="u-ring u-ring-always relative mx-auto aspect-4/5 w-full max-w-sm rounded-card lg:h-[min(68svh,36rem)] lg:w-auto lg:max-w-full">
              <div className="relative h-full w-full overflow-hidden rounded-card">
                <Image
                  src="/img/tercio-retrato.webp"
                  alt="Retrato do Dr. Tércio Rocha, médico endocrinologista especialista em medicina regenerativa"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                  <div>
                    <p className="text-[1.05rem] font-medium tracking-tight text-bone-50">
                      {doctor.name}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-bone-100/65">
                      {doctor.jobTitle}
                    </p>
                  </div>
                  <Badge variant="steel">{doctor.crm[0]}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* dica de rolagem, só no desktop onde o hero ocupa a tela inteira */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
        >
          {/* Estático de propósito: um bounce infinito aqui mantinha a página
              em repintura contínua e derrubava o Speed Index, em troca de um
              detalhe que ninguém olha depois do primeiro segundo. */}
          <span className="flex flex-col items-center gap-1.5 text-bone-100/40">
            <span className="h-8 w-px bg-gradient-to-b from-transparent to-gold-500/70" />
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 stroke-gold-400"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </section>

      {/* ================= AFILIAÇÕES ================= */}
      <section className="u-grain relative overflow-hidden border-y border-ink-900/8 bg-bone-200/70 py-6">
        <div className="u-container relative z-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center text-[0.72rem] font-medium uppercase tracking-[0.16em] text-text-muted">
            {doctor.affiliations.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= COMO FUNCIONA ================= */}
      <PassosConsulta />

      {/* ================= INDICAÇÕES ================= */}
      <section id="tratamentos" className="u-dots relative overflow-hidden py-20 md:py-24">
        <div className="u-container relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Áreas de indicação"
              title={
                <>
                  Quais doenças podem ser
                  <br className="hidden md:block" /> tratadas com{" "}
                  <span className="u-accent text-gold-700">células-tronco</span>?
                </>
              }
              lead="O Dr. Tércio Rocha atua em áreas onde a medicina regenerativa com células-tronco tem demonstrado resultados promissores. A indicação depende sempre de avaliação médica individual."
            />
            <Button href="/tratamentos" variant="ghost" className="shrink-0">
              Ver todas as áreas
            </Button>
          </div>

          {/* Grade de linhas compartilhadas: um fio de 1px separa os cards, que
              perdem a borda individual. Dá a mesma leitura de tabela clínica e
              tira o ruído de seis molduras repetidas. */}
          <div className="mt-12 overflow-hidden rounded-card border border-ink-900/12 bg-bone-50">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {indications.map((i, idx) => (
                <Link
                  key={i.slug}
                  href={`/tratamentos/${i.slug}`}
                  className="group u-reveal u-halo relative flex flex-col p-7 transition-colors duration-500 hover:bg-bone-100 md:p-8"
                >
                  {/* Divisórias desenhadas com sombra: sem borda dupla nas
                      junções e sem precisar calcular qual card é da última
                      coluna ou linha. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 shadow-[inset_-1px_-1px_0_0_rgb(6_8_11/0.1)]"
                  />

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-ink-900 text-gold-400 transition-colors duration-500 group-hover:bg-gold-600 group-hover:text-ink-900">
                        <IconeArea slug={i.slug} className="h-[1.35rem] w-[1.35rem] stroke-current" />
                      </span>
                      <span className="text-[0.68rem] font-semibold tabular-nums text-text-muted/40">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-7 text-[1.2rem] font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-gold-700">
                      {i.title}
                    </h3>
                    <p className="mt-2 text-[0.89rem] leading-relaxed text-text-muted">
                      {i.short}
                    </p>

                    <ul className="mt-5 flex flex-1 flex-wrap content-start gap-x-1.5 gap-y-2">
                      {i.conditions.slice(0, 3).map((c) => (
                        <li
                          key={c}
                          className="rounded-chip bg-bone-200/90 px-2 py-1 text-[0.7rem] font-medium text-text-body"
                        >
                          {c}
                        </li>
                      ))}
                      {i.conditions.length > 3 && (
                        <li className="rounded-chip px-1.5 py-1 text-[0.7rem] font-semibold text-gold-700">
                          +{i.conditions.length - 3}
                        </li>
                      )}
                    </ul>

                    <div className="mt-7 flex items-center justify-between">
                      <ArrowLink>Saiba mais</ArrowLink>
                      <span className="text-[0.7rem] tabular-nums text-text-muted/60">
                        {i.conditions.length} condições
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[0.82rem] text-text-muted">
            Câncer sólido não é tratado.
          </p>

          {/* Chamada escura no fim da grade clara: quebra a sequência de
              cards brancos e marca a saída para a conversa. */}
          <div className="u-grain relative isolate mt-12 overflow-hidden rounded-card bg-ink-900 p-7 md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.22),transparent_68%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(47_124_104/0.22),transparent_68%)]"
            />
            <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-jade-500 text-bone-50">
                  <IconeWhatsApp className="h-6 w-6" />
                </span>
                <div className="max-w-2xl">
                  <h3 className="text-[1.35rem] font-medium tracking-tight text-bone-50">
                    Tem dúvidas sobre uma dessas condições?
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-bone-100/65">
                    Converse com a equipe para obter informações sobre o atendimento e
                    entender se o seu caso tem indicação para uma avaliação com o Dr.
                    Tércio.
                  </p>
                </div>
              </div>
              <Button
                whatsapp={{ local: "home-tratamentos" }}
                variant="gold"
                className="shrink-0"
              >
                Falar com a equipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= O MÉDICO ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-800 py-20 text-bone-100/72 md:py-24">
        <div className="u-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="u-ring relative order-2 mx-auto w-full max-w-md rounded-card lg:order-1 lg:max-w-none">
              <div className="relative aspect-4/5 overflow-hidden rounded-card">
                <Image
                  src="/img/tercio-foto2.jpg"
                  alt="Dr. Tércio Rocha em atendimento na Clínica Tércio Rocha"
                  fill
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 hidden lg:block">
                <div className="u-badge-metal rounded-card px-5 py-4 text-center">
                  <p className="text-2xl font-semibold tracking-tight">
                    {doctor.yearsOfPractice}+
                  </p>
                  <p className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                    anos de prática
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="Quem conduz o tratamento"
                title={
                  <>
                    Dr. Tércio Rocha: uma trajetória construída na fronteira da{" "}
                    <span className="u-accent text-gold-400">medicina regenerativa</span>
                  </>
                }
                dark
              />

              <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed">
                <p>{doctor.summary}</p>
              </div>

              <Rule className="my-8 max-w-md" />

              <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {doctor.areas.map((a) => (
                  <li key={a} className="flex items-start gap-2.5 text-[0.9rem]">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-1 h-3.5 w-3.5 shrink-0 stroke-gold-500"
                      fill="none"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m4 12.5 5 5L20 6.5" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button href="/dr-tercio-rocha" variant="ghostDark">
                  Conhecer a trajetória completa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARTIGOS EM CARROSSEL ================= */}
      <section className="py-20 md:py-24">
        <div className="u-container">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Do consultório"
              title={
                <>
                  Artigos e casos reais sobre{" "}
                  <span className="u-accent text-gold-700">células-tronco</span> e
                  longevidade
                </>
              }
              lead="Artigos do Dr. Tércio sobre longevidade, células-tronco e qualidade de vida. Conteúdo com base científica, escrito para quem quer entender, não apenas seguir. Nos casos clínicos, os nomes dos pacientes foram trocados."
            />
            <Button href="/artigos" variant="ghost" className="shrink-0">
              Ver os {artigos.length} artigos
            </Button>
          </div>

          <div className="mt-12">
            <Carrossel rotulo="Artigos e casos clínicos">
              {artigos.slice(0, 10).map((a) => (
                <Link
                  key={a.slug}
                  href={`/artigos/${a.slug}`}
                  className="group u-ring flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover"
                >
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={a.capaLocal}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 22rem, 19rem"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink-900/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <Eyebrow>{a.categoria}</Eyebrow>
                    <h3 className="mt-2.5 text-[1.12rem] font-medium leading-snug tracking-tight transition-colors group-hover:text-gold-700">
                      {a.titulo}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 flex-1 text-[0.88rem] leading-relaxed text-text-body">
                      {a.descricao}
                    </p>
                    <time
                      dateTime={a.publicado}
                      className="mt-4 text-[0.74rem] text-text-muted"
                    >
                      {formatarData(a.publicado)} · {a.leitura} min
                    </time>
                  </div>
                </Link>
              ))}
            </Carrossel>
          </div>
        </div>
      </section>

      {/* ================= LIVRO EM DESTAQUE ================= */}
      <section className="pb-20 md:pb-24">
        <div className="u-container">
          <SectionHeading
            eyebrow="Livros"
            title={
              <>
                Livros do Dr. Tércio Rocha: ciência e experiência{" "}
                <span className="u-accent text-gold-700">também nas páginas</span>
              </>
            }
          />
          <div className="u-ring u-halo relative mt-12 grid items-center gap-10 overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 p-7 md:p-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="relative z-10 mx-auto w-full max-w-[17rem]">
              <div
                aria-hidden="true"
                className="absolute inset-x-5 -bottom-3 h-7 rounded-full bg-ink-900/14 blur-xl"
              />
              <div className="u-sheen relative rounded-sm">
                <Image
                  src={destaque.cover}
                  alt={`Capa do livro ${destaque.title}, de Dr. Tércio Rocha`}
                  width={520}
                  height={740}
                  sizes="(min-width: 1024px) 20vw, 65vw"
                  className="w-full rounded-sm shadow-lift"
                />
              </div>
            </div>

            <div className="relative z-10">
              <Badge variant="gold">Lançamento</Badge>
              <h3 className="mt-4 text-title">{destaque.title}</h3>
              <p className="u-accent mt-3 text-[1.28rem] leading-snug text-gold-700">
                {destaque.tagline}
              </p>
              <p className="mt-4 text-[0.96rem] leading-relaxed text-text-body">
                {destaque.summary}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href={destaque.buyUrl} variant="primary" external>
                  Comprar agora
                </Button>
                <Button href="/livros" variant="ghost">
                  Conhecer os livros
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= E-BOOK ================= */}
      <section className="u-grain u-grid-lines relative isolate overflow-hidden bg-gradient-to-br from-jade-900 via-ink-900 to-ink-900 py-16 md:py-20">
        <div className="u-container relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <Badge variant="gold">Material gratuito</Badge>
              <h2 className="mt-4 text-title text-bone-50">
                E-book gratuito sobre longevidade: como regenerar o corpo e a mente
              </h2>
              <p className="u-accent mt-3 text-[1.25rem] leading-snug text-gold-400">
                {ebook.tagline}
              </p>
              <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-bone-100/70">
                {ebook.summary}
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {ebook.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-bone-100/75"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-gold-500"
                      fill="none"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m4 12.5 5 5L20 6.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/ebook-longevidade" variant="gold">
                  Quero receber o e-book
                </Button>
              </div>
            </div>
            <div className="u-sheen mx-auto w-full max-w-[13rem] rounded-sm">
              <Image
                src={ebook.cover}
                alt={`Capa do e-book ${ebook.title}`}
                width={434}
                height={614}
                sizes="(min-width: 1024px) 15vw, 50vw"
                className="w-full rounded-sm shadow-[0_24px_56px_-20px_rgb(0_0_0/0.65)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= REGENERA BRASIL ================= */}
      <RegeneraBrasil />

      {/* ================= FAQ ================= */}
      <section className="u-dots relative overflow-hidden bg-bone-200/50 py-20 md:py-24">
        <div className="u-container relative z-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Perguntas frequentes"
                title={
                  <>
                    Perguntas frequentes
                    <br className="hidden md:block" /> sobre{" "}
                    <span className="u-accent text-gold-700">células-tronco</span>
                  </>
                }
                lead="Se a sua dúvida não estiver aqui, a equipe responde pelo WhatsApp."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button whatsapp={{ local: "home-faq" }} variant="ghost">
                  Tirar uma dúvida
                </Button>
                <Button href="/perguntas-frequentes" variant="ghost">
                  Ver todas as perguntas
                </Button>
              </div>
            </div>
            <Faq items={perguntas} />
          </div>
        </div>
      </section>

      {/* ================= FORMULÁRIO ================= */}
      <section
        id="contato"
        className="u-grain u-grid-lines relative isolate overflow-hidden bg-ink-900 py-20 md:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(196_160_86/0.14),transparent_68%)] blur-2xl"
        />
        <div className="u-container relative z-10">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Primeiro passo"
                title={
                  <>
                    Deu o primeiro passo.
                    <br className="hidden md:block" /> A equipe cuida do resto.
                  </>
                }
                lead="Preencha com seus dados e o motivo do contato. A equipe retorna pelo WhatsApp para alinhar as próximas etapas com você. O envio não gera cobrança nem compromisso."
                dark
              />

              {/* Quem prefere o WhatsApp também passa pelo formulário: a conversa
                  abre logo depois do envio, com os dados já no CRM. */}
              <div className="relative mt-10 flex items-center gap-4 rounded-card border border-bone-100/12 bg-bone-100/[0.04] p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-jade-500 text-bone-50">
                  <IconeWhatsApp />
                </span>
                <span className="flex-1">
                  <span className="block text-[0.95rem] font-medium text-bone-50">
                    Prefere conversar pelo WhatsApp?
                  </span>
                  <span className="mt-0.5 block text-[0.84rem] text-bone-100/60">
                    Depois do envio, a conversa com a equipe abre com um clique.
                  </span>
                </span>
              </div>
            </div>

            <div className="u-ring rounded-card bg-bone-100 p-6 md:p-8">
              <LeadForm origem="home" />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(faqSchema(perguntas))} />
    </>
  );
}
