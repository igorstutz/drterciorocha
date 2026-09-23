/**
 * Fonte única de verdade do site. Todo dado veio da varredura do site antigo
 * (ver conteudo-original/AUDITORIA.md) — nada aqui é inventado.
 */

export const site = {
  name: "Dr. Tércio Rocha",
  legalName: "Dr. Tércio Rocha — Medicina Regenerativa",
  url: "https://drterciorocha.com",
  locale: "pt-BR",
  description:
    "Medicina regenerativa com células-tronco. Dr. Tércio Rocha, endocrinologista com mais de 34 anos de prática clínica e protocolos de longevidade desde 1990.",
  city: "São Paulo",
  state: "SP",
  country: "BR",
} as const;

export const doctor = {
  name: "Dr. Tércio Rocha",
  honorific: "Dr.",
  jobTitle: "Médico endocrinologista",
  specialty: "Medicina Regenerativa e Longevidade",
  crm: ["CRM SP 148068", "CRM RJ 525847", "CRM SC 30974"],
  since: 1990,
  yearsOfPractice: 34,
  areas: [
    "Medicina Regenerativa",
    "Medicina Estética Regenerativa",
    "Medicina Anti-Aging",
    "Medicina Integrativa",
  ],
  affiliations: [
    "Academia Brasileira Antienvelhecimento",
    "Academia Internacional de Medicina Antienvelhecimento",
    "Sociedade Francesa de Medicina Estética e Mesoterapia",
    "Fundador da Sociedade Brasileira de Medicina Estética",
  ],
  bio: [
    "Dr. Tércio Rocha é um profissional renomado com mais de 34 anos de experiência em Medicina. Sua trajetória é marcada por uma dedicação incansável na busca das melhores formas de tratamento para seus pacientes. Especializado em medicina regenerativa, ele se destaca por incorporar terapias inovadoras, como o tratamento com células-tronco.",
    "A história pessoal dele é marcada pela batalha contra uma doença agressiva, o que evidencia não apenas sua resiliência, mas a influência da sua abordagem na prática médica. Essa experiência o impulsionou a oferecer tratamentos avançados, marcados por um cuidado humano e integral, valorizando cada momento da vida.",
    "Membro ativo da Academia Brasileira Antienvelhecimento, da Academia Internacional de Medicina Antienvelhecimento e da Sociedade Francesa de Medicina Estética e Mesoterapia, o Dr. Tércio Rocha se mantém constantemente atualizado sobre as últimas tendências e tecnologias em medicina estética e antienvelhecimento.",
  ],
} as const;

/** Único contato do site, confirmado pelo Dr. Tércio em 23/09/2026. */
export const contact = {
  whatsapp: "5511936195825",
  whatsappLabel: "(11) 93619-5825",
  whatsappMessage:
    "Olá! Vim pelo site e gostaria de informações sobre tratamento com células-tronco.",
} as const;

export function whatsappUrl(message: string = contact.whatsappMessage) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const social = [
  { name: "Instagram", handle: "@dr.terciorocha", url: "https://www.instagram.com/dr.terciorocha/" },
  { name: "YouTube", handle: "@drterciorocha", url: "https://www.youtube.com/@drterciorocha" },
  { name: "LinkedIn", handle: "terciorocha", url: "https://www.linkedin.com/in/terciorocha/" },
  { name: "TikTok", handle: "@drterciorocha", url: "https://www.tiktok.com/@drterciorocha" },
  { name: "Facebook", handle: "Dr. Tércio Rocha", url: "https://www.facebook.com/profile.php?id=100068674238354" },
] as const;

export const sisterSites = [
  { name: "Portal StemCells", url: "https://stemcells.com.br/", description: "Portal de conteúdo sobre medicina regenerativa" },
  { name: "Regenera Brasil", url: "https://regenera-brasil.com/", description: "O congresso de células-tronco do Brasil" },
] as const;

/** Os seis grupos de indicação, com as descrições da página /consulta-dr-tercio-rocha/. */
export const indications = [
  {
    slug: "doencas-autoimunes",
    title: "Doenças Autoimunes",
    short: "Quando o sistema imunológico ataca o próprio corpo.",
    description:
      "Incluem condições como esclerose múltipla, lúpus, artrite reumatoide e doença de Crohn, nas quais o sistema imunológico ataca o próprio corpo.",
    conditions: ["Esclerose múltipla", "Lúpus", "Artrite reumatoide", "Doença de Crohn"],
  },
  {
    slug: "doencas-degenerativas",
    title: "Doenças Degenerativas",
    short: "Quando as células se deterioram gradualmente.",
    description:
      "Tratamento de doenças como osteoartrite, Alzheimer e Parkinson, nas quais as células do corpo se degeneram e deterioram gradualmente.",
    conditions: ["Osteoartrite", "Alzheimer", "Parkinson", "Demência"],
  },
  {
    slug: "lesoes-ortopedicas",
    title: "Lesões Ortopédicas",
    short: "Ossos, músculos e articulações.",
    description:
      "Utilização em casos de lesões no joelho, na coluna, hérnia de disco e outras condições ortopédicas que afetam ossos, músculos e articulações.",
    conditions: ["Lesões de joelho", "Problemas de coluna", "Hérnia de disco", "Artrose", "Condromalácia"],
  },
  {
    slug: "doencas-cardiovasculares",
    title: "Doenças Cardiovasculares",
    short: "Coração e circulação.",
    description:
      "Tratamento de condições como insuficiência cardíaca, doença arterial coronariana e reparação de tecido cardíaco após infartos.",
    conditions: ["Insuficiência cardíaca", "Doença arterial coronariana", "Pós-infarto"],
  },
  {
    slug: "transtornos-hematologicos",
    title: "Transtornos Hematológicos",
    short: "Produção de hemoglobina e células sanguíneas.",
    description:
      "Uso em doenças como anemia falciforme e talassemia, nas quais ocorre deficiência na produção de hemoglobina ou células sanguíneas.",
    conditions: ["Anemia falciforme", "Talassemia"],
  },
  {
    slug: "saude-sexual-masculina",
    title: "Saúde Sexual Masculina",
    short: "Função erétil e regeneração das estruturas penianas.",
    description:
      "Estudos investigam o uso de células-tronco mesenquimais alogênicas para tratar a disfunção erétil, aproveitando sua capacidade de regenerar tecidos e melhorar a circulação sanguínea.",
    conditions: ["Disfunção erétil", "Retonificação peniana", "Andropausa", "Infertilidade masculina"],
  },
] as const;

/** Opções do formulário — as mesmas 18 do site antigo. */
export const treatmentOptions = [
  "Diabetes Mellitus Tipo 2",
  "Demência",
  "Alzheimer",
  "Artrose",
  "Parkinson",
  "Autismo",
  "Anti-Aging",
  "Retonificação peniana",
  "Embelezamento íntimo",
  "Problemas de coluna",
  "Fibromialgia",
  "Síndromes Pós-vacinais",
  "Fibrose pulmonar",
  "Cardiopatias",
  "Nefropatias",
  "Problemas de joelho",
  "Full face",
  "Outros",
] as const;

export const books = [
  {
    slug: "longevi-science",
    title: "Longevi Science: a Bíblia da Longevidade",
    cover: "/img/livro-longevi-science.webp",
    tagline:
      "Como viver mais e melhor? Como alcançar os 100, 120 ou até 150 anos com saúde, disposição e alegria de viver?",
    description:
      "O médico endocrinologista Tércio Rocha apresenta o resultado de décadas de estudos, descobertas e experiências com células-tronco e medicina regenerativa, um campo que une ciência, amor e espiritualidade em busca da plenitude humana. O livro revela o passo a passo da longevidade e reúne o melhor do conhecimento científico mundial sobre regeneração celular, qualidade de vida e envelhecimento saudável.",
    buyUrl:
      "https://loja.literarebooks.com.br/nao-ficcao/longevi-science-a-biblia-da-longevidade",
    featured: true,
  },
  {
    slug: "particulas-divinas",
    title: "Partículas Divinas",
    subtitle: "Uma Trajetória Médica e de Vida Entrelaçadas às Células-tronco",
    cover: "/img/livro-particulas-divinas.jpg",
    tagline:
      "Deus castiga os seus filhos? Ou apenas lhe dá difíceis lições?",
    description:
      "Desde cedo, como testemunha dos meus avós e bisavós, percebi que a dificuldade era o melhor presente que Deus poderia mandar a um indivíduo. Aprende quem tem a coragem de recusar o papel de vítima das circunstâncias e assume a posição de um guerreiro, construtor de si mesmo.",
    buyUrl: "https://loja.literarebooks.com.br/autoajuda/particulas-divinas",
    featured: false,
  },
  {
    slug: "vida-na-veia",
    title: "Vida na Veia! Regenere-se Já!",
    cover: "/img/livro-vida-na-veia.jpg",
    tagline:
      "Histórias reais de cura e transformação proporcionadas pela medicina regenerativa.",
    description:
      "Muitos que procuram a medicina regenerativa enxergam nas células-tronco uma última esperança, uma luz no fim do túnel. Contudo, logo no início do tratamento, descobrem que essa luz não marca um final, mas sim o início de um novo capítulo, iluminando um caminho de renovação, com vitalidade e desejo de viver.",
    buyUrl: "https://loja.literarebooks.com.br/nao-ficcao/vida-na-veia",
    featured: false,
  },
] as const;

export const ebook = {
  title: "Longevidade: como regenerar o corpo e a mente para uma vida saudável e plena",
  cover: "/img/ebook-longevidade.webp",
  tagline: "O envelhecimento não precisa ser sinônimo de perda, dor e dependência.",
  description:
    "O verdadeiro desafio não é viver mais, mas viver melhor. A longevidade plena parte da regeneração do corpo e da mente, restaurando energia, clareza e funcionalidade ao longo dos anos. Com base na ciência da medicina regenerativa e no potencial das células-tronco, este material apresenta uma nova forma de encarar a saúde: não como correção de sintomas, mas como otimização da biologia.",
  bullets: [
    "Por que o corpo envelhece — e o que a biologia já sabe sobre reverter parte disso",
    "Como reativar o sistema natural de reparo do organismo",
    "Os pilares práticos para preparar o corpo para uma vida mais longa e ativa",
    "Como medir o envelhecimento biológico, que é diferente da idade do documento",
  ],
} as const;

/**
 * Perguntas frequentes — base do FAQPage (schema.org) e da camada AEO.
 * Respostas escritas a partir do conteúdo do próprio site, sem promessa de resultado.
 */
export const faqs = [
  {
    q: "Quem é o Dr. Tércio Rocha?",
    a: "Médico endocrinologista com mais de 34 anos de prática clínica e protocolos de longevidade desde 1990. É pioneiro em medicina regenerativa no Brasil, fundador da Sociedade Brasileira de Medicina Estética e membro da Academia Brasileira Antienvelhecimento, da Academia Internacional de Medicina Antienvelhecimento e da Sociedade Francesa de Medicina Estética e Mesoterapia. Atende com registro nos CRM SP 148068, CRM RJ 525847 e CRM SC 30974.",
  },
  {
    q: "O que são células-tronco mesenquimais alogênicas?",
    a: "São células-tronco obtidas de doador, e não do próprio paciente. Por isso são amplamente aplicáveis independentemente da idade de quem recebe — um ponto relevante, porque a qualidade das células do próprio organismo tende a cair com o tempo.",
  },
  {
    q: "Quais condições são acompanhadas com medicina regenerativa no consultório?",
    a: "As principais áreas de indicação são doenças autoimunes (esclerose múltipla, lúpus, artrite reumatoide, doença de Crohn), doenças degenerativas (osteoartrite, Alzheimer, Parkinson), lesões ortopédicas (joelho, coluna, hérnia de disco), doenças cardiovasculares (insuficiência cardíaca, doença arterial coronariana, pós-infarto), transtornos hematológicos (anemia falciforme, talassemia) e saúde sexual masculina. Câncer sólido não é tratado.",
  },
  {
    q: "Como funciona a primeira consulta?",
    a: "A primeira etapa é entender o caso. Você envia seus dados pelo formulário do site ou pelo WhatsApp, a equipe faz uma triagem inicial e agenda a avaliação com o Dr. Tércio. Não existe protocolo único: a conduta é definida caso a caso, depois de avaliar histórico, exames e objetivos do paciente.",
  },
  {
    q: "O tratamento com células-tronco é cirúrgico?",
    a: "Não. A aplicação é feita em ambiente ambulatorial, sem os riscos e o tempo de recuperação de um procedimento cirúrgico. O caso da paciente com bacia fraturada tratada sem cirurgia, relatado nos artigos do site, é um exemplo dessa abordagem.",
  },
  {
    q: "Qual a diferença entre idade cronológica e idade biológica?",
    a: "A idade cronológica é a do documento. A idade biológica reflete o estado real das suas células e pode ser estimada por exames de metilação do DNA e genoma completo. É esse segundo número que a medicina de longevidade busca melhorar.",
  },
  {
    q: "O Dr. Tércio Rocha atende em quais cidades?",
    a: "O Dr. Tércio possui registro profissional em São Paulo, Rio de Janeiro e Santa Catarina. Para confirmar as datas e o local de atendimento mais próximo de você, fale com a equipe pelo WhatsApp.",
  },
  {
    q: "Quanto custa o tratamento com células-tronco?",
    a: "O valor depende do protocolo indicado para o seu caso, que só é definido após a avaliação médica. A equipe apresenta as condições durante o atendimento, antes de qualquer decisão.",
  },
] as const;

export const disclaimer =
  "Conteúdo de caráter informativo, sem finalidade de substituir a consulta médica. Resultados variam conforme o caso, o diagnóstico e as condições clínicas de cada paciente. Nenhum tratamento é indicado sem avaliação médica individual. Responsável técnico: Dr. Tércio Rocha — CRM SP 148068.";
