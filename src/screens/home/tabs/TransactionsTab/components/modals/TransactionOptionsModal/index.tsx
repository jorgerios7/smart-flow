import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { themeColors } from '../../../../../../../theme/colors';
import { EnrichedInstallment } from '../../../../../../../hooks/useTransactionsList';
import { useTransactionActions } from '../../../../../../../hooks/useTransactionActions';
import { auth } from '../../../../../../../config/firebase';
import Toast from 'react-native-toast-message';
import { styles } from './styles';
import ModalHeader from '../../../../../../../components/ModalHeader';
import { ConfirmModal } from '../../../../../../../components/ConfirmModal';

interface TransactionOptionsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  installment: EnrichedInstallment | null;
  walletId: string;
  onPayInstallment: () => void;
  onViewFullTransaction: () => void;
}

export default function TransactionOptionsModal({
  isVisible,
  onClose,
  installment,
  walletId,
  onPayInstallment,
  onViewFullTransaction
}: TransactionOptionsBottomSheetProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const { deleteTransaction, deleteInstallment, repeatInstallment, isSaving } = useTransactionActions();
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [isDeleteInstallmentConfirmVisible, setIsDeleteInstallmentConfirmVisible] = useState(false);
  const [isDeleteTxConfirmVisible, setIsDeleteTxConfirmVisible] = useState(false);

  if (!installment) return null;

  const handleDeleteTransactionComplete = async () => {
    setIsDeleteTxConfirmVisible(false);
    const success = await deleteTransaction(walletId, installment.transactionId);
    if (success) {
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Transação excluída por completo!' });
      onClose();
    } else {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível excluir a transação.' });
    }
  };

  const handleDeleteCurrentInstallment = async () => {
    setIsDeleteInstallmentConfirmVisible(false);
    const success = await deleteInstallment(walletId, installment.transactionId, installment.id);
    if (success) {
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Parcela excluída com sucesso!' });
      onClose();
    } else {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível excluir a parcela.' });
    }
  };

  const handleRepeat = async (type: '1_day' | '7_days' | '1_month') => {
    const user = auth.currentUser;
    if (!user) return;

    const success = await repeatInstallment(walletId, installment.transactionId, installment, type, user.uid);
    if (success) {
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Parcela repetida com sucesso!' });
      setShowRepeatOptions(false);
      onClose();
    } else {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível repetir a parcela.' });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleClose = () => {
    setShowRepeatOptions(false);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ModalHeader title={installment.transaction.name} subtitle={`${installment.category} • ${formatCurrency(installment.amount || 0)}`} onClose={onClose} />

        {isSaving ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text, marginTop: 16 }}>Processando...</Text>
          </View>
        ) : !showRepeatOptions ? (
          <View style={styles.optionsContainer}>
            {installment.status !== 'paid' && (
              <TouchableOpacity style={[styles.optionButton, { borderBottomColor: colors.border }]} onPress={onPayInstallment}>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} style={styles.optionIcon} />
                <Text style={[styles.optionText, { color: colors.success }]}>Pagar Parcela</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.optionButton, { borderBottomColor: colors.border }]} onPress={() => setShowRepeatOptions(true)}>
              <Ionicons name="repeat-outline" size={24} color={colors.primary} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: colors.text }]}>Repetir Parcela</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.optionButton, { borderBottomColor: colors.border }]} onPress={onViewFullTransaction}>
              <Ionicons name="eye-outline" size={24} color={colors.text} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: colors.text }]}>Ver Transação Completa</Text>
            </TouchableOpacity>

            {!!(installment.transaction.purchase?.installmentNumber && installment.transaction.purchase.installmentNumber > 1) && (
              <TouchableOpacity style={[styles.optionButton, { borderBottomColor: colors.border }]} onPress={() => setIsDeleteInstallmentConfirmVisible(true)}>
                <Ionicons name="trash-outline" size={24} color="#D97706" style={styles.optionIcon} />
                <Text style={[styles.optionText, { color: '#D97706' }]}>Excluir Parcela Atual</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.optionButton} onPress={() => setIsDeleteTxConfirmVisible(true)}>
              <Ionicons name="close-circle-outline" size={24} color={colors.error} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: colors.error }]}>Excluir Transação Completa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.optionsContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 }}>
              <TouchableOpacity onPress={() => setShowRepeatOptions(false)} style={{ marginRight: 16 }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>Opções de Repetição</Text>
            </View>

            <TouchableOpacity style={[styles.optionButton, { borderBottomColor: colors.border }]} onPress={() => handleRepeat('1_day')}>
              <Ionicons name="calendar-outline" size={24} color={colors.text} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: colors.text }]}>+ 1 Dia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { borderBottomColor: colors.border }]} onPress={() => handleRepeat('7_days')}>
              <Ionicons name="calendar-outline" size={24} color={colors.text} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: colors.text }]}>+ 7 Dias</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleRepeat('1_month')}>
              <Ionicons name="calendar-outline" size={24} color={colors.text} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: colors.text }]}>+ 1 Mês</Text>
            </TouchableOpacity>
          </View>
        )}

        <ConfirmModal
          visible={isDeleteInstallmentConfirmVisible}
          title="Excluir Parcela Atual"
          description="Deseja excluir esta parcela específica? As demais parcelas desta transação serão mantidas."
          confirmText="Excluir Parcela"
          cancelText="Cancelar"
          iconName="trash-outline"
          isDestructive={true}
          onConfirm={handleDeleteCurrentInstallment}
          onCancel={() => setIsDeleteInstallmentConfirmVisible(false)}
        />

        <ConfirmModal
          visible={isDeleteTxConfirmVisible}
          title="Excluir Transação Completa"
          description="Deseja excluir esta transação completa e todas as suas parcelas associadas permanentemente?"
          confirmText="Excluir Tudo"
          cancelText="Cancelar"
          iconName="close-circle-outline"
          isDestructive={true}
          onConfirm={handleDeleteTransactionComplete}
          onCancel={() => setIsDeleteTxConfirmVisible(false)}
        />
      </View>
    </Modal>
  );
}


