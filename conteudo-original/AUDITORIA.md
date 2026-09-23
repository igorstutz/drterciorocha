# Auditoria do site atual — drterciorocha.com

Varredura completa via Firecrawl em 09/09/2026. 54 URLs rastreadas, 102 imagens catalogadas.

## Stack atual

| Item | Valor |
|---|---|
| CMS | WordPress 6.8.8 |
| Page builder | Elementor 4.0.1 + Elementor Pro |
| Tema | hello-elementor |
| SEO | Yoast (JSON-LD presente) |
| TTFB | 0,27 s – 0,53 s |
| HTML servido | 111 KB (comprimido) / 446 KB renderizado |
| Requisições de CSS | **31 stylesheets** |
| Requisições de JS | **23 scripts** |
| Blocos `<style>` inline | 10 |

## Problemas encontrados

### 1. Páginas fora do ar (erro 500) — crítico
Quatro URLs retornam `Error establishing a database connection`, confirmado em duas
passagens distintas (não é falha transitória):

- `/e-book-longevidade-dr-tercio/` — **é a isca de captura de e-mail linkada na home**
- `/permita-se-longevitar-se/`
- `/category/celulas-tronco/` — a categoria principal do blog
- `/2025/12/19/`

A home tem um botão "BAIXAR E-BOOK" apontando para uma página quebrada. Todo lead que
clica ali é perdido.

### 2. Performance
- 54 requisições de CSS/JS só na home, típico de Elementor sem otimização.
- Banner principal em PNG de **433 KB** (`BANNER-01-TERCIO.png`) — deveria ser WebP/AVIF
  com menos de 80 KB.
- Ícone repetido 6× na home servido em 1024×1024 px para ser exibido a ~80 px.
- Iframe do YouTube carregado direto, sem facade — bloqueia a thread principal.

### 3. SEO
- **Títulos duplicados**: 9 páginas. O padrão `Título - Dr. Tércio Rocha` gera casos como
  `Dr. Tércio Rocha - Dr. Tércio Rocha` na home.
- **Sem meta description**: 9 páginas. **Descriptions duplicadas**: 12 páginas.
- **Sem title**: 4 páginas.
- Blog paginado (`/blog.../2/`, `/3/`, `/4/`) com o mesmo title e description em todas.
- Slug do blog é `blog__dr_tercio_rocha_celulas_tronco` — keyword stuffing com underscores,
  péssimo para URL semântica.
- Página `/pagina-exemplo/` (a "Página de exemplo" padrão do WordPress) indexável.

### 4. GEO / AEO (busca generativa e respostas diretas)
- JSON-LD limitado a `Article`, `WebPage`, `WebSite`, `Person`, `ImageObject`.
- **Ausentes**: `Physician`, `MedicalClinic`, `MedicalProcedure`, `FAQPage`, `BreadcrumbList`,
  `LocalBusiness`. São exatamente os tipos que motores generativos usam para citar
  profissionais de saúde.
- Nenhum bloco de perguntas e respostas estruturado — o conteúdo é 100 % narrativo,
  ótimo para leitura humana, inaproveitável para extração de resposta direta.
- Sem `speakable`, sem `sameAs` consolidado das redes sociais.

### 5. Conversão
- 4 números de WhatsApp diferentes espalhados pelo site, um deles com texto pré-preenchido
  sobre o **Congresso Regenera** dentro da página de consulta médica — mensagem errada
  para quem quer marcar consulta.
- Rodapé da página de consulta ainda diz "Copyright © 2024 II CONGRESSO LATINO AMERICANO
  DE MEDICINA REGENERATIVA" — resíduo de outra landing page.
- Bloco "Quem é Dr. Tércio Rocha?" **repetido 3 vezes** na mesma página `/consulta-dr-tercio-rocha/`.
- Formulário sem consentimento LGPD explícito e sem rastreio de origem (UTM).

### 6. Conteúdo
- Erro de digitação na home: "tratamentos com CÉLUALS TRONCO".
- Home mistura duas datas de copyright (2024 e 2026).
- Seis cards de doenças na home sem descrição — só título e botão. A versão com texto
  existe em `/consulta-dr-tercio-rocha/` e é muito melhor.

## Identidade visual atual (extraída)

| Token | Valor |
|---|---|
| Fonte títulos | Montserrat |
| Fonte corpo | Roboto |
| Primária | `#69727D` (cinza) |
| Secundária | `#CC3366` |
| Destaque / links | `#1AFF00` (verde neon) |
| Fundo | `#FFFFFF` |
| Texto | `#04040F` |
| Raio de borda | 4 px (30 px em botões e inputs) |

O verde neon `#1AFF00` é o ponto mais frágil: satura, não passa contraste em texto sobre
branco e destoa completamente do posicionamento premium de medicina de longevidade.
Existem também logos em versão dourada (`LOGO-DR.-TERCIO-DOURADO`) usadas na landing de
consulta — o dourado é um caminho muito mais coerente com o público-alvo.

## Arquitetura de conteúdo

| Tipo | Qtd. | Observação |
|---|---|---|
| Home | 1 | institucional + formulário |
| Landing de consulta | 1 | `/consulta-dr-tercio-rocha/` |
| Artigos / casos | 28 | narrativas com pacientes e celebridades |
| Listagens de blog | 4 | paginação |
| Categorias | 3 | uma delas quebrada |
| Páginas de apoio | 6 | links, linknabio, confirmações, gerar-guia |
| Quebradas (500) | 4 | ver acima |
| Sitemaps | 4 | XML |

## Dados de negócio capturados

**Credenciais:** Dr. Tércio Rocha — CRM SP 148068 | CRM RJ 525847 | CRM SC 30974
Endocrinologista. Mais de 34 anos de experiência (protocolos de longevidade desde 1990).

**Afiliações:** Academia Brasileira Antienvelhecimento; Academia Internacional de Medicina
Antienvelhecimento; Sociedade Francesa de Medicina Estética e Mesoterapia. Fundador da
Sociedade Brasileira de Medicina Estética.

**Áreas:** Medicina Regenerativa, Medicina Estética Regenerativa, Medicina Anti-Aging,
Medicina Integrativa.

**WhatsApp encontrados:**
- `5517992596350` — rotulado "Consultas"
- `5511998780999` — Congresso Regenera (usado indevidamente na página de consulta)
- `5511936195825`
- `5521967463939`

**Redes sociais:**
- Instagram `@dr.terciorocha` — https://www.instagram.com/dr.terciorocha/
- YouTube `@drterciorocha` — 1,1 mil inscritos
- LinkedIn — https://www.linkedin.com/in/terciorocha/
- Facebook — id 100068674238354
- TikTok — https://www.tiktok.com/@drterciorocha
- Instagram Regenera — https://www.instagram.com/regenerabrasil.med/

**Sites irmãos:** `stemcells.com.br` (portal de conteúdo) · `regenera-brasil.com` (congresso)

**Livros:**
1. *Longevi Science: a Bíblia da Longevidade* — Literare Books
2. *Partículas Divinas: uma Trajetória Médica e de Vida Entrelaçadas às Células-tronco*
3. *Vida na Veia! Regenere-se Já!*
4. E-book *Longevidade: como regenerar o corpo e a mente* (isca — página quebrada)

**Condições tratadas** (do select do formulário): Diabetes Mellitus Tipo 2, Demência,
Alzheimer, Artrose, Parkinson, Autismo, Anti-Aging, Retonificação peniana, Embelezamento
íntimo, Problemas de coluna, Fibromialgia, Síndromes Pós-vacinais, Fibrose pulmonar,
Cardiopatias, Nefropatias, Problemas de joelho, Full face, Outros.

**Seis grupos de indicação** (com descrição, de `/consulta-dr-tercio-rocha/`):
Doenças Autoimunes · Doenças Degenerativas · Lesões Ortopédicas · Doenças
Cardiovasculares · Transtornos Hematológicos · Disfunção Erétil.
