import { Text, View } from "react-native";
import { formatCurrency, formatDate } from "../../../../../../utils/format";
import { Ionicons } from "@expo/vector-icons";
import { styles } from './styles';

interface RecentTransactionsProps {
    metrics: any;
    colors: any;
}

export default function RecentTransactions({ metrics, colors }: RecentTransactionsProps) {

    const getTransactionIcon = (category: string, type: string) => {
        if (type === 'income') return 'arrow-up-circle';
        const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            'Supermercado': 'cart',
            'Transporte': 'car',
            'Alimentação': 'restaurant',
            'Saúde': 'medkit',
            'Educação': 'book',
            'Lazer': 'game-controller',
            'Moradia': 'home',
        };
        return iconMap[category] || 'cash';
    };

    return (
        <View style={[styles.sectionContainer, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 80 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Transações Recentes</Text>
            {metrics.length > 0 ? (
                metrics.map((tx: any, index: number) => {
                    const isIncome = tx.type === 'income';
                    const isLast = index === metrics.length - 1;
                    return (
                        <View key={tx.id} style={[styles.recentItem, { borderBottomColor: isLast ? 'transparent' : colors.border }]}>
                            <View style={[styles.recentIconContainer, { backgroundColor: isIncome ? `${colors.success}20` : `${colors.error}20` }]}>
                                <Ionicons name={getTransactionIcon(tx.category, tx.type)} size={24} color={isIncome ? colors.success : colors.error} />
                            </View>
                            <View style={styles.recentInfo}>
                                <Text style={[styles.recentTitle, { color: colors.text }]}>{tx.category}</Text>
                                <Text style={[styles.recentSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
                                    {tx.description || (isIncome ? 'Receita' : 'Despesa')}
                                </Text>
                            </View>
                            <View style={styles.recentAmountContainer}>
                                <Text style={[styles.recentAmount, { color: isIncome ? colors.success : colors.text }]}>
                                    {isIncome ? '+' : '-'}{formatCurrency(tx.purchase?.amount || 0)}
                                </Text>
                                <Text style={[styles.recentDate, { color: colors.textMuted }]}>{formatDate(tx.createdAt)}</Text>
                            </View>
                        </View>
                    );
                })
            ) : (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nenhuma transação recente.</Text>
            )}
        </View>
    );
}