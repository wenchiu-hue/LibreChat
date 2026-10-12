import { render, screen, fireEvent } from '@testing-library/react';
import Drawer from '../Drawer';

jest.mock('@tanstack/react-query-devtools/production', () => ({
  ReactQueryDevtoolsPanel: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="query-devtools-panel" data-open={String(isOpen)} />
  ),
}));

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) =>
    key === 'com_ui_query_devtools' ? 'React Query Devtools' : key,
}));

describe('QueryDevtools Drawer', () => {
  it('starts closed, parked off-screen with the toggle left in the corner', () => {
    render(<Drawer />);

    const toggle = screen.getByRole('button', { name: 'React Query Devtools' });
    const drawer = toggle.closest('aside') as HTMLElement;
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(drawer).toHaveClass('translate-x-full');
    expect(screen.getByTestId('query-devtools-panel').parentElement).toHaveClass('invisible');
  });

  it('slides the panel in from the right and carries the toggle with it', () => {
    render(<Drawer />);

    const toggle = screen.getByRole('button', { name: 'React Query Devtools' });
    fireEvent.click(toggle);

    const drawer = toggle.closest('aside') as HTMLElement;
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(drawer).toHaveClass('translate-x-0');
    expect(drawer).toContainElement(toggle);
    expect(screen.getByTestId('query-devtools-panel')).toHaveAttribute('data-open', 'true');
    expect(screen.getByTestId('query-devtools-panel').parentElement).toHaveClass('visible');

    fireEvent.click(toggle);
    expect(drawer).toHaveClass('translate-x-full');
  });
});
