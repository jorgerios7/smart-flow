import { Text, View } from "react-native";
import { styles } from "./styles";
import { formatCurrency } from "../../../../../../utils/format";

interface TypesByMemberProps {
    field: string;
    title: string;
    metrics: any;
    colors: any;
    emptyMessage: string;
}

export default function MetricsSection({ field, title, metrics, colors, emptyMessage }: TypesByMemberProps) {
    return (
        <View style={[styles.sectionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            {metrics.length > 0 ? (
                metrics.map((item: any, index: number) => (
                    item.field === 'instrument' ?
                        (
                            <View key={`inst-${index}`} style={styles.categoryItem}>
                                <View style={styles.categoryHeader}>
                                    <View style={styles.categoryNameRow}>
                                        <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                                        <Text style={[styles.categoryName, { color: colors.text }]}>
                                            {
                                                item.instrument === 'credit_card' ? 'Cartão de Crédito' :
                                                    item.instrument === 'debit_card' ? 'Cartão de Débito' :
                                                        item.instrument === 'pix' ? 'Pix' :
                                                            item.instrument === 'cash' ? 'Dinheiro' :
                                                                item.instrument === 'bank_transfer' ? 'Transf. Bancária' : item.instrument
                                            }
                                        </Text>
                                    </View>
                                    <Text style={[styles.categoryAmount, { color: colors.text }]}>{formatCurrency(item.total)}</Text>
                                </View>
                                <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceHighlight }]}>
                                    <View style={[styles.progressBarFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                                </View>
                            </View>
                        ) : (
                            <View key={`inc-member-${index}`} style={styles.categoryItem}>
                                <View style={styles.categoryHeader}>
                                    <View style={styles.categoryNameRow}>
                                        <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                                        <Text style={[styles.categoryName, { color: colors.text }]}>{item[field]}</Text>
                                    </View>
                                    <Text style={[styles.categoryAmount, { color: colors.text }]}>{formatCurrency(item.total as number)}</Text>
                                </View>
                                <View style={[styles.progressBarContainer, { backgroundColor: colors.surfaceHighlight }]}>
                                    <View style={[styles.progressBarFill, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                                </View>
                            </View>
                        )
                ))
            ) : (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>{emptyMessage}</Text>
            )}
        </View>
    );
}