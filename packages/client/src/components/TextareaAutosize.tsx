import {
  forwardRef,
  RefAttributes,
  ForwardRefExoticComponent,
  useLayoutEffect,
  useState,
} from 'react';
import { useAtomValue } from 'jotai';
import { cx } from 'class-variance-authority';
import ReactTextareaAutosize from 'react-textarea-autosize';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';
import type { FocusOutline } from './Focus';
import { focusOutlineVariants } from './Focus';
import { chatDirectionAtom } from '~/store';

type BaseTextareaAutosizeProps = Omit<TextareaAutosizeProps, 'aria-label' | 'aria-labelledby'> & {
  focusOutline?: FocusOutline;
};

/** A field marked `aria-invalid` draws its border in the destructive role, over the caller's border colour. */
const invalidBorder = 'aria-invalid:border-border-destructive';

/** 與 `Input` 一致：聚焦時框線換成 `border-field-focus`；驗證錯誤時仍維持紅色。
 *  composer 的 textarea 沒有框線寬度（框線在外層容器），所以不受影響。 */
const focusBorder = 'focus:border-border-field-focus aria-invalid:focus:border-border-destructive';

export type TextareaAutosizePropsWithAria =
  | (BaseTextareaAutosizeProps & {
      'aria-label': string;
      'aria-labelledby'?: never;
    })
  | (BaseTextareaAutosizeProps & {
      'aria-labelledby': string;
      'aria-label'?: never;
    });

export const TextareaAutosize: ForwardRefExoticComponent<
  TextareaAutosizePropsWithAria & RefAttributes<HTMLTextAreaElement>
> = forwardRef<HTMLTextAreaElement, TextareaAutosizePropsWithAria>(
  ({ focusOutline, className, ...props }, ref) => {
    const [, setIsRerendered] = useState(false);
    const chatDirection = useAtomValue(chatDirectionAtom).toLowerCase();
    useLayoutEffect(() => setIsRerendered(true), []);
    return (
      <ReactTextareaAutosize
        dir={chatDirection}
        {...props}
        className={
          cx(focusOutlineVariants({ focusOutline }), invalidBorder, focusBorder, className) ||
          undefined
        }
        ref={ref}
      />
    );
  },
);
