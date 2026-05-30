export type MemberRole = 'admin' | 'observer';

export type MemberStatus = 'active' | 'inactive';

export type AccountType = 'currentAccount' | 'savingsAccount' | 'investmentAccount';

export type CardType = 'credit_card' | 'debit_card';

export type SubscriptionStatus = 'active' | 'inactive';

export type SubscriptionPlan = 'free' | 'premium';

export interface MemberProfile {
  birthdate: Date; // when was born
  name: string; // name of the user
  photoUrl?: string; // photo url of the user
};

export interface MemberSubscription {
  status: SubscriptionStatus; // status of the subscription
  plan: SubscriptionPlan; // plan of the subscription

  startedAt?: Date; // when subscription started
  expiresAt?: Date; // when subscription expires
};

export interface MemberFinanceAccount {
  id: string; // account id
  name: string; // account name
  type: AccountType; // type of the account
  closedAt?: Date; // when the account was closed
  cards: Record<string,
    {
      name: string; // card name
      type: CardType; // type of the card
      issuer: string; // card issuer 
      last4Digits: string; // last 4 digits of the card
      closedAt?: Date; // when the card was closed
    }
  >; // cards of the user
};

export interface MemberFinance {
  accounts?: Record<string, MemberFinanceAccount>; // accounts of the user
};

export interface MemberData {
  walletId?: string;

  createdAt: Date; // when was created

  lastLoginAt?: Date; // when was last logged in

  profile: MemberProfile;

  subscription?: MemberSubscription;

  finance?: {
    accounts?: Record<string, // id
      MemberFinanceAccount
    >; // accounts of the user
  };
};
