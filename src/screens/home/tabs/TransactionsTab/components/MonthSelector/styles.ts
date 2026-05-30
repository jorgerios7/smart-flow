import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    monthSelectorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthSelectorText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
});