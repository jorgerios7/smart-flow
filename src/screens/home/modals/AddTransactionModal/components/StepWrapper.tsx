import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface StepWrapperProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  colors: any;
  children: React.ReactNode;
}

export function StepWrapper({ title, isActive, isCompleted, colors, children }: StepWrapperProps) {
  return (
    <View style={styles.stepWrapper}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepDot, { backgroundColor: isCompleted ? colors.primary : (isActive ? colors.surfaceHighlight : colors.border) }]}>
          {isCompleted ? (
            <Ionicons name="checkmark" size={14} color="#FFF" />
          ) : (
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isActive ? colors.primary : colors.textMuted }} />
          )}
        </View>
        <Text style={[styles.stepTitle, { color: isCompleted || isActive ? colors.primary : colors.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}
