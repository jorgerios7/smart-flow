import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    marginTop: 32,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  linkContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    marginTop: 8,
  },
});
