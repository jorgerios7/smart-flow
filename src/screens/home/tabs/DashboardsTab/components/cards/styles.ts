import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    balanceCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        overflow: 'hidden',
    },
    balanceLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    glassBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.15,
    },
    miniCard: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },
    miniCardMargin: {
        marginRight: 16,
    },
    miniCardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    miniCardLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    miniCardValue: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});