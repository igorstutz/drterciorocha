#!/usr/bin/env bash
# Publica o site na VPS da clínica (a mesma do painel): manda o código desta máquina, reconstrói o
# container e avisa o Caddy do painel. Roda daqui, no Git Bash, na raiz do projeto:
#
#   VPS=root@187.77.253.83 ./deploy/publicar.sh              # envia + reconstrói + recarrega o Caddy
#   VPS=root@187.77.253.83 SO_ENVIAR=1 ./deploy/publicar.sh  # só envia (primeira vez, antes do .env)
#
# Variáveis: VPS (obrigatória), DESTINO (padrão /opt/drterciorocha), PAINEL (padrão /opt/atendimento-tercio,
# onde está o compose do Caddy).
set -euo pipefail

VPS="${VPS:?Informe VPS=usuario@ip (ex.: VPS=root@187.77.253.83 ./deploy/publicar.sh)}"
DESTINO="${DESTINO:-/opt/drterciorocha}"
PAINEL="${PAINEL:-/opt/atendimento-tercio}"

cd "$(dirname "$0")/.."

echo "== Enviando o site para $VPS:$DESTINO =="
# Fora do pacote: dependências, builds, segredos, o git e os originais do site antigo (só o public/ é servido).
# Na chegada, os .sh perdem o CRLF que o Windows pode ter posto. Antes de extrair, src/, public/ e
# scripts/ são apagados: o tar só acrescenta, e um arquivo removido ou movido aqui ficaria lá (uma página
# antiga ao lado da nova quebra o build). O .env e dados/ (artigos e imagens do painel) não são tocados.
tar --exclude=node_modules --exclude=.next --exclude=out --exclude=.git --exclude=.env \
    --exclude='.env*.local' --exclude=assets-originais --exclude=conteudo-original --exclude=.firecrawl \
    --exclude=tsconfig.tsbuildinfo --exclude='*.log' --exclude=./dados \
    -czf - . | ssh "$VPS" "mkdir -p '$DESTINO' && cd '$DESTINO' && rm -rf src public scripts && tar xzf - && sed -i 's/\r\$//' deploy/*.sh"

if [ "${SO_ENVIAR:-}" = "1" ]; then
  echo "Código enviado. Agora crie o .env na VPS (deploy/env.vps.exemplo) e rode sem SO_ENVIAR."
  exit 0
fi

echo "== Reconstruindo o site na VPS e recarregando o Caddy =="
ssh "$VPS" DESTINO="$DESTINO" PAINEL="$PAINEL" bash -s <<'REMOTO'
set -euo pipefail
cd "$DESTINO"
[ -f .env ] || { echo "Falta o .env em $DESTINO (veja deploy/env.vps.exemplo)"; exit 1; }
SITE="docker compose -f deploy/docker-compose.vps.yml --env-file .env"
# Artigos e imagens do painel: a pasta é do usuário do container (uid 1001), que grava nela.
mkdir -p dados && chown -R 1001:1001 dados
$SITE up -d --build
mkdir -p /opt/caddy-sites
cp deploy/site.caddy /opt/caddy-sites/drterciorocha.caddy
# O reload valida o bloco antes de aplicar: se algo estiver errado, o Caddy segue com a configuração anterior.
docker compose -f "$PAINEL/deploy/docker-compose.vps.yml" --env-file "$PAINEL/.env" exec -T caddy \
  caddy reload --config /etc/caddy/Caddyfile
$SITE ps
REMOTO

echo
echo "Pronto. Log do site:"
echo "  ssh $VPS \"cd '$DESTINO' && docker compose -f deploy/docker-compose.vps.yml --env-file .env logs -f --tail=50 site\""
