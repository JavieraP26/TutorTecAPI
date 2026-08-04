import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StepIndicator } from '@/components/lesson/StepIndicator';
import { LessonStep } from '@/components/lesson/LessonStep';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import api from '@/lib/api';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface LessonDetail {
  id: string;
  title: string;
  description: string | null;
  content_area: string;
  module_type: string;
  duration_minutes: number;
  completion_pct: number;
  completed: boolean;
}

// Pasos genéricos del reproductor — el contenido real vendrá del CMS en fases futuras
const PLAYER_STEPS = [
  { label: 'Introducción' },
  { label: 'Práctica' },
  { label: 'Completado' },
];

const MODULE_EMOJI: Record<string, string> = {
  simulator: '🎮',
  guide: '📖',
  safety: '🛡️',
  procedure: '📋',
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<LessonDetail>(`/lessons/${id}`).then((r) => {
      setLesson(r.data);
      // Retomar desde donde dejó
      if (r.data.completion_pct >= 67) setStep(2);
      else if (r.data.completion_pct >= 33) setStep(1);
      // Registrar inicio si no había progreso
      if (r.data.completion_pct === 0 && !r.data.completed) {
        api.post(`/progress/${id}/start`).catch(() => {});
      }
    }).catch(() => router.back());
  }, [id]);

  async function handleNext() {
    if (!id || !lesson) return;
    const nextStep = step + 1;

    if (nextStep < PLAYER_STEPS.length - 1) {
      // Actualizar progreso intermedio
      const pct = nextStep === 1 ? 50 : 75;
      setSaving(true);
      await api.patch(`/progress/${id}`, { completion_pct: pct }).catch(() => {});
      setSaving(false);
      setStep(nextStep);
    } else {
      // Último paso → completar lección
      setSaving(true);
      try {
        const { data } = await api.post<{ newly_earned_achievements: string[] }>(
          `/progress/${id}/complete`
        );
        setStep(PLAYER_STEPS.length - 1);
        if (data.newly_earned_achievements.length > 0) {
          Alert.alert(
            '🏆 ¡Nuevo logro!',
            `Desbloqueaste: ${data.newly_earned_achievements.join(', ')}`,
            [{ text: '¡Genial!', onPress: () => router.back() }]
          );
        } else {
          Alert.alert('¡Lección completada!', 'Muy bien, ¡sigue así!', [
            { text: 'Continuar', onPress: () => router.back() },
          ]);
        }
      } catch {
        Alert.alert('Error', 'No se pudo registrar la lección. Intenta de nuevo.');
      } finally {
        setSaving(false);
      }
    }
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <Text style={styles.loading}>Cargando lección…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLastStep = step >= PLAYER_STEPS.length - 1;
  const progressValue = step / (PLAYER_STEPS.length - 1);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.headerProgress}>
          <ProgressBar progress={progressValue} height={6} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tipo y duración */}
        <View style={styles.meta}>
          <Text style={styles.moduleType}>
            {MODULE_EMOJI[lesson.module_type]} {lesson.duration_minutes} min
          </Text>
        </View>

        {/* Título */}
        <Text style={styles.title}>{lesson.title}</Text>

        {/* Indicador de pasos */}
        <View style={styles.steps}>
          <StepIndicator steps={PLAYER_STEPS} current={step} />
        </View>

        {/* Contenido del paso actual */}
        {step === 0 && (
          <LessonStep
            stepNumber={1}
            title="¿Qué aprenderás?"
            body={lesson.description ?? 'En esta lección aprenderás paso a paso de forma segura y sin apuro.'}
            emoji="👀"
          />
        )}
        {step === 1 && (
          <LessonStep
            stepNumber={2}
            title="¡Hora de practicar!"
            body="Sigue las instrucciones en pantalla. Si cometes un error, no pasa nada — puedes repetirlo las veces que quieras."
            emoji="🤝"
          />
        )}
        {step === 2 && (
          <LessonStep
            stepNumber={3}
            title="¡Lo lograste!"
            body="Completaste esta lección. Cada paso que das es un logro. ¡Estás haciendo un trabajo excelente!"
            emoji="🌟"
          />
        )}
      </ScrollView>

      {/* Botón de acción */}
      {!isLastStep && (
        <View style={styles.footer}>
          <Button
            label={step === PLAYER_STEPS.length - 2 ? 'Completar lección' : 'Siguiente'}
            onPress={handleNext}
            loading={saving}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: colors.textPrimary,
  },
  headerProgress: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleType: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    color: colors.textPrimary,
  },
  steps: {
    paddingVertical: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
