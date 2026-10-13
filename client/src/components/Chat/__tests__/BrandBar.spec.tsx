import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BrandBar from '../BrandBar';

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string, params?: Record<string, string>) =>
    key === 'com_ui_logo' && params?.[0] != null ? `${params[0]} Logo` : key,
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <BrandBar appTitle="TYNE AI" />
    </MemoryRouter>,
  );

describe('BrandBar', () => {
  test.each(['/agents', '/agents/all', '/skills', '/projects', '/insights', '/search'])(
    '在內頁 %s 右上角顯示 logo',
    (path) => {
      renderAt(path);
      expect(screen.getByRole('link', { name: 'TYNE AI Logo' })).toHaveAttribute(
        'href',
        'https://www.tynesys.com',
      );
    },
  );

  test.each(['/c/new', '/c/abc123'])('聊天頁 %s 由 Header 自帶 logo，不重複顯示', (path) => {
    renderAt(path);
    expect(screen.queryByRole('link', { name: 'TYNE AI Logo' })).not.toBeInTheDocument();
  });
});
