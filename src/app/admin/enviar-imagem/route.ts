import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { DIR_MIDIA } from "@/lib/acervo";
import { usuarioAtual } from "@/lib/painel/sessao";
import { slugify } from "@/lib/slug";

/**
 * Recebe a capa ou uma imagem do corpo do artigo, enviada pelo editor do painel. Toda imagem sai
 * em WebP com no máximo 2000 px de largura: foto de celular com 6 MB vira algo perto de 300 KB.
 * Fica no volume de dados (`dados/midia/`) e é servida por /midia/<arquivo>.
 */
const LIMITE_BYTES = 15 * 1024 * 1024;

function pareceImagem(b: Buffer) {
  const ascii = (i: number, n: number) => b.subarray(i, i + n).toString("latin1");
  return (
    (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) || // JPEG
    ascii(1, 3) === "PNG" ||
    (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") ||
    ascii(0, 4) === "GIF8" ||
    (ascii(4, 4) === "ftyp" && /^(avif|avis|heic|heix|mif1)/.test(ascii(8, 4)))
  );
}

export async function POST(req: Request) {
  if (!(await usuarioAtual())) {
    return Response.json({ erro: "Sua sessão expirou. Entre de novo." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const arquivo = form?.get("arquivo");
  if (!(arquivo instanceof File)) return Response.json({ erro: "Nenhuma imagem recebida." }, { status: 400 });
  if (arquivo.size > LIMITE_BYTES) {
    return Response.json({ erro: "Imagem grande demais (máximo de 15 MB)." }, { status: 413 });
  }

  const original = Buffer.from(await arquivo.arrayBuffer());
  if (!pareceImagem(original)) {
    return Response.json({ erro: "Este arquivo não é uma imagem (use JPG, PNG ou WebP)." }, { status: 415 });
  }

  let webp: Buffer;
  let largura = 0;
  let altura = 0;
  try {
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(original, { animated: false })
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    webp = data;
    largura = info.width;
    altura = info.height;
  } catch {
    return Response.json({ erro: "Não consegui ler esta imagem. Tente exportá-la de novo em JPG." }, { status: 415 });
  }

  const base = slugify(arquivo.name.replace(/\.[^.]+$/, "")).slice(0, 50) || "imagem";
  const nome = `${base}-${randomBytes(4).toString("hex")}.webp`;
  fs.mkdirSync(DIR_MIDIA, { recursive: true });
  fs.writeFileSync(path.join(DIR_MIDIA, nome), webp);

  return Response.json({ url: `/midia/${nome}`, largura, altura });
}
