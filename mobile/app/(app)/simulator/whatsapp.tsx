import { useEffect, useRef, useState } from 'react';
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

const STEPS = [
  { instruction: 'Toca en el chat de María para abrirlo', hint: 'Es el primer mensaje de la lista' },
  { instruction: 'Toca la barra blanca y escribe un mensaje', hint: 'Por ejemplo: "Hola hija, ¿cómo estás?"' },
  { instruction: 'Toca el botón verde para enviar el mensaje', hint: 'Es el botón redondo a la derecha' },
  { instruction: '¡Muy bien! Enviaste tu primer mensaje por WhatsApp 🎉', hint: undefined },
];

const FAKE_MESSAGES = [
  { text: 'Hola mamá, ¿cómo estás?', time: '10:45', mine: false },
  { text: 'Te envío foto del nieto 😊', time: '10:46', mine: false },
];

export default function WhatsAppSimulator() {
  const [step, setStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    simulatorSession.start('whatsapp')
      .then(({ data }) => setSessionId(data.id))
      .catch(() => {});
  }, []);

  async function advance() {
    if (!sessionId) return;
    const next = step + 1;

    if (step === 0 && !chatOpen) {
      Alert.alert('👆', 'Primero toca el chat de María');
      return;
    }
    if (step === 1 && !message.trim()) {
      Alert.alert('✏️', 'Escribe algo en la barra de mensaje');
      return;
    }
    if (step === 2 && !sent) {
      Alert.alert('📤', 'Toca el botón verde de enviar');
      return;
    }

    setSaving(true);
    if (next >= STEPS.length) {
      await simulatorSession.complete(sessionId).catch(() => {});
      setSaving(false);
      Alert.alert('🏆 ¡Completado!', '¡Ya sabes enviar mensajes por WhatsApp!', [
        { text: '¡Genial!', onPress: () => router.back() },
      ]);
    } else {
      await simulatorSession.update(sessionId, next).catch(() => {});
      setSaving(false);
      setStep(next);
    }
  }

  return (
    <SimulatorShell title="WhatsApp" module="Mensajería" accentColor={colors.whatsapp}>
      <View style={styles.container}>
        {!chatOpen ? (
          /* Lista de chats */
          <ScrollView style={styles.chatList}>
            <Pressable style={styles.chatRow} onPress={() => { setChatOpen(true); setStep(1); }}>
              <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
              <View style={styles.chatInfo}>
                <Text style={styles.contactName}>María (hija)</Text>
                <Text style={styles.lastMsg} numberOfLines={1}>Te envío foto del nieto 😊</Text>
              </View>
              <Text style={styles.chatTime}>10:46</Text>
            </Pressable>
            <View style={[styles.chatRow, { opacity: 0.4 }]}>
              <View style={[styles.avatar, { backgroundColor: '#7986cb' }]}><Text style={styles.avatarText}>J</Text></View>
              <View style={styles.chatInfo}>
                <Text style={styles.contactName}>Juan (vecino)</Text>
                <Text style={styles.lastMsg}>Buenas tardes</Text>
              </View>
              <Text style={styles.chatTime}>Ayer</Text>
            </View>
          </ScrollView>
        ) : (
          /* Conversación */
          <View style={styles.conversation}>
            <View style={[styles.convHeader, { backgroundColor: colors.whatsapp }]}>
              <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
              <View>
                <Text style={styles.convName}>María (hija)</Text>
                <Text style={styles.convStatus}>en línea</Text>
              </View>
            </View>

            <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
              {FAKE_MESSAGES.map((m, i) => (
                <View key={i} style={[styles.bubble, m.mine ? styles.bubbleMine : styles.bubbleTheir]}>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                  <Text style={styles.bubbleTime}>{m.time}</Text>
                </View>
              ))}
              {sent && (
                <View style={[styles.bubble, styles.bubbleMine]}>
                  <Text style={styles.bubbleText}>{message}</Text>
                  <Text style={styles.bubbleTime}>Ahora ✓✓</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputBar}>
              <TextInput
                ref={inputRef}
                value={message}
                onChangeText={setMessage}
                placeholder="Escribe un mensaje"
                placeholderTextColor={colors.textMuted}
                style={styles.messageInput}
                editable={step === 1 || step === 2}
                onFocus={() => step === 1 && setStep(2)}
              />
              <Pressable
                style={[styles.sendBtn, { backgroundColor: message.trim() ? colors.whatsapp : colors.gray300 }]}
                onPress={() => { if (message.trim() && step === 2) { setSent(true); setStep(3); } }}
              >
                <Text style={styles.sendIcon}>▶</Text>
              </Pressable>
            </View>
          </View>
        )}
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
  container: { flex: 1, backgroundColor: colors.whatsappBg },
  chatList: { flex: 1, backgroundColor: colors.surface },
  chatRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.gray100,
  },
  avatar: {
    width: 52, height: 52, borderRadius: radius.full,
    backgroundColor: colors.whatsapp, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: colors.white },
  chatInfo: { flex: 1 },
  contactName: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.textPrimary },
  lastMsg: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textMuted },
  chatTime: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textMuted },
  conversation: { flex: 1 },
  convHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
  },
  convName: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.white },
  convStatus: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.white, opacity: 0.85 },
  messages: { flex: 1 },
  messagesContent: { padding: spacing.md, gap: spacing.sm },
  bubble: {
    maxWidth: '75%', padding: spacing.sm,
    borderRadius: radius.md, gap: 2,
  },
  bubbleTheir: { backgroundColor: colors.surface, alignSelf: 'flex-start', borderRadius: radius.md },
  bubbleMine: { backgroundColor: '#dcf8c6', alignSelf: 'flex-end' },
  bubbleText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  bubbleTime: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textMuted, textAlign: 'right' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, padding: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.gray200,
  },
  messageInput: {
    flex: 1, height: 44, backgroundColor: colors.gray100,
    borderRadius: radius.full, paddingHorizontal: spacing.md,
    fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  sendIcon: { fontSize: 18, color: colors.white },
});
