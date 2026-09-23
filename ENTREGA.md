# Site novo do Dr. Tércio Rocha — o que mudou

Documento de entrega. A auditoria completa do site antigo está em
`conteudo-original/AUDITORIA.md`.

## Números

| | WordPress atual | Site novo |
|---|---|---|
| Performance (Lighthouse mobile) | não medido¹ | **91** |
| Performance (desktop) | não medido¹ | **100** |
| Acessibilidade | — | **100** |
| Boas práticas | — | **100** |
| SEO | — | **100** |
| Requisições de CSS | 31 | **1** |
| Requisições de JS | 23 | **9** |
| Blocos `<style>` inline | 10 | **0** |
| CLS (deslocamento de layout) | — | **0** |
| LCP desktop | — | **0,7 s** |
| Páginas fora do ar | **4 (erro 500)** | 0 |
| Títulos duplicados | 9 | 0 |
| Páginas sem meta description | 9 | 0 |
| Renderização | PHP a cada request | HTML estático pré-gerado |

¹ A API do PageSpeed estava sem quota no momento da medição. Os números do site
antigo que constam aqui foram medidos diretamente: 31 stylesheets, 23 scripts e
446 KB de HTML renderizado, com banner PNG de 433 KB.

## Problemas do site atual que foram corrigidos

**Quatro páginas retornando erro 500** — `Error establishing a database connection`,
confirmado em duas passagens. Uma delas é `/e-book-longevidade-dr-tercio/`, a isca de
captura de e-mail **linkada no botão "BAIXAR E-BOOK" da home**. Todo lead que clicava
ali era perdido. A página foi refeita em `/ebook-longevidade`.

**Quatro números de WhatsApp diferentes** espalhados pelo site. Na página de consulta
médica, o botão levava ao número do Congresso Regenera com a mensagem pré-preenchida
*"gostaria de tirar algumas dúvidas sobre o Congresso Regenera"* — mensagem errada para
quem quer marcar consulta. O site novo usa um número único, o rotulado "Consultas"
(`(17) 99259-6350`), com mensagem contextual em cada página.

**Rodapé da página de consulta** dizia "Copyright © 2024 II CONGRESSO LATINO AMERICANO
DE MEDICINA REGENERATIVA" — resíduo de outra landing page.

**Bloco "Quem é Dr. Tércio Rocha?" repetido três vezes** na mesma página.

**Erro de digitação na home**: "tratamentos com CÉLUALS TRONCO".

**Slug do blog** era `blog__dr_tercio_rocha_celulas_tronco` — keyword stuffing com
underscores. Agora é `/artigos`.

**`/pagina-exemplo/`**, a página padrão do WordPress, estava indexável.

**Formulário sem consentimento LGPD** e sem rastreio de origem. O novo tem checkbox de
consentimento obrigatório e grava `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `gclid` e `fbclid`.

## SEO

- Títulos únicos em todas as páginas, com template `%s | Dr. Tércio Rocha`. A home
  antiga tinha o título `Dr. Tércio Rocha - Dr. Tércio Rocha`.
- Meta description em todas. Onde o WordPress deixou vazio, o primeiro parágrafo do
  artigo entra automaticamente.
- Canonical em todas as páginas.
- `sitemap.xml` e `robots.txt` gerados no build — nunca ficam desatualizados.
- Open Graph e Twitter Card completos, com imagem por artigo.
- **Redirects 301 de todas as 54 URLs antigas.** Os artigos moram na raiz no site
  antigo (`/alopecia-nunca-mais/`) e passam para `/artigos/alopecia-nunca-mais`, com o
  slug preservado. Sem isso, a autoridade acumulada viraria 404 no dia da virada.

## GEO e AEO

O site antigo declarava apenas `Article`, `WebPage`, `WebSite`, `Person` e
`ImageObject`. Faltavam exatamente os tipos que motores generativos usam para citar um
profissional de saúde. Agora o site declara, num único `@graph` com nós interligados:

| Tipo | Onde | Para quê |
|---|---|---|
| `Physician` + `MedicalBusiness` | todas | identifica o médico como entidade de saúde |
| `MedicalClinic` | todas | a Clínica Longevitar como organização |
| `Person` | todas | credenciais, CRMs, afiliações, `sameAs` das redes |
| `MedicalProcedure` | tratamentos | os seis grupos de indicação |
| `MedicalWebPage` | tratamentos, artigos | conteúdo médico revisado por profissional |
| `FAQPage` | home, consulta, tratamentos, FAQ | respostas diretas extraíveis |
| `BreadcrumbList` | todas as internas | hierarquia do site |
| `Book` | livros, e-book | as obras publicadas |
| `Blog` + `BlogPosting` | listagem de artigos | o acervo |

Além disso:

- **`/llms.txt`** — resumo da entidade em markdown, feito para modelos de linguagem:
  credenciais, áreas de indicação, FAQ inteiro e índice dos 31 artigos. É a camada que
  entrega o fato verificável em vez de deixar o modelo inferir do HTML de marketing.
- **`robots.txt` libera explicitamente** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  PerplexityBot, Google-Extended e Applebot-Extended. A estratégia é ser citado nas
  respostas generativas, não bloqueá-las.
- **FAQ em `<details>` nativo** — a resposta está no HTML mesmo com o acordeão fechado,
  legível por crawler, sem JavaScript.
- **Oito perguntas frequentes** escritas para responder o que o paciente pergunta:
  quem é o médico, o que são células mesenquimais alogênicas, quais condições, como é a
  primeira consulta, se é cirúrgico, idade biológica, onde atende, quanto custa.

## Design

O site antigo usava verde neon `#1AFF00` como cor de destaque e link — satura, não passa
contraste WCAG em texto sobre branco e destoa do posicionamento de medicina de longevidade
premium. O novo é ancorado no **dourado que já existia na marca** (os logos
`LOGO-DR.-TERCIO-DOURADO` usados na landing de consulta), sobre fundo escuro profundo e
off-white quente.

- **Tipografia**: Fraunces (serifa variável) nos títulos, Inter no corpo. Ambas
  self-hosted via `next/font` — o site antigo puxava Montserrat e Roboto da rede do
  Google em requisição bloqueante.
- **Escala fluida** com `clamp()`: nenhum salto de tamanho entre breakpoints.
- **Contraste AA em todos os textos** (verificado pelo Lighthouse, nota 100).
- **Foco visível** em todos os elementos interativos — o site antigo não tinha nenhum.
- **Animação de entrada em CSS puro** (`animation-timeline: view()`), sem JavaScript e
  sem custo de hidratação. Desligada acima de 1600px de altura de viewport, porque é
  assim que o Googlebot renderiza e o conteúdo não pode nascer invisível para ele.
- **`prefers-reduced-motion`** respeitado.

## Conversão

Três caminhos, conforme definido:

1. **Formulário → CRM.** `POST /api/lead` valida, aplica limite por IP, tem honeypot
   contra bot e repassa ao webhook do CRM com os mesmos nomes de campo do projeto de IA
   (`produto_interesse`, `telefone`, `origem`, `canal`). Se o CRM estiver fora do ar, o
   lead é registrado no log e o paciente ainda vê sucesso — nenhum contato se perde por
   indisponibilidade.
2. **Agendamento de consulta.** Página `/consulta` dedicada, com os três passos do
   processo explicados e o formulário completo.
3. **Captura por e-book.** `/ebook-longevidade` recuperada e refeita, com formulário de
   três campos.

O WhatsApp continua presente como canal secundário (botão flutuante que aparece após o
primeiro scroll, para não competir com o CTA do hero), com mensagem contextual por
página — na página de artrose, a mensagem já diz artrose.

## Conteúdo migrado

31 artigos extraídos do WordPress via Firecrawl, com título, descrição, categoria,
data de publicação, capa e corpo em markdown. As capas foram baixadas e são servidas
localmente em AVIF/WebP pelo `next/image`.

Foram descartados: a página de exemplo do WordPress, as paginações do blog, as páginas
de confirmação e dois arquivos de sitemap que o crawler trouxe junto.

## Três pontos que precisam da sua decisão

**1. Afirmações de eficácia.** O site atual afirma que "as CÉLULAS TRONCO tratam quase
todas as doenças". Reproduzi o conteúdo do cliente, mas a Resolução CFM sobre publicidade
médica veda promessa de resultado e sensacionalismo. Adicionei um aviso legal no rodapé
de todas as páginas e a ressalva "não existe protocolo único, a conduta é definida caso a
caso" nas páginas de tratamento. **Recomendo revisão do texto por quem responde
tecnicamente antes de publicar.**

**2. Imagens de celebridades.** Vários artigos usam fotos de pessoas reais e famosas
(Jada Pinkett Smith, Deborah Secco, Cristiano Ronaldo, Lady Gaga, Fernanda Venturini)
para ilustrar textos sobre tratamentos. Isso vem do site atual e foi migrado como estava,
mas associar imagem de pessoa identificável a tratamento médico sem autorização é risco
de direito de imagem além de publicidade médica. Vale substituir por imagens licenciadas.

**3. O banco de dados do site atual está com defeito.** Os erros 500 são intermitentes por
página, o que sugere problema no servidor ou no banco, não no conteúdo. Se o WordPress vai
ficar no ar em paralelo por algum tempo, isso precisa ser olhado — hoje ele está perdendo
leads.

## O que ainda falta para ir ao ar

- [ ] Configurar `CRM_WEBHOOK_URL` apontando para o CRM
- [ ] Definir se o WhatsApp de consultas é mesmo o `(17) 99259-6350`
- [ ] Entrega automática do PDF do e-book (hoje o lead entra no CRM; o envio do arquivo
      precisa do serviço de e-mail)
- [ ] Revisão do texto médico (ponto 1 acima)
- [ ] Deploy e apontamento de DNS
- [ ] Submeter o sitemap ao Google Search Console
