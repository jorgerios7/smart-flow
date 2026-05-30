import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Switch, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeMode } from '../../../../../../../hooks/useThemeMode';
import { useSettings } from '../../../../../../../hooks/useSettings';
import { themeColors } from '../../../../../../../theme/colors';
import { styles } from './styles';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModalt({ visible, onClose }: Props) {
  const { isDark } = useThemeMode();
  const colors = isDark ? themeColors.dark : themeColors.light;
  const { settings, updateSetting } = useSettings();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const renderSectionHeader = (title: string) => (
    <Text style={[styles.sectionTitle, { color: colors.primary }]}>{title}</Text>
  );

  const renderRow = (
    icon: string,
    color: string,
    title: string,
    subtitle?: string,
    rightContent?: React.ReactNode,
    isLast: boolean = false,
    options?: { label: string; value: string | number }[],
    selectedValue?: string | number,
    onSelect?: (value: any) => void
  ) => {
    const isExpanded = expandedRow === title;

    return (
      <View style={{ borderBottomColor: isLast && !isExpanded ? 'transparent' : colors.border, borderBottomWidth: isLast && !isExpanded ? 0 : 1 }}>
        <TouchableOpacity
          activeOpacity={options ? 0.6 : 0.8}
          style={[styles.row, { borderBottomWidth: 0 }]}
          onPress={() => {
            if (options) {
              setExpandedRow(isExpanded ? null : title);
            }
          }}
        >
          <View style={styles.rowContent}>
            <View style={[styles.rowIconContainer, { backgroundColor: `${color}20` }]}>
              <Ionicons name={icon as any} size={18} color={color} />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
              {subtitle && <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
            </View>
          </View>
          <View>{rightContent}</View>
        </TouchableOpacity>

        {isExpanded && options && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4 }}>
            {options.map((option, index) => {
              const isSelected = selectedValue === option.value;
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: isSelected ? `${color}15` : 'transparent',
                    marginBottom: 4,
                  }}
                  onPress={() => {
                    if (onSelect) onSelect(option.value);
                    setExpandedRow(null);
                  }}
                >
                  <Text style={{ color: isSelected ? color : colors.text, fontSize: 14, fontWeight: isSelected ? '600' : '400' }}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color={color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderSelector = (value: string, isExpanded: boolean = false) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.rowValue, { color: colors.textMuted }]}>{value}</Text>
      <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
    </View>
  );

  const renderToggle = (value: boolean, onValueChange: (val: boolean) => void) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={'#FFF'}
    />
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background, shadowColor: colors.primary, shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={28} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.section}>
            {renderSectionHeader('Preferências Gerais')}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {renderRow('home-outline', colors.primary, 'Aba Inicial', 'Transações ao invés de Dashboards', renderToggle(settings.startInTransactions, (val) => updateSetting('startInTransactions', val)))}
              {renderRow(
                'cash-outline',
                '#2ecc71',
                'Moeda Ativa',
                undefined,
                renderSelector(settings.activeCurrency, expandedRow === 'Moeda Ativa'),
                true,
                [
                  { label: 'BRL (R$)', value: 'BRL (R$)' },
                  { label: 'USD ($)', value: 'USD ($)' },
                  { label: 'EUR (€)', value: 'EUR (€)' }
                ],
                settings.activeCurrency,
                (val) => updateSetting('activeCurrency', val)
              )}
            </View>
          </View>

          <View style={styles.section}>
            {renderSectionHeader('Notificações e Alertas')}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {renderRow('notifications-outline', colors.error, 'Alerta de Vencimento', 'Avisar sobre contas a vencer', renderToggle(settings.dueDateAlert, (val) => updateSetting('dueDateAlert', val)))}
              {renderRow(
                'time-outline',
                '#f1c40f',
                'Antecedência do Alerta',
                undefined,
                renderSelector(settings.alertAdvanceDays === 0 ? 'No dia' : `${settings.alertAdvanceDays} dias antes`, expandedRow === 'Antecedência do Alerta'),
                false,
                [
                  { label: 'No dia', value: 0 },
                  { label: '1 dia antes', value: 1 },
                  { label: '3 dias antes', value: 3 },
                  { label: '7 dias antes', value: 7 }
                ],
                settings.alertAdvanceDays,
                (val) => updateSetting('alertAdvanceDays', val)
              )}
              {renderRow(
                'chatbubbles-outline',
                '#3498db',
                'Canais de Alerta',
                undefined,
                renderSelector(settings.alertChannels, expandedRow === 'Canais de Alerta'),
                false,
                [
                  { label: 'Push', value: 'Push' },
                  { label: 'Email', value: 'Email' },
                  { label: 'Push & Email', value: 'Push & Email' }
                ],
                settings.alertChannels,
                (val) => updateSetting('alertChannels', val)
              )}
              {renderRow('pie-chart-outline', colors.secondary, 'Resumo Financeiro', 'Balanço semanal/mensal', renderToggle(settings.financialSummary, (val) => updateSetting('financialSummary', val)), true)}
            </View>
          </View>

          <View style={styles.section}>
            {renderSectionHeader('Privacidade e Segurança')}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {renderRow('eye-off-outline', '#95a5a6', 'Ocultar Saldos', 'Ocultar ao abrir o app', renderToggle(settings.hideBalances, (val) => updateSetting('hideBalances', val)))}
              {renderRow('finger-print-outline', colors.primary, 'Autenticação Biométrica', 'Exigir FaceID/TouchID', renderToggle(settings.biometricAuth, (val) => updateSetting('biometricAuth', val)), true)}
            </View>
          </View>

          <View style={styles.section}>
            {renderSectionHeader('Sobre')}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {renderRow('help-circle-outline', colors.textMuted, 'Central de Ajuda', undefined, <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />)}
              {renderRow('document-text-outline', colors.textMuted, 'Termos de Uso', undefined, <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />, true)}
            </View>
          </View>

        </ScrollView>
      </View>
    </Modal>
  );
}
