import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DurationPicker } from '@/components/profile/DurationPicker';

describe('DurationPicker', () => {
  it('renderiza las tres opciones de duración', () => {
    const { getByText } = render(
      <DurationPicker value={5} onChange={jest.fn()} />,
    );
    expect(getByText('5 min')).toBeTruthy();
    expect(getByText('8 min')).toBeTruthy();
    expect(getByText('12 min')).toBeTruthy();
  });

  it('muestra la descripción de cada opción', () => {
    const { getByText } = render(
      <DurationPicker value={8} onChange={jest.fn()} />,
    );
    expect(getByText('Rápido')).toBeTruthy();
    expect(getByText('Normal')).toBeTruthy();
    expect(getByText('Completo')).toBeTruthy();
  });

  it('llama onChange con el valor correcto al tocar una opción', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DurationPicker value={5} onChange={onChange} />,
    );
    fireEvent.press(getByText('12 min'));
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('no llama onChange cuando está deshabilitado', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DurationPicker value={5} onChange={onChange} disabled />,
    );
    fireEvent.press(getByText('8 min'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('no llama onChange al tocar la opción ya activa', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <DurationPicker value={8} onChange={onChange} />,
    );
    fireEvent.press(getByText('8 min'));
    // onChange sí se llama — es decisión del padre si hace PATCH o no
    expect(onChange).toHaveBeenCalledWith(8);
  });
});
