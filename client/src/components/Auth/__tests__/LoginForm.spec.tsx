import userEvent from '@testing-library/user-event';
import type { TStartupConfig } from 'librechat-data-provider';
import * as endpointQueries from '~/data-provider/Endpoints/queries';
import * as miscDataProvider from '~/data-provider/Misc/queries';
import * as authMutations from '~/data-provider/Auth/mutations';
import { render, getByTestId } from 'test/layout-test-utils';
import * as authQueries from '~/data-provider/Auth/queries';
import Login from '../LoginForm';

jest.mock('librechat-data-provider/react-query');

const mockLogin = jest.fn();

const mockStartupConfig: TStartupConfig = {
  socialLogins: ['google', 'facebook', 'openid', 'github', 'discord', 'saml'],
  discordLoginEnabled: true,
  facebookLoginEnabled: true,
  githubLoginEnabled: true,
  googleLoginEnabled: true,
  openidLoginEnabled: true,
  passkeyLoginEnabled: false,
  appleLoginEnabled: false,
  openidLabel: 'Test OpenID',
  openidImageUrl: 'http://test-server.com',
  openidAutoRedirect: false,
  samlLoginEnabled: true,
  samlLabel: 'Test SAML',
  samlImageUrl: 'http://test-server.com',
  registrationEnabled: true,
  emailLoginEnabled: true,
  socialLoginEnabled: true,
  passwordResetEnabled: true,
  serverDomain: 'mock-server',
  appTitle: '',
  ldap: {
    enabled: false,
  },
  emailEnabled: false,
  showBirthdayIcon: false,
  helpAndFaqURL: '',
  sharedLinksEnabled: true,
  publicSharedLinksEnabled: true,
  allowAccountDeletion: true,
  allowEmailChange: true,
  passwordChangeEnabled: true,
};

const setup = ({
  useGetUserQueryReturnValue = {
    isLoading: false,
    isError: false,
    data: {},
  },
  useLoginUserReturnValue = {
    isLoading: false,
    isError: false,
    mutate: jest.fn(),
    data: {},
    isSuccess: false,
  },
  useRefreshTokenMutationReturnValue = {
    isLoading: false,
    isError: false,
    mutate: jest.fn(),
    data: {
      token: 'mock-token',
      user: {},
    },
  },
  useGetStartupConfigReturnValue = {
    isLoading: false,
    isError: false,
    data: mockStartupConfig,
  },
  useGetBannerQueryReturnValue = {
    isLoading: false,
    isError: false,
    data: {},
  },
} = {}) => {
  const mockUseLoginUser = jest
    .spyOn(authMutations, 'useLoginUserMutation')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useLoginUserReturnValue);
  const mockUseGetUserQuery = jest
    .spyOn(authQueries, 'useGetUserQuery')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetUserQueryReturnValue);
  const mockUseGetStartupConfig = jest
    .spyOn(endpointQueries, 'useGetStartupConfig')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetStartupConfigReturnValue);
  const mockUseRefreshTokenMutation = jest
    .spyOn(authMutations, 'useRefreshTokenMutation')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useRefreshTokenMutationReturnValue);
  const mockUseGetBannerQuery = jest
    .spyOn(miscDataProvider, 'useGetBannerQuery')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetBannerQueryReturnValue);
  return {
    mockUseLoginUser,
    mockUseGetUserQuery,
    mockUseGetStartupConfig,
    mockUseRefreshTokenMutation,
    mockUseGetBannerQuery,
  };
};

beforeEach(() => {
  setup();
});

test('renders login form', () => {
  const { getByLabelText } = render(
    <Login
      onSubmit={mockLogin}
      startupConfig={mockStartupConfig}
      error={undefined}
      setError={jest.fn()}
    />,
  );
  expect(getByLabelText(/email/i)).toHaveClass('h-auto');
  expect(getByLabelText(/password/i)).toBeInTheDocument();
});

test('submits login form', async () => {
  const { getByLabelText } = render(
    <Login
      onSubmit={mockLogin}
      startupConfig={mockStartupConfig}
      error={undefined}
      setError={jest.fn()}
    />,
  );
  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  const submitButton = getByTestId(document.body, 'login-button');

  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password');
  await userEvent.click(submitButton);

  expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
});

test('displays validation error messages', async () => {
  const { getByLabelText, getByText } = render(
    <Login
      onSubmit={mockLogin}
      startupConfig={mockStartupConfig}
      error={undefined}
      setError={jest.fn()}
    />,
  );
  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  const submitButton = getByTestId(document.body, 'login-button');

  await userEvent.type(emailInput, 'test');
  await userEvent.type(passwordInput, 'pass');
  await userEvent.click(submitButton);

  expect(getByText(/You must enter a valid email address/i)).toBeInTheDocument();
  expect(getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
});

test('remember me persists email for the next visit', async () => {
  localStorage.clear();
  const first = render(
    <Login
      onSubmit={mockLogin}
      startupConfig={mockStartupConfig}
      error={undefined}
      setError={jest.fn()}
    />,
  );

  const emailInput = first.getByLabelText(/email/i);
  const passwordInput = first.getByLabelText(/password/i);
  const rememberMe = first.getByTestId('remember-me');
  const submitButton = getByTestId(document.body, 'login-button');

  await userEvent.type(emailInput, 'remember@example.com');
  await userEvent.type(passwordInput, 'password12');
  await userEvent.click(rememberMe);
  await userEvent.click(submitButton);

  expect(localStorage.getItem('librechat_remember_login_email')).toBe('remember@example.com');
  first.unmount();

  const second = render(
    <Login
      onSubmit={mockLogin}
      startupConfig={mockStartupConfig}
      error={undefined}
      setError={jest.fn()}
    />,
  );

  expect(second.getByLabelText(/email/i)).toHaveValue('remember@example.com');
  expect(second.getByTestId('remember-me')).toBeChecked();
});

test('unchecking remember me clears the stored email', async () => {
  localStorage.setItem('librechat_remember_login_email', 'keep@example.com');
  const { getByTestId } = render(
    <Login
      onSubmit={mockLogin}
      startupConfig={mockStartupConfig}
      error={undefined}
      setError={jest.fn()}
    />,
  );

  const rememberMe = getByTestId('remember-me');
  expect(rememberMe).toBeChecked();
  await userEvent.click(rememberMe);

  expect(localStorage.getItem('librechat_remember_login_email')).toBeNull();
});
