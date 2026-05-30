import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WalletData, Role } from '../../../../../types/wallet.types';
import { formatDate } from '../../../../../utils/format';
import { styles } from '../styles';

interface WalletInfoProps {
  wallet: WalletData;
  currentUserRole: Role;
  colors: any;
  onEditPress: () => void;
}

export function WalletInfo({ wallet, currentUserRole, colors, onEditPress }: WalletInfoProps) {
  return (
    <View style={styles.walletSection}>
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceHighlight, borderColor: colors.primary, shadowColor: colors.primary }]}>
        <Ionicons name="people-outline" size={42} color={colors.primary} />
      </View>

      <View style={styles.walletNameRow}>
        <Text style={[styles.walletName, { color: colors.text }]}>{wallet.name}</Text>
        {currentUserRole === 'admin' && (
          <TouchableOpacity onPress={onEditPress} style={styles.editWalletButton}>
            <Ionicons name="create-outline" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.subtitleText, { color: colors.textMuted }]}>Criada em: {formatDate(wallet.createdAt)}</Text>
    </View>
  );
}
