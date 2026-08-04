import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { LessonSummary } from '@/hooks/useAcademy';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const AREA_EMOJI: Record<string, string> = {
  comunicacion: '💬',
  banca: '🏦',
  seguridad: '🔒',
  gobierno: '🏛️',
  mi_telefono: '📱',
};

const AREA_LABEL: Record<string, string> = {
  comunicacion: 'Comunicación',
  banca: 'Banco',
  seguridad: 'Seguridad',
  gobierno: 'Trámites',
  mi_telefono: 'Mi Teléfono',
};

interface Props {
  lesson: LessonSummary;
  onPress: () => void;
}

export function LessonCard({ lesson, onPress }: Props) {
  const progress = lesson.completion_pct / 100;

  return (
    <Pressable
      onPress={onPress}
      disabled={!lesson.is_available}
      style={({ pressed }) => [
        styles.card,
        !lesson.is_available && styles.locked,
        pressed && lesson.is_available && styles.pressed,
      ]}
    >
      {/* Área + duración */}
      <View style={styles.meta}>
        <Text style={styles.area}>
          {AREA_EMOJI[lesson.content_area]} {AREA_LABEL[lesson.content_area]}
        </Text>
        <Text style={styles.duration}>{lesson.duration_minutes} min</Text>
      </View>

      {/* Título */}
      <Text style={styles.title} numberOfLines={2}>
        {lesson.title}
      </Text>

      {/* Descripción */}
      {lesson.description && (
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description}
        </Text>
      )}

      {/* Progreso o estado */}
      {lesson.completed ? (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Completada</Text>
        </View>
      ) : lesson.completion_pct > 0 ? (
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} height={8} />
          <Text style={styles.progressLabel}>{lesson.completion_pct}% completado</Text>
        </View>
      ) : !lesson.is_available ? (
        <Text style={styles.lockedLabel}>🔒 Completa la lección anterior primero</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  locked: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  area: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  duration: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textSecondary,
  },
  progressWrapper: {
    gap: 4,
  },
  progressLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  completedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  completedText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  lockedLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
