import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatMonthYear } from '../../../../../utils/format';
import { styles } from '../styles';

interface MonthSelectorProps {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
  colors: any;
}

export function MonthSelector({ selectedDate, prevMonth, nextMonth, colors }: MonthSelectorProps) {
  return (
    <View style={[styles.monthSelector, { backgroundColor: colors.surface }]}>
      <TouchableOpacity onPress={prevMonth} style={[styles.monthSelectorButton, { backgroundColor: colors.surfaceHighlight }]}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.monthSelectorText, { color: colors.text }]}>{formatMonthYear(selectedDate)}</Text>
      <TouchableOpacity onPress={nextMonth} style={[styles.monthSelectorButton, { backgroundColor: colors.surfaceHighlight }]}>
        <Ionicons name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}
