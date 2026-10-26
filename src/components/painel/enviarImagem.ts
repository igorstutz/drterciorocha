/** Manda uma imagem ao servidor (que a converte em WebP) e devolve o endereço dela no site. */
export async function enviarImagem(arquivo: File): Promise<string> {
  const dados = new FormData();
  dados.append("arquivo", arquivo);
  let resposta: Response;
  try {
    resposta = await fetch("/admin/enviar-imagem", { method: "POST", body: dados });
  } catch {
    throw new Error("Não consegui enviar a imagem. Confira a internet e tente de novo.");
  }
  const corpo = (await resposta.json().catch(() => ({}))) as { url?: string; erro?: string };
  if (!resposta.ok || !corpo.url) throw new Error(corpo.erro || "Não consegui enviar a imagem.");
  return corpo.url;
}

export const TIPOS_DE_IMAGEM = "image/jpeg,image/png,image/webp,image/avif,image/gif";
