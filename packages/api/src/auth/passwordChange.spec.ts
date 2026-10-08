import type { PasswordChangeDeps } from './passwordChange';
import { createPasswordChangeService, resolvePasswordChangeSettings } from './passwordChange';

function makeDeps(overrides: Partial<PasswordChangeDeps> = {}): PasswordChangeDeps {
  return {
    getUserById: jest.fn().mockResolvedValue({
      _id: 'user-1',
      email: 'user@example.com',
      provider: 'local',
      password: 'hashed-old',
    }),
    updateUser: jest.fn().mockResolvedValue({
      _id: 'user-1',
      email: 'user@example.com',
      provider: 'local',
    }),
    deleteTokens: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    comparePassword: jest.fn().mockResolvedValue(true),
    hashPassword: jest.fn((password: string) => `hashed:${password}`),
    ...overrides,
  };
}

describe('resolvePasswordChangeSettings', () => {
  it('defaults to enabled when neither config nor env is set', () => {
    expect(resolvePasswordChangeSettings(undefined, {}).enabled).toBe(true);
  });

  it('honors ALLOW_PASSWORD_CHANGE=false', () => {
    expect(
      resolvePasswordChangeSettings(undefined, { ALLOW_PASSWORD_CHANGE: 'false' }).enabled,
    ).toBe(false);
  });

  it('lets yaml override the environment', () => {
    expect(
      resolvePasswordChangeSettings({ enabled: true }, { ALLOW_PASSWORD_CHANGE: 'false' }).enabled,
    ).toBe(true);
  });
});

describe('createPasswordChangeService', () => {
  const body = {
    currentPassword: 'old-password',
    newPassword: 'new-password',
    confirmPassword: 'new-password',
  };

  it('rejects when password changes are disabled', async () => {
    const service = createPasswordChangeService(makeDeps());
    const result = await service.changePassword({
      body,
      userId: 'user-1',
      settings: { enabled: false },
    });
    expect(result).toMatchObject({
      ok: false,
      error: { code: 'password_change_disabled' },
    });
  });

  it('rejects a confirm mismatch', async () => {
    const service = createPasswordChangeService(makeDeps());
    const result = await service.changePassword({
      body: { ...body, confirmPassword: 'other' },
      userId: 'user-1',
      settings: { enabled: true },
    });
    expect(result).toMatchObject({ ok: false, error: { code: 'confirm_mismatch' } });
  });

  it('rejects when the new password matches the current one', async () => {
    const service = createPasswordChangeService(makeDeps());
    const result = await service.changePassword({
      body: {
        currentPassword: 'same-password',
        newPassword: 'same-password',
        confirmPassword: 'same-password',
      },
      userId: 'user-1',
      settings: { enabled: true },
    });
    expect(result).toMatchObject({ ok: false, error: { code: 'same_password' } });
  });

  it('rejects non-local accounts', async () => {
    const deps = makeDeps({
      getUserById: jest.fn().mockResolvedValue({
        _id: 'user-1',
        email: 'user@example.com',
        provider: 'google',
        password: 'hashed-old',
      }),
    });
    const service = createPasswordChangeService(deps);
    const result = await service.changePassword({
      body,
      userId: 'user-1',
      settings: { enabled: true },
    });
    expect(result).toMatchObject({ ok: false, error: { code: 'local_account_required' } });
  });

  it('rejects an incorrect current password', async () => {
    const deps = makeDeps({
      comparePassword: jest.fn().mockResolvedValue(false),
    });
    const service = createPasswordChangeService(deps);
    const result = await service.changePassword({
      body,
      userId: 'user-1',
      settings: { enabled: true },
    });
    expect(result).toMatchObject({ ok: false, error: { code: 'current_password_invalid' } });
  });

  it('commits the password reset update and clears pending email changes', async () => {
    const deps = makeDeps();
    const service = createPasswordChangeService(deps);
    const result = await service.changePassword({
      body,
      userId: 'user-1',
      settings: { enabled: true },
    });

    expect(result).toEqual({ ok: true, userId: 'user-1', email: 'user@example.com' });
    expect(deps.hashPassword).toHaveBeenCalledWith('new-password');
    expect(deps.updateUser).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        password: 'hashed:new-password',
        credentialsChangedAt: expect.any(Date),
        pendingTotpSecret: null,
      }),
      { email: 'user@example.com' },
    );
    expect(deps.deleteTokens).toHaveBeenCalledWith({ userId: 'user-1', type: 'email_change' });
  });
});
