/**
 * AchievementBadge — muestra un logro individual.
 * Desbloqueado: color + emoji + label.
 * Bloqueado: escala de grises + candado.
 */
import { StyleSheet, Text, View } from 'react-native';
import type { Achievement, TriggerType } from '@/hooks/useAchievements';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const AREA_EMOJI: Record<string, string> = {
  comunicacion: '💬',
  banca: '🏦',
  seguridad: '🛡️',
  gobierno: '🏛️',
  mi_telefono: '📱',
};

const AREA_LABEL: Record<string, string> = {
  comunicacion: 'Comunicación',
  banca: 'Banca',
  seguridad: 'Seguridad',
  gobierno: 'Trámites',
  mi_telefono: 'Mi Teléfono',
};

function badgeEmoji(trigger: TriggerType, area: string | null): string {
  if (trigger === 'assessment_complete') return '📋';
  if (trigger === 'lesson_count') return '📚';
  if (area) return AREA_EMOJI[area] ?? '⭐';
  return '🏆';
}

function badgeLabel(trigger: TriggerType, area: string | null, threshold: number): string {
  if (trigger === 'assessment_complete') return 'Evaluación inicial';
  if (trigger === 'lesson_count') return threshold === 1 ? '1 lección completada' : `${threshold} lecciones completadas`;
  if (trigger === 'area_first') return `Inicio en ${AREA_LABEL[area ?? ''] ?? area ?? ''}`;
  if (trigger === 'area_complete') return `${AREA_LABEL[area ?? ''] ?? area ?? ''} completada`;
  return 'Logro';
}

interface Props {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: Props) {
  const { trigger_type, content_area, threshold, earned } = achievement;
  const emoji = badgeEmoji(trigger_type, content_area);
  const label = badgeLabel(trigger_type, content_area, threshold);

  return (
    <View style={[styles.badge, !earned && styles.badgeLocked]}>
      <View style={[styles.iconBox, !earned && styles.iconBoxLocked]}>
        <Text style={styles.emoji}>{earned ? emoji : '🔒'}</Text>
      </View>
      <Text style={[styles.label, !earned && styles.labelLocked]} numberOfLines={2}>
        {label}
      </Text>
      {earned && <View style={styles.earnedDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: '47%',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeLocked: {
    backgroundColor: colors.gray100,
    borderColor: colors.gray200,
  },
  iconBox: {
    width: 56, height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBoxLocked: {
    backgroundColor: colors.gray200,
  },
  emoji: { fontSize: 28 },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  labelLocked: { color: colors.textMuted },
  earnedDot: {
    width: 8, height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
