import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from '../Footer';

jest.mock('react-gtm-module', () => ({
  __esModule: true,
  default: { initialize: jest.fn() },
}));

jest.mock('~/data-provider', () => ({
  useGetStartupConfig: jest.fn(() => ({ data: undefined, isFetching: false, error: null })),
}));

const mockTranslations: Record<string, string> = {
  com_ui_logo: '{{0}} Logo',
  com_ui_latest_footer: 'Every AI for Everyone.',
  com_ui_privacy_policy: 'Privacy policy',
  com_ui_terms_of_service: 'Terms of service',
};

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string, params?: Record<string, string>) => {
    const template = mockTranslations[key] ?? key;
    if (params?.[0] != null) {
      return template.replace('{{0}}', params[0]);
    }
    return template;
  },
}));

describe('Footer', () => {
  test('shows the company logo and title linking to the company site', () => {
    render(<Footer startupConfig={null} />);
    const link = screen.getByRole('link', { name: 'TYNE AI Logo' });
    expect(link).toHaveAttribute('href', 'https://www.tynesys.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('img')).toHaveAttribute('src', 'assets/logo.svg');
    expect(link).toHaveTextContent('TYNE AI');
  });

  test('does not show LibreChat version or policy links on the landing footer', () => {
    render(
      <Footer
        startupConfig={{
          interface: {
            privacyPolicy: { externalUrl: 'https://example.com/privacy' },
            termsOfService: { externalUrl: 'https://example.com/terms' },
          },
        }}
      />,
    );

    expect(screen.queryByRole('link', { name: /LibreChat/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Privacy policy' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Terms of service' })).not.toBeInTheDocument();
  });

  test('opens custom footer markdown links in a new tab once a conversation starts', () => {
    render(
      <Footer
        configuredOnly
        startupConfig={{ customFooter: '[Docs](https://example.com/docs)' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('places no bar in a conversation whose deployment configured only policies', () => {
    const { container } = render(
      <Footer
        configuredOnly
        startupConfig={{
          interface: {
            privacyPolicy: { externalUrl: 'https://example.com/privacy' },
            termsOfService: { externalUrl: 'https://example.com/terms' },
          },
        }}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
