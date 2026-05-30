import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  walletSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  walletNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  walletName: {
    fontSize: 22,
    fontWeight: '700',
  },
  editWalletButton: {
    marginLeft: 8,
    padding: 4,
  },
  subtitleText: {
    fontSize: 14,
    alignSelf: 'center'
  },
});
