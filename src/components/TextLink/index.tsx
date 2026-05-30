import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useSystemFontScale } from '../../hooks/useSystemFontScale';
import { themeColors } from '../../theme/colors';
import { TextLinkProps } from '../../types/components.types';
import { styles } from './styles';

export function TextLink({ text, color = 'primary', fontSize = 14, style, ...props }: TextLinkProps) {
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const getTextColor = () => {
    switch (color) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'muted': return colors.textMuted;
      default: return colors.primary;
    }
  };

  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <Text style={[styles.text, { color: getTextColor(), fontSize: scale(fontSize) }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}


