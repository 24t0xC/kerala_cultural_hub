import React, { useState } from 'react';
import { Menu, X, User, Calendar, MapIcon, BookOpen, Ticket, LogOut, Settings } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
 import LoginForm from'../auth/LoginForm';
 import SignupForm from'../auth/SignupForm';

export default function Header() {
  const { user, userProfile, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navigation = [
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'Cultural Heritage', href: '/cultural-heritage', icon: BookOpen },
    { name: 'My Tickets', href: '/tickets', icon: Ticket, requireAuth: true }
  ]

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login')
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">KC</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">Kerala Cultural Events</h1>
                  <p className="text-xs text-gray-600">Discover Kerala's Heritage</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const IconComponent = item.icon
                
                // Skip auth-required items if user is not logged in
                if (item.requireAuth && !user) return null
                
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.name}
                  </a>
                )
              })}
            </nav>

            {/* Desktop Auth/User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      {userProfile?.profile_image_url ? (
                        <img
                          src={userProfile.profile_image_url}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {userProfile?.full_name || 'User'}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.full_name}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-amber-600 capitalize">
                          {userProfile?.role}
                        </p>
                      </div>
                      
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </a>
                      
                      <a
                        href="/tickets"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        My Tickets
                      </a>
                      
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </a>
                      
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal('login')}
                    className="text-gray-600 hover:text-amber-600"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => openAuthModal('signup')}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const IconComponent = item.icon
                
                // Skip auth-required items if user is not logged in
                if (item.requireAuth && !user) return null
                
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-amber-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    {item.name}
                  </a>
                )
              })}
              
              {/* Mobile Auth Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {user ? (
                  <div>
                    <div className="flex items-center px-3 py-2 mb-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                        {userProfile?.profile_image_url ? (
                          <img
                            src={userProfile.profile_image_url}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.full_name}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <a
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </a>
                    
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </a>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        openAuthModal('login')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-amber-600 hover:bg-gray-50 rounded-md"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('signup')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-3 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-md"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={closeAuthModal}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            
            {authMode === 'login' ? (
              <LoginForm
                onClose={closeAuthModal}
                onSwitchToSignup={switchAuthMode}
              />
            ) : (
              <SignupForm
                onClose={closeAuthModal}
                onSwitchToLogin={switchAuthMode}
              />
            )}
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}