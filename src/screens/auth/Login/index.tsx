import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { useSystemFontScale } from '../../../hooks/useSystemFontScale';
import { themeColors } from '../../../theme/colors';
import LogoPlaceholder from '../../../components/LogoPlaceholder';
import { useMemberData } from '../../../hooks/useMemberData';
import { styles } from './styles';
import { ToastService } from '../../../utils/toast';
import { APP_MESSAGES } from '../../../constants/messages';
import { Button } from '../../../components/Button';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { Input } from '../../../components/Input';
import { TextLink } from '../../../components/TextLink';

export default function Login() {
  const navigation = useNavigation<any>();
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { fetchMemberData } = useMemberData();

  const handleLogin = async () => {
    if (!email || !password) {
      ToastService.showError('Erro', APP_MESSAGES.AUTH.EMPTY_FIELDS);
      return;
    }

    setIsLoading(true);
    try {
      const memberCredential = await signInWithEmailAndPassword(auth, email, password);
      const member = memberCredential.user;

      const memberData = await fetchMemberData(member.uid);

      if (memberData?.walletId) {
        navigation.replace('Home');
      } else {
        navigation.replace('JoinWallet');
      }
    } catch (error: any) {
      let errorMessage = APP_MESSAGES.AUTH.LOGIN_ERROR;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        errorMessage = APP_MESSAGES.AUTH.USER_NOT_FOUND;
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = APP_MESSAGES.AUTH.INVALID_CREDENTIALS;
      }
      ToastService.showError('Acesso Negado', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {isLoading && <LoadingOverlay />}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          <View style={styles.header}>
            <LogoPlaceholder iconName="hardware-chip-outline" size={48} />
            <Text style={[styles.title, { color: colors.text, fontSize: scale(32) }]}>SMART FLOW</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: scale(16) }]}>Acesse o sistema operacional</Text>
          </View>

          <View style={styles.form}>
            <Input
              iconName="mail-outline"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              iconName="lock-closed-outline"
              placeholder="Senha"
              isPassword={true}
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.forgotPassword}>
              <TextLink
                text="Esqueceu a senha?"
                onPress={() => navigation.navigate('ForgotPassword')}
              />
            </View>

            <Button
              title="ENTRAR"
              iconName="arrow-forward"
              onPress={handleLogin}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted, fontSize: scale(14) }]}>Não tem uma conta? </Text>
            <TextLink
              text="Cadastre-se"
              color="secondary"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


