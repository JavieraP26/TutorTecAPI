import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export type ContentArea = 'comunicacion' | 'banca' | 'seguridad' | 'gobierno' | 'mi_telefono';

export interface LessonSummary {
  id: string;
  title: string;
  content_area: ContentArea;
  module_type: 'simulator' | 'guide' | 'safety' | 'procedure';
  duration_minutes: number;
  thumbnail_url: string | null;
  description: string | null;
  has_exportable_summary: boolean;
  is_available: boolean;
  completion_pct: number;
  completed: boolean;
}

interface State {
  lessons: LessonSummary[];
  loading: boolean;
  error: boolean;
}

export function useAcademy(area: ContentArea | null = null) {
  const [state, setState] = useState<State>({ lessons: [], loading: true, error: false });

  const fetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: false }));
    const params = area ? { content_area: area } : {};
    api
      .get<LessonSummary[]>('/lessons', { params })
      .then((r) => setState({ lessons: r.data, loading: false, error: false }))
      .catch(() => setState({ lessons: [], loading: false, error: true }));
  }, [area]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}
