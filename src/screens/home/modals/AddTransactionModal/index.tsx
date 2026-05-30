import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform, KeyboardAvoidingView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { themeColors } from '../../../../theme/colors';
import { globalStyles } from '../../../../styles/globalStyles';
import { styles } from './styles';
import CategoryAddModal from '../CategoryAddModal';
import { useSettings } from '../../../../hooks/useSettings';
import { useMemberData } from '../../../../hooks/useMemberData';
import { useTransactionActions } from '../../../../hooks/useTransactionActions';
import { TransactionType, PaymentMethod, TransactionStatus } from '../../../../types/wallet.types';
import { auth } from '../../../../config/firebase';
import { ToastService } from '../../../../utils/toast';

// Step components
import { StepWrapper } from './components/StepWrapper';
import { TypeSelector } from './components/TypeSelector';
import { CategorySelector } from './components/CategorySelector';
import { NameSelector } from './components/NameSelector';
import { InstrumentSelector } from './components/InstrumentSelector';
import { CardSelector } from './components/CardSelector';
import { AccountSelector } from './components/AccountSelector';
import { AmountInput } from './components/AmountInput';
import { InstallmentSelector } from './components/InstallmentSelector';
import { DateInput } from './components/DateInput';
import { StatusSelector } from './components/StatusSelector';
import { DescriptionInput } from './components/DescriptionInput';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingOverlay } from '../../../../components/LoadingOverlay';
import ModalHeader from '../../../../components/ModalHeader';

// Habilitar LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EXPENSE_CATEGORIES = ['Transporte', 'Alimentação', 'Saúde', 'Educação', 'Lazer', 'Moradia', 'Outros'];
const INCOME_CATEGORIES = ['Renda', 'Renda Extra', 'Investimentos', 'Outros'];

const NAME_SUGGESTIONS: Record<string, Record<string, string[]>> = {
  expense: {
    'Transporte': ['Uber', 'Gasolina', 'Passagem', 'Estacionamento', 'Ônibus'],
    'Alimentação': ['Restaurante', 'Lanchonete', 'iFood', 'Café', 'Padaria', 'Supermercado'],
    'Saúde': ['Farmácia', 'Consulta médica', 'Exames', 'Plano de saúde'],
    'Educação': ['Mensalidade', 'Material escolar', 'Cursos', 'Livros'],
    'Lazer': ['Cinema', 'Shows', 'Assinaturas', 'Viagem', 'Jogos'],
    'Moradia': ['Aluguel', 'Condomínio', 'Luz', 'Água', 'Internet', 'Gás'],
    'Outros': ['Presente', 'Doação', 'Imposto', 'Diversos'],
  },
  income: {
    'Renda': ['Salário', 'Adiantamento', 'Bônus', 'Hora extra', '13º Salário'],
    'Renda Extra': ['Freelance', 'Consultoria', 'Venda', 'Projeto'],
    'Investimentos': ['Dividendos', 'Rendimento', 'Juros', 'Tesouro Direto'],
    'Outros': ['Presente', 'Venda de item', 'Reembolso', 'Diversos'],
  }
};

const EXPENSE_INSTRUMENTS: { id: PaymentMethod, label: string, icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'credit_card', label: 'Crédito', icon: 'card-outline' },
  { id: 'debit_card', label: 'Débito', icon: 'card' },
  { id: 'pix', label: 'Pix', icon: 'qr-code-outline' },
  { id: 'bank_transfer', label: 'Transf. Bancária', icon: 'swap-horizontal-outline' },
  { id: 'cash', label: 'Dinheiro', icon: 'cash-outline' },
];
const INCOME_INSTRUMENTS: { id: PaymentMethod, label: string, icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'pix', label: 'Pix', icon: 'qr-code-outline' },
  { id: 'bank_transfer', label: 'Transf. Bancária', icon: 'swap-horizontal-outline' },
  { id: 'cash', label: 'Dinheiro', icon: 'cash-outline' }
];

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ visible, onClose }: AddTransactionModalProps) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const user = auth.currentUser;
  const { fetchMemberData } = useMemberData();
  const { createTransaction, isSaving } = useTransactionActions();

  // Estados do formulário
  const [type, setType] = useState<TransactionType | null>(null);
  const [category, setCategory] = useState<string>('');
  const [transactionName, setTransactionName] = useState<string>('');
  const [instrument, setInstrument] = useState<PaymentMethod | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [availableCards, setAvailableCards] = useState<{ id: string, name: string, last4Digits: string, issuer: string, type: string }[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<{ id: string, name: string, type: string }[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [installmentNumber, setInstallmentNumber] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [dueDateStr, setDueDateStr] = useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [paidAtStr, setPaidAtStr] = useState<string>(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [status, setStatus] = useState<TransactionStatus>('pending');

  const { settings, addCustomCategory, removeCustomCategory, addCustomTransactionName, removeCustomTransactionName } = useSettings();
  const customExpenseCategories = settings.customExpenseCategories || [];
  const customIncomeCategories = settings.customIncomeCategories || [];
  const customExpenseNames = settings.customExpenseNames || {};
  const customIncomeNames = settings.customIncomeNames || {};

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<{ visible: boolean, category: string }>({ visible: false, category: '' });
  const [deleteNameConfirm, setDeleteNameConfirm] = useState<{ visible: boolean, name: string }>({ visible: false, name: '' });

  const handleAddCategory = async (newCategory: string) => {
    if (!type) return;

    if (type === 'expense' && !EXPENSE_CATEGORIES.includes(newCategory)) {
      await addCustomCategory('expense', newCategory);
    } else if (type === 'income' && !INCOME_CATEGORIES.includes(newCategory)) {
      await addCustomCategory('income', newCategory);
    }

    onSelectCategory(newCategory);
    setIsCategoryModalVisible(false);
  };

  const handleDeleteCategory = async () => {
    if (!type || !deleteCategoryConfirm.category) return;
    await removeCustomCategory(type, deleteCategoryConfirm.category);
    if (category === deleteCategoryConfirm.category) {
      setCategory('');
    }
    setDeleteCategoryConfirm({ visible: false, category: '' });
  };

  const handleDeleteName = async () => {
    if (!type || !category || !deleteNameConfirm.name) return;
    await removeCustomTransactionName(type, category, deleteNameConfirm.name);
    if (transactionName === deleteNameConfirm.name) {
      setTransactionName('');
    }
    setDeleteNameConfirm({ visible: false, name: '' });
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    const amountFloat = (parseInt(numericValue, 10) / 100).toFixed(2);
    return amountFloat
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
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
    setDateStr(formatted);

    if (formatted.length === 10) {
      handleAnimation();
    }
  };

  const handlePaidAtChange = (text: string) => {
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

  const handleDueDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);

    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}/${cleaned.substring(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2)}`;
    }
    setDueDateStr(formatted);

    if (formatted.length === 10) {
      handleAnimation();
    }
  };

  const handleAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const onSelectType = (val: TransactionType) => {
    handleAnimation();
    setType(val);
    setCategory(''); // Reseta a categoria ao mudar o tipo de transação
    setTransactionName(''); // Reseta o nome
  };

  const onSelectCategory = (val: string) => {
    handleAnimation();
    setCategory(val);
    setTransactionName(''); // Reseta o nome ao mudar a categoria
  };

  const onSelectName = (val: string) => {
    handleAnimation();
    setTransactionName(val);
  };

  const onSelectInstrument = (val: PaymentMethod) => {
    handleAnimation();
    setInstrument(val);
    if (val !== 'credit_card') {
      setInstallmentNumber(1); // Resetar parcelas se não for crédito
    }
  };

  const canShowCategory = type !== null;
  const canShowName = canShowCategory && category.trim() !== '';
  const canShowInstrument = canShowName && transactionName.trim() !== '';
  const isCardInstrument = instrument === 'credit_card' || instrument === 'debit_card';
  const isAccountInstrument = instrument === 'pix' || instrument === 'bank_transfer';

  const defaultNameSuggestions = (type && category && NAME_SUGGESTIONS[type]?.[category]) || [];
  const customNameSuggestions = type === 'expense' ? (customExpenseNames[category] || []) : (customIncomeNames[category] || []);
  const nameSuggestions = [...new Set([...defaultNameSuggestions, ...customNameSuggestions])];

  const canShowCardSelection = canShowInstrument && instrument !== null && isCardInstrument;
  const canShowAccountSelection = canShowInstrument && instrument !== null && isAccountInstrument;

  const filteredCards = availableCards.filter(c => c.type === instrument || !c.type);
  const isCardValid = !isCardInstrument || (isCardInstrument && selectedCardId !== null) || filteredCards.length === 0;

  const isAccountValid = !isAccountInstrument || (isAccountInstrument && selectedAccountId !== null) || availableAccounts.length === 0;

  const canShowAmount = canShowInstrument && instrument !== null && isCardValid && isAccountValid;

  // Para avançar do step 4, o valor não pode estar vazio nem ser 0,00
  const isAmountValid = amount.trim() !== '' && amount !== '0,00';

  const canShowInstallments = canShowAmount && isAmountValid && instrument === 'credit_card';
  const canShowDate = canShowAmount && isAmountValid && (instrument !== 'credit_card' || installmentNumber > 0);
  const canShowDueDate = canShowDate && dateStr.length === 10;
  const canShowStatus = canShowDueDate && dueDateStr.length === 10 && instrument !== 'credit_card';
  const isStatusValid = instrument === 'credit_card' || status !== null;
  const canShowPaidAt = canShowStatus && status === 'paid';
  const isPaidAtValid = status !== 'paid' || paidAtStr.length === 10;
  const canShowDescription = canShowDueDate && dueDateStr.length === 10 && isStatusValid && isPaidAtValid;
  const canSave = canShowDescription; // Descrição opcional


  useEffect(() => {
    if (visible) {
      loadMemberDataOptions();
    } else {
      handleCloseModal();
    }
  }, [visible]);

  const loadMemberDataOptions = async () => {
    if (!user?.uid) return;
    const memberData = await fetchMemberData(user.uid);
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
    }
  };

  const handleCloseModal = () => {
    setType(null);
    setCategory('');
    setTransactionName('');
    setInstrument(null);
    setSelectedCardId(null);
    setSelectedAccountId(null);
    setAmount('');
    setInstallmentNumber(1);
    setDescription('');
    setStatus('pending');
    const today = new Date();
    setDateStr(`${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`);
    setDueDateStr(`${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`);
    setPaidAtStr(`${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`);
  }

  const handleSave = async () => {
    if (!user?.uid || !type || !category || !instrument || !transactionName) return;

    const amountFloat = parseFloat(amount.replace(/\./g, '').replace(',', '.'));

    const [day, month, year] = dateStr.split('/');
    const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    const [dueDay, dueMonth, dueYear] = dueDateStr.split('/');
    const parsedDueDate = new Date(parseInt(dueYear), parseInt(dueMonth) - 1, parseInt(dueDay));

    const [paidDay, paidMonth, paidYear] = paidAtStr.split('/');
    const parsedPaidAt = new Date(parseInt(paidYear), parseInt(paidMonth) - 1, parseInt(paidDay));

    const memberData = await fetchMemberData(user.uid);
    if (!memberData || !memberData.walletId) {
      ToastService.showError('Erro', 'Você não faz parte de nenhuma carteira.');
      return;
    }

    const selectedCardName = selectedCardId ? availableCards.find(c => c.id === selectedCardId)?.name : undefined;

    const success = await createTransaction({
      walletId: memberData.walletId,
      userId: user.uid,
      type,
      category,
      name: transactionName,
      instrument,
      amount: amountFloat,
      installmentNumber,
      description,
      dueDate: parsedDueDate,
      cardId: selectedCardId || undefined,
      cardName: selectedCardName,
      accountId: selectedAccountId || undefined,
      status: instrument === 'credit_card' ? 'pending' : status,
      paidAt: status === 'paid' ? parsedPaidAt : undefined,
      payerName: memberData.profile.name,
      buyerName: memberData.profile.name,
    });

    if (success) {
      ToastService.showSuccess('Sucesso', 'Transação registrada com sucesso!');
      handleCloseModal();
      onClose();
    } else {
      ToastService.showError('Erro', 'Não foi possível registrar a transação.');
    }
  };

  if (isSaving) {
    return <LoadingOverlay />;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[globalStyles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ModalHeader
          title="Nova Transação"
          subtitle="Siga as etapas para registrar."
          onClose={onClose}
        />

        <ScrollView style={globalStyles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.timelineContainer}>
            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

            <View style={styles.stepsContainer}>

              {/* STEP 1: TYPE */}
              <StepWrapper title="Tipo" isActive={true} isCompleted={type !== null} colors={colors}>
                <TypeSelector type={type} onSelect={onSelectType} colors={colors} />
              </StepWrapper>

              {/* STEP 2: CATEGORY */}
              {canShowCategory && (
                <StepWrapper title="Categoria" isActive={true} isCompleted={category !== ''} colors={colors}>
                  <CategorySelector
                    category={category}
                    onSelect={onSelectCategory}
                    customCategories={type === 'income' ? customIncomeCategories : customExpenseCategories}
                    defaultCategories={type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES}
                    onAddPress={() => setIsCategoryModalVisible(true)}
                    onDeletePress={(cat) => setDeleteCategoryConfirm({ visible: true, category: cat })}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 2.5: NAME */}
              {canShowName && (
                <StepWrapper title="Nome da Transação" isActive={true} isCompleted={transactionName !== ''} colors={colors}>
                  <NameSelector
                    transactionName={transactionName}
                    onSelect={onSelectName}
                    nameSuggestions={nameSuggestions}
                    customNameSuggestions={customNameSuggestions}
                    onAddPress={() => setIsNameModalVisible(true)}
                    onDeletePress={(sugName) => setDeleteNameConfirm({ visible: true, name: sugName })}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 3: INSTRUMENT */}
              {canShowInstrument && (
                <StepWrapper title="Método" isActive={true} isCompleted={instrument !== null} colors={colors}>
                  <InstrumentSelector
                    instruments={type === 'income' ? INCOME_INSTRUMENTS : EXPENSE_INSTRUMENTS}
                    instrument={instrument}
                    onSelect={onSelectInstrument}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 3.5: CARD SELECTION */}
              {canShowCardSelection && (
                <StepWrapper title="Cartão Bancário" isActive={true} isCompleted={selectedCardId !== null || filteredCards.length === 0} colors={colors}>
                  <CardSelector
                    selectedCardId={selectedCardId}
                    onSelect={(cardId) => {
                      setSelectedCardId(cardId);
                      handleAnimation();
                    }}
                    filteredCards={filteredCards}
                    instrument={instrument}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 3.6: ACCOUNT SELECTION */}
              {canShowAccountSelection && (
                <StepWrapper title="Conta Bancária" isActive={true} isCompleted={selectedAccountId !== null || availableAccounts.length === 0} colors={colors}>
                  <AccountSelector
                    selectedAccountId={selectedAccountId}
                    onSelect={(accId) => {
                      setSelectedAccountId(accId);
                      handleAnimation();
                    }}
                    availableAccounts={availableAccounts}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 4: AMOUNT */}
              {canShowAmount && (
                <StepWrapper title="Valor" isActive={true} isCompleted={amount !== ''} colors={colors}>
                  <AmountInput
                    amount={amount}
                    onChangeAmount={handleAmountChange}
                    onBlur={() => handleAnimation()}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 5: INSTALLMENTS (CONDITIONAL) */}
              {canShowInstallments && (
                <StepWrapper title="Parcelas" isActive={true} isCompleted={installmentNumber > 1} colors={colors}>
                  <InstallmentSelector
                    installmentNumber={installmentNumber}
                    onChangeInstallment={setInstallmentNumber}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 6: DATE */}
              {canShowDate && (
                <StepWrapper title="Data de Início" isActive={true} isCompleted={dateStr.length === 10} colors={colors}>
                  <DateInput
                    dateStr={dateStr}
                    onChangeDate={handleDateChange}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 6.5: DUE DATE */}
              {canShowDueDate && (
                <StepWrapper title="Data de Vencimento" isActive={true} isCompleted={dueDateStr.length === 10} colors={colors}>
                  <DateInput
                    dateStr={dueDateStr}
                    onChangeDate={handleDueDateChange}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 7: STATUS */}
              {canShowStatus && (
                <StepWrapper title="Status" isActive={true} isCompleted={status !== null} colors={colors}>
                  <StatusSelector
                    status={status}
                    onSelect={(newStatus) => {
                      setStatus(newStatus);
                      handleAnimation();
                    }}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 7.5: PAID AT DATE */}
              {canShowPaidAt && (
                <StepWrapper title="Data de Pagamento" isActive={true} isCompleted={paidAtStr.length === 10} colors={colors}>
                  <DateInput
                    dateStr={paidAtStr}
                    onChangeDate={handlePaidAtChange}
                    colors={colors}
                  />
                </StepWrapper>
              )}

              {/* STEP 8: DESCRIPTION */}
              {canShowDescription && (
                <StepWrapper title="Descrição (Opcional)" isActive={true} isCompleted={description !== ''} colors={colors}>
                  <DescriptionInput
                    description={description}
                    onChangeDescription={(val) => {
                      setDescription(val);
                      handleAnimation();
                    }}
                    onSave={handleSave}
                    canSave={canSave}
                    colors={colors}
                  />
                </StepWrapper>
              )}

            </View>
          </View>
          <CategoryAddModal
            visible={isCategoryModalVisible}
            onClose={() => setIsCategoryModalVisible(false)}
            onSubmit={handleAddCategory}
            title="Nova Categoria"
            placeholder="Nome da categoria"
          />

          <CategoryAddModal
            visible={isNameModalVisible}
            onClose={() => setIsNameModalVisible(false)}
            onSubmit={async (newName) => {
              if (type && category) {
                await addCustomTransactionName(type, category, newName);
              }
              onSelectName(newName);
              setIsNameModalVisible(false);
            }}
            title="Nome da Transação"
            placeholder="Ex: Compras de mercado"
          />

          <ConfirmModal
            visible={deleteCategoryConfirm.visible}
            title="Excluir Categoria"
            description={`Deseja excluir a categoria "${deleteCategoryConfirm.category}"? Você poderá adicioná-la novamente depois.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            iconName="trash-outline"
            isDestructive={true}
            onConfirm={handleDeleteCategory}
            onCancel={() => setDeleteCategoryConfirm({ visible: false, category: '' })}
          />

          <ConfirmModal
            visible={deleteNameConfirm.visible}
            title="Excluir Nome"
            description={`Deseja excluir o nome "${deleteNameConfirm.name}"?`}
            confirmText="Excluir"
            cancelText="Cancelar"
            iconName="trash-outline"
            isDestructive={true}
            onConfirm={handleDeleteName}
            onCancel={() => setDeleteNameConfirm({ visible: false, name: '' })}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
