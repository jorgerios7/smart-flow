import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useThemeMode } from '../../hooks/useThemeMode';
import { themeColors } from '../../theme/colors';

export function CustomToast() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#4CAF50', backgroundColor: colors.surface, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ color: colors.text, fontSize: 15, fontWeight: 'bold' }}
        text2Style={{ color: colors.textMuted, fontSize: 13 }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: colors.error, backgroundColor: colors.surface, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ color: colors.text, fontSize: 15, fontWeight: 'bold' }}
        text2Style={{ color: colors.textMuted, fontSize: 13 }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.primary, backgroundColor: colors.surface, borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{ color: colors.text, fontSize: 15, fontWeight: 'bold' }}
        text2Style={{ color: colors.textMuted, fontSize: 13 }}
      />
    )
  };

  return <Toast config={toastConfig} />;
}
