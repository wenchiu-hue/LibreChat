import type { TStartupConfig } from 'librechat-data-provider';
import { DEFAULT_APP_TITLE } from '~/utils';
import { useLocalize } from '~/hooks';

/** 登入頁卡片上方置中的 logo 與產品名稱。 */
function AuthBrand({ startupConfig }: { startupConfig: TStartupConfig | null | undefined }) {
  const localize = useLocalize();
  const appTitle = startupConfig?.appTitle?.trim() || DEFAULT_APP_TITLE;

  return (
    <div className="mb-6 flex h-11 items-center justify-center gap-4">
      <img
        src="assets/logo.svg"
        className="h-11 w-auto max-w-[14rem] object-contain brightness-0 invert"
        alt={localize('com_ui_logo', { 0: appTitle })}
      />
      <span className="text-lg font-semibold tracking-wide text-white/90 sm:text-xl">
        {appTitle}
      </span>
    </div>
  );
}

export default AuthBrand;
