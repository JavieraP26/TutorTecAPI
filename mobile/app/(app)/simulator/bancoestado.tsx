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

const ACCENT = '#d32f2f'; // BancoEstado rojo

const STEPS = [
  { instruction: 'Toca "Ver saldo" para consultar tu cuenta', hint: 'El botón azul oscuro de la parte superior' },
  { instruction: 'Ahora toca "Transferir" para enviar dinero', hint: 'Es el segundo botón grande' },
  { instruction: 'Ingresa el monto a transferir (por ejemplo: 5000)', hint: 'Solo números, sin puntos ni comas' },
  { instruction: 'Toca "Confirmar transferencia" para completar', hint: 'Revisa bien el monto antes de confirmar' },
  { instruction: '🏦 ¡Muy bien! Ya sabes consultar saldo y transferir', hint: undefined },
];

type Screen = 'home' | 'balance' | 'transfer' | 'confirm' | 'done';

export default function BancoEstadoSimulator() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState<Screen>('home');
  const [amount, setAmount] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    simulatorSession.start('bancoestado')
      .then(({ data }) => setSessionId(data.id))
      .catch(() => {});
  }, []);

  async function advance() {
    if (!sessionId) return;
    const next = step + 1;

    if (step === 0 && screen !== 'balance') {
      Alert.alert('👆', 'Primero toca "Ver saldo"');
      return;
    }
    if (step === 1 && screen !== 'transfer') {
      Alert.alert('💸', 'Toca el botón "Transferir"');
      return;
    }
    if (step === 2 && !amount.trim()) {
      Alert.alert('🔢', 'Ingresa el monto a transferir');
      return;
    }
    if (step === 3 && screen !== 'done') {
      Alert.alert('✅', 'Toca "Confirmar transferencia"');
      return;
    }

    setSaving(true);
    if (next >= STEPS.length) {
      await simulatorSession.complete(sessionId).catch(() => {});
      setSaving(false);
      Alert.alert('🏆 ¡Completado!', '¡Ya sabes usar BancoEstado en línea!', [
        { text: '¡Genial!', onPress: () => router.back() },
      ]);
    } else {
      await simulatorSession.update(sessionId, next).catch(() => {});
      setSaving(false);
      setStep(next);
    }
  }

  return (
    <SimulatorShell title="BancoEstado" module="Banca" accentColor={ACCENT}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Home / menú principal */}
        {(screen === 'home' || screen === 'balance' || screen === 'transfer') && (
          <View style={styles.card}>
            <View style={[styles.bankHeader, { backgroundColor: ACCENT }]}>
              <Text style={styles.bankHeaderText}>🏦 BancoEstado</Text>
              <Text style={styles.bankAccountText}>Cuenta RUT  •  ••• 4821</Text>
            </View>

            <View style={styles.menuGrid}>
              <Pressable
                style={[styles.menuBtn, screen === 'balance' && styles.menuBtnActive]}
                onPress={() => { if (step === 0) setScreen('balance'); }}
              >
                <Text style={styles.menuIcon}>💰</Text>
                <Text style={styles.menuLabel}>Ver saldo</Text>
              </Pressable>

              <Pressable
                style={[styles.menuBtn, screen === 'transfer' && styles.menuBtnActive]}
                onPress={() => { if (step === 1) setScreen('transfer'); }}
              >
                <Text style={styles.menuIcon}>↗️</Text>
                <Text style={styles.menuLabel}>Transferir</Text>
              </Pressable>

              <View style={[styles.menuBtn, { opacity: 0.4 }]}>
                <Text style={styles.menuIcon}>📄</Text>
                <Text style={styles.menuLabel}>Cartola</Text>
              </View>

              <View style={[styles.menuBtn, { opacity: 0.4 }]}>
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuLabel}>Configurar</Text>
              </View>
            </View>
          </View>
        )}

        {/* Pantalla de saldo */}
        {screen === 'balance' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Saldo disponible</Text>
            <Text style={styles.balanceAmount}>$ 847.320</Text>
            <Text style={styles.balanceLabel}>Cuenta RUT</Text>
            <View style={styles.divider} />
            <Text style={styles.balanceNote}>
              💡 Este saldo es simulado — no es dinero real
            </Text>
          </View>
        )}

        {/* Pantalla de transferencia */}
        {(screen === 'transfer' || screen === 'done') && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nueva transferencia</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Destinatario</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>María González (hija)</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Banco destino</Text>
              <View style={styles.fieldValue}>
                <Text style={styles.fieldValueText}>BancoEstado</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Monto ($)</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Ej: 5000"
                placeholderTextColor={colors.textMuted}
                style={styles.amountInput}
                keyboardType="numeric"
                editable={step === 2 && screen !== 'done'}
              />
            </View>

            {screen !== 'done' && (
              <Pressable
                style={[styles.confirmBtn, { backgroundColor: ACCENT }, !amount.trim() && styles.btnDisabled]}
                onPress={() => {
                  if (amount.trim() && step === 3) {
                    setScreen('done');
                  }
                }}
              >
                <Text style={styles.confirmBtnText}>Confirmar transferencia</Text>
              </Pressable>
            )}

            {screen === 'done' && (
              <View style={styles.successBox}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successText}>
                  Transferencia de ${amount} enviada correctamente
                </Text>
              </View>
            )}
          </View>
        )}
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
  bankHeader: {
    padding: spacing.md,
    gap: 4,
  },
  bankHeaderText: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: colors.white },
  bankAccountText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.white, opacity: 0.85 },
  menuGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: spacing.sm, gap: spacing.sm,
  },
  menuBtn: {
    width: '47%',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  menuBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  menuIcon: { fontSize: 28 },
  menuLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textPrimary },
  sectionTitle: {
    fontFamily: fontFamily.bold, fontSize: fontSize.xl,
    color: colors.textPrimary, padding: spacing.md, paddingBottom: 0,
  },
  balanceAmount: {
    fontFamily: fontFamily.bold, fontSize: fontSize['4xl'],
    color: colors.textPrimary, textAlign: 'center',
    marginTop: spacing.sm,
  },
  balanceLabel: {
    fontFamily: fontFamily.regular, fontSize: fontSize.sm,
    color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm,
  },
  divider: { height: 1, backgroundColor: colors.gray100, marginHorizontal: spacing.md },
  balanceNote: {
    fontFamily: fontFamily.regular, fontSize: fontSize.sm,
    color: colors.textMuted, textAlign: 'center',
    padding: spacing.md,
  },
  fieldGroup: { padding: spacing.md, paddingBottom: 0, gap: spacing.xs },
  fieldLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  fieldValue: {
    height: 48, backgroundColor: colors.gray100,
    borderRadius: radius.md, justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  fieldValueText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  amountInput: {
    height: 48, backgroundColor: colors.gray100,
    borderRadius: radius.md, paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary,
    borderWidth: 2, borderColor: colors.primary,
  },
  confirmBtn: {
    margin: spacing.md, height: 56, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.white },
  successBox: {
    margin: spacing.md, padding: spacing.md,
    backgroundColor: '#e8f5e9', borderRadius: radius.md,
    alignItems: 'center', gap: spacing.sm,
  },
  successIcon: { fontSize: 36 },
  successText: {
    fontFamily: fontFamily.medium, fontSize: fontSize.base,
    color: '#2e7d32', textAlign: 'center',
  },
});
