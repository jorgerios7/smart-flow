import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 24,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    categoryItem: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    categoryNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '500',
    },
    categoryAmount: {
        fontSize: 15,
        fontWeight: '600',
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 15,
        marginTop: 10,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    recentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recentInfo: {
        flex: 1,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    recentSubtitle: {
        fontSize: 14,
    },
    recentAmountContainer: {
        alignItems: 'flex-end',
    },
    recentAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    recentDate: {
        fontSize: 12,
    },
});