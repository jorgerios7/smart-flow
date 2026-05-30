import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransactionType } from '../../../../../types/wallet.types';
import { styles } from '../styles';

interface TypeSelectorProps {
  type: TransactionType | null;
  onSelect: (type: TransactionType) => void;
  colors: any;
}

export function TypeSelector({ type, onSelect, colors }: TypeSelectorProps) {
  return (
    <View style={styles.typeContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.typeButton,
          { backgroundColor: colors.surface, borderColor: type === 'expense' ? colors.error : colors.border },
        ]}
        onPress={() => onSelect('expense')}
      >
        <View
          style={[
            styles.typeIconContainer,
            { backgroundColor: type === 'expense' ? `${colors.error}20` : colors.surfaceHighlight },
          ]}
        >
          <Ionicons
            name="arrow-down-circle-outline"
            size={24}
            color={type === 'expense' ? colors.error : colors.textMuted}
          />
        </View>
        <Text style={[styles.typeText, { color: type === 'expense' ? colors.error : colors.text }]}>Despesa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.typeButton,
          { backgroundColor: colors.surface, borderColor: type === 'income' ? colors.success : colors.border },
        ]}
        onPress={() => onSelect('income')}
      >
        <View
          style={[
            styles.typeIconContainer,
            { backgroundColor: type === 'income' ? `${colors.success}20` : colors.surfaceHighlight },
          ]}
        >
          <Ionicons
            name="arrow-up-circle-outline"
            size={24}
            color={type === 'income' ? colors.success : colors.textMuted}
          />
        </View>
        <Text style={[styles.typeText, { color: type === 'income' ? colors.success : colors.text }]}>Receita</Text>
      </TouchableOpacity>
    </View>
  );
}
