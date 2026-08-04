import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface Props {
  stepNumber: number;
  title: string;
  body: string;
  emoji?: string;
}

export function LessonStep({ stepNumber, title, body, emoji }: Props) {
  return (
    <Card padding="lg" style={styles.card}>
      <View style={styles.header}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <View style={styles.titleRow}>
          <Text style={styles.stepLabel}>Paso {stepNumber}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <Text style={styles.body}>{body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  titleRow: {
    flex: 1,
    gap: 2,
  },
  stepLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    color: colors.textSecondary,
  },
});
