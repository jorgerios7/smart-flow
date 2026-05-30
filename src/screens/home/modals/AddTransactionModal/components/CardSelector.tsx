import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface CardSelectorProps {
  selectedCardId: string | null;
  onSelect: (cardId: string) => void;
  filteredCards: any[];
  instrument: string | null;
  colors: any;
}

export function CardSelector({ selectedCardId, onSelect, filteredCards, instrument, colors }: CardSelectorProps) {
  if (filteredCards.length === 0) {
    return (
      <Text style={{ color: colors.textMuted, fontSize: 14 }}>
        Nenhum cartão {instrument === 'credit_card' ? 'de crédito' : 'de débito'} cadastrado.
      </Text>
    );
  }

  return (
    <View style={styles.chipsContainer}>
      {filteredCards.map(card => (
        <TouchableOpacity
          key={card.id}
          activeOpacity={0.7}
          style={[
            styles.chip,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: selectedCardId === card.id ? colors.primary : colors.surfaceHighlight,
              borderColor: selectedCardId === card.id ? colors.primary : colors.border,
            },
          ]}
          onPress={() => onSelect(card.id)}
        >
          <Ionicons name="card" size={16} color={selectedCardId === card.id ? '#FFF' : colors.textMuted} />
          <Text style={[styles.chipText, { color: selectedCardId === card.id ? '#FFF' : colors.textMuted }]}>
            {card.name} (final {card.last4Digits})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
