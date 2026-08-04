import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface UserProfile {
  id: string;
  phone_number: string;
  full_name: string | null;
  age: number | null;
  city: string | null;
  avatar_url: string | null;
  preferred_lesson_duration: number;
  reminders_enabled: boolean;
  reminder_hour: number;
  journey_stage: string;
  created_at: string;
}

export interface ProfileUpdate {
  full_name?: string | null;
  age?: number | null;
  city?: string | null;
  preferred_lesson_duration?: number;
  reminders_enabled?: boolean;
  reminder_hour?: number;
}

interface State {
  profile: UserProfile | null;
  loading: boolean;
  error: boolean;
}

export function useProfile() {
  const [state, setState] = useState<State>({ profile: null, loading: true, error: false });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: false }));
    api
      .get<UserProfile>('/users/me')
      .then((r) => setState({ profile: r.data, loading: false, error: false }))
      .catch(() => setState({ profile: null, loading: false, error: true }));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function update(data: ProfileUpdate) {
    const r = await api.patch<UserProfile>('/users/me', data);
    setState((s) => ({ ...s, profile: r.data }));
    return r.data;
  }

  return { ...state, reload: load, update };
}
