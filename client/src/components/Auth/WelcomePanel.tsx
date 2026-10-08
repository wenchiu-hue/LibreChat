import type { TStartupConfig } from 'librechat-data-provider';
import { authGlassPillClassName } from './authStyles';
import TypewriterText from './TypewriterText';
import { DEFAULT_APP_TITLE } from '~/utils';
import { useLocalize } from '~/hooks';

function WelcomePanel({ startupConfig }: { startupConfig: TStartupConfig | null | undefined }) {
  const localize = useLocalize();
  /** Prefer a dedicated FAQ/docs URL so View more never doubles the privacy link
   *  already stated in LegalConsent / Footer. */
  const viewMoreUrl = startupConfig?.helpAndFaqURL?.trim() || undefined;
  const welcomeBody = startupConfig?.customWelcome?.trim() || localize('com_auth_welcome_message');
  const appTitle = startupConfig?.appTitle?.trim() || DEFAULT_APP_TITLE;

  return (
    <div className="relative flex flex-col justify-between gap-8 border-b border-white/15 px-8 py-10 md:border-r md:border-b-0 md:px-10 md:py-12">
      <div className="flex h-11 items-center gap-4">
        <img
          src="assets/logo.svg"
          className="h-11 w-auto max-w-[14rem] object-contain brightness-0 invert"
          alt={localize('com_ui_logo', { 0: appTitle })}
        />
        <span className="text-lg font-semibold tracking-wide text-white/90 sm:text-xl">
          {appTitle}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        <h2
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          style={{ userSelect: 'none' }}
        >
          {localize('com_auth_hello_welcome')}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-white/80" aria-label={welcomeBody}>
          <TypewriterText text={welcomeBody} />
        </p>
      </div>

      {viewMoreUrl != null && (
        <a href={viewMoreUrl} className={authGlassPillClassName} rel="noreferrer">
          {localize('com_auth_view_more')}
        </a>
      )}
    </div>
  );
}

export default WelcomePanel;
