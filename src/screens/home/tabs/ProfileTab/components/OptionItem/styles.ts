import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        elevation: 2,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
});