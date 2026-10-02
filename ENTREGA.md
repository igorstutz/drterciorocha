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
quem quer marcar consulta. O site novo usa um número único,
`(11) 93619-5825`, confirmado pelo Dr. Tércio em 23/09/2026, com mensagem contextual em cada página.

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
| `MedicalClinic` | todas | a Clínica Tércio Rocha como organização |
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
premium. A primeira versão do site novo foi ancorada no dourado dos logos; em 02/10/2026
passou para a **identidade do Dr. Tércio: azul-marinho com fonte branca** (paleta enviada
pelo marketing). No celular o site lia como "preto e dourado".

- **Cores** (`globals.css`, `@theme`): fundos escuros em azul-marinho (`ink-900`
  `#0a1733`), azul de destaque (`azul-*`) para brilhos, ícones e o selo principal,
  off-white quente nas seções claras. O dourado ficou só em detalhe: palavra em itálico,
  números, fios e a etapa final das jornadas. CTA principal em branco com texto marinho.
- **Tipografia**: Geist (variável) em tudo e Instrument Serif itálica só nas palavras de
  destaque. Self-hosted via `next/font` — o site antigo puxava Montserrat e Roboto da
  rede do Google em requisição bloqueante.
- **Escala fluida** com `clamp()`: nenhum salto de tamanho entre breakpoints.
- **Contraste AA em todos os textos** (Lighthouse: acessibilidade 100 nas páginas
  principais em 02/10/2026).
- **Foco visível** em todos os elementos interativos — o site antigo não tinha nenhum.
- **Animação de entrada em CSS puro** (`animation-timeline: view()`), sem JavaScript.
  Desligada acima de 1600px de altura de viewport, porque é assim que o Googlebot
  renderiza e o conteúdo não pode nascer invisível para ele. Não roda no Firefox, que
  ainda não suporta o recurso.
- **`prefers-reduced-motion`** respeitado: com os "Efeitos de animação" do Windows
  desligados, nada se move (só cor e opacidade respondem). É por isso que, no computador
  do Igor, o site aparece sem animação em qualquer navegador.

### Peças visuais da rodada de 01–02/10

- **Jornada** (`PassosConsulta` na home e `JornadaTratamento` nas páginas de área):
  painel marinho com linha do tempo do azul ao dourado e uma miniatura por etapa. Foi a
  peça que o Igor mais gostou; usar como referência de estilo.
- **Órbita das 6 áreas** (`OrbitaAreas`) no topo de `/tratamentos`.
- **Regenera Brasil** em faixa champanhe com o nome vazado ao fundo (`RegeneraBrasil`).
- **Página do médico** como perfil editorial: retrato com cartões flutuantes, citação
  do próprio Dr. Tércio (artigo "Relacionamento 50 +"), credenciais em faixa marinho e
  livros em vitrine.
- **Celular**: selo do hero cabe numa linha (texto curto abaixo de 640px) e as
  afiliações viram faixa rolante contínua.

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

**Regra do cliente: o WhatsApp só abre depois do formulário.** Nenhum botão do site
aponta para o `wa.me`. Os botões de WhatsApp (flutuante, menu, rodapé, tratamentos, FAQ,
artigos) abrem o formulário numa janela (`WhatsAppGate`); depois do envio, o lead vai ao
CRM com `origem: "whatsapp-<local>"` e `continuar_whatsapp: true`, e a conversa abre com
nome e interesse na mensagem. Sem JavaScript, o botão leva a `/consulta?canal=whatsapp`.
Para criar um botão novo: `Button whatsapp={{ local, interesse }}` ou `atributosGate()`
(`src/lib/whatsapp-gate.ts`).

Na prévia do GitHub Pages não existe `/api/lead`: o envio é simulado
(`NEXT_PUBLIC_PREVIA`) para o fluxo poder ser testado, e a tela de sucesso avisa.

## Busca nos artigos

`/artigos` tem busca por termo (sem acento e por prefixo: "celula" acha "células"), com
sugestões e filtro por categoria. O corpo dos artigos vai ao navegador só como lista de
palavras distintas (`src/lib/busca.ts`), 86 KB em vez de 172 KB de texto. A busca fica na
URL (`/artigos?q=joelho`), o que faz o `SearchAction` do schema.org funcionar.

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

## Copy revisada com o marketing (30/09/2026)

O marketing propôs uma copy nova em formato One Page. A estrutura multipágina foi mantida
(uma página por assunto e por tratamento, pensada para o Dr. Tércio ser recomendado por
IAs) e a copy deles foi aproveitada com palavra-chave nos títulos. Os dois documentos
enviados ao marketing estão em `../Marketing/`:

- `Parecer sobre a copy - Site Dr. Tércio Rocha.pdf` — parecer de 6 páginas, em primeira
  pessoa e tom amigável, com o link e QR code da prévia
- `Copy do site - Dr. Tércio Rocha.docx` — copy de todas as páginas estáticas, seção por
  seção, com link de cada página na prévia. Trechos em amarelo dependem do cliente
- `fontes/` — `parecer.html` e `gerar_copy.py` para editar e gerar os dois de novo
  (instruções no `LEIA-ME.md` da pasta)

O que ainda está no docx mas fora do site (aguarda validação): respostas médicas das FAQ
por tratamento, "Como atua" de transtornos hematológicos e de saúde sexual masculina.

## O que ainda falta para ir ao ar

**Infra**
- [ ] Configurar `CRM_WEBHOOK_URL` apontando para o CRM
- [x] WhatsApp de consultas: `(11) 93619-5825` (confirmado em 23/09/2026)
- [ ] Entrega automática do PDF do e-book (o lead entra no CRM; o envio do arquivo
      precisa do serviço de e-mail)
- [ ] Deploy e apontamento de DNS
- [ ] Submeter o sitemap ao Google Search Console

**Do cliente**
- [ ] Endereço e cidades de atendimento da Clínica Tércio Rocha (SEO local, FAQ "Onde
      atende?", rodapé)
- [ ] Número do RQE de endocrinologia (o CFM pede junto com o CRM quando o site diz
      "endocrinologista")
- [ ] Tempo de carreira: o site diz 34 anos, mas desde 1990 são 36
- [ ] Se o valor da consulta pode ser publicado; se atende por convênio e pacientes de
      outras cidades
- [ ] Números do Regenera Brasil (edições, participantes). Um artigo do próprio Dr. Tércio
      cita a 3ª edição em novembro de 2025
- [ ] Respostas médicas pendentes (segurança, regulamentação, sessões, FAQ por
      tratamento) e revisão do texto médico (ponto 1 acima)
- [ ] Decidir uma 7ª página, "Medicina estética regenerativa" (full face, alopecia,
      regeneração íntima não cabem nas 6 áreas)

**Ofertas em aberto (aguardando o Igor)**
- [ ] Entrada suave (só opacidade) para quem tem os efeitos de animação desligados
- [ ] Entrada das seções também no Firefox, com alternativa em JavaScript
- [ ] Formulário já vir com a condição certa em todas as páginas de área: hoje
      autoimunes, cardiovasculares e hematológicos vêm sem seleção, e lesões ortopédicas
      vem com "Problemas de coluna" (melhor seria "Problemas de joelho")
- [ ] Trocar no docx a frase do hero que não foi para o site, ou o contrário

## Como compilar a prévia neste computador

A pasta `.next` dentro do OneDrive fica travada (EBUSY) durante o build. Compilar numa
cópia fora do OneDrive, como faz o GitHub Actions:

```bash
GITHUB_PAGES=true PAGES_BASE_PATH=/drterciorocha npm run build   # no Git Bash: MSYS_NO_PATHCONV=1
```

O push na `main` publica a prévia em https://igorstutz.github.io/drterciorocha/ pelo
workflow `.github/workflows/pages.yml`. O script `lint` está quebrado desde o Next 16
(`next lint` foi removido); use `npx tsc --noEmit`.
