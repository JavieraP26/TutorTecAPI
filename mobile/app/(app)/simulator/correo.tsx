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

const ACCENT = '#1565c0'; // Gmail-like blue

const STEPS = [
  { instruction: 'Toca el correo de tu hija para leerlo', hint: 'Es el primer mensaje de la bandeja' },
  { instruction: 'Toca "Responder" para contestar el mensaje', hint: 'El botón con flecha curva ↩' },
  { instruction: 'Escribe tu respuesta en el área de texto', hint: 'Por ejemplo: "Hola hija, muy bien gracias!"' },
  { instruction: 'Toca "Enviar" para mandar tu respuesta', hint: 'El botón azul con el ícono ✉️' },
  { instruction: '📧 ¡Excelente! Ya sabes leer y responder correos', hint: undefined },
];

const INBOX = [
  {
    from: 'María González (hija)',
    email: 'maria@ejemplo.cl',
    subject: '¿Cómo estás, mamá?',
    preview: 'Hola mamá, te escribo para saber cómo...',
    time: '10:32',
    body: 'Hola mamá,\n\nTe escribo para saber cómo estás. Mañana podría ir a visitarte si quieres.\n\n¿Tienes algo que necesites?\n\nTe quiero mucho,\nMaría 💖',
  },
];

type Screen = 'inbox' | 'read' | 'reply' | 'sent';

export default function CorreoSimulator() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState<Screen>('inbox');
  const [replyText, setReplyText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    simulatorSession.start('correo')
      .then(({ data }) => setSessionId(data.id))
      .catch(() => {});
  }, []);

  async function advance() {
    if (!sessionId) return;
    const next = step + 1;

    if (step === 0 && screen !== 'read') {
      Alert.alert('👆', 'Primero toca el correo de tu hija para leerlo');
      return;
    }
    if (step === 1 && screen !== 'reply') {
      Alert.alert('↩️', 'Toca el botón "Responder"');
      return;
    }
    if (step === 2 && !replyText.trim()) {
      Alert.alert('✏️', 'Escribe tu respuesta antes de continuar');
      return;
    }
    if (step === 3 && screen !== 'sent') {
      Alert.alert('📤', 'Toca el botón "Enviar" para mandar el correo');
      return;
    }

    setSaving(true);
    if (next >= STEPS.length) {
      await simulatorSession.complete(sessionId).catch(() => {});
      setSaving(false);
      Alert.alert('🏆 ¡Completado!', '¡Ya sabes leer y responder correos!', [
        { text: '¡Genial!', onPress: () => router.back() },
      ]);
    } else {
      await simulatorSession.update(sessionId, next).catch(() => {});
      setSaving(false);
      setStep(next);
    }
  }

  const mail = INBOX[0];

  return (
    <SimulatorShell title="Correo" module="Comunicación" accentColor={ACCENT}>
      <View style={styles.container}>
        {/* Header barra de correo */}
        <View style={[styles.mailHeader, { backgroundColor: ACCENT }]}>
          <Text style={styles.mailHeaderTitle}>
            {screen === 'inbox' ? '📬 Bandeja de entrada' :
             screen === 'read' ? '📧 Mensaje' :
             screen === 'reply' ? '↩️ Responder' :
             '✅ Enviado'}
          </Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

          {/* Bandeja de entrada */}
          {screen === 'inbox' && (
            <Pressable
              style={styles.mailRow}
              onPress={() => { if (step === 0) { setScreen('read'); setStep(1); } }}
            >
              <View style={[styles.senderAvatar, { backgroundColor: ACCENT }]}>
                <Text style={styles.senderAvatarText}>M</Text>
              </View>
              <View style={styles.mailRowBody}>
                <View style={styles.mailRowTop}>
                  <Text style={styles.senderName}>{mail.from}</Text>
                  <Text style={styles.mailTime}>{mail.time}</Text>
                </View>
                <Text style={styles.mailSubject}>{mail.subject}</Text>
                <Text style={styles.mailPreview} numberOfLines={1}>{mail.preview}</Text>
              </View>
              <View style={styles.unreadDot} />
            </Pressable>
          )}

          {/* Leer mensaje */}
          {(screen === 'read' || screen === 'reply' || screen === 'sent') && (
            <View style={styles.messageView}>
              <Text style={styles.msgSubject}>{mail.subject}</Text>
              <View style={styles.msgFrom}>
                <View style={[styles.senderAvatar, { backgroundColor: ACCENT }]}>
                  <Text style={styles.senderAvatarText}>M</Text>
                </View>
                <View>
                  <Text style={styles.msgFromName}>{mail.from}</Text>
                  <Text style={styles.msgFromEmail}>{mail.email}</Text>
                </View>
              </View>
              <Text style={styles.msgBody}>{mail.body}</Text>

              {screen === 'read' && (
                <Pressable
                  style={[styles.replyBtn, { backgroundColor: ACCENT }]}
                  onPress={() => { if (step === 1) setScreen('reply'); }}
                >
                  <Text style={styles.replyBtnText}>↩️  Responder</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Área de respuesta */}
          {(screen === 'reply' || screen === 'sent') && (
            <View style={styles.replyView}>
              <View style={styles.replyToRow}>
                <Text style={styles.replyToLabel}>Para:</Text>
                <Text style={styles.replyToValue}>{mail.email}</Text>
              </View>
              <View style={styles.replyToRow}>
                <Text style={styles.replyToLabel}>Asunto:</Text>
                <Text style={styles.replyToValue}>Re: {mail.subject}</Text>
              </View>

              {screen === 'reply' ? (
                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholder="Escribe tu respuesta aquí..."
                  placeholderTextColor={colors.textMuted}
                  style={styles.replyInput}
                  multiline
                  editable={step === 2 || step === 3}
                  textAlignVertical="top"
                />
              ) : (
                <View style={styles.sentTextBox}>
                  <Text style={styles.sentText}>{replyText}</Text>
                </View>
              )}

              {screen === 'reply' && (
                <Pressable
                  style={[
                    styles.sendEmailBtn,
                    { backgroundColor: ACCENT },
                    !replyText.trim() && styles.btnDisabled,
                  ]}
                  onPress={() => {
                    if (replyText.trim() && step === 3) setScreen('sent');
                  }}
                >
                  <Text style={styles.sendEmailBtnText}>✉️  Enviar</Text>
                </Pressable>
              )}

              {screen === 'sent' && (
                <View style={styles.sentBanner}>
                  <Text style={styles.sentBannerText}>✅ Correo enviado correctamente</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

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
  container: { flex: 1, backgroundColor: colors.background },
  mailHeader: { padding: spacing.md },
  mailHeaderTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  mailRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  senderAvatar: {
    width: 48, height: 48, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  senderAvatarText: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: colors.white },
  mailRowBody: { flex: 1, gap: 2 },
  mailRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  senderName: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.textPrimary },
  mailTime: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textMuted },
  mailSubject: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textPrimary },
  mailPreview: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textMuted },
  unreadDot: {
    width: 10, height: 10, borderRadius: radius.full,
    backgroundColor: colors.primary, flexShrink: 0,
  },
  messageView: {
    backgroundColor: colors.surface, padding: spacing.md, gap: spacing.md,
  },
  msgSubject: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: colors.textPrimary },
  msgFrom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  msgFromName: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.textPrimary },
  msgFromEmail: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textMuted },
  msgBody: {
    fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary,
    lineHeight: 24, backgroundColor: colors.background,
    padding: spacing.md, borderRadius: radius.md,
  },
  replyBtn: {
    height: 52, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  replyBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.white },
  replyView: {
    backgroundColor: colors.surface, padding: spacing.md, gap: spacing.sm,
    marginTop: 1,
  },
  replyToRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  replyToLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textMuted, width: 56 },
  replyToValue: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary, flex: 1 },
  replyInput: {
    minHeight: 120, backgroundColor: colors.gray100,
    borderRadius: radius.md, padding: spacing.md,
    fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary,
    borderWidth: 2, borderColor: colors.primary,
  },
  sentTextBox: {
    minHeight: 80, backgroundColor: colors.gray100,
    borderRadius: radius.md, padding: spacing.md,
  },
  sentText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  sendEmailBtn: {
    height: 56, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  sendEmailBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.white },
  sentBanner: {
    padding: spacing.md, backgroundColor: '#e8f5e9', borderRadius: radius.md,
    alignItems: 'center',
  },
  sentBannerText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: '#2e7d32' },
});
