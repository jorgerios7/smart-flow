import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransactionStatus } from '../../../../../types/wallet.types';
import { styles } from '../styles';

interface StatusSelectorProps {
  status: TransactionStatus;
  onSelect: (status: TransactionStatus) => void;
  colors: any;
}

export function StatusSelector({ status, onSelect, colors }: StatusSelectorProps) {
  return (
    <View style={styles.chipsContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.chip,
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: status === 'paid' ? colors.success : colors.surfaceHighlight,
            borderColor: status === 'paid' ? colors.success : colors.border,
          },
        ]}
        onPress={() => onSelect('paid')}
      >
        <Ionicons name="checkmark-circle" size={16} color={status === 'paid' ? '#FFF' : colors.textMuted} />
        <Text style={[styles.chipText, { color: status === 'paid' ? '#FFF' : colors.textMuted }]}>Pago</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.chip,
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: status === 'pending' ? '#f39c12' : colors.surfaceHighlight,
            borderColor: status === 'pending' ? '#f39c12' : colors.border,
          },
        ]}
        onPress={() => onSelect('pending')}
      >
        <Ionicons name="time" size={16} color={status === 'pending' ? '#FFF' : colors.textMuted} />
        <Text style={[styles.chipText, { color: status === 'pending' ? '#FFF' : colors.textMuted }]}>Pendente</Text>
      </TouchableOpacity>
    </View>
  );
}
