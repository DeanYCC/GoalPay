import { useState, useEffect } from 'react';

export interface UserSettingsData {
  id?: string;
  language: string;
  theme: string;
  defaultCurrency: string;
  dateFormat: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  timezone?: string;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettingsData>({
    language: 'zh-TW',
    theme: 'light',
    defaultCurrency: 'JPY',
    dateFormat: 'YYYY-MM-DD',
    notificationsEnabled: true,
    emailNotifications: true,
    timezone: 'Asia/Tokyo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      console.error('Error fetching user settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettingsData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedSettings = { ...settings, ...newSettings };
      
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        const savedSettings = await response.json();
        setSettings(savedSettings);
        return { success: true, data: savedSettings };
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      console.error('Error updating user settings:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (field: keyof UserSettingsData, value: any) => {
    return updateSettings({ [field]: value });
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateSetting,
    refreshSettings: fetchSettings
  };
}
