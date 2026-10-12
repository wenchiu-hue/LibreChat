import type { TStartupConfig } from 'librechat-data-provider';
import { authGlassPillClassName } from './authStyles';
import TypewriterText from './TypewriterText';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

function WelcomePanel({ startupConfig }: { startupConfig: TStartupConfig | null | undefined }) {
  const localize = useLocalize();
  /** Prefer a dedicated FAQ/docs URL so View more never doubles the privacy link
   *  already stated in LegalConsent / Footer. */
  const viewMoreUrl = startupConfig?.helpAndFaqURL?.trim() || undefined;
  /** `interface.customWelcome` 是登入後的聊天歡迎詞（可含 `{{user.name}}`），登入前不會送出，這裡固定用登入頁文案。 */
  const welcomeBody = localize('com_auth_welcome_message');

  return (
    <div className="relative flex flex-col justify-between gap-4 border-b border-white/15 px-8 py-10 md:border-r md:border-b-0 md:px-10 md:pt-8 md:pb-12">
      {/* 底圖上半部是明亮天空，上方疊淡白漸層，深藍標題與說明才看得清楚 */}
      <img
        src="assets/login_bg.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
      />
      <div
        aria-hidden
        className="from-surface-on-brand/50 via-surface-on-brand/10 to-surface-on-brand/0 pointer-events-none absolute inset-0 bg-gradient-to-b"
      />
      {/* 靠上排列：避開底圖下半部的機器人 */}
      <div className="relative flex flex-1 flex-col justify-start gap-4">
        <h2 className="text-brand-gradient-start text-2xl font-bold tracking-tight select-none sm:text-3xl">
          {localize('com_auth_hello_welcome')}
        </h2>
        <p
          className="text-brand-gradient-start/85 max-w-md text-base leading-relaxed"
          aria-label={welcomeBody}
        >
          <TypewriterText text={welcomeBody} />
        </p>
      </div>

      {viewMoreUrl != null && (
        <a href={viewMoreUrl} className={cn('relative', authGlassPillClassName)} rel="noreferrer">
          {localize('com_auth_view_more')}
        </a>
      )}
    </div>
  );
}

export default WelcomePanel;
