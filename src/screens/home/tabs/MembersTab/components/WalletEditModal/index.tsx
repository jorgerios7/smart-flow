import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../hooks/useThemeMode';
import { themeColors } from '../../../../../../theme/colors';
import { styles } from './styles';
import { Button } from '../../../../../../components/Button';
import { Input } from '../../../../../../components/Input';

interface WalletEditModalProps {
  visible: boolean;
  initialName: string;
  onClose: () => void;
  onSubmit: (newName: string) => Promise<void>;
  isLoading?: boolean;
}

export function WalletEditModal({ visible, initialName, onClose, onSubmit, isLoading = false }: WalletEditModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (visible) {
      setName(initialName);
    }
  }, [visible, initialName]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(name.trim());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={[styles.container, { backgroundColor: colors.background, shadowColor: colors.primary, shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }]}
            >
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Editar Carteira</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isLoading}>
                  <Ionicons name="close-circle" size={28} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                  <Input
                    iconName="wallet-outline"
                    placeholder="Nome da carteira"
                    value={name}
                    onChangeText={setName}
                  />

                  <View style={styles.buttonContainer}>
                    <Button
                      title="SALVAR ALTERAÇÕES"
                      iconName="save-outline"
                      variant="primary"
                      onPress={handleSubmit}
                      disabled={isLoading || !name.trim()}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
