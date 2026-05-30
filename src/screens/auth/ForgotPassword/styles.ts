import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  backButton: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
});
