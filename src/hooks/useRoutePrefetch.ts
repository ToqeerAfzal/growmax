
import { useCallback } from 'react';

// Routes that should be prefetched based on user role/context
const PREFETCH_ROUTES = {
  admin: [
    () => import('../pages/admin/AdminDashboard'),
    () => import('../pages/admin/UserManagement'),
    () => import('../pages/admin/Analytics'),
  ],
  user: [
    () => import('../pages/user/UserDashboard'),
    () => import('../pages/user/StakingHub'),
    () => import('../pages/user/WithdrawalCenter'),
  ],
  common: [
    () => import('../pages/user/UserLogin'),
    () => import('../pages/user/UserSignup'),
  ]
};

export function useRoutePrefetch() {
  const prefetchRoutes = useCallback((type: keyof typeof PREFETCH_ROUTES) => {
    const routes = PREFETCH_ROUTES[type];
    
    // Use requestIdleCallback for non-blocking prefetching
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        routes.forEach(route => {
          route().catch(() => {
            // Silently fail if prefetch doesn't work
          });
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        routes.forEach(route => {
          route().catch(() => {
            // Silently fail if prefetch doesn't work
          });
        });
      }, 100);
    }
  }, []);

  const prefetchOnHover = useCallback((routeImport: () => Promise<any>) => {
    return {
      onMouseEnter: () => {
        routeImport().catch(() => {
          // Silently fail if prefetch doesn't work
        });
      }
    };
  }, []);

  return { prefetchRoutes, prefetchOnHover };
}
