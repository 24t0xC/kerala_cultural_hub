import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToDashboard = () => {
    const userRole = userProfile?.role || user?.user_metadata?.role || 'user';
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} userProfile={userProfile} />
      
      <main className="pt-16 lg:pt-30 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6">
              <Icon name="ShieldAlert" size={48} className="text-error" />
            </div>

            {/* Error Message */}
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Access Denied
            </h1>
            
            <p className="text-lg text-muted-foreground mb-2 max-w-md">
              You don't have permission to access this page.
            </p>
            
            <p className="text-sm text-muted-foreground mb-8 max-w-md">
              This page is restricted to certain user roles. Please contact an administrator if you believe this is an error.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Go Back
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="default"
                iconName="Home"
                iconPosition="left"
              >
                Go to Home
              </Button>

              {user && (
                <Button
                  onClick={handleGoToDashboard}
                  variant="default"
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  My Dashboard
                </Button>
              )}
            </div>

            {/* Additional Help */}
            <div className="mt-12 p-4 bg-card border border-border rounded-lg max-w-md">
              <h3 className="font-medium text-foreground mb-2">Need Different Access?</h3>
              <ul className="text-sm text-muted-foreground text-left space-y-1">
                <li>• Contact your organization admin</li>
                <li>• Check if your account role is correct</li>
                <li>• Try logging out and logging back in</li>
                <li>• Contact support if the issue persists</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Unauthorized;