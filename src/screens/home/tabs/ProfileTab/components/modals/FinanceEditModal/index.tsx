import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { themeColors } from '../../../../../../../theme/colors';
import { styles } from './styles';
import { AccountType, CardType } from '../../../../../../../types/member.types';
import { FinanceModalType } from '../../../../../../../types/components.types';
import { Button } from '../../../../../../../components/Button';
import { Input } from '../../../../../../../components/Input';

interface FinanceEditModalProps {
  visible: boolean;
  type: FinanceModalType;
  initialData?: any; // The existing account or card
  accounts?: Record<string, any>; // Used to select linked account for cards
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
}

export default function FinanceEditModal({ visible, type, initialData, accounts = {}, onClose, onSubmit, onDelete, isLoading = false }: FinanceEditModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  // Account State
  const [accName, setAccName] = useState('');
  const [accType, setAccType] = useState<AccountType>('currentAccount');

  // Card State
  const [cardName, setCardName] = useState('');
  const [cardIssuer, setCardIssuer] = useState('');
  const [cardAccountId, setCardAccountId] = useState('');
  const [cardType, setCardType] = useState<CardType>('credit_card');
  const [last4Digits, setLast4Digits] = useState('');

  useEffect(() => {
    if (visible) {
      if (type === 'editAccount' && initialData) {
        setAccName(initialData.name || '');
        setAccType(initialData.type || 'currentAccount');
      } else if (type === 'addAccount') {
        setAccName('');
        setAccType('currentAccount');
      } else if (type === 'editCard' && initialData) {
        setCardName(initialData.name || '');
        setCardIssuer(initialData.issuer || '');
        setCardAccountId(initialData.accountId || '');
        setCardType(initialData.type || 'credit_card');
        setLast4Digits(initialData.last4Digits || '');
      } else if (type === 'addCard') {
        setCardName('');
        setCardIssuer('');
        setCardAccountId(Object.keys(accounts)[0] || '');
        setCardType('credit_card');
        setLast4Digits('');
      }
    }
  }, [visible, type, initialData, accounts]);

  const handleSubmit = async () => {
    let data: any = {};
    if (type?.includes('Account')) {
      data = { name: accName, type: accType };
    } else if (type?.includes('Card')) {
      data = { name: cardName, issuer: cardIssuer, accountId: cardAccountId, type: cardType, last4Digits };
    }
    await onSubmit(data);
  };

  const getTitle = () => {
    if (type === 'addAccount') return 'Adicionar Conta';
    if (type === 'editAccount') return 'Editar Conta';
    if (type === 'addCard') return 'Adicionar Cartão';
    if (type === 'editCard') return 'Editar Cartão';
    return '';
  };

  const renderPicker = (label: string, value: string, options: { label: string, value: string }[], onSelect: (val: any) => void) => (
    <View>
      <Text style={[styles.pickerLabel, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.surfaceHighlight }]}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pickerOption, { backgroundColor: value === opt.value ? `${colors.primary}20` : 'transparent' }]}
            onPress={() => onSelect(opt.value)}
          >
            <Text style={[styles.pickerOptionText, { color: value === opt.value ? colors.primary : colors.text }]}>{opt.label}</Text>
            {value === opt.value && <Ionicons name="checkmark" size={18} color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const accountOptions = [
    { label: 'Conta Corrente', value: 'currentAccount' },
    { label: 'Conta Poupança', value: 'savingsAccount' },
    { label: 'Conta Investimento', value: 'investmentAccount' },
  ];

  const cardTypeOptions = [
    { label: 'Crédito', value: 'credit_card' },
    { label: 'Débito', value: 'debit_card' },
  ];

  const linkedAccountsOptions = Object.values(accounts).map((acc: any) => ({
    label: acc.name,
    value: acc.id
  }));

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
                  {type?.includes('Account') && (
                    <>
                      <Input iconName="business-outline" placeholder="Nome da Instituição (ex: Nubank, Itaú)" value={accName} onChangeText={setAccName} />
                      {renderPicker('Tipo de Conta', accType, accountOptions, setAccType)}
                    </>
                  )}

                  {type?.includes('Card') && (
                    <>
                      <Input iconName="card-outline" placeholder="Apelido do Cartão (ex: Cartão Preto)" value={cardName} onChangeText={setCardName} />
                      <Input iconName="briefcase-outline" placeholder="Emissor (ex: Mastercard, Visa)" value={cardIssuer} onChangeText={setCardIssuer} />
                      {renderPicker('Tipo do Cartão', cardType, cardTypeOptions, setCardType)}
                      {linkedAccountsOptions.length > 0 && renderPicker('Conta Vinculada', cardAccountId, linkedAccountsOptions, setCardAccountId)}
                      <Input iconName="barcode-outline" placeholder="Últimos 4 dígitos (ex: 1234)" value={last4Digits} onChangeText={setLast4Digits} keyboardType="numeric" maxLength={4} />
                    </>
                  )}

                  <View style={styles.buttonContainer}>
                    <Button title="SALVAR" iconName="save-outline" variant="primary" onPress={handleSubmit} disabled={isLoading} />
                    {(type === 'editAccount' || type === 'editCard') && onDelete && (
                      <Button title="EXCLUIR" iconName="trash-outline" variant="secondary" onPress={onDelete} disabled={isLoading} style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.error }} textStyle={{ color: colors.error }} />
                    )}
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
