import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  monthSelectorButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  monthSelectorText: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
});
