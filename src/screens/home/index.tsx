import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode } from '../../hooks/useThemeMode';
import { themeColors } from '../../theme/colors';
import { styles } from './styles';
import BottomNavigation from './BottomNavigation';
import TransactionsTab from './tabs/TransactionsTab';
import DashboardsTab from './tabs/DashboardsTab';
import AddTransactionModal from './modals/AddTransactionModal';
import MembersTab from './tabs/MembersTab';
import ProfileTab from './tabs/ProfileTab';
import { Tab } from '../../types/components.types';
import { useSettings } from '../../hooks/useSettings';

export default function Home() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const insets = useSafeAreaInsets();

  const { settings } = useSettings();
  const [currentTab, setCurrentTab] = useState<Tab>('dashboards');
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    setCurrentTab(settings.startInTransactions ? 'transactions' : 'dashboards');
  }, [settings.startInTransactions]);

  const renderTab = () => {
    switch (currentTab) {
      case 'dashboards':
        return <DashboardsTab />;
      case 'transactions':
        return <TransactionsTab />;
      case 'members':
        return <MembersTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <DashboardsTab />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {renderTab()}
        <AddTransactionModal visible={showAddMenu} onClose={() => { setShowAddMenu(false) }} />
      </View>
      <BottomNavigation activeTab={currentTab} onChangeTab={setCurrentTab} onAddTransaction={() => setShowAddMenu(true)} />
    </View>
  );
}


