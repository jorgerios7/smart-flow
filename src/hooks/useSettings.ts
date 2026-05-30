import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export interface UserSettings {
  startInTransactions: boolean;
  activeCurrency: string;
  dueDateAlert: boolean;
  alertAdvanceDays: number;
  alertChannels: string;
  financialSummary: boolean;
  hideBalances: boolean;
  biometricAuth: boolean;
  customExpenseCategories: string[];
  customIncomeCategories: string[];
  customExpenseNames: Record<string, string[]>;
  customIncomeNames: Record<string, string[]>;
}

const defaultSettings: UserSettings = {
  startInTransactions: false,
  activeCurrency: 'BRL (R$)',
  dueDateAlert: false,
  alertAdvanceDays: 3,
  alertChannels: 'Push & Email',
  financialSummary: false,
  hideBalances: false,
  biometricAuth: false,
  customExpenseCategories: [],
  customIncomeCategories: [],
  customExpenseNames: {},
  customIncomeNames: {},
};

const SETTINGS_STORAGE_KEY = 'user_settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const storedSettings = await SecureStore.getItemAsync(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('(useSettings - loadSettings): Erro ao carregar as configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);
      await SecureStore.setItemAsync(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('(useSettings - updateSetting): Erro ao salvar a configuração:', error);
    }
  };

  const addCustomCategory = async (type: 'expense' | 'income', newCategory: string) => {
    const key = type === 'expense' ? 'customExpenseCategories' : 'customIncomeCategories';
    const currentList = settings[key] || [];
    if (!currentList.includes(newCategory)) {
      await updateSetting(key, [...currentList, newCategory]);
    }
  };

  const removeCustomCategory = async (type: 'expense' | 'income', categoryToRemove: string) => {
    const key = type === 'expense' ? 'customExpenseCategories' : 'customIncomeCategories';
    const currentList = settings[key] || [];
    const updatedList = currentList.filter(c => c !== categoryToRemove);
    await updateSetting(key, updatedList);
  };

  const addCustomTransactionName = async (type: 'expense' | 'income', category: string, newName: string) => {
    const key = type === 'expense' ? 'customExpenseNames' : 'customIncomeNames';
    const currentMap = settings[key] || {};
    const currentList = currentMap[category] || [];
    
    if (!currentList.includes(newName)) {
      const updatedMap = {
        ...currentMap,
        [category]: [...currentList, newName]
      };
      await updateSetting(key, updatedMap);
    }
  };

  const removeCustomTransactionName = async (type: 'expense' | 'income', category: string, nameToRemove: string) => {
    const key = type === 'expense' ? 'customExpenseNames' : 'customIncomeNames';
    const currentMap = settings[key] || {};
    const currentList = currentMap[category] || [];
    
    const updatedList = currentList.filter(n => n !== nameToRemove);
    const updatedMap = {
      ...currentMap,
      [category]: updatedList
    };
    await updateSetting(key, updatedMap);
  };

  return { settings, updateSetting, addCustomCategory, removeCustomCategory, addCustomTransactionName, removeCustomTransactionName, isLoading };
}
