import { useEffect, useState } from 'react';
import {
  Alert, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { router } from 'expo-router';
import { SimulatorShell } from '@/components/simulator/SimulatorShell';
import { SimulatorOverlay } from '@/components/simulator/SimulatorOverlay';
import { simulatorSession } from '@/hooks/useSimulators';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const ACCENT = '#1976d2'; // ClaveÚnica azul gobierno

const STEPS = [
  { instruction: 'Escribe tu RUN en el campo de arriba', hint: 'Ejemplo: 12.345.678-9 (sin puntos también funciona)' },
  { instruction: 'Ahora escribe tu contraseña en el campo de abajo', hint: 'Debe tener al menos 8 caracteres' },
  { instruction: 'Toca el botón azul "Ingresar con ClaveÚnica"', hint: 'Solo después de rellenar ambos campos' },
  { instruction: '🔑 ¡Perfecto! Así se ingresa a los servicios del Estado', hint: undefined },
];

type Screen = 'login' | 'success';

export default function ClaveUnicaSimulator() {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState('');
  const [password, setPassword] = useState('');
  const [screen, setScreen] = useState<Screen>('login');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    simulatorSession.start('claveunica')
      .then(({ data }) => setSessionId(data.id))
      .catch(() => {});
  }, []);

  async function advance() {
    if (!sessionId) return;
    const next = step + 1;

    if (step === 0 && !run.trim()) {
      Alert.alert('🪪', 'Escribe tu RUN para continuar');
      return;
    }
    if (step === 1 && password.length < 4) {
      Alert.alert('🔒', 'Escribe tu contraseña para continuar');
      return;
    }
    if (step === 2 && screen !== 'success') {
      Alert.alert('👆', 'Toca el botón "Ingresar con ClaveÚnica"');
      return;
    }

    setSaving(true);
    if (next >= STEPS.length) {
      await simulatorSession.complete(sessionId).catch(() => {});
      setSaving(false);
      Alert.alert('🏆 ¡Completado!', '¡Ya sabes ingresar con ClaveÚnica!', [
        { text: '¡Genial!', onPress: () => router.back() },
      ]);
    } else {
      await simulatorSession.update(sessionId, next).catch(() => {});
      setSaving(false);
      setStep(next);
    }
  }

  function formatRun(value: string) {
    // Remove non-numeric/dash, limit to RUN format
    const clean = value.replace(/[^\d\-kK]/g, '');
    setRun(clean);
    if (step === 0 && clean.length >= 4) setStep(0); // keeps step, triggers hint
  }

  const canLogin = run.trim().length >= 5 && password.length >= 4;

  return (
    <SimulatorShell title="ClaveÚnica" module="Trámites" accentColor={ACCENT}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {screen === 'login' && (
          <View style={styles.card}>
            {/* Logo gobierno */}
            <View style={[styles.govHeader, { backgroundColor: ACCENT }]}>
              <Text style={styles.govHeaderText}>🇨🇱 ClaveÚnica</Text>
              <Text style={styles.govSubText}>Acceso a servicios del Estado</Text>
            </View>

            <View style={styles.formBody}>
              <Text style={styles.formTitle}>Ingresa con tu ClaveÚnica</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>RUN</Text>
                <TextInput
                  value={run}
                  onChangeText={formatRun}
                  placeholder="Ej: 12345678-9"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, step >= 0 && styles.inputActive]}
                  keyboardType="default"
                  autoCapitalize="none"
                  editable={step === 0}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Contraseña</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Tu contraseña"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, step >= 1 && styles.inputActive]}
                  secureTextEntry
                  editable={step === 1 || step === 2}
                />
              </View>

              <Pressable
                style={[
                  styles.loginBtn,
                  { backgroundColor: ACCENT },
                  (!canLogin || step < 2) && styles.btnDisabled,
                ]}
                onPress={() => {
                  if (canLogin && step === 2) setScreen('success');
                }}
              >
                <Text style={styles.loginBtnText}>Ingresar con ClaveÚnica</Text>
              </Pressable>

              <Text style={styles.helpText}>
                ¿Olvidaste tu contraseña?{' '}
                <Text style={[styles.helpLink, { color: ACCENT }]}>Recupérala aquí</Text>
              </Text>
            </View>
          </View>
        )}

        {screen === 'success' && (
          <View style={styles.card}>
            <View style={[styles.govHeader, { backgroundColor: ACCENT }]}>
              <Text style={styles.govHeaderText}>🇨🇱 ClaveÚnica</Text>
              <Text style={styles.govSubText}>Sesión iniciada</Text>
            </View>

            <View style={styles.successBody}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>¡Bienvenido/a!</Text>
              <Text style={styles.successRun}>RUN: {run}</Text>
              <Text style={styles.successDesc}>
                Has ingresado correctamente.{'\n'}
                Desde aquí puedes acceder al SII, ChileAtiende,
                Registro Civil y más servicios del Estado.
              </Text>

              <View style={styles.servicesRow}>
                {['SII', 'ChileAtiende', 'Comisaría Virtual'].map((s) => (
                  <View key={s} style={[styles.serviceChip, { borderColor: ACCENT }]}>
                    <Text style={[styles.serviceChipText, { color: ACCENT }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 ClaveÚnica es gratuita y la entrega el Registro Civil.
            Con ella accedes a más de 500 trámites en línea.
          </Text>
        </View>
      </ScrollView>

      <SimulatorOverlay
        step={step}
        totalSteps={STEPS.length}
        instruction={STEPS[step].instruction}
        hint={STEPS[step].hint}
        onNext={advance}
        nextLabel={step >= STEPS.length - 1 ? 'Finalizar' : 'Siguiente ›'}
        loading={saving}
      />
    </SimulatorShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  govHeader: {
    padding: spacing.md,
    gap: 4,
    alignItems: 'center',
  },
  govHeaderText: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: colors.white },
  govSubText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.white, opacity: 0.9 },
  formBody: { padding: spacing.lg, gap: spacing.md },
  formTitle: {
    fontFamily: fontFamily.bold, fontSize: fontSize.xl,
    color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs,
  },
  fieldGroup: { gap: spacing.xs },
  fieldLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  input: {
    height: 52, backgroundColor: colors.gray100,
    borderRadius: radius.md, paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary,
    borderWidth: 2, borderColor: 'transparent',
  },
  inputActive: { borderColor: colors.primary },
  loginBtn: {
    height: 56, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.xs,
  },
  btnDisabled: { opacity: 0.4 },
  loginBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.white },
  helpText: {
    fontFamily: fontFamily.regular, fontSize: fontSize.sm,
    color: colors.textSecondary, textAlign: 'center',
  },
  helpLink: { fontFamily: fontFamily.medium },
  successBody: {
    padding: spacing.lg, alignItems: 'center', gap: spacing.md,
  },
  successIcon: { fontSize: 52 },
  successTitle: {
    fontFamily: fontFamily.bold, fontSize: fontSize['2xl'],
    color: colors.textPrimary,
  },
  successRun: {
    fontFamily: fontFamily.medium, fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  successDesc: {
    fontFamily: fontFamily.regular, fontSize: fontSize.base,
    color: colors.textSecondary, textAlign: 'center',
    lineHeight: 22,
  },
  servicesRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center',
  },
  serviceChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.full, borderWidth: 1.5,
  },
  serviceChipText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm },
  infoBox: {
    backgroundColor: '#e3f2fd', borderRadius: radius.md,
    padding: spacing.md,
  },
  infoText: {
    fontFamily: fontFamily.regular, fontSize: fontSize.sm,
    color: '#1565c0', lineHeight: 20,
  },
});
