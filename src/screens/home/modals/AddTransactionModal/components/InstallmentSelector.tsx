import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface InstallmentSelectorProps {
  installmentNumber: number;
  onChangeInstallment: (num: number) => void;
  colors: any;
}

export function InstallmentSelector({ installmentNumber, onChangeInstallment, colors }: InstallmentSelectorProps) {
  return (
    <View style={[styles.controlsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: colors.surfaceHighlight }]}
        onPress={() => onChangeInstallment(Math.max(1, installmentNumber - 1))}
      >
        <Ionicons name="remove" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.controlValue, { color: colors.text }]}>{installmentNumber}x</Text>
      <TouchableOpacity
        style={[styles.controlButton, { backgroundColor: colors.surfaceHighlight }]}
        onPress={() => onChangeInstallment(Math.min(48, installmentNumber + 1))}
      >
        <Ionicons name="add" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}
