import { useState, useCallback } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../config/firebase';

import { WalletData } from '../types/wallet.types';

export function useWalletData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkWalletExists = useCallback(async (walletId: string): Promise<boolean> => {
    try {
      const publicWalletRef = doc(db, 'publicWallets', walletId);
      const publicWalletSnap = await getDoc(publicWalletRef);
      return publicWalletSnap.exists();
    } catch (err: any) {
      console.error("Erro ao verificar existência da carteira:", err);
      return false;
    }
  }, []);

  const verifyWalletCode = useCallback(async (walletId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const exists = await checkWalletExists(walletId);
      return exists;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [checkWalletExists]);

  const fetchWalletData = useCallback(async (walletId: string): Promise<WalletData | null> => {
    setLoading(true);
    setError(null);
    try {
      const exists = await checkWalletExists(walletId);
      if (!exists) {
        throw new Error('WalletCode não encontrado.');
      }

      const walletRef = doc(db, 'wallets', walletId);
      const walletSnap = await getDoc(walletRef);

      if (walletSnap.exists()) {
        return walletSnap.data() as WalletData;
      } else {
        return null;
      }
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [checkWalletExists]);

  const removeMemberFromWallet = useCallback(async (walletId: string, targetUid: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // 1. Remover do documento wallet (members.uid = deleteField)
      const walletRef = doc(db, 'wallets', walletId);
      await updateDoc(walletRef, {
        [`members.${targetUid}`]: deleteField()
      });
      
      // 2. Tentar remover o walletId do membro também (pode falhar se regras de segurança não permitirem)
      try {
         const memberRef = doc(db, 'members', targetUid);
         await updateDoc(memberRef, { walletId: deleteField() });
      } catch (memberErr) {
         console.warn("Membro removido da carteira, mas sem permissão para limpar o perfil do alvo:", memberErr);
      }
      
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberRole = useCallback(async (walletId: string, targetUid: string, role: 'admin' | 'observer'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const walletRef = doc(db, 'wallets', walletId);
      await updateDoc(walletRef, {
        [`members.${targetUid}.role`]: role
      });
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWalletName = useCallback(async (walletId: string, newName: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const walletRef = doc(db, 'wallets', walletId);
      await updateDoc(walletRef, { name: newName });
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkWalletExists,
    verifyWalletCode,
    fetchWalletData,
    removeMemberFromWallet,
    updateMemberRole,
    updateWalletName,
    loading,
    error,
  };
}
