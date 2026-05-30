import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        paddingBottom: 32,
        minHeight: '100%',
    },
    dragIndicatorContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    optionsContainer: {
        paddingTop: 8,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
    },
    optionIcon: {
        marginRight: 16,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
});