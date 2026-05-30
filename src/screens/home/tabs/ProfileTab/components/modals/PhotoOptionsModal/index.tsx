import React from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { themeColors } from '../../../../../../../theme/colors';
import { Button } from '../../../../../../../components/Button';

export interface PhotoOptionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromLibrary: () => void;
  isLoading?: boolean;
}

export default function PhotoOptionsModal({
  visible,
  onClose,
  onTakePhoto,
  onChooseFromLibrary,
  isLoading = false
}: PhotoOptionsBottomSheetProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.container, { backgroundColor: colors.background, shadowColor: colors.primary, shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }]}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Foto de Perfil</Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Tirar Foto"
                  variant="primary"
                  onPress={onTakePhoto}
                  disabled={isLoading}
                  style={{ backgroundColor: colors.primary }}
                  textStyle={{ color: colors.text }}
                />
                <Button
                  title="Escolher da Galeria"
                  variant="secondary"
                  onPress={onChooseFromLibrary}
                  disabled={isLoading}
                  style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
                  textStyle={{ color: colors.text }}
                />
                <Button
                  title="Cancelar"
                  variant="secondary"
                  onPress={onClose}
                  disabled={isLoading}
                  style={{ backgroundColor: colors.error, borderColor: 'transparent' }}
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
