import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';

export type RequestStatus = 'received' | 'in_development' | 'available';

export interface LearningRequest {
  id: string;
  description: string;
  category: string | null;
  votes: number;
  status: RequestStatus;
  is_mine: boolean;
  already_voted: boolean;
  created_at: string;
}

export interface SimilarRequest {
  id: string;
  description: string;
  status: RequestStatus;
  votes: number;
  similarity_pct: number;
}

interface State {
  requests: LearningRequest[];
  loading: boolean;
  error: boolean;
}

export function useRequests() {
  const [state, setState] = useState<State>({ requests: [], loading: true, error: false });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: false }));
    api
      .get<LearningRequest[]>('/requests', { params: { limit: 20 } })
      .then((r) => setState({ requests: r.data, loading: false, error: false }))
      .catch(() => setState({ requests: [], loading: false, error: true }));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function vote(id: string) {
    const r = await api.post<LearningRequest>(`/requests/${id}/vote`);
    setState((s) => ({
      ...s,
      requests: s.requests.map((req) => (req.id === id ? r.data : req)),
    }));
  }

  async function create(description: string, category?: string) {
    const r = await api.post<{ request: LearningRequest; similar_found: SimilarRequest | null }>(
      '/requests',
      { description, category },
    );
    setState((s) => ({ ...s, requests: [r.data.request, ...s.requests] }));
    return r.data;
  }

  return { ...state, reload: load, vote, create };
}
