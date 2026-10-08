import { disabledFillClasses } from '~/utils/theme';

/**
 * The shared appearance of a form control: border, radius, type scale and focus
 * treatment. Owned here so `Input`, `Textarea`, and the select/combobox triggers
 * that have to sit beside them in a form cannot drift apart as the theme evolves.
 * Callers compose a variant rather than restating these classes locally. The
 * border is `border-control` because it is the only edge the control has, so a
 * palette can raise it to the 3:1 non-text floor without touching separators.
 * A theme whose `fieldFocusStyle` is `border` focuses the field by swapping that edge to
 * `border-field-focus`; keyboard focus adds a 1px ring in the same color, so the indicator keeps
 * the 2px perimeter the app holds as its focus floor. The value inks in `field-text`, and a theme
 * whose `fieldFillStyle` is `fill` paints the field in `field-fill`, which a disabled field keeps
 * under the pointer too; by default it stays clear.
 */
export const fieldBase: string = `lc-field flex w-full rounded-lg border border-border-control px-3 py-theme-field-y text-sm text-field-text theme-field-fill:bg-field-fill theme-field-fill:disabled:hover:bg-field-fill placeholder:text-text-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-control theme-field-border:focus:border-border-field-focus theme-field-border:focus-visible:ring-1 theme-field-border:focus-visible:ring-border-field-focus disabled:cursor-not-allowed disabled:opacity-50 ${disabledFillClasses}`;

/** A single-line control sized to sit in a form row, matching `Input`. */
export const fieldControl: string = `${fieldBase} h-theme-field bg-transparent`;

/** 品牌漸層上的玻璃欄位：半透明白底、白字，focus 只提亮底色（框線與自動填入由 `.auth-glass-input` 處理）。 */
export const glassField: string =
  'auth-glass-input peer h-auto rounded-xl border-surface-on-brand/30 bg-surface-on-brand/10 px-3.5 py-3 text-text-on-brand placeholder:text-text-on-brand/50 duration-200 focus:bg-surface-on-brand/15 focus-visible:bg-surface-on-brand/15 focus:ring-0 focus-visible:ring-0 focus:outline-hidden focus-visible:outline-hidden';

/** 玻璃欄位內的圖示按鈕（顯示密碼等）。 */
export const glassFieldButton: string =
  'relative z-10 size-theme-control rounded-xl text-text-on-brand/70 transition-all duration-200 hover:bg-surface-on-brand/15 hover:text-text-on-brand active:scale-95 focus-visible:ring-2 focus-visible:ring-surface-on-brand/50';
