import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Turnstile } from '@marsidev/react-turnstile';
import { ThemeContext, SecretInput, Spinner, Button, Input, isDark } from '@librechat/client';
import type { TLoginUser, TStartupConfig } from 'librechat-data-provider';
import type { TAuthContext } from '~/common';
import {
  authGlassInputClassName,
  authGlassLabelClassName,
  authGlassSubmitClassName,
  authGlassSecretInputClassName,
  authGlassSecretButtonClassName,
  authGlassSecretControlsClassName,
  authGlassTextLinkClassName,
} from './authStyles';
import {
  getRememberedLoginEmail,
  setRememberedLoginEmail,
  clearRememberedLoginEmail,
} from '~/utils/rememberLoginEmail';
import { useResendVerificationEmail, useGetStartupConfig } from '~/data-provider';
import { validateEmail } from '~/utils';
import { useLocalize } from '~/hooks';

type TLoginFormProps = {
  onSubmit: (data: TLoginUser) => void;
  startupConfig: TStartupConfig;
  error: Pick<TAuthContext, 'error'>['error'];
  setError: Pick<TAuthContext, 'setError'>['setError'];
};

const LoginForm: React.FC<TLoginFormProps> = ({ onSubmit, startupConfig, error, setError }) => {
  const localize = useLocalize();
  const { theme } = useContext(ThemeContext);
  const rememberedEmail = getRememberedLoginEmail();
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginUser>({
    defaultValues: {
      email: rememberedEmail ?? '',
      password: '',
    },
  });
  const [showResendLink, setShowResendLink] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(rememberedEmail != null);

  const { data: config } = useGetStartupConfig();
  const useUsernameLogin = config?.ldap?.username;
  const validTheme = isDark(theme) ? 'dark' : 'light';
  const requireCaptcha = Boolean(startupConfig.turnstile?.siteKey);
  /** The `webauthn` token lets the browser offer a passkey inline in this field's autofill. */
  const baseAutoComplete = useUsernameLogin ? 'username' : 'email';
  const emailAutoComplete = startupConfig.passkeyLoginEnabled
    ? `${baseAutoComplete} webauthn`
    : baseAutoComplete;

  useEffect(() => {
    if (error && error.includes('422') && !showResendLink) {
      setShowResendLink(true);
    }
  }, [error, showResendLink]);

  useEffect(() => {
    if (rememberedEmail) {
      setValue('email', rememberedEmail);
    }
  }, [rememberedEmail, setValue]);

  const resendLinkMutation = useResendVerificationEmail({
    onMutate: () => {
      setError(undefined);
      setShowResendLink(false);
    },
  });

  if (!startupConfig) {
    return null;
  }

  const renderError = (fieldName: string) => {
    const errorMessage = errors[fieldName]?.message;
    return errorMessage ? (
      <span role="alert" className="mt-1 text-sm text-red-200">
        {String(errorMessage)}
      </span>
    ) : null;
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (!email) {
      return setShowResendLink(false);
    }
    resendLinkMutation.mutate({ email });
  };

  const handleFormSubmit = (data: TLoginUser) => {
    if (rememberMe) {
      setRememberedLoginEmail(data.email);
    } else {
      clearRememberedLoginEmail();
    }
    onSubmit(data);
  };

  return (
    <>
      {showResendLink && (
        <div className="mt-2 rounded-md border border-emerald-300/40 bg-emerald-500/15 px-3 py-2 text-sm text-white/90">
          {localize('com_auth_email_verification_resend_prompt')}
          <button
            type="button"
            className={`${authGlassTextLinkClassName} ml-2 disabled:cursor-not-allowed disabled:opacity-60`}
            onClick={handleResendEmail}
            disabled={resendLinkMutation.isLoading}
          >
            {localize('com_auth_email_resend_link')}
          </button>
        </div>
      )}
      <form
        className="mt-2"
        aria-label="Login form"
        method="POST"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="mb-4">
          <label htmlFor="email" className={authGlassLabelClassName}>
            {useUsernameLogin
              ? localize('com_auth_username').replace(/ \(.*$/, '')
              : localize('com_auth_email_address')}
          </label>
          <Input
            colorTransition
            type="text"
            id="email"
            autoComplete={emailAutoComplete}
            aria-label={localize('com_auth_email')}
            {...register('email', {
              required: localize('com_auth_email_required'),
              maxLength: { value: 120, message: localize('com_auth_email_max_length') },
              validate: useUsernameLogin
                ? undefined
                : (value) => validateEmail(value, localize('com_auth_email_pattern')),
            })}
            aria-invalid={!!errors.email}
            className={authGlassInputClassName}
            placeholder={useUsernameLogin ? '' : 'name@mail.com'}
          />
          {renderError('email')}
        </div>
        <div className="mb-2">
          <label htmlFor="password" className={authGlassLabelClassName}>
            {localize('com_auth_password')}
          </label>
          <SecretInput
            colorTransition
            id="password"
            autoComplete="current-password"
            aria-label={localize('com_auth_password')}
            {...register('password', {
              required: localize('com_auth_password_required'),
              minLength: {
                value: startupConfig?.minPasswordLength || 8,
                message: localize('com_auth_password_min_length'),
              },
              maxLength: { value: 128, message: localize('com_auth_password_max_length') },
            })}
            aria-invalid={!!errors.password}
            className={authGlassSecretInputClassName}
            placeholder="********"
            controlsClassName={authGlassSecretControlsClassName}
            buttonClassName={authGlassSecretButtonClassName}
          />
          {renderError('password')}
        </div>

        <div className="mb-4 flex items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-white/90">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => {
                const checked = event.target.checked;
                setRememberMe(checked);
                if (!checked) {
                  clearRememberedLoginEmail();
                }
              }}
              className="size-4 rounded border-white/40 bg-white/10 text-white focus:ring-white/40"
              data-testid="remember-me"
            />
            {localize('com_auth_remember_me')}
          </label>
          {startupConfig.passwordResetEnabled && (
            <a href="/forgot-password" className={authGlassTextLinkClassName}>
              {localize('com_auth_password_forgot')}
            </a>
          )}
        </div>

        {requireCaptcha && (
          <div className="my-4 flex justify-center">
            <Turnstile
              siteKey={startupConfig.turnstile!.siteKey}
              options={{
                ...startupConfig.turnstile!.options,
                theme: validTheme,
              }}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
        )}

        <div className="mt-2">
          <Button
            aria-label={localize('com_auth_continue')}
            data-testid="login-button"
            type="submit"
            disabled={(requireCaptcha && !turnstileToken) || isSubmitting}
            variant="submit"
            className={authGlassSubmitClassName}
          >
            {isSubmitting ? <Spinner /> : localize('com_auth_continue')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
