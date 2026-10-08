/** 登入頁原生元素（<label>、<a>、<button>）用的玻璃樣式；共用元件改用 Input / SecretInput 的
 *  `glass` 與 Button 的 `glass-submit`、`glass-link` variant。 */
export const authGlassLabelClassName = 'mb-1.5 block text-sm font-medium text-white/90';

/** Outline pill (Sign up). */
export const authGlassOutlineClassName =
  'inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-white/70 bg-transparent px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:glow-brand-soft active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

/** Compact solid pill (View more). */
export const authGlassPillClassName =
  'inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-gradient-start shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:glow-brand active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight';

/** OAuth / passkey row buttons. */
export const authGlassSocialClassName =
  'flex w-full cursor-pointer items-center space-x-3 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 hover:glow-brand-soft active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none';

/** Text-style actions (Forgot password, Back to login). */
export const authGlassTextLinkClassName =
  'inline-flex cursor-pointer p-1 text-sm font-medium text-white/90 underline decoration-transparent transition-all duration-200 hover:text-white hover:decoration-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50';

/** Footer company link: plain text by default, outline pill button on hover. */
export const authGlassFooterLinkClassName =
  'inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent px-5 py-2 text-sm font-medium text-white/90 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 hover:font-semibold hover:text-white hover:glow-brand-soft active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';
