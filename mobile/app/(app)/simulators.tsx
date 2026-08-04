import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimulators } from '@/hooks/useSimulators';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const SLUG_EMOJI: Record<string, string> = {
  whatsapp: '💬',
  bancoestado: '🏦',
  claveunica: '🔑',
  correo: '📧',
};

const SLUG_COLOR: Record<string, string> = {
  whatsapp: '#e8f5e9',
  bancoestado: '#fff3e0',
  claveunica: '#e8eaf6',
  correo: '#e3f2fd',
};

const DIFFICULTY_LABEL = ['Básico', 'Intermedio', 'Avanzado'];

export default function SimulatorsScreen() {
  const { simulators, loading, error } = useSimulators();

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Simuladores</Text>
        <Text style={styles.subtitle}>Practica sin riesgo</Text>
      </View>

      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          🛟 Todo es ficticio — no hay dinero real ni datos reales
        </Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudo cargar los simuladores.</Text>
        </View>
      )}

      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {simulators.map((sim) => (
            <Pressable
              key={sim.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push(`/(app)/simulator/${sim.slug}` as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: SLUG_COLOR[sim.slug] ?? colors.primaryLight }]}>
                <Text style={styles.emoji}>{SLUG_EMOJI[sim.slug] ?? '📱'}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{sim.title}</Text>
                {sim.description && (
                  <Text style={styles.cardDesc} numberOfLines={2}>{sim.description}</Text>
                )}
                <Text style={styles.difficulty}>
                  {'●'.repeat(sim.difficulty)}{'○'.repeat(3 - sim.difficulty)}{' '}
                  {DIFFICULTY_LABEL[sim.difficulty - 1] ?? 'Básico'}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
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
  infoBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#fff9c4',
  },
  infoText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: '#5d4037',
    textAlign: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.error,
  },
  list: { padding: spacing.lg, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: { fontSize: 32 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textPrimary,
  },
  cardDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  difficulty: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 28,
    color: colors.textMuted,
  },
});
