import * as React from 'react';
import { useState, useCallback } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide';
import { fieldControl, glassField, glassFieldButton } from './Field';
import { cn, disabledInkClasses } from '~/utils';
import { MorphIcon } from './MorphIcon';

export interface SecretInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  colorTransition?: boolean;
  /** Show the built-in copy button */
  showCopy?: boolean;
  /** Custom copy control rendered inside the input, in place of the built-in one */
  copyButton?: React.ReactNode;
  /** Callback when value is copied */
  onCopy?: () => void;
  /** Duration in ms to show checkmark after copy (default: 2000) */
  copyFeedbackDuration?: number;
  label?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
  controlsClassName?: string;
  buttonClassName?: string;
  controlsOnHover?: boolean;
  /** `glass` 對應 `Input` 的 glass variant，連同顯示密碼按鈕一起換成玻璃樣式。 */
  variant?: 'default' | 'glass';
}

const SecretInput: React.ForwardRefExoticComponent<
  SecretInputProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef<HTMLInputElement, SecretInputProps>(
  (
    {
      id,
      label,
      className,
      colorTransition,
      showCopy = false,
      copyButton,
      labelClassName,
      containerClassName,
      controlsClassName,
      buttonClassName,
      controlsOnHover = false,
      variant = 'default',
      onCopy,
      copyFeedbackDuration = 2000,
      disabled,
      value,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const hasCopy = copyButton != null || showCopy;
    /** 右側保留給控制按鈕的空間；玻璃按鈕較大，需多留一點。 */
    let controlsPadding = variant === 'glass' ? 'pr-12' : 'pr-11';
    if (hasCopy) {
      controlsPadding = 'pr-20';
    }
    const [isCopied, setIsCopied] = useState(false);

    const toggleVisibility = useCallback(() => {
      setIsVisible((prev) => !prev);
    }, []);

    const handleCopy = useCallback(async () => {
      if (isCopied || disabled) {
        return;
      }

      const textToCopy = typeof value === 'string' ? value : '';
      if (!textToCopy) {
        return;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        onCopy?.();

        setTimeout(() => {
          setIsCopied(false);
        }, copyFeedbackDuration);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }, [value, isCopied, disabled, onCopy, copyFeedbackDuration]);

    return (
      <div className={cn('group/secret-input relative', containerClassName)}>
        <input
          id={id}
          className={cn(
            fieldControl,
            variant === 'glass' && glassField,
            colorTransition && 'transition-colors',
            className ?? '',
            controlsPadding,
          )}
          ref={ref}
          disabled={disabled}
          value={value}
          autoComplete="off"
          spellCheck={false}
          {...props}
          /** After `{...props}` so a caller-supplied `type` cannot freeze the field as
           *  `password` and make the visibility toggle appear to do nothing. */
          type={isVisible ? 'text' : 'password'}
        />
        {label != null && (
          <label htmlFor={id} className={cn(labelClassName ?? '')}>
            {label}
          </label>
        )}
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-1.5 z-10 flex items-center gap-0.5 [&_button]:pointer-events-auto',
            variant === 'glass' && 'right-2',
            controlsOnHover &&
              'opacity-0 transition-opacity duration-150 group-focus-within/secret-input:opacity-100 group-hover/secret-input:opacity-100',
            controlsClassName,
          )}
        >
          {copyButton}
          {showCopy && copyButton == null && (
            <button
              type="button"
              onClick={handleCopy}
              disabled={disabled || !value}
              className={cn(
                'text-text-secondary focus-visible:ring-focus-control inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-hidden [&>svg]:block',
                disabled || !value
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-surface-hover hover:text-text-primary',
                disabledInkClasses,
                buttonClassName,
              )}
              aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
            >
              <MorphIcon icon={isCopied ? Check : Copy} className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={disabled}
            className={cn(
              'text-text-secondary focus-visible:ring-focus-control inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-hidden [&>svg]:block',
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-surface-hover hover:text-text-primary',
              disabledInkClasses,
              variant === 'glass' && glassFieldButton,
              buttonClassName,
            )}
            aria-label={isVisible ? 'Hide secret' : 'Show secret'}
          >
            <MorphIcon icon={isVisible ? EyeOff : Eye} className="size-4" />
          </button>
        </div>
      </div>
    );
  },
);

SecretInput.displayName = 'SecretInput';

export { SecretInput };
