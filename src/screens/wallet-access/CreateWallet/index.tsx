import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { useSystemFontScale } from '../../../hooks/useSystemFontScale';
import { themeColors } from '../../../theme/colors';
import { ButtonBack } from '../../../components/ButtonBack';
import { useWalletActions } from '../../../hooks/useWalletActions';
import { styles } from './styles';
import { ToastService } from '../../../utils/toast';
import { APP_MESSAGES } from '../../../constants/messages';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

export default function CreateWallet() {
  const navigation = useNavigation<any>();
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const insets = useSafeAreaInsets();

  const [walletName, setWalletName] = useState('');
  const { createWallet, loading } = useWalletActions();

  const handleCreate = async () => {
    if (!walletName.trim()) {
      ToastService.showError('Erro', APP_MESSAGES.WALLET.EMPTY_NAME);
      return;
    }

    const walletId = await createWallet(walletName.trim());
    if (walletId) {
      ToastService.showSuccess('Sucesso', `${APP_MESSAGES.WALLET.CREATE_SUCCESS}\nCódigo: ${walletId}`);
      navigation.replace('Home');
    } else {
      ToastService.showError('Erro', APP_MESSAGES.WALLET.CREATE_ERROR);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ButtonBack onNavigate={'JoinWallet'} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontSize: scale(32) }]}>CRIAR CARTEIRA</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: scale(16) }]}>Inicie um novo grupo financeiro</Text>
          </View>

          <View style={styles.form}>
            <Input
              iconName="wallet-outline"
              placeholder="Nome da nova carteira"
              value={walletName}
              onChangeText={setWalletName}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={loading ? "Criando..." : "Confirmar"}
                iconName="add-circle-outline"
                onPress={handleCreate}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


