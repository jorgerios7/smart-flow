import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { formatCurrency } from "../../../../../../utils/format";

interface TypesPerMonthCardProps {
    colors: any;
    value: number;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: any;
    text: string;
}

export default function TypesPerMonthCard({ colors, value, icon, iconColor, text }: TypesPerMonthCardProps) {
    return (
        <View style={[styles.miniCard, styles.miniCardMargin, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.miniCardIconContainer, { backgroundColor: `${iconColor}20` }]}>
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <Text style={[styles.miniCardLabel, { color: colors.textMuted }]}>{text}</Text>
            <Text style={[styles.miniCardValue, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                {formatCurrency(value)}
            </Text>
        </View>
    );
}