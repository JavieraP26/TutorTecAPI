import { useEffect, useState } from 'react';
import api from '@/lib/api';

export interface Simulator {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  module_type: string;
  content_area: string;
  icon: string | null;
  difficulty: number;
  is_active: boolean;
}

export interface SimulatorSession {
  id: string;
  simulator_id: string;
  steps_completed: number;
  completed: boolean;
}

interface State {
  simulators: Simulator[];
  loading: boolean;
  error: boolean;
}

export function useSimulators() {
  const [state, setState] = useState<State>({ simulators: [], loading: true, error: false });

  useEffect(() => {
    api
      .get<Simulator[]>('/simulators')
      .then((r) => setState({ simulators: r.data.filter((s) => s.is_active), loading: false, error: false }))
      .catch(() => setState({ simulators: [], loading: false, error: true }));
  }, []);

  return state;
}

// Helpers de sesión reutilizables en cada simulador
export const simulatorSession = {
  start: (slug: string) =>
    api.post<SimulatorSession>('/simulators/sessions', { simulator_slug: slug }),
  update: (sessionId: string, steps: number) =>
    api.patch<SimulatorSession>(`/simulators/sessions/${sessionId}`, { steps_completed: steps }),
  complete: (sessionId: string) =>
    api.post<SimulatorSession>(`/simulators/sessions/${sessionId}/complete`),
};
