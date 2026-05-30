import { TouchableOpacityProps, TextInputProps, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary';
  textStyle?: StyleProp<TextStyle>;
}

export interface InputProps extends TextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  isDate?: boolean;
}

export interface TextLinkProps extends TouchableOpacityProps {
  text: string;
  color?: 'primary' | 'secondary' | 'muted';
  fontSize?: number;
}

export interface ButtonBackProps {
  onNavigate: string;
  size?: number;
}

export interface LogoPlaceholderProps {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  dashed?: boolean;
}

export interface BottomNavigationProps {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
  onAddTransaction: () => void;
}

export type Tab = 'transactions' | 'dashboards' | 'members' | 'profile';

export type FinanceModalType = 'addAccount' | 'editAccount' | 'addCard' | 'editCard' | null;

export type EditModalType = 'name' | 'email' | 'password' | null;
