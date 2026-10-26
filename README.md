# drterciorocha.com — novo site

Substituto do WordPress + Elementor. Next.js 16 (App Router), React 19,
Tailwind CSS 4, TypeScript. Todas as páginas são pré-renderizadas estáticas.

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
    (site)/                     as páginas públicas (o grupo não muda endereço; o layout traz cabeçalho, rodapé e pixels)
      page.tsx                  home
      consulta/                 formulário de captação
      tratamentos/              hub + 12 áreas de indicação (SSG) — toda opção do formulário tem a sua (areaDoInteresse)
      dr-tercio-rocha/          biografia e credenciais
      artigos/                  listagem + artigos (ISR: regeneram a cada minuto)
      livros/                   3 livros
      ebook-longevidade/        isca de e-mail
      perguntas-frequentes/     FAQ
    admin/                      painel de artigos (login, lista, editor, pré-visualização, envio de imagem)
    midia/[arquivo]/            imagens enviadas pelo painel, servidas do volume de dados
    api/lead/route.ts           recebe o formulário e entrega ao CRM
    sitemap.ts robots.ts        gerados no build
    llms.txt/route.ts           resumo da entidade para motores generativos
    globals.css                 design system: tokens, texturas, reflexos, badges metálicos
  components/                   Header, Footer, LeadForm, EbookForm, Faq, Carrossel, ui
  content/
    site.ts                     fonte única de dados (contatos, indicações, livros, FAQ)
    artigos/artigos.json        31 artigos migrados do WordPress (semente do acervo)
  lib/
    jsonld.tsx                  schemas Physician, MedicalClinic, FAQPage…
    acervo.ts                   leitura e gravação dos artigos em dados/ (o que o painel publica)
    artigos.ts                  os artigos no ar, para as páginas públicas
    painel/                     login, ações e tipos do painel
    markdown.ts                 renderização do corpo dos artigos (no build)
conteudo-original/              varredura do site antigo + AUDITORIA.md
assets-originais/               imagens baixadas do WordPress
```

## Integração com o CRM

O formulário posta em `POST /api/lead`, que valida e repassa para o webhook do CRM.

Configure em `.env.local` (ver `.env.example`):

```
CRM_WEBHOOK_URL=https://<painel-de-atendimento>/api/webhooks/in/site
CRM_WEBHOOK_TOKEN=<token da origem "site" do painel>
```

O CRM é o painel de atendimento da clínica (`../ATENDIMENTO CRM IA`): a origem `site` é criada lá por
`npm run clinica:configurar`, que imprime a URL e o token (`-- --mostrar-token` para ver de novo). O token
vai no header `Authorization: Bearer`. Para testar nesta máquina, o `.env.local` aponta para
`http://localhost:3030/api/webhooks/in/site`.

Sem `CRM_WEBHOOK_URL` o lead é gravado no log do servidor e a API responde
`{ ok: true, entregue: false }` — o paciente vê sucesso e nenhum contato se perde.
O payload enviado ao CRM usa os mesmos nomes de campo do projeto de IA
(`produto_interesse`, `telefone`, `origem`, `canal`), então cai direto no schema
existente.

Cada lead carrega a atribuição de campanha (`utm_*`, `gclid`, `fbclid`), capturada na
primeira visita e guardada por 30 dias no navegador.

**Ficha para a guia de exames.** `/guia` (o `/gerar-guia` do site antigo) é a ficha em três passos
— dados do paciente, queixas, endereço — que a equipe manda pelo WhatsApp a quem aceitou as
condições da consulta; `?tel=5511999998888` preenche o WhatsApp. Ela posta em `POST /api/guia`, que
entrega à origem `guia` do painel: o mesmo `CRM_WEBHOOK_URL` com `/site` trocado por `/guia` e o mesmo
token (`urlDoCrm` em `src/lib/crm.ts`) — nada a configurar a mais. Lá, a ficha inteira vira campos do
negócio do paciente no CRM. Página de uso interno: fora do sitemap e sem indexação.

## Alterar conteúdo

Quase tudo vive em `src/content/site.ts`: telefone de WhatsApp, redes sociais,
áreas de indicação, opções do formulário, livros, FAQ, aviso legal. Editar ali e
refazer o build atualiza o site inteiro, o `sitemap.xml`, o JSON-LD e o `llms.txt`.

## Painel de artigos (`/admin`)

O marketing escreve, agenda e publica os artigos em `drterciorocha.com/admin`, sem build. O editor mostra o texto
com a cara do site e guarda o corpo em markdown. Ele tem capa com arrastar e soltar, imagens no corpo (toda imagem é
convertida em WebP de até 2000 px), pré-visualização do que está na tela (salvo ou não) e salvamento automático dos
rascunhos. Antes de publicar, uma conferência mostra o que falta: título, capa, categoria e texto. O "publicar" tem
duas opções, agora ou agendado.

- **Onde ficam os artigos:** `dados/artigos.json` (`DADOS_DIR`; na VPS é um volume). Enquanto o arquivo não existe,
  o acervo é `src/content/artigos/artigos.json`; a primeira gravação do painel copia tudo para `dados/`, e dali em
  diante **editar o JSON do repositório não muda mais o site**: artigo se mexe pelo painel. Cada gravação guarda a
  versão anterior em `dados/historico/` (as 60 últimas), o caminho para recuperar um artigo excluído por engano.
- **Agendamento:** o artigo fica no acervo com `status: "publicado"` e data no futuro. As páginas que listam artigos
  regeneram a cada minuto (`revalidate = 60`), então ele aparece sozinho em até ~1 minuto depois da hora marcada,
  sem nenhum processo agendado no servidor. Publicar, editar ou excluir regenera tudo na hora.
- **Endereço:** sai do título e pode ser editado enquanto o artigo não foi ao ar. Depois disso fica travado.
- **Login:** `ADMIN_USUARIOS` no `.env`, uma entrada por pessoa (`email:sal:hash`) gerada com
  `node scripts/senha-painel.mjs email@dominio.com`. A senha não fica escrita em lugar nenhum. Para tirar o acesso de
  alguém, basta apagar a entrada dessa pessoa e reiniciar o container. `ADMIN_SEGREDO` assina a sessão (14 dias); sem ele,
  cada publicação do site desconecta todo mundo. Oito senhas erradas em 15 minutos bloqueiam o IP.
- **Local:** `ADMIN_USUARIOS=… npm run dev` e abrir `localhost:3000/admin`. Sem `DADOS_DIR`, os artigos vão para
  `dados/` na raiz (fora do git).

Campos de cada artigo: `id`, `slug`, `titulo`, `descricao`, `categoria`, `publicado`, `status`, `capaLocal`,
`corpo` (markdown), `palavras`, `atualizado`, `criadoPor`, `atualizadoPor`.

A política de privacidade (`/privacidade`, LGPD) vive em `src/content/privacidade.ts`: seções com
título, parágrafos e lista, e a data de atualização. Escrita a partir do que o site e o painel de
atendimento fazem de verdade (formulários, ficha da guia, WhatsApp pela Meta, atendimento automático e
IA de apoio à equipe, atribuição de campanha no navegador por 30 dias). Os três formulários e o rodapé
apontam para ela. Revisão jurídica recomendada antes de divulgar.

## Deploy

Na **VPS da clínica** (`root@187.77.253.83`), a mesma do painel de atendimento, em Docker atrás do Caddy
de lá — decisão de 14/out/2026 (não vai mais para a Vercel). Roteiro completo, da primeira publicação à virada
do domínio, em `deploy/README.md`; no dia a dia é um comando:

```bash
VPS=root@187.77.253.83 ./deploy/publicar.sh
```

Os redirects 301 do site antigo estão em `next.config.ts` e sobem junto. Antes de apontar o domínio:

1. Conferir que `site.url` em `src/content/site.ts` é o domínio final.
2. Virar o DNS como diz `deploy/README.md` e reiniciar o Caddy.
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
