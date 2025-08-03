import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarIntegration = ({ savedEvents, onSyncCalendar }) => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [selectedCalendar, setSelectedCalendar] = useState('google');

  const handleSync = async (calendarType) => {
    setSyncStatus('syncing');
    setSelectedCalendar(calendarType);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('success');
      onSyncCalendar?.(calendarType, savedEvents);
      
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }
  };

  const getStatusMessage = () => {
    switch (syncStatus) {
      case 'syncing':
        return `Syncing with ${selectedCalendar === 'google' ? 'Google' : 'Apple'} Calendar...`;
      case 'success':
        return `Successfully synced ${savedEvents?.length} events!`;
      case 'error':
        return 'Sync failed. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            Calendar Integration
          </h3>
          <p className="text-sm text-muted-foreground font-caption">
            Sync your saved events with your calendar
          </p>
        </div>
        <Icon name="Calendar" size={24} className="text-primary" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Icon name="Calendar" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-sm text-card-foreground">
                Google Calendar
              </p>
              <p className="text-xs text-muted-foreground">
                Sync with your Google account
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={syncStatus === 'syncing' && selectedCalendar === 'google'}
            disabled={syncStatus === 'syncing'}
            onClick={() => handleSync('google')}
          >
            Sync
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
              <Icon name="Calendar" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-sm text-card-foreground">
                Apple Calendar
              </p>
              <p className="text-xs text-muted-foreground">
                Sync with your Apple devices
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={syncStatus === 'syncing' && selectedCalendar === 'apple'}
            disabled={syncStatus === 'syncing'}
            onClick={() => handleSync('apple')}
          >
            Sync
          </Button>
        </div>
      </div>
      {syncStatus !== 'idle' && (
        <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
          syncStatus === 'success' ? 'bg-success/10 text-success' :
          syncStatus === 'error'? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
        }`}>
          {syncStatus === 'syncing' && (
            <Icon name="Loader2" size={16} className="animate-spin" />
          )}
          {syncStatus === 'success' && (
            <Icon name="CheckCircle" size={16} />
          )}
          {syncStatus === 'error' && (
            <Icon name="AlertCircle" size={16} />
          )}
          <span className="text-sm font-medium">
            {getStatusMessage()}
          </span>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Events to sync: {savedEvents?.length}
          </span>
          <Button variant="ghost" size="sm" iconName="Settings">
            Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;