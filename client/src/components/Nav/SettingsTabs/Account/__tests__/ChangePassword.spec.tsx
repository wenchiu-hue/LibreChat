import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import ChangePassword from '../ChangePassword';

const mockShowToast = jest.fn();
const mockMutate = jest.fn();
let mockIsLoading = false;

jest.mock('@librechat/client', () => {
  const actual = jest.requireActual('@librechat/client');
  return {
    ...actual,
    useToastContext: () => ({ showToast: mockShowToast }),
  };
});

jest.mock('~/hooks', () => ({
  useLocalize: () => (key: string) => key,
}));

jest.mock('~/data-provider', () => ({
  useChangePasswordMutation: () => ({ mutate: mockMutate, isLoading: mockIsLoading }),
}));

describe('ChangePassword', () => {
  beforeEach(() => {
    mockIsLoading = false;
    mockMutate.mockReset();
    mockShowToast.mockReset();
  });

  async function openDialog() {
    const user = userEvent.setup();
    const view = render(<ChangePassword />);
    await user.click(screen.getByRole('button', { name: 'com_ui_password_change_title' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    return { user, view };
  }

  it('keeps the cancel control usable while the request is pending', async () => {
    const { view } = await openDialog();

    mockIsLoading = true;
    view.rerender(<ChangePassword />);

    expect(screen.getByRole('button', { name: 'com_ui_cancel' })).toBeEnabled();
  });

  it('still dismisses on Escape while the request is pending', async () => {
    const { user, view } = await openDialog();

    mockIsLoading = true;
    view.rerender(<ChangePassword />);

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('rejects a confirm mismatch before calling the mutation', async () => {
    const { user } = await openDialog();

    await user.type(
      screen.getByLabelText('com_ui_password_change_current_password'),
      'old-password',
    );
    await user.type(screen.getByLabelText('com_ui_password_change_new_password'), 'new-password');
    await user.type(
      screen.getByLabelText('com_ui_password_change_confirm_password'),
      'different-password',
    );
    await user.click(screen.getByRole('button', { name: 'com_ui_password_change_save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'com_ui_password_change_error_confirm',
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
