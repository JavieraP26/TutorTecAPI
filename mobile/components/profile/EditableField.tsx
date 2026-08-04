/**
 * EditableField — fila de perfil editable inline.
 * Muestra valor en modo lectura; al tocar "Editar" cambia a TextInput.
 * Confirma con ✓ o cancela con ✕.
 */
import { useRef, useState } from 'react';
import {
  ActivityIndicator, Pressable, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface Props {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  maxLength?: number;
  onSave: (value: string) => Promise<void>;
}

export function EditableField({
  label,
  value,
  placeholder = '—',
  keyboardType = 'default',
  maxLength,
  onSave,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  function startEdit() {
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function cancel() {
    setEditing(false);
    setDraft(value);
  }

  async function confirm() {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.row}>
      <View style={styles.labelCol}>
        <Text style={styles.label}>{label}</Text>
      </View>

      {editing ? (
        <View style={styles.editRow}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            style={styles.input}
            keyboardType={keyboardType}
            maxLength={maxLength}
            autoCapitalize={keyboardType === 'default' ? 'words' : 'none'}
            returnKeyType="done"
            onSubmitEditing={confirm}
          />
          {saving ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.action} />
          ) : (
            <>
              <Pressable style={styles.action} onPress={confirm}>
                <Text style={styles.confirmIcon}>✓</Text>
              </Pressable>
              <Pressable style={styles.action} onPress={cancel}>
                <Text style={styles.cancelIcon}>✕</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : (
        <View style={styles.valueRow}>
          <Text style={[styles.value, !value && styles.valuePlaceholder]}>
            {value || placeholder}
          </Text>
          <Pressable onPress={startEdit} hitSlop={12}>
            <Text style={styles.editBtn}>Editar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    gap: spacing.sm,
    minHeight: 56,
  },
  labelCol: { width: 96 },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  valueRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    flex: 1,
  },
  valuePlaceholder: { color: colors.textMuted },
  editBtn: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  action: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmIcon: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  cancelIcon: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
});
