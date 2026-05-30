import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollContent: {
        padding: 24,
        paddingBottom: 60,
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
        marginBottom: 28,
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
