import type { ReactNode, ReactElement } from 'react';
import { TooltipAnchor } from './Tooltip';
import { cn } from '~/utils';

interface DisabledReasonProps {
  /** 為 true 時才包外層並顯示原因；否則原樣渲染 children。 */
  disabled: boolean;
  /** 已在地化的原因說明，顯示在 tooltip 裡。 */
  reason: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children: ReactNode;
}

/**
 * 說明 disabled 控制項為什麼不能按。共用 `Button` 在 disabled 時是 `pointer-events-none`，
 * 原生 disabled 按鈕也收不到 hover 與焦點，所以由外層 span 擔任 tooltip anchor：
 * 它接住 hover、可用 Tab 聚焦，並顯示 `not-allowed` 游標。
 */
export function DisabledReason({
  disabled,
  reason,
  side = 'top',
  className,
  children,
}: DisabledReasonProps): ReactElement {
  if (!disabled || reason === '') {
    return <>{children}</>;
  }
  return (
    <TooltipAnchor
      description={reason}
      side={side}
      tabIndex={0}
      className={cn(
        'inline-flex cursor-not-allowed rounded-lg [&_*]:pointer-events-none',
        className,
      )}
      render={<span />}
    >
      {children}
    </TooltipAnchor>
  );
}
