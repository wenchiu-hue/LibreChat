import { z } from 'zod';
import type { PasswordChangeErrorCode } from 'librechat-data-provider';
import type { PasswordResetUpdate } from './passwordResetUpdate';
import { createPasswordResetUpdate } from './passwordResetUpdate';
import { clearPendingEmailChanges } from './passwordReset';
import { isEnabled } from '../utils/common';

export type { PasswordChangeErrorCode } from 'librechat-data-provider';

export function isPasswordChangeAllowed(
  value: string | undefined = process.env.ALLOW_PASSWORD_CHANGE,
): boolean {
  return value === undefined || isEnabled(value);
}

export interface PasswordChangeSettings {
  enabled: boolean;
}

/**
 * yaml wins over the environment, which wins over the documented default, so a deployment
 * that sets neither keeps exactly the behavior it has today.
 */
export function resolvePasswordChangeSettings(
  config?: { enabled?: boolean },
  env: NodeJS.ProcessEnv = process.env,
): PasswordChangeSettings {
  return {
    enabled: config?.enabled ?? isPasswordChangeAllowed(env.ALLOW_PASSWORD_CHANGE),
  };
}

const MIN_PASSWORD_LENGTH = (): number => parseInt(process.env.MIN_PASSWORD_LENGTH ?? '', 10) || 8;

function passwordSchema() {
  const min = MIN_PASSWORD_LENGTH();
  return z
    .string()
    .min(min)
    .max(128)
    .refine((value) => value.trim().length > 0, {
      message: 'Password cannot be only spaces',
    });
}

function requestSchema() {
  const password = passwordSchema();
  return z
    .object({
      currentPassword: z.string().min(1).max(128),
      newPassword: password,
      confirmPassword: password,
    })
    .superRefine(({ confirmPassword, newPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'The passwords did not match',
        });
      }
    });
}

export interface PasswordChangeUser {
  _id?: string;
  id?: string;
  email: string;
  password?: string;
  provider?: string;
}

export interface PasswordChangeDeps {
  getUserById: (userId: string, select: string) => Promise<PasswordChangeUser | null>;
  updateUser: (
    userId: string,
    update: PasswordResetUpdate,
    expectedState?: { email: string },
  ) => Promise<PasswordChangeUser | null>;
  deleteTokens: (query: { userId: string; type: string }) => Promise<unknown>;
  comparePassword: (user: PasswordChangeUser, candidatePassword: string) => Promise<boolean>;
  hashPassword: (password: string) => string;
}

export interface ChangePasswordInput {
  body: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  userId: string;
  settings: PasswordChangeSettings;
}

export type ChangePasswordResult =
  | { ok: true; userId: string; email: string }
  | {
      ok: false;
      error: { code: PasswordChangeErrorCode; message: string };
      status: number;
    };

function fail(
  status: number,
  code: PasswordChangeErrorCode,
  message: string,
): ChangePasswordResult {
  return { ok: false, status, error: { code, message } };
}

export const PASSWORD_CHANGE_USER_FIELDS: string = '+password email provider _id';

export function createPasswordChangeService(deps: PasswordChangeDeps) {
  return {
    async changePassword(input: ChangePasswordInput): Promise<ChangePasswordResult> {
      if (!input.settings.enabled) {
        return fail(403, 'password_change_disabled', 'Password changes are disabled.');
      }

      const parsed = requestSchema().safeParse(input.body);
      if (!parsed.success) {
        const confirmMismatch = parsed.error.issues.some(
          (issue) =>
            issue.path[0] === 'confirmPassword' && issue.message === 'The passwords did not match',
        );
        if (confirmMismatch) {
          return fail(400, 'confirm_mismatch', 'The passwords did not match.');
        }
        return fail(
          400,
          'invalid_request',
          'Enter your current password and a valid new password.',
        );
      }

      const { currentPassword, newPassword } = parsed.data;
      if (currentPassword === newPassword) {
        return fail(
          400,
          'same_password',
          'The new password must be different from your current password.',
        );
      }

      const user = await deps.getUserById(input.userId, PASSWORD_CHANGE_USER_FIELDS);
      if (!user || user.provider !== 'local' || !user.password) {
        return fail(
          403,
          'local_account_required',
          'Password changes are only available for local accounts.',
        );
      }

      const isMatch = await deps.comparePassword(user, currentPassword);
      if (!isMatch) {
        return fail(400, 'current_password_invalid', 'Your current password is incorrect.');
      }

      const updated = await deps.updateUser(
        input.userId,
        createPasswordResetUpdate(deps.hashPassword(newPassword)),
        { email: user.email },
      );
      if (!updated) {
        return fail(
          409,
          'account_modified',
          'The account changed while the request was in progress.',
        );
      }

      await clearPendingEmailChanges(deps, input.userId);

      return { ok: true, userId: input.userId, email: user.email };
    },
  };
}
