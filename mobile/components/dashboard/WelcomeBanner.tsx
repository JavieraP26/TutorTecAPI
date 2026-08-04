import { StyleSheet, Text, View } from 'react-native';
import type { WelcomeContext } from '@/hooks/useWelcome';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize, lineHeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface Props {
  name: string;
  welcome: WelcomeContext | null;
}

function buildGreeting(name: string, welcome: WelcomeContext | null): { title: string; subtitle: string } {
  const first = name ? name.split(' ')[0] : '';

  if (!welcome) {
    return { title: `Hola${first ? `, ${first}` : ''}`, subtitle: 'Bienvenida a TutorTec' };
  }

  if (!welcome.returning) {
    return {
      title: `¡Bienvenida${first ? `, ${first}` : ''}! 🎉`,
      subtitle: 'Estamos muy contentos de que estés aquí. Empecemos juntos.',
    };
  }

  const days = welcome.days_since_last_visit;
  if (days === null || days === 0) {
    return {
      title: `¡Hola de nuevo${first ? `, ${first}` : ''}! 👋`,
      subtitle: `Llevas ${welcome.total_active_days} ${welcome.total_active_days === 1 ? 'día' : 'días'} aprendiendo. ¡Sigue así!`,
    };
  }

  if (days === 1) {
    return {
      title: `¡Qué bueno verte, ${first || 'amiga'}!`,
      subtitle: 'Ayer no pudiste entrar, pero hoy estás aquí. ¡Eso es lo que importa!',
    };
  }

  return {
    title: `¡Qué alegría verte, ${first || 'amiga'}! 😊`,
    subtitle: `Han pasado ${days} días. Sin apuro, aquí te esperábamos.`,
  };
}

export function WelcomeBanner({ name, welcome }: Props) {
  const { title, subtitle } = buildGreeting(name, welcome);

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.textSecondary,
  },
});
