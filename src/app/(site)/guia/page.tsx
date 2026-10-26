import type { Metadata } from "next";
import { Eyebrow, Breadcrumbs, Rule } from "@/components/ui";
import { GuiaForm } from "@/components/GuiaForm";

/**
 * Ficha para a guia de solicitação de exames — o /gerar-guia do site antigo. A equipe manda o
 * link pelo WhatsApp a quem aceitou as condições da consulta; a ficha vai para o painel de
 * atendimento (origem "guia") e cai nos campos do negócio do paciente. Página de uso interno:
 * fora do sitemap e sem indexação.
 */
export const metadata: Metadata = {
  title: "Ficha para a guia de solicitação de exames",
  description:
    "Preencha a ficha para a equipe do Dr. Tércio Rocha emitir a sua guia de solicitação de exames.",
  alternates: { canonical: "/guia" },
  robots: { index: false, follow: false },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Agendar consulta", url: "/consulta" },
  { name: "Ficha para a guia", url: "/guia" },
];

export default function Guia() {
  return (
    <section className="relative overflow-hidden bg-ink-900 pt-32 pb-20 md:pt-40 md:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(47_124_104/0.16),transparent_66%)] blur-2xl"
      />
      <div className="u-container relative">
        <Breadcrumbs trail={trail} dark />

        <div className="mt-8 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Eyebrow tone="muted">Próximo passo</Eyebrow>
            <h1 className="mt-5 text-display text-bone-50">
              Ficha para a sua{" "}
              <span className="u-accent text-gold-400">guia de solicitação de exames</span>
            </h1>
            <p className="mt-6 max-w-xl text-lead text-bone-100/72">
              A equipe do Dr. Tércio usa estes dados para emitir a guia e organizar o seu
              atendimento antes da consulta. Leva uns três minutos.
            </p>

            <Rule className="my-10 max-w-md" />

            <ol className="space-y-7">
              {[
                ["Dados do paciente", "Nome como está no documento, CPF, data de nascimento e estado civil."],
                ["Queixas e histórico", "O que mais incomoda hoje, outras doenças e o que já foi tentado."],
                ["Endereço", "Para a guia e os documentos do atendimento. O CEP preenche o resto."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-chip border border-gold-500/40 font-display text-[1rem] text-gold-400">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="font-display text-[1.15rem] text-bone-50">{t}</h2>
                    <p className="mt-1.5 text-[0.94rem] leading-relaxed text-bone-100/60">{d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-11 rounded-card border border-bone-100/12 bg-bone-100/5 p-5">
              <p className="text-[0.9rem] leading-relaxed text-bone-100/75">
                <strong className="font-medium text-bone-50">Importante:</strong> o tratamento é
                contraindicado para pacientes com câncer em atividade.
              </p>
            </div>

            <p className="mt-8 text-[0.9rem] text-bone-100/60">
              Depois de enviar, o atendimento continua no WhatsApp com a nossa equipe.
            </p>
          </div>

          <div
            id="formulario"
            className="rounded-card bg-bone-100 p-7 shadow-[0_32px_80px_-32px_rgb(0_0_0/0.5)] md:p-10"
          >
            <h2 className="text-title">Seus dados para a guia</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-text-body">
              Preencha os três passos. Os dados vão direto para a equipe, que emite a guia assim
              que receber o comprovante do pagamento.
            </p>
            <div className="mt-8">
              <GuiaForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
