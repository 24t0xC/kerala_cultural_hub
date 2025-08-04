import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  // Redirect if already logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/user-dashboard" replace />;
  }

  const handleClose = () => {
    navigate('/');
  };

  const handleSwitchToSignup = () => {
    setIsSignup(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-amber-600 hover:text-amber-700">
            Kerala Cultural Hub
          </Link>
          <p className="mt-2 text-gray-600">
            Discover and celebrate Kerala's rich cultural heritage
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {isSignup ? (
            <SignupForm 
              onClose={handleClose}
              onSwitchToLogin={handleSwitchToLogin}
            />
          ) : (
            <LoginForm 
              onClose={handleClose}
              onSwitchToSignup={handleSwitchToSignup}
            />
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}