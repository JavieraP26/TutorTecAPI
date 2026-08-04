/**
 * ProfileHeader — avatar con iniciales, nombre y teléfono enmascarado.
 */
import { StyleSheet, Text, View } from 'react-native';
import type { UserProfile } from '@/hooks/useProfile';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

function initials(name: string | null, phone: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return phone.slice(-2);
}

function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return `+56 ••• ••• ${phone.slice(-4)}`;
}

interface Props {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: Props) {
  const letters = initials(profile.full_name, profile.phone_number);
  const displayName = profile.full_name ?? 'Sin nombre';
  const phone = maskPhone(profile.phone_number);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{letters}</Text>
      </View>
      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.phone}>{phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    color: colors.white,
  },
  name: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    color: colors.textPrimary,
  },
  phone: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
});
