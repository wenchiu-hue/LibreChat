import { memo } from 'react';
import type { ComposerHintState } from '~/hooks/Input/useComposerHint';
import useComposerHint from '~/hooks/Input/useComposerHint';

/** Scoped per pane: split view mounts one composer per index, and a shared id
 *  would point every textarea's `aria-describedby` at the first pane's hint. */
export const composerHintId = (index: number) => `composer-hint-${index}`;

/**
 * The composer's accessible description: whatever the current state affords
 * (during-run modifiers, upload progress, a paused question). It is visually
 * hidden and the textarea points at it via `aria-describedby`; no visible row is
 * rendered under the composer. An `aria-live` region here would re-announce on
 * every keystroke as the hint flips between idle and typing, so the description
 * channel carries it instead.
 */
function Hints({
  index,
  enterToSend,
  showTip = false,
  ...state
}: ComposerHintState & {
  index: number;
  /** 首頁（landing）在輸入框下方顯示閒置提示（`/` 使用提示詞等），讓隱藏的快捷功能被看見。
   *  只在輸入框為空時顯示 `tip`；開始打字或有狀態提示時隱藏，那些仍只給輔助技術。 */
  showTip?: boolean;
}) {
  const hint = useComposerHint({ ...state, enterToSend });
  const visibleTip = showTip && !state.hasText && hint.kind === 'tip' && hint.text !== '';

  return (
    <>
      <span id={composerHintId(index)} className="sr-only">
        {hint.text}
      </span>
      {/* 文字已由上面的 aria-describedby 描述提供，這裡只給視覺，避免螢幕閱讀器讀兩次 */}
      {visibleTip && (
        <p aria-hidden="true" className="text-text-secondary mt-2 text-center text-xs select-none">
          {hint.text}
        </p>
      )}
    </>
  );
}

export default memo(Hints);
