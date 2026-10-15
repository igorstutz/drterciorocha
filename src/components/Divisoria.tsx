/**
 * Divisória ornamental entre seções de fundo claro: dois fios do azul ao dourado que
 * se desenham a partir do selo central, e o selo com uma célula — núcleo dourado e um
 * ponto azul em órbita. Anima só na tela (data-anima → classe em-vista, AnimacaoEmVista).
 * Estilo em globals.css (.u-divisoria).
 */
export function Divisoria({ className = "" }: { className?: string }) {
  return (
    <div role="separator" aria-hidden="true" className={`u-container ${className}`}>
      <div data-anima className="u-divisoria">
        <span className="u-divisoria-fio" />
        <span className="u-divisoria-selo">
          <span className="u-divisoria-orbita" />
          <svg viewBox="0 0 24 24" className="u-divisoria-nucleo relative h-5 w-5" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
            <circle cx="12" cy="12" r="3.4" fill="currentColor" />
            <circle cx="16.4" cy="8.2" r="1" fill="currentColor" opacity="0.7" />
            <circle cx="7.8" cy="15.6" r="0.8" fill="currentColor" opacity="0.6" />
          </svg>
        </span>
        <span className="u-divisoria-fio" />
      </div>
    </div>
  );
}
