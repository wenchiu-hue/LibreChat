import React, { useMemo } from 'react';
import { useMediaQuery } from '@librechat/client';
import type t from 'librechat-data-provider';
import { useLocalize, TranslationKeys } from '~/hooks';
import { SmartLoader } from './SmartLoader';
import { cn } from '~/utils';

/**
 * Props for the CategoryTabs component
 */
interface CategoryTabsProps {
  /** Array of agent categories to display as tabs */
  categories: t.TMarketplaceCategory[];
  /** Currently selected tab value */
  activeTab: string;
  /** Whether categories are currently loading */
  isLoading: boolean;
  /** Callback fired when a tab is selected */
  onChange: (value: string) => void;
}

/** Keyboard-accessible category filters with immediate selection feedback. */
const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories: sourceCategories,
  activeTab,
  isLoading,
  onChange,
}) => {
  const localize = useLocalize();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  /** API 把「全部」放在最後，畫面上移到最左邊；鍵盤左右切換也照這個順序 */
  const categories = useMemo(() => {
    const all = sourceCategories.filter((category) => category.value === 'all');
    return [...all, ...sourceCategories.filter((category) => category.value !== 'all')];
  }, [sourceCategories]);

  /** Helper function to get category display name from database data */
  const getCategoryDisplayName = (category: t.TCategory) => {
    // Special cases for system categories
    if (category.value === 'promoted') {
      return localize('com_agents_top_picks');
    }
    if (category.value === 'all') {
      return localize('com_agents_all_category');
    }
    if (category.label && category.label.startsWith('com_')) {
      return localize(category.label as TranslationKeys);
    }
    // Use database label or fallback to capitalized value
    return category.label || category.value.charAt(0).toUpperCase() + category.value.slice(1);
  };

  const loadingSkeleton = (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-1.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-tertiary h-8 min-w-[3.5rem] rounded-md" />
        ))}
      </div>
    </div>
  );

  // Handle keyboard navigation between tabs
  const handleKeyDown = (e: React.KeyboardEvent, currentCategory: string) => {
    const currentIndex = categories.findIndex((cat) => cat.value === currentCategory);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Move up a row (approximate by moving back ~4-6 items)
        newIndex = Math.max(0, currentIndex - 5);
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Move down a row (approximate by moving forward ~4-6 items)
        newIndex = Math.min(categories.length - 1, currentIndex + 5);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = categories.length - 1;
        break;
      default:
        return;
    }

    const newCategory = categories[newIndex];
    if (newCategory) {
      onChange(newCategory.value);
      // Focus the new tab
      setTimeout(() => {
        const newTab = document.getElementById(`category-tab-${newCategory.value}`);
        if (newTab) {
          newTab.focus();
        }
      }, 0);
    }
  };

  // Early return if no categories available
  if (!isLoading && (!categories || categories.length === 0)) {
    return (
      <div className="text-text-secondary text-center">{localize('com_ui_no_categories')}</div>
    );
  }

  // Main tabs content
  const tabsContent = (
    <div className="w-full">
      <div
        className={cn(
          isSmallScreen
            ? 'hide-scrollbar flex gap-1.5 overflow-x-auto'
            : 'flex flex-wrap justify-center gap-1.5',
        )}
        role="tablist"
        aria-label={localize('com_agents_category_tabs_label')}
        aria-orientation="horizontal"
        style={
          isSmallScreen
            ? {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }
            : undefined
        }
      >
        {categories.map((category, index) => (
          <button
            key={category.value}
            id={`category-tab-${category.value}`}
            onClick={() => onChange(category.value)}
            onKeyDown={(e) => handleKeyDown(e, category.value)}
            className={cn(
              'focus-visible:ring-ring-primary inline-flex h-8 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 select-none focus-visible:ring-2 focus-visible:outline-hidden',
              isSmallScreen ? 'min-w-fit shrink-0' : '',
              /* 選中的分類用品牌綠實心底；未選中用明顯比卡片亮的灰底配主文字色 */
              activeTab === category.value
                ? 'bg-surface-submit text-text-on-status hover:bg-surface-submit-hover'
                : 'bg-surface-hover text-text-primary hover:bg-surface-active',
            )}
            role="tab"
            aria-selected={activeTab === category.value}
            aria-controls={`category-panel-${category.value}`}
            tabIndex={activeTab === category.value ? 0 : -1}
            aria-label={localize('com_agents_category_tab_label', {
              category: getCategoryDisplayName(category),
              position: index + 1,
              total: categories.length,
            })}
          >
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>
    </div>
  );

  // Use SmartLoader to prevent category loading flashes
  return (
    <SmartLoader
      isLoading={isLoading}
      hasData={categories?.length > 0}
      delay={100} // Very short delay since categories should load quickly
      loadingComponent={loadingSkeleton}
    >
      {tabsContent}
    </SmartLoader>
  );
};

export default CategoryTabs;
