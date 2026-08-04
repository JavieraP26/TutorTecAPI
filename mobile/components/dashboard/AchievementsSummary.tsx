import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface Props {
  earned: number;
  total: number;
  onSeeAll: () => void;
}

export function AchievementsSummary({ earned, total, onSeeAll }: Props) {
  const progress = total > 0 ? earned / total : 0;
  const pct = Math.round(progress * 100);
  const remaining = total - earned;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Tus Logros</Text>
        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAll}>Ver todos ›</Text>
        </Pressable>
      </View>

      <Card style={styles.card} padding="lg">
        <View style={styles.row}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{earned}</Text>
            <Text style={styles.statLabel}>desbloqueados</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{remaining}</Text>
            <Text style={styles.statLabel}>por descubrir</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{pct}%</Text>
            <Text style={styles.statLabel}>completado</Text>
          </View>
        </View>

        <ProgressBar progress={progress} height={10} />

        {pct >= 85 && (
          <Text style={styles.hint}>
            🎓 ¡Ya puedes graduarte cuando quieras!
          </Text>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  seeAll: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.primary,
  },
  card: {
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  hint: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.primary,
    textAlign: 'center',
  },
});
