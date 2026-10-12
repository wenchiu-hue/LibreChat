import { memo } from 'react';
import { LogOut } from 'lucide-react';
import { Button, TooltipAnchor } from '@librechat/client';
import { useAuthContext } from '~/hooks/AuthContext';
import { useLocalize } from '~/hooks';

/**
 * 登出是重要動作，常駐在畫面上，不放進帳號選單。`rail` 是桌機側欄（品牌漸層上），
 * `drawer` 是手機抽屜的 Header，沿用旁邊按鈕的 `header-action` 外觀。
 */
function Logout({ placement, tabIndex }: { placement: 'rail' | 'drawer'; tabIndex?: number }) {
  const localize = useLocalize();
  const { logout } = useAuthContext();
  const label = localize('com_nav_log_out');
  const isRail = placement === 'rail';

  return (
    <TooltipAnchor
      side={isRail ? 'right' : 'bottom'}
      description={label}
      render={
        <Button
          size="icon"
          variant={isRail ? 'brand' : 'header-action'}
          aria-label={label}
          data-testid={isRail ? 'nav-logout-button' : 'drawer-logout-button'}
          tabIndex={tabIndex}
          className={isRail ? 'h-10 w-10' : 'shrink-0'}
          onClick={() => logout()}
        >
          {isRail ? (
            <span className="nav-rail-icon">
              <LogOut className="nav-rail-glyph h-6 w-6" aria-hidden="true" />
            </span>
          ) : (
            <LogOut className="icon-md" aria-hidden="true" />
          )}
        </Button>
      }
    />
  );
}

export default memo(Logout);
