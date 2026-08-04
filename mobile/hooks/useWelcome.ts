import { useEffect, useState } from 'react';
import api from '@/lib/api';

export interface WelcomeContext {
  returning: boolean;
  days_since_last_visit: number | null;
  total_active_days: number;
  first_visit_date: string | null;
}

interface State {
  data: WelcomeContext | null;
  loading: boolean;
  error: boolean;
}

export function useWelcome() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: false });

  useEffect(() => {
    api
      .get<WelcomeContext>('/progress/welcome')
      .then((r) => setState({ data: r.data, loading: false, error: false }))
      .catch(() => setState({ data: null, loading: false, error: true }));
  }, []);

  return state;
}
