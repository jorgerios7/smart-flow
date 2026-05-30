import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollContent: {
        padding: 24,
        paddingBottom: 120, // space for tab bar
    },

    timelineContainer: {
        flexDirection: 'row',
    },
    timelineLine: {
        width: 2,
        marginTop: 24,
        marginBottom: 24,
        marginRight: 20,
        marginLeft: 11,
        borderRadius: 1,
    },
    stepsContainer: {
        flex: 1,
    },
    stepWrapper: {
        marginBottom: 32,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: -43,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        height: 100,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    typeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    typeText: {
        fontSize: 15,
        fontWeight: '700',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
    currencySymbol: {
        fontSize: 28,
        fontWeight: '800',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 40,
        fontWeight: '800',
        padding: 0,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
    },
    controlButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 16,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    }
});