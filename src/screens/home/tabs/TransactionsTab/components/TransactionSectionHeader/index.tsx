import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { formatCurrency, formatDateLabel } from '../../../../../../utils/format';

interface TransactionSectionHeaderProps {
  title: string;
  balance: number;
  colors: any;
}

export default function TransactionSectionHeader({ title, balance, colors }: TransactionSectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionDate, { color: colors.textMuted }]}>{formatDateLabel(title)}</Text>
      <Text style={[styles.sectionBalance, { color: balance >= 0 ? colors.success : colors.error }]}>
        {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
      </Text>
    </View>
  );
}
