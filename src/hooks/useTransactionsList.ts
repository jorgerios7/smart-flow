import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useMemberData } from './useMemberData';
import { Transaction, TransactionInstallment } from '../types/wallet.types';

export interface DailyGroup {
  dateString: string; // 'YYYY-MM-DD'
  date: Date;
  balance: number;
  installments: EnrichedInstallment[];
}

export interface EnrichedInstallment extends TransactionInstallment {
  transaction: Transaction;
  memberName: string;
  cardName: string;
  bankName: string;
}

export function useTransactionsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [groupedTransactions, setGroupedTransactions] = useState<DailyGroup[]>([]);
  const [walletId, setWalletId] = useState<string>('');
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const nextMonth = () => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const prevMonth = () => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const { fetchMemberData } = useMemberData();
  const user = auth.currentUser;

  const rawDataRef = useRef({
    transactionsMap: {} as Record<string, Transaction>,
    installmentsMap: {} as Record<string, TransactionInstallment[]>,
    memberData: null as any,
    walletData: null as any
  });

  const selectedDateRef = useRef(selectedDate);
  useEffect(() => { selectedDateRef.current = selectedDate; }, [selectedDate]);

  const calculateGroups = useCallback(() => {
    const date = selectedDateRef.current;
    const { transactionsMap, installmentsMap, memberData, walletData } = rawDataRef.current;

    const resolveCardName = (cardId: string) => {
      if (memberData?.finance?.accounts) {
        for (const acc of Object.values(memberData.finance.accounts) as any[]) {
          if (acc.cards && acc.cards[cardId]) return acc.cards[cardId].name;
        }
      }
      return 'Cartão Desconhecido';
    };

    const resolveBankName = (accountId: string) => {
      if (memberData?.finance?.accounts && memberData.finance.accounts[accountId]) {
        return memberData.finance.accounts[accountId].name;
      }
      return 'Banco Desconhecido';
    };

    const resolveMemberName = (memberId: string) => {
      if (walletData?.members && walletData.members[memberId]) {
        return walletData.members[memberId].name;
      }
      return 'Membro Desconhecido';
    };

    const selYear = date.getFullYear();
    const selMonth = date.getMonth();

    const groupsMap: Record<string, DailyGroup> = {};

    Object.entries(transactionsMap).forEach(([txId, tx]) => {
      const installments = installmentsMap[txId] || [];

      installments.forEach(inst => {
        // Resolve dates
        let dueDate: Date;
        if (inst.dueDate) {
          dueDate = (inst.dueDate as any).toDate ? (inst.dueDate as any).toDate() : new Date(inst.dueDate);
        } else if (inst.createdAt) {
          dueDate = (inst.createdAt as any).toDate ? (inst.createdAt as any).toDate() : new Date(inst.createdAt);
        } else {
          dueDate = new Date();
        }

        // Filter by selected month
        if (dueDate.getFullYear() === selYear && dueDate.getMonth() === selMonth) {
          const dateString = dueDate.toISOString().split('T')[0]; // YYYY-MM-DD
          
          if (!groupsMap[dateString]) {
            groupsMap[dateString] = {
              dateString,
              date: dueDate,
              balance: 0,
              installments: []
            };
          }

          // Resolve additional info
          const cardId = inst.payment?.cardId || tx.purchase?.cardId;
          const accountId = inst.payment?.accountId || tx.purchase?.accountId;
          const memberId = inst.createdBy || tx.createdBy;

          const enrichedInst: EnrichedInstallment = {
            ...inst,
            dueDate,
            transaction: tx,
            memberName: memberId ? resolveMemberName(memberId) : 'Desconhecido',
            cardName: cardId ? resolveCardName(cardId) : '',
            bankName: accountId ? resolveBankName(accountId) : '',
          };

          groupsMap[dateString].installments.push(enrichedInst);

          // Calculate balance ONLY for paid installments on this day
          if (inst.status === 'paid') {
            const amount = inst.amount || 0;
            if (tx.type === 'income') {
              groupsMap[dateString].balance += amount;
            } else if (tx.type === 'expense') {
              groupsMap[dateString].balance -= amount;
            }
          }
        }
      });
    });

    // Convert map to array and sort by date descending
    const sortedGroups = Object.values(groupsMap).sort((a, b) => b.date.getTime() - a.date.getTime());

    // Sort installments within each group by createdAt descending
    sortedGroups.forEach(group => {
      group.installments.sort((a, b) => {
        const dateA = (a.createdAt as any)?.toDate ? (a.createdAt as any).toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = (b.createdAt as any)?.toDate ? (b.createdAt as any).toDate().getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    });

    setGroupedTransactions(sortedGroups);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      calculateGroups();
    }
  }, [selectedDate, calculateGroups]);

  useEffect(() => {
    let unsubscribeTransactions: () => void;
    const unsubscribeInstallments = new Map<string, () => void>();

    async function setupListener() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const memberData = await fetchMemberData(user.uid);
        if (!memberData || !memberData.walletId) {
          setLoading(false);
          return;
        }

        setWalletId(memberData.walletId);
        rawDataRef.current.memberData = memberData;

        const walletRef = doc(db, 'wallets', memberData.walletId);
        const walletSnap = await getDoc(walletRef);
        if (walletSnap.exists()) {
          rawDataRef.current.walletData = walletSnap.data();
        }

        const transactionsRef = collection(db, `wallets/${memberData.walletId}/transactions`);
        const q = query(transactionsRef, orderBy('createdAt', 'desc'));

        unsubscribeTransactions = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach(change => {
            const txId = change.doc.id;
            if (change.type === 'added' || change.type === 'modified') {
              rawDataRef.current.transactionsMap[txId] = change.doc.data() as Transaction;
               
              if (change.type === 'added') {
                const instRef = collection(db, `wallets/${memberData.walletId}/transactions/${txId}/installments`);
                const unsubInst = onSnapshot(instRef, (instSnap) => {
                  rawDataRef.current.installmentsMap[txId] = instSnap.docs.map(d => d.data() as TransactionInstallment);
                  calculateGroups();
                });
                unsubscribeInstallments.set(txId, unsubInst);
              }
            }
            if (change.type === 'removed') {
              delete rawDataRef.current.transactionsMap[txId];
              delete rawDataRef.current.installmentsMap[txId];
              const unsub = unsubscribeInstallments.get(txId);
              if (unsub) unsub();
              unsubscribeInstallments.delete(txId);
            }
          });
          calculateGroups();
        }, (err) => {
          console.error("Transactions list listener error:", err);
          setError(err);
          setLoading(false);
        });

      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribeTransactions) unsubscribeTransactions();
      unsubscribeInstallments.forEach(unsub => unsub());
    };
  }, [user, fetchMemberData, calculateGroups]);

  return { groupedTransactions, loading, error, selectedDate, nextMonth, prevMonth, walletId };
}
