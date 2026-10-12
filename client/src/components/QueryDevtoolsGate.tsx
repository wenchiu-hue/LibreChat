import { Suspense } from 'react';
import { importWithRecovery, lazyWithRecovery } from '~/lib/assets/lazy';

interface QueryDevtoolsConfig {
  enableQueryDevtools?: boolean;
}

interface QueryDevtoolsGateProps {
  config?: QueryDevtoolsConfig;
  isDevelopment?: boolean;
}

/** 抽屜（含 devtools 面板）延遲載入，未啟用時不進入主 bundle。 */
const LazyQueryDevtoolsDrawer = lazyWithRecovery(() =>
  importWithRecovery(() => import('./QueryDevtools/Drawer')),
);

export const shouldEnableQueryDevtools = ({
  isDevelopment = import.meta.env.DEV,
  config = typeof window === 'undefined' ? undefined : window.__LIBRECHAT_CONFIG__,
}: QueryDevtoolsGateProps = {}) => isDevelopment || config?.enableQueryDevtools === true;

export default function QueryDevtoolsGate({ isDevelopment, config }: QueryDevtoolsGateProps = {}) {
  if (!shouldEnableQueryDevtools({ isDevelopment, config })) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <LazyQueryDevtoolsDrawer />
    </Suspense>
  );
}
