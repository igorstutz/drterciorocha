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
  /** Biografia completa, um parágrafo por item, para a página do autor. */
  bio?: string[];
  redes?: { rede: string; url: string }[];
};

/* Colunistas vindos do stemcells.com.br (26/10/2026). As bios são as de lá, revisadas. Quem não é
   médico aparece sem "Dr." e com a profissão: no site de um médico, o título sugeriria o contrário. */
const colunistas: Autor[] = [
  {
    slug: "jose-bento",
    nome: "Dr. José Bento de Souza",
    titulo: "Médico ginecologista e obstetra",
    registros: [],
    foto: "/img/autores/jose-bento.webp",
    retrato: "/img/autores/jose-bento.webp",
    resumo:
      "Ginecologista e obstetra desde o início dos anos 1980, ligado às maternidades dos hospitais Albert Einstein e São Luiz, em São Paulo.",
    pagina: "/autores/jose-bento",
    bio: [
      "O Dr. José Bento de Souza trabalha como ginecologista e obstetra desde o início dos anos 1980 e se mantém ligado às maternidades dos hospitais Albert Einstein e São Luiz.",
      "Formou-se pela Faculdade de Medicina da Universidade de Mogi das Cruzes em 1981, fez residência médica no Hospital das Clínicas, foi professor titular da Universidade de Taubaté e participa de congressos e seminários no Brasil e no exterior.",
      "Já participou de programas de televisão na Rede Globo e na Record, entre outros, falando ao grande público sobre gravidez, bem-estar, saúde e prevenção de doenças.",
    ],
    redes: [
      { rede: "Instagram", url: "https://www.instagram.com/josebento/" },
      { rede: "YouTube", url: "https://www.youtube.com/@dr.josebento" },
    ],
  },
  {
    slug: "sang-cha",
    nome: "Dr. Sang Choon Cha",
    titulo: "Médico, doutor em obstetrícia e ginecologia pela USP",
    registros: [],
    foto: "/img/autores/sang-cha.webp",
    retrato: "/img/autores/sang-cha.webp",
    resumo:
      "Médico formado pela Universidade de São Paulo, com doutorado em obstetrícia e ginecologia pela USP e aperfeiçoamento na Université de Montréal e na McGill University.",
    pagina: "/autores/sang-cha",
    bio: [
      "Graduado em medicina pela Universidade de São Paulo (1982), fez residência médica na USP (1986) e doutorado em medicina, na área de obstetrícia e ginecologia, também pela USP (1991).",
      "Especializou-se no Departamento de Obstetrícia e Ginecologia da Université de Montréal e fez aperfeiçoamento no Departamento de Obstetrícia e Ginecologia da McGill University, ambos em 1990.",
    ],
    redes: [
      { rede: "Instagram", url: "https://www.instagram.com/doutor.sangcha/" },
      { rede: "Facebook", url: "https://www.facebook.com/doutorsangcha/" },
    ],
  },
  {
    slug: "martha-rocha",
    nome: "Dra. Martha Rocha",
    titulo: "Saúde da mulher, longevidade e bem-estar",
    registros: [],
    foto: "/img/autores/martha-rocha.webp",
    retrato: "/img/autores/martha-rocha.webp",
    resumo: "Colunista dedicada à saúde da mulher, à longevidade e ao bem-estar.",
    pagina: "/autores/martha-rocha",
    redes: [
      { rede: "Instagram", url: "https://www.instagram.com/dramarthalybia/" },
      { rede: "Facebook", url: "https://www.facebook.com/dramarthalybia/" },
    ],
  },
  {
    slug: "viviane-anastacio",
    nome: "Viviane Anastacio",
    titulo: "Biomédica e pesquisadora",
    registros: [],
    foto: "/img/autores/viviane-anastacio.webp",
    retrato: "/img/autores/viviane-anastacio.webp",
    resumo:
      "Biomédica e pesquisadora, com quase dez anos de pesquisa com células, genômica e epigenética na ETH Zürich, na Suíça, e na St Mary's University, em Londres.",
    pagina: "/autores/viviane-anastacio",
    bio: [
      "Pesquisadora com formação na ETH Zürich, na Suíça, e na St Mary's University, em Londres, onde passou quase dez anos pesquisando células, biomedicina genômica e epigenética.",
      "É biomédica e está concluindo o curso de medicina na Europa.",
    ],
  },
  {
    slug: "lucio-lemos",
    nome: "Lúcio Lemos",
    titulo: "Biólogo, especialista em análises clínicas",
    registros: [],
    foto: "/img/autores/lucio-lemos.webp",
    retrato: "/img/autores/lucio-lemos.webp",
    resumo:
      "Biólogo, especialista em análises clínicas e em parasitologia, mestre em medicina veterinária (zoonoses), com 46 anos de experiência em laboratório de análises clínicas.",
    pagina: "/autores/lucio-lemos",
    bio: [
      "Biólogo (bacharelado e licenciatura), especialista em análises clínicas e em parasitologia, pós-graduado em análises clínicas e mestre em medicina veterinária, na área de zoonoses.",
      "Tem 46 anos de experiência em laboratório de análises clínicas.",
    ],
    redes: [
      { rede: "Instagram", url: "https://www.instagram.com/luciolemoslab/" },
      { rede: "LinkedIn", url: "https://www.linkedin.com/in/lucio-lemos-aa2858173/" },
    ],
  },
];

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
  ...colunistas,
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
