import { useRef } from 'react';
import { SquirclePlusIcon } from '@librechat/client';
import CustomIcon from '~/components/ui/CustomIcon';
import { useLocalize } from '~/hooks';

interface MCPIconProps {
  icon?: string;
  onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Id of the alert explaining a rejected pick. */
  errorId?: string;
}

export default function MCPIcon({ icon, onIconChange, errorId }: MCPIconProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localize = useLocalize();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 原生 button：虛線上傳框與其他上傳區一致（同 UploadDropzone），不覆寫 Button 的樣式 */}
      <button
        type="button"
        onClick={handleClick}
        aria-label={localize('com_ui_upload_icon')}
        aria-describedby={errorId}
        className="border-border-composer/41 bg-surface-secondary hover:bg-surface-hover focus-visible:ring-ring-primary flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
      >
        {icon ? (
          <CustomIcon
            src={icon}
            alt=""
            className="text-text-primary h-full w-full rounded-xl object-cover"
          />
        ) : (
          <SquirclePlusIcon />
        )}
      </button>
      <div className="flex flex-col gap-1">
        <span className="text-text-secondary text-sm">
          {localize('com_ui_icon')} {localize('com_ui_optional')}
        </span>
        <span className="text-text-secondary text-xs">{localize('com_agents_mcp_icon_size')}</span>
      </div>
      <input
        accept="image/png,.png,image/jpeg,.jpg,.jpeg,image/gif,.gif,image/webp,.webp,image/svg+xml,.svg"
        multiple={false}
        type="file"
        style={{ display: 'none' }}
        onChange={onIconChange}
        ref={fileInputRef}
      />
    </div>
  );
}
