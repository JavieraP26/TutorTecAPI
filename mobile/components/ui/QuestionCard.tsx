import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface Option {
  value: number;
  label: string;
  emoji: string;
}

const OPTIONS: Option[] = [
  { value: 0, label: 'Nunca lo he hecho', emoji: '🙈' },
  { value: 1, label: 'Con ayuda de alguien', emoji: '🤝' },
  { value: 2, label: 'Solo, sin problema', emoji: '⭐' },
];

interface Props {
  question: string;
  selected: number | null;
  onSelect: (value: number) => void;
}

export function QuestionCard({ question, selected, onSelect }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.options}>
        {OPTIONS.map((opt) => {
          const active = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={({ pressed }) => [
                styles.option,
                active && styles.optionActive,
                pressed && !active && styles.optionPressed,
              ]}
            >
              <Text style={styles.emoji}>{opt.emoji}</Text>
              <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                {opt.label}
              </Text>
              {active && <View style={styles.checkDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
  },
  question: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    color: colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  options: {
    gap: spacing.md,
  },
  option: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionPressed: {
    opacity: 0.8,
  },
  emoji: {
    fontSize: 28,
  },
  optionLabel: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    color: colors.textPrimary,
  },
  optionLabelActive: {
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
