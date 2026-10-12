import * as React from 'react';
import { fieldControl, glassField } from './Field';
import { cn } from '~/utils';
import './Field.css';

/** `title` edits a heading in place, so the field takes the heading's type scale. `inline` shares
 *  a row with icon Buttons, so it takes their height role and the row stays one height when a
 *  theme sizes fields and buttons apart. */
type InputVariant = 'default' | 'inline' | 'title' | 'title-sm' | 'filled' | 'glass';

const INPUT_VARIANTS: Readonly<Record<InputVariant, string>> = {
  default: '',
  inline: 'h-theme-button',
  title: 'h-theme-field-lg text-2xl font-semibold tracking-tight',
  'title-sm': 'text-base font-semibold tracking-tight',
  /** 無框填色欄位：平常以 `field-fill` 與所在面板區隔，框線只在 focus 時出現。 */
  filled:
    'lc-field-filled border-transparent bg-field-fill hover:border-border-composer/41 transition-colors duration-200 motion-reduce:transition-none',
  /** 品牌漸層上的玻璃欄位（登入、註冊）。 */
  glass: glassField,
};

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  colorTransition?: boolean;
  variant?: InputVariant;
};

const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>> =
  React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, colorTransition, variant = 'default', ...props }, ref) => {
      return (
        <input
          className={cn(
            fieldControl,
            'ring-offset-surface-primary',
            INPUT_VARIANTS[variant],
            colorTransition && 'transition-colors',
            className ?? '',
          )}
          ref={ref}
          {...props}
        />
      );
    },
  );

Input.displayName = 'Input';

export { Input };
