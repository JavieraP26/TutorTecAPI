import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditableField } from '@/components/profile/EditableField';
import { DurationPicker } from '@/components/profile/DurationPicker';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const REMINDER_HOURS = [7, 9, 12, 15, 18, 20];

function formatHour(h: number): string {
  const period = h < 12 ? 'AM' : 'PM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

export default function ProfileScreen() {
  const { profile, loading, error, update } = useProfile();
  const { logout } = useAuth();

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  }

  async function handleNameSave(val: string) {
    if (!val.trim()) return;
    try {
      await update({ full_name: val.trim() });
    } catch {
      Alert.alert('Error', 'No se pudo guardar el nombre.');
    }
  }

  async function handleAgeSave(val: string) {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 18 || num > 120) {
      Alert.alert('Edad inválida', 'Ingresa una edad entre 18 y 120 años.');
      return;
    }
    try {
      await update({ age: num });
    } catch {
      Alert.alert('Error', 'No se pudo guardar la edad.');
    }
  }

  async function handleCitySave(val: string) {
    try {
      await update({ city: val.trim() || null });
    } catch {
      Alert.alert('Error', 'No se pudo guardar la ciudad.');
    }
  }

  async function handleDuration(val: number) {
    try {
      await update({ preferred_lesson_duration: val });
    } catch {
      Alert.alert('Error', 'No se pudo guardar la preferencia.');
    }
  }

  async function handleRemindersToggle(val: boolean) {
    try {
      await update({ reminders_enabled: val });
    } catch {
      Alert.alert('Error', 'No se pudo cambiar la configuración.');
    }
  }

  async function handleReminderHour(h: number) {
    try {
      await update({ reminder_hour: h });
    } catch {
      Alert.alert('Error', 'No se pudo guardar la hora.');
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Cargando perfil…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudo cargar el perfil.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader profile={profile} />

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información personal</Text>
          <View style={styles.card}>
            <EditableField
              label="Nombre"
              value={profile.full_name ?? ''}
              placeholder="Sin nombre"
              maxLength={80}
              onSave={handleNameSave}
            />
            <EditableField
              label="Edad"
              value={profile.age != null ? String(profile.age) : ''}
              placeholder="—"
              keyboardType="numeric"
              maxLength={3}
              onSave={handleAgeSave}
            />
            <EditableField
              label="Ciudad"
              value={profile.city ?? ''}
              placeholder="—"
              maxLength={60}
              onSave={handleCitySave}
            />
            <View style={[styles.readonlyRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.readonlyLabel}>Teléfono</Text>
              <Text style={styles.readonlyValue}>
                +56 ••• ••• {profile.phone_number.slice(-4)}
              </Text>
              <Text style={styles.readonlyNote}>No editable</Text>
            </View>
          </View>
        </View>

        {/* Preferencias de lección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duración de lección</Text>
          <Text style={styles.sectionDesc}>
            Cuánto tiempo quieres dedicar a cada lección
          </Text>
          <DurationPicker
            value={profile.preferred_lesson_duration}
            onChange={handleDuration}
          />
        </View>

        {/* Recordatorios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recordatorios</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>Recordatorio diario</Text>
                <Text style={styles.switchDesc}>Te avisaremos para que practiques</Text>
              </View>
              <Switch
                value={profile.reminders_enabled}
                onValueChange={handleRemindersToggle}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            {profile.reminders_enabled && (
              <View style={styles.hoursSection}>
                <Text style={styles.hoursTitle}>Hora del recordatorio</Text>
                <View style={styles.hoursRow}>
                  {REMINDER_HOURS.map((h) => {
                    const active = profile.reminder_hour === h;
                    return (
                      <Pressable
                        key={h}
                        style={[styles.hourChip, active && styles.hourChipActive]}
                        onPress={() => handleReminderHour(h)}
                      >
                        <Text style={[styles.hourText, active && styles.hourTextActive]}>
                          {formatHour(h)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Mi progreso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi progreso</Text>
          <View style={styles.card}>
            <Pressable
              style={styles.linkRow}
              onPress={() => router.push('/(app)/achievements' as any)}
            >
              <Text style={styles.linkIcon}>🏆</Text>
              <Text style={styles.linkText}>Ver mis logros</Text>
              <Text style={styles.linkChevron}>›</Text>
            </Pressable>
            <Pressable
              style={[styles.linkRow, { borderBottomWidth: 0 }]}
              onPress={() => router.push('/(app)/journey' as any)}
            >
              <Text style={styles.linkIcon}>🎓</Text>
              <Text style={styles.linkText}>Mi camino y graduación</Text>
              <Text style={styles.linkChevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Cerrar sesión */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textMuted },
  errorText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.error },
  content: { paddingBottom: spacing.xl },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  sectionDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: -4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  readonlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    gap: spacing.sm,
    minHeight: 56,
  },
  readonlyLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    width: 96,
  },
  readonlyValue: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    flex: 1,
  },
  readonlyNote: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  switchLabel: { flex: 1, gap: 2 },
  switchTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  switchDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  hoursSection: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: spacing.sm,
  },
  hoursTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  hoursRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  hourChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    backgroundColor: colors.gray100,
  },
  hourChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  hourText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  hourTextActive: { color: colors.primary },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    gap: spacing.sm,
    minHeight: 56,
  },
  linkIcon: { fontSize: 22 },
  linkText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    flex: 1,
  },
  linkChevron: {
    fontSize: 22,
    color: colors.textMuted,
  },
  logoutBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.error,
  },
});
