import React from 'react';
import { TextInput } from 'react-native';
import { styles } from '../styles';

interface DateInputProps {
  dateStr: string;
  onChangeDate: (text: string) => void;
  colors: any;
}

export function DateInput({ dateStr, onChangeDate, colors }: DateInputProps) {
  return (
    <TextInput
      style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
      keyboardType="numeric"
      placeholder="DD/MM/AAAA"
      placeholderTextColor={colors.textMuted}
      value={dateStr}
      onChangeText={onChangeDate}
      maxLength={10}
    />
  );
}
