import { memo } from 'react';
import { TooltipAnchor } from '@librechat/client';
import type React from 'react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

export const COMPANY_SITE_URL = 'https://www.tynesys.com';

/** 以文件 base 解析成絕對網址：CSS 變數裡的相對 url() 會依使用它的樣式表解析，
 *  不一定指向 public/assets；部署在子路徑時也跟著 <base href>。 */
const LOGO_MASK_STYLE = {
  '--brand-logo': `url("${new URL('assets/logo.svg', document.baseURI).href}")`,
} as React.CSSProperties;

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
            /* 淺色用品牌藍綠（surface-submit），深色維持主文字色；淺色底上 50% 太淡，平時改 80% */
            'text-surface-submit dark:text-text-primary focus-visible:ring-border-xheavy inline-flex items-center justify-center gap-3 rounded-md opacity-80 transition-opacity duration-300 ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none dark:opacity-50',
            className,
          )}
        >
          {/* logo.svg 是白色單色圖，用 mask 讓它跟著文字色（currentColor）上色 */}
          <span
            aria-hidden="true"
            data-testid="brand-logo"
            className="brand-logo-mask h-9"
            style={LOGO_MASK_STYLE}
          />
          <span>{appTitle}</span>
        </a>
      }
    />
  );
}

export default memo(Brand);
