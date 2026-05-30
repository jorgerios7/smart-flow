import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod } from '../../../../../types/wallet.types';
import { styles } from '../styles';

interface InstrumentSelectorProps {
  instruments: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[];
  instrument: PaymentMethod | null;
  onSelect: (instrument: PaymentMethod) => void;
  colors: any;
}

export function InstrumentSelector({ instruments, instrument, onSelect, colors }: InstrumentSelectorProps) {
  return (
    <View style={styles.chipsContainer}>
      {instruments.map(inst => (
        <TouchableOpacity
          key={inst.id}
          activeOpacity={0.7}
          style={[
            styles.chip,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: instrument === inst.id ? colors.primary : colors.surfaceHighlight,
              borderColor: instrument === inst.id ? colors.primary : colors.border,
            },
          ]}
          onPress={() => onSelect(inst.id)}
        >
          <Ionicons name={inst.icon} size={16} color={instrument === inst.id ? '#FFF' : colors.textMuted} />
          <Text style={[styles.chipText, { color: instrument === inst.id ? '#FFF' : colors.textMuted }]}>
            {inst.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
