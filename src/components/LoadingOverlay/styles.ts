import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: '#00000031',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
  },
  text: {
    marginTop: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
