import { useState } from 'react';
import {
  ActivityIndicator, Alert, Pressable,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useJourney } from '@/hooks/useJourney';
import api from '@/lib/api';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const AREA_LABEL: Record<string, string> = {
  comunicacion: '💬 Comunicación',
  banca: '🏦 Banca',
  seguridad: '🛡️ Seguridad',
  gobierno: '🏛️ Trámites',
  mi_telefono: '📱 Mi Teléfono',
};

const STAGE_LABEL: Record<string, { label: string; color: string; emoji: string }> = {
  onboarding: { label: 'Comenzando', color: colors.gray400, emoji: '🌱' },
  learning: { label: 'Aprendiendo', color: colors.primary, emoji: '📚' },
  practicing: { label: 'Practicando', color: colors.success, emoji: '⭐' },
  graduating: { label: 'Listo para graduarse', color: '#f59e0b', emoji: '🎓' },
  graduated: { label: 'Graduado/a', color: colors.success, emoji: '🏆' },
};

interface GraduationResponse {
  summary_id: string;
  file_url: string;
  achievement_pct: number;
  total_lessons_completed: number;
  total_active_days: number;
}

export default function JourneyScreen() {
  const { data, loading, error } = useJourney();
  const [graduating, setGraduating] = useState(false);
  const [graduated, setGraduated] = useState(false);

  const stage = data ? (STAGE_LABEL[data.stage] ?? STAGE_LABEL.learning) : null;

  async function handleGraduate() {
    Alert.alert(
      '🎓 Graduarte',
      '¿Quieres obtener tu certificado de graduación ahora? Siempre puedes seguir aprendiendo después.',
      [
        { text: 'Seguir aprendiendo', style: 'cancel' },
        {
          text: 'Graduarme ahora',
          onPress: async () => {
            setGraduating(true);
            try {
              await api.post<GraduationResponse>('/users/me/graduate');
              setGraduated(true);
              Alert.alert(
                '🏆 ¡Felicitaciones!',
                'Tu certificado de graduación está listo. ¡Lo lograste!',
                [{ text: '¡Gracias!', onPress: () => router.back() }],
              );
            } catch (e: unknown) {
              const msg =
                e && typeof e === 'object' && 'response' in e &&
                (e as { response?: { status?: number } }).response?.status === 409
                  ? 'Ya obtuviste tu certificado de graduación.'
                  : 'Ocurrió un problema. Intenta de nuevo más tarde.';
              Alert.alert('Error', msg);
            } finally {
              setGraduating(false);
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Camino</Text>
        <Text style={styles.subtitle}>Tu progreso de aprendizaje</Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudo cargar tu progreso.</Text>
        </View>
      )}

      {!loading && !error && data && stage && (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Etapa actual */}
          <View style={[styles.stageCard, { borderColor: stage.color }]}>
            <Text style={styles.stageEmoji}>{stage.emoji}</Text>
            <View>
              <Text style={styles.stageLabel}>Etapa actual</Text>
              <Text style={[styles.stageName, { color: stage.color }]}>{stage.label}</Text>
            </View>
          </View>

          {/* Stats rápidas */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{data.total_lessons_completed}</Text>
              <Text style={styles.statLabel}>lecciones</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {data.achievement_pct}%
              </Text>
              <Text style={styles.statLabel}>logros</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{data.total_active_days}</Text>
              <Text style={styles.statLabel}>días activos</Text>
            </View>
          </View>

          {/* Progreso por área */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progreso por área</Text>
            <View style={styles.areasCard}>
              {Object.entries(data.areas_progress).map(([key, area]) => (
                <View key={key} style={styles.areaRow}>
                  <View style={styles.areaTop}>
                    <Text style={styles.areaLabel}>{AREA_LABEL[key] ?? key}</Text>
                    <Text style={styles.areaPct}>{area.pct_complete}%</Text>
                  </View>
                  <ProgressBar progress={area.pct_complete / 100} height={8} />
                  <Text style={styles.areaCount}>
                    {area.lessons_completed}/{area.total_lessons} lecciones
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Peticiones comunitarias */}
          {data.pending_voted_requests > 0 && (
            <Pressable
              style={styles.requestsBanner}
              onPress={() => router.push('/(app)/requests' as any)}
            >
              <Text style={styles.requestsBannerText}>
                🗳️ {data.pending_voted_requests} petición{data.pending_voted_requests !== 1 ? 'es' : ''} que apoyaste están en progreso
              </Text>
              <Text style={styles.requestsLink}>Ver peticiones ›</Text>
            </Pressable>
          )}

          {/* Bloque de graduación */}
          {(data.ready_to_graduate || graduated) && data.stage !== 'graduated' && !graduated && (
            <View style={styles.graduationCard}>
              <Text style={styles.graduationEmoji}>🎓</Text>
              <Text style={styles.graduationTitle}>¡Puedes graduarte!</Text>
              <Text style={styles.graduationDesc}>
                Alcanzaste el {data.achievement_pct}% de logros. Puedes obtener tu
                certificado ahora o seguir aprendiendo hasta donde quieras.
                {'\n\n'}No hay apuro — el certificado te espera.
              </Text>
              <Pressable
                style={[styles.graduateBtn, graduating && styles.btnDisabled]}
                onPress={handleGraduate}
                disabled={graduating}
              >
                <Text style={styles.graduateBtnText}>
                  {graduating ? 'Procesando…' : 'Graduarme ahora 🎓'}
                </Text>
              </Pressable>
              <Pressable onPress={() => router.push('/(app)/academy' as any)}>
                <Text style={styles.keepLearningText}>Seguir aprendiendo primero →</Text>
              </Pressable>
            </View>
          )}

          {/* Ya graduado */}
          {(data.stage === 'graduated' || graduated) && (
            <View style={[styles.graduationCard, styles.graduatedCard]}>
              <Text style={styles.graduationEmoji}>🏆</Text>
              <Text style={styles.graduationTitle}>¡Felicitaciones, graduado/a!</Text>
              <Text style={styles.graduationDesc}>
                Obtuviste tu certificado. Puedes seguir usando TutorTec
                para aprender más cosas cuando quieras.
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
  stageCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 2, padding: spacing.md,
  },
  stageEmoji: { fontSize: 40 },
  stageLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  stageName: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1, backgroundColor: colors.surface,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, alignItems: 'center', gap: 2,
  },
  statValue: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  section: { gap: spacing.sm },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  areasCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, gap: spacing.md,
  },
  areaRow: { gap: 4 },
  areaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  areaLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  areaPct: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  areaCount: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  requestsBanner: {
    backgroundColor: colors.warningLight, borderRadius: radius.lg,
    padding: spacing.md, gap: spacing.xs,
    borderWidth: 1, borderColor: colors.warning,
  },
  requestsBannerText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: '#92400e',
  },
  requestsLink: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.warning,
  },
  graduationCard: {
    backgroundColor: colors.primaryLight, borderRadius: radius.lg,
    borderWidth: 2, borderColor: colors.primary,
    padding: spacing.lg, alignItems: 'center', gap: spacing.md,
  },
  graduatedCard: {
    backgroundColor: '#fff9c4',
    borderColor: '#f59e0b',
  },
  graduationEmoji: { fontSize: 52 },
  graduationTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
    textAlign: 'center',
  },
  graduationDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  graduateBtn: {
    width: '100%', height: 56,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.55 },
  graduateBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  keepLearningText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
