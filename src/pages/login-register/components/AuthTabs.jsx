import React from 'react';
import Button from '../../../components/ui/Button';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Sign In' },
    { id: 'register', label: 'Create Account' }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      {tabs?.map((tab) => (
        <Button
          key={tab?.id}
          variant={activeTab === tab?.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab?.id)}
          className="flex-1 transition-all duration-200"
        >
          {tab?.label}
        </Button>
      ))}
    </div>
  );
};

export default AuthTabs;