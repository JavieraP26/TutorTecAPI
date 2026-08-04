import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { CurrentLessonCard, type CurrentLesson } from '@/components/dashboard/CurrentLessonCard';
import { SimulatorsGrid } from '@/components/dashboard/SimulatorsGrid';
import { AchievementsSummary } from '@/components/dashboard/AchievementsSummary';
import { useWelcome } from '@/hooks/useWelcome';
import { useJourney } from '@/hooks/useJourney';
import api from '@/lib/api';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

interface UserProfile {
  name: string;
}

interface CurrentLessonResponse {
  id: string;
  title: string;
  completion_pct: number;
  remaining_minutes?: number;
}

export default function DashboardScreen() {
  const { data: welcome } = useWelcome();
  const { data: journey } = useJourney();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lesson, setLesson] = useState<CurrentLesson | null>(null);

  useEffect(() => {
    api
      .get<UserProfile>('/users/me')
      .then((r) => setProfile(r.data))
      .catch(() => {});

    api
      .get<CurrentLessonResponse>('/progress/current-lesson')
      .then((r) => setLesson(r.data))
      .catch(() => {});
  }, []);

  function handleSimulator(slug: string) {
    router.push({ pathname: '/(app)/simulators', params: { slug } });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeBanner name={profile?.name ?? ''} welcome={welcome} />

        {lesson && (
          <View style={styles.section}>
            <CurrentLessonCard
              lesson={lesson}
              onPress={() => router.push({ pathname: '/(app)/academy', params: { lessonId: lesson.id } })}
            />
          </View>
        )}

        <View style={styles.section}>
          <SimulatorsGrid onPress={handleSimulator} />
        </View>

        <View style={styles.section}>
          <AchievementsSummary
            earned={journey?.achievements_earned ?? 0}
            total={journey?.achievements_total ?? 14}
            onSeeAll={() => router.push('/(app)/profile')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.lg,
  },
});
