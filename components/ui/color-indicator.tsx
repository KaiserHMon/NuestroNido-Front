'use client';

import { MemberColor } from '@/lib/types';
import { getColorInlineStyle } from '@/lib/colors';

interface ColorIndicatorProps {
  color: MemberColor;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dot' | 'square' | 'bar';
  className?: string;
}

export function ColorIndicator({
  color,
  size = 'md',
  variant = 'dot',
  className = '',
}: ColorIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const variantClasses = {
    dot: 'rounded-full',
    square: 'rounded-sm',
    bar: 'rounded-sm',
  };

  if (variant === 'bar') {
    return (
      <div
        className={`${sizeClasses[size]} ${className}`}
        style={{
          ...getColorInlineStyle(color.id),
          height: '4px',
          minHeight: '4px',
        }}
        role="img"
        aria-label={`Indicador de color ${color.name}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={getColorInlineStyle(color.id)}
      role="img"
      aria-label={`Indicador de color ${color.name}`}
    />
  );
}
