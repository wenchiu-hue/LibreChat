import { useCallback, useState } from 'react';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools/production';
import type { MouseEvent } from 'react';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

const MIN_WIDTH = 320;
const DEFAULT_WIDTH = 560;

/**
 * React Query Devtools 的右側抽屜：面板從右側滑入，花朵按鈕貼在面板左緣跟著移動，
 * 關閉時正好停在畫面右下角。面板關閉後設為 invisible（等滑出結束才生效），不會被 Tab 聚焦。
 */
export default function Drawer() {
  const localize = useLocalize();
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  /** 面板左緣的拖曳把手：往左拉變寬，寬度限制在 320px 到視窗的 90%。 */
  const handleDragStart = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = width;
      const handleMove = (moveEvent: globalThis.MouseEvent) => {
        const next = startWidth + (startX - moveEvent.clientX);
        setWidth(Math.min(Math.max(next, MIN_WIDTH), window.innerWidth * 0.9));
      };
      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [width],
  );

  return (
    <aside
      className={cn(
        'fixed top-0 right-0 z-[1000] h-full max-w-[90vw] transition-transform duration-300 ease-out motion-reduce:transition-none',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
      style={{ width }}
    >
      <button
        type="button"
        aria-label={localize('com_ui_query_devtools')}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="focus-visible:ring-focus-control absolute right-full bottom-3 mr-3 size-10 rounded-full focus-visible:ring-2 focus-visible:outline-hidden"
      >
        <img src="assets/react-query-devtools.svg" alt="" className="size-10" />
      </button>
      <div
        aria-hidden={!isOpen}
        className={cn(
          'h-full transition-all duration-300 motion-reduce:transition-none',
          isOpen ? 'visible' : 'invisible',
        )}
      >
        <ReactQueryDevtoolsPanel
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          position="right"
          onDragStart={handleDragStart}
          showCloseButton={false}
          style={{ height: '100%' }}
        />
      </div>
    </aside>
  );
}
