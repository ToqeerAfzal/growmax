// permissionRoutes.jsx
import { Outlet, Navigate, useLocation, useInRouterContext } from "react-router-dom";
import Restriction from "./Restriction";
import UpdatedUserLogin from "../src/pages/UpdatedUserLogin";
import UpdatedSettings from "../src/pages/UpdatedSettings";
import AllTransactions from "../src/pages/AllTransactions";
import ReferralTree from "../src/pages/ReferralTree";
import RankIncome from "../src/pages/RankIncome";
import StakingHub from "../src/pages/StakingHub";
import WithdrawalCenter from "../src/pages/WithdrawalCenter";
import ReferralSystem from "../src/pages/ReferralSystem";
import RankProgress from "../src/pages/RankProgress";
import Transactions from "../src/pages/Transactions";
import UserDashboard from "../src/pages/UserDashboard";
import UpdatedUserManagement from "../src/pages/UpdatedUserManagement";
import UserSignup from "../src/pages/UserSignup";
import UserSettings from "../src/pages/UserSettings";
import RewardHistoryList from "../src/pages/RewardHistoryList";
import Security from "../src/pages/Security";
import UserVerifiedOTP from "../src/pages/UserVerifiedOTP";
import ForgetPasswordOTP from "../src/pages/ForgetPasswordOTP";
import ResetPassword from "../src/pages/ResetPassword";
import VerifyEmail from "../src/pages/VerifyEmail";
import EnabledTwoFA from "../src/pages/VerifyEmail";
import { plateformServices } from "../Services/plateformServices";
import WallectConnectRestriction from "../src/pages/WallectConnectRestriction";
import MaintenanceMode from "../src/pages/MaintenanceMode";

const auth = JSON.parse(localStorage.getItem("token"));
const getUserDashboardTransections = async () => {
  let data = await plateformServices.getUserDashboardTransections()
  return data
}

let originalAddress
let maintenance
if (auth) {
  let result = await getUserDashboardTransections()
  maintenance = result?.maintenance
  originalAddress = result?.address
}

export const HomePagePermission = () => {
  const location = useLocation();
  const inRouter = useInRouterContext();

  if (!inRouter) return null;

  const path = location.pathname.split("/")[1];
  const enable2FA = JSON.parse(localStorage.getItem("enable2FA"));
  const emailVerifiedAt = JSON.parse(localStorage.getItem("emailVerifiedAt"));
  const twoFA = JSON.parse(localStorage.getItem("twoFA"));
  const walletAddress = JSON.parse(localStorage.getItem("walletAddress"));
  const referralCode = JSON.parse(localStorage.getItem("referralCode"));

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if(!emailVerifiedAt) {
    return <VerifyEmail />
  }

  if (maintenance === "yes") {
    return <MaintenanceMode />
  }

  if (walletAddress && originalAddress && (originalAddress !== walletAddress)) {
    return <WallectConnectRestriction address={originalAddress} />
  }

  if (!referralCode) {
    return <StakingHub />;
  }

  switch (path) {
    case "dashboard":
      return <UserDashboard />;
    case "staking":
      return <StakingHub />;
    case "settings":
      return <UserSettings />;
    case "withdrawal":
      return <WithdrawalCenter />;
    case "teams":
      return <UpdatedUserManagement />;
    case "referral":
      return <ReferralSystem />;
    case "referral-tree":
      return <ReferralTree />;
    case "rank-progress":
      return <RankProgress />;
    case "rewardHistory":
      return <RewardHistoryList />;
    case "rank-income":
      return <RankIncome />;
    case "transactions":
      return <Transactions />;
    case "all-transactions":
      return <AllTransactions />;
    case "settings-updated":
      return <UpdatedSettings />;
    case "security":
      return <Security />;
    default:
      return <Restriction />;
  }
};

export const LoginPermission = () => {
  const location = useLocation();
  const inRouter = useInRouterContext();

  if (!inRouter) return null;

  const path = location.pathname.split("/")[1];
  const auth = JSON.parse(localStorage.getItem("token"));

  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  if (["login", "signup", "forgot-password", "reset-password"].includes(path)) {
    if (path === "login") return <UpdatedUserLogin />;
    if (path === "signup") return <UserSignup />;
    if (path === "forgot-password") return <ForgetPasswordOTP />;
    if (path === "reset-password") return <ResetPassword />;
  }

  // Allowed paths without auth
  const allowedPaths = [
    "otp-verify",
    "change-password",
    "",
  ];

  const tokenPath = location.pathname.includes("reset-password?token=");

  if (allowedPaths.includes(path) || tokenPath) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};
