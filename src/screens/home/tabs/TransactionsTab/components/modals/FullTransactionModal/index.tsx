import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { themeColors } from '../../../../../../../theme/colors';
import { globalStyles } from '../../../../../../../styles/globalStyles';
import { styles } from './styles';
import { useTransactionActions } from '../../../../../../../hooks/useTransactionActions';
import { Transaction, TransactionInstallment } from '../../../../../../../types/wallet.types';
import { ToastService } from '../../../../../../../utils/toast';
import ModalHeader from '../../../../../../../components/ModalHeader';
import { ConfirmModal } from '../../../../../../../components/ConfirmModal';
import { auth } from '../../../../../../../config/firebase';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FullTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  transactionId: string;
  walletId: string;
}

export default function FullTransactionModal({ isVisible, onClose, transactionId, walletId }: FullTransactionModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const {
    getTransaction,
    getTransactionInstallments,
    updateTransaction,
    updateInstallment,
    createInstallment,
    deleteTransaction,
    deleteInstallment,
    isSaving
  } = useTransactionActions();

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [installments, setInstallments] = useState<TransactionInstallment[]>([]);
  
  // Edit states
  const [description, setDescription] = useState('');
  const [editedInstallments, setEditedInstallments] = useState<Record<string, { amountStr: string, dueDateStr: string }>>({});

  // Deletion confirmations
  const [isDeleteTxConfirmVisible, setIsDeleteTxConfirmVisible] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState<TransactionInstallment | null>(null);

  useEffect(() => {
    if (isVisible && transactionId) {
      loadData();
    }
  }, [isVisible, transactionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const tx = await getTransaction(walletId, transactionId);
      const insts = await getTransactionInstallments(walletId, transactionId);

      if (tx) {
        setTransaction(tx);
        setDescription(tx.description || '');

        // Sort installments by index ascending
        const sortedInsts = [...insts].sort((a, b) => a.installmentIndex - b.installmentIndex);
        setInstallments(sortedInsts);

        // Map inputs
        const initialEdits: Record<string, { amountStr: string, dueDateStr: string }> = {};
        sortedInsts.forEach(inst => {
          initialEdits[inst.id] = {
            amountStr: inst.amount.toFixed(2).replace('.', ','),
            dueDateStr: formatDate(inst.dueDate),
          };
        });
        setEditedInstallments(initialEdits);
      } else {
        ToastService.showError('Erro', 'Transação não encontrada.');
        onClose();
      }
    } catch (error) {
      console.error('Error loading transaction details:', error);
      ToastService.showError('Erro', 'Não foi possível carregar as informações.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstallmentLocally = () => {
    if (!transaction) return;

    // 1. Calculate next index
    const nextIndex = installments.length > 0
      ? Math.max(...installments.map(i => i.installmentIndex)) + 1
      : 1;

    // 2. Suggest new date (1 month after the latest due date, or today)
    let newDate = new Date();
    if (installments.length > 0) {
      const dates = installments.map(i => {
        const d = i.dueDate;
        return d instanceof Date ? d.getTime() : (d as any).toDate ? (d as any).toDate().getTime() : new Date(d).getTime();
      });
      const latestTime = Math.max(...dates);
      newDate = new Date(latestTime);
      newDate.setMonth(newDate.getMonth() + 1);
    }

    // 3. Suggest amount based on the last installment
    let suggestedAmount = 0;
    if (installments.length > 0) {
      const latestInst = installments.reduce((latest, current) => 
        current.installmentIndex > latest.installmentIndex ? current : latest
      , installments[0]);
      suggestedAmount = latestInst.amount;
    } else if (transaction.purchase?.amount) {
      suggestedAmount = transaction.purchase.amount;
    }

    const tempId = `temp_${Date.now()}`;
    const newInst: any = {
      id: tempId,
      transactionId: transactionId,
      installmentIndex: nextIndex,
      amount: suggestedAmount,
      dueDate: newDate,
      status: 'pending',
      type: transaction.type,
      category: transaction.category,
      name: transaction.name,
      createdAt: new Date(),
      createdBy: auth.currentUser?.uid || '',
    };

    handleAnimation();
    setInstallments(prev => [...prev, newInst]);
    setEditedInstallments(prev => ({
      ...prev,
      [tempId]: {
        amountStr: suggestedAmount.toFixed(2).replace('.', ','),
        dueDateStr: formatDate(newDate),
      }
    }));
  };

  const formatDate = (date: Date | any): string => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const handleAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleInstallmentAmountChange = (id: string, text: string) => {
    const cleaned = text.replace(/[^0-9,.]/g, '');
    setEditedInstallments(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        amountStr: cleaned,
      }
    }));
  };

  const handleInstallmentDateChange = (id: string, text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }

    setEditedInstallments(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        dueDateStr: formatted,
      }
    }));
  };

  const parseDateStr = (str: string): Date | null => {
    const parts = str.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  };

  const parseAmountStr = (str: string): number => {
    const cleaned = str.trim();
    if (!cleaned) return 0;
    if (cleaned.includes(',')) {
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    }
    return parseFloat(cleaned);
  };

  const handleSave = async () => {
    if (!transaction) return;

    // Validate installments input
    const updates: { id: string, amount: number, dueDate: Date }[] = [];
    const newInstallmentsToCreate: { amount: number, dueDate: Date, installmentIndex: number }[] = [];

    for (const inst of installments) {
      const edit = editedInstallments[inst.id];
      if (!edit) continue;

      const parsedAmount = parseAmountStr(edit.amountStr);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        ToastService.showError('Erro', `Valor inválido na Parcela ${inst.installmentIndex}.`);
        return;
      }

      const parsedDate = parseDateStr(edit.dueDateStr);
      if (!parsedDate) {
        ToastService.showError('Erro', `Data de vencimento inválida na Parcela ${inst.installmentIndex}.`);
        return;
      }

      if (inst.id.startsWith('temp_')) {
        newInstallmentsToCreate.push({
          amount: parsedAmount,
          dueDate: parsedDate,
          installmentIndex: inst.installmentIndex
        });
      } else {
        // Check if actually modified
        const originalDateStr = formatDate(inst.dueDate);
        const originalAmountStr = inst.amount.toFixed(2).replace('.', ',');
        
        if (originalAmountStr !== edit.amountStr || originalDateStr !== edit.dueDateStr) {
          updates.push({
            id: inst.id,
            amount: parsedAmount,
            dueDate: parsedDate,
          });
        }
      }
    }

    // Save transaction description if updated, or purchase installmentNumber
    let txSuccess = true;
    const isDescriptionUpdated = description !== (transaction.description || '');
    const isInstallmentCountUpdated = installments.length !== (transaction.purchase?.installmentNumber || 0);

    if (isDescriptionUpdated || isInstallmentCountUpdated) {
      const txData: any = {};
      if (isDescriptionUpdated) txData.description = description;
      if (isInstallmentCountUpdated && transaction.purchase) {
        txData.purchase = {
          ...transaction.purchase,
          installmentNumber: installments.length
        };
      }
      txSuccess = await updateTransaction(walletId, transactionId, txData);
    }

    // Save installment updates
    let instSuccess = true;
    for (const update of updates) {
      const res = await updateInstallment(walletId, transactionId, update.id, {
        amount: update.amount,
        dueDate: update.dueDate,
      });
      if (!res) instSuccess = false;
    }

    // Create new installments
    for (const newInst of newInstallmentsToCreate) {
      const res = await createInstallment(walletId, transactionId, {
        type: transaction.type,
        category: transaction.category,
        name: transaction.name,
        transactionId: transactionId,
        amount: newInst.amount,
        status: 'pending',
        installmentIndex: newInst.installmentIndex,
        dueDate: newInst.dueDate,
        createdBy: auth.currentUser?.uid || ''
      });
      if (!res) instSuccess = false;
    }

    if (txSuccess && instSuccess) {
      ToastService.showSuccess('Sucesso', 'Alterações salvas com sucesso!');
      onClose();
    } else {
      ToastService.showError('Erro', 'Ocorreu um erro ao salvar algumas alterações.');
    }
  };

  const handleDeleteFullTransaction = async () => {
    setIsDeleteTxConfirmVisible(false);
    const success = await deleteTransaction(walletId, transactionId);
    if (success) {
      ToastService.showSuccess('Sucesso', 'Transação excluída por completo!');
      onClose();
    } else {
      ToastService.showError('Erro', 'Não foi possível excluir a transação.');
    }
  };

  const handleDeleteSingleInstallment = async () => {
    if (!installmentToDelete) return;
    const instId = installmentToDelete.id;
    setInstallmentToDelete(null);

    if (instId.startsWith('temp_')) {
      // Local only deletion
      handleAnimation();
      setInstallments(prev => prev.filter(i => i.id !== instId));
      setEditedInstallments(prev => {
        const copy = { ...prev };
        delete copy[instId];
        return copy;
      });
      ToastService.showSuccess('Sucesso', 'Parcela removida!');
      return;
    }

    const success = await deleteInstallment(walletId, transactionId, instId);
    if (success) {
      ToastService.showSuccess('Sucesso', 'Parcela excluída com sucesso!');
      // Update local state list
      handleAnimation();
      const updatedInsts = installments.filter(i => i.id !== instId);
      setInstallments(updatedInsts);

      // Also update the transaction's installmentNumber metadata
      if (transaction && transaction.purchase) {
        await updateTransaction(walletId, transactionId, {
          purchase: {
            ...transaction.purchase,
            installmentNumber: updatedInsts.length
          }
        });
      }
    } else {
      ToastService.showError('Erro', 'Não foi possível excluir a parcela.');
    }
  };

  const formatCurrencyValue = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[globalStyles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ModalHeader
          title="Transação Completa"
          subtitle="Verifique, edite ou exclua os detalhes"
          onClose={onClose}
        />

        {loading ? (
          <View style={globalStyles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : transaction ? (
          <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
            
            {/* CARD 1: TRANSACTION METADATA (READ ONLY) */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações da Transação</Text>
              
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Nome</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{transaction.name}</Text>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Tipo</Text>
                <View style={[styles.badge, { backgroundColor: transaction.type === 'expense' ? `${colors.error}15` : `${colors.success}15` }]}>
                  <Text style={[styles.badgeText, { color: transaction.type === 'expense' ? colors.error : colors.success }]}>
                    {transaction.type === 'expense' ? 'Despesa' : 'Receita'}
                  </Text>
                </View>
              </View>

              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Categoria</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{transaction.category}</Text>
              </View>

              {/* DESCRIPTION INPUT (EDITABLE) */}
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Descrição</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceHighlight }]}
                placeholder="Nenhuma descrição inserida"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* CARD 2: INSTALLMENTS LIST */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                Parcelas ({installments.length})
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: `${colors.primary}15`,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
                onPress={handleAddInstallmentLocally}
              >
                <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: 'bold' }}>Adicionar Parcela</Text>
              </TouchableOpacity>
            </View>

            {installments.length === 0 ? (
              <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', marginVertical: 20 }}>
                Nenhuma parcela associada a esta transação.
              </Text>
            ) : (
              installments.map((inst) => {
                const edit = editedInstallments[inst.id] || { amountStr: '', dueDateStr: '' };
                return (
                  <View
                    key={inst.id}
                    style={[styles.installmentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <View style={styles.installmentHeader}>
                      <Text style={[styles.installmentTitle, { color: colors.text }]}>
                        Parcela #{inst.installmentIndex}
                      </Text>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        {/* Status Badge - READ ONLY */}
                        <View style={[styles.badge, { backgroundColor: inst.status === 'paid' ? `${colors.success}15` : '#D9770615' }]}>
                          <Text style={[styles.badgeText, { color: inst.status === 'paid' ? colors.success : '#D97706' }]}>
                            {inst.status === 'paid' ? 'Pago' : 'Pendente'}
                          </Text>
                        </View>

                        {/* Delete single installment button */}
                        {installments.length > 1 && (
                          <TouchableOpacity
                            style={[styles.deleteInstallmentBtn, { backgroundColor: `${colors.error}10` }]}
                            onPress={() => setInstallmentToDelete(inst)}
                          >
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <View style={styles.inputsRow}>
                      {/* Amount Edit */}
                      <View style={styles.inputCol}>
                        <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 0 }]}>Valor (R$)</Text>
                        <TextInput
                          style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceHighlight }]}
                          keyboardType="numeric"
                          value={edit.amountStr}
                          onChangeText={(t) => handleInstallmentAmountChange(inst.id, t)}
                        />
                      </View>

                      {/* DueDate Edit */}
                      <View style={styles.inputCol}>
                        <Text style={[styles.inputLabel, { color: colors.textMuted, marginTop: 0 }]}>Vencimento</Text>
                        <TextInput
                          style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceHighlight }]}
                          placeholder="DD/MM/AAAA"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="numeric"
                          value={edit.dueDateStr}
                          onChangeText={(t) => handleInstallmentDateChange(inst.id, t)}
                          maxLength={10}
                        />
                      </View>
                    </View>
                  </View>
                );
              })
            )}

            {/* ACTION BUTTONS */}
            <View style={styles.footerButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.deleteButton, { borderColor: colors.error }]}
                onPress={() => setIsDeleteTxConfirmVisible(true)}
                disabled={isSaving}
              >
                <Text style={[styles.deleteButtonText, { color: colors.error }]}>Excluir Transação Completa</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        ) : null}

        {/* CONFIRMATION MODALS */}
        <ConfirmModal
          visible={isDeleteTxConfirmVisible}
          title="Excluir Transação Completa"
          description="Tem certeza que deseja excluir esta transação por completo? Isso apagará permanentemente todas as suas parcelas."
          confirmText="Sim, excluir tudo"
          cancelText="Cancelar"
          iconName="trash-outline"
          isDestructive={true}
          onConfirm={handleDeleteFullTransaction}
          onCancel={() => setIsDeleteTxConfirmVisible(false)}
        />

        <ConfirmModal
          visible={installmentToDelete !== null}
          title={`Excluir Parcela #${installmentToDelete?.installmentIndex}`}
          description="Deseja excluir esta parcela específica? Esta ação não afetará as outras parcelas desta transação."
          confirmText="Excluir Parcela"
          cancelText="Cancelar"
          iconName="trash-outline"
          isDestructive={true}
          onConfirm={handleDeleteSingleInstallment}
          onCancel={() => setInstallmentToDelete(null)}
        />

      </KeyboardAvoidingView>
    </Modal>
  );
}
