import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LessonCard } from '@/components/academy/LessonCard';
import { AreaFilter } from '@/components/academy/AreaFilter';
import { useAcademy, type ContentArea } from '@/hooks/useAcademy';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function AcademyScreen() {
  const [area, setArea] = useState<ContentArea | null>(null);
  const { lessons, loading, error } = useAcademy(area);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Academia</Text>
        <Text style={styles.subtitle}>Aprende a tu ritmo</Text>
      </View>

      {/* Filtro de áreas */}
      <AreaFilter selected={area} onSelect={setArea} />

      {/* Lista de lecciones */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudo cargar el catálogo.</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LessonCard
              lesson={item}
              onPress={() => router.push({ pathname: '/(app)/lesson/[id]', params: { id: item.id } })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No hay lecciones en esta área todavía.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
