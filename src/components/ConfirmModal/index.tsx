import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../hooks/useThemeMode';
import { themeColors } from '../../theme/colors';
import { Button } from '../Button';
import { styles } from './styles';

export interface ConfirmBottomSheetProps {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  iconName = 'alert-circle-outline',
  isDestructive = false,
  isLoading = false
}: ConfirmBottomSheetProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const actionColor = isDestructive ? colors.error : colors.primary;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.container, { backgroundColor: colors.background, shadowColor: colors.primary, shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }]}
            >
              <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: `${actionColor}15` }]}>
                  <Ionicons name={iconName} size={32} color={actionColor} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title={confirmText}
                  variant="primary"
                  onPress={onConfirm}
                  disabled={isLoading}
                  style={isDestructive ? { backgroundColor: colors.error, shadowColor: colors.error } : undefined}
                  textStyle={{ color: colors.text }}
                />
                <Button
                  title={cancelText}
                  variant="secondary"
                  onPress={onCancel}
                  disabled={isLoading}
                  style={{ backgroundColor: colors.primary }}
                  textStyle={{ color: colors.text }}
                />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
