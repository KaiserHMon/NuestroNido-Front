'use client';

import { MemberColor } from '@/lib/types';
import { getColorInlineStyle } from '@/lib/colors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MemberAvatarProps {
  name: string;
  color: MemberColor;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export function MemberAvatar({
  name,
  color,
  imageUrl,
  size = 'md',
  className = '',
  style: externalStyle,
}: MemberAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const fallbackStyle = color.bg
    ? { backgroundColor: color.bg, color: color.text }
    : getColorInlineStyle(color.id);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`} style={externalStyle}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback
        className="flex h-full w-full items-center justify-center font-bold"
        style={fallbackStyle}
        title={name}
        aria-label={`Avatar de ${name}`}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
