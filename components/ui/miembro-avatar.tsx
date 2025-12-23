'use client';

import { ColorMiembro } from '@/lib/types';
import { getColorInlineStyle } from '@/lib/colors';

interface MiembroAvatarProps {
  nombre: string;
  color: ColorMiembro;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MiembroAvatar({ nombre, color, size = 'md', className = '' }: MiembroAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
      style={getColorInlineStyle(color.id)}
      title={nombre}
      role="img"
      aria-label={`Avatar de ${nombre}, color ${color.nombre}`}
    >
      {initials}
    </div>
  );
}
