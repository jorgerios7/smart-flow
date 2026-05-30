import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface AccountSelectorProps {
  selectedAccountId: string | null;
  onSelect: (accountId: string) => void;
  availableAccounts: any[];
  colors: any;
}

export function AccountSelector({ selectedAccountId, onSelect, availableAccounts, colors }: AccountSelectorProps) {
  if (availableAccounts.length === 0) {
    return (
      <Text style={{ color: colors.textMuted, fontSize: 14 }}>
        Nenhuma conta bancária cadastrada.
      </Text>
    );
  }

  return (
    <View style={styles.chipsContainer}>
      {availableAccounts.map(account => (
        <TouchableOpacity
          key={account.id}
          activeOpacity={0.7}
          style={[
            styles.chip,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: selectedAccountId === account.id ? colors.primary : colors.surfaceHighlight,
              borderColor: selectedAccountId === account.id ? colors.primary : colors.border,
            },
          ]}
          onPress={() => onSelect(account.id)}
        >
          <Ionicons name="business" size={16} color={selectedAccountId === account.id ? '#FFF' : colors.textMuted} />
          <Text style={[styles.chipText, { color: selectedAccountId === account.id ? '#FFF' : colors.textMuted }]}>
            {account.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
