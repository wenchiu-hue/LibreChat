import * as React from 'react';
import { fieldBase } from './Field';
import { cn } from '~/utils';
import './Field.css';

/** `document` is a long-form editor that reads like the text it will become. */
const TEXTAREA_VARIANTS = {
  default: 'bg-surface-secondary',
  transparent: 'bg-transparent',
  document: 'bg-transparent text-base leading-relaxed',
  /** 與 `Input` 的 `filled` 相同的無框填色。 */
  filled:
    'lc-field-filled border-transparent bg-field-fill hover:border-border-composer/41 transition-colors duration-200 motion-reduce:transition-none',
} as const;

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: keyof typeof TEXTAREA_VARIANTS;
};

const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
> = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    return (
      <textarea
        className={cn(fieldBase, TEXTAREA_VARIANTS[variant], 'min-h-20 resize-none', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
