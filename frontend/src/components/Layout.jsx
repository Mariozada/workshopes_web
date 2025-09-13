import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  BookOpen, 
  LogOut, 
  Settings,
  BarChart3,
  Users
} from 'lucide-react';
import { cn } from '../utils/helpers';

export const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Workshops', href: '/workshops', icon: Calendar },
  ];

  const userNavigation = isAuthenticated ? [
    { name: 'My Bookings', href: '/my-bookings', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ] : [];

  const adminNavigation = isAdmin ? [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Manage Workshops', href: '/admin/workshops', icon: Calendar },
    { name: 'Manage Bookings', href: '/admin/bookings', icon: BookOpen },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and primary navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  WorkshopHub
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {isAuthenticated ? (
                <>
                  {/* User navigation */}
                  <div className="flex space-x-4">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                          isActive(item.href)
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {/* Admin navigation */}
                  {isAdmin && (
                    <div className="flex space-x-4 pl-4 border-l border-gray-200">
                      {adminNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                            isActive(item.href)
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* User menu */}
                  <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-700">
                      Hello, {user?.first_name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {isAuthenticated && (
              <>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.first_name} {user?.last_name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    {isAdmin && adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                WorkshopHub
              </Link>
              <p className="mt-4 text-gray-600 max-w-md">
                Discover and book amazing workshops to enhance your skills and knowledge. 
                Join our community of learners and professionals.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/workshops" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Browse Workshops
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-400 text-sm">
              © 2025 WorkshopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
