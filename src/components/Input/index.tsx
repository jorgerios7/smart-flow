import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../hooks/useThemeMode';
import { useSystemFontScale } from '../../hooks/useSystemFontScale';
import { themeColors } from '../../theme/colors';
import { InputProps } from '../../types/components.types';
import { styles } from './styles';

export function Input({ iconName, isPassword, isDate, ...props }: InputProps) {
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const [showPassword, setShowPassword] = useState(false);

  const handleChangeText = (text: string) => {
    if (isDate) {
      let cleaned = text.replace(/\D/g, '');
      if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

      let formatted = cleaned;
      if (cleaned.length >= 5) {
        formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
      } else if (cleaned.length >= 3) {
        formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
      }

      props.onChangeText?.(formatted);
    } else {
      props.onChangeText?.(text);
    }
  };

  return (
    <View style={[styles.inputGroup, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
      {iconName && (
        <Ionicons name={iconName} size={scale(20)} color={colors.textMuted} style={styles.inputIcon} />
      )}
      <TextInput
        style={[styles.input, { color: colors.text, fontSize: scale(16) }]}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={isPassword && !showPassword}
        maxLength={isDate ? 10 : props.maxLength}
        keyboardType={isDate ? 'number-pad' : props.keyboardType}
        {...props}
        onChangeText={handleChangeText}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={scale(20)} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}


