import { memo } from 'react';
import { useMatch } from 'react-router-dom';
import Brand from './Brand';

/** 內頁共用的頂部列：logo + 產品名稱固定在右上角，高度與位置對齊聊天 Header。
 *  聊天頁的 Header 已自帶 Brand，所以在 `/c/*` 不重複顯示；小螢幕與聊天 Header 一樣隱藏。 */
function BrandBar({ appTitle }: { appTitle: string }) {
  const isChatRoute = useMatch('/c/*') != null;
  if (isChatRoute) {
    return null;
  }
  return (
    <div className="bg-surface-canvas text-text-primary hidden h-[3.25rem] w-full shrink-0 items-center justify-end p-2 font-semibold sm:flex">
      <Brand appTitle={appTitle} className="mr-4 ml-2" />
    </div>
  );
}

export default memo(BrandBar);
