import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useSystemFontScale } from '../../hooks/useSystemFontScale';
import { themeColors } from '../../theme/colors';
import { LogoPlaceholderProps } from '../../types/components.types';
import { styles } from './styles';

export default function LogoPlaceholder({ iconName, size = 48, dashed = false }: LogoPlaceholderProps) {
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const containerSize = size * 2;
  const borderRadius = dashed ? containerSize / 2 : 24;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.primary,
          width: containerSize,
          height: containerSize,
          borderRadius: borderRadius,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        !dashed && {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 15,
          elevation: 10,
        }
      ]}
    >
      <Ionicons name={iconName} size={scale(size)} color={colors.primary} />
    </View>
  );
}


