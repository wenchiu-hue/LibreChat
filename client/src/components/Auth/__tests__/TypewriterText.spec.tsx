import React from 'react';
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import TypewriterText from '../TypewriterText';

describe('TypewriterText', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('reveals the slogan one character at a time', () => {
    render(<TypewriterText text="Hi" msPerChar={20} />);

    expect(screen.queryByText('Hi')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(screen.getByText(/^H/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(20);
    });
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  test('shows the full slogan immediately when motion is reduced', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<TypewriterText text="Full slogan" msPerChar={20} />);

    expect(screen.getByText('Full slogan')).toBeInTheDocument();
  });
});
