/**
 * Fonte única de verdade do site. Todo dado veio da varredura do site antigo
 * (ver conteudo-original/AUDITORIA.md) ou da copy revisada com o marketing em
 * 30/09/2026 — nada aqui é inventado. Respostas clínicas que ainda dependem do
 * Dr. Tércio ficam fora até serem validadas.
 */

/** Pixel da Meta da clínica (Gerenciador de Eventos). Não é segredo: aparece no código de toda página. */
export const META_PIXEL_ID = "621141566738202";

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
  /** Versão curta, usada na home. */
  summary:
    "Médico endocrinologista com mais de 34 anos de experiência clínica e de pesquisa, o Dr. Tércio Rocha atua com medicina regenerativa e protocolos de longevidade desde 1990. Sua história pessoal com uma doença agressiva moldou a forma como enxerga cada paciente: como um organismo com capacidade de regeneração, que precisa das ferramentas certas para se reconstruir.",
  bio: [
    "Médico endocrinologista com mais de 34 anos de experiência clínica e de pesquisa, o Dr. Tércio Rocha atua com medicina regenerativa e protocolos de longevidade desde 1990. Hoje atende na Clínica Tércio Rocha, com registro ativo em São Paulo, Rio de Janeiro e Santa Catarina.",
    "Sua história pessoal com uma doença agressiva moldou não apenas a resiliência, mas a forma como enxerga cada paciente: como um organismo com capacidade de regeneração, que precisa das ferramentas certas para se reconstruir.",
    "Membro da Academia Brasileira Antienvelhecimento, da Academia Internacional de Medicina Antienvelhecimento e da Sociedade Francesa de Medicina Estética e Mesoterapia, e fundador da Sociedade Brasileira de Medicina Estética, mantém atuação constante na pesquisa e no ensino médico. É autor de quatro livros e criador do Regenera Brasil. Combina décadas de prática clínica com um compromisso permanente com a ciência de vanguarda.",
  ],
} as const;

/** Único contato do site: o número oficial do WhatsApp da clínica na API da Meta (19/10/2026, Salvy), que cai no painel.
    Antes era o (11) 93619-5825, atendido no celular. */
export const contact = {
  whatsapp: "5511936248783",
  whatsappLabel: "(11) 93624-8783",
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

/** Texto da copy do marketing, sem o superlativo "maior das Américas". */
export const regenera = {
  text: "Criado e presidido pelo Dr. Tércio Rocha, o Regenera Brasil reúne especialistas de diferentes áreas para discutir evidências científicas, protocolos e aplicações clínicas da medicina regenerativa. Não é um congresso de tendências: cada palestra parte de protocolos que já estão sendo aplicados na prática, com rigor científico e honestidade sobre o que a evidência atual suporta.",
  url: "https://regenera-brasil.com/",
  /* Desdobramento do próprio texto acima, sem número nem superlativo. */
  pillars: [
    {
      title: "Evidência científica",
      text: "Especialistas de diferentes áreas discutem o que a ciência já sustenta.",
    },
    {
      title: "Protocolos aplicados na prática",
      text: "Cada palestra parte de protocolos que já estão em uso na clínica.",
    },
    {
      title: "Honestidade sobre a evidência",
      text: "Clareza sobre o que a evidência atual suporta, e sobre o que ainda não.",
    },
  ],
} as const;

export type Faq = { q: string; a: string };

/**
 * Perguntas frequentes — base do FAQPage (schema.org) e da camada AEO.
 * Cada resposta responde na primeira frase e faz sentido lida fora do site.
 */
export const faqById = {
  medicina: {
    q: "O que é medicina regenerativa?",
    a: "Medicina regenerativa é a área da medicina que busca restaurar a função de tecidos e órgãos estimulando os mecanismos de reparo do próprio corpo, por exemplo com células-tronco. O Dr. Tércio Rocha usa a medicina regenerativa em doenças autoimunes, degenerativas, ortopédicas, cardiovasculares e hematológicas, na saúde sexual masculina, no autismo, na fibromialgia, no diabetes tipo 2, na longevidade e na estética regenerativa.",
  },
  alogenicas: {
    q: "O que são células-tronco mesenquimais alogênicas?",
    a: "São células-tronco obtidas de um doador, e não do próprio paciente. Por isso podem ser usadas independentemente da idade de quem recebe, o que é relevante porque a qualidade das células do próprio organismo tende a cair com o tempo.",
  },
  doencas: {
    q: "Quais doenças podem ser tratadas com células-tronco?",
    a: "As principais áreas atendidas pelo Dr. Tércio Rocha são doenças autoimunes (esclerose múltipla, lúpus, artrite reumatoide, doença de Crohn), doenças degenerativas (Alzheimer, Parkinson, osteoartrite), lesões ortopédicas (joelho, coluna, hérnia de disco), doenças cardiovasculares, transtornos hematológicos (anemia falciforme, talassemia), saúde sexual masculina, autismo e paralisia cerebral, fibromialgia, diabetes tipo 2, longevidade e anti-aging e estética regenerativa (full face, embelezamento íntimo). Síndromes pós-vacinais, fibrose pulmonar e nefropatias também são avaliadas. Câncer sólido não é tratado. A indicação de cada caso só é definida em avaliação médica.",
  },
  cirurgico: {
    q: "O tratamento com células-tronco é cirúrgico?",
    a: "Não. A aplicação de células-tronco é feita em ambiente ambulatorial, sem os riscos e o tempo de recuperação de uma cirurgia. O caso de uma paciente com a bacia fraturada tratada sem cirurgia, contado nos artigos do site, é um exemplo.",
  },
  idade: {
    q: "Existe limite de idade para o tratamento com células-tronco?",
    a: "As células-tronco usadas pelo Dr. Tércio Rocha são mesenquimais alogênicas, vindas de doador, e por isso podem ser aplicadas independentemente da idade de quem recebe. A indicação de cada caso é definida em avaliação médica.",
  },
  biologica: {
    q: "Qual a diferença entre idade biológica e idade cronológica?",
    a: "A idade cronológica é a do documento. A idade biológica mostra o estado real das células e pode ser estimada por exames de metilação do DNA e de genoma completo. É esse segundo número que a medicina de longevidade busca melhorar.",
  },
  quem: {
    q: "Quem é o Dr. Tércio Rocha?",
    a: "O Dr. Tércio Rocha é médico endocrinologista, com mais de 34 anos de prática clínica e protocolos de longevidade desde 1990. É fundador da Sociedade Brasileira de Medicina Estética, autor de quatro livros e criador do congresso Regenera Brasil. Tem registro nos CRM SP 148068, CRM RJ 525847 e CRM SC 30974.",
  },
  onde: {
    q: "Onde o Dr. Tércio Rocha atende?",
    a: `O Dr. Tércio Rocha tem registro ativo em São Paulo (CRM SP 148068), Rio de Janeiro (CRM RJ 525847) e Santa Catarina (CRM SC 30974) e atende presencialmente na Clínica Tércio Rocha, no Jardim América, em São Paulo, ou on-line, por videochamada. O agendamento é feito pelo WhatsApp ${contact.whatsappLabel}.`,
  },
  agendar: {
    q: "Como agendar uma consulta com o Dr. Tércio Rocha?",
    a: `Pelo formulário do site ou pelo WhatsApp ${contact.whatsappLabel}. A equipe da Clínica Tércio Rocha faz uma triagem do caso e agenda a avaliação com o Dr. Tércio. O envio não gera cobrança nem compromisso.`,
  },
  primeira: {
    q: "Como funciona a primeira consulta?",
    a: "A primeira etapa é entender o caso. Você envia seus dados pelo formulário do site ou pelo WhatsApp, a equipe faz uma triagem inicial e agenda a avaliação com o Dr. Tércio Rocha. Não existe protocolo único: a conduta é definida depois de avaliar histórico, exames e objetivos do paciente.",
  },
  custo: {
    q: "Quanto custa o tratamento com células-tronco?",
    a: "O valor do tratamento com células-tronco depende do protocolo indicado para cada caso, que só é definido depois da avaliação médica. A equipe apresenta as condições antes de qualquer decisão.",
  },
  /* --- Perguntas de cada área (25/out/2026, GEO/AEO): a pergunta como o paciente escreve no Google ou numa IA,
     a resposta na primeira frase e com o nome do médico, para fazer sentido citada fora do site. Os fatos vêm das
     respostas que a equipe da clínica manda aos pacientes; nada de valor, prazo de resultado ou promessa. --- */
  autoimunesCura: {
    q: "Células-tronco curam doenças autoimunes?",
    a: "Não. No tratamento de doenças autoimunes com células-tronco conduzido pelo Dr. Tércio Rocha, o objetivo não é a cura, e sim modular o sistema imunológico para reduzir a inflamação e melhorar a qualidade de vida. As células-tronco mesenquimais são estudadas justamente por essa capacidade imunomoduladora.",
  },
  autoimunesQuais: {
    q: "Quais doenças autoimunes podem ser tratadas com células-tronco?",
    a: "O Dr. Tércio Rocha avalia o tratamento com células-tronco em esclerose múltipla, lúpus, artrite reumatoide e doença de Crohn, entre outras doenças em que o sistema imunológico ataca o próprio corpo. A indicação de cada caso é definida em consulta, a partir do histórico e dos exames.",
  },
  complementar: {
    q: "O tratamento com células-tronco substitui os remédios que eu já tomo?",
    a: "Não. O tratamento com células-tronco é um complemento ao acompanhamento que o paciente já faz, e nenhum remédio deve ser suspenso por conta própria. Qualquer mudança na medicação é decidida com o médico que acompanha o caso.",
  },
  alzheimer: {
    q: "Células-tronco ajudam no Alzheimer e na demência?",
    a: "No Alzheimer e na demência, o Dr. Tércio Rocha usa as células-tronco para apoiar a modulação da inflamação e o funcionamento neurológico, o que pode contribuir para memória, humor, sono e orientação. O tratamento faz parte de um cuidado completo, que inclui alimentação e saúde intestinal, e não promete cura.",
  },
  parkinson: {
    q: "Como é o tratamento de Parkinson com células-tronco?",
    a: "No Parkinson, o protocolo do Dr. Tércio Rocha costuma ter cerca de 3 sessões, com aplicações intratecal e endovenosa, definidas em consulta. O objetivo não é a cura: é ajudar no controle dos sintomas, como os tremores, na mobilidade e na autonomia, e retardar a progressão da doença.",
  },
  fase: {
    q: "Existe uma fase certa da doença para começar o tratamento com células-tronco?",
    a: "Em doenças degenerativas, começar mais cedo costuma estar associado a melhores possibilidades de resposta. Mesmo assim, o tratamento com células-tronco pode ser indicado em diferentes fases da doença: quem decide é o Dr. Tércio Rocha, na avaliação do caso.",
  },
  artrose: {
    q: "Células-tronco ajudam na artrose do joelho?",
    a: "Sim, a artrose está entre as indicações do Dr. Tércio Rocha. O tratamento com células-tronco busca apoiar a recuperação da cartilagem, da cápsula articular e dos ligamentos, melhorando a mobilidade, a amplitude de movimento e o conforto da articulação, sem cirurgia. A técnica é escolhida caso a caso.",
  },
  coluna: {
    q: "Hérnia de disco e dor na coluna têm tratamento com células-tronco?",
    a: "Sim. Na coluna, o tratamento com células-tronco do Dr. Tércio Rocha é voltado à dor crônica ligada ao desgaste dos discos, como a hérnia de disco. As células liberam substâncias que reduzem a inflamação local e apoiam o tecido do disco, com o objetivo de diminuir a dor e melhorar a mobilidade.",
  },
  infarto: {
    q: "Células-tronco ajudam depois de um infarto?",
    a: "A medicina regenerativa estuda as células-tronco para apoiar a reparação do coração depois de um infarto e a função cardíaca na insuficiência cardíaca. No consultório do Dr. Tércio Rocha, esse tratamento é sempre um complemento ao acompanhamento com o cardiologista, nunca um substituto.",
  },
  sangue: {
    q: "Anemia falciforme e talassemia podem ser tratadas com células-tronco?",
    a: "A anemia falciforme e a talassemia estão entre os transtornos do sangue avaliados pelo Dr. Tércio Rocha. Nesses casos, a terapia regenerativa busca ajudar no equilíbrio e no funcionamento do sistema que produz as células do sangue, respeitando as particularidades de cada paciente.",
  },
  disfuncao: {
    q: "Como funciona o tratamento da disfunção erétil com células-tronco?",
    a: "O protocolo do Dr. Tércio Rocha para a disfunção erétil busca regenerar as estruturas do pênis envolvidas na ereção, como a irrigação sanguínea e os corpos cavernosos. Ele é feito em 3 aplicações, com intervalo de 30 dias entre elas, e a indicação é confirmada em consulta.",
  },
  sexualOutras: {
    q: "Andropausa e infertilidade masculina são avaliadas?",
    a: "Sim. Além da disfunção erétil, o Dr. Tércio Rocha avalia a andropausa, a infertilidade masculina e a retonificação peniana. A conduta de cada caso é definida em consulta, a partir dos exames e do histórico do paciente.",
  },
  antiaging: {
    q: "Qual a diferença entre anti-aging e longevidade?",
    a: "O anti-aging previne os efeitos do envelhecimento, com foco em saúde, vitalidade e estética. A longevidade busca preservar ou recuperar as funções do organismo com a idade, sobretudo em pacientes mais velhos. Os dois protocolos podem ser associados, conforme a indicação do Dr. Tércio Rocha.",
  },
  inflammaging: {
    q: "Como as células-tronco agem no envelhecimento?",
    a: "Com a idade, o corpo mantém uma inflamação crônica de baixo grau, chamada inflammaging. As células-tronco usadas pelo Dr. Tércio Rocha ajudam a modular o sistema imunológico e a reduzir essa inflamação, e liberam substâncias que estimulam as células do próprio corpo a se repararem.",
  },
  fullFace: {
    q: "O que é o full face com células-tronco?",
    a: "Full face é o protocolo de estética regenerativa do Dr. Tércio Rocha para rosto, colo e pescoço. Ele estimula as células que produzem colágeno e fibras elásticas, melhorando firmeza, elasticidade, textura e viço da pele. O resultado aparece de forma gradual e natural, sem a proposta de dar volume.",
  },
  nanofat: {
    q: "O que é NanoFat?",
    a: "NanoFat é um procedimento regenerativo que usa a gordura do próprio paciente, emulsificada e filtrada. O objetivo não é dar volume, e sim melhorar a qualidade da pele: textura, firmeza, hidratação e luminosidade, além de suavizar linhas finas e cicatrizes. O Dr. Tércio Rocha pode associá-lo ao full face.",
  },
  intimo: {
    q: "Como funciona o embelezamento íntimo regenerativo?",
    a: "O embelezamento íntimo do Dr. Tércio Rocha usa a estética regenerativa para melhorar a qualidade dos tecidos da região íntima, estimulando colágeno e fibras elásticas para mais firmeza e elasticidade. O protocolo é individual e definido depois da avaliação clínica.",
  },
  autismo: {
    q: "Células-tronco ajudam no autismo?",
    a: "No Transtorno do Espectro Autista (TEA), o tratamento com células-tronco do Dr. Tércio Rocha é complementar às terapias que o paciente já faz. O objetivo é apoiar o desenvolvimento, com foco em cognição, comportamento, sono e comunicação. A resposta varia muito entre pacientes e não há resultado padronizado.",
  },
  autismoSessoes: {
    q: "Quantas sessões tem o tratamento do autismo com células-tronco?",
    a: "Em geral, o protocolo do Dr. Tércio Rocha para o autismo tem de 3 a 4 sessões. Ele pode ser acompanhado de suporte metabólico, nutricional e intestinal, e o número exato é definido depois da avaliação clínica detalhada.",
  },
  paralisia: {
    q: "Paralisia cerebral pode ser tratada com células-tronco? Existe idade?",
    a: "A terapia regenerativa na paralisia cerebral pode ser feita em diferentes faixas etárias. Com o Dr. Tércio Rocha, ela é complementar e busca apoiar os mecanismos de reparo do sistema nervoso e a recuperação funcional. Os resultados dependem da idade, do grau de acometimento e da resposta de cada paciente.",
  },
  fibromialgia: {
    q: "Fibromialgia tem tratamento com células-tronco?",
    a: "Sim, a fibromialgia está entre as condições avaliadas pelo Dr. Tércio Rocha. As células-tronco liberam substâncias anti-inflamatórias que podem equilibrar a inflamação crônica e reduzir a hipersensibilidade à dor, com o objetivo de melhorar a dor, o bem-estar e a qualidade de vida aos poucos.",
  },
  sensibilizacao: {
    q: "O que é sensibilização central na fibromialgia?",
    a: "Sensibilização central é a forma como o sistema nervoso passa a amplificar os estímulos de dor, comum na fibromialgia. O tratamento com células-tronco conduzido pelo Dr. Tércio Rocha busca modular esse processo, ajudando o organismo a reduzir a hipersensibilidade à dor ao longo do tempo.",
  },
  diabetes2: {
    q: "Células-tronco ajudam no diabetes tipo 2?",
    a: "No diabetes tipo 2, o tratamento com células-tronco do Dr. Tércio Rocha é focado na modulação do sistema imunológico e na regeneração de tecidos, o que pode aumentar a sensibilidade à insulina e melhorar o controle da glicose. Ele não substitui o acompanhamento e os remédios do diabetes.",
  },
  diabetes1: {
    q: "Diabetes tipo 1 pode ser tratado com células-tronco no Brasil?",
    a: "O diabetes tipo 1 não é tratado na Clínica Tércio Rocha. O protocolo com células-tronco para ele é invasivo, feito em centro cirúrgico, e hoje só está disponível nos Estados Unidos. O tratamento oferecido na clínica é para o diabetes tipo 2.",
  },
  posVacinal: {
    q: "Síndrome pós-vacinal, fibrose pulmonar e nefropatias são avaliadas?",
    a: "Sim. O Dr. Tércio Rocha avalia em consulta as síndromes pós-vacinais, a fibrose pulmonar e as nefropatias (doenças dos rins). A medicina regenerativa busca melhorar a qualidade de vida, reduzir sintomas e retardar a progressão da doença, sem promessa de cura.",
  },
  foraDaLista: {
    q: "Minha doença não aparece no site. Posso pedir uma avaliação?",
    a: `Sim. No formulário do site, escolha "Outros" e descreva o seu caso, ou escreva para a equipe da Clínica Tércio Rocha pelo WhatsApp ${contact.whatsappLabel}. A equipe explica se a condição tem indicação para uma avaliação com o Dr. Tércio Rocha. Câncer sólido não é tratado.`,
  },
} as const satisfies Record<string, Faq>;

export type FaqId = keyof typeof faqById;

export function pickFaqs(ids: readonly FaqId[]): Faq[] {
  return ids.map((id) => faqById[id]);
}

/** Página /perguntas-frequentes, agrupada por assunto. */
export const faqGroups = [
  {
    title: "Sobre medicina regenerativa e células-tronco",
    ids: ["medicina", "alogenicas", "doencas", "cirurgico", "idade", "biologica"],
  },
  {
    title: "Sobre cada tratamento",
    ids: ["autoimunesCura", "autoimunesQuais", "complementar", "alzheimer", "parkinson", "fase", "artrose", "coluna", "infarto", "sangue", "disfuncao", "sexualOutras", "antiaging", "inflammaging", "fullFace", "nanofat", "intimo", "autismo", "autismoSessoes", "paralisia", "fibromialgia", "sensibilizacao", "diabetes2", "diabetes1", "posVacinal", "foraDaLista"],
  },
  { title: "Sobre o Dr. Tércio Rocha", ids: ["quem", "onde"] },
  { title: "Sobre a consulta", ids: ["agendar", "primeira", "custo"] },
] as const satisfies readonly { title: string; ids: readonly FaqId[] }[];

/** Todas as perguntas, na ordem da página de FAQ (llms.txt e schema). */
export const faqs: Faq[] = pickFaqs(faqGroups.flatMap((g) => g.ids));

export const homeFaqIds = ["doencas", "cirurgico", "quem", "onde", "agendar", "custo"] as const;
export const consultaFaqIds = ["agendar", "primeira", "custo", "onde"] as const;

/**
 * As áreas de indicação (seis até 25/out/2026; as outras seis cobrem as opções do formulário que não tinham página). `description` e `conditions` vêm da página
 * /consulta-dr-tercio-rocha/ do site antigo; o resto é a copy revisada.
 */
export const indications = [
  {
    slug: "doencas-autoimunes",
    title: "Doenças Autoimunes",
    name: "doenças autoimunes",
    short: "Quando o sistema imunológico ataca o próprio corpo.",
    description:
      "Incluem condições como esclerose múltipla, lúpus, artrite reumatoide e doença de Crohn, nas quais o sistema imunológico ataca o próprio corpo.",
    conditions: ["Esclerose múltipla", "Lúpus", "Artrite reumatoide", "Doença de Crohn"],
    seoTitle: "Doenças autoimunes e células-tronco",
    metaDescription:
      "Esclerose múltipla, lúpus, artrite reumatoide e doença de Crohn: como o Dr. Tércio Rocha avalia o tratamento com células-tronco.",
    h1: "Tratamento de doenças autoimunes com células-tronco",
    intro:
      "Doenças autoimunes são condições em que o sistema imunológico ataca o próprio corpo, como esclerose múltipla, lúpus, artrite reumatoide e doença de Crohn. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco é indicado.",
    conditionsHeading: "Quais doenças autoimunes são avaliadas",
    howHeading: "Como as células-tronco atuam nas doenças autoimunes",
    howText:
      "As células-tronco mesenquimais são estudadas pela capacidade de modular a resposta do sistema imunológico e de apoiar a regeneração dos tecidos afetados pela inflamação.",
    faqIds: ["autoimunesCura", "autoimunesQuais", "complementar"],
  },
  {
    slug: "doencas-degenerativas",
    title: "Doenças Degenerativas",
    name: "doenças degenerativas",
    short: "Quando as células se deterioram aos poucos.",
    description:
      "Tratamento de doenças como osteoartrite, Alzheimer e Parkinson, nas quais as células do corpo se degeneram e deterioram gradualmente.",
    conditions: ["Alzheimer", "Parkinson", "Demência", "Osteoartrite"],
    seoTitle: "Doenças degenerativas e células-tronco",
    metaDescription:
      "Alzheimer, Parkinson, demência e osteoartrite: como o Dr. Tércio Rocha avalia o tratamento com células-tronco para doenças degenerativas.",
    h1: "Tratamento de doenças degenerativas com células-tronco",
    intro:
      "Doenças degenerativas são aquelas em que as células do corpo se deterioram aos poucos, como Alzheimer, Parkinson, demência e osteoartrite. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco é indicado.",
    conditionsHeading: "Quais doenças degenerativas são avaliadas",
    howHeading: "Como as células-tronco atuam nas doenças degenerativas",
    howText:
      "A medicina regenerativa estuda o uso de células-tronco para proteger e apoiar a recuperação de tecidos em degeneração.",
    faqIds: ["alzheimer", "parkinson", "fase", "idade"],
  },
  {
    slug: "lesoes-ortopedicas",
    title: "Lesões Ortopédicas",
    name: "lesões ortopédicas",
    short: "Ossos, músculos e articulações.",
    description:
      "Utilização em casos de lesões no joelho, na coluna, hérnia de disco e outras condições ortopédicas que afetam ossos, músculos e articulações.",
    conditions: ["Lesões de joelho", "Problemas de coluna", "Hérnia de disco", "Artrose", "Condromalácia"],
    seoTitle: "Lesões ortopédicas e células-tronco",
    metaDescription:
      "Joelho, coluna, hérnia de disco, artrose e condromalácia: como o Dr. Tércio Rocha avalia o tratamento com células-tronco, sem cirurgia.",
    h1: "Tratamento de lesões ortopédicas com células-tronco",
    intro:
      "Lesões ortopédicas afetam ossos, músculos e articulações, como lesões no joelho, problemas de coluna, hérnia de disco, artrose e condromalácia. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco, feito sem cirurgia, é indicado.",
    conditionsHeading: "Quais lesões ortopédicas são avaliadas",
    howHeading: "Como as células-tronco atuam nas lesões ortopédicas",
    howText:
      "As células-tronco são estudadas pela capacidade de apoiar a regeneração de cartilagem, tendões e outros tecidos das articulações.",
    faqIds: ["artrose", "coluna"],
  },
  {
    slug: "doencas-cardiovasculares",
    title: "Doenças Cardiovasculares",
    name: "doenças cardiovasculares",
    short: "Coração e circulação.",
    description:
      "Tratamento de condições como insuficiência cardíaca, doença arterial coronariana e reparação de tecido cardíaco após infartos.",
    conditions: ["Insuficiência cardíaca", "Doença arterial coronariana", "Recuperação após infarto"],
    seoTitle: "Doenças cardiovasculares e células-tronco",
    metaDescription:
      "Insuficiência cardíaca, doença arterial coronariana e recuperação após infarto: como o Dr. Tércio Rocha avalia o tratamento com células-tronco.",
    h1: "Tratamento de doenças cardiovasculares com células-tronco",
    intro:
      "Doenças cardiovasculares afetam o coração e a circulação, como a insuficiência cardíaca, a doença arterial coronariana e as sequelas de um infarto. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco é indicado.",
    conditionsHeading: "Quais doenças cardiovasculares são avaliadas",
    howHeading: "Como as células-tronco atuam no coração",
    howText:
      "A medicina regenerativa estuda o uso de células-tronco na reparação do tecido do coração após um infarto e na melhora da função cardíaca.",
    faqIds: ["infarto", "complementar"],
  },
  {
    slug: "transtornos-hematologicos",
    title: "Transtornos Hematológicos",
    name: "transtornos hematológicos",
    short: "Produção de hemoglobina e células do sangue.",
    description:
      "Uso em doenças como anemia falciforme e talassemia, nas quais ocorre deficiência na produção de hemoglobina ou células sanguíneas.",
    conditions: ["Anemia falciforme", "Talassemia"],
    seoTitle: "Anemia falciforme e células-tronco",
    metaDescription:
      "Anemia falciforme e talassemia: como o Dr. Tércio Rocha avalia o tratamento com células-tronco para transtornos do sangue.",
    h1: "Tratamento de transtornos hematológicos com células-tronco",
    intro:
      "Transtornos hematológicos são doenças em que o corpo produz pouca hemoglobina ou poucas células do sangue, como a anemia falciforme e a talassemia. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco é indicado.",
    conditionsHeading: "Quais transtornos hematológicos são avaliados",
    /* Texto de atuação pendente de validação do Dr. Tércio. */
    howHeading: "",
    howText: "",
    faqIds: ["sangue", "complementar"],
  },
  {
    slug: "saude-sexual-masculina",
    title: "Disfunção Erétil e Saúde Sexual Masculina",
    name: "disfunção erétil e saúde sexual masculina",
    short: "Função erétil e regeneração dos tecidos.",
    description:
      "Estudos investigam o uso de células-tronco mesenquimais alogênicas para tratar a disfunção erétil, aproveitando sua capacidade de regenerar tecidos e melhorar a circulação sanguínea.",
    conditions: ["Disfunção erétil", "Retonificação peniana", "Andropausa", "Infertilidade masculina"],
    seoTitle: "Disfunção erétil e células-tronco",
    metaDescription:
      "Disfunção erétil, retonificação peniana, andropausa e infertilidade masculina: tratamento com células-tronco avaliado pelo Dr. Tércio Rocha.",
    h1: "Disfunção erétil e saúde sexual masculina: tratamento com células-tronco",
    intro:
      "A disfunção erétil, a andropausa e a infertilidade masculina estão entre as queixas de saúde sexual masculina avaliadas pelo Dr. Tércio Rocha. Estudos investigam o uso de células-tronco mesenquimais alogênicas para tratar a disfunção erétil, aproveitando sua capacidade de regenerar tecidos e melhorar a circulação.",
    conditionsHeading: "Quais condições de saúde sexual masculina são avaliadas",
    /* Texto de atuação pendente de validação do Dr. Tércio. */
    howHeading: "",
    howText: "",
    faqIds: ["disfuncao", "sexualOutras"],
  },
  /* --- Áreas acrescentadas em 25/out/2026: cada opção do formulário tem a sua página. Textos a partir das
     respostas que a equipe da clínica manda aos pacientes (respostas rápidas do painel), sem as promessas. --- */
  {
    slug: "longevidade-e-anti-aging",
    title: "Longevidade e Anti-aging",
    name: "longevidade e anti-aging",
    short: "Prevenir o envelhecimento e preservar as funções do corpo.",
    description:
      "Protocolos para prevenir os efeitos do envelhecimento (anti-aging) e para preservar ou recuperar as funções do organismo ao longo dos anos (longevidade).",
    conditions: ["Anti-aging", "Longevidade", "Fragilidade do envelhecimento"],
    seoTitle: "Longevidade, anti-aging e células-tronco",
    metaDescription:
      "Anti-aging e longevidade: como o Dr. Tércio Rocha usa as células-tronco para prevenir os efeitos do envelhecimento e preservar as funções do organismo.",
    h1: "Longevidade e anti-aging com células-tronco",
    intro:
      "Anti-aging e longevidade são protocolos diferentes, que podem ser associados. O anti-aging previne os efeitos do envelhecimento, com foco em saúde, vitalidade e estética. A longevidade busca preservar ou recuperar as funções do organismo ao longo dos anos, sobretudo em pacientes de idade mais avançada. O Dr. Tércio Rocha define em consulta qual é o indicado para cada caso.",
    conditionsHeading: "O que é avaliado em longevidade e anti-aging",
    howHeading: "Como as células-tronco atuam no envelhecimento",
    howText:
      "Com a idade, o corpo mantém uma inflamação crônica de baixo grau. As células-tronco ajudam a modular o sistema imunológico e a reduzir essa inflamação, e liberam substâncias que estimulam as células do próprio corpo a se repararem — com efeito sobre a energia das células e a limpeza das células envelhecidas.",
    faqIds: ["antiaging", "inflammaging", "biologica", "idade"],
    interesse: "Anti-Aging",
  },
  {
    slug: "estetica-regenerativa",
    title: "Estética Regenerativa",
    name: "estética regenerativa",
    short: "Firmeza, elasticidade e viço da pele.",
    description:
      "Protocolos para o rosto, o corpo e a região íntima que estimulam a produção de colágeno e melhoram a firmeza, a elasticidade e a textura da pele.",
    conditions: ["Full face", "Embelezamento íntimo", "Flacidez", "Textura e viço da pele"],
    seoTitle: "Estética regenerativa: full face e embelezamento íntimo",
    metaDescription:
      "Full face, embelezamento íntimo e flacidez: como o Dr. Tércio Rocha usa a estética regenerativa para melhorar a firmeza e a textura da pele.",
    h1: "Estética regenerativa: full face, embelezamento íntimo e flacidez",
    intro:
      "A estética regenerativa usa os mecanismos do próprio organismo para melhorar a qualidade dos tecidos: no rosto, no colo e no pescoço (full face), na região íntima e nas áreas com flacidez. O Dr. Tércio Rocha avalia cada caso para definir o protocolo.",
    conditionsHeading: "O que é tratado na estética regenerativa",
    howHeading: "Como a estética regenerativa atua na pele",
    howText:
      "O tratamento estimula os fibroblastos, as células que produzem colágeno e fibras elásticas, o que melhora a firmeza, a elasticidade, a textura e o viço da pele de forma gradual e natural. Em alguns casos é associado ao NanoFat, que usa a gordura do próprio paciente para melhorar a qualidade da pele — o objetivo não é dar volume.",
    faqIds: ["fullFace", "nanofat", "intimo"],
    interesse: "Full face",
    fatos: ["Aplicação ambulatorial", "Resultado gradual e natural", "Avaliação individual"],
  },
  {
    slug: "autismo-e-neurodesenvolvimento",
    title: "Autismo e Neurodesenvolvimento",
    name: "autismo e neurodesenvolvimento",
    short: "Desenvolvimento, comportamento, sono e comunicação.",
    description:
      "Abordagem regenerativa e integrativa, complementar às terapias que o paciente já faz, para o Transtorno do Espectro Autista e a paralisia cerebral.",
    conditions: ["Autismo (TEA)", "Paralisia cerebral"],
    seoTitle: "Autismo (TEA) e células-tronco",
    metaDescription:
      "Autismo (TEA) e paralisia cerebral: como o Dr. Tércio Rocha avalia o tratamento com células-tronco, complementar às terapias do paciente.",
    h1: "Autismo e neurodesenvolvimento: tratamento com células-tronco",
    intro:
      "No Transtorno do Espectro Autista (TEA) e na paralisia cerebral, o tratamento com células-tronco é complementar: soma-se às terapias que o paciente já faz, com o objetivo de apoiar o desenvolvimento e a qualidade de vida dele e da família. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento é indicado.",
    conditionsHeading: "Quais condições do neurodesenvolvimento são avaliadas",
    howHeading: "Como as células-tronco atuam no neurodesenvolvimento",
    howText:
      "As células-tronco ajudam a controlar a inflamação do sistema nervoso e liberam substâncias que apoiam os neurônios e as conexões entre eles. No autismo, o foco é a cognição, o comportamento, o sono e a comunicação, e o protocolo costuma ter de 3 a 4 sessões. A resposta varia muito de um paciente para outro, e não há resultado padronizado.",
    faqIds: ["autismo", "autismoSessoes", "paralisia"],
    interesse: "Autismo",
  },
  {
    slug: "fibromialgia-e-dor-cronica",
    title: "Fibromialgia e Dor Crônica",
    name: "fibromialgia e dor crônica",
    short: "Dor difusa e persistente.",
    description:
      "Tratamento de apoio para a fibromialgia e outros quadros de dor difusa e persistente, com foco na inflamação crônica e na forma como o corpo sente a dor.",
    conditions: ["Fibromialgia", "Dor crônica difusa"],
    seoTitle: "Fibromialgia e células-tronco",
    metaDescription:
      "Fibromialgia e dor crônica: como o Dr. Tércio Rocha avalia o tratamento com células-tronco para reduzir a inflamação e a sensibilidade à dor.",
    h1: "Tratamento da fibromialgia com células-tronco",
    intro:
      "A fibromialgia causa dor espalhada pelo corpo, que persiste por meses, muitas vezes com cansaço e sono ruim. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco é indicado, sempre de forma individual.",
    conditionsHeading: "Quais quadros de dor crônica são avaliados",
    howHeading: "Como as células-tronco atuam na fibromialgia",
    howText:
      "As células-tronco liberam substâncias anti-inflamatórias e fatores de crescimento que podem equilibrar a inflamação crônica e diminuir a sensibilização central — a forma como o sistema nervoso amplifica a dor. Também apoiam a recuperação de pequenas lesões em músculos, articulações e tendões. O objetivo é a melhora progressiva da dor e da qualidade de vida.",
    faqIds: ["fibromialgia", "sensibilizacao", "complementar"],
    interesse: "Fibromialgia",
  },
  {
    slug: "diabetes-tipo-2",
    title: "Diabetes Tipo 2",
    name: "diabetes tipo 2",
    short: "Sensibilidade à insulina e controle da glicose.",
    description:
      "Uso de células-tronco no diabetes mellitus tipo 2, com foco na modulação do sistema imunológico e na regeneração de tecidos.",
    conditions: ["Diabetes mellitus tipo 2"],
    seoTitle: "Diabetes tipo 2 e células-tronco",
    metaDescription:
      "Diabetes mellitus tipo 2: como o Dr. Tércio Rocha avalia o tratamento com células-tronco, com foco na sensibilidade à insulina e no controle da glicose.",
    h1: "Tratamento do diabetes tipo 2 com células-tronco",
    intro:
      "No diabetes mellitus tipo 2, o corpo passa a responder mal à insulina e a glicose do sangue fica alta. O Dr. Tércio Rocha avalia cada caso para definir se o tratamento com células-tronco é indicado, junto do acompanhamento que o paciente já faz.",
    conditionsHeading: "Qual tipo de diabetes é avaliado",
    howHeading: "Como as células-tronco atuam no diabetes tipo 2",
    howText:
      "O tratamento é focado na modulação do sistema imunológico e na regeneração de tecidos, o que pode aumentar a sensibilidade à insulina e melhorar o controle da glicose. O diabetes tipo 1 não é tratado na clínica: o protocolo para ele é feito em centro cirúrgico e hoje só está disponível nos Estados Unidos.",
    faqIds: ["diabetes2", "diabetes1", "complementar"],
    interesse: "Diabetes Mellitus Tipo 2",
  },
  {
    slug: "outras-condicoes",
    title: "Outras Condições",
    name: "outras condições",
    short: "Pulmão, rins, síndromes pós-vacinais e outros casos.",
    description:
      "Síndromes pós-vacinais, fibrose pulmonar, nefropatias e outras condições também podem ser avaliadas pelo Dr. Tércio Rocha em consulta.",
    conditions: ["Síndromes pós-vacinais", "Fibrose pulmonar", "Nefropatias (doenças dos rins)"],
    seoTitle: "Fibrose pulmonar, nefropatias e células-tronco",
    metaDescription:
      "Síndromes pós-vacinais, fibrose pulmonar e nefropatias: como o Dr. Tércio Rocha avalia o tratamento com células-tronco em outras condições.",
    h1: "Outras condições avaliadas com células-tronco",
    intro:
      "Além das áreas principais, o Dr. Tércio Rocha avalia outras condições, como as síndromes pós-vacinais, a fibrose pulmonar e as nefropatias (doenças dos rins). Se a sua condição não aparece no site, escolha \"Outros\" no formulário e conte o seu caso: a equipe explica se ele tem indicação para uma avaliação.",
    conditionsHeading: "Outras condições avaliadas",
    howHeading: "Como a medicina regenerativa atua nesses casos",
    howText:
      "As terapias estimulam a regeneração de tecidos e órgãos que perderam a capacidade de se recuperar. O foco é melhorar a qualidade de vida, reduzir os sintomas e retardar a progressão da doença — sem promessa de cura, porque cada organismo responde de um jeito.",
    faqIds: ["posVacinal", "foraDaLista"],
    interesse: "Outros",
  },
] as const satisfies readonly {
  slug: string;
  title: string;
  name: string;
  short: string;
  description: string;
  conditions: readonly string[];
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  conditionsHeading: string;
  howHeading: string;
  howText: string;
  faqIds: readonly FaqId[];
  /** Opção do formulário que a página já deixa escolhida (sem ela, a primeira condição que estiver no formulário). */
  interesse?: (typeof treatmentOptions)[number];
  /** As três marcas embaixo do título; sem elas, as de sempre (ambulatorial, sem cirurgia, avaliação individual). */
  fatos?: readonly string[];
}[];

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

/** A página de cada opção do formulário — a lista completa em /tratamentos leva a ela. */
export const areaDoInteresse: Record<(typeof treatmentOptions)[number], (typeof indications)[number]["slug"]> = {
  "Diabetes Mellitus Tipo 2": "diabetes-tipo-2",
  Demência: "doencas-degenerativas",
  Alzheimer: "doencas-degenerativas",
  Artrose: "lesoes-ortopedicas",
  Parkinson: "doencas-degenerativas",
  Autismo: "autismo-e-neurodesenvolvimento",
  "Anti-Aging": "longevidade-e-anti-aging",
  "Retonificação peniana": "saude-sexual-masculina",
  "Embelezamento íntimo": "estetica-regenerativa",
  "Problemas de coluna": "lesoes-ortopedicas",
  Fibromialgia: "fibromialgia-e-dor-cronica",
  "Síndromes Pós-vacinais": "outras-condicoes",
  "Fibrose pulmonar": "outras-condicoes",
  Cardiopatias: "doencas-cardiovasculares",
  Nefropatias: "outras-condicoes",
  "Problemas de joelho": "lesoes-ortopedicas",
  "Full face": "estetica-regenerativa",
  Outros: "outras-condicoes",
};

export const books = [
  {
    slug: "150-mais",
    title: "150+: A nova expectativa de vida",
    cover: "/img/livro-150.jpg",
    tagline: "O quanto você quer viver?",
    summary:
      "O novo livro do Dr. Tércio Rocha sobre longevidade, com lançamento em 30 de outubro de 2026 pela Literare Books International. Já em pré-venda na Amazon.",
    description:
      "Depois de Partículas Divinas, Vida na Veia! e Longevi Science, o Dr. Tércio Rocha volta à pergunta que move o seu trabalho: quanto tempo, e com que qualidade, uma pessoa pode viver. 152 páginas, Literare Books International.",
    buyUrl: "https://www.amazon.com.br/150-nova-expectativa-quanto-viver/dp/8594557620",
    /** Pré-venda: o botão diz "Reservar" e a data aparece no cartão. */
    lancamento: "30 de outubro de 2026",
    featured: true,
  },
  {
    slug: "longevi-science",
    title: "Longevi Science: a Bíblia da Longevidade",
    cover: "/img/livro-longevi-science.webp",
    tagline:
      "Como viver mais e melhor? Como alcançar os 100, 120 ou até 150 anos com saúde, disposição e alegria de viver?",
    summary:
      "Um compêndio sobre os mecanismos do envelhecimento e as estratégias de longevidade com maior embasamento científico disponível.",
    description:
      "O médico endocrinologista Tércio Rocha apresenta o resultado de décadas de estudos, descobertas e experiências com células-tronco e medicina regenerativa, um campo que une ciência, amor e espiritualidade em busca da plenitude humana. O livro revela o passo a passo da longevidade e reúne o melhor do conhecimento científico mundial sobre regeneração celular, qualidade de vida e envelhecimento saudável.",
    buyUrl: "https://www.amazon.com.br/Longevi-Science-longevidade-T%C3%A9rcio-Rocha-ebook/dp/B0G1V64Q1W",
    featured: false,
  },
  {
    slug: "particulas-divinas",
    title: "Partículas Divinas",
    subtitle: "Uma Trajetória Médica e de Vida Entrelaçadas às Células-tronco",
    cover: "/img/livro-particulas-divinas.jpg",
    tagline:
      "Deus castiga os seus filhos? Ou apenas lhe dá difíceis lições?",
    summary:
      "A trajetória pessoal e médica do Dr. Tércio Rocha: a história de quem enfrentou a própria doença e encontrou na medicina regenerativa um novo caminho.",
    description:
      "Desde cedo, como testemunha dos meus avós e bisavós, percebi que a dificuldade era o melhor presente que Deus poderia mandar a um indivíduo. Aprende quem tem a coragem de recusar o papel de vítima das circunstâncias e assume a posição de um guerreiro, construtor de si mesmo.",
    buyUrl: "https://www.amazon.com.br/Part%C3%ADculas-Divinas-trajet%C3%B3ria-entrela%C3%A7adas-C%C3%A9lulas-Tronco/dp/6559226875",
    featured: false,
  },
  {
    slug: "vida-na-veia",
    title: "Vida na Veia! Regenere-se Já!",
    cover: "/img/livro-vida-na-veia.jpg",
    tagline:
      "Histórias reais de cura e transformação proporcionadas pela medicina regenerativa.",
    summary:
      "Uma visão prática e direta sobre como o cuidado com o organismo pode transformar a qualidade de vida em qualquer fase.",
    description:
      "Muitos que procuram a medicina regenerativa enxergam nas células-tronco uma última esperança, uma luz no fim do túnel. Contudo, logo no início do tratamento, descobrem que essa luz não marca um final, mas sim o início de um novo capítulo, iluminando um caminho de renovação, com vitalidade e desejo de viver.",
    buyUrl: "https://www.amazon.com.br/Vida-veia-patrim%C3%B4nio-desfrutar-Regenerar-se-ebook/dp/B0DQF9XF68",
    featured: false,
  },
] as const;

export const ebook = {
  title: "Longevidade: como regenerar o corpo e a mente para uma vida saudável e plena",
  cover: "/img/ebook-longevidade.webp",
  tagline: "O envelhecimento não precisa ser sinônimo de perda, dor e dependência.",
  /** Copy do marketing. */
  summary:
    "Um material gratuito com os fundamentos do cuidado com o organismo ao longo da vida, escrito para quem quer começar agora, independentemente da idade.",
  description:
    "Um material gratuito com os fundamentos do cuidado com o organismo ao longo da vida, escrito para quem quer começar agora, independentemente da idade. O verdadeiro desafio não é viver mais, mas viver melhor, e a longevidade plena parte da regeneração do corpo e da mente.",
  bullets: [
    "Por que o corpo envelhece — e o que a biologia já sabe sobre reverter parte disso",
    "Como reativar o sistema natural de reparo do organismo",
    "Os pilares práticos para preparar o corpo para uma vida mais longa e ativa",
    "Como medir o envelhecimento biológico, que é diferente da idade do documento",
  ],
} as const;

export const disclaimer =
  "Conteúdo de caráter informativo, sem finalidade de substituir a consulta médica. Resultados variam conforme o caso, o diagnóstico e as condições clínicas de cada paciente. Nenhum tratamento é indicado sem avaliação médica individual. Responsável técnico: Dr. Tércio Rocha — CRM SP 148068.";
