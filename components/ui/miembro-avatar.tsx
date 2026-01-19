'use client';

import { ColorMiembro } from '@/lib/types';
import { getColorInlineStyle } from '@/lib/colors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MiembroAvatarProps {
  nombre: string;
  color: ColorMiembro;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MiembroAvatar({
  nombre,
  color,
  imageUrl,
  size = 'md',
  className = '',
}: MiembroAvatarProps) {
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

  // If color object has direct hex values, use them. Otherwise fallback to ID lookup.
  const style = color.bg
    ? { backgroundColor: color.bg, color: color.text }
    : getColorInlineStyle(color.id);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {imageUrl && <AvatarImage src={imageUrl} alt={nombre} />}
      <AvatarFallback
        className="flex h-full w-full items-center justify-center font-bold"
        style={style}
        title={nombre}
        aria-label={`Avatar de ${nombre}`}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
