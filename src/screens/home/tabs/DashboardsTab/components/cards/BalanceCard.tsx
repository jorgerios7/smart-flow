import { Text, View } from "react-native";
import { formatCurrency } from "../../../../../../utils/format";
import { styles } from "./styles";

export default function BalanceCard({ colors, value }: { colors: any, value: number }) {
    return (
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
            <View style={[styles.glassBackground, { backgroundColor: '#FFF' }]} />
            <Text style={[styles.balanceLabel, { color: 'rgba(255,255,255,0.8)' }]}>Saldo Total Acumulado</Text>
            <Text style={[styles.balanceValue, { color: '#FFF' }]}>{formatCurrency(value)}</Text>
        </View>
    );
}