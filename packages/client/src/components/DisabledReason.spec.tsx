import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisabledReason } from './DisabledReason';

describe('DisabledReason', () => {
  test('renders the control unwrapped while it is enabled', () => {
    const { container } = render(
      <DisabledReason disabled={false} reason="Not yet">
        <button type="button">Save</button>
      </DisabledReason>,
    );

    expect(container.firstChild).toBe(screen.getByRole('button', { name: 'Save' }));
  });

  test('explains a disabled control on hover through a not-allowed anchor', async () => {
    render(
      <DisabledReason disabled={true} reason="Create the agent first">
        <button type="button" disabled>
          Save
        </button>
      </DisabledReason>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    const anchor = button.parentElement as HTMLElement;
    expect(anchor.tagName).toBe('SPAN');
    expect(anchor).toHaveClass('cursor-not-allowed');
    expect(anchor).toHaveAttribute('tabindex', '0');

    fireEvent.mouseEnter(anchor);
    fireEvent.mouseMove(anchor);

    const tooltip = await screen.findByRole('tooltip', undefined, { timeout: 3000 });
    expect(tooltip).toHaveTextContent('Create the agent first');
  });

  test('skips the wrapper when there is no reason to show', () => {
    const { container } = render(
      <DisabledReason disabled={true} reason="">
        <button type="button" disabled>
          Save
        </button>
      </DisabledReason>,
    );

    expect(container.firstChild).toBe(screen.getByRole('button', { name: 'Save' }));
  });
});
