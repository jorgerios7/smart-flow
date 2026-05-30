import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { themeColors } from "../../theme/colors";
import { useThemeMode } from "../../hooks/useThemeMode";
import { styles } from './styles';

export function SimpleHeader({ title, buttonIcon, buttonOnPress }: { title: string, buttonIcon?: keyof typeof Ionicons.glyphMap, buttonOnPress?: () => void }) {
    const { isDark } = useThemeMode();
    const colors = isDark ? themeColors.dark : themeColors.light;
    return (
        <View style={[styles.container, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.7}
                onPress={buttonOnPress}
            >
                <Ionicons name={buttonIcon} size={22} color={colors.primary} />
            </TouchableOpacity>
        </View>
    )
}