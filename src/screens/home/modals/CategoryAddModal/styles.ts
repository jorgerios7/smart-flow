import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },
  form: {
    gap: 16,
  },
  buttonContainer: {
    marginTop: 8,
  }
});
