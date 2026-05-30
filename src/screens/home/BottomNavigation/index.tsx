import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { themeColors } from '../../../theme/colors';
import { styles } from './styles';
import { BottomNavigationProps } from '../../../types/components.types';

export default function BottomNavigation({ activeTab, onChangeTab, onAddTransaction }: BottomNavigationProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  function TabButton({ icon, isActive, onPress }: { icon: string, isActive: boolean, onPress: () => void }) {
    return (
      <TouchableOpacity
        key={icon}
        style={[styles.tabButton, isActive && { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={onPress}
      >
        <Ionicons name={icon as any} size={22} color={isActive ? colors.background : colors.primary} />
      </TouchableOpacity>
    );
  }

  function RoundButton({ icon, onPress }: { icon: string, onPress: () => void }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.floatingButton,
          { backgroundColor: colors.primary, shadowColor: colors.primary }
        ]}
        onPress={() => { onPress() }}
      >
        <Ionicons name={icon as any} size={32} color={isDark ? colors.background : '#FFF'} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <TabButton isActive={activeTab === 'dashboards'} icon="pie-chart-outline" onPress={() => { onChangeTab('dashboards') }} />
      <TabButton isActive={activeTab === 'transactions'} icon="swap-horizontal" onPress={() => { onChangeTab('transactions') }} />
      <RoundButton icon="add" onPress={onAddTransaction} />
      <TabButton isActive={activeTab === 'members'} icon="people-outline" onPress={() => { onChangeTab('members') }} />
      <TabButton isActive={activeTab === 'profile'} icon="person-outline" onPress={() => { onChangeTab('profile') }} />
    </View>
  )
}
