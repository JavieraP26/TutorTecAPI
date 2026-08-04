import React from 'react';
import { render } from '@testing-library/react-native';
import { AchievementBadge } from '@/components/journey/AchievementBadge';
import type { Achievement } from '@/hooks/useAchievements';

const base: Achievement = {
  id: 'test-id',
  key: 'first_lesson',
  trigger_type: 'lesson_count',
  content_area: null,
  threshold: 1,
  earned: false,
  earned_at: null,
};

describe('AchievementBadge', () => {
  it('muestra 🔒 cuando el logro está bloqueado', () => {
    const { getByText } = render(
      <AchievementBadge achievement={{ ...base, earned: false }} />,
    );
    expect(getByText('🔒')).toBeTruthy();
  });

  it('muestra el emoji correcto cuando está desbloqueado (lesson_count)', () => {
    const { getByText } = render(
      <AchievementBadge achievement={{ ...base, earned: true, earned_at: '2024-01-01T00:00:00Z' }} />,
    );
    expect(getByText('📚')).toBeTruthy();
  });

  it('muestra el emoji de assessment_complete correctamente', () => {
    const { getByText } = render(
      <AchievementBadge
        achievement={{ ...base, trigger_type: 'assessment_complete', earned: true, earned_at: '2024-01-01T00:00:00Z' }}
      />,
    );
    expect(getByText('📋')).toBeTruthy();
  });

  it('usa el emoji del área para area_complete', () => {
    const { getByText } = render(
      <AchievementBadge
        achievement={{
          ...base,
          trigger_type: 'area_complete',
          content_area: 'banca',
          earned: true,
          earned_at: '2024-01-01T00:00:00Z',
        }}
      />,
    );
    expect(getByText('🏦')).toBeTruthy();
  });

  it('muestra el label con threshold para lesson_count', () => {
    const { getByText } = render(
      <AchievementBadge achievement={{ ...base, threshold: 5, earned: false }} />,
    );
    expect(getByText('5 lecciones completadas')).toBeTruthy();
  });

  it('muestra "Evaluación inicial" para assessment_complete', () => {
    const { getByText } = render(
      <AchievementBadge
        achievement={{ ...base, trigger_type: 'assessment_complete', earned: false }}
      />,
    );
    expect(getByText('Evaluación inicial')).toBeTruthy();
  });

  it('muestra "Banca completada" para area_complete con content_area=banca', () => {
    const { getByText } = render(
      <AchievementBadge
        achievement={{
          ...base,
          trigger_type: 'area_complete',
          content_area: 'banca',
          earned: false,
        }}
      />,
    );
    expect(getByText('Banca completada')).toBeTruthy();
  });
});
