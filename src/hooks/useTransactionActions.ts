import { useState } from 'react';
import { collection, doc, writeBatch, getDocs, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { TransactionInstallment, TransactionPayment, Transaction, CreateTransactionParams } from '../types/wallet.types';



export function useTransactionActions() {
  const [isSaving, setIsSaving] = useState(false);

  const createTransaction = async (params: CreateTransactionParams): Promise<boolean> => {
    setIsSaving(true);
    try {
      const {
        walletId,
        userId,
        type,
        category,
        name,
        instrument,
        amount,
        installmentNumber,
        description,
        dueDate,
        cardId,
        cardName,
        accountId,
        status,
        paidAt,
        payerName,
        buyerName
      }: CreateTransactionParams = params;
      const batch = writeBatch(db);

      // Create transaction doc ref
      const transactionRef = doc(collection(db, `wallets/${walletId}/transactions`));
      const transactionId = transactionRef.id;

      const now = new Date();

      const transactionData: Transaction = {
        id: transactionId,
        category,
        name,
        createdAt: now,
        createdBy: userId,
        description,
        type,
        purchase: {
          instrument,
          accountId: accountId || '',
          amount,
          installmentNumber,
          buyerId: userId,
          buyerName: buyerName || '',
          ...(cardId ? { cardId } : {}),
        },
      };

      batch.set(transactionRef, transactionData);

      // Calculate installments
      const baseAmount = Math.floor((amount / installmentNumber) * 100) / 100;
      const remainder = Math.round((amount - baseAmount * installmentNumber) * 100) / 100;

      for (let i = 0; i < installmentNumber; i++) {
        const instAmount = i === 0 ? baseAmount + remainder : baseAmount;

        // Increment month for each installment
        const instDueDate = new Date(dueDate);
        instDueDate.setMonth(instDueDate.getMonth() + i);

        const installmentRef = doc(collection(db, `wallets/${walletId}/transactions/${transactionId}/installments`));

        const installmentData: TransactionInstallment = {
          id: installmentRef.id,
          type,
          name,
          category,
          transactionId,
          createdAt: now,
          createdBy: userId,
          amount: parseFloat(instAmount.toFixed(2)),
          status: status,
          installmentIndex: i + 1,
          dueDate: instDueDate,
          ...(status === 'paid' ? {
            payment: {
              method: instrument ? instrument : null,
              accountId: accountId ? accountId : null,
              cardId: cardId ? cardId : null,
              cardName: cardName ? cardName : null,
              paidAt: paidAt || now,
              payerId: userId,
              payerName: payerName || ''
            } as TransactionPayment
          } : {})
        };

        batch.set(installmentRef, installmentData);
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const payInstallment = async (
    walletId: string, 
    transactionId: string, 
    installmentId: string, 
    paymentData: TransactionPayment
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const installmentRef = doc(db, `wallets/${walletId}/transactions/${transactionId}/installments/${installmentId}`);
      await updateDoc(installmentRef, {
        status: 'paid',
        payment: paymentData
      });
      return true;
    } catch (error) {
      console.error('Error paying installment:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTransaction = async (walletId: string, transactionId: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const batch = writeBatch(db);
      
      // Delete all installments
      const installmentsRef = collection(db, `wallets/${walletId}/transactions/${transactionId}/installments`);
      const installmentsSnap = await getDocs(installmentsRef);
      installmentsSnap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      // Delete transaction
      const transactionRef = doc(db, `wallets/${walletId}/transactions/${transactionId}`);
      batch.delete(transactionRef);

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteInstallment = async (walletId: string, transactionId: string, installmentId: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const installmentRef = doc(db, `wallets/${walletId}/transactions/${transactionId}/installments/${installmentId}`);
      await deleteDoc(installmentRef);
      return true;
    } catch (error) {
      console.error('Error deleting installment:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateTransaction = async (walletId: string, transactionId: string, data: Partial<Transaction>): Promise<boolean> => {
    setIsSaving(true);
    try {
      const transactionRef = doc(db, `wallets/${walletId}/transactions/${transactionId}`);
      await updateDoc(transactionRef, data);
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateInstallment = async (
    walletId: string, 
    transactionId: string, 
    installmentId: string, 
    data: Partial<TransactionInstallment>
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const installmentRef = doc(db, `wallets/${walletId}/transactions/${transactionId}/installments/${installmentId}`);
      await updateDoc(installmentRef, data);
      return true;
    } catch (error) {
      console.error('Error updating installment:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const createInstallment = async (
    walletId: string,
    transactionId: string,
    data: Omit<TransactionInstallment, 'id' | 'createdAt'>
  ): Promise<string | null> => {
    setIsSaving(true);
    try {
      const installmentRef = doc(collection(db, `wallets/${walletId}/transactions/${transactionId}/installments`));
      await setDoc(installmentRef, {
        ...data,
        id: installmentRef.id,
        createdAt: new Date()
      });
      return installmentRef.id;
    } catch (error) {
      console.error('Error creating installment:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const getTransactionInstallments = async (walletId: string, transactionId: string): Promise<TransactionInstallment[]> => {
    try {
      const installmentsRef = collection(db, `wallets/${walletId}/transactions/${transactionId}/installments`);
      const snap = await getDocs(installmentsRef);
      return snap.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          // format Firestore timestamps back to Date objects
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : new Date(data.dueDate),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          payment: data.payment ? {
            ...data.payment,
            paidAt: data.payment.paidAt?.toDate ? data.payment.paidAt.toDate() : (data.payment.paidAt ? new Date(data.payment.paidAt) : undefined)
          } : undefined
        } as TransactionInstallment;
      });
    } catch (error) {
      console.error('Error getting installments:', error);
      return [];
    }
  };

  const getTransaction = async (walletId: string, transactionId: string): Promise<Transaction | null> => {
    try {
      const transactionRef = doc(db, `wallets/${walletId}/transactions/${transactionId}`);
      const snap = await getDoc(transactionRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          ...data,
          id: snap.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        } as Transaction;
      }
      return null;
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  };

  const repeatInstallment = async (
    walletId: string, 
    transactionId: string, 
    previousInstallment: TransactionInstallment, 
    incrementType: '1_day' | '7_days' | '1_month',
    userId: string
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const batch = writeBatch(db);

      // Increment Due Date
      let prevDueDate: Date;
      if (previousInstallment.dueDate) {
        prevDueDate = (previousInstallment.dueDate as any).toDate ? (previousInstallment.dueDate as any).toDate() : new Date(previousInstallment.dueDate);
      } else {
        prevDueDate = new Date();
      }

      const newDueDate = new Date(prevDueDate);
      if (incrementType === '1_day') {
        newDueDate.setDate(newDueDate.getDate() + 1);
      } else if (incrementType === '7_days') {
        newDueDate.setDate(newDueDate.getDate() + 7);
      } else if (incrementType === '1_month') {
        newDueDate.setMonth(newDueDate.getMonth() + 1);
      }

      // Create new installment doc
      const newInstallmentRef = doc(collection(db, `wallets/${walletId}/transactions/${transactionId}/installments`));
      
      const newInstallmentData: TransactionInstallment = {
        ...previousInstallment,
        id: newInstallmentRef.id,
        status: 'pending',
        installmentIndex: previousInstallment.installmentIndex + 1,
        dueDate: newDueDate,
        createdAt: new Date(),
        createdBy: userId,
        payment: undefined // reset payment info
      };

      batch.set(newInstallmentRef, newInstallmentData);

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error repeating installment:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { 
    createTransaction, 
    payInstallment, 
    deleteTransaction, 
    deleteInstallment, 
    updateTransaction, 
    updateInstallment, 
    createInstallment,
    getTransactionInstallments, 
    getTransaction, 
    repeatInstallment, 
    isSaving 
  };
}
