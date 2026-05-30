import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useSystemFontScale } from '../../hooks/useSystemFontScale';
import { themeColors } from '../../theme/colors';
import { ButtonProps } from '../../types/components.types';
import { styles } from './styles';

export function Button({ title, iconName, variant = 'primary', style, textStyle, ...props }: ButtonProps) {
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const backgroundColor = variant === 'primary' ? colors.primary : colors.secondary;
  const shadowColor = backgroundColor;
  const textColor = isDark && variant === 'primary' ? '#000' : '#FFF';

  // Extrair a cor de textStyle se existir para repassar pro ícone
  const customColor = textStyle && (textStyle as any).color ? (textStyle as any).color : textColor;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, shadowColor },
        style
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, { fontSize: scale(16), color: textColor }, textStyle]}>{title}</Text>
      {iconName && <Ionicons name={iconName} size={scale(20)} color={customColor} />}
    </TouchableOpacity>
  );
}


