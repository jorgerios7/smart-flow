import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

interface DescriptionInputProps {
  description: string;
  onChangeDescription: (text: string) => void;
  onSave: () => void;
  canSave: boolean;
  colors: any;
}

export function DescriptionInput({
  description,
  onChangeDescription,
  onSave,
  canSave,
  colors,
}: DescriptionInputProps) {
  return (
    <View>
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="Ex: Compras do mês"
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={onChangeDescription}
      />

      {canSave && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.saveButton, { backgroundColor: colors.primary, marginTop: 16 }]}
          onPress={onSave}
        >
          <Text style={styles.saveButtonText}>Salvar Transação</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
