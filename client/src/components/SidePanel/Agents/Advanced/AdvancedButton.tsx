import React from 'react';
import { Button } from '@librechat/client';
import { useLocalize } from '~/hooks';
import { Panel } from '~/common';

interface AdvancedButtonProps {
  setActivePanel: (panel: Panel) => void;
}

const AdvancedButton: React.FC<AdvancedButtonProps> = ({ setActivePanel }) => {
  const localize = useLocalize();

  return (
    <Button
      variant="subtle"
      shape="theme"
      onClick={() => setActivePanel(Panel.advanced)}
      aria-label={localize('com_ui_advanced')}
      className="h-9 w-full px-3"
    >
      {localize('com_ui_advanced')}
    </Button>
  );
};

export default AdvancedButton;
