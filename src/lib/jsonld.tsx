import { site, doctor, contact, social, faqs, indications } from "@/content/site";

/**
 * Camada GEO/AEO. O site antigo só declarava Article/WebPage/Person — os tipos
 * que motores generativos usam para citar um profissional de saúde (Physician,
 * MedicalClinic, MedicalWebPage, FAQPage) estavam todos ausentes.
 */

const PHYSICIAN_ID = `${site.url}/#physician`;
const WEBSITE_ID = `${site.url}/#website`;
const ORG_ID = `${site.url}/#organization`;

export const physicianSchema = {
  "@type": ["Physician", "MedicalBusiness"],
  "@id": PHYSICIAN_ID,
  name: doctor.name,
  url: site.url,
  image: `${site.url}/img/tercio-retrato.webp`,
  logo: `${site.url}/img/logo-dourado.png`,
  description: site.description,
  medicalSpecialty: ["Endocrine", "Geriatric"],
  knowsAbout: [
    "Medicina Regenerativa",
    "Células-tronco mesenquimais alogênicas",
    "Longevidade",
    "Medicina Anti-Aging",
    "Medicina Integrativa",
    "Medicina Estética Regenerativa",
  ],
  areaServed: [
    { "@type": "State", name: "São Paulo" },
    { "@type": "State", name: "Rio de Janeiro" },
    { "@type": "State", name: "Santa Catarina" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: site.country,
  },
  telephone: `+${contact.whatsapp}`,
  sameAs: social.map((s) => s.url),
  availableService: indications.map((i) => ({
    "@type": "MedicalProcedure",
    name: i.title,
    description: i.description,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    url: `${site.url}/tratamentos/${i.slug}`,
  })),
};

export const personSchema = {
  "@type": "Person",
  "@id": `${site.url}/#pessoa`,
  name: doctor.name,
  givenName: "Tércio",
  familyName: "Rocha",
  jobTitle: doctor.jobTitle,
  description: doctor.bio[0],
  image: `${site.url}/img/tercio-retrato.webp`,
  url: `${site.url}/dr-tercio-rocha`,
  worksFor: { "@id": ORG_ID },
  knowsLanguage: "pt-BR",
  hasCredential: doctor.crm.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Registro profissional",
    name: c,
  })),
  memberOf: doctor.affiliations.map((a) => ({ "@type": "Organization", name: a })),
  sameAs: social.map((s) => s.url),
};

export const organizationSchema = {
  "@type": "MedicalClinic",
  "@id": ORG_ID,
  name: "Clínica Longevitar",
  alternateName: doctor.name,
  url: site.url,
  logo: `${site.url}/img/logo-dourado.png`,
  image: `${site.url}/img/tercio-retrato.webp`,
  description:
    "Clínica de medicina regenerativa e longevidade dirigida pelo Dr. Tércio Rocha.",
  telephone: `+${contact.whatsapp}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: site.country,
  },
  medicalSpecialty: "Endocrine",
  employee: { "@id": `${site.url}/#pessoa` },
  sameAs: social.map((s) => s.url),
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: site.url,
  name: site.name,
  inLanguage: site.locale,
  publisher: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${site.url}/artigos?q={q}` },
    "query-input": "required name=q",
  },
};

export const faqSchema = {
  "@type": "FAQPage",
  "@id": `${site.url}/#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.url}`,
    })),
  };
}

export function articleSchema(a: {
  titulo: string;
  descricao: string;
  slug: string;
  publicado: string;
  atualizado: string;
  capaLocal: string;
}) {
  return {
    "@type": "MedicalWebPage",
    "@id": `${site.url}/artigos/${a.slug}#page`,
    headline: a.titulo,
    description: a.descricao,
    url: `${site.url}/artigos/${a.slug}`,
    inLanguage: site.locale,
    datePublished: a.publicado || undefined,
    dateModified: a.atualizado || a.publicado || undefined,
    image: a.capaLocal ? `${site.url}${a.capaLocal}` : undefined,
    author: { "@id": `${site.url}/#pessoa` },
    publisher: { "@id": ORG_ID },
    reviewedBy: { "@id": `${site.url}/#pessoa` },
    about: { "@type": "MedicalEntity", name: "Medicina regenerativa com células-tronco" },
    audience: { "@type": "Patient" },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function procedureSchema(i: (typeof indications)[number]) {
  return {
    "@type": "MedicalWebPage",
    "@id": `${site.url}/tratamentos/${i.slug}#page`,
    name: i.title,
    description: i.description,
    url: `${site.url}/tratamentos/${i.slug}`,
    inLanguage: site.locale,
    reviewedBy: { "@id": `${site.url}/#pessoa` },
    audience: { "@type": "Patient" },
    isPartOf: { "@id": WEBSITE_ID },
    mainContentOfPage: {
      "@type": "MedicalProcedure",
      name: i.title,
      description: i.description,
      procedureType: "https://schema.org/NoninvasiveProcedure",
      howPerformed:
        "Aplicação ambulatorial de células-tronco mesenquimais alogênicas, com protocolo definido após avaliação médica individual.",
      preparation:
        "Avaliação clínica prévia com histórico, exames e definição de conduta caso a caso.",
      relevantSpecialty: { "@type": "MedicalSpecialty", name: "Medicina Regenerativa" },
    },
  };
}

/** Monta o @graph — um único bloco JSON-LD por página, com nós interligados por @id. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
