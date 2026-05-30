import { useColorScheme } from 'react-native';

export function useThemeMode() {
  const colorScheme = useColorScheme();

  // Se o sistema não informar, assumimos 'dark' para o design futurista por padrão
  const isDark = colorScheme === 'dark' || colorScheme === null;

  return {
    mode: isDark ? 'dark' : 'light',
    isDark,
    isLight: !isDark,
  };
}
