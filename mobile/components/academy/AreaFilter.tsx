import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ContentArea } from '@/hooks/useAcademy';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface AreaOption {
  value: ContentArea | null;
  label: string;
  emoji: string;
}

const AREAS: AreaOption[] = [
  { value: null, label: 'Todo', emoji: '📚' },
  { value: 'comunicacion', label: 'Comunicación', emoji: '💬' },
  { value: 'banca', label: 'Banco', emoji: '🏦' },
  { value: 'gobierno', label: 'Trámites', emoji: '🏛️' },
  { value: 'mi_telefono', label: 'Teléfono', emoji: '📱' },
  { value: 'seguridad', label: 'Seguridad', emoji: '🔒' },
];

interface Props {
  selected: ContentArea | null;
  onSelect: (area: ContentArea | null) => void;
}

export function AreaFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {AREAS.map((a) => {
        const active = selected === a.value;
        return (
          <Pressable
            key={a.label}
            onPress={() => onSelect(a.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={styles.emoji}>{a.emoji}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>
              {a.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
});
