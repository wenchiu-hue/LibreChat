import { ThemeSelector } from '@librechat/client';
import { TStartupConfig } from 'librechat-data-provider';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { hasPublishedPolicies } from '~/utils/policies';
import { TranslationKeys, useLocalize } from '~/hooks';
import SocialLoginRender from './SocialLoginRender';
import WelcomePanel from './WelcomePanel';
import LegalConsent from './LegalConsent';
import { Banner } from '../Banners';
import Footer from './Footer';
import { cn } from '~/utils';

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
  const localize = useLocalize();

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const isRegister = pathname.includes('register');
  const isLogin = !pathname.includes('2fa') && pathname.includes('login');
  const showsSocialLogin = isLogin || isRegister;
  /** Both ways in state it, rather than the layout guessing which of them can
   *  create an account. That guess is not available here: account creation
   *  also happens on a first provider sign-in, on a first LDAP sign-in through
   *  the ordinary form, and is gated server-side by ALLOW_SOCIAL_REGISTRATION,
   *  which the startup payload does not carry. The sentence is about
   *  continuing, which is what both screens do, and it names the same policies
   *  the footer bar linked, so a screen states them once. */
  const hasPolicies = hasPublishedPolicies(startupConfig);
  /** Registration states it under its own submit button, where it is read
   *  before the account is created rather than below however many provider
   *  buttons a deployment configured, and it renders that form only once the
   *  config has loaded without error. The login screen has no submit button of
   *  its own to sit under, so there the layout states it below the providers,
   *  for as long as it knows the policies: a background refetch must not swap
   *  the sentence for the bar and back. */
  const registrationStatesConsent =
    isRegister && hasPolicies && !hasStartupConfigError && !isFetching;
  const statesConsentBelowProviders = isLogin && hasPolicies;
  /** The bar is dropped exactly when the sentence is on the screen, so a
   *  reader never meets both and never meets neither. */
  const statesConsent = registrationStatesConsent || statesConsentBelowProviders;
  const isTwoFactorSetup = pathname === '/login/2fa/setup';
  const showWelcomePanel = !isTwoFactorSetup;

  const DisplayError = () => {
    if (hasStartupConfigError) {
      return (
        <div className="relative z-20 mx-auto w-full max-w-md px-4 pt-4">
          <ErrorMessage>{localize('com_auth_error_login_server')}</ErrorMessage>
        </div>
      );
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <div className="relative z-20 mx-auto w-full max-w-md px-4 pt-4">
          <ErrorMessage>
            {localize('com_auth_error_invalid_reset_token')}{' '}
            <a
              className="font-semibold text-white underline hover:text-white/90"
              href="/forgot-password"
            >
              {localize('com_auth_click_here')}
            </a>{' '}
            {localize('com_auth_to_try_again')}
          </ErrorMessage>
        </div>
      );
    } else if (error != null && error) {
      return (
        <div className="relative z-20 mx-auto w-full max-w-md px-4 pt-4">
          <ErrorMessage>{localize(error)}</ErrorMessage>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#071533] via-[#0a4d6e] to-[#0d6b5c]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-sky-400/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-teal-400/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '28px 28px, 48px 48px',
          backgroundPosition: '0 0, 12px 18px',
        }}
      />

      <div className="relative z-10">
        <Banner />
      </div>
      <DisplayError />

      <div className="absolute bottom-0 left-0 z-20 m-4">
        <ThemeSelector onDarkSurface />
      </div>

      <main className="relative z-10 flex grow items-center justify-center px-4 py-10">
        <div
          className={cn(
            'w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl',
            isTwoFactorSetup ? 'max-w-lg' : 'max-w-5xl md:grid md:grid-cols-2',
          )}
        >
          {showWelcomePanel && <WelcomePanel startupConfig={startupConfig} />}
          <div
            className={cn(
              'flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10',
              isTwoFactorSetup ? 'w-full' : '',
            )}
          >
            {!hasStartupConfigError && !isFetching && header && (
              <h1
                className="mb-4 text-center text-2xl font-semibold text-white"
                style={{ userSelect: 'none' }}
              >
                {header}
              </h1>
            )}
            {children}
            {showsSocialLogin && (
              <SocialLoginRender startupConfig={startupConfig} showPasskey={isLogin} />
            )}
            {statesConsentBelowProviders && <LegalConsent startupConfig={startupConfig} />}
          </div>
        </div>
      </main>
      {!statesConsent && (
        <div className="relative z-10">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default AuthLayout;
