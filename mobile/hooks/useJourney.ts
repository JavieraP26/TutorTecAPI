import { useEffect, useState } from 'react';
import api from '@/lib/api';

export interface AreaProgress {
  initial_score: number | null;
  lessons_completed: number;
  total_lessons: number;
  pct_complete: number;
}

export interface JourneyStatus {
  stage: string;
  areas_progress: Record<string, AreaProgress>;
  achievements_earned: number;
  achievements_total: number;
  achievement_pct: number;
  ready_to_graduate: boolean;
  total_lessons_completed: number;
  total_active_days: number;
  first_visit_date: string | null;
  pending_voted_requests: number;
}

interface State {
  data: JourneyStatus | null;
  loading: boolean;
  error: boolean;
}

export function useJourney() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: false });

  useEffect(() => {
    api
      .get<JourneyStatus>('/journey/status')
      .then((r) => setState({ data: r.data, loading: false, error: false }))
      .catch(() => setState({ data: null, loading: false, error: true }));
  }, []);

  return state;
}
