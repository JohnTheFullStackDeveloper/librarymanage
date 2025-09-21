import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BookOpen, 
  Home, 
  Heart, 
  Calendar, 
  Users, 
  Plus, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'books', label: 'Books', icon: BookOpen },
    ...(currentUser?.role !== 'admin' ? [
      { key: 'favorites', label: 'Favorites', icon: Heart },
    { key: 'reservations', label: 'Reservations', icon: Calendar },
    ] : []),
    ...(currentUser?.role === 'admin' ? [
      { key: 'users', label: 'Users', icon: Users },
      { key: 'add-book', label: 'Add Book', icon: Plus }
    ] : [])
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Library System
              </h1>
              {currentUser && (
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {currentUser.role} Dashboard
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === item.key
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Info (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {currentUser?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setCurrentView(item.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      currentView === item.key
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile User Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {currentUser?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {currentUser?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;