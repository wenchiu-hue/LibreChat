import React, { useEffect, memo } from 'react';
import TagManager from 'react-gtm-module';
import ReactMarkdown from 'react-markdown';
import { hasConfiguredFooter } from 'librechat-data-provider';
import type { TStartupConfig } from 'librechat-data-provider';
import { useGetStartupConfig } from '~/data-provider';
import { DEFAULT_APP_TITLE } from '~/utils';
import { useLocalize } from '~/hooks';

const COMPANY_SITE_URL = 'https://www.tynesys.com';

type FooterProps = {
  className?: string;
  startupConfig?: FooterStartupConfig | null;
  /** A started conversation keeps only the footer the deployment wrote. The
   *  generic model disclaimer belongs to the welcome screen, where it is first
   *  read, and the policy links belong where they are agreed to: registration
   *  states the consent with both links, and the welcome screen the
   *  conversation starts from carries them under the composer. With no custom
   *  footer configured, this renders nothing at all. */
  configuredOnly?: boolean;
};

type FooterStartupConfig = Pick<
  Partial<TStartupConfig>,
  'analyticsGtmId' | 'customFooter' | 'appTitle'
> & {
  interface?: Pick<NonNullable<TStartupConfig['interface']>, 'privacyPolicy' | 'termsOfService'>;
};

/**
 * Whether the deployment configured footer content of its own, as the server
 * said when it served this document (`injectConfiguredFooterBootstrap`).
 *
 * Read once at module load: it is a property of the document, and an answer
 * that arrived a render later would be the guess this replaces. A shell that
 * carries no answer — the Vite dev server serves `client/index.html` itself —
 * reads as no footer, which is the default deployment.
 */
const shellHasConfiguredFooter =
  typeof window !== 'undefined' && window.__LIBRECHAT_CONFIG__?.hasConfiguredFooter === true;

/**
 * What a conversation has to render beneath its composer. The conversation
 * renders the footer only for configured content, and the composer above it
 * reserves the band that bar needs — the bar is absolutely positioned in a
 * zero-height wrapper, so a composer that did not reserve it would be painted
 * over. Both decisions read this one answer so they cannot disagree.
 *
 * Until `/api/config` answers, that answer is the shell's, which is the
 * deployment's own `CUSTOM_FOOTER`. A DB config override that sets or clears
 * the footer for the caller's tenant, role or user is resolved only by
 * `/api/config`, so on such a deployment the resolved answer (the one that
 * wins here) can differ from the shell's.
 */
export function useConfiguredFooter(): boolean {
  const { data: config, isSuccess } = useGetStartupConfig();

  return isSuccess ? hasConfiguredFooter(config) : shellHasConfiguredFooter;
}

function Footer({ className, startupConfig, configuredOnly = false }: FooterProps) {
  const shouldFetchConfig = startupConfig === undefined;
  const { data: fetchedConfig } = useGetStartupConfig({ enabled: shouldFetchConfig });
  const config = shouldFetchConfig ? fetchedConfig : startupConfig;
  const localize = useLocalize();

  const configuredFooter = typeof config?.customFooter === 'string' ? config.customFooter : null;
  const appTitle = config?.appTitle?.trim() || DEFAULT_APP_TITLE;

  useEffect(() => {
    if (config?.analyticsGtmId != null && typeof window.google_tag_manager === 'undefined') {
      const tagManagerArgs = {
        gtmId: config.analyticsGtmId,
      };
      TagManager.initialize(tagManagerArgs);
    }
  }, [config?.analyticsGtmId]);

  const defaultClassName =
    'absolute right-0 bottom-0 left-0 hidden items-center justify-center gap-2 px-2 py-2 text-center sm:flex md:px-15';

  /** A conversation with no configured footer has nothing to place. */
  if (configuredOnly) {
    if (configuredFooter == null || configuredFooter === '') {
      return null;
    }

    const mainContentParts = configuredFooter.split('|');
    const mainContentRender = mainContentParts.map((text, index) => (
      <React.Fragment key={`main-content-part-${index}`}>
        <ReactMarkdown
          components={{
            a: ({ node: _n, href, children, ...otherProps }) => {
              return (
                <a
                  className="text-text-muted underline"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...otherProps}
                >
                  {children}
                </a>
              );
            },
            p: ({ node: _n, ...props }) => <span {...props} />,
          }}
        >
          {text.trim()}
        </ReactMarkdown>
      </React.Fragment>
    ));

    return (
      <div className="relative w-full">
        <div className={className ?? `${defaultClassName} text-text-muted text-xs`}>
          {mainContentRender.map((contentRender, index) => {
            const isLastElement = index === mainContentRender.length - 1;
            return (
              <React.Fragment key={`footer-element-${index}`}>
                {contentRender}
                {!isLastElement && (
                  <div
                    key={`separator-${index}`}
                    className="border-border-medium h-2 border-r-[1px]"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className={className ?? defaultClassName}>
        <a
          href={COMPANY_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={localize('com_ui_logo', { 0: appTitle })}
          className="text-text-primary focus-visible:ring-border-xheavy inline-flex items-center justify-center gap-3 rounded-md opacity-80 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          <img
            src="assets/logo.svg"
            alt=""
            className="h-9 w-auto max-w-[12rem] object-contain dark:brightness-0 dark:invert"
          />
          <span className="text-sm font-semibold tracking-wide">{appTitle}</span>
        </a>
      </div>
    </div>
  );
}

const MemoizedFooter = memo(Footer);
MemoizedFooter.displayName = 'Footer';

export default MemoizedFooter;
