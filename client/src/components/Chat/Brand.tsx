import { memo } from 'react';
import { TooltipAnchor } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

export const COMPANY_SITE_URL = 'https://www.tynesys.com';

/** 公司 logo 與產品名稱，連到公司網站；聊天 Header 右上角與分享頁底部共用。
 *  滑過或聚焦時以 tooltip 告知會另開視窗前往官網（同時作為連結的 aria-describedby）。 */
function Brand({ appTitle, className }: { appTitle: string; className?: string }) {
  const localize = useLocalize();
  return (
    <TooltipAnchor
      side="bottom"
      description={localize('com_ui_brand_site_new_window')}
      render={
        <a
          href={COMPANY_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={localize('com_ui_logo', { 0: appTitle })}
          className={cn(
            'text-text-primary focus-visible:ring-border-xheavy inline-flex items-center justify-center gap-3 rounded-md opacity-50 transition-opacity duration-300 ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none',
            className,
          )}
        >
          <img
            src="assets/logo.svg"
            alt=""
            className="h-9 w-auto max-w-[12rem] object-contain dark:brightness-0 dark:invert"
          />
          <span>{appTitle}</span>
        </a>
      }
    />
  );
}

export default memo(Brand);
