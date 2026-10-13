import { memo, useCallback, Suspense } from 'react';
import { SquarePen } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Skeleton, Sidebar, Button, TooltipAnchor } from '@librechat/client';
import type { NavLink } from '~/common';
import { useShortcutAriaKey, useShortcutHint } from '~/hooks/useKeyboardShortcuts';
import { useActivePanel, resolveActivePanel, DEFAULT_PANEL } from '~/Providers';
import AgentMarketplaceButton from '~/components/Nav/AgentMarketplaceButton';
import { CLOSE_SIDEBAR_ID } from '~/components/Chat/Menus/OpenSidebar';
import { lazyWithRecovery } from '~/lib/assets/lazy';
import useNewChat from '~/hooks/Chat/useNewChat';
import { useLocalize } from '~/hooks';
import Logout from './Logout';

const AccountSettings = lazyWithRecovery(() => import('~/components/Nav/AccountSettings'));

const NewChatButton = memo(function NewChatButton({
  setActive,
  switchToHistory,
}: {
  setActive: (id: string) => void;
  switchToHistory: boolean;
}) {
  const localize = useLocalize();
  const tooltipDescription = useShortcutHint('newChat', localize('com_ui_new_chat'));
  const ariaKey = useShortcutAriaKey('newChat');

  const handlePanelSwitch = useCallback(() => {
    if (switchToHistory) {
      setActive(DEFAULT_PANEL);
    }
  }, [switchToHistory, setActive]);

  const { handleNewChatClick } = useNewChat({ onNewChat: handlePanelSwitch });

  return (
    <TooltipAnchor
      side="right"
      description={tooltipDescription}
      render={
        <a
          href="/c/new"
          data-testid="new-chat-button"
          aria-label={localize('com_ui_new_chat')}
          aria-keyshortcuts={ariaKey}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/15 hover:text-white"
          onClick={handleNewChatClick}
        >
          <span className="nav-rail-icon">
            <SquarePen className="nav-rail-glyph h-6 w-6" />
          </span>
        </a>
      }
    />
  );
});

const NavIconButton = memo(function NavIconButton({
  link,
  isActive,
  expanded,
  setActive,
  onExpand,
  onCollapse,
  onNavigate,
  onLeaveInsights,
}: {
  link: NavLink;
  isActive: boolean;
  expanded: boolean;
  setActive: (id: string) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onNavigate?: () => void;
  onLeaveInsights?: () => void;
}) {
  const localize = useLocalize();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (link.onClick) {
        link.onClick(e);
        onNavigate?.();
        return;
      }
      if (isActive && expanded) {
        onCollapse?.();
        return;
      }
      if (!isActive) {
        setActive(link.id);
      }
      if (!expanded) {
        onExpand?.();
      } else {
        onLeaveInsights?.();
      }
    },
    [link, isActive, setActive, expanded, onExpand, onCollapse, onNavigate, onLeaveInsights],
  );

  return (
    <TooltipAnchor
      description={localize(link.title)}
      side="right"
      render={
        <Button
          size="icon"
          variant="brand"
          aria-label={localize(link.title)}
          aria-pressed={isActive}
          disabled={link.disabled}
          data-testid={`nav-panel-${link.id}`}
          className="h-10 w-10"
          onClick={handleClick}
        >
          <span className="nav-rail-icon">
            <link.icon className="nav-rail-glyph h-6 w-6" aria-hidden="true" />
          </span>
        </Button>
      }
    />
  );
});

function ExpandedPanel({
  links,
  expanded = true,
  onCollapse,
  onExpand,
  onNavigate,
  onLeaveInsights,
  switchToHistory,
}: {
  links: NavLink[];
  expanded?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
  onNavigate?: () => void;
  onLeaveInsights?: () => void;
  switchToHistory: boolean;
}) {
  const localize = useLocalize();
  const location = useLocation();
  const { active, setActive } = useActivePanel();
  const effectiveActive = resolveActivePanel(active, links);
  const isInsightsRoute = location.pathname.startsWith('/insights');

  const toggleLabel = expanded ? 'com_nav_close_sidebar' : 'com_nav_open_sidebar';
  /** 不把 click 事件往下傳：onCollapse 的第一個參數是 afterSlide 回呼，收到事件物件會在
   *  requestAnimationFrame 拋出「afterSlide is not a function」。 */
  const toggleClick = () => (expanded ? onCollapse?.() : onExpand?.());
  const toggleSidebarHint = useShortcutHint('toggleSidebar', localize(toggleLabel));
  const toggleSidebarAriaKey = useShortcutAriaKey('toggleSidebar');

  return (
    <div className="from-brand-rail-start/79 via-brand-gradient-mid to-brand-rail-end/90 brand-weave flex h-full shrink-0 flex-col gap-2 bg-gradient-to-t px-2 py-2 text-white">
      <TooltipAnchor
        side="right"
        description={toggleSidebarHint}
        render={
          <Button
            id={expanded ? CLOSE_SIDEBAR_ID : undefined}
            data-testid={expanded ? 'close-sidebar-button' : 'open-sidebar-button'}
            size="icon"
            variant="brand"
            aria-label={localize(toggleLabel)}
            aria-expanded={expanded}
            aria-keyshortcuts={toggleSidebarAriaKey}
            className="h-10 w-10"
            onClick={toggleClick}
          >
            <span className="nav-rail-icon">
              <Sidebar aria-hidden="true" className="nav-rail-glyph h-6 w-6" />
            </span>
          </Button>
        }
      />
      <NewChatButton setActive={setActive} switchToHistory={switchToHistory} />
      <AgentMarketplaceButton />
      <div className="mx-2 border-b border-white/20" />
      {/* 與上方按鈕同為 gap-2，整條圖示的間距才一致。 */}
      <div className="flex flex-col gap-2 overflow-y-auto">
        {links.map((link) => (
          <NavIconButton
            key={link.id}
            link={link}
            isActive={
              link.id === 'insights'
                ? isInsightsRoute
                : !isInsightsRoute && link.id === effectiveActive
            }
            expanded={expanded ?? true}
            setActive={setActive}
            onExpand={onExpand}
            onCollapse={onCollapse}
            onNavigate={onNavigate}
            onLeaveInsights={isInsightsRoute ? onLeaveInsights : undefined}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Suspense fallback={<Skeleton className="h-10 w-10 rounded-lg" />}>
          <AccountSettings collapsed />
        </Suspense>
        <Logout placement="rail" />
      </div>
    </div>
  );
}

export default memo(ExpandedPanel);
