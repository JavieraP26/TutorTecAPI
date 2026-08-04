import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface Step {
  label: string;
}

interface Props {
  steps: Step[];
  current: number; // índice del paso activo (0-based)
}

export function StepIndicator({ steps, current }: Props) {
  return (
    <View style={styles.wrapper}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={i} style={styles.stepRow}>
            {/* Línea conectora arriba */}
            {i > 0 && (
              <View style={[styles.line, done && styles.lineDone]} />
            )}
            {/* Círculo */}
            <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
              <Text style={[styles.dotText, (done || active) && styles.dotTextActive]}>
                {done ? '✓' : `${i + 1}`}
              </Text>
            </View>
            {/* Label */}
            <Text style={[styles.label, active && styles.labelActive]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  stepRow: {
    alignItems: 'center',
    gap: 4,
  },
  line: {
    position: 'absolute',
    left: '-50%',
    right: '50%',
    height: 2,
    top: 18,
    backgroundColor: colors.border,
  },
  lineDone: {
    backgroundColor: colors.primary,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  dotDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dotText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  dotTextActive: {
    color: colors.primary,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 70,
  },
  labelActive: {
    fontFamily: fontFamily.bold,
    color: colors.primary,
  },
});
