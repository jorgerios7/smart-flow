import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface OptionItemProps {
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
  colors: any;
}

export default function OptionItem({ icon, title, color, onPress, colors }: OptionItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.optionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.optionContent}>
        <View style={[styles.optionIconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={[styles.optionText, { color: colors.text }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}
