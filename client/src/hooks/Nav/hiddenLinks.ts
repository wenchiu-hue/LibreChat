import type { NavLink } from '~/common';

/** 部署可用 `interface.hiddenSideNavLinks` 隱藏側欄項目（只藏入口，功能照常）。 */
export function withoutHiddenLinks(links: NavLink[], hidden?: string[]): NavLink[] {
  if (hidden == null || hidden.length === 0) {
    return links;
  }
  return links.filter((link) => !hidden.includes(link.id));
}
