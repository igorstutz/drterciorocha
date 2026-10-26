# Publicar o site na VPS da clínica

O site roda na **mesma VPS do painel de atendimento** (`root@187.77.253.83`, decisão de 14/out/2026 — não vai
mais para a Vercel), em Docker, atrás do Caddy do painel:

```
internet → Caddy do painel (80/443, HTTPS automático) → site:3000 (este projeto, Next em standalone)
                                                       → app:3000 (o painel, /opt/atendimento-tercio)
```

Arquivos desta pasta: `docker-compose.vps.yml` (só o container `site`, na rede `clinica` do painel),
`site.caddy` (o bloco que o Caddy do painel importa de `/opt/caddy-sites/`), `env.vps.exemplo` (o `.env`
da VPS) e `publicar.sh` (manda o código daqui, reconstrói lá e recarrega o Caddy). O `Dockerfile` está na
raiz; `next.config.ts` tem `output: "standalone"` por causa dele.

Os leads vão para o painel **por dentro da VPS** (`http://app:3000/api/webhooks/in/site`), sem passar pela
internet: funcionam mesmo antes de o domínio do painel existir no DNS.

## Primeira vez

O painel precisa estar de pé (é dele a rede `clinica` e o Caddy — ver `deploy/README.md` de lá).

```bash
# daqui, no Git Bash, na raiz do projeto
VPS=root@187.77.253.83 SO_ENVIAR=1 ./deploy/publicar.sh

# na VPS: o token é o SITE_WEBHOOK_TOKEN do .env do painel
ssh root@187.77.253.83
cd /opt/drterciorocha && cp deploy/env.vps.exemplo .env && chmod 600 .env
grep SITE_WEBHOOK_TOKEN /opt/atendimento-tercio/.env    # copie o valor para CRM_WEBHOOK_TOKEN no .env
nano .env

# painel de artigos (/admin): uma entrada por pessoa, gerada NA SUA MÁQUINA (pede a senha sem mostrar):
#   node scripts/senha-painel.mjs marketing@exemplo.com
# cole em ADMIN_USUARIOS (várias pessoas: separe por vírgula) e gere o ADMIN_SEGREDO:
openssl rand -hex 32

# daqui de novo: constrói a imagem, sobe o container e recarrega o Caddy
VPS=root@187.77.253.83 ./deploy/publicar.sh
```

Conferir antes de mexer no DNS (na VPS):

```bash
docker run --rm --network clinica curlimages/curl -s -o /dev/null -w '%{http_code}\n' http://site:3000/          # 200
docker run --rm --network clinica curlimages/curl -s -o /dev/null -w '%{http_code}\n' http://site:3000/consulta  # 200
# um lead de teste: tem que responder {"ok":true,"entregue":true} e aparecer no painel em CRM → Pacientes → Novo lead
docker run --rm --network clinica curlimages/curl -s -X POST http://site:3000/api/lead -H 'Content-Type: application/json' \
  -d '{"nome":"Teste","email":"teste@exemplo.com","whatsapp":"11999999999","interesse":"Artrose","consentimento":true,"origem":"teste"}'
```

## Virar o domínio (quando o Dr. Tércio aprovar)

O `.com` é registrado na **Hostinger** e o DNS dele mora lá (hPanel → Domínios → drterciorocha.com → DNS / Nameservers).
O Registro.br não entra nisso: lá só existe o `drterciorocha.com.br`, delegado ao DNS da Hostinger, que redireciona para o
`.com` e tem e-mail (`mx1/mx2.hostinger.com.br`) — não mexer nele.

A zona do `.com` em 14/out/2026: `ALIAS @ → drterciorocha.com.cdn.hstgr.net` e `CNAME www → www.drterciorocha.com.cdn.hstgr.net`
(o CDN da Hostinger na frente do WordPress; é dele que saem os A/AAAA que o DNS mostra), `A painel → 187.77.253.83` (o painel,
criado nesse dia), `CNAME server → sac.stape.io` (tagueamento do marketing), `A ftp` e `TXT @ facebook-domain-verification=…`.
Os TTLs de `@` e `www` já são 300: a troca propaga em minutos. Na virada:

| Ação | Registro | Nome | Valor |
|---|---|---|---|
| apagar o ALIAS e criar um A | A | `@` | `187.77.253.83` |
| editar o conteúdo | CNAME | `www` | `drterciorocha.com` |
| não mexer | A `painel`, CNAME `server`, A `ftp`, TXT `@` | | |

Não há registro AAAA próprio: o IPv6 que aparece hoje vem do ALIAS e some com ele. Se um dia criarem um AAAA para a VPS
(`2a02:4780:c6:808::1`), testem antes — o Caddy em Docker precisa responder por IPv6, senão o Let's Encrypt valida por
IPv6 e falha.

Depois que o DNS propagar (`nslookup drterciorocha.com 8.8.8.8` já responde o IP da VPS), **reinicie o Caddy**
para ele pedir o certificado na hora, em vez de esperar a próxima tentativa:

```bash
ssh root@187.77.253.83 "cd /opt/atendimento-tercio && docker compose -f deploy/docker-compose.vps.yml --env-file .env restart caddy"
```

Conferir: `https://drterciorocha.com` abre com cadeado; `curl -I https://www.drterciorocha.com` → 301 para a raiz;
`curl -I https://drterciorocha.com/consulta-dr-tercio-rocha` → 301 para `/consulta` (os redirects do site antigo);
`https://drterciorocha.com/sitemap.xml` e `/llms.txt` respondem; um formulário em `/consulta` chega ao painel.
Por fim, submeter o `sitemap.xml` no Google Search Console.

Depois da virada, no app da Meta **Painel Clínica Tércio Rocha** (developers.facebook.com/apps → Configurações do app → Básico),
trocar a **URL da Política de Privacidade** de `https://igorstutz.github.io/drterciorocha/privacidade/` (a prévia, usada para
publicar o app em 16/out/2026) para `https://drterciorocha.com/privacidade` e salvar. A troca por API está desligada no app.

Prévia antes da virada: crie um registro A `novo.drterciorocha.com` → `187.77.253.83`, acrescente a
`deploy/site.caddy` um bloco `novo.drterciorocha.com { reverse_proxy site:3000 }`, publique e tire o bloco
depois. (Os canonicals continuam apontando para `drterciorocha.com` — é só para olhar.)

## Atualizar depois

```bash
VPS=root@187.77.253.83 ./deploy/publicar.sh
```

Envia o código (sem `node_modules`, builds, `.env`, git, `dados/` e os originais do site antigo), reconstrói a
imagem, troca o container e recarrega o Caddy. Os artigos **não** vêm daqui: ficam em `/opt/drterciorocha/dados/`
(volume do container), publicados pelo painel, e nenhuma publicação do código mexe neles. O build lê
`dados/artigos.json` para já sair com a lista atual.

Backup do que o painel publicou: `tar czf artigos-$(date +%F).tgz -C /opt/drterciorocha dados`.

## Dia a dia (na VPS, em `/opt/drterciorocha`)

```bash
S="docker compose -f deploy/docker-compose.vps.yml --env-file .env"
$S ps                      # o container
$S logs -f --tail=100 site # inclui "[lead] …" quando um envio ao painel falha
$S restart site
```

O Caddy é o do painel: `cd /opt/atendimento-tercio && docker compose -f deploy/docker-compose.vps.yml --env-file .env logs caddy`.
