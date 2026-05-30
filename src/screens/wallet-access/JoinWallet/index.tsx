import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { useSystemFontScale } from '../../../hooks/useSystemFontScale';
import { themeColors } from '../../../theme/colors';
import { ButtonBack } from '../../../components/ButtonBack';
import { useWalletData } from '../../../hooks/useWalletData';
import { useWalletActions } from '../../../hooks/useWalletActions';
import { auth } from '../../../config/firebase';
import { styles } from './styles';
import { ToastService } from '../../../utils/toast';
import { APP_MESSAGES } from '../../../constants/messages';
import LogoPlaceholder from '../../../components/LogoPlaceholder';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { TextLink } from '../../../components/TextLink';

export default function JoinWallet() {
  const navigation = useNavigation<any>();
  const { verifyWalletCode, loading: walletLoading } = useWalletData();
  const { joinWallet, loading: actionLoading } = useWalletActions();
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const insets = useSafeAreaInsets();

  const [walletCode, setWalletCode] = useState('');

  const handleConfirm = async () => {
    if (!walletCode.trim()) {
      ToastService.showError('Erro', APP_MESSAGES.WALLET.EMPTY_CODE);
      return;
    }

    const exists = await verifyWalletCode(walletCode.trim());
    if (exists) {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        ToastService.showError('Erro', APP_MESSAGES.WALLET.UNAUTHENTICATED);
        return;
      }

      const success = await joinWallet(walletCode.trim());

      if (success) {
        ToastService.showSuccess('Sucesso', APP_MESSAGES.WALLET.JOIN_SUCCESS);
        navigation.replace('Home');
      } else {
        ToastService.showError('Erro', APP_MESSAGES.WALLET.JOIN_ERROR);
      }
    } else {
      ToastService.showError('Erro', APP_MESSAGES.WALLET.NOT_FOUND);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ButtonBack onNavigate={'Login'} />

          <View style={styles.header}>
            <LogoPlaceholder iconName="wallet-outline" size={48} />
            <Text style={[styles.title, { color: colors.text, fontSize: scale(32) }]}>ACESSAR CARTEIRA</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: scale(16) }]}>Conecte-se a um grupo existente</Text>
          </View>

          <View style={styles.form}>
            <Input
              iconName="key-outline"
              placeholder="Digite o WalletCode"
              value={walletCode}
              onChangeText={setWalletCode}
              autoCapitalize="characters"
            />

            <View style={styles.linkContainer}>
              <TextLink
                text="Deseja criar uma carteira ?"
                onPress={() => navigation.navigate('CreateWallet')}
              />
            </View>

            <Button
              title={(walletLoading || actionLoading) ? "Verificando..." : "Confirmar"}
              iconName="checkmark-circle-outline"
              onPress={handleConfirm}
              disabled={walletLoading || actionLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


