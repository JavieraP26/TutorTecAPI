import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

export interface CurrentLesson {
  id: string;
  title: string;
  completion_pct: number;       // 0-100
  remaining_minutes?: number;
}

interface Props {
  lesson: CurrentLesson;
  onPress: () => void;
}

export function CurrentLessonCard({ lesson, onPress }: Props) {
  const progress = lesson.completion_pct / 100;

  return (
    <Card style={styles.card} padding="lg">
      <Text style={styles.label}>Continúa tu lección</Text>
      <Text style={styles.title} numberOfLines={2}>
        {lesson.title}
      </Text>

      <View style={styles.progressRow}>
        <Text style={styles.pct}>{lesson.completion_pct}% completado</Text>
        {lesson.remaining_minutes != null && (
          <Text style={styles.time}>
            {lesson.remaining_minutes} min restantes
          </Text>
        )}
      </View>

      <ProgressBar progress={progress} />

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      >
        <Text style={styles.btnText}>▶  Continuar</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    color: colors.textPrimary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pct: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  time: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.gray500,
  },
  btn: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  btnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textInverse,
  },
});
