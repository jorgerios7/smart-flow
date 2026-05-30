import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useThemeMode } from '../../hooks/useThemeMode';
import { themeColors } from '../../theme/colors';
import { globalStyles } from '../../styles/globalStyles';

interface ModalHeaderProps {
    title: string;
    subtitle?: string;
    onClose: () => void;
}

export default function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
    const { isDark } = useThemeMode();
    const colors = isDark ? themeColors.dark : themeColors.light;

    return (
        <View style={[globalStyles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.titleContainer}>
                <Text style={[globalStyles.modalTitle, { color: colors.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
            </View>

            <TouchableOpacity onPress={onClose} style={globalStyles.modalCloseButton}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
            </TouchableOpacity>
        </View>
    );
}