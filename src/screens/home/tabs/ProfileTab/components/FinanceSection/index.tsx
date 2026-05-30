import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MemberData, AccountType, MemberFinanceAccount } from '../../../../../../types/member.types';
import { ToastService } from '../../../../../../utils/toast';
import { styles } from './styles';

interface FinanceSectionProps {
  memberData: MemberData | null;
  colors: any;
  setFinanceInitialData: (data: any) => void;
  setFinanceModalType: (type: any) => void;
}

export default function FinanceSection({
  memberData,
  colors,
  setFinanceInitialData,
  setFinanceModalType,
}: FinanceSectionProps) {
  const accounts: MemberFinanceAccount[] = memberData?.finance?.accounts ? Object.values(memberData.finance.accounts) : [];

  const getAccountTypeName = (type: AccountType) => {
    switch (type) {
      case 'savingsAccount': return 'Conta Poupança';
      case 'investmentAccount': return 'Conta Investimento';
      default: return 'Conta Corrente';
    }
  };

  return (
    <View style={styles.optionsContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>FINANCEIRO</Text>

      {accounts.map((acc, index) => {
        const accountCards = acc.cards ? Object.entries(acc.cards) : [];

        return (
          <View key={acc.id || `acc-${index}`} style={[styles.financeCard, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: 'column', alignItems: 'stretch', paddingHorizontal: 0, paddingVertical: 0 }]}>
            {/* ACCOUNT HEADER */}
            <TouchableOpacity
              style={[styles.financeCardContent, { paddingHorizontal: 20, paddingVertical: 16 }]}
              activeOpacity={0.7}
              onPress={() => { setFinanceInitialData(acc); setFinanceModalType('editAccount'); }}
            >
              <View style={[styles.financeCardIcon, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="business-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.financeCardInfo}>
                <Text style={[styles.financeCardTitle, { color: colors.text }]}>{acc.name}</Text>
                <Text style={[styles.financeCardSubtitle, { color: colors.textMuted }]}>{getAccountTypeName(acc.type)}</Text>
              </View>
              <Ionicons name="pencil-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* NESTED CARDS */}
            {accountCards.length > 0 && (
              <View style={[styles.nestedCardsContainer, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                {accountCards.map(([cardId, card]: any, cIndex) => (
                  <TouchableOpacity
                    key={cardId}
                    style={[styles.nestedCardItem, { borderBottomWidth: cIndex === accountCards.length - 1 ? 0 : 1, borderBottomColor: colors.border }]}
                    activeOpacity={0.7}
                    onPress={() => {
                      // Attach id and accountId to card data so Modal knows its parent and identity
                      setFinanceInitialData({ ...card, id: cardId, accountId: acc.id });
                      setFinanceModalType('editCard');
                    }}
                  >
                    <View style={[styles.nestedCardIcon, { backgroundColor: `${colors.secondary}15` }]}>
                      <Ionicons name="card-outline" size={18} color={colors.secondary} />
                    </View>
                    <View style={styles.financeCardInfo}>
                      <Text style={[styles.financeCardTitle, { color: colors.text, fontSize: 14 }]}>{card.name}</Text>
                      <Text style={[styles.financeCardSubtitle, { color: colors.textMuted, fontSize: 12 }]}>
                        {card.type === 'credit_card' ? 'Crédito' : 'Débito'} • {card.issuer} {card.last4Digits ? `•••• ${card.last4Digits}` : ''}
                      </Text>
                    </View>
                    <Ionicons name="pencil-outline" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={[styles.addFinanceButton, { borderColor: colors.border, backgroundColor: `${colors.surface}80` }]}
        activeOpacity={0.6}
        onPress={() => { setFinanceInitialData(null); setFinanceModalType('addAccount'); }}
      >
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={[styles.addFinanceText, { color: colors.primary }]}>Adicionar Conta Bancária</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addFinanceButton, { borderColor: colors.border, backgroundColor: `${colors.surface}80`, opacity: accounts.length === 0 ? 0.5 : 1 }]}
        activeOpacity={0.6}
        onPress={() => {
          if (accounts.length > 0) {
            setFinanceInitialData(null);
            setFinanceModalType('addCard');
          } else {
            ToastService.showError('Aviso', 'Adicione uma conta antes de adicionar um cartão.');
          }
        }}
      >
        <Ionicons name="add" size={20} color={colors.secondary} />
        <Text style={[styles.addFinanceText, { color: colors.secondary }]}>Adicionar Cartão</Text>
      </TouchableOpacity>
    </View>
  );
}
