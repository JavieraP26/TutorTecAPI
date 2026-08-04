/**
 * DurationPicker — selector de duración preferida de lección: 5 / 8 / 12 minutos.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const OPTIONS = [
  { value: 5, label: '5 min', description: 'Rápido' },
  { value: 8, label: '8 min', description: 'Normal' },
  { value: 12, label: '12 min', description: 'Completo' },
] as const;

interface Props {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export function DurationPicker({ value, onChange, disabled = false }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
            onPress={() => !disabled && onChange(opt.value)}
          >
            <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
              {opt.label}
            </Text>
            <Text style={[styles.chipDesc, active && styles.chipDescActive]}>
              {opt.description}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.gray200,
    backgroundColor: colors.gray100,
    gap: 2,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipDisabled: { opacity: 0.55 },
  chipLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  chipLabelActive: { color: colors.primary },
  chipDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  chipDescActive: { color: colors.textSecondary },
});
