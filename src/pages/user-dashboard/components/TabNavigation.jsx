import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-1 shadow-warm">
      <div className="flex space-x-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground shadow-warm-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon
              name={tab?.icon}
              size={18}
              className="transition-colors duration-200"
            />
            <span className="font-medium text-sm hidden sm:inline">
              {tab?.label}
            </span>
            {tab?.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                activeTab === tab?.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;