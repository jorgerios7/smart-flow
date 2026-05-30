import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles';

interface AmountInputProps {
  amount: string;
  onChangeAmount: (text: string) => void;
  onBlur: () => void;
  colors: any;
}

export function AmountInput({ amount, onChangeAmount, onBlur, colors }: AmountInputProps) {
  return (
    <View style={[styles.amountInputContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.currencySymbol, { color: colors.textMuted }]}>R$</Text>
      <TextInput
        style={[styles.amountInput, { color: colors.text }]}
        keyboardType="numeric"
        placeholder="0,00"
        placeholderTextColor={colors.border}
        value={amount}
        onChangeText={onChangeAmount}
        onBlur={onBlur}
      />
    </View>
  );
}
