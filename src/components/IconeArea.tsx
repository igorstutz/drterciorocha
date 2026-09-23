/**
 * Um ícone por área de indicação. Desenhados à mão em vez de biblioteca:
 * são seis, e um pacote de ícones inteiro para seis desenhos é peso morto
 * no bundle.
 */

const desenhos: Record<string, React.ReactNode> = {
  // escudo com célula dentro — o sistema imune atacando o próprio corpo
  "doencas-autoimunes": (
    <>
      <path d="M12 3 4.5 6v6.2c0 4.3 3 8.2 7.5 9.3 4.5-1.1 7.5-5 7.5-9.3V6L12 3Z" />
      <circle cx="12" cy="11.6" r="3.1" />
      <path d="M12 8.5v6.2M8.9 11.6h6.2" />
    </>
  ),
  // curva que decai — degeneração progressiva
  "doencas-degenerativas": (
    <>
      <path d="M3 6.5c3.4 0 3.4 4 6.8 4s3.4-4 6.8-4M3 13c2.6 0 2.6 3 5.2 3s2.6-3 5.2-3" />
      <path d="M3 19c1.9 0 1.9 2 3.8 2s1.9-2 3.8-2" />
      <path d="M20.5 6.5v13" />
      <path d="m18 17 2.5 2.5L23 17" />
    </>
  ),
  // articulação: dois segmentos ósseos e o ponto de encaixe
  "lesoes-ortopedicas": (
    <>
      <path d="M7.5 3.5a2.2 2.2 0 1 0-2.6 3.4L8.6 10" />
      <path d="M4.9 6.9A2.2 2.2 0 1 0 8.3 4.3" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="m14 10.2 3.6-3.6" />
      <path d="M16.5 20.5a2.2 2.2 0 1 0 2.6-3.4L15.4 14" />
      <path d="M19.1 17.1a2.2 2.2 0 1 0-3.4 2.6" />
    </>
  ),
  // coração com traçado de pulso
  "doencas-cardiovasculares": (
    <>
      <path d="M12 20.3s-7.7-4.6-7.7-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.7 2.6c0 5.5-7.7 10.1-7.7 10.1Z" />
      <path d="M4.6 12.4h3.1l1.4-2.6 2 4.8 1.5-3.1 1.1 1.9h5.6" />
    </>
  ),
  // gota de sangue com célula
  "transtornos-hematologicos": (
    <>
      <path d="M12 3.2s5.6 6 5.6 9.7a5.6 5.6 0 1 1-11.2 0C6.4 9.2 12 3.2 12 3.2Z" />
      <circle cx="12" cy="13.4" r="2.3" />
      <path d="M9 16.6a4.4 4.4 0 0 0 1.4 1.5" />
    </>
  ),
  // símbolo de Marte
  "saude-sexual-masculina": (
    <>
      <circle cx="10" cy="14" r="5.6" />
      <path d="M14.6 9.4 20.5 3.5" />
      <path d="M15.2 3.5h5.3v5.3" />
    </>
  ),
};

export function IconeArea({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const d = desenhos[slug];
  if (!d) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}
