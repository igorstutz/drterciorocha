import fs from "node:fs";
import path from "node:path";
import { DIR_MIDIA } from "@/lib/acervo";

/**
 * Imagens enviadas pelo painel. O Next só serve o `public/` que existia no build, então as que
 * chegam depois saem por aqui, do volume de dados. Cada nome tem um sufixo sorteado e nunca é
 * reaproveitado: o navegador pode guardar por um ano.
 */
const TIPOS: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(_: Request, { params }: { params: Promise<{ arquivo: string }> }) {
  const { arquivo } = await params;
  const tipo = TIPOS[path.extname(arquivo).toLowerCase()];
  if (!tipo || !/^[a-z0-9][a-z0-9-]*\.[a-z0-9]+$/i.test(arquivo)) return new Response(null, { status: 404 });

  try {
    const dados = await fs.promises.readFile(path.join(DIR_MIDIA, arquivo));
    return new Response(new Uint8Array(dados), {
      headers: {
        "Content-Type": tipo,
        "Content-Length": String(dados.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
