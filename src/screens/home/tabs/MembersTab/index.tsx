import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { themeColors } from '../../../../theme/colors';
import { useWalletData } from '../../../../hooks/useWalletData';
import { useMemberData } from '../../../../hooks/useMemberData';
import { auth } from '../../../../config/firebase';
import { ActionType, Role, WalletData } from '../../../../types/wallet.types';
import { ToastService } from '../../../../utils/toast';
import { WalletEditModal } from './components/WalletEditModal';
import { MemberViewer } from './components/MemberViewer';
import { WalletInfo } from './components/WalletInfo';
import { globalStyles } from '../../../../styles/globalStyles';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingOverlay } from '../../../../components/LoadingOverlay';
import { SimpleHeader } from '../../../../components/SimpleHeader';

export default function MembersTab() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const user = auth.currentUser;

  const { fetchMemberData } = useMemberData();
  const { fetchWalletData, removeMemberFromWallet, updateMemberRole, updateWalletName, loading } = useWalletData();

  const [walletId, setWalletId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<Role>('observer');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmSheet, setConfirmSheet] = useState<{ visible: boolean; type: ActionType; targetUid?: string; targetName?: string }>({ visible: false, type: 'leave' });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.uid) return;
    setIsRefreshing(true);
    try {
      const member = await fetchMemberData(user.uid);
      if (member?.walletId) {
        setWalletId(member.walletId);
        const wData = await fetchWalletData(member.walletId);
        if (wData) {
          setWallet(wData);
          if (wData.members[user.uid]) {
            setCurrentUserRole(wData.members[user.uid].role);
          }
        }
      }
    } catch (err) {
      console.log(err);
      ToastService.showError('Erro', 'Falha ao carregar dados da carteira.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShareCode = async () => {
    if (!walletId) return;
    try {
      await Share.share({
        message: `Você foi convidado(a) para participar da carteira ${wallet?.name || ''} no Smart Flow. Use o WalletCode: ${walletId}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveWallet = () => {
    setConfirmSheet({ visible: true, type: 'leave' });
  };

  const handleRemoveMember = (targetUid: string, targetName: string) => {
    setConfirmSheet({ visible: true, type: 'remove', targetUid, targetName });
  };

  const handlePromoteMember = (targetUid: string, targetName: string) => {
    setConfirmSheet({ visible: true, type: 'promote', targetUid, targetName });
  };

  const handleEditWalletName = async (newName: string) => {
    if (!walletId) return;
    setIsUpdating(true);
    try {
      const success = await updateWalletName(walletId, newName);
      if (success) {
        ToastService.showSuccess('Sucesso', 'Nome da carteira atualizado.');
        setIsEditModalVisible(false);
        loadData();
      } else {
        ToastService.showError('Erro', 'Não foi possível atualizar o nome.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const executeConfirmAction = async () => {
    if (!walletId) return;
    setIsUpdating(true);

    try {
      if (confirmSheet.type === 'leave') {
        if (!user?.uid) return;
        const success = await removeMemberFromWallet(walletId, user.uid);
        if (success) {
          ToastService.showSuccess('Sucesso', 'Você saiu da carteira.');
          setWallet(null);
          setWalletId(null);
        } else {
          ToastService.showError('Erro', 'Não foi possível sair da carteira.');
        }
      } else if (confirmSheet.type === 'remove') {
        if (!confirmSheet.targetUid) return;
        const success = await removeMemberFromWallet(walletId, confirmSheet.targetUid);
        if (success) {
          ToastService.showSuccess('Sucesso', 'Membro excluído com sucesso.');
          loadData(); // recarrega a carteira para atualizar a lista
        } else {
          ToastService.showError('Erro', 'Não foi possível excluir o membro.');
        }
      } else if (confirmSheet.type === 'promote') {
        if (!confirmSheet.targetUid) return;
        const success = await updateMemberRole(walletId, confirmSheet.targetUid, 'admin');
        if (success) {
          ToastService.showSuccess('Sucesso', 'Membro promovido a administrador.');
          loadData(); // recarrega a carteira
        } else {
          ToastService.showError('Erro', 'Não foi possível promover o membro.');
        }
      }
    } finally {
      setIsUpdating(false);
      setConfirmSheet({ visible: false, type: 'leave' });
    }
  };

  if (loading || isRefreshing) {
    return (
      <LoadingOverlay />
    );
  }

  if (!wallet || !walletId) {
    return (
      <View style={[globalStyles.tabContainer, { backgroundColor: colors.background }]}>
        <View style={globalStyles.emptyState}>
          <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
          <Text style={[globalStyles.emptyStateText, { color: colors.textMuted }]}>Você não faz parte de nenhuma carteira.</Text>
        </View>
      </View>
    );
  }

  const membersList = Object.entries(wallet.members);

  return (
    <ScrollView style={[globalStyles.tabContainer, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <SimpleHeader title="Membros" buttonIcon="share-social-outline" buttonOnPress={handleShareCode} />

      <WalletInfo
        wallet={wallet}
        currentUserRole={currentUserRole}
        colors={colors}
        onEditPress={() => setIsEditModalVisible(true)}
      />

      <MemberViewer
        list={membersList}
        currentUserRole={currentUserRole}
        userId={user!.uid}
        colors={colors}
        onLeaveWallet={handleLeaveWallet}
        onPromoteMember={handlePromoteMember}
        onRemoveMember={handleRemoveMember}
      />

      <ConfirmModal
        visible={confirmSheet.visible}
        title={confirmSheet.type === 'leave' ? 'Sair da Carteira' : confirmSheet.type === 'remove' ? 'Excluir Membro' : 'Promover Membro'}
        description={
          confirmSheet.type === 'leave'
            ? 'Tem certeza que deseja sair desta carteira? Você perderá o acesso aos dados compartilhados.'
            : confirmSheet.type === 'remove'
              ? `Deseja excluir ${confirmSheet.targetName} desta carteira?`
              : `Deseja promover ${confirmSheet.targetName} a Administrador? Ele terá permissões totais sobre a carteira.`
        }
        confirmText={confirmSheet.type === 'leave' ? 'Sair' : confirmSheet.type === 'remove' ? 'Excluir' : 'Promover'}
        cancelText="Cancelar"
        iconName={confirmSheet.type === 'leave' ? 'log-out-outline' : confirmSheet.type === 'remove' ? 'trash-outline' : 'star-outline'}
        isDestructive={confirmSheet.type === 'leave' || confirmSheet.type === 'remove'}
        isLoading={isUpdating}
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmSheet({ visible: false, type: 'leave' })}
      />

      <WalletEditModal
        visible={isEditModalVisible}
        initialName={wallet?.name || ''}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={handleEditWalletName}
        isLoading={isUpdating}
      />
    </ScrollView>
  );
}
