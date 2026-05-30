import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useThemeMode } from '../../hooks/useThemeMode';
import { themeColors } from '../../theme/colors';
import { styles } from './styles';

export function LoadingOverlay() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background + 'D9' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>Validando as informações...</Text>
    </View>
  );
}


