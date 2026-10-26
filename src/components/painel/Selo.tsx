import type { Situacao } from "@/lib/painel/tipos";

const ESTILO: Record<Situacao, { rotulo: string; classe: string; ponto: string }> = {
  publicado: { rotulo: "No ar", classe: "bg-emerald-50 text-emerald-800 ring-emerald-600/20", ponto: "bg-emerald-500" },
  agendado: { rotulo: "Agendado", classe: "bg-azul-300/20 text-azul-600 ring-azul-500/25", ponto: "bg-azul-500" },
  rascunho: { rotulo: "Rascunho", classe: "bg-ink-900/[0.05] text-text-muted ring-ink-900/10", ponto: "bg-text-muted/60" },
};

export function Selo({ situacao, className = "" }: { situacao: Situacao; className?: string }) {
  const e = ESTILO[situacao];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.74rem] font-medium whitespace-nowrap ring-1 ring-inset ${e.classe} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${e.ponto} ${situacao === "agendado" ? "animate-pulse" : ""}`} />
      {e.rotulo}
    </span>
  );
}
