import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import api from '@/lib/api';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

// Preguntas en lenguaje natural (paralelo al catálogo del backend)
const QUESTIONS = [
  { key: 'whatsapp_mensajes', text: '¿Puedes enviar un mensaje de WhatsApp?' },
  { key: 'whatsapp_fotos', text: '¿Puedes enviar una foto por WhatsApp?' },
  { key: 'videollamada', text: '¿Has hecho una videollamada?' },
  { key: 'banca_consulta', text: '¿Puedes consultar tu saldo en el banco desde el celular?' },
  { key: 'banca_transferencia', text: '¿Has hecho una transferencia bancaria con tu celular?' },
  { key: 'clave_unica', text: '¿Has usado tu ClaveÚnica para hacer un trámite?' },
  { key: 'tramites_web', text: '¿Has hecho algún trámite del Estado por internet?' },
  { key: 'guardar_archivos', text: '¿Puedes guardar una foto o un archivo en tu celular?' },
  { key: 'abrir_pdf', text: '¿Puedes abrir un archivo PDF en tu celular?' },
  { key: 'reconocer_estafa', text: '¿Sabes reconocer un mensaje o correo que parece sospechoso?' },
  { key: 'llamadas_sospechosas', text: '¿Sabes qué hacer si recibes una llamada que parece fraude?' },
] as const;

type QuestionKey = (typeof QUESTIONS)[number]['key'];

export default function AssessmentScreen() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionKey, number | null>>(
    () => Object.fromEntries(QUESTIONS.map((q) => [q.key, null])) as Record<QuestionKey, number | null>
  );
  const [loading, setLoading] = useState(false);

  const question = QUESTIONS[current];
  const selected = answers[question.key];
  const isLast = current === QUESTIONS.length - 1;
  const progress = (current + 1) / QUESTIONS.length;

  function handleSelect(value: number) {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1);
    else router.back();
  }

  async function handleNext() {
    if (selected === null) {
      Alert.alert('Elige una opción', 'Selecciona la que mejor describe tu experiencia.');
      return;
    }
    if (!isLast) {
      setCurrent((c) => c + 1);
      return;
    }
    // Última pregunta → enviar
    try {
      setLoading(true);
      await api.post('/assessment', {
        answers: QUESTIONS.map((q) => ({
          question_key: q.key,
          answer_value: answers[q.key] ?? 0,
        })),
      });
      router.replace('/(app)');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la evaluación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header con progreso */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress} height={8} />
        </View>
        <Text style={styles.counter}>{current + 1}/{QUESTIONS.length}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>Cuéntanos sobre ti</Text>
        <QuestionCard
          question={question.text}
          selected={selected}
          onSelect={handleSelect}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isLast ? 'Ver mis recomendaciones' : 'Siguiente'}
          onPress={handleNext}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
  progressWrapper: {
    flex: 1,
  },
  counter: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    width: 36,
    textAlign: 'right',
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.xl,
  },
  intro: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
