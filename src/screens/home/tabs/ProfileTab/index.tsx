import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../hooks/useThemeMode';
import { themeColors } from '../../../../theme/colors';
import { auth, storage } from '../../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail } from 'firebase/auth';
import { useMemberData } from '../../../../hooks/useMemberData';
import { MemberData, MemberSubscription } from '../../../../types/member.types';
import SettingsModal from './components/modals/SettingsModal';
import ProfileEditModal from './components/modals/ProfileEditModal';
import FinanceEditModal from './components/modals/FinanceEditModal';
import PhotoOptionsModal from './components/modals/PhotoOptionsModal';
import { ToastService } from '../../../../utils/toast';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import SubscriptionCard from './components/cards/SubscriptionCard';
import FinanceSection from './components/FinanceSection';
import { globalStyles } from '../../../../styles/globalStyles';
import { EditModalType, FinanceModalType } from '../../../../types/components.types';
import OptionItem from './components/OptionItem';
import { SimpleHeader } from '../../../../components/SimpleHeader';

export default function ProfileTab() {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;

  const navigation = useNavigation<any>();

  // Settings bottom sheet state
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Photo options bottom sheet state
  const [isPhotoOptionsVisible, setIsPhotoOptionsVisible] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Edit Modal State
  const [editModalType, setEditModalType] = useState<EditModalType>(null);
  const [financeModalType, setFinanceModalType] = useState<FinanceModalType>(null);
  const [financeInitialData, setFinanceInitialData] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { fetchMemberData, updateMemberProfile, saveMemberAccount, deleteMemberAccount, saveMemberCard, deleteMemberCard } = useMemberData();
  const [memberData, setMemberData] = useState<MemberData | null>(null);

  // User data
  const user = auth.currentUser;
  const username = memberData?.profile?.name || user?.displayName || 'Usuário Central';
  const email = user?.email || 'usuario@smartflow.com';

  useEffect(() => {
    if (user?.uid) {
      fetchMemberData(user.uid).then(data => {
        if (data) setMemberData(data);
      });
    }
  }, [user?.uid, fetchMemberData]);

  const uploadPhoto = async (uri: string) => {
    if (!user) return;
    setIsUploadingPhoto(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `profile_${Date.now()}.jpg`;
      const storageRef = ref(storage, `users/${user.uid}/profile_images/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });
      await updateMemberProfile(user.uid, { photoUrl: downloadURL });

      setMemberData(prev => prev ? { ...prev, profile: { ...prev.profile, photoUrl: downloadURL } } : prev);
      ToastService.showSuccess('Sucesso', 'Foto de perfil atualizada.');
    } catch (error) {
      console.log('Upload error: ', error);
      ToastService.showError('Erro', 'Não foi possível atualizar a foto.');
    } finally {
      setIsUploadingPhoto(false);
      setIsPhotoOptionsVisible(false);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      ToastService.showError('Permissão negada', 'Você precisa permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const handleChooseFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      ToastService.showError('Permissão negada', 'Você precisa permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!user || !user.email) return;
    setIsUpdating(true);
    try {
      if (editModalType === 'name') {
        if (!data.name) throw new Error('Nome inválido.');
        await updateProfile(user, { displayName: data.name });
        await updateMemberProfile(user.uid, { name: data.name });
        setMemberData(prev => prev ? { ...prev, profile: { ...prev.profile, name: data.name } } : prev);
        ToastService.showSuccess('Sucesso', 'Nome atualizado com sucesso.');
      } else if (editModalType === 'email') {
        if (!data.email || !data.currentPassword) throw new Error('Preencha os campos obrigatórios.');
        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
        await reauthenticateWithCredential(user, credential);

        await verifyBeforeUpdateEmail(user, data.email);
        ToastService.showSuccess('Verificação enviada', 'Um link de confirmação foi enviado para o novo e-mail.');
      } else if (editModalType === 'password') {
        if (!data.newPassword || !data.currentPassword || data.newPassword !== data.confirmPassword) {
          throw new Error('As senhas não coincidem ou campos vazios.');
        }
        const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, data.newPassword);
        ToastService.showSuccess('Sucesso', 'Senha atualizada com sucesso.');
      }
      setEditModalType(null);
    } catch (error: any) {
      let msg = 'Ocorreu um erro ao atualizar.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') msg = 'Senha atual incorreta.';
      else if (error.code === 'auth/email-already-in-use') msg = 'Este email já está em uso.';
      else if (error.message) msg = error.message;
      ToastService.showError('Erro', msg);
      console.log('(ProfileTab) - error: ', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFinanceSubmit = async (data: any) => {
    if (!user?.uid) return;
    setIsUpdating(true);
    try {
      if (financeModalType?.includes('Account')) {
        const accId = financeInitialData?.id || Date.now().toString();
        // Preserva os cartões existentes na conta, se houver
        const existingCards = memberData?.finance?.accounts?.[accId]?.cards || {};
        const accData = { id: accId, name: data.name, type: data.type, cards: existingCards };
        await saveMemberAccount(user.uid, accId, accData);
        setMemberData(prev => prev ? {
          ...prev,
          finance: {
            ...prev.finance,
            accounts: { ...(prev.finance?.accounts || {}), [accId]: accData },
          }
        } : prev);
        ToastService.showSuccess('Sucesso', financeModalType === 'addAccount' ? 'Conta adicionada.' : 'Conta atualizada.');
      } else if (financeModalType?.includes('Card')) {
        const cardId = financeInitialData?.id || Date.now().toString();
        const accountId = data.accountId; // the selected account

        // Remove accountId and id from the payload to match the type strictly
        const cardData = { name: data.name, issuer: data.issuer, type: data.type, last4Digits: data.last4Digits };

        // Remove card from old account if it was moved:
        let oldAccountId = financeInitialData?.accountId;
        if (oldAccountId && oldAccountId !== accountId) {
          await deleteMemberCard(user.uid, oldAccountId, cardId);
        }

        await saveMemberCard(user.uid, accountId, cardId, cardData);

        setMemberData(prev => {
          if (!prev) return prev;
          const accounts = { ...(prev.finance?.accounts || {}) };

          if (oldAccountId && oldAccountId !== accountId && accounts[oldAccountId]) {
            const oldCards = { ...accounts[oldAccountId].cards };
            delete oldCards[cardId];
            accounts[oldAccountId] = { ...accounts[oldAccountId], cards: oldCards };
          }

          if (accounts[accountId]) {
            accounts[accountId] = {
              ...accounts[accountId],
              cards: { ...(accounts[accountId].cards || {}), [cardId]: cardData }
            };
          }

          return {
            ...prev,
            finance: { ...prev.finance, accounts }
          };
        });
        ToastService.showSuccess('Sucesso', financeModalType === 'addCard' ? 'Cartão adicionado.' : 'Cartão atualizado.');
      }
      setFinanceModalType(null);
      setFinanceInitialData(null);
    } catch (err) {
      console.log(err);
      ToastService.showError('Erro', 'Não foi possível salvar os dados.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFinanceDelete = async () => {
    if (!user?.uid || !financeInitialData?.id) return;
    setIsUpdating(true);
    try {
      if (financeModalType === 'editAccount') {
        await deleteMemberAccount(user.uid, financeInitialData.id);
        setMemberData(prev => {
          if (!prev) return prev;
          const updatedAccounts = { ...prev.finance?.accounts };
          delete updatedAccounts[financeInitialData.id];
          return { ...prev, finance: { ...prev.finance, accounts: updatedAccounts } };
        });
        ToastService.showSuccess('Sucesso', 'Conta excluída.');
      } else if (financeModalType === 'editCard') {
        const accountId = financeInitialData.accountId;
        await deleteMemberCard(user.uid, accountId, financeInitialData.id);
        setMemberData(prev => {
          if (!prev) return prev;
          const accounts = { ...prev.finance?.accounts };
          if (accounts[accountId]) {
            const updatedCards = { ...accounts[accountId].cards };
            delete updatedCards[financeInitialData.id];
            accounts[accountId] = { ...accounts[accountId], cards: updatedCards };
          }
          return { ...prev, finance: { ...prev.finance, accounts } };
        });
        ToastService.showSuccess('Sucesso', 'Cartão excluído.');
      }
      setFinanceModalType(null);
      setFinanceInitialData(null);
    } catch (err) {
      ToastService.showError('Erro', 'Não foi possível excluir.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      ToastService.showError('Erro', 'Não foi possível sair da conta.');
    }
  };

  return (
    <ScrollView style={[globalStyles.tabContainer, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <SimpleHeader title="Perfil" buttonIcon="settings-outline" buttonOnPress={() => setIsSettingsVisible(true)} />

      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={() => setIsPhotoOptionsVisible(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.avatarContainer, { backgroundColor: colors.surfaceHighlight, borderColor: colors.primary, shadowColor: colors.primary }]}>
            {memberData?.profile?.photoUrl ? (
              <Image source={{ uri: memberData.profile.photoUrl }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
            ) : (
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {username.charAt(0).toUpperCase()}
              </Text>
            )}
            <View style={[styles.editAvatarButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="camera" size={16} color={colors.text} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
        <Text style={[styles.email, { color: colors.textMuted }]}>{email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <SubscriptionCard memberSubscription={memberData?.subscription as MemberSubscription} colors={colors} />
      </View>

      <FinanceSection
        memberData={memberData}
        colors={colors}
        setFinanceInitialData={setFinanceInitialData}
        setFinanceModalType={setFinanceModalType}
      />

      <View style={styles.optionsContainer}>
        <Text style={[styles.optionsTitle, { color: colors.textMuted }]}>SEGURANÇA E DADOS</Text>
        <OptionItem icon='person-outline' title='Alterar Nome de Usuário' color={colors.primary} onPress={() => setEditModalType('name')} colors={colors} />
        <OptionItem icon='mail-outline' title='Alterar Email' color={colors.secondary} onPress={() => setEditModalType('email')} colors={colors} />
        <OptionItem icon='lock-closed-outline' title='Alterar Senha' color={colors.error} onPress={() => setEditModalType('password')} colors={colors} />

        <View style={{ marginTop: 24 }}>
          <OptionItem icon='log-out-outline' title='Sair da Conta' color={colors.error} onPress={handleLogout} colors={colors} />
        </View>
      </View>

      <SettingsModal
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      />

      <PhotoOptionsModal
        visible={isPhotoOptionsVisible}
        onClose={() => setIsPhotoOptionsVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChooseFromLibrary={handleChooseFromLibrary}
        isLoading={isUploadingPhoto}
      />

      <ProfileEditModal
        visible={editModalType !== null}
        type={editModalType}
        onClose={() => setEditModalType(null)}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />

      <FinanceEditModal
        visible={financeModalType !== null}
        type={financeModalType}
        initialData={financeInitialData}
        accounts={memberData?.finance?.accounts || {}}
        onClose={() => { setFinanceModalType(null); setFinanceInitialData(null); }}
        onSubmit={handleFinanceSubmit}
        onDelete={handleFinanceDelete}
        isLoading={isUpdating}
      />
    </ScrollView>
  );
}
