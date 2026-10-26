import { doctor } from "@/content/site";

/**
 * Quem assina os artigos. O Dr. Tércio é o autor de todo artigo sem `autor` (os 31 migrados do
 * WordPress e qualquer um salvo antes desta lista existir). Os colunistas que vêm do stemcells.com.br
 * entram aqui, cada um com a sua página em /autores/<slug>.
 */
export type Autor = {
  slug: string;
  nome: string;
  /** Profissão ou especialidade, como aparece abaixo do nome. */
  titulo: string;
  /** Registros profissionais, do mais importante para o menos. */
  registros: string[];
  /** Foto quadrada para o bloco "Sobre o autor". */
  foto: string;
  /** Retrato pequeno e redondo do topo do artigo. */
  retrato: string;
  resumo: string;
  /** Página do autor no site. */
  pagina: string;
  /** Complemento do selo sobre a capa ("Escrito pelo Dr. Tércio Rocha, 34 anos de prática clínica"). */
  selo?: string;
};

export const AUTOR_PADRAO = "dr-tercio-rocha";

export const autores: Autor[] = [
  {
    slug: AUTOR_PADRAO,
    nome: doctor.name,
    titulo: doctor.jobTitle,
    registros: [...doctor.crm],
    foto: "/img/tercio-foto2.jpg",
    retrato: "/img/tercio-retrato.webp",
    resumo: doctor.summary,
    pagina: "/dr-tercio-rocha",
    selo: `${doctor.yearsOfPractice} anos de prática clínica`,
  },
];

export function getAutor(slug?: string): Autor {
  return autores.find((a) => a.slug === slug) ?? autores[0];
}

/** "Escrito pelo Dr.", "Escrito pela Dra.", "Escrito por Ana". */
export function escritoPor(a: Autor) {
  if (/^Dra\.?\s/.test(a.nome)) return "Escrito pela";
  if (/^Dr\.?\s/.test(a.nome)) return "Escrito pelo";
  return "Escrito por";
}
