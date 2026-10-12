import { Bookmark, Brain, NotebookPen } from 'lucide-react';
import type { NavLink } from '~/common';
import { withoutHiddenLinks } from '../hiddenLinks';

const link = (id: string, icon: NavLink['icon']): NavLink =>
  ({ id, icon, title: 'com_ui_prompts', label: '' }) as NavLink;

const links = [link('prompts', NotebookPen), link('memories', Brain), link('bookmarks', Bookmark)];

describe('withoutHiddenLinks', () => {
  it('keeps every entry when the deployment hides none', () => {
    expect(withoutHiddenLinks(links)).toBe(links);
    expect(withoutHiddenLinks(links, [])).toBe(links);
  });

  it('drops only the entries named in interface.hiddenSideNavLinks', () => {
    const shown = withoutHiddenLinks(links, ['memories', 'bookmarks']);

    expect(shown.map((entry) => entry.id)).toEqual(['prompts']);
  });
});
