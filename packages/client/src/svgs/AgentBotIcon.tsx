import { JSX } from 'react/jsx-runtime';
import type { SVGProps } from 'react';

/**
 * Agent Builder 的機器人圖示：對話框形狀的頭、天線、兩側耳朵，左眼瞇成弧線、右眼圓點。
 * 線條與 lucide 一致（24 格、2px、圓角端點），顏色跟著 `currentColor`。
 */
export default function AgentBotIcon({
  className = 'icon-md',
  ...props
}: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* 天線 */}
      <path d="M12 3.5V6" />
      <circle cx="12" cy="2.25" r="1.25" fill="currentColor" stroke="none" />
      {/* 對話框形狀的頭，左下角帶尾巴 */}
      <path d="M8 6H16A4 4 0 0 1 20 10V15A4 4 0 0 1 16 19H10L6.5 21.5V18.6A4 4 0 0 1 4 15V10A4 4 0 0 1 8 6Z" />
      {/* 耳朵 */}
      <path d="M2 11V14" />
      <path d="M22 11V14" />
      {/* 左眼瞇眼、右眼圓點 */}
      <path d="M7 13.25Q9 10.75 11 13.25" />
      <circle cx="15" cy="12.5" r="1.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
