import React, { useState } from 'react';
import { View, Text, SectionList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { themeColors } from '../../../../theme/colors';
import { useTransactionsList, EnrichedInstallment } from '../../../../hooks/useTransactionsList';
import TransactionOptionsModal from './components/modals/TransactionOptionsModal';
import PayInstallmentModal from './components/modals/PayInstallmentModal';
import FullTransactionModal from './components/modals/FullTransactionModal';
import MonthSelector from './components/MonthSelector';
import TransactionItem from './components/TransactionItem';
import TransactionSectionHeader from './components/TransactionSectionHeader';
import { globalStyles } from '../../../../styles/globalStyles';
import { styles } from './styles';
import { SimpleHeader } from '../../../../components/SimpleHeader';

export default function TransactionsTab() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const { groupedTransactions, loading, error, selectedDate, nextMonth, prevMonth, walletId } = useTransactionsList();

  const [selectedInstallment, setSelectedInstallment] = useState<EnrichedInstallment | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isFullTxModalVisible, setIsFullTxModalVisible] = useState(false);

  const openOptions = (installment: EnrichedInstallment) => {
    setSelectedInstallment(installment);
    setIsBottomSheetVisible(true);
  };

  // Map to SectionList format
  const sections = groupedTransactions.map(group => ({
    title: group.dateString,
    balance: group.balance,
    data: group.installments,
  }));

  return (
    <View style={[globalStyles.tabContainer, { backgroundColor: colors.background }]}>
      <SimpleHeader title="Transações" />

      {error ? (
        <View style={globalStyles.centerContent}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[globalStyles.emptyText, { color: colors.textMuted }]}>
            Não foi possível carregar as transações.
          </Text>
        </View>
      ) : (
        loading ? (
          <View style={globalStyles.centerContent} >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <MonthSelector
              selectedDate={selectedDate}
              prevMonth={prevMonth}
              nextMonth={nextMonth}
              colors={colors}
            />
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderSectionHeader={({ section: { title, balance } }) => (
                <TransactionSectionHeader
                  title={title}
                  balance={balance}
                  colors={colors}
                />
              )}
              renderItem={({ item }) => (
                <TransactionItem
                  item={item}
                  colors={colors}
                  onPress={openOptions}
                />
              )}
              ListEmptyComponent={() => (
                <View style={globalStyles.centerContent}>
                  <Text style={[globalStyles.emptyText, { color: colors.textMuted }]}>
                    Nenhuma transação para este mês.
                  </Text>
                </View>
              )}
            />
            <TransactionOptionsModal
              isVisible={isBottomSheetVisible}
              onClose={() => setIsBottomSheetVisible(false)}
              installment={selectedInstallment}
              walletId={walletId}
              onPayInstallment={() => {
                setIsBottomSheetVisible(false);
                setIsPayModalVisible(true);
              }}
              onViewFullTransaction={() => {
                setIsBottomSheetVisible(false);
                setIsFullTxModalVisible(true);
              }}
            />
            <PayInstallmentModal
              isVisible={isPayModalVisible}
              onClose={() => setIsPayModalVisible(false)}
              installment={selectedInstallment}
              walletId={walletId}
            />
            <FullTransactionModal
              isVisible={isFullTxModalVisible}
              onClose={() => setIsFullTxModalVisible(false)}
              transactionId={selectedInstallment?.transactionId || ''}
              walletId={walletId}
            />
          </>
        )
      )}
    </View >
  );
}
