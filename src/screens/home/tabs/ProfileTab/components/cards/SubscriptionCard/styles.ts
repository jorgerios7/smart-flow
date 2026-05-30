import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    subscriptionCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    subTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    planNameContainer: {
        marginBottom: 20,
    },
    planName: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 1,
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150, 150, 150, 0.1)',
    },
    dateItem: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '600',
    },
});