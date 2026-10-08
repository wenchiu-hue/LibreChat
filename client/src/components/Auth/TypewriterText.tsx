import { useEffect, useState } from 'react';

export const TYPEWRITER_MS_PER_CHAR = 22;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reveals `text` one character at a time. Reduced-motion users get the full
 * string immediately. The live region keeps the partial string for sighted
 * readers; `aria-label` on the parent should carry the complete slogan.
 */
export default function TypewriterText({
  text,
  msPerChar = TYPEWRITER_MS_PER_CHAR,
  delayMs = 0,
  className,
}: {
  text: string;
  msPerChar?: number;
  delayMs?: number;
  className?: string;
}) {
  const reduceMotion = prefersReducedMotion();
  const [shown, setShown] = useState(() => (reduceMotion ? text : ''));
  const [typing, setTyping] = useState(() => reduceMotion || delayMs === 0);
  const showCaret = !reduceMotion && typing && shown.length < text.length;

  useEffect(() => {
    if (prefersReducedMotion() || text === '') {
      setShown(text);
      setTyping(false);
      return;
    }

    setShown('');
    setTyping(delayMs === 0);
    let index = 0;
    let intervalId = 0;

    const startTyping = () => {
      setTyping(true);
      intervalId = window.setInterval(() => {
        index += 1;
        setShown(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(intervalId);
        }
      }, msPerChar);
    };

    let delayId = 0;
    if (delayMs > 0) {
      delayId = window.setTimeout(startTyping, delayMs);
    } else {
      startTyping();
    }

    return () => {
      window.clearTimeout(delayId);
      window.clearInterval(intervalId);
    };
  }, [text, msPerChar, delayMs]);

  return (
    <span className={className}>
      {shown}
      {showCaret && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-[0.08em] translate-y-[0.1em] bg-white/80 align-[-0.05em]"
        />
      )}
    </span>
  );
}
