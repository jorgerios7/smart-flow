import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { themeColors } from '../../../../theme/colors';
import { globalStyles } from '../../../../styles/globalStyles';
import { styles } from './styles';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';

interface CategoryAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newName: string) => Promise<void> | void;
  isLoading?: boolean;
  title?: string;
  placeholder?: string;
}

export default function CategoryAddModal({ visible, onClose, onSubmit, isLoading = false, title, placeholder }: CategoryAddModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const [name, setName] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(name.trim());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.container, { backgroundColor: colors.background, shadowColor: colors.primary, shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }]}
        >
          <View style={[globalStyles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[globalStyles.modalTitle, { color: colors.text }]}>{title || 'Nova Categoria'}</Text>
            <TouchableOpacity onPress={onClose} style={globalStyles.modalCloseButton} disabled={isLoading}>
              <Ionicons name="close-circle" size={28} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
              <Input
                iconName="pricetag-outline"
                placeholder={placeholder || 'Nome da categoria'}
                value={name}
                onChangeText={setName}
              />

              <View style={styles.buttonContainer}>
                <Button
                  title="ADICIONAR"
                  iconName="add-outline"
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={isLoading || !name.trim()}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
