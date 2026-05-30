import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { styles } from './styles';
import { EditModalType } from '../../../../../../../types/components.types';
import { themeColors } from '../../../../../../../theme/colors';
import { Button } from '../../../../../../../components/Button';
import { Input } from '../../../../../../../components/Input';

interface ProfileEditModalProps {
  visible: boolean;
  type: EditModalType;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileEditModal({ visible, type, onClose, onSubmit, isLoading = false }: ProfileEditModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Reset form when modal closes or opens
  React.useEffect(() => {
    if (visible) {
      setName('');
      setEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    let data: any = {};
    if (type === 'name') data = { name };
    else if (type === 'email') data = { email, currentPassword };
    else if (type === 'password') data = { currentPassword, newPassword, confirmPassword };

    await onSubmit(data);
  };

  const getTitle = () => {
    switch (type) {
      case 'name': return 'Alterar Nome';
      case 'email': return 'Alterar Email';
      case 'password': return 'Alterar Senha';
      default: return '';
    }
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
                <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isLoading}>
                  <Ionicons name="close-circle" size={28} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                  {type === 'name' && (
                    <Input
                      iconName="person-outline"
                      placeholder="Novo nome de usuário"
                      value={name}
                      onChangeText={setName}
                    />
                  )}

                  {type === 'email' && (
                    <>
                      <Input
                        iconName="mail-outline"
                        placeholder="Novo e-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                      <Input
                        iconName="lock-closed-outline"
                        placeholder="Senha atual"
                        isPassword={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                      />
                    </>
                  )}

                  {type === 'password' && (
                    <>
                      <Input
                        iconName="lock-closed-outline"
                        placeholder="Senha atual"
                        isPassword={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                      />
                      <Input
                        iconName="key-outline"
                        placeholder="Nova senha"
                        isPassword={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                      />
                      <Input
                        iconName="shield-checkmark-outline"
                        placeholder="Confirmar nova senha"
                        isPassword={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                      />
                    </>
                  )}

                  <View style={styles.buttonContainer}>
                    <Button
                      title="SALVAR ALTERAÇÕES"
                      iconName="save-outline"
                      variant="primary"
                      onPress={handleSubmit}
                      disabled={isLoading}
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
