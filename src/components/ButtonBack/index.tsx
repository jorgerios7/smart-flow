import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ButtonBackProps } from "../../types/components.types";
import { useThemeMode } from "../../hooks/useThemeMode";
import { themeColors } from "../../theme/colors";

export function ButtonBack({ onNavigate, size }: ButtonBackProps) {
    const navigation = useNavigation<any>();
    const { isDark } = useThemeMode();
    const colors = isDark ? themeColors.dark : themeColors.light;
    return (
        <TouchableOpacity onPress={() => navigation.navigate(onNavigate)}>
            <Ionicons name="arrow-back" size={size || 24} color={colors.text} />
        </TouchableOpacity>
    );
}