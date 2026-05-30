import { PixelRatio } from 'react-native';

export function useSystemFontScale() {
  const fontScale = PixelRatio.getFontScale();
  
  // Função utilitária para aplicar escala em tamanhos base
  const scale = (size: number) => size * fontScale;

  return {
    fontScale,
    scale,
  };
}
