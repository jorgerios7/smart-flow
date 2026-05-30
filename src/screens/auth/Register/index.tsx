import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { useSystemFontScale } from '../../../hooks/useSystemFontScale';
import { themeColors } from '../../../theme/colors';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { styles } from './styles';
import { ToastService } from '../../../utils/toast';
import { APP_MESSAGES } from '../../../constants/messages';
import { Button } from '../../../components/Button';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { ButtonBack } from '../../../components/ButtonBack';
import { Input } from '../../../components/Input';
import { TextLink } from '../../../components/TextLink';

export default function Register() {
  const navigation = useNavigation<any>();
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !birthDate || !password || !confirmPassword) {
      ToastService.showError('Erro', APP_MESSAGES.AUTH.EMPTY_FIELDS);
      return;
    }

    if (birthDate.length !== 10) {
      ToastService.showError('Erro', APP_MESSAGES.AUTH.INVALID_BIRTHDATE_FORMAT);
      return;
    }

    // Parse dd/mm/yyyy to Date
    const [day, month, year] = birthDate.split('/');
    const parsedBirthDate = new Date(`${year}-${month}-${day}T12:00:00Z`);

    if (isNaN(parsedBirthDate.getTime())) {
      ToastService.showError('Erro', APP_MESSAGES.AUTH.INVALID_BIRTHDATE);
      return;
    }

    if (password !== confirmPassword) {
      ToastService.showError('Erro', APP_MESSAGES.AUTH.PASSWORD_MISMATCH);
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(now.getDate() + 30); // 30 dias de plano free experimental

      const newMember = {
        createdAt: now,
        profile: {
          name,
          birthDate: parsedBirthDate,
        },
        subscription: {
          status: 'active',
          plan: 'free',
          startedAt: now,
          expiresAt: expiresAt,
        }
      };

      await setDoc(doc(db, 'members', user.uid), newMember);

      ToastService.showSuccess('Sucesso', APP_MESSAGES.AUTH.REGISTER_SUCCESS);
      navigation.replace('JoinWallet');
    } catch (error: any) {
      let errorMessage = APP_MESSAGES.AUTH.REGISTER_ERROR;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      ToastService.showError('Erro no Cadastro', errorMessage);
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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ButtonBack onNavigate={'Login'} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontSize: scale(32) }]}>CRIAR CONTA</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: scale(16) }]}>Junte-se à rede principal</Text>
          </View>

          <View style={styles.form}>
            <Input
              iconName="person-outline"
              placeholder="Nome de usuário"
              value={name}
              onChangeText={setName}
            />

            <Input
              iconName="mail-outline"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              iconName="calendar-outline"
              placeholder="Data de nascimento"
              keyboardType="number-pad"
              value={birthDate}
              onChangeText={setBirthDate}
              isDate={true}
            />

            <Input
              iconName="lock-closed-outline"
              placeholder="Senha"
              isPassword={true}
              value={password}
              onChangeText={setPassword}
            />

            <Input
              iconName="shield-checkmark-outline"
              placeholder="Confirmar Senha"
              isPassword={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Button
              title="REGISTRAR"
              iconName="checkmark-done"
              variant="secondary"
              onPress={handleRegister}
              style={{ marginTop: 16 }}
              disabled={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted, fontSize: scale(14) }]}>Já possui acesso? </Text>
            <TextLink
              text="Fazer login"
              color="primary"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


