import { Text, View } from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../../../../../../utils/format";
import { MemberSubscription, SubscriptionPlan } from "../../../../../../../types/member.types";

type SubscriptionCardProps = {
    memberSubscription?: MemberSubscription;
    colors: any;
}

export default function SubscriptionCard({ memberSubscription, colors }: SubscriptionCardProps) {
    const getPlanName = (plan?: SubscriptionPlan) => {
        if (plan === 'premium') return 'PRO Elite';
        if (plan === 'free') return 'Free';
        return '--';
    };

    const planName = getPlanName(memberSubscription?.plan);
    const statusColor = memberSubscription?.status ? (memberSubscription?.status === 'active' ? '#2ecc71' : colors.error) : colors.background;
    const statusText = memberSubscription?.status ? (memberSubscription?.status === 'active' ? 'Ativo' : 'Inativo') : '';

    return (
        <View style={[styles.subscriptionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.subHeader}>
                <View style={styles.subTitleContainer}>
                    <Ionicons name="flash-outline" size={20} color={colors.primary} />
                    <Text style={[styles.subTitle, { color: colors.textMuted }]}>Meu Plano</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                </View>
            </View>

            <View style={styles.planNameContainer}>
                <Text style={[styles.planName, { color: colors.primary }]}>{planName}</Text>
            </View>

            <View style={styles.datesContainer}>
                <View style={styles.dateItem}>
                    <Text style={[styles.dateLabel, { color: colors.textMuted }]}>Início</Text>
                    <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(memberSubscription?.startedAt)}</Text>
                </View>
                <View style={[styles.dateItem, { alignItems: 'flex-end' }]}>
                    <Text style={[styles.dateLabel, { color: colors.textMuted }]}>Vencimento</Text>
                    <Text style={[styles.dateValue, { color: colors.text }]}>{formatDate(memberSubscription?.expiresAt)}</Text>
                </View>
            </View>
        </View>
    );
}