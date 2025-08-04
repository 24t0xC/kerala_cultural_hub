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
  const { user, userProfile, signIn, signUp, signOut, signInWithOAuth, loading } = useAuth();
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
          // Demo mode - store user in localStorage for header access
          const demoUser = {
            id: Date.now(),
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
            isDemo: true
          };
          
          localStorage.setItem('kerala_demo_user', JSON.stringify(demoUser));
          console.log(`Demo login successful as ${matchedUser.role}`);
          
          // For demo purposes, navigate to appropriate page
          if (matchedUser?.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/events');
          }
          
          // Show success notification
          alert(`✅ Demo Login Successful!\n\nRole: ${matchedUser.role}\nNote: This is demo mode. Configure Supabase OAuth for production.`);
          
          // Force page reload to trigger header update
          window.location.reload();
        } else {
          throw new Error('Invalid email or password. Please use the demo credentials shown below.');
        }
      }
      // Success case for real Supabase login is handled by useEffect when user state changes
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
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        throw new Error(error);
      }
      
      // Success case - OAuth will redirect automatically
      // No need to manually navigate since Supabase handles the redirect
    } catch (error) {
      alert(error?.message || `${provider} login failed. Please make sure ${provider} OAuth is configured in your Supabase dashboard.`);
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

            {/* OAuth Setup Info */}
            <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-sm text-blue-800 mb-2 flex items-center">
                <Icon name="Settings" size={16} className="mr-2" />
                OAuth Configuration
              </h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• <strong>Google Login:</strong> Requires Supabase OAuth setup</p>
                <p>• <strong>Setup Guide:</strong> See OAUTH_SETUP.md in project root</p>
                <p>• <strong>Status:</strong> Configure in Supabase Dashboard → Authentication → Providers</p>
              </div>
            </div>

            {/* Test Credentials Info */}
            <div className="mt-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
              <h3 className="font-medium text-sm text-green-800 mb-2 flex items-center">
                <Icon name="Key" size={16} className="mr-2" />
                Demo Login Credentials ✅
              </h3>
              <div className="text-xs text-green-700 space-y-1">
                <p><strong>Admin:</strong> admin@keralahub.com / admin123</p>
                <p><strong>Artist:</strong> artist@keralahub.com / artist123</p>
                <p><strong>Organizer:</strong> organizer@keralahub.com / organizer123</p>
                <p><strong>User:</strong> user@keralahub.com / user123</p>
                <p className="text-green-600 mt-2"><strong>✓ These work immediately for testing!</strong></p>
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