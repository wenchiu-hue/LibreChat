import { useState } from 'react';
import {
  Button,
  Label,
  OGDialog,
  OGDialogClose,
  OGDialogContent,
  OGDialogDescription,
  OGDialogFooter,
  OGDialogHeader,
  OGDialogTitle,
  OGDialogTrigger,
  SecretInput,
  Spinner,
  useToastContext,
} from '@librechat/client';
import type { PasswordChangeErrorCode } from 'librechat-data-provider';
import type { FormEvent } from 'react';
import type { TranslationKeys } from '~/hooks';
import { useChangePasswordMutation } from '~/data-provider';
import { getResponseErrorCode } from '~/utils';
import { useLocalize } from '~/hooks';

const errorKeys: Partial<Record<PasswordChangeErrorCode, TranslationKeys>> = {
  account_modified: 'com_ui_password_change_error_modified',
  confirm_mismatch: 'com_ui_password_change_error_confirm',
  current_password_invalid: 'com_ui_password_change_error_password',
  invalid_request: 'com_ui_password_change_error_invalid',
  local_account_required: 'com_ui_password_change_error_local',
  password_change_disabled: 'com_ui_password_change_error_disabled',
  same_password: 'com_ui_password_change_error_same',
};

export default function ChangePassword() {
  const localize = useLocalize();
  const { showToast } = useToastContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorKey, setErrorKey] = useState<TranslationKeys>();
  const mutation = useChangePasswordMutation({
    onSuccess: (data) => {
      if (data.token) {
        window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: data.token }));
      }
      showToast({ message: localize('com_ui_password_change_success') });
      setIsOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorKey(undefined);
    },
    onError: (error) => {
      const code = getResponseErrorCode<PasswordChangeErrorCode>(error);
      setErrorKey(
        (code ? errorKeys[code] : undefined) ?? 'com_ui_password_change_error_unexpected',
      );
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setErrorKey(undefined);
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorKey(undefined);
    if (newPassword !== confirmPassword) {
      setErrorKey('com_ui_password_change_error_confirm');
      return;
    }
    if (currentPassword === newPassword) {
      setErrorKey('com_ui_password_change_error_same');
      return;
    }
    mutation.mutate({ currentPassword, newPassword, confirmPassword });
  };

  const canSubmit =
    Boolean(currentPassword) &&
    Boolean(newPassword) &&
    Boolean(confirmPassword) &&
    !mutation.isLoading;

  return (
    <OGDialog open={isOpen} onOpenChange={handleOpenChange}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <Label id="change-password-label">
            {localize('com_ui_settings_label_change_password')}
          </Label>
          <p className="text-text-secondary text-xs">
            {localize('com_ui_password_change_description_short')}
          </p>
        </div>
        <OGDialogTrigger asChild>
          <Button aria-label={localize('com_ui_password_change_title')} variant="outline">
            {localize('com_ui_password_change_button')}
          </Button>
        </OGDialogTrigger>
      </div>
      <OGDialogContent
        id="change-password-dialog"
        className="w-11/12 max-w-md"
        showCloseButton={false}
      >
        <OGDialogHeader>
          <OGDialogTitle>{localize('com_ui_password_change_title')}</OGDialogTitle>
          <OGDialogDescription>
            {localize('com_ui_password_change_description')}
          </OGDialogDescription>
        </OGDialogHeader>
        <form id="change-password-form" className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="current-password" className="font-medium">
              {localize('com_ui_password_change_current_password')}
            </Label>
            <SecretInput
              id="current-password"
              autoComplete="current-password"
              maxLength={128}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={mutation.isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="font-medium">
              {localize('com_ui_password_change_new_password')}
            </Label>
            <SecretInput
              id="new-password"
              autoComplete="new-password"
              maxLength={128}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={mutation.isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="font-medium">
              {localize('com_ui_password_change_confirm_password')}
            </Label>
            <SecretInput
              id="confirm-password"
              autoComplete="new-password"
              maxLength={128}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={mutation.isLoading}
              required
            />
          </div>
          {errorKey && (
            <p id="change-password-error" className="text-text-destructive text-sm" role="alert">
              {localize(errorKey)}
            </p>
          )}
        </form>
        <OGDialogFooter>
          <OGDialogClose asChild>
            <Button type="button" variant="outline">
              {localize('com_ui_cancel')}
            </Button>
          </OGDialogClose>
          <Button type="submit" form="change-password-form" variant="submit" disabled={!canSubmit}>
            {mutation.isLoading && <Spinner className="size-4" aria-hidden="true" />}
            {localize(
              mutation.isLoading ? 'com_ui_password_change_saving' : 'com_ui_password_change_save',
            )}
          </Button>
        </OGDialogFooter>
      </OGDialogContent>
    </OGDialog>
  );
}
