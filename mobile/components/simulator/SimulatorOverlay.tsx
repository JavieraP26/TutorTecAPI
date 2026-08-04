/**
 * SimulatorOverlay — instrucción flotante en la parte inferior.
 * Muestra el paso actual, el texto guiado y el contador de pasos.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface Props {
  step: number;
  totalSteps: number;
  instruction: string;
  hint?: string;
  onNext: () => void;
  nextLabel?: string;
  loading?: boolean;
}

export function SimulatorOverlay({
  step,
  totalSteps,
  instruction,
  hint,
  onNext,
  nextLabel = 'Siguiente ›',
  loading = false,
}: Props) {
  return (
    <View style={styles.overlay}>
      {/* Contador */}
      <View style={styles.counter}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
          />
        ))}
      </View>

      {/* Instrucción */}
      <Text style={styles.instruction}>{instruction}</Text>

      {hint && <Text style={styles.hint}>{hint}</Text>}

      {/* Botón de avance */}
      <Pressable
        onPress={onNext}
        disabled={loading}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed, loading && styles.btnDisabled]}
      >
        <Text style={styles.btnText}>{loading ? 'Guardando…' : nextLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  counter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray200,
  },
  dotActive: { backgroundColor: colors.primary, width: 20 },
  dotDone: { backgroundColor: colors.primaryMid },
  instruction: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  btn: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  btnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  btnDisabled: { opacity: 0.55 },
  btnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.white,
  },
});
