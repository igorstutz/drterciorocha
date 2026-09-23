# drterciorocha.com — novo site

Substituto do WordPress + Elementor. Next.js 16 (App Router), React 19,
Tailwind CSS 4, TypeScript. Todas as 50 páginas são pré-renderizadas estáticas.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Estrutura

```
src/
  app/
    page.tsx                    home
    consulta/                   formulário de captação
    tratamentos/                hub + 6 áreas de indicação (SSG)
    dr-tercio-rocha/            biografia e credenciais
    artigos/                    listagem + 31 artigos (SSG)
    livros/                     3 livros
    ebook-longevidade/          isca de e-mail
    perguntas-frequentes/       FAQ
    api/lead/route.ts           recebe o formulário e entrega ao CRM
    sitemap.ts robots.ts        gerados no build
    llms.txt/route.ts           resumo da entidade para motores generativos
    globals.css                 design system: tokens, texturas, reflexos, badges metálicos
  components/                   Header, Footer, LeadForm, EbookForm, Faq, Carrossel, ui
  content/
    site.ts                     fonte única de dados (contatos, indicações, livros, FAQ)
    artigos/artigos.json        31 artigos migrados do WordPress
  lib/
    jsonld.tsx                  schemas Physician, MedicalClinic, FAQPage…
    artigos.ts                  acesso e ordenação dos artigos
    markdown.ts                 renderização do corpo dos artigos (no build)
conteudo-original/              varredura do site antigo + AUDITORIA.md
assets-originais/               imagens baixadas do WordPress
```

## Integração com o CRM

O formulário posta em `POST /api/lead`, que valida e repassa para o webhook do CRM.

Configure em `.env.local` (ver `.env.example`):

```
CRM_WEBHOOK_URL=https://seu-crm/webhook/lead
CRM_WEBHOOK_TOKEN=opcional
```

Sem `CRM_WEBHOOK_URL` o lead é gravado no log do servidor e a API responde
`{ ok: true, entregue: false }` — o paciente vê sucesso e nenhum contato se perde.
O payload enviado ao CRM usa os mesmos nomes de campo do projeto de IA
(`produto_interesse`, `telefone`, `origem`, `canal`), então cai direto no schema
existente.

Cada lead carrega a atribuição de campanha (`utm_*`, `gclid`, `fbclid`), capturada na
primeira visita e guardada por 30 dias no navegador.

## Alterar conteúdo

Quase tudo vive em `src/content/site.ts`: telefone de WhatsApp, redes sociais,
áreas de indicação, opções do formulário, livros, FAQ, aviso legal. Editar ali e
refazer o build atualiza o site inteiro, o `sitemap.xml`, o JSON-LD e o `llms.txt`.

Artigos ficam em `src/content/artigos/artigos.json` (campos: `slug`, `titulo`,
`descricao`, `categoria`, `publicado`, `capaLocal`, `corpo` em markdown).

## Deploy

Feito para a Vercel — `next build` e pronto, sem configuração extra. Os redirects
301 do site antigo estão em `next.config.ts` e sobem junto.

Antes de apontar o domínio:

1. Configurar `CRM_WEBHOOK_URL` nas variáveis de ambiente.
2. Conferir que `site.url` em `src/content/site.ts` é o domínio final.
3. Submeter `https://drterciorocha.com/sitemap.xml` ao Google Search Console.

## Resultados medidos

| | Mobile | Desktop |
|---|---|---|
| Performance | 95 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |

CLS 0 no mobile. 1 requisição de CSS (o site antigo fazia 31) e 9 de JS (eram 23).
313 KB transferidos no total.

## Linguagem visual

Definida na segunda rodada de design, toda em `src/app/globals.css`.

**Tipografia.** Geist (grotesca variável) em títulos, corpo e interface, com tracking
negativo forte nos tamanhos grandes. Instrument Serif em itálico entra só nas palavras
de destaque — `regenera`, `células-tronco`, `própria dor` — pela classe `.u-accent`.
São dois arquivos de fonte, 129 KB no total.

**Forma.** Cantos quase retos: `--radius-card` 6 px, `--radius-btn` 5 px,
`--radius-chip` 4 px. Nada de pill. Só avatares e o botão flutuante do WhatsApp
seguem circulares.

**Texturas.** Três utilitários, todos gerados em CSS, sem nenhuma requisição:
`.u-grain` (grão por filtro SVG), `.u-grid-lines` (malha técnica para fundos escuros) e
`.u-dots` (pontilhado, mascarado no miolo para não competir com o texto).

**Movimento.**

| Classe | O que faz |
|---|---|
| `.u-ring` | Par de reflexos que orbita a borda — um passa pelo canto superior direito enquanto o outro passa pelo inferior esquerdo. Ativa no hover e no foco. |
| `.u-halo` | Dois halos difusos, dourado no alto à direita e verde embaixo à esquerda, que acendem e giram no hover. |
| `.u-sheen` | Lustro diagonal que atravessa a peça no hover. |
| `.u-badge-metal` / `.u-badge-steel` | Badge metalizado, ouro e aço, com relevo por sombra interna. |
| `.u-trilho` | Carrossel sobre scroll nativo com snap. |
| `.u-reveal` | Entrada no scroll via `animation-timeline: view()`. |

O anel depende de `@property --ang`: sem ele o `conic-gradient` não interpola e o
reflexo saltaria em vez de correr.

**Animações contínuas são a exceção, não a regra.** Só o badge e o anel do hero se
movem sozinhos, e ainda assim por um número finito de repetições. A primeira versão
tinha treze badges varrendo em loop permanente e o Speed Index oscilava entre 1,2 s e
4,3 s entre medições; limitando o loop, a mediana ficou em 2,2 s e a performance mobile
subiu de 91 para 95. Todo o resto do movimento acontece no hover, quando alguém está
de fato olhando.

**Hero.** No desktop ocupa exatamente uma tela (`lg:h-svh`, teto de 56 rem) e o retrato
usa a mesma proporção 4/5 do arquivo original, então aparece inteiro sem corte e sem
precisar rolar. No mobile a altura é livre, que é como se espera ler no celular.
