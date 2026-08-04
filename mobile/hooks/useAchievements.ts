import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export type TriggerType = 'lesson_count' | 'area_first' | 'area_complete' | 'assessment_complete';

export interface Achievement {
  id: string;
  key: string;
  trigger_type: TriggerType;
  content_area: string | null;
  threshold: number;
  earned: boolean;
  earned_at: string | null;
}

interface State {
  achievements: Achievement[];
  loading: boolean;
  error: boolean;
}

export function useAchievements() {
  const [state, setState] = useState<State>({ achievements: [], loading: true, error: false });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: false }));
    api
      .get<Achievement[]>('/achievements')
      .then((r) => setState({ achievements: r.data, loading: false, error: false }))
      .catch(() => setState({ achievements: [], loading: false, error: true }));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
