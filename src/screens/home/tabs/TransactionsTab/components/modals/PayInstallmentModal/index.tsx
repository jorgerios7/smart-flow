import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform, KeyboardAvoidingView, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { themeColors } from '../../../../../../../theme/colors';
import { globalStyles } from '../../../../../../../styles/globalStyles';
import { styles } from './styles';
import { useMemberData } from '../../../../../../../hooks/useMemberData';
import { useTransactionActions } from '../../../../../../../hooks/useTransactionActions';
import { PaymentMethod, TransactionPayment } from '../../../../../../../types/wallet.types';
import { auth } from '../../../../../../../config/firebase';
import { ToastService } from '../../../../../../../utils/toast';
import ModalHeader from '../../../../../../../components/ModalHeader';
import { LoadingOverlay } from '../../../../../../../components/LoadingOverlay';
import { EnrichedInstallment } from '../../../../../../../hooks/useTransactionsList';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PAYMENT_INSTRUMENTS: { id: PaymentMethod, label: string, icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'credit_card', label: 'Crédito', icon: 'card-outline' },
  { id: 'debit_card', label: 'Débito', icon: 'card' },
  { id: 'pix', label: 'Pix', icon: 'qr-code-outline' },
  { id: 'bank_transfer', label: 'Transf. Bancária', icon: 'swap-horizontal-outline' },
  { id: 'cash', label: 'Dinheiro', icon: 'cash-outline' },
];

interface PayInstallmentModalProps {
  isVisible: boolean;
  onClose: () => void;
  installment: EnrichedInstallment | null;
  walletId: string;
}

export default function PayInstallmentModal({ isVisible, onClose, installment, walletId }: PayInstallmentModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const user = auth.currentUser;
  const { fetchMemberData } = useMemberData();
  const { payInstallment, isSaving } = useTransactionActions();

  // Form states
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [availableCards, setAvailableCards] = useState<{ id: string, name: string, last4Digits: string, issuer: string, type: string }[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<{ id: string, name: string, type: string }[]>([]);
  
  const [paidAtStr, setPaidAtStr] = useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  });
  
  const [payerName, setPayerName] = useState<string>('');

  useEffect(() => {
    if (isVisible) {
      loadData();
    } else {
      resetFields();
    }
  }, [isVisible, installment]);

  const loadData = async () => {
    if (!user?.uid) return;
    
    // Set default payer name
    const memberData = await fetchMemberData(user.uid);
    if (memberData?.profile?.name) {
      setPayerName(memberData.profile.name);
    } else if (user.displayName) {
      setPayerName(user.displayName);
    } else {
      setPayerName('Usuário');
    }

    // Set default payment method if available from installment's transaction
    if (installment?.transaction?.purchase?.instrument) {
      setMethod(installment.transaction.purchase.instrument);
    }

    if (memberData?.finance?.accounts) {
      const accounts: any[] = [];
      const cards: any[] = [];
      Object.entries(memberData.finance.accounts).forEach(([accId, account]: [string, any]) => {
        accounts.push({ id: accId, name: account.name, type: account.type });
        if (account.cards) {
          Object.entries(account.cards).forEach(([cardId, card]: [string, any]) => {
            cards.push({ id: cardId, ...card });
          });
        }
      });
      setAvailableAccounts(accounts);
      setAvailableCards(cards);

      // Pre-select account/card from transaction purchase if they exist
      if (installment?.transaction?.purchase?.accountId) {
        setSelectedAccountId(installment.transaction.purchase.accountId);
      }
      if (installment?.transaction?.purchase?.cardId) {
        setSelectedCardId(installment.transaction.purchase.cardId);
      }
    }
  };

  const resetFields = () => {
    setMethod(null);
    setSelectedCardId(null);
    setSelectedAccountId(null);
    const today = new Date();
    setPaidAtStr(`${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`);
    setPayerName('');
  };

  const handleAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    setPaidAtStr(formatted);

    if (formatted.length === 10) {
      handleAnimation();
    }
  };

  const handleSave = async () => {
    if (!installment || !method || !payerName.trim() || paidAtStr.length !== 10) {
      ToastService.showError('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const [day, month, year] = paidAtStr.split('/');
    const parsedPaidAt = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    const selectedCardName = selectedCardId ? availableCards.find(c => c.id === selectedCardId)?.name : undefined;

    const paymentData: TransactionPayment = {
      method,
      accountId: selectedAccountId || undefined,
      cardId: selectedCardId || undefined,
      cardName: selectedCardName || undefined,
      paidAt: parsedPaidAt,
      payerId: user?.uid || '',
      payerName: payerName,
    };

    const success = await payInstallment(
      walletId,
      installment.transactionId,
      installment.id,
      paymentData
    );

    if (success) {
      ToastService.showSuccess('Sucesso', 'Parcela paga com sucesso!');
      onClose();
    } else {
      ToastService.showError('Erro', 'Não foi possível registrar o pagamento.');
    }
  };

  if (!installment) return null;

  const isCardInstrument = method === 'credit_card' || method === 'debit_card';
  const isAccountInstrument = method === 'pix' || method === 'bank_transfer' || method === 'debit_card';

  const canShowCardSelection = method !== null && isCardInstrument;
  const canShowAccountSelection = method !== null && isAccountInstrument;

  const filteredCards = availableCards.filter(c => c.type === method || !c.type);
  const isCardValid = !isCardInstrument || (isCardInstrument && selectedCardId !== null) || filteredCards.length === 0;
  const isAccountValid = !isAccountInstrument || (isAccountInstrument && selectedAccountId !== null) || availableAccounts.length === 0;

  const canShowDate = method !== null && isCardValid && isAccountValid;
  const canShowPayer = canShowDate && paidAtStr.length === 10;
  const canSave = canShowPayer && payerName.trim() !== '';

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[globalStyles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ModalHeader
          title="Pagar Parcela"
          subtitle={`Registrar pagamento para ${installment.transaction.name}`}
          onClose={onClose}
        />

        {isSaving ? (
          <LoadingOverlay />
        ) : (
          <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.timelineContainer}>
              <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

              <View style={styles.stepsContainer}>
                
                {/* STEP 1: METHOD */}
                <View style={styles.stepWrapper}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepDot, { backgroundColor: method !== null ? colors.success : colors.border }]}>
                      {method !== null ? (
                        <Ionicons name="checkmark" size={14} color="#FFF" />
                      ) : (
                        <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold' }}>1</Text>
                      )}
                    </View>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>Método de Pagamento</Text>
                  </View>

                  <View style={styles.chipsContainer}>
                    {PAYMENT_INSTRUMENTS.map(inst => (
                      <TouchableOpacity
                        key={inst.id}
                        activeOpacity={0.7}
                        style={[
                          styles.chip,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: method === inst.id ? colors.primary : colors.surfaceHighlight,
                            borderColor: method === inst.id ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => {
                          setMethod(inst.id);
                          handleAnimation();
                        }}
                      >
                        <Ionicons name={inst.icon} size={16} color={method === inst.id ? '#FFF' : colors.textMuted} />
                        <Text style={[styles.chipText, { color: method === inst.id ? '#FFF' : colors.textMuted }]}>
                          {inst.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* STEP 2: CARD SELECTION */}
                {canShowCardSelection && (
                  <View style={styles.stepWrapper}>
                    <View style={styles.stepHeader}>
                      <View style={[styles.stepDot, { backgroundColor: selectedCardId !== null ? colors.success : colors.border }]}>
                        {selectedCardId !== null ? (
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        ) : (
                          <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold' }}>2</Text>
                        )}
                      </View>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>Cartão Bancário</Text>
                    </View>

                    {filteredCards.length === 0 ? (
                      <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                        Nenhum cartão cadastrado.
                      </Text>
                    ) : (
                      <View style={styles.chipsContainer}>
                        {filteredCards.map(card => (
                          <TouchableOpacity
                            key={card.id}
                            activeOpacity={0.7}
                            style={[
                              styles.chip,
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                backgroundColor: selectedCardId === card.id ? colors.primary : colors.surfaceHighlight,
                                borderColor: selectedCardId === card.id ? colors.primary : colors.border,
                              },
                            ]}
                            onPress={() => {
                              setSelectedCardId(card.id);
                              handleAnimation();
                            }}
                          >
                            <Ionicons name="card" size={16} color={selectedCardId === card.id ? '#FFF' : colors.textMuted} />
                            <Text style={[styles.chipText, { color: selectedCardId === card.id ? '#FFF' : colors.textMuted }]}>
                              {card.name} (final {card.last4Digits})
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* STEP 3: ACCOUNT SELECTION */}
                {canShowAccountSelection && (
                  <View style={styles.stepWrapper}>
                    <View style={styles.stepHeader}>
                      <View style={[styles.stepDot, { backgroundColor: selectedAccountId !== null ? colors.success : colors.border }]}>
                        {selectedAccountId !== null ? (
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        ) : (
                          <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold' }}>3</Text>
                        )}
                      </View>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>Conta Bancária</Text>
                    </View>

                    {availableAccounts.length === 0 ? (
                      <Text style={{ color: colors.textMuted, fontSize: 14 }}>
                        Nenhuma conta bancária cadastrada.
                      </Text>
                    ) : (
                      <View style={styles.chipsContainer}>
                        {availableAccounts.map(account => (
                          <TouchableOpacity
                            key={account.id}
                            activeOpacity={0.7}
                            style={[
                              styles.chip,
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                backgroundColor: selectedAccountId === account.id ? colors.primary : colors.surfaceHighlight,
                                borderColor: selectedAccountId === account.id ? colors.primary : colors.border,
                              },
                            ]}
                            onPress={() => {
                              setSelectedAccountId(account.id);
                              handleAnimation();
                            }}
                          >
                            <Ionicons name="business" size={16} color={selectedAccountId === account.id ? '#FFF' : colors.textMuted} />
                            <Text style={[styles.chipText, { color: selectedAccountId === account.id ? '#FFF' : colors.textMuted }]}>
                              {account.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* STEP 4: DATE OF PAYMENT */}
                {canShowDate && (
                  <View style={styles.stepWrapper}>
                    <View style={styles.stepHeader}>
                      <View style={[styles.stepDot, { backgroundColor: paidAtStr.length === 10 ? colors.success : colors.border }]}>
                        {paidAtStr.length === 10 ? (
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        ) : (
                          <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold' }}>4</Text>
                        )}
                      </View>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>Data do Pagamento</Text>
                    </View>

                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceHighlight }]}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      value={paidAtStr}
                      onChangeText={handleDateChange}
                      maxLength={10}
                    />
                  </View>
                )}

                {/* STEP 5: PAYER NAME */}
                {canShowPayer && (
                  <View style={styles.stepWrapper}>
                    <View style={styles.stepHeader}>
                      <View style={[styles.stepDot, { backgroundColor: payerName.trim() !== '' ? colors.success : colors.border }]}>
                        {payerName.trim() !== '' ? (
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        ) : (
                          <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold' }}>5</Text>
                        )}
                      </View>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>Nome do Pagador</Text>
                    </View>

                    <TextInput
                      style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceHighlight }]}
                      placeholder="Nome de quem pagou"
                      placeholderTextColor={colors.textMuted}
                      value={payerName}
                      onChangeText={(text) => {
                        setPayerName(text);
                        handleAnimation();
                      }}
                    />
                  </View>
                )}

              </View>
            </View>

            {canSave && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Confirmar Pagamento</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}
