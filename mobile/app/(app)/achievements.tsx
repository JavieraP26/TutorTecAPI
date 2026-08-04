import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AchievementBadge } from '@/components/journey/AchievementBadge';
import { useAchievements } from '@/hooks/useAchievements';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

export default function AchievementsScreen() {
  const { achievements, loading, error } = useAchievements();

  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);
  const pct = achievements.length > 0 ? Math.round((earned.length / achievements.length) * 100) : 0;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Logros</Text>
        <Text style={styles.subtitle}>Cada uno cuenta tu historia</Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudieron cargar los logros.</Text>
        </View>
      )}

      {!loading && !error && (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Resumen */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{earned.length}</Text>
                <Text style={styles.summaryLabel}>desbloqueados</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{locked.length}</Text>
                <Text style={styles.summaryLabel}>por descubrir</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>{pct}%</Text>
                <Text style={styles.summaryLabel}>completado</Text>
              </View>
            </View>
            {pct >= 85 && (
              <Text style={styles.graduationHint}>
                🎓 ¡Puedes graduarte cuando quieras — ve a Mi Camino!
              </Text>
            )}
          </View>

          {/* Desbloqueados */}
          {earned.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ Desbloqueados ({earned.length})</Text>
              <View style={styles.grid}>
                {earned.map((a) => (
                  <AchievementBadge key={a.id} achievement={a} />
                ))}
              </View>
            </View>
          )}

          {/* Bloqueados */}
          {locked.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔒 Por descubrir ({locked.length})</Text>
              <View style={styles.grid}>
                {locked.map((a) => (
                  <AchievementBadge key={a.id} achievement={a} />
                ))}
              </View>
            </View>
          )}

          {achievements.length === 0 && (
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>
                Completa tu primera lección para desbloquear logros
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['4xl'],
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  errorText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.error },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: colors.border },
  summaryValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    color: colors.textPrimary,
  },
  summaryLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  graduationHint: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    textAlign: 'center',
  },
  section: { gap: spacing.md },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emptyEmoji: { fontSize: 52, marginBottom: spacing.md },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
