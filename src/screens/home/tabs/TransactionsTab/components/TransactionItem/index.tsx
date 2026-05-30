import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EnrichedInstallment } from '../../../../../../hooks/useTransactionsList';
import { formatCurrency } from '../../../../../../utils/format';
import { styles } from './styles';

interface TransactionItemProps {
  item: EnrichedInstallment;
  colors: any;
  onPress: (item: EnrichedInstallment) => void;
}

const getTransactionIcon = (category: string, type: string) => {
  if (type === 'income') return 'arrow-up-circle';
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'Supermercado': 'cart',
    'Transporte': 'car',
    'Alimentação': 'restaurant',
    'Saúde': 'medkit',
    'Educação': 'book',
    'Lazer': 'game-controller',
    'Moradia': 'home',
  };
  return iconMap[category] || 'cash';
};

export default function TransactionItem({ item, colors, onPress }: TransactionItemProps) {
  const isIncome = item.transaction.type === 'income';
  const isPaid = item.status === 'paid';

  return (
    <TouchableOpacity
      style={[styles.itemContainer, { borderBottomColor: colors.border }]}
      onPress={() => onPress(item)}
    >
      <View style={[styles.itemIconContainer, { backgroundColor: isIncome ? `${colors.success}20` : `${colors.error}20` }]}>
        <Ionicons
          name={getTransactionIcon(item.category, item.transaction.type)}
          size={24}
          color={isIncome ? colors.success : colors.error}
        />
      </View>

      <View style={styles.itemInfo}>
        <View style={styles.itemTitleRow}>
          <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
            {item.transaction.name}
          </Text>
          <Text style={[styles.itemAmount, { color: isIncome ? colors.success : colors.text }]}>
            {isIncome ? '+' : '-'}{formatCurrency(item.amount || 0)}
          </Text>
        </View>

        <View style={styles.itemSubtitleRow}>
          <Text style={[styles.itemCategory, { color: colors.textMuted }]}>
            {item.category} {item.transaction.purchase?.installmentNumber && item.transaction.purchase.installmentNumber > 1 ? `(${item.installmentIndex}/${item.transaction.purchase.installmentNumber})` : ''}
          </Text>

          <View style={[styles.itemStatus, {
            backgroundColor: isPaid ? `${colors.success}20` : `${colors.error}20`
          }]}>
            <Text style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: isPaid ? colors.success : colors.error
            }}>
              {isPaid ? 'PAGO' : 'PENDENTE'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
