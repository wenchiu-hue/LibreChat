const express = require('express');
const request = require('supertest');

const mockChangePasswordController = jest.fn((req, res) =>
  res.status(200).json({ message: 'Password updated successfully.', token: 'new-token' }),
);
const mockPasswordChangeLimiter = jest.fn((req, res, next) => next());
const mockRequireJwtAuth = jest.fn((req, res, next) => {
  req.user = { id: 'user-1', _id: 'user-1', provider: 'local' };
  next();
});

jest.mock('~/server/controllers/UserController', () => ({
  getUserController: jest.fn((req, res) => res.status(204).end()),
  deleteUserController: jest.fn((req, res) => res.status(204).end()),
  acceptTermsController: jest.fn((req, res) => res.status(204).end()),
  verifyEmailController: jest.fn((req, res) => res.status(204).end()),
  requestEmailChangeController: jest.fn((req, res) => res.status(204).end()),
  confirmEmailChangeController: jest.fn((req, res) => res.status(204).end()),
  changePasswordController: (...args) => mockChangePasswordController(...args),
  getTermsStatusController: jest.fn((req, res) => res.status(204).end()),
  updateUserPluginsController: jest.fn((req, res) => res.status(204).end()),
  resendVerificationController: jest.fn((req, res) => res.status(204).end()),
}));

jest.mock('~/server/middleware', () => {
  const pass = (req, res, next) => next();
  return {
    requireJwtAuth: (...args) => mockRequireJwtAuth(...args),
    canDeleteAccount: pass,
    configMiddleware: pass,
    strictConfigMiddleware: pass,
    verifyEmailLimiter: pass,
    emailChangeLimiter: pass,
    passwordChangeLimiter: (...args) => mockPasswordChangeLimiter(...args),
    emailChangeSubmissionLimiter: pass,
    emailChangeSubmissionIpLimiter: pass,
    verifyEmailSubmissionLimiter: pass,
  };
});

jest.mock('./settings', () => {
  const express = require('express');
  return express.Router();
});

const userRouter = require('./user');

describe('POST /api/user/password/change', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPasswordChangeLimiter.mockImplementation((req, res, next) => next());
    mockRequireJwtAuth.mockImplementation((req, res, next) => {
      req.user = { id: 'user-1', _id: 'user-1', provider: 'local' };
      next();
    });
    mockChangePasswordController.mockImplementation((req, res) =>
      res.status(200).json({ message: 'Password updated successfully.', token: 'new-token' }),
    );
    app = express();
    app.use(express.json());
    app.use('/api/user', userRouter);
  });

  it('runs the password-change limiter before the controller', async () => {
    await request(app)
      .post('/api/user/password/change')
      .send({
        currentPassword: 'old-password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      })
      .expect(200);

    expect(mockPasswordChangeLimiter).toHaveBeenCalled();
    expect(mockChangePasswordController).toHaveBeenCalled();
    expect(mockPasswordChangeLimiter.mock.invocationCallOrder[0]).toBeLessThan(
      mockChangePasswordController.mock.invocationCallOrder[0],
    );
  });

  it('does not reach the controller after the limiter rejects', async () => {
    mockPasswordChangeLimiter.mockImplementation((req, res) =>
      res.status(429).json({ message: 'Too many attempts' }),
    );

    const response = await request(app)
      .post('/api/user/password/change')
      .send({
        currentPassword: 'old-password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      })
      .expect(429);

    expect(response.body).toEqual({ message: 'Too many attempts' });
    expect(mockChangePasswordController).not.toHaveBeenCalled();
  });

  it('requires authentication', async () => {
    mockRequireJwtAuth.mockImplementation((req, res) =>
      res.status(401).json({ message: 'Unauthorized' }),
    );

    await request(app)
      .post('/api/user/password/change')
      .send({
        currentPassword: 'old-password',
        newPassword: 'new-password',
        confirmPassword: 'new-password',
      })
      .expect(401);

    expect(mockChangePasswordController).not.toHaveBeenCalled();
  });
});
