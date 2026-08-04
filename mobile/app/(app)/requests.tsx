import { useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RequestCard } from '@/components/journey/RequestCard';
import { useRequests } from '@/hooks/useRequests';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

export default function RequestsScreen() {
  const { requests, loading, error, vote, create, reload } = useRequests();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  async function handleVote(id: string) {
    setVotingId(id);
    try {
      await vote(id);
    } catch {
      Alert.alert('Error', 'No se pudo registrar tu voto. Intenta de nuevo.');
    } finally {
      setVotingId(null);
    }
  }

  async function handleCreate() {
    if (description.trim().length < 10) {
      Alert.alert('✏️', 'Describe tu petición con al menos 10 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      const result = await create(description.trim(), category.trim() || undefined);
      setDescription('');
      setCategory('');
      setShowForm(false);
      if (result.similar_found && result.similar_found.similarity_pct >= 70) {
        Alert.alert(
          '¿Sabías que…?',
          `Hay una petición similar con ${result.similar_found.votes} votos. ¡Apóyala para que llegue antes!`,
        );
      } else {
        Alert.alert('✅ ¡Recibida!', 'Tu petición fue registrada. Otros usuarios pueden apoyarla.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo enviar la petición. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Peticiones</Text>
          <Text style={styles.subtitle}>Propón y apoya nuevos temas</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            setShowForm((v) => !v);
            if (!showForm) setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+ Nueva'}</Text>
        </Pressable>
      </View>

      {/* Formulario de nueva petición */}
      {showForm && (
        <View style={styles.form}>
          <TextInput
            ref={inputRef}
            value={description}
            onChangeText={setDescription}
            placeholder="¿Qué quieres aprender? (mínimo 10 caracteres)"
            placeholderTextColor={colors.textMuted}
            style={styles.textArea}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Categoría (opcional, ej: Banca)"
            placeholderTextColor={colors.textMuted}
            style={styles.categoryInput}
          />
          <View style={styles.formActions}>
            <Text style={styles.charCount}>{description.length}/500</Text>
            <Pressable
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleCreate}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? 'Enviando…' : 'Enviar petición'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudieron cargar las peticiones.</Text>
          <Pressable style={styles.retryBtn} onPress={reload}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onVote={handleVote}
              voting={votingId === item.id}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>
                Sé el primero en proponer un tema de aprendizaje
              </Text>
            </View>
          }
          ListHeaderComponent={
            requests.length > 0 ? (
              <Text style={styles.listHeader}>
                {requests.length} petición{requests.length !== 1 ? 'es' : ''} de la comunidad
              </Text>
            ) : null
          }
        />
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
  addBtn: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  addBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.white,
  },
  form: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.md,
    gap: spacing.sm,
  },
  textArea: {
    minHeight: 96,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  categoryInput: {
    height: 48,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  formActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  submitBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  submitBtnDisabled: { opacity: 0.55 },
  submitBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.white,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  errorText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.error },
  retryBtn: { marginTop: spacing.md },
  retryText: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.primary },
  list: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  listHeader: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
