import { useState, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export function useWalletActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createWallet = useCallback(async (walletName: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Membro não autenticado.");

      // Obter nome do usuário
      const memberRef = doc(db, 'members', uid);
      const memberSnap = await getDoc(memberRef);
      const memberData = memberSnap.data();
      const memberName = memberData?.profile?.name || "Usuário";

      // Criar nova carteira com id automático
      const newWalletRef = doc(collection(db, 'wallets'));
      const walletId = newWalletRef.id;
      const createdAt = new Date().toISOString();

      const groupData = {
        name: walletName,
        createdBy: uid,
        createdAt,
        members: {
          [uid]: {
            name: memberName,
            role: "admin",
            status: "active"
          }
        }
      };

      await setDoc(newWalletRef, groupData);

      // Salvar em publicWallets para verificação
      const publicWalletRef = doc(db, 'publicWallets', walletId);
      await setDoc(publicWalletRef, { exists: true, name: walletName });

      // Atualizar walletId do membro
      await updateDoc(memberRef, { walletId: walletId });

      return walletId;
    } catch (err: any) {
      console.error("Erro ao criar carteira:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinWallet = useCallback(async (walletId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Membro não autenticado.");

      // Obter nome do usuário
      const memberRef = doc(db, 'members', uid);
      const memberSnap = await getDoc(memberRef);
      const memberData = memberSnap.data();
      const memberName = memberData?.profile?.name || "Usuário";

      // Verificar existência da carteira na coleção publicWallets
      const publicWalletRef = doc(db, 'publicWallets', walletId);
      const publicWalletSnap = await getDoc(publicWalletRef);

      if (!publicWalletSnap.exists()) {
        throw new Error("Carteira não encontrada .");
      }

      const walletRef = doc(db, 'wallets', walletId);

      // Adicionar membro aos membros da carteira
      await updateDoc(walletRef, {
        [`members.${uid}`]: {
          name: memberName,
          email: memberData?.profile?.email || "",
          role: "observer",
          status: "active"
        }
      });

      // Atualizar walletId na coleção members do membro
      await updateDoc(memberRef, { walletId: walletId });

      return true;
    } catch (err: any) {
      console.error("useWalletActions - Erro ao entrar na carteira:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createWallet,
    joinWallet,
    loading,
    error
  };
}
