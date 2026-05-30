import React, { useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useMemberData } from './useMemberData';

export interface CategoryMetric {
  category: string;
  total: number;
  percentage: number;
  color: string;
}

export interface InstrumentMetric {
  instrument: string;
  total: number;
  percentage: number;
  color: string;
}

export interface StatusMetric {
  status: string;
  total: number;
  percentage: number;
  color: string;
}

export interface CardMetric {
  cardName: string;
  total: number;
  percentage: number;
  color: string;
}

export interface BankMetric {
  bankName: string;
  total: number;
  percentage: number;
  color: string;
}

export interface MemberMetric {
  memberName: string;
  total: number;
  percentage: number;
  color: string;
}

export interface DashboardMetrics {
  overallBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  expenseByCategory: CategoryMetric[];
  expenseByInstrument: InstrumentMetric[];
  incomeByStatus: StatusMetric[];
  expenseByStatus: StatusMetric[];
  expenseByCard: CardMetric[];
  incomeByBank: BankMetric[];
  expenseByBank: BankMetric[];
  incomeByMember: MemberMetric[];
  expenseByMember: MemberMetric[];
  totalPaidCount: number;
  totalPendingCount: number;
  recentTransactions: any[];
}

const CATEGORY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#1ABC9C'
];

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const nextMonth = () => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const prevMonth = () => setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const { fetchMemberData } = useMemberData();
  const user = auth.currentUser;

  const rawDataRef = React.useRef({
    transactionsMap: {} as Record<string, any>,
    installmentsMap: {} as Record<string, any[]>,
    memberData: null as any,
    walletData: null as any
  });

  const selectedDateRef = React.useRef(selectedDate);
  React.useEffect(() => { selectedDateRef.current = selectedDate; }, [selectedDate]);

  const calculateMetrics = React.useCallback(() => {
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

    let overallIncomePaid = 0;
    let overallExpensePaid = 0;

    let monthlyIncome = 0;
    let monthlyExpense = 0;
    
    const expensesCatMap: Record<string, number> = {};
    const expensesInstMap: Record<string, number> = {};
    
    let incomeStatusMap = { paid: 0, pending: 0, overdue: 0 };
    let expenseStatusMap = { paid: 0, pending: 0, overdue: 0 };
    const expenseCardMap: Record<string, number> = {};
    
    const incomeBankMap: Record<string, number> = {};
    const expenseBankMap: Record<string, number> = {};
    const incomeMemberMap: Record<string, number> = {};
    const expenseMemberMap: Record<string, number> = {};

    let totalPaidCount = 0;
    let totalPendingCount = 0;

    const recent: any[] = [];

    const selYear = date.getFullYear();
    const selMonth = date.getMonth();

    Object.entries(transactionsMap).forEach(([txId, txData]) => {
      const type = txData.type;
      const category = txData.category || 'Outros';
      const instrument = txData.purchase?.instrument || 'unknown';
      const cardId = txData.purchase?.cardId;
      
      const installments = installmentsMap[txId] || [];
      let addedToRecent = false;

      installments.forEach(inst => {
        const amount = inst.amount || 0;
        const status = inst.status || 'pending';

        // Overall Balance (only PAID affects overall wallet reality)
        if (status === 'paid') {
           if (type === 'income') overallIncomePaid += amount;
           else if (type === 'expense') overallExpensePaid += amount;
        }

        let dueDate: Date | null = null;
        if (inst.payment?.dueDate) {
            dueDate = inst.payment.dueDate.toDate ? inst.payment.dueDate.toDate() : new Date(inst.payment.dueDate);
        } else if (inst.createdAt) {
            dueDate = inst.createdAt.toDate ? inst.createdAt.toDate() : new Date(inst.createdAt);
        }

        // Monthly filtering
        if (dueDate && dueDate.getFullYear() === selYear && dueDate.getMonth() === selMonth) {
            if (!addedToRecent) {
                recent.push({ id: txId, ...txData, dateToSort: dueDate });
                addedToRecent = true;
            }

            if (status === 'paid') totalPaidCount++;
            else totalPendingCount++;

            if (type === 'income') {
              monthlyIncome += amount;
              if (status === 'paid') incomeStatusMap.paid += amount;
              else if (status === 'overdue') incomeStatusMap.overdue += amount;
              else incomeStatusMap.pending += amount;
            } else if (type === 'expense') {
              monthlyExpense += amount;
              
              expensesCatMap[category] = (expensesCatMap[category] || 0) + amount;
              expensesInstMap[instrument] = (expensesInstMap[instrument] || 0) + amount;

              if (status === 'paid') expenseStatusMap.paid += amount;
              else if (status === 'overdue') expenseStatusMap.overdue += amount;
              else expenseStatusMap.pending += amount;

              if (instrument === 'credit_card' || instrument === 'debit_card') {
                const cardName = inst.payment?.cardName || (cardId ? resolveCardName(cardId) : 'Cartão Desconhecido');
                expenseCardMap[cardName] = (expenseCardMap[cardName] || 0) + amount;
              }
            }

            // Bank Map (for both Income and Expense)
            const accountId = inst.payment?.accountId || txData.purchase?.accountId;
            const bankName = accountId ? resolveBankName(accountId) : 'Não Informado';
            
            // Member Map (for both Income and Expense)
            const memberId = inst.createdBy || txData.createdBy;
            const memberName = memberId ? resolveMemberName(memberId) : 'Não Informado';

            if (type === 'income') {
                incomeBankMap[bankName] = (incomeBankMap[bankName] || 0) + amount;
                incomeMemberMap[memberName] = (incomeMemberMap[memberName] || 0) + amount;
            } else if (type === 'expense') {
                expenseBankMap[bankName] = (expenseBankMap[bankName] || 0) + amount;
                expenseMemberMap[memberName] = (expenseMemberMap[memberName] || 0) + amount;
            }
        }
      });
    });

    recent.sort((a, b) => b.dateToSort.getTime() - a.dateToSort.getTime());
    const recentTransactions = recent.slice(0, 5);

    const overallBalance = overallIncomePaid - overallExpensePaid;

    const mapToMetrics = (map: Record<string, number>, totalDivisor: number, offset: number) => {
       return Object.entries(map)
          .map(([key, total], index) => ({
            key,
            total,
            percentage: totalDivisor > 0 ? (total / totalDivisor) * 100 : 0,
            color: CATEGORY_COLORS[(index + offset) % CATEGORY_COLORS.length]
          }))
          .filter(item => item.total > 0)
          .sort((a, b) => b.total - a.total);
    };

    const expenseByCategory = mapToMetrics(expensesCatMap, monthlyExpense, 0).map(i => ({ ...i, category: i.key }));
    const expenseByInstrument = mapToMetrics(expensesInstMap, monthlyExpense, 5).map(i => ({ ...i, instrument: i.key }));
    const expenseByCard = mapToMetrics(expenseCardMap, monthlyExpense, 3).map(i => ({ ...i, cardName: i.key }));
    
    const incomeByBank = mapToMetrics(incomeBankMap, monthlyIncome, 2).map(i => ({ ...i, bankName: i.key }));
    const expenseByBank = mapToMetrics(expenseBankMap, monthlyExpense, 8).map(i => ({ ...i, bankName: i.key }));
    const incomeByMember = mapToMetrics(incomeMemberMap, monthlyIncome, 6).map(i => ({ ...i, memberName: i.key }));
    const expenseByMember = mapToMetrics(expenseMemberMap, monthlyExpense, 1).map(i => ({ ...i, memberName: i.key }));

    const mapStatus = (map: Record<string, number>, totalDivisor: number) => {
        return [
           { status: 'Pago', total: map.paid, percentage: totalDivisor > 0 ? (map.paid / totalDivisor) * 100 : 0, color: '#2ecc71' },
           { status: 'Pendente', total: map.pending, percentage: totalDivisor > 0 ? (map.pending / totalDivisor) * 100 : 0, color: '#f39c12' },
           { status: 'Atrasado', total: map.overdue, percentage: totalDivisor > 0 ? (map.overdue / totalDivisor) * 100 : 0, color: '#e74c3c' },
        ].filter(i => i.total > 0);
    };

    const incomeByStatus = mapStatus(incomeStatusMap, monthlyIncome);
    const expenseByStatus = mapStatus(expenseStatusMap, monthlyExpense);

    setMetrics({
      overallBalance,
      monthlyIncome,
      monthlyExpense,
      expenseByCategory,
      expenseByInstrument,
      incomeByStatus,
      expenseByStatus,
      expenseByCard,
      incomeByBank,
      expenseByBank,
      incomeByMember,
      expenseByMember,
      totalPaidCount,
      totalPendingCount,
      recentTransactions
    });
    setLoading(false);
  }, []);

  // Recalculate metrics when selectedDate changes (without re-fetching)
  React.useEffect(() => {
    if (!loading) {
      calculateMetrics();
    }
  }, [selectedDate, calculateMetrics]);

  React.useEffect(() => {
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
               rawDataRef.current.transactionsMap[txId] = change.doc.data();
               
               if (change.type === 'added') {
                  const instRef = collection(db, `wallets/${memberData.walletId}/transactions/${txId}/installments`);
                  const unsubInst = onSnapshot(instRef, (instSnap) => {
                      rawDataRef.current.installmentsMap[txId] = instSnap.docs.map(d => d.data());
                      calculateMetrics();
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
          calculateMetrics();
        }, (err) => {
          console.error("Dashboard listener error:", err);
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
  }, [user, fetchMemberData, calculateMetrics]);

  return { metrics, loading, error, selectedDate, nextMonth, prevMonth };
}
