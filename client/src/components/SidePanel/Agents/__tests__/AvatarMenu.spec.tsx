import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AvatarMenu } from '../Images';

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
}));

const renderMenu = (canReset: boolean) =>
  render(
    <AvatarMenu
      trigger={<button type="button" aria-label="avatar" />}
      handleFileChange={jest.fn()}
      onReset={jest.fn()}
      canReset={canReset}
    />,
  );

describe('AvatarMenu', () => {
  let clickSpy: jest.SpyInstance;

  beforeEach(() => {
    clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it('opens the file picker straight away when there is no avatar to reset', () => {
    renderMenu(false);

    fireEvent.click(screen.getByRole('button', { name: 'avatar' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps the menu once an avatar can be reset, without opening the picker', () => {
    renderMenu(true);

    fireEvent.click(screen.getByRole('button', { name: 'avatar' }));

    expect(clickSpy).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
