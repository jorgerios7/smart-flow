import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface CategorySelectorProps {
  category: string;
  onSelect: (category: string) => void;
  customCategories: string[];
  defaultCategories: string[];
  onAddPress: () => void;
  onDeletePress: (category: string) => void;
  colors: any;
}

export function CategorySelector({
  category,
  onSelect,
  customCategories,
  defaultCategories,
  onAddPress,
  onDeletePress,
  colors,
}: CategorySelectorProps) {
  const categories = [...defaultCategories, ...customCategories];

  return (
    <View style={styles.chipsContainer}>
      {categories.map(cat => {
        const isCustom = customCategories.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.7}
            style={[
              styles.chip,
              {
                flexDirection: isCustom ? 'row' : undefined,
                alignItems: isCustom ? 'center' : undefined,
                gap: isCustom ? 6 : undefined,
                backgroundColor: category === cat ? colors.primary : colors.surfaceHighlight,
                borderColor: category === cat ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(cat)}
          >
            <Text style={[styles.chipText, { color: category === cat ? '#FFF' : colors.textMuted }]}>{cat}</Text>
            {isCustom && (
              <TouchableOpacity
                onPress={() => onDeletePress(cat)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={16} color={category === cat ? '#FFF' : colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}

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
        <Text style={[styles.chipText, { color: colors.textMuted }]}>Nova</Text>
      </TouchableOpacity>
    </View>
  );
}
