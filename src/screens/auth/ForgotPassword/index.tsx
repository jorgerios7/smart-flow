import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeMode } from '../../../hooks/useThemeMode';
import { useSystemFontScale } from '../../../hooks/useSystemFontScale';
import { themeColors } from '../../../theme/colors';
import LogoPlaceholder from '../../../components/LogoPlaceholder';
import { styles } from './styles';
import { Button } from '../../../components/Button';
import { ButtonBack } from '../../../components/ButtonBack';
import { Input } from '../../../components/Input';

export default function ForgotPassword() {
  const { isDark } = useThemeMode();
  const { scale } = useSystemFontScale();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ButtonBack onNavigate={'Login'} />

          <View style={styles.header}>
            <LogoPlaceholder iconName="finger-print-outline" size={48} dashed={true} />
            <Text style={[styles.title, { color: colors.text, fontSize: scale(28) }]}>RECUPERAÇÃO</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: scale(16) }]}>
              Informe seu e-mail para receber as instruções de redefinição de acesso.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={{ marginBottom: 8 }}>
              <Input
                iconName="mail-outline"
                placeholder="E-mail cadastrado"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Button
              title="ENVIAR INSTRUÇÕES"
              iconName="send-outline"
              onPress={() => { }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


