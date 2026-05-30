import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface NameSelectorProps {
  transactionName: string;
  onSelect: (name: string) => void;
  nameSuggestions: string[];
  customNameSuggestions: string[];
  onAddPress: () => void;
  onDeletePress: (name: string) => void;
  colors: any;
}

export function NameSelector({
  transactionName,
  onSelect,
  nameSuggestions,
  customNameSuggestions,
  onAddPress,
  onDeletePress,
  colors,
}: NameSelectorProps) {
  return (
    <View style={styles.chipsContainer}>
      {nameSuggestions.map(sug => {
        const isCustomName = customNameSuggestions.includes(sug);
        return (
          <TouchableOpacity
            key={sug}
            activeOpacity={0.7}
            style={[
              styles.chip,
              {
                flexDirection: isCustomName ? 'row' : undefined,
                alignItems: isCustomName ? 'center' : undefined,
                gap: isCustomName ? 6 : undefined,
                backgroundColor: transactionName === sug ? colors.primary : colors.surfaceHighlight,
                borderColor: transactionName === sug ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(sug)}
          >
            <Text style={[styles.chipText, { color: transactionName === sug ? '#FFF' : colors.textMuted }]}>{sug}</Text>
            {isCustomName && (
              <TouchableOpacity
                onPress={() => onDeletePress(sug)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={16} color={transactionName === sug ? '#FFF' : colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}

      {transactionName !== '' && !nameSuggestions.includes(transactionName) && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.chip,
            {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => onSelect(transactionName)}
        >
          <Text style={[styles.chipText, { color: '#FFF' }]}>{transactionName}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.chip,
          {
            backgroundColor: colors.surfaceHighlight,
            borderColor: colors.border,
            borderStyle: 'dashed',
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          },
        ]}
        onPress={onAddPress}
      >
        <Ionicons name="add" size={16} color={colors.textMuted} />
        <Text style={[styles.chipText, { color: colors.textMuted }]}>Outro</Text>
      </TouchableOpacity>
    </View>
  );
}
