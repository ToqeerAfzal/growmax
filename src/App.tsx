import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import { LoginPermission, HomePagePermission } from "../ProtectRoute/permissionRoutes";
import { WagmiConfig } from 'wagmi';
import { config } from './config/web3modal';

// Immediate load for most common pages
const Index = lazy(() => import("./pages/Index"));
const UserSignup = lazy(() => import("./pages/UserSignup"));
const ForgetPasswordOTP = lazy(() => import("./pages/ForgetPasswordOTP"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const FaqPage = lazy(() => import("./pages/FaqPage"));

// Updated user pages
const UpdatedUserLogin = lazy(() => import("./pages/UpdatedUserLogin"));
const LiveTerminals = lazy(() => import("./pages/LiveTerminals"));
const UpdatedSettings = lazy(() => import("./pages/UpdatedSettings"));
const AllTransactions = lazy(() => import("./pages/AllTransactions"));
const ReferralTree = lazy(() => import("./pages/ReferralTree"));
const RankIncome = lazy(() => import("./pages/RankIncome"));
const UpdatedUserManagement = lazy(() => import("./pages/UpdatedUserManagement"));

const StakingHub = lazy(() => import("./pages/StakingHub"));
const RewardHistoryList = lazy(() => import("./pages/RewardHistoryList"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const WithdrawalCenter = lazy(() => import("./pages/WithdrawalCenter"));
const ReferralSystem = lazy(() => import("./pages/ReferralSystem"));
const RankProgress = lazy(() => import("./pages/RankProgress"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Settings = lazy(() => import("./pages/Settings"));
const Security = lazy(() => import("./pages/Security"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - reduced from 5 for fresher data
      gcTime: 30 * 60 * 1000, // 30 minutes - increased for better caching
      refetchOnWindowFocus: false,
      retry: 1,
      // Enable background refetching for better UX
      refetchOnMount: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// Lightweight loading component for faster initial render
const PageLoader = () => (
  <div className="min-h-screen bg-coinstake-black flex items-center justify-center">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-coinstake-gold"></div>
      <span className="text-gray-400 text-sm">Loading...</span>
    </div>
  </div>
);

const App = () => (
  <WagmiConfig config={config}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LiveTerminals />} />
                <Route path="/liveterminals" element={<LiveTerminals />} />

                {/* User Routes */}
                <Route path="/login" element={<LoginPermission />}>
                  <Route path="login" element={<UpdatedUserLogin />} />
                </Route>
                <Route path="/signup/:referral" element={<LoginPermission />}>
                  <Route path="signup/:referral" element={<UserSignup />} />
                </Route>
                <Route path="/signup" element={<LoginPermission />}>
                  <Route path="signup" element={<UserSignup />} />
                </Route>
                <Route path="/forgot-password" element={<LoginPermission />}>
                  <Route path="forgot-password" element={<ForgetPasswordOTP />} />
                </Route>
                <Route path="/reset-password" element={<LoginPermission />}>
                  <Route path="reset-password" element={<ResetPassword />} />
                </Route>
                <Route path="/dashboard" element={<HomePagePermission />}>
                  <Route path="dashboard" element={<UserDashboard />} />
                </Route>
                <Route path="/teams" element={<HomePagePermission />}>
                  <Route path="teams" element={<UpdatedUserManagement />} />
                </Route>
                <Route path="/settings" element={<HomePagePermission />}>
                  <Route path="settings" element={<UserSettings />} />
                </Route>
                <Route path="/staking" element={<HomePagePermission />}>
                  <Route path="staking" element={<StakingHub />} />
                </Route>
                <Route path="/withdrawal" element={<HomePagePermission />}>
                  <Route path="withdrawal" element={<WithdrawalCenter />} />
                </Route>
                <Route path="/referral" element={<HomePagePermission />}>
                  <Route path="referral" element={<ReferralSystem />} />
                </Route>
                <Route path="/rewardHistory" element={<HomePagePermission />}>
                  <Route path="rewardHistory" element={<RewardHistoryList />} />
                </Route>
                <Route path="/referral-tree" element={<HomePagePermission />}>
                  <Route path="referral-tree" element={<ReferralTree />} />
                </Route>
                <Route path="/rank-progress" element={<HomePagePermission />}>
                  <Route path="rank-progress" element={<RankProgress />} />
                </Route>
                <Route path="/rank-income" element={<HomePagePermission />}>
                  <Route path="rank-income" element={<RankIncome />} />
                </Route>
                <Route path="/transactions" element={<HomePagePermission />}>
                  <Route path="transactions" element={<Transactions />} />
                </Route>
                <Route path="/all-transactions" element={<HomePagePermission />}>
                  <Route path="all-transactions" element={<AllTransactions />} />
                </Route>
                <Route path="/settings" element={<HomePagePermission />}>
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/security" element={<HomePagePermission />}>
                  <Route path="security" element={<Security />} />
                </Route>
                <Route path="/settings-updated" element={<HomePagePermission />}>
                  <Route path="settings-updated" element={<UpdatedSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </WagmiConfig>
);

export default App;
