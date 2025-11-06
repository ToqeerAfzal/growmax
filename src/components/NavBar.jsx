import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  PiggyBank,
  CreditCard,
  Users,
  LogOut,
  Menu,
  X,
  Receipt,
  Settings,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useWallet } from '@/hooks/useWallet';
import { userServices } from "../../Services/userServices";
import WalletConnectButton from "./WalletConnectButton";

const NavBar = memo(() => {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  const navigationItems = useMemo(
    () => [
      { icon: Home, label: "Dashboard", path: "/dashboard" },
      { icon: Users, label: "My Team", path: "/teams" },
      { icon: PiggyBank, label: "Staking", path: "/staking" },
      { icon: CreditCard, label: "Withdrawal", path: "/withdrawal" },
      { icon: Users, label: "Referrals", path: "/referral" },
      { icon: Users, label: "My Reward", path: "/rewardHistory" },
    ],
    []
  );

  const logoutUser = async () => {
    let data = await userServices.logout();
    await disconnectWallet();
    if (data.statusCode === 200) {
      navigate("/login");
      window.location.reload();
    }
  };

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setMobileMenuOpen(false);
    },
    [navigate]
  );

  const getCurrectLoginUser = async () => {
    let data = await userServices.getCurrectLoginUser();
    setUserName(data?.userName);
    setFirstName(data?.firstName);
  };

  useEffect(() => {
    getCurrectLoginUser();
  }, []);

  const userInitial = useMemo(() => {
    return (
      userName?.charAt(0).toUpperCase() ||
      firstName?.charAt(0).toUpperCase() ||
      "U"
    );
  }, [userName, firstName]);

  return (
    <nav className="w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/lovable-uploads/logo.png"
              alt="GrowmaxGlobal"
              onClick={() => navigate("/dashboard")}
              className="h-[60px]"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`flex items-center space-x-1 px-2 xl:px-3 py-2 text-xs xl:text-sm ${
                  isActive(item.path)
                    ? "bg-gold-400/20 text-gold-400 border border-gold-400/30"
                    : "text-black-300 hover:text-white hover:bg-black-700"
                }`}
                onClick={() => {
                  navigate(item.path);
                  window.location.reload();
                }}
              >
                <item.icon className="h-3 w-3 xl:h-4 xl:w-4" />
                <span className="hidden xl:block">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center space-x-2 lg:space-x-3 relative">
              <div>
                <button
                  onClick={toggleDropdown}
                  className="text-black-300 hover:text-[#F9DB9A] transition-colors flex items-center gap-2 capitalize"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gold-400 rounded-full flex items-center justify-center text-black font-bold text-xs sm:text-sm">
                    {userInitial}
                  </div>
                  {userName ? userName : firstName}
                </button>

                {isOpen && (
                  <div className="absolute left-0 mt-4 w-48 bg-black rounded-lg shadow-lg overflow-hidden" style={{zIndex: 9999}}>
                    <NavLink
                      to="/settings"
                      className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-gold-400' : 'text-black-300'} hover:bg-[#F9DB9A] hover:text-black transition-colors flex items-center`}
                      onClick={closeDropdown}
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                      <span className="hidden lg:block">Profile</span>
                    </NavLink>
                    <NavLink
                      to="/all-transactions"
                      className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-gold-400' : 'text-black-300'} hover:bg-[#F9DB9A] hover:text-black transition-colors flex items-center`}
                      onClick={closeDropdown}
                    >
                      <Receipt className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                      <span className="hidden lg:block">My Transaction</span>
                    </NavLink>
                    <button
                      onClick={() => {
                        logoutUser();
                        closeDropdown();
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-black-300 hover:bg-red-400/10 hover:text-red-300 transition-colors flex items-center"
                    >
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4 lg:mr-2" />
                      <span className="hidden lg:block">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
             <div className="ml-2">
              <WalletConnectButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <WalletConnectButton />
            <Button
              variant="ghost"
              className="text-black-300 p-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black backdrop-blur-lg border-t border-black-700/50">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start flex items-center space-x-3 px-3 py-3 text-sm ${
                  isActive(item.path)
                    ? "bg-gold-400/20 text-gold-400"
                    : "text-black-300 hover:text-white hover:bg-black-700"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
            <NavLink
              to="/settings"
              className={({ isActive }) => `w-full justify-start flex items-center space-x-3 px-3 py-3 text-sm ${isActive ? 'bg-gold-400/20 text-gold-400' : 'text-black-300 hover:text-white hover:bg-black-700'}`}
              onClick={() => handleNavigation("/settings")}
            >
              <Settings className="h-4 w-4" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/security"
              className={({ isActive }) => `w-full justify-start flex items-center space-x-3 px-3 py-3 text-sm ${isActive ? 'bg-gold-400/20 text-gold-400' : 'text-black-300 hover:text-white hover:bg-black-700'}`}
              onClick={() => handleNavigation("/security")}
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </NavLink>
            <NavLink
              to="/all-transactions"
              className={({ isActive }) => `w-full justify-start flex items-center space-x-3 px-3 py-3 text-sm ${isActive ? 'bg-gold-400/20 text-gold-400' : 'text-black-300 hover:text-white hover:bg-black-700'}`}
              onClick={() => handleNavigation("/all-transactions")}
            >
              <Receipt className="h-4 w-4" />
              <span>My Transaction</span>
            </NavLink>
            <Button
              variant="ghost"
              className={`w-full justify-start flex items-center space-x-3 px-3 py-3 text-sm text-black-300 hover:text-white hover:bg-black-700`}
              onClick={() => {
                logoutUser();
                closeDropdown();
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
});

NavBar.displayName = "NavBar";

export default NavBar;