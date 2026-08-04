import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface Simulator {
  slug: string;
  name: string;
  emoji: string;
  bg: string;
}

const SIMULATORS: Simulator[] = [
  { slug: 'whatsapp', name: 'WhatsApp', emoji: '💬', bg: '#e8f5e9' },
  { slug: 'bancoestado', name: 'BancoEstado', emoji: '🏦', bg: '#e3f2fd' },
  { slug: 'claveunica', name: 'ClaveÚnica', emoji: '🔑', bg: '#e8eaf6' },
  { slug: 'correo', name: 'Correo', emoji: '📧', bg: '#fff3e0' },
];

interface Props {
  onPress: (slug: string) => void;
}

export function SimulatorsGrid({ onPress }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Practica en Simuladores</Text>
      <View style={styles.grid}>
        {SIMULATORS.map((sim) => (
          <Pressable
            key={sim.slug}
            onPress={() => onPress(sim.slug)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <View style={[styles.iconBox, { backgroundColor: sim.bg }]}>
              <Text style={styles.emoji}>{sim.emoji}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {sim.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: '47%',
    height: 110,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  name: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
});
