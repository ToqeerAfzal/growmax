import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  Wallet,
  BarChart3,
  Lock,
  Settings,
  LogOut,
  Menu,
  X,
  FileBarChart,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { userServices } from '../../Services/userServices';
import WalletConnectButton from './WalletConnectButton';

const AdminNavBar = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = useMemo(() => [
    { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users-updated' },
    { icon: Wallet, label: 'Packages', path: '/admin/packages-updated' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
    { icon: DollarSign, label: 'Contract Balance', path: '/admin/contract-balance' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ], []);

  const logoutAdmin = async () => {
    let data = await userServices.logout()
    if (data.statusCode === 200) {
      navigate('/login');
      window.location.reload();
    }
  }

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleNavigation = useCallback((path) => {
    navigate(path);
    setMobileMenuOpen(false);
  }, [navigate]);

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-black" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gold-400 to-yellow-500 bg-clip-text text-transparent">
                Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap ${isActive(item.path)
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Admin Profile & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                A
              </div>
              <span className="text-gray-300 text-sm">Administrator</span>
            </div>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3"
              onClick={logoutAdmin}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
            <WalletConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              className="text-gray-300 p-2"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-lg border-t border-gray-700/50">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start flex items-center space-x-3 px-3 py-3 text-sm ${isActive(item.path)
                  ? 'bg-gold-400/20 text-gold-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex items-center px-3 py-2 text-gray-300 text-sm">
                <div className="w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center text-black font-bold text-xs mr-3">
                  A
                </div>
                Administrator
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <Button
                  variant="ghost"
                  className="flex-1 justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={logoutAdmin}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Button>
                <WalletConnectButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

AdminNavBar.displayName = 'AdminNavBar';

export default AdminNavBar;
