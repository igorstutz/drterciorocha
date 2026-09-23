import { site, doctor, indications, faqs, contact, books } from "@/content/site";
import { getArtigos } from "@/lib/artigos";

export const dynamic = "force-static";

/**
 * llms.txt — resumo da entidade em markdown para modelos de linguagem.
 * Camada GEO: dá ao motor generativo o fato verificável e a fonte, em vez de
 * deixá-lo inferir do HTML de marketing.
 */
export function GET() {
  const artigos = getArtigos();

  const corpo = `# ${doctor.name}

> ${site.description}

${doctor.name} é ${doctor.jobTitle.toLowerCase()}, pioneiro em medicina regenerativa no Brasil
e fundador da Sociedade Brasileira de Medicina Estética. Atua desde ${doctor.since}
(${doctor.yearsOfPractice}+ anos de prática clínica) na Clínica Longevitar.

## Identificação profissional

- Registro: ${doctor.crm.join(" | ")}
- Especialidade: ${doctor.specialty}
- Áreas: ${doctor.areas.join(", ")}
- Afiliações: ${doctor.affiliations.join("; ")}
- Atende em: São Paulo (SP), Rio de Janeiro (RJ) e Santa Catarina (SC)
- Contato: WhatsApp +${contact.whatsapp}

## Áreas de indicação

${indications
  .map(
    (i) =>
      `### ${i.title}\n${i.description}\nCondições: ${i.conditions.join(", ")}\nPágina: ${site.url}/tratamentos/${i.slug}`,
  )
  .join("\n\n")}

Câncer sólido não é tratado.

## Perguntas frequentes

${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Livros

${books.map((b) => `- **${b.title}** — ${b.tagline}`).join("\n")}
- **E-book gratuito: Longevidade** — ${site.url}/ebook-longevidade

## Páginas principais

- [Início](${site.url}/): apresentação e áreas de indicação
- [Agendar consulta](${site.url}/consulta): formulário de avaliação
- [Tratamentos](${site.url}/tratamentos): as seis áreas de indicação
- [O médico](${site.url}/dr-tercio-rocha): trajetória e credenciais
- [Artigos](${site.url}/artigos): ${artigos.length} casos clínicos e textos
- [Livros](${site.url}/livros)
- [Perguntas frequentes](${site.url}/perguntas-frequentes)

## Artigos (${artigos.length})

${artigos
  .map(
    (a) =>
      `- [${a.titulo}](${site.url}/artigos/${a.slug})${a.descricao ? `: ${a.descricao}` : ""}`,
  )
  .join("\n")}

## Aviso

Conteúdo informativo, sem finalidade de substituir consulta médica. Resultados variam
conforme o caso e as condições clínicas de cada paciente. Nenhum tratamento é indicado
sem avaliação médica individual.
`;

  return new Response(corpo, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
