export type Role = 'admin' | 'observer'; // member role

export type Status = 'active' | 'inactive'; // member status

export type TransactionType = 'expense' | 'income'; // type of the transaction

export type TransactionStatus = 'pending' | 'paid'; // status of the transaction item

export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'pix' | 'bank_transfer'; // payment method

export type Frequency = 'weekly' | 'monthly' | 'yearly'; // frequency of the recurrence

export type ActionType = 'leave' | 'remove' | 'promote'; // action type

export interface WalletMemberData {
  id: string; // unique id of the wallet

  name: string; // name of the wallet

  role: Role // member role

  status: Status // member status

  photoURL?: string; // photo url of the member
}

export interface WalletData {

  id: string; // unique id of the wallet

  name: string; // name of the wallet

  createdAt: Date; // when was created

  createdBy: Date; // member id

  members: Record<string,
    WalletMemberData
  >; // members of the wallet
};

export interface TransactionRecurrence {
  endDate?: Date; // when the recurrence should end

  frequency: Frequency; // frequency of the recurrence

  interval?: number; // interval of the recurrence

  count?: number; // count of the recurrence

  lastGeneratedAt?: Date; // when was the last transaction item generated
};

export interface TransactionPurchase {
  instrument: PaymentMethod; // instrument of the transaction

  accountId: string; // account id

  amount: number; // amount of the transaction

  buyerId: string // member id

  buyerName: string // member name

  installmentNumber?: number // installment number

  cardId?: string; // card id
};

export interface Transaction {
  id: string; // unique id of the transaction

  type: TransactionType; // type of the transaction

  category: string; // category of the transaction

  name: string; // name of the transaction

  description?: string; // description of the transaction

  createdAt: Date; // when was created

  createdBy: string; // member id

  purchase?: TransactionPurchase;

  recurrence?: TransactionRecurrence;
}

export interface TransactionPayment {
  method: PaymentMethod; // payment method

  accountId?: string; // account id

  cardId?: string; // card id

  cardName?: string; // card name

  paidAt?: Date; // when it was paid

  payerId: string; // member id

  payerName: string; // member name

};

export interface TransactionInstallment {
  id: string;

  type: TransactionType; // type of the transaction

  category: string; // what kind of expense or income (e.g., "food", "transport", "salary")

  name: string; // name of the transaction

  transactionId: string; // transaction id

  createdAt: Date; // when was created

  createdBy: string; // member id

  amount: number; // how much it costs

  status: TransactionStatus; // status of the transaction item

  installmentIndex: number; // installment index

  dueDate: Date; // when it should be paid

  payment?: TransactionPayment; // payment of the transaction installment
};

export interface CreateTransactionParams {
  walletId: string;
  userId: string;
  type: TransactionType;
  category: string;
  name: string;
  instrument: PaymentMethod;
  amount: number;
  installmentNumber: number;
  description: string;
  cardId?: string;
  cardName?: string;
  accountId?: string;
  status: TransactionStatus;
  paidAt?: Date;
  payerName?: string;
  buyerName: string;
  dueDate: Date;
}
