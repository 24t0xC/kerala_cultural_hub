import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = ({ onSocialLogin, isLoading }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'hover:bg-red-50 hover:border-red-200'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'hover:bg-blue-50 hover:border-blue-200'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            size="default"
            onClick={() => onSocialLogin(provider?.id)}
            disabled={isLoading}
            iconName={provider?.icon}
            iconPosition="left"
            iconSize={18}
            className={`transition-all duration-200 ${provider?.color}`}
          >
            {provider?.name}
          </Button>
        ))}
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>Secure authentication powered by Kerala Cultural Hub</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;