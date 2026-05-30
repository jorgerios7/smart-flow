import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 16,
        borderBottomWidth: 1,
    },
    sectionDate: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sectionBalance: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});