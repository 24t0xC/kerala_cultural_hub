import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialLogin from './components/SocialLogin';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import CulturalBackground from './components/CulturalBackground';
import Icon from '../../components/AppIcon';

const LoginRegisterPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { user, userProfile, signIn, signUp, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Mock credentials for testing (keeping for demo purposes)
  const mockCredentials = {
    admin: { email: "admin@keralahub.com", password: "admin123", role: "admin", name: "Admin User" },
    artist: { email: "artist@keralahub.com", password: "artist123", role: "artist", name: "Ravi Menon" },
    organizer: { email: "organizer@keralahub.com", password: "organizer123", role: "organizer", name: "Priya Nair" },
    user: { email: "user@keralahub.com", password: "user123", role: "enthusiast", name: "Arjun Kumar" }
  };

  useEffect(() => {
    // Check if user is already logged in via Supabase
    if (user && !loading) {
      // Redirect based on user role
      if (userProfile?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/events');
      }
    }
  }, [user, userProfile, loading, navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        // If Supabase login fails, check mock credentials for demo
        const matchedUser = Object.values(mockCredentials)?.find(
          cred => cred?.email === formData?.email && cred?.password === formData?.password
        );
        
        if (matchedUser) {
          alert(`Demo mode: Would login as ${matchedUser.role}. In production, this would use Supabase authentication.`);
          // For demo purposes, show mock login info
        } else {
          throw new Error(error || 'Invalid email or password. Try the demo credentials provided below.');
        }
      }
      // Success case is handled by useEffect when user state changes
    } catch (error) {
      alert(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    
    try {
      const { error } = await signUp(formData?.email, formData?.password, {
        full_name: formData?.name,
        role: formData?.userType || 'user'
      });
      
      if (error) {
        throw new Error(error);
      }
      
      alert('Registration successful! Please check your email to verify your account.');
      setActiveTab('login'); // Switch to login tab
    } catch (error) {
      alert(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        name: `${provider?.charAt(0)?.toUpperCase() + provider?.slice(1)} User`,
        email: `user@${provider}.com`,
        role: 'enthusiast',
        loginTime: new Date()?.toISOString(),
        provider: provider
      };
      
      localStorage.setItem('keralaCulturalHub_user', JSON.stringify(userData));
      setUser(userData);
      navigate('/event-details');
    } catch (error) {
      alert(`${provider} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    
    try {
      // Simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Success is handled in the modal component
    } catch (error) {
      alert('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthAction = async (action) => {
    if (action === 'logout') {
      await signOut();
      navigate('/login-register');
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <CulturalBackground />
      
      <Header user={user} userProfile={userProfile} onAuthAction={handleAuthAction} />
      
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-md">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-warm-lg">
                <Icon name="Users" size={32} className="text-primary-foreground" />
              </div>
              
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                Welcome to Kerala Cultural Hub
              </h1>
              
              <p className="text-muted-foreground text-sm">
                {activeTab === 'login' ?'Sign in to discover amazing cultural events' :'Join our community of cultural enthusiasts'
                }
              </p>
            </div>

            {/* Auth Form Container */}
            <div className="bg-card rounded-lg shadow-warm-xl border border-border p-6">
              <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
              {activeTab === 'login' ? (
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  onForgotPassword={() => setIsForgotPasswordOpen(true)}
                />
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                />
              )}
              
              <div className="mt-6">
                <SocialLogin
                  onSocialLogin={handleSocialLogin}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Test Credentials Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h3 className="font-medium text-sm text-foreground mb-2 flex items-center">
                <Icon name="Info" size={16} className="mr-2" />
                Test Credentials
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Admin:</strong> admin@keralahub.com / admin123</p>
                <p><strong>Artist:</strong> artist@keralahub.com / artist123</p>
                <p><strong>Organizer:</strong> organizer@keralahub.com / organizer123</p>
                <p><strong>User:</strong> user@keralahub.com / user123</p>
              </div>
            </div>

            {/* Cultural Quote */}
            <div className="text-center mt-8">
              <blockquote className="text-sm text-muted-foreground italic">
                "Culture is the widening of the mind and of the spirit."
              </blockquote>
              <cite className="text-xs text-muted-foreground mt-1 block">
                - Jawaharlal Nehru
              </cite>
            </div>
          </div>
        </div>
      </main>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default LoginRegisterPage;