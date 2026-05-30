import { useState, useCallback } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../config/firebase';

import { MemberData } from '../types/member.types';

export function useMemberData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemberData = useCallback(async (uid: string): Promise<MemberData | null> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);
      const memberSnap = await getDoc(memberRef);

      if (memberSnap.exists()) {
        return memberSnap.data() as MemberData;
      } else {
        return null;
      }
    } catch (err: any) {
      setError(err);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberProfile = useCallback(async (uid: string, data: { name?: string; email?: string; photoUrl?: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);
      const updateData: Record<string, any> = {};

      if (data.name !== undefined) updateData['profile.name'] = data.name;
      // Profile has birthDate, email, name, photoUrl.
      if (data.email !== undefined) updateData['profile.email'] = data.email;
      if (data.photoUrl !== undefined) updateData['profile.photoUrl'] = data.photoUrl;

      // Only update if there is data
      if (Object.keys(updateData).length > 0) {
        await updateDoc(memberRef, updateData);
      }
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMemberWalletId = useCallback(async (uid: string, walletId: string | null): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);

      if (walletId) {
        await updateDoc(memberRef, { walletId });
      } else {
        await updateDoc(memberRef, { walletId: deleteField() });
      }
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMemberAccount = useCallback(async (uid: string, accountId: string, accountData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);
      await updateDoc(memberRef, {
        [`finance.accounts.${accountId}`]: accountData
      });
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMemberAccount = useCallback(async (uid: string, accountId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);
      await updateDoc(memberRef, {
        [`finance.accounts.${accountId}`]: deleteField()
      });
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMemberCard = useCallback(async (uid: string, accountId: string, cardId: string, cardData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);
      await updateDoc(memberRef, {
        [`finance.accounts.${accountId}.cards.${cardId}`]: cardData
      });
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMemberCard = useCallback(async (uid: string, accountId: string, cardId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const memberRef = doc(db, 'members', uid);
      await updateDoc(memberRef, {
        [`finance.accounts.${accountId}.cards.${cardId}`]: deleteField()
      });
      return true;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchMemberData,
    updateMemberProfile,
    updateMemberWalletId,
    saveMemberAccount,
    deleteMemberAccount,
    saveMemberCard,
    deleteMemberCard,
    loading,
    error,
  };
}
