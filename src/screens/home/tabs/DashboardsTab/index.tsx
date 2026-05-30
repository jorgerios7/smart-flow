import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { themeColors } from '../../../../theme/colors';
import { useDashboardData } from '../../../../hooks/useDashboardData';
import TypesPerMonthCard from './components/cards/MonthlyIncome';
import BalanceCard from './components/cards/BalanceCard';
import MetricsSection from './components/sections/MetricsSection';
import RecentTransactions from './components/sections/RecentTransactions';
import { MonthSelector } from './components/MonthSelector';
import { globalStyles } from '../../../../styles/globalStyles';
import { styles } from './styles';
import { SimpleHeader } from '../../../../components/SimpleHeader';

export default function DashboardsTab() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const { metrics, loading, error, selectedDate, nextMonth, prevMonth } = useDashboardData();

  if (loading) {
    return (
      <View style={[globalStyles.tabContainer, { backgroundColor: colors.background }]}>
        <SimpleHeader title="Dashboard" buttonIcon={'settings'} buttonOnPress={() => { }} />
        <View style={globalStyles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !metrics) {
    return (
      <View style={[globalStyles.tabContainer, { backgroundColor: colors.background }]}>
        <SimpleHeader title="Dashboard" />
        <View style={globalStyles.centerContent}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={[globalStyles.emptyText, { color: colors.textMuted, marginTop: 16 }]}>
            Não foi possível carregar os dados.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[globalStyles.tabContainer, { backgroundColor: colors.background }]}>
      <SimpleHeader title="Dashboard" buttonIcon={'settings'} buttonOnPress={() => { }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <MonthSelector
          selectedDate={selectedDate}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          colors={colors}
        />

        <BalanceCard colors={colors} value={metrics.overallBalance} />

        {/* Monthly Flow Row */}
        <View style={styles.cardsRow}>
          <TypesPerMonthCard colors={colors} value={metrics.monthlyIncome} icon='arrow-up' iconColor={colors.success} text='Receitas do Mês' />
          <TypesPerMonthCard colors={colors} value={metrics.monthlyExpense} icon='arrow-down' iconColor={colors.error} text='Despesas do Mês' />
        </View>

        <MetricsSection field={'memberName'} title="Receitas por Membro" metrics={metrics.incomeByMember} colors={colors} emptyMessage='Nenhuma receita com membro registrada.' />

        <MetricsSection field={'memberName'} title="Despesas por Membro" metrics={metrics.expenseByMember} colors={colors} emptyMessage='Nenhuma despesa com membro registrada.' />

        <MetricsSection field={'status'} title="Receitas por Status" metrics={metrics.incomeByStatus} colors={colors} emptyMessage='Nenhuma receita com status registrada.' />

        <MetricsSection field={'status'} title="Despesas por Status" metrics={metrics.expenseByStatus} colors={colors} emptyMessage='Nenhuma despesa com status registrada.' />

        <MetricsSection field={'category'} title="Despesas por Categoria" metrics={metrics.expenseByCategory} colors={colors} emptyMessage='Nenhuma despesa com categoria registrada.' />

        <MetricsSection field={'instrument'} title="Despesas por Método" metrics={metrics.expenseByInstrument} colors={colors} emptyMessage='Nenhuma despesa com método registrada.' />

        <MetricsSection field={'cardName'} title="Despesas por Cartão" metrics={metrics.expenseByCard} colors={colors} emptyMessage='Nenhuma despesa com cartão registrada.' />

        <MetricsSection field={'bankName'} title="Receitas por Banco" metrics={metrics.incomeByBank} colors={colors} emptyMessage='Nenhuma receita com banco registrada.' />

        <MetricsSection field={'bankName'} title="Despesas por Banco" metrics={metrics.expenseByBank} colors={colors} emptyMessage='Nenhuma despesa com banco registrada.' />

        <RecentTransactions metrics={metrics.recentTransactions} colors={colors} />
      </ScrollView>
    </View>
  );
}
