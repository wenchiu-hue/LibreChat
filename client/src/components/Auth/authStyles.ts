/** Shared glass-surface field styles for Auth forms on the branded shell.
 *  Uses `auth-glass-input` (not `webkit-dark-styles`) so focus/autofill fill
 *  the full border box instead of clipping to the content box. */
export const authGlassInputClassName =
  'auth-glass-input peer h-auto w-full rounded-xl border border-white/30 bg-white/10 px-3.5 py-3 text-white placeholder:text-white/50 duration-200 focus:bg-white/15 focus-visible:bg-white/15 focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none';

export const authGlassSecretInputClassName = `${authGlassInputClassName} pr-12`;

export const authGlassLabelClassName = 'mb-1.5 block text-sm font-medium text-white/90';

export const authGlassSecretButtonClassName =
  'relative z-10 size-9 cursor-pointer rounded-xl text-white/70 transition-all duration-200 hover:bg-white/15 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50';

/** Keep the reveal control above the input hit-target on glass fields. */
export const authGlassSecretControlsClassName =
  'pointer-events-none absolute inset-y-0 right-2 z-10 flex items-center gap-0.5 [&_button]:pointer-events-auto';

/** Primary solid pill (Continue / Login). */
export const authGlassSubmitClassName =
  'h-12 w-full cursor-pointer rounded-full border-0 bg-white font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_0_12px_rgba(133,255,207,0.55)] active:translate-y-0 active:scale-[0.98] active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(133_255_207)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm';

/** Outline pill (Sign up). */
export const authGlassOutlineClassName =
  'inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full border border-white/70 bg-transparent px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.35)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

/** Compact solid pill (View more). */
export const authGlassPillClassName =
  'inline-flex w-fit cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(133,255,207,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(133_255_207)]';

/** OAuth / passkey row buttons. */
export const authGlassSocialClassName =
  'flex w-full cursor-pointer items-center space-x-3 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none';

/** Text-style actions (Forgot password, Back to login). */
export const authGlassTextLinkClassName =
  'inline-flex cursor-pointer p-1 text-sm font-medium text-white/90 underline decoration-transparent transition-all duration-200 hover:text-white hover:decoration-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50';

/** Footer company link: plain text by default, outline pill button on hover. */
export const authGlassFooterLinkClassName =
  'inline-flex cursor-pointer items-center justify-center rounded-full border border-transparent px-5 py-2 text-sm font-medium text-white/90 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 hover:font-semibold hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.35)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';
