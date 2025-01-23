import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BetSlider } from './BetSlider';

describe('BetSlider', () => {
  const defaultProps = {
    value: 100,
    onChange: vi.fn(),
    min: 50,
    max: 1000,
  };

  it('renders with correct initial value', () => {
    render(<BetSlider {...defaultProps} />);
    expect(screen.getByText('Current bet: $100')).toBeInTheDocument();
  });

  it('displays min and max values', () => {
    render(<BetSlider {...defaultProps} />);
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('renders quick bet buttons with correct percentages', () => {
    render(<BetSlider {...defaultProps} />);
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    render(<BetSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '200' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith(200);
  });

  it('calls onChange with correct value when clicking quick bet buttons', () => {
    render(<BetSlider {...defaultProps} />);
    
    // Click 50% button
    fireEvent.click(screen.getByText('50%'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(525); // (1000 - 50) * 0.5 + 50

    // Click 100% button
    fireEvent.click(screen.getByText('100%'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(1000);
  });

  it('respects step prop', () => {
    render(<BetSlider {...defaultProps} step={10} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('step', '10');
  });

  it('uses default step of 1 when not provided', () => {
    render(<BetSlider {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('step', '1');
  });

  it('formats large numbers with commas', () => {
    render(
      <BetSlider
        {...defaultProps}
        value={1000000}
        max={10000000}
      />
    );
    expect(screen.getByText('Current bet: $1,000,000')).toBeInTheDocument();
  });

  it('prevents values outside min-max range', () => {
    const { rerender } = render(<BetSlider {...defaultProps} />);

    // Try to set value below min
    rerender(<BetSlider {...defaultProps} value={25} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveValue('50');

    // Try to set value above max
    rerender(<BetSlider {...defaultProps} value={1500} />);
    expect(slider).toHaveValue('1000');
  });

  it('updates slider background gradient based on value', () => {
    render(<BetSlider {...defaultProps} value={500} />);
    const slider = screen.getByRole('slider');
    const expectedPercentage = ((500 - 50) / (1000 - 50)) * 100;
    expect(slider).toHaveStyle({
      background: `linear-gradient(to right, #10B981 0%, #10B981 ${expectedPercentage}%, #374151 ${expectedPercentage}%, #374151 100%)`,
    });
  });
});