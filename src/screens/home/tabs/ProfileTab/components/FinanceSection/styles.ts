import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    optionsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft: 4,
        marginTop: 24,
    },
    optionsTitle: {
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft: 4,
    },
    financeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    financeCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    financeCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    financeCardInfo: {
        flex: 1,
    },
    financeCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    financeCardSubtitle: {
        fontSize: 13,
    },
    financeCardTag: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    nestedCardsContainer: {
        paddingLeft: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    nestedCardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingRight: 20,
    },
    nestedCardIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addFinanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        marginBottom: 12,
    },
    addFinanceText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    }
});
