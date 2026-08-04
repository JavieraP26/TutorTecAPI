import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RequestCard } from '@/components/journey/RequestCard';
import type { LearningRequest } from '@/hooks/useRequests';

const base: LearningRequest = {
  id: 'req-1',
  description: 'Quiero aprender a usar el cajero automático',
  category: 'Banca',
  votes: 12,
  status: 'received',
  is_mine: false,
  already_voted: false,
  created_at: '2024-06-01T10:00:00Z',
};

describe('RequestCard', () => {
  it('muestra la descripción de la petición', () => {
    const { getByText } = render(
      <RequestCard request={base} onVote={jest.fn()} />,
    );
    expect(getByText('Quiero aprender a usar el cajero automático')).toBeTruthy();
  });

  it('muestra el conteo de votos', () => {
    const { getByText } = render(
      <RequestCard request={base} onVote={jest.fn()} />,
    );
    expect(getByText('👍 12 votos')).toBeTruthy();
  });

  it('muestra la categoría cuando existe', () => {
    const { getByText } = render(
      <RequestCard request={base} onVote={jest.fn()} />,
    );
    expect(getByText('Banca')).toBeTruthy();
  });

  it('muestra el estado "Recibida" correctamente', () => {
    const { getByText } = render(
      <RequestCard request={base} onVote={jest.fn()} />,
    );
    expect(getByText('Recibida')).toBeTruthy();
  });

  it('muestra "En desarrollo" para status in_development', () => {
    const { getByText } = render(
      <RequestCard request={{ ...base, status: 'in_development' }} onVote={jest.fn()} />,
    );
    expect(getByText('En desarrollo')).toBeTruthy();
  });

  it('llama onVote con el id correcto al presionar Apoyar', () => {
    const onVote = jest.fn();
    const { getByText } = render(
      <RequestCard request={base} onVote={onVote} />,
    );
    fireEvent.press(getByText('Apoyar'));
    expect(onVote).toHaveBeenCalledWith('req-1');
  });

  it('muestra "✓ Apoyada" cuando already_voted es true', () => {
    const { getByText } = render(
      <RequestCard request={{ ...base, already_voted: true }} onVote={jest.fn()} />,
    );
    expect(getByText('✓ Apoyada')).toBeTruthy();
  });

  it('no llama onVote cuando already_voted es true', () => {
    const onVote = jest.fn();
    const { getByText } = render(
      <RequestCard request={{ ...base, already_voted: true }} onVote={onVote} />,
    );
    fireEvent.press(getByText('✓ Apoyada'));
    expect(onVote).not.toHaveBeenCalled();
  });

  it('no llama onVote en peticiones propias (is_mine)', () => {
    const onVote = jest.fn();
    const { getByText } = render(
      <RequestCard request={{ ...base, is_mine: true }} onVote={onVote} />,
    );
    fireEvent.press(getByText('Apoyar'));
    expect(onVote).not.toHaveBeenCalled();
  });

  it('muestra badge "Mía" para peticiones propias', () => {
    const { getByText } = render(
      <RequestCard request={{ ...base, is_mine: true }} onVote={jest.fn()} />,
    );
    expect(getByText('Mía')).toBeTruthy();
  });

  it('muestra "1 voto" en singular', () => {
    const { getByText } = render(
      <RequestCard request={{ ...base, votes: 1 }} onVote={jest.fn()} />,
    );
    expect(getByText('👍 1 voto')).toBeTruthy();
  });
});
